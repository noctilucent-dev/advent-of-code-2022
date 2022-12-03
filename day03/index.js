let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
}

function getPriority(letter) {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet.indexOf(letter) + 1;
}

function findMisplacedItem(line) {
    const arr = line.split("");
    let left = arr.slice(0, arr.length / 2);
    let right = new Set(arr.slice(arr.length / 2));
    return left.filter(l => right.has(l))[0];
}

function part1(lines) {
    return lines.reduce(
        (p, l) => p + getPriority(findMisplacedItem(l)),
        0);
}

function findBadge(lines) {
    const possibleValues = new Set(lines[0]);
    for (let i=1; i<lines.length; i++) {
        Array.from(possibleValues)
            .filter(v => lines[i].indexOf(v) < 0)
            .forEach(v => possibleValues.delete(v));
    }

    return Array.from(possibleValues)[0];
}

function part2(lines) {
    let sum = 0;
    for(let i=0; i<lines.length; i += 3) {
        const badge = findBadge(lines.slice(i, i+3));
        sum +=  getPriority(badge);
    }
    return sum;
}

const lines = raw.trim().split("\n");

const p1 = part1(lines);
console.log(p1);

const p2 = part2(lines);
console.log(p2);