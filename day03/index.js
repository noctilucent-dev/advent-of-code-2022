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
    let left = arr.slice(undefined, arr.length / 2);
    let right = new Set(arr.slice(arr.length / 2));
    const misplaced = left.filter(l => right.has(l))[0];
    return misplaced;
}

function part1(lines) {
    let sum = 0;
    for(let i=0; i<lines.length; i++) {
        let l = findMisplacedItem(lines[i]);
        console.log(`Misplaced: ${l}, Priority: ${getPriority(l)}`);

        sum += getPriority(l);
    }
    return sum;
}

function findBadge(lines) {
    const allItems = new Set(lines[0]);
    for (let i=1; i<lines.length; i++) {
        Array.from(allItems).forEach(c => {
            if (lines[i].indexOf(c) < 0) allItems.delete(c);
        });
    }
    return Array.from(allItems)[0];
}

function part2(lines) {
    let sum = 0;
    for(let i=0; i<=lines.length; i += 3) {
        const badge = findBadge([lines[i], lines[i+1], lines[i+2]]);
        console.log(`Badge: ${badge}, Priority: ${getPriority(badge)}`);
        sum +=  getPriority(badge);
    }
    return sum;
}

const lines = raw.trim().split("\n");

const p1 = part1(lines);
console.log(p1);

const p2 = part2(lines);
console.log(p2);