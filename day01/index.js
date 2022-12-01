let { raw } = require("../util");

// raw = `1000
// 2000
// 3000

// 4000

// 5000
// 6000

// 7000
// 8000
// 9000

// 10000`;

function part1(lines) {
    const elves = [];
    let sum = 0;
    let max = 0;
    for (let i=0; i<lines.length; i++) {
        console.log(lines[i]);
        if (lines[i].length === 0) {
            elves.push(sum);
            if (sum > max) max = sum;
            console.log(`Elf: ${sum}, Max: ${max}`);
            sum = 0;
        } else {
            sum += Number(lines[i]);
        }
    }

    elves.push(sum);
    if (sum > max) max = sum;
    console.log(`Elf: ${sum}, Max: ${max}`);

    return max;
}

function part2(lines) {
    const elves = [];
    let sum = 0;
    for (let i=0; i<lines.length; i++) {
        console.log(lines[i]);
        if (lines[i].length === 0) {
            elves.push(sum);
            console.log(`Elf: ${sum}`);
            sum = 0;
        } else {
            sum += Number(lines[i]);
        }
    }

    elves.push(sum);
    console.log(`Elf: ${sum}`);

    elves.sort((a, b) => a - b);
    console.log(elves);
    console.log(elves.slice(-3));
    console.log(elves.slice(-3).reduce((p, c) => p+c));

    return elves.slice(-3).reduce((p, c) => p+c);
}

const max = part1(raw.trim().split("\n"));
console.log(max);

console.log(part2(raw.trim().split("\n")));