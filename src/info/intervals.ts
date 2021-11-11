import { playerInfo } from "./player";

let staminaInterval: NodeJS.Timeout;
let staminaIntervalInProgress: boolean = false;

// Reduces the specified amount of stamina and starts to replenish it
const spendStamina = (amount: number = 0) => {
    const stamina = playerInfo.stamina;
    // Reduce the stamina
    stamina.current = Math.max(stamina.current - amount, 0);
    // Start interval if stamina is not full and interval is not in progress
    if (stamina.current < stamina.max && !staminaIntervalInProgress) {
        staminaIntervalInProgress = true;
        staminaInterval = setInterval(() => {
            // Start from beginning if time reaches 0 or reduce the current time
            if (stamina.timeLeft.current.number === 0) {
                stamina.timeLeft.current.number = stamina.timeLeft.max;
            } else {
                stamina.timeLeft.current.number -= 1;
            }
            // Present the time in string format
            // Example: 123 -> "02:03"
            const minutes = Math.floor(stamina.timeLeft.current.number / 60);
            const seconds = stamina.timeLeft.current.number - minutes * 60;
            stamina.timeLeft.current.string = `0${minutes}:${
                seconds > 9 ? seconds : "0" + seconds
            }`;
            // Add 1 stamina if timer reaches 0
            if (stamina.timeLeft.current.number === 0) {
                stamina.current += 1;
            }
            // Stop the interval when stamina full
            if (stamina.current >= stamina.max) {
                clearInterval(staminaInterval);
                staminaIntervalInProgress = false;
            }
        }, 1000);
    }
};

let magiciteInterval: NodeJS.Timeout;
let magiciteIntervalInProgress: boolean = false;

const emptyDistiller = (empty: boolean = true) => {
    const distiller = playerInfo.distiller;
    // Do nothing if there's nothing to subtract
    if (distiller.current === 0) {
        return;
    }
    // Empty the distiller and add the amount to total magicite
    if (empty) {
        playerInfo.magicite += distiller.current;
        distiller.current = 0;
    }
    // Set time to match the current amount of magicite in distiller
    playerInfo.distiller.timeLeft.current.number =
        playerInfo.distiller.timeLeft.max - playerInfo.distiller.current * 576;
    // Start interval if distiller is not full and interval is not in progress
    if (distiller.current < distiller.max && !magiciteIntervalInProgress) {
        magiciteIntervalInProgress = true;
        magiciteInterval = setInterval(() => {
            // Reduce time by 1 second every 1 second
            distiller.timeLeft.current.number -= 1;
            // Present the time in string format
            // Example: 123 -> "02:03"
            const hours = Math.floor(distiller.timeLeft.current.number / 3600);
            const minutes = Math.floor((distiller.timeLeft.current.number - hours * 3600) / 60);
            const seconds = distiller.timeLeft.current.number - hours * 3600 - minutes * 60;
            distiller.timeLeft.current.string = `${hours > 9 ? hours : "0" + hours}:${
                minutes > 9 ? minutes : "0" + minutes
            }:${seconds > 9 ? seconds : "0" + seconds}`;
            // Add 1 magicite if current time divided by 576 returns an integer
            if (
                distiller.timeLeft.current.number !== distiller.timeLeft.max &&
                (distiller.timeLeft.current.number / 576) % 1 === 0
            ) {
                distiller.current += 1;
            }
            // Stop the interval when distiller full
            if (distiller.current >= distiller.max) {
                clearInterval(magiciteInterval);
                magiciteIntervalInProgress = false;
            }
        }, 1000);
    }
};

// Start counters if needed
const initPlayerResourceTimers = () => {
    if (playerInfo.stamina.current < playerInfo.stamina.max) {
        spendStamina();
    }
    if (playerInfo.distiller.current < playerInfo.distiller.max) {
        emptyDistiller(false);
    }
};

export { spendStamina, emptyDistiller, initPlayerResourceTimers };
