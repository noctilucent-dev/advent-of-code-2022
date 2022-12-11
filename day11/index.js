let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;
}

function safeMul(a, b) {
    const r = a * b;
    if ((r / a) !== b) throw Error("Overflow");
    return r;
}

class Monkey {
    static fromLines(lines) {
        const id = Number(lines[0][7]);
        
        const startingItems = lines[1].substring(18).split(", ").map(Number);

        let [_, op, num] = lines[2].match(/new = old (.) (.+)/);
        if (num !== "old") num = Number(num);
        let operation;
        if (op === "+") {
            if (num === "old") {
                operation = old => ~~((old + old) / 3);
            } else {
                operation = old => ~~((old + num) /3);
            }
        } else {
            if (num === "old") {
                operation = old => ~~((old * old) / 3);
            } else {
                operation = old => ~~((old * num) / 3);
            }
        }

        const test = Number(lines[3].substring(21));

        const trueId = Number(lines[4].substring(29));

        const falseId = Number(lines[5].substring(29));

        return new Monkey(id, startingItems, operation, test, trueId, falseId);
    }

    static fromLines2(lines, magic) {
        const monkey = Monkey.fromLines(lines);

        let [_, op, num] = lines[2].match(/new = old (.) (.+)/);
        if (num !== "old") num = Number(num);
        let operation;
        if (op === "+") {
            if (num === "old") {
                operation = old => (old + old);
            } else {
                operation = old => (old + num);
            }
        } else {
            if (num === "old") {
                operation = old => safeMul(old, old) % magic;
            } else {
                operation = old => safeMul(old, num) % magic;
            }
        }

        monkey.operation = operation;

        return monkey;
    }

    constructor(id, startingItems, operation, test, trueId, falseId) {
        this.id = id;
        this.items = startingItems;
        this.operation = operation;
        this.test = test;
        this.trueId = trueId;
        this.falseId = falseId;
        this.inspectionCount = 0;
    }

    addItem(item) {
        this.items.push(item);
    }

    processItems(monkeys) {
        this.items.forEach(i => this.processItem(i, monkeys));
        this.items = [];
    }

    processItem(item, monkeys) {
        item = this.operation(item);
        if (item % this.test === 0) {
            monkeys[this.trueId].addItem(item);
        } else {
            monkeys[this.falseId].addItem(item);
        }
        this.inspectionCount++;
    }
}

function parse(lines) {
    const monkeys = [];
    for(let i=0; i<lines.length; i += 7) {
        monkeys.push(Monkey.fromLines(lines.slice(i, i+7)));
    }
    return monkeys;
}

function parse2(lines) {
    const monkeys = [];

    // Calculate the product of all 'tests'
    // This value will be as the divisor in the modulo function applied after each multiplication
    // Doing this limits the maximum item size without affecting the test result ('dvisible by X')
    const tests = [];
    for(let i=3; i<lines.length; i += 7) {
        tests.push(Number(lines[i].substring(21)));
    }
    const magic = tests.reduce((p, c) => p * c);

    for(let i=0; i<lines.length; i += 7) {
        monkeys.push(Monkey.fromLines2(lines.slice(i, i+7), magic));
    }
    return monkeys;
}

function part1(monkeys) {
    for (let i=0; i<20; i++) {
        monkeys.forEach(m => m.processItems(monkeys));
    }
    const sorted = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);

    return sorted[0].inspectionCount * sorted[1].inspectionCount;
}

function part2(monkeys) {
    for (let i=0; i<10000; i++) {
        try {
            monkeys.forEach(m => m.processItems(monkeys));
        } catch (e) {
            console.log(`Overflow error on round ${i+1}`);
            return;
        }
        if (DEBUG) {
            if (i === 0 || i === 19 || (i+1) % 1000 === 0) {
                log(`== After round ${i+1} ==`);
                monkeys.forEach((m, i) => log(`Monkey ${i} inspected items ${m.inspectionCount} times.`));
                log("");
            }
        }
    }
    const sorted = monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);

    return sorted[0].inspectionCount * sorted[1].inspectionCount;
}


let monkeys = parse(raw.split("\n"));
log(monkeys);

const p1 = part1(monkeys);
console.log(`Part1: ${p1}`);

monkeys = parse2(raw.split("\n"));

const p2 = part2(monkeys);
console.log(`Part2: ${p2}`);
