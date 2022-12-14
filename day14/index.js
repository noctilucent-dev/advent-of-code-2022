let { constrain, DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;
}

function parse(raw) {
    let lines = raw
        .split("\n")
        .map(l => {
            return l.split(" -> ")
                    .map(p => p.split(",").map(Number));
         });

    log(lines);

    const grid = [];
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    const updateLimits = (x, y) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }
    
    lines.forEach(line => {
        for(let i=1; i<line.length; i++) {
            const [ax, ay] = line[i-1];
            const [bx, by] = line[i];
            const dy = by - ay;
            const dx = bx - ax;
            const len = Math.abs(dy + dx);
            const v = [constrain(dx, -1, 1), constrain(dy, -1, 1)];

            log(`Adding line from [${ax}, ${ay}] to [${bx}, ${by}]`);

            for (let i=0, x=ax, y=ay; i<=len; i++, x += v[0], y += v[1]) {
                log(`  Segment [${x}, ${y}]`);
                if (!grid[y]) grid[y] = [];
                grid[y][x] = '#';
                updateLimits(x, y);
            }
        }
    });

    if (!grid[0]) grid[0] = [];
    grid[0][500] = '+';
    updateLimits(500, 0);

    return {
        minX,
        minY,
        maxX,
        maxY,
        grid
    };
}

function print(grid, minX, minY, maxX, maxY) {
    const lines = [];
    for(let y=minY-1; y<=maxY+1; y++) {
        let line = '';
        for (let x=minX-1; x<=maxX+1; x++) {
            if (grid[y] && grid[y][x]) line += grid[y][x];
            else line += '.';
        }
        lines.push(line);
    }
    return lines.join("\n");
}

function part1(grid, minX, minY, maxX, maxY) {
    let count = 0;
    while(true) {
        let y, x;

        for(y=1, x=500; y<=maxY; y++) {
            if(!grid[y] || !grid[y][x]) continue;
            if (!grid[y][x-1]) {
                x--;
                continue;
            }
            if (!grid[y][x+1]) {
                x++;
                continue;
            }
            break;
        }

        if (y > maxY) {
            return count;
        }

        if (!grid[y-1]) grid[y-1] = [];
        grid[y-1][x] = 'o';

        log(print(grid, minX, minY, maxX, maxY));

        count++;
    }
}

function part2(grid, minX, minY, maxX, maxY) {
    let count = 0;
    while(true) {
        let y, x;

        for(y=1, x=500; y<=maxY+2; y++) {
            if(y === maxY+2) break;
            if(!grid[y] || !grid[y][x]) continue;
            if (!grid[y][x-1]) {
                x--;
                continue;
            }
            if (!grid[y][x+1]) {
                x++;
                continue;
            }
            break;
        }

        if (y === 1) return count + 1;

        if (!grid[y-1]) grid[y-1] = [];
        grid[y-1][x] = 'o';

        log(print(grid, minX, minY, maxX, maxY));

        count++;
    }
}

const { minX, minY, maxX, maxY, grid } = parse(raw);

const p1 = part1(grid, minX, minY, maxX, maxY);
console.log(`Part1: ${p1}`);

const p2 = part2(grid, minX, minY, maxX, maxY);
console.log(`Part2: ${p2}`);