let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;
}

function allUnqiue(arr) {
    return arr.length === new Set(arr).size;
}

function part1(buffer) {
    for (let i=0; i<buffer.length - 4; i++) {
        if (allUnqiue(buffer.slice(i, i+4))) {
            return i + 4;
        }
    }
}

function part2(buffer) {
    for (let i=0; i<buffer.length - 14; i++) {
        if (allUnqiue(buffer.slice(i, i+14))) {
            return i + 14;
        }
    }
}

const buffer = raw.trim().split("");

const p1 = part1(buffer);
console.log(`Part1: ${p1}`);

const p2 = part2(buffer);
console.log(`Part2: ${p2}`);