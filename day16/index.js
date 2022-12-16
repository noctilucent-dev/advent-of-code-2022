let { DEBUG, log, raw } = require("../util");

if (DEBUG) {
    raw = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;
}

function parse(raw) {
    return raw.split("\n").map(l => {
        let [valve, flowRate, tunnels] = l
            .match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/)
            .slice(1);

        flowRate = Number(flowRate);
        tunnels = tunnels.split(", ");
        
        log(`Valve: ${valve}, Flow rate: ${flowRate}, Tunnels: ${tunnels}`);

        return {
            valve,
            flowRate,
            tunnels
        };
    })
}

function search(valves, current, depth, distances) {
    const valve = valves.find(v => v.valve === current);
    if (!distances[current]) distances[current] = depth;

    for (let i=0; i<valve.tunnels.length; i++) {
        const c = valve.tunnels[i];
        if (!distances[c] || distances[c] > depth + 1) {
            distances[c] = depth + 1;
            search(valves, c, depth + 1, distances);
        }
    }

    return distances;
}

function getDistances(valves) {
    const names = valves.map(v => v.valve);
    const distances = {};
    names.forEach(n => distances[n] = search(valves, n, 0, {}));
    return distances;
}

function part1a(valves) {
    const flowRates = {};
    valves.forEach(v => flowRates[v.valve] = v.flowRate);
    log(flowRates);
    const distances = getDistances(valves);
    log(distances);

    let minutesLeft = 30;
    let flowRate = 0;
    let pressureRelieved = 0;
    let location = "AA";
    let remaining = valves.filter(v => v.flowRate > 0);

    while (minutesLeft > 0) {
        log(`Mins left: ${minutesLeft}, Flow rate: ${flowRate}, Pressure relieved: ${pressureRelieved}`);

        if (remaining.length > 0) {
            const options = remaining.map(v => {
                const distance = distances[location][v.valve];
                
                const value = (minutesLeft - distance - 1) * v.flowRate;
                return {
                    ...v,
                    distance,
                    value
                };
            }).sort((a, b) => b.value - a.value);

            const best = options[0];

            log(`Moving to ${best.valve}, distance: ${best.distance}, value: ${best.value}`);
            minutesLeft -= best.distance + 1;
            pressureRelieved += (best.distance + 1) * flowRate;
            flowRate += best.flowRate;
            remaining = remaining.filter(v => v.valve !== best.valve);
            location = best.valve;
        } else {
            pressureRelieved += flowRate;
            minutesLeft--;
        }
    }

    return pressureRelieved;
}

function p1search(current, remaining, flowRate, minutesRemaining, pressureRelieved, distances) {
    if (remaining.length === 0) {
        return pressureRelieved + (flowRate * minutesRemaining);
    }

    let best = pressureRelieved;
    for (let i=0; i<remaining.length; i++) {
        const next = remaining[i];
        const distanceToNext = distances[current][next.valve];
        let result;
        if (distanceToNext + 1 >= minutesRemaining) {
            result = pressureRelieved + (flowRate * minutesRemaining);
        } else {
        result = p1search(
            next.valve,
            remaining.filter((v, vi) => vi !== i),
            flowRate + next.flowRate,
            minutesRemaining - distanceToNext - 1,
            pressureRelieved + (flowRate * (distanceToNext + 1)),
            distances);
        }
        if (result > best) best = result;
    }
    return best;
}

function part1(valves) {
    const distances = getDistances(valves);
    const remaining = valves.filter(v => v.flowRate > 0);
    return p1search("AA", remaining, 0, 30, 0, distances);
}

function p2search(mLoc, mRate, mTime, eLoc, eRate, eTime, remainingValves, flowRate, minutesRemaining, pressureRelieved, distances) {
    while(minutesRemaining > 0) {
        if (mTime === 0) {
            flowRate += mRate;
            if (remainingValves.length > 0) {
                let best = pressureRelieved;
                for (let i=0; i<remainingValves.length; i++) {
                    const next = remainingValves[i];
                    const result = p2search(
                        next.valve,
                        next.flowRate,
                        distances[mLoc][next.valve] + 1,
                        eLoc, eRate, eTime,
                        remainingValves.filter((_, vi) => vi !== i),
                        flowRate,
                        minutesRemaining,
                        pressureRelieved,
                        distances
                    );
                    if (result > best) best = result;
                }
                return best;
            }
        } else if (eTime === 0) {
            flowRate += eRate;
            if (remainingValves.length > 0) {
                let best = pressureRelieved;
                for (let i=0; i<remainingValves.length; i++) {
                    const next = remainingValves[i];
                    const result = p2search(
                        mLoc, mRate, mTime,
                        next.valve,
                        next.flowRate,
                        distances[eLoc][next.valve] + 1,
                        remainingValves.filter((_, vi) => vi !== i),
                        flowRate,
                        minutesRemaining,
                        pressureRelieved,
                        distances
                    );
                    if (result > best) best = result;
                }
                return best;
            }
        }

        minutesRemaining--;
        mTime--;
        eTime--;
        pressureRelieved += flowRate;
    }

    return pressureRelieved;
}

function part2(valves) {
    const distances = getDistances(valves);
    const remaining = valves.filter(v => v.flowRate > 0);
    return p2search("AA", 0, 0, "AA", 0, 0, remaining, 0, 26, 0, distances);
}

const valves = parse(raw);
log(valves);

const p1 = part1(valves);
console.log(`Part1: ${p1}`);

const p2 = part2(valves);
console.log(`Part2: ${p2}`);