let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

// raw = `1,1,1
// 2,1,1`;
}

function parse(raw) {
    const coords = raw.split("\n").map(l => l.split(",").map(Number));
    return coords;
}

function part1(coords) {
    const pixels = [];
    let minVals = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let maxVals = [0, 0, 0];
    coords.forEach(([x, y, z]) => {
        if (!pixels[x]) pixels[x] = [];
        if (!pixels[x][y]) pixels[x][y] = [];
        pixels[x][y][z] = '#';

        minVals[0] = Math.min(minVals[0], x);
        minVals[1] = Math.min(minVals[1], y);
        minVals[2] = Math.min(minVals[2], z);
        maxVals[0] = Math.max(maxVals[0], x);
        maxVals[1] = Math.max(maxVals[1], y);
        maxVals[2] = Math.max(maxVals[2], z);
    });
    for (let x=minVals[0]; x<=maxVals[0]; x++) {
        if (!pixels[x]) pixels[x] = [];
        for (let y=minVals[1]; y<=maxVals[1]; y++) {
            if (!pixels[x][y]) pixels[x][y] = [];
        }
    }

    log(pixels);

    let surfaceArea = 0;

    for (let x=minVals[0]; x<=maxVals[0]; x++) {
        for (let y=minVals[1]; y<=maxVals[1]; y++) {
            for (let z=minVals[2]; z<=maxVals[2]; z++) {
                if (pixels[x][y][z] !== '#') continue;

                // top
                if (z === maxVals[2] || pixels[x][y][z+1] !== '#') {
                    surfaceArea++;
                }

                // bottom
                if (z === minVals[2] || pixels[x][y][z-1] !== '#') {
                    surfaceArea++;
                }

                // front
                if (y === maxVals[1] || pixels[x][y+1][z] !== '#') {
                    surfaceArea++;
                }

                // back
                if (y === minVals[1] || pixels[x][y-1][z] !== '#') {
                    surfaceArea++;
                }

                // right
                if (x === maxVals[0] || pixels[x+1][y][z] !== '#') {
                    surfaceArea++;
                }

                // left
                if (x === minVals[0] || pixels[x-1][y][z] !== '#') {
                    surfaceArea++;
                }
            }
        }
    }

    return surfaceArea;
}

function paintExterior(pixels, minVals, maxVals) {
    while (true) {
        let anyPainted = false;

        for (let x=minVals[0]; x<=maxVals[0]; x++) {
            for (let y=minVals[1]; y<=maxVals[1]; y++) {
                for (let z=minVals[2]; z<=maxVals[2]; z++) {
                    if (pixels[x][y][z]) continue;

                    // top
                    if (z === maxVals[2] || pixels[x][y][z+1] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // bottom
                    if (z === minVals[2] || pixels[x][y][z-1] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // front
                    if (y === maxVals[1] || pixels[x][y+1][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // back
                    if (y === minVals[1] || pixels[x][y-1][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // right
                    if (x === maxVals[0] || pixels[x+1][y][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // left
                    if (x === minVals[0] || pixels[x-1][y][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }
                }
            }
        }

        for (let x=maxVals[0]; x>=minVals[0]; x--) {
            for (let y=maxVals[1]; y>=minVals[1]; y--) {
                for (let z=maxVals[2]; z>=minVals[2]; z--) {
                    if (pixels[x][y][z]) continue;

                    // top
                    if (z === maxVals[2] || pixels[x][y][z+1] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // bottom
                    if (z === minVals[2] || pixels[x][y][z-1] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // front
                    if (y === maxVals[1] || pixels[x][y+1][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // back
                    if (y === minVals[1] || pixels[x][y-1][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // right
                    if (x === maxVals[0] || pixels[x+1][y][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }

                    // left
                    if (x === minVals[0] || pixels[x-1][y][z] === '~') {
                        pixels[x][y][z] = '~';
                        anyPainted=true;
                        continue;
                    }
                }
            }
        }

        if (!anyPainted) return;
    }
}

function part2(coords) {
    const pixels = [];
    let minVals = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
    let maxVals = [0, 0, 0];
    coords.forEach(([x, y, z]) => {
        if (!pixels[x]) pixels[x] = [];
        if (!pixels[x][y]) pixels[x][y] = [];
        pixels[x][y][z] = '#';

        minVals[0] = Math.min(minVals[0], x);
        minVals[1] = Math.min(minVals[1], y);
        minVals[2] = Math.min(minVals[2], z);
        maxVals[0] = Math.max(maxVals[0], x);
        maxVals[1] = Math.max(maxVals[1], y);
        maxVals[2] = Math.max(maxVals[2], z);
    });
    for (let x=minVals[0]; x<=maxVals[0]; x++) {
        if (!pixels[x]) pixels[x] = [];
        for (let y=minVals[1]; y<=maxVals[1]; y++) {
            if (!pixels[x][y]) pixels[x][y] = [];
        }
    }

    log(pixels);

    paintExterior(pixels, minVals, maxVals);

    let surfaceArea = 0;

    for (let x=minVals[0]; x<=maxVals[0]; x++) {
        for (let y=minVals[1]; y<=maxVals[1]; y++) {
            for (let z=minVals[2]; z<=maxVals[2]; z++) {
                if (pixels[x][y][z] !== '#') continue;

                // top
                if (z === maxVals[2] || pixels[x][y][z+1] === '~') {
                    surfaceArea++;
                }

                // bottom
                if (z === minVals[2] || pixels[x][y][z-1] === '~') {
                    surfaceArea++;
                }

                // front
                if (y === maxVals[1] || pixels[x][y+1][z] === '~') {
                    surfaceArea++;
                }

                // back
                if (y === minVals[1] || pixels[x][y-1][z] === '~') {
                    surfaceArea++;
                }

                // right
                if (x === maxVals[0] || pixels[x+1][y][z] === '~') {
                    surfaceArea++;
                }

                // left
                if (x === minVals[0] || pixels[x-1][y][z] === '~') {
                    surfaceArea++;
                }
            }
        }
    }

    return surfaceArea;
}

const coords = parse(raw);
log(coords);

const p1 = part1(coords);
console.log(`Part1: ${p1}`);

const p2 = part2(coords);
console.log(`Part2: ${p2}`);

// 2097 too low