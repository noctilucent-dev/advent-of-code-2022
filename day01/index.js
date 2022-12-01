let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
}

function part1(lines) {
    let sum = 0;
    let max = 0;
    for (let i=0; i<lines.length; i++) {
        if (lines[i].length === 0) {
            sum = 0;
        } else {
            sum += Number(lines[i]);
            max = Math.max(sum, max);
        }
    }

    return max;
}

function part2(lines) {
    const elves = [];
    let sum = 0;
    for (let i=0; i<lines.length; i++) {
        if (lines[i].length === 0) {
            elves.push(sum);
            sum = 0;
        } else {
            sum += Number(lines[i]);
        }
    }

    elves.push(sum);
    
    elves.sort((a, b) => a - b);
    return elves.slice(-3).reduce((p, c) => p+c);
}

const lines = raw.trim().split("\n");

const max = part1(lines);
console.log(`Part1: ${max}`);

const top3 = part2(lines);
console.log(`Part2: ${top3}`);