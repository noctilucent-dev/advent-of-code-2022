let { DEBUG, log, raw, recursiveCompare } = require("../util");

if (DEBUG) {
    raw = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;
}

function parse(lines) {
    // Convert the letters into heights, and extract the start and end locations
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
        this.nodes = [];
        this.leaves = [];

        if (root) {
            this.addLeaf(root);
        }
    }

    addLeaf(leaf) {
        this.nodes.push(leaf);
        this.leaves.push(leaf);
    }

    getBestLeaf(heuristic) {
        this.leaves = this.leaves.sort((a, b) => heuristic(a) - heuristic(b));
        return this.leaves.shift();
    }
}

function search(graph, end, grid) {
    // Use A* algorithm to find shortest path and return cost
    while(graph.leaves.length > 0) {
        // Use Manhattan Distance as heuristic to get 'best' leaf to explore
        // Note - calling this function also removes it from the list of leaves
        const leaf = graph.getBestLeaf(n => n.cost + n.distanceTo(end[0], end[1]));
        const { x, y } = leaf;

        // If we've reached the end, we know we have found the optimal route
        if (leaf.x === end[0] && leaf.y === end[1]) {
            return leaf.cost;
        }

        // Determine which directions are navigable based on relative height
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

        // For each navigable direction, see if there is already a node in the graph
        // If there is    - check the cost, and update parent if current path is cheaper
        // If there isn't - create a new leaf in the graph
        for(let i=0; i<nextSteps.length; i++) {
            const [nx, ny] = nextSteps[i];
            const matching = graph.nodes.find(n => n.x === nx && n.y === ny);
            if (matching) {
                if (matching.cost > leaf.cost + 1) {
                    matching.cost = leaf.cost + 1;
                    matching.parent = leaf;

                    // Add back into the set of leaves if needed
                    // This ensures the costs of any children are re-evaluated
                    if (!graph.leaves.find(l => l === matching)) {
                        graph.leaves.push(matching);
                    }
                }
            } else {
                graph.addLeaf(new Node(nx, ny, leaf.cost + 1, leaf));
            }
        }
    }
}

function part1(start, end, grid) {
    const startNode = new Node(start[0], start[1], 0, undefined);
    const graph = new Graph(startNode);

    return search(graph, end, grid);
}

function part2(start, end, grid) {
    const graph = new Graph();

    // Add all the 'a' (zero height) positions as leaves in the graph
    for(let y=0; y<grid.length; y++) {
        for(let x=0; x<grid[y].length; x++ ){
            if (grid[y][x] === 0) {
                graph.addLeaf(new Node(x, y, 0, undefined));
            }
        }
    }

    // Use standard search algorithm to find the shortest path (from any of the roots)
    return search(graph, end, grid);
}

const { start, end, grid } = parse(raw.split("\n"));

log(print(grid, 2, " "));
log("\n");

const p1 = part1(start, end, grid);
console.log(`Part1: ${p1}`);

const p2 = part2(start, end, grid);
console.log(`Part2: ${p2}`);
