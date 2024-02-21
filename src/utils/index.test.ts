import { test, expect } from "vitest";
import { capitalize, hexToMatrix } from ".";

test("Capitalize the first letter of string", () => {
    const values = [
        ["abc", "Abc"],
        ["Abc", "Abc"],
        ["ABC", "ABC"],
    ];
    values.forEach(([value, result]) => {
        expect(capitalize(value)).toBe(result);
    });
    const errorValues = [123, undefined];
    errorValues.forEach((value) => {
        // @ts-expect-error Feed non-string values to a string function
        expect(() => capitalize(value)).toThrow(TypeError);
    });
});

test("Convert hex color to color matrix", () => {
    const values = [
        ["#FFFFFF", "1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0"],
        ["#00000000", "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"],
        [
            "#9AD1CE43",
            "0.6039215686274509,0,0,0,0,0,0.8196078431372549,0,0,0,0,0,0.807843137254902,0,0,0,0,0,0.2627450980392157,0",
        ],
    ];
    values.forEach(([value, result]) => {
        expect(hexToMatrix(value)).toBe(result);
    });
});
