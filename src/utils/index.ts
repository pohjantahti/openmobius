// Capitalize the first letter of string
const capitalize = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Wait for a specified time
const sleep = async (milliseconds: number = 0): Promise<void> => {
    await new Promise((r) => setTimeout(r, milliseconds));
};

// Convert hex color to color matrix for use in <feColorMatrix /> SVG element
const hexToMatrix = (hex: string): string => {
    // Math 6 or 8 character hex colors: #AABBCC or # AABBCCDD
    if (!hex.match("#[a-fA-F0-9]{6}([a-fA-F0-9]{0}$|[a-fA-F0-9]{2}$)")) {
        throw new Error(`Value: ${hex} does not match the expression`);
    }
    const [red, green, blue, opacity = "FF"] = hex.substring(1).match(/.{2}/g)!;
    const matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    matrix[0] = parseInt(red, 16) / 255;
    matrix[6] = parseInt(green, 16) / 255;
    matrix[12] = parseInt(blue, 16) / 255;
    matrix[18] = parseInt(opacity, 16) / 255;
    return matrix.join();
};

// Adds zeroes to the beginning of number until it reaches maxPad
// Example: padNumberWithZeroes(123, 7) returns 0000123
const padNumberWithZeroes = (number: number, maxPad: number): string => {
    let stringCount = number.toString();
    for (let i = stringCount.length; i < maxPad; i++) {
        stringCount = "0" + stringCount;
    }
    return stringCount;
};

export { capitalize, sleep, hexToMatrix, padNumberWithZeroes };
