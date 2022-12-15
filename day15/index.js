let { constrain, DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;
}

function distance([ax, ay], [bx, by]) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
}

function parse(raw) {
    return raw.split("\n").map(l => {
        const [_, sx, sy, bx, by] = l.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
        return {
            sx: Number(sx),
            sy: Number(sy),
            bx: Number(bx),
            by: Number(by),
            distance: distance([sx, sy], [bx, by])
        };
    })
}

function updateLimit(min, max, ...vals) {
    vals.forEach(v => {
        min = Math.min(min, v);
        max = Math.max(max, v);
    });

    return [min, max];
}

function getLimits(sensors) {
    let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE;
    let maxX = 0, maxY = 0;
    sensors.forEach(s => {
        [minX, maxX] = updateLimit(minX, maxX, s.sx, s.bx, s.sx - s.distance, s.sx + s.distance);
        [minY, maxY] = updateLimit(minY, maxY, s.sy, s.by, s.sy + s.distance, s.sy - s.distance);
    });
    return {
        minX,
        minY,
        maxX,
        maxY
    };
}

function print(sensors) {
    if (!DEBUG) return;
    const { minX, minY, maxX, maxY } = getLimits(sensors);

    const lines = [];
    for(let y=minY-1; y<=maxY; y++) {
        let line = "";
        for (let x=minX-1; x<=maxX; x++) {
            if (x === minX - 1) {
                line += `  ${y}`.slice(-3);
                continue;
            }
            if (y === minY - 1 && x % 5 === 0) {
                line += x % 10;
                continue;
            }
            const sensor = sensors.find(s => s.sx === x && s.sy === y);
            const beacon = sensors.find(s => s.bx === x && s.by === y);
            if (sensor)
                line += "s";
            else if (beacon)
                line += "b";
            else
                line += ".";
        }
        lines.push(line);
    }

    return lines.join("\n");
}

function part1(sensors) {
    const { minX, minY, maxX, maxY } = getLimits(sensors);

    const y = DEBUG ? 10 : 2000000;
    let count = 0;

    for(let x=minX; x<=maxX; x++) {
        const inRange = sensors.some(s => distance([x, y], [s.sx, s.sy]) <= s.distance);
        const isBeacon = sensors.some(s => s.bx === x && s.by === y);
        if (inRange && !isBeacon) count++;
    }

    return count;
}

function part2(sensors) {
    let { minX, minY, maxX, maxY } = getLimits(sensors);
    const lim = DEBUG ? 20 : 4000000;

    if (minX < 0) minX = 0;
    if (minY < 0) minY = 0;
    if (maxX > lim) maxX = lim;
    if (maxY > lim) maxY = lim;
    
    for (let y=minY; y<=maxY; y++) {
        for(let x=minX; x<=maxX; x++) {
            const inRange = sensors.find(s => distance([x, y], [s.sx, s.sy]) <= s.distance);
            if (inRange) {
                // Skip to the right-edge of the sensor range on this line
                x = inRange.sx + inRange.distance - Math.abs(inRange.sy - y);
                continue;
            } else {
                return (x * 4000000) + y;
            }
        }
    }
}

const sensors = parse(raw);
log(print(sensors));

const p1 = part1(sensors);
console.log(`Part1: ${p1}`);

const p2 = part2(sensors);
console.log(`Part2: ${p2}`);