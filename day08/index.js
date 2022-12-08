let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `30373
25512
65332
33549
35390`;
}

function isVisible(x, y, trees) {
    if (x === 0 || x === trees[0].length-1 || y === 0 || y === trees.length - 1) return true;

    let blocked = false;
    // left
    for(let cx=x-1; cx>=0; cx--) {
        if (trees[y][cx] >= trees[y][x]) {
            blocked = true;
            break;
        }
    }
    if (!blocked) return true;

    // right
    blocked = false;
    for(let cx=x+1; cx<trees[y].length; cx++) {
        if (trees[y][cx] >= trees[y][x]) {
            blocked = true;
            break;
        }
    }
    if (!blocked) return true;

    // up
    blocked = false;
    for(let cy=y-1; cy>=0; cy--) {
        if (trees[cy][x] >= trees[y][x]) {
            blocked = true;
            break;
        }
    }
    if (!blocked) return true;

    // down
    blocked = false;
    for(let cy=y+1; cy<trees.length; cy++) {
        if (trees[cy][x] >= trees[y][x]) {
            blocked = true;
            break;
        }
    }
    if (!blocked) return true;

    return false;
}

function part1(trees) {
    let visible = 0;
    let map = [];
    for(let y=0; y<trees.length; y++) {
        map[y] = [];
        for(let x=0; x<trees[y].length; x++) {
            if (isVisible(x, y, trees)) {
                visible++;
                map[y][x] = 'Y';
            } else {
                map[y][x] = 'N';
            }
        }
    }
    log(map.map(l => l.join(" ")).join("\n"));
    return visible;
}

function getScore(x, y, trees) {
    let scores = [];

    // left
    let score = 0;
    for(let cx=x-1; cx>=0; cx--) {
        score += 1;
        if (trees[y][cx] >= trees[y][x]) {
            break;
        }
    }
    scores.push(score);

    // right
    score = 0;
    for(let cx=x+1; cx<trees[y].length; cx++) {
        score += 1;
        if (trees[y][cx] >= trees[y][x]) {
            break;
        }
    }
    scores.push(score);

    // up
    score = 0;
    for(let cy=y-1; cy>=0; cy--) {
        score++;
        if (trees[cy][x] >= trees[y][x]) {
            break;
        }
    }
    scores.push(score);

    // down
    score = 0;
    for(let cy=y+1; cy<trees.length; cy++) {
        score++;
        if (trees[cy][x] >= trees[y][x]) {
            break;
        }
    }
    scores.push(score);

    return scores.reduce((p, c) => p * c);
}

function part2(trees) {
    let max = 0;
    let map = [];
    for(let y=0; y<trees.length; y++) {
        map[y] = [];
        for(let x=0; x<trees[y].length; x++) {
            let score = getScore(x, y, trees);
            map[y][x] = score;
            if (score > max) max = score;
        }
    }
    log(map.map(l => l.join(" ")).join("\n"));
    return max;
}

const trees = raw.split("\n").map(l => l.split("").map(Number));

log(trees.map(l => l.join(" ")).join("\n"));

const p1 = part1(trees);
console.log(`Part1: ${p1}`);

const p2 = part2(trees);
console.log(`Part2: ${p2}`);
