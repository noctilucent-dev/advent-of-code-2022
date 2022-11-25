const fs = require("fs");

let raw = fs.readFileSync("input.txt", "utf8").toString();

// set true to use sample data and draw map
let DEBUG = !!process.env.DEBUG;

function log(l) {
    if (DEBUG) {
        console.log(l);
    }
}

function deepClone(arr) {
    return [...arr.map(l => [...l])];
}

module.exports = {
    raw,
    DEBUG,
    log,
    deepClone
};