let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
raw = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;
}

function parse(raw) {
    return raw.split("\n\n").map(p =>
        p.split("\n").map(l =>
            JSON.parse(l)
        )
    );
}

function spaces(len) {
    return "          ".slice(-len);
}

function compare(left, right, depth = 1) {
    for(let i=0; i<Math.max(left.length, right.length); i++) {
        if (i >= left.length && i < right.length) return -1;
        if (i >= right.length && i < left.length) return 1;

        let l = left[i];
        let r = right[i];

        log(`${spaces(depth*2)}- Compare ${JSON.stringify(l)} vs ${JSON.stringify(r)}`);

        if (Number.isInteger(l) && Number.isInteger(r)) {
            if (l < r) return -1;
            if (l > r) return 1;
        } else {
            if (Number.isInteger(l)) l = [l];
            if (Number.isInteger(r)) r = [r];
            const result = compare(l, r, depth + 1);
            if (result !== 0) return result;
        }
    }
    
    return 0;
}

function part1(pairs) {
    let indices = [];
    for (let i=0; i<pairs.length; i++) {
        log(`== Pair ${i+1} ==`);
        const [l, r] = pairs[i];
        log(`- Compare ${JSON.stringify(l)} vs ${JSON.stringify(r)}`);
        const result = compare(l, r);
        log(`Result: ${result}`);

        if (result === -1) indices.push(i+1);
    }

    log(`Ordered pairs: ${indices}`);

    return indices.reduce((p, c) => p + c);
}

function part2(pairs) {
    const d1 = [[2]];
    const d2 = [[6]];
    pairs.push([
        d1,
        d2
    ]);

    let allPackets = pairs
        .flatMap(i => i)
        .sort(compare);
    log(allPackets);

    const i1 = allPackets.findIndex(i => i === d1);
    const i2 = allPackets.findIndex(i => i === d2);

    return (i1 + 1) * (i2 + 1);
}

const pairs = parse(raw);

const p1 = part1(pairs);
console.log(`Part1: ${p1}`);

const p2 = part2(pairs);
console.log(`Part2: ${p2}`);
