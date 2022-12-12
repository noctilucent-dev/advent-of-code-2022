let { DEBUG, log, raw, recursiveCompare } = require("../util");

if (DEBUG) {
    raw = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
}

function parse(lines) {
    let start, end;
    const grid = lines.map((l, y) => l.split("").map((c, x) => {
        if (c === "S") {
            start = [x, y];
            return 0;
        }
        if (c === "E") {
            end = [x, y];
            return 25;
        }
        return c.charCodeAt(0) - "a".charCodeAt(0);
    }));
    return {
        start,
        end,
        grid
    };
}

function print(grid, len = 1, space = "") {
    return grid.map(l => l.map(c => {
        if (c === undefined) c = '.';
        return `     ${c}`.slice(-len);
    }).join(space)).join("\n");
}

class Node {
    constructor(x, y, cost, parent) {
        this.x = x;
        this.y = y;
        this.cost = cost;
        this.parent = parent;
        this.children = [];
    }

    distanceTo(xe, ye) {
        return Math.abs(this.x - xe) + Math.abs(this.y - ye);
    }
}

class Graph {
    constructor(root) {
        this.root = root;
        this.nodes = [root];
        this.leaves = [root];
    }

    getBestLeaf(heuristic) {
        this.leaves = this.leaves.sort((a, b) => heuristic(a) - heuristic(b));
        return this.leaves.shift();
    }
}

function distance([xa, ya], [xb, yb]) {
    return Math.abs(xa - xb) + Math.abs(ya - yb);
}

function part1(start, end, grid) {
    const startNode = new Node(start[0], start[1], 0, undefined);
    const graph = new Graph(startNode);

    while(graph.leaves.length > 0) {
        const leaf = graph.getBestLeaf(n => n.cost + n.distanceTo(end[0], end[1]));
        const { x, y } = leaf;

        if (leaf.x === end[0] && leaf.y === end[1]) {
            return leaf.cost;
        }

        const height = grid[y][x];

        let nextSteps = [];

        if (y > 0 && grid[y-1][x] - height <= 1) {
            nextSteps.push([x, y-1]);
        }
        if (y < grid.length-1 && grid[y+1][x] - height <= 1) {
            nextSteps.push([x, y+1]);
        }
        if (x < grid[0].length - 1 && grid[y][x+1] - height <= 1) {
            nextSteps.push([x+1, y]);
        }
        if (x > 0 && grid[y][x-1] - height <= 1) {
            nextSteps.push([x-1, y]);
        }

        nextSteps = nextSteps.sort((a, b) => distance(a, end) - distance(b, end));

        for(let i=0; i<nextSteps.length; i++) {
            const [nx, ny] = nextSteps[i];
            const matching = graph.nodes.find(n => n.x === nx && n.y === ny);
            if (matching) {
                if (matching.cost > leaf.cost + 1) {
                    matching.cost = leaf.cost + 1;
                    matching.parent = leaf;
                }
            } else {
                const newLeaf = new Node(nx, ny, leaf.cost + 1, leaf);
                graph.nodes.push(newLeaf);
                graph.leaves.push(newLeaf);
            }
        }
    }
}

const { start, end, grid } = parse(raw.split("\n"));

log(print(grid, 2, " "));
log("\n");

const p1 = part1(start, end, grid);
console.log(`Part1: ${p1}`);
