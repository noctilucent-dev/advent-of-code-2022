let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;
}

function parse(lines) {
    const pairs = [];
    for(let i=0; i<lines.length; i++) {
        const [left, right] = lines[i].split(",");
        const [ls, le] = left.split("-").map(Number);
        const [rs, re] = right.split("-").map(Number);

        pairs.push([
            {
                start: ls,
                end: le
            },
            {
                start: rs,
                end: re
            }
        ]);
    }
    return pairs;
}

function contains(a, b) {
    return a.start <= b.start && a.end >= b.end;
}

function overlap(a, b) {
    if (b.start > a.end) return false;
    if (a.start > b.end) return false;
    return true;
}

function part1(pairs) {
    let count = 0;
    for (let i=0; i<pairs.length; i++) {
        const [first, second] = pairs[i];
        if (contains(first, second) || contains(second, first)) {
            count++;
        }
    }
    return count;
}

function part2(pairs) {
    let count = 0;
    for (let i=0; i<pairs.length; i++) {
        const [first, second] = pairs[i];
        if (overlap(first, second)) {
            count++;
        }
    }
    return count;
}

const pairs = parse(raw.trim().split("\n"));

const p1 = part1(pairs);
console.log(`Part1: ${p1}`);

const p2 = part2(pairs);
console.log(`Part2: ${p2}`);
