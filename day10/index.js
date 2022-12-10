let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;
}

class CPU {
    constructor(instructions) {
        this.instructions = instructions;
        this.x = 1;
        this.pc = 0;
        this.timer = 0;
    }

    tick() {
        const [a, b] = this.instructions[this.pc].split(" ");
        if (a === "noop") {
            log('noop');
            this.pc++;
        } else if(this.timer === 0) {
            log('wait');
            this.timer++;
        } else {
            log(`x += ${Number(b)}`);
            this.x += Number(b);
            this.pc++;
            this.timer = 0;
        }
    }
}

function part1(lines) {
    const cpu = new CPU(lines);
    const values = [];

    for(let time=1; time<=220; time++) {
        if (time === 20 || time === 60 || time === 100 || time === 140 || time === 180 || time === 220) {
            values.push(cpu.x * time);
        }
        log(`Time: ${time}, x: ${cpu.x}`);
        cpu.tick();
    }

    return values.reduce((p, c) => p + c);
}

function part2(lines) {
    const cpu = new CPU(lines);
    let output = "";

    for(let time=0; cpu.pc < lines.length; time++) {
        let x = time % 40;
        if (Math.abs(cpu.x - x) <= 1) {
            output += '#';
        } else {
            output += '.';
        }
        if (x === 39) {
            output += "\n";
        }
        cpu.tick();
    }

    return output;
}

const lines = raw.split("\n");

const p1 = part1(lines);
console.log(`Part1: ${p1}`);

const p2 = part2(lines);
console.log(p2);
