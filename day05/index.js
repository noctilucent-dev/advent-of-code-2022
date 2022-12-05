let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;
}

function parse(lines) {
    const stacks = [];
    const instructions = [];

    // parse stacks
    let i = 0;
    while(true) {
        if (lines[i][1] === "1") break;

        for(let j=1; j<lines[i].length; j += 4) {
            const stackIndex = ~~(j / 4);
            if (lines[i][j] === " ") continue;
            if (!stacks[stackIndex]) stacks[stackIndex] = [];
            stacks[stackIndex].push(lines[i][j]);
        }

        i++;
    }
    stacks.forEach(s => s.reverse());

    // parse instructions
    i += 2;
    while(i < lines.length) {
        const [_, count, __, from, ___, to] = lines[i].split(" ");
        instructions.push([
            Number(count),
            Number(from) - 1,
            Number(to) - 1
        ]);
        i++;
    }

    return {
        stacks,
        instructions
    };
}

function part1(stacks, instructions) {
    for(let i=0; i<instructions.length; i++) {
        const [count, from, to] = instructions[i];
        for (let c=0; c<count; c++) {
            stacks[to].push(stacks[from].pop());
        }
    }
    let top = "";
    for(let i=0; i<stacks.length; i++) {
        top += stacks[i].pop();
    }
    return top;
}

function part2(stacks, instructions) {
    for(let i=0; i<instructions.length; i++) {
        const [count, from, to] = instructions[i];
        const miniStack = stacks[from].splice(-count);
        for(let mi=0; mi<miniStack.length; mi++) {
            stacks[to].push(miniStack[mi]);
        }
    }
    let top = "";
    for(let i=0; i<stacks.length; i++) {
        top += stacks[i].pop();
    }
    return top;
}

const { stacks, instructions } = parse(raw.split("\n"));

const p1 = part1(stacks.map(s => [...s]), instructions);
console.log(`Part1: ${p1}`);

const p2 = part2(stacks.map(s => [...s]), instructions);
console.log(`Part2: ${p2}`);