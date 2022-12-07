let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;
}

function dir(name, parent) {
    return {
        type: "dir",
        name,
        parent,
        children: [],
        files: []
    };
}

function file(name, size, parent) {
    return {
        type: "file",
        name,
        size,
        parent
    };
}

function parse(lines) {
    const root = dir("/");
    let current;

    for(let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i].split(" ");

        if (a === "$") {
            if (b === "ls") continue;
            
            // cd
            if (c === "/") {
                current = root;
            } else if (c === "..") {
                current = current.parent;
            } else {
                current = current.children.find(i => i.name === c);
            }
        } else if (a === "dir") {
            current.children.push(dir(b, current));
        } else {
            current.files.push(file(b, Number(a)));
        }
    }

    return root;
}

function printTree(root, depth = 0) {
    let line = "";
    
    for(let i=0; i<depth * 2; i++) line += " ";

    line += `- ${root.name} `;
    
    if (root.type === "file") {
        line += `(file, size=${root.size})`;
        console.log(line);
        return;
    }
    
    line += `(dir)`;
    console.log(line);

    [...root.children, ...root.files]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(c => printTree(c, depth+1));
}

function setSizes(root) {
    if (root.size !== undefined) return root.size;
    
    root.size = root.files.reduce((p, c) => p + c.size, 0);
    root.size += root.children.reduce((p, c) => p + setSizes(c), 0);

    return root.size;
}

function travese(root, action) {
    action(root);
    root.children.forEach(c => travese(c, action));
}

function part1(root) {
    setSizes(root);
    const dirs = [];

    travese(root, c => { if (c.size <= 100000) dirs.push(c); });

    return dirs.map(d => d.size).reduce((p, c) => p + c, 0);
}

function part2(root) {
    setSizes(root);
    const minSize = 30000000 - (70000000 - root.size);
    const dirs = [];

    travese(root, c => { if (c.size >= minSize) dirs.push(c); });
    
    dirs.sort((a, b) => a.size - b.size);
    return dirs[0].size;
}

const lines = raw.trim().split("\n");
const root = parse(lines);

if (DEBUG) {
    printTree(root);
}

const p1 = part1(root);
console.log(`Part1: ${p1}`);

const p2 = part2(root);
console.log(`Part2: ${p2}`);
