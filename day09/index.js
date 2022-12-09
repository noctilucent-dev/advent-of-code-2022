const { dir } = require("console");
let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;
}

function constrain(num, min, max) {
    if (num > max) return max;
    if (num < min) return min;
    return num;
}

function catchUp(headPos, tailPos) {
    let newTailPos = [...tailPos];
    const dx = headPos[0] - tailPos[0];
    const dy = headPos[1] - tailPos[1];

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        newTailPos[0] += constrain(dx, -1, 1);
        newTailPos[1] += constrain(dy, -1, 1);
    }
    return newTailPos;
}

function calculateNewHeadPos(headPos, direction) {
    let newHeadPos = [...headPos];
    switch(direction) {
        case "R":
            newHeadPos[0]++;
            break;
        case "L":
            newHeadPos[0]--;
            break;
        case "U":
            newHeadPos[1]--;
            break;
        case "D":
            newHeadPos[1]++;
            break;
    }
    return newHeadPos;
}

function calculateNewPositions(headPos, tailPos, direction) {
    let newHeadPos = calculateNewHeadPos(headPos, direction);
    let newTailPos = catchUp(newHeadPos, tailPos);
    return[
        newHeadPos,
        newTailPos
    ];
}

function part1(lines) {
    let path = [];
    let headPos = [0, 0];
    let tailPos = [0, 0];
    path.push([...tailPos]);
    for(let i=0; i<lines.length; i++) {
        let [direction, magnitude] = lines[i].split(" ");
        magnitude = Number(magnitude);
        for (let c=0; c<magnitude; c++) {
            const [newHeadPos, newTailPos] = calculateNewPositions(headPos, tailPos, direction);
            path.push([...newTailPos]);
            headPos = newHeadPos;
            tailPos = newTailPos;
        }
    }

    log(path);

    const coords = new Set(path.map(([x, y]) => `${x},${y}`));
    return coords.size;
}

function printRope(positions) {
    if (!DEBUG) return;
    const minX = positions.map(p => p[0]).reduce((p, c) => Math.min(p, c), 0);
    const minY = positions.map(p => p[1]).reduce((p, c) => Math.min(p, c), 0);
    const maxX = positions.map(p => p[0]).reduce((p, c) => Math.max(p, c), 0);
    const maxY = positions.map(p => p[1]).reduce((p, c) => Math.max(p, c), 0);

    let map = [];
    for (let y=minY; y<=maxY; y++) {
        map[y-minY] = [];
        for (let x=minX; x<=maxX; x++) {
            map[y-minY].push('.');
        }
    }

    for (let i=positions.length-1; i>=0; i--) {
        const [x, y] = positions[i];
        map[y-minY][x-minX] = i === 0 ? 'H' : `${i}`;
    }
    log(map.map(l => l.join("")).join("\n"));
}

function part2(lines) {
    let path = [];
    let positions = [];
    for (let i=0; i<10; i++) positions[i] = [0,0];
    path.push([0,0]);
    
    for(let i=0; i<lines.length; i++) {
        let [direction, magnitude] = lines[i].split(" ");
        magnitude = Number(magnitude);

        for (let c=0; c<magnitude; c++) {
            printRope(positions);
            log("");

            positions[0] = calculateNewHeadPos(positions[0], direction);

            for (let i=1; i<=9; i++) {
                positions[i] = catchUp(positions[i-1], positions[i]);
            }

            path.push([...positions[9]]);
        }
    }

    log(path);

    const coords = new Set(path.map(([x, y]) => `${x},${y}`));
    return coords.size;
}

const lines = raw.split("\n");

const p1 = part1(lines);
console.log(`Part1: ${p1}`);

const p2 = part2(lines);
console.log(`Part2: ${p2}`);
