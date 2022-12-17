let { DEBUG, deepClone, log, raw } = require("../util");

if (DEBUG) {
    raw = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;
}

const shape1 = `####`;
const shape2 = `.#.
###
.#.`;
const shape3 = `..#
..#
###`;
const shape4 = `#
#
#
#`;
const shape5 = `##
##`;

function* jetIterator() {
    for (let i=0; true; i = (i+1) % raw.length) {
        yield raw[i];
    }
}

function* shapeIterator() {
    const allShapes = [
        shape1, shape2, shape3, shape4, shape5
    ].map(s => s.split("\n").reverse().map(l => l.split("")));

    for (let i=0; true; i = (i + 1) % allShapes.length) {
        yield allShapes[i].map(l => [...l]);
    }
}

function emptyChamber() {
    return ["#######".split("").map(c => c === '#')];
}

function canMoveLeft(shape, row, col, chamber) {
    if (col === 0) return false;

    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;

    for(let y=row; y<row+shapeHeight; y++) {
        const shapeLine = shape[y-row];
        const shapeCol = shapeLine.indexOf('#');
        if (shapeCol > 0) continue;
        if (chamber[y] && chamber[y][col-1]) return false;
    }

    return true;
}

function canMoveRight(shape, row, col, chamber) {
    const chanberWidth = chamber[0].length;
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;

    // check for right-edge
    if (col + shapeWidth >= chanberWidth) return false;

    for(let y=row; y<row+shapeHeight; y++) {
        const shapeLine = shape[y-row];
        const shapeCol = shapeLine.lastIndexOf('#');
        if (shapeCol < shapeWidth - 1) continue;
        if (chamber[y] && chamber[y][col+shapeWidth]) return false;
    }

    return true;
}

function canMoveDown(shape, row, col, chamber) {
    const shapeWidth = shape[0].length;
    for (let x=col; x<col+shapeWidth; x++) {
        if (shape[shape.length-1][x-col] !== '#') continue;
        if (chamber[row-1] && chamber[row-1][x]) return false;
    }
    return true;
}

function setShape(shape, row, col, chamber) {
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    for (let y=row; y<row+shapeHeight; y++) {
        if (!chamber[y]) chamber[y] = [false, false, false, false, false, false, false];
        for (let x=col; x<col+shapeWidth; x++) {
            if (shape[y-row][x-col] === '#') {
                chamber[y][x] = true;
            }
        }
    }
}

function printChamber(chamber, shape, row, col) {
    if (shape) {
        chamber = chamber.map(l => l.map(c => c ? '#' : '.'));
        for(let y=0; y<row+shape.length; y++) {
            if (!chamber[y]) chamber[y] = '.......'.split("");
        }
        for(let y=row; y<row+shape.length; y++) {
            for (let x=col; x<col+shape[0].length; x++) {
                if (shape[y-row][x-col] === '#') {
                    chamber[y][x] = '@';
                }
            }
        }

        return chamber.reverse().map(l => l.join("")).join("\n");
    }

    if (DEBUG)
        return chamber.map(l => l.map(c => c ? '#' : '.').join("")).reverse().join("\n");
}

function part1() {
    const jets = jetIterator();
    const shapes = shapeIterator();
    let chamber = emptyChamber();
    let topRow = 0;
    
    for (let i=0; i<2022; i++) {
        //if (i % 100 === 0) log(printChamber(chamber) + "\n");
        const shape = shapes.next().value;
        let row = topRow + 4;
        let col = 2;
        if (i<=11) log(printChamber(chamber, shape, row, col) + "\n");
        while(true) {
            const jet = jets.next().value;
            if (jet === '>' && canMoveRight(shape, row, col, chamber)) {
                col++;
            } else if (canMoveLeft(shape, row, col, chamber)) {
                col--;
            }
            if (canMoveDown(shape, row, col, chamber)) {
                row--;
            } else {
                setShape(shape, row, col, chamber);
                topRow = row + shape.length - 1;
                break;
            }
        }
    }

    return topRow;
}

const p1 = part1();
console.log(`Part1: ${p1}`);

// const p2 = part2(valves);
// console.log(`Part2: ${p2}`);
