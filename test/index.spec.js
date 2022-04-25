const {isIdValid, isNameValid} = require("../src");

const expect = require("chai").expect;

describe("isIdValid", () => {
    const falseTests = [
        "abc",
        " ",
        "🐻‍❄️",
        -1,
        0,
        "%20",
        -9007199254740992,
        undefined,
        null,
    ];
    const trueTests = ["1", 1, 9007199254740992];

    falseTests.forEach((string) => {
        it(`expect [${string}] to be false`, () => {
            expect(isIdValid(string)).to.be.false;
        });
    });
    trueTests.forEach((string) => {
        it(`expect [${string}] to be true`, () => {
            expect(isIdValid(string)).to.be.true;
        });
    });
});

describe("isNameValid", () => {
    const falseTests = ["", " ", "%20", undefined, null];
    const trueTests = ["Team Fortress 2"];

    falseTests.forEach((string) => {
        it(`expect [${string}] to be false`, () => {
            expect(isNameValid(string)).to.be.false;
        });
    });
    trueTests.forEach((string) => {
        it(`expect [${string}] to be true`, () => {
            expect(isNameValid(string)).to.be.true;
        });
    });
});
