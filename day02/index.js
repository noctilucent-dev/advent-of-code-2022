let { DEBUG, raw } = require("../util");

if (DEBUG) {
    raw = `A Y
B X
C Z`;
}

function part1(strategy) {
    const config = {
        'X': {
            beats: 'C',
            draws: 'A',
            score: 1,
        }, 
        'Y': {
            beats: 'A',
            draws: 'B',
            score: 2,
        },
        'Z': {
            beats: 'B',
            draws: 'C',
            score: 3
        }
    };

    let totalScore = 0;

    for(let i=0; i<strategy.length; i++) {
        const played = strategy[i][0];
        const response = strategy[i][1];
        totalScore += config[response].score;
        if (config[response].beats === played) {
            totalScore += 6;
        } else if (config[response].draws === played) {
            totalScore += 3;
        }
    }

    return totalScore;
}

function part2(strategy) {
    const config = {
        'A': {
            'X': 0 + 3,
            'Y': 3 + 1,
            'Z': 6 + 2
        }, 
        'B': {
            'X': 0 + 1,
            'Y': 3 + 2,
            'Z': 6 + 3,
        },
        'C': {
            'X': 0 + 2,
            'Y': 3 + 3,
            'Z': 6 + 1
        }
    };

    let totalScore = 0;

    for(let i=0; i<strategy.length; i++) {
        const played = strategy[i][0];
        const response = strategy[i][1];
        totalScore += config[played][response];
    }

    return totalScore;
}

const strategy = raw.trim().split("\n").map(l => l.split(" "));

const p1 = part1(strategy);
console.log(p1);

const p2 = part2(strategy);
console.log(p2);