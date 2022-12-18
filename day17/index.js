const { Console } = require("console");
let { DEBUG, deepClone, log, raw } = require("../util");

if (DEBUG) {
    raw = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;
}

// ####
const shape1 = {
    index: 0,
    width: 4,
    height: 1,
    rows: [0b1111]
};

//  #
// ###
//  #
const shape2 = {
    index: 1,
    width: 3,
    height: 3,
    rows: [
        0b010,
        0b111,
        0b010]
};

//   #
//   #
// ###
const shape3 = {
    index: 2,
    width: 3,
    height: 3,
    rows: [
        0b001,
        0b001,
        0b111
    ]
};

// #
// #
// #
// #
const shape4 = {
    index: 3,
    width: 1,
    height: 4,
    rows: [
        0b1,
        0b1,
        0b1,
        0b1
    ]
};

// ##
// ##
const shape5 = {
    index: 4,
    width: 2,
    height: 2,
    rows: [
        0b11,
        0b11
    ]
};

const allShapes = [
    shape1, shape2, shape3, shape4, shape5
];

function* jetIterator(offset = 0) {
    for (let i=offset; true; i = (i+1) % raw.length) {
        yield raw[i];
    }
}

function* shapeIterator(offset = 0) {
    for (let i=offset; true; i = (i + 1) % allShapes.length) {
        yield allShapes[i];
    }
}

function emptyChamber() {
    return [0b1111111];
}

function getShiftLeft(shape, col) {
    return 7 - col - shape.width;
}

function canMoveLeft(shape, row, col, chamber) {
    if (col === 0) return false;
    const shiftLeft = getShiftLeft(shape, col) + 1;

    for(let y=0; y<shape.height; y++) {
        const chamberRow = chamber[row+y];
        if (!chamberRow) continue;
        
        let shapeRow = shape.rows[shape.height-y-1];
        shapeRow = shapeRow << shiftLeft;
        if ((shapeRow & chamberRow) > 0) return false;
    }

    return true;
}

function canMoveRight(shape, row, col, chamber) {
    // check for right-edge
    if (col + shape.width >= 7) return false;

    const shiftLeft = getShiftLeft(shape, col) - 1;

    for(let y=0; y<shape.height; y++) {
        const chamberRow = chamber[row+y];
        if (!chamberRow) continue;
        
        let shapeRow = shape.rows[shape.height-y-1];
        shapeRow = shapeRow << shiftLeft;
        if ((shapeRow & chamberRow) > 0) return false;
    }

    return true;
}

let minRow = 0;

function canMoveDown(shape, row, col, chamber) {
    if (chamber.length - row > minRow) {
        minRow = chamber.length - row;
        console.log(`Max depth: ${minRow}, height: ${chamber.length}`);
    }
    if (row === 0) throw new Error("Hit bottom");
    const shiftLeft = getShiftLeft(shape, col);

    for (let y=0; y<shape.height; y++) {
        const chamberRow = chamber[row-1+y];
        if (!chamberRow) continue;
        
        let shapeRow = shape.rows[shape.rows.length-y-1];
        shapeRow = shapeRow << shiftLeft;
        if ((chamberRow & shapeRow) > 0) return false;
    }

    return true;
}

function setShape(shape, row, col, chamber) {
    const shiftLeft = getShiftLeft(shape, col);
    for (let y=0; y<shape.height; y++) {
        let shapeRow = shape.rows[shape.rows.length - y - 1];
        shapeRow = shapeRow << shiftLeft;
        chamber[y+row] = chamber[y+row] | shapeRow;
    }
}

function printChamber(chamber, shape, row, col) {
    if (!DEBUG) return;

    if (shape) {
        let lines = [];
        for (let i=0; i<row+shape.height; i++) {
            lines.push(chamber[i] || 0x0000000);
        }
        lines = lines
            .map(r => (`0000000${r.toString(2)}`.slice(-7)).split("").map(Number).map(c => c ? '#' : '.'));

        const shiftLeft = getShiftLeft(shape, col);
        for(let y=0; y<shape.height; y++) {
            let shapeRow = shape.rows[shape.rows.length - y - 1];
            shapeRow = shapeRow << shiftLeft;
            shapeRow = `0000000${shapeRow.toString(2)}`.slice(-7).split("").map(Number);
            for(let x=0; x<7; x++) {
                if (shapeRow[x]) lines[row+y][x] = '@';
            }
        }
        return [...lines].reverse().map(l => l.join("")).join("\n");
    }

    return [...chamber]
        .reverse()
        .map(r => (`0000000${r.toString(2)}`.slice(-7)).split("").map(Number).map(c => c ? '#' : '.').join("")).join("\n");
}

const check = [1,4,6,7,9,10,13,15,17,17,18,21,23,23,25,26,29,32,36,36,37,39,42,42,43,44,47,49,51,51,51,53,56,60,60,61,63,64,66,66,67,69,70,72,72,73,76,78,78,78,79,82,85,89,89,90,92,95,95,96,97,100,102,104,104,104,106,109,113,113,114,116,117,119,119,120,122,123,125,125,126,129,131,131,131,132,135,138,142,142,143,145,148,148,149,150,153,155,157,157,157,159,162,166,166,167,169,170,172,172,173,175,176,178,178,179,182,184,184,184,185,188,191,195,195,196,198,201,201,202,203,206,208,210,210,210,212,215,219,219,220,222,223,225,225,226,228,229,231,231,232,235,237,237,237,238,241,244,248,248,249,251,254,254,255,256,259,261,263,263,263,265,268,272,272,273,275,276,278,278,279,281,282,284,284,285,288,290,290,290,291,294,297,301,301,302,304,307,307,308,309,312,314,316,316,316,318,321,325,325,326,328,329,331,331,332,334,335,337,337,338,341,343,343,343,344,347,350,354,354,355,357,360,360,361,362,365,367,369,369,369,371,374,378,378,379,381,382,384,384,385,387,388,390,390,391,394,396,396,396,397,400,403,407,407,408,410,413,413,414,415,418,420,422,422,422,424,427,431,431,432,434,435,437,437,438,440,441,443,443,444,447,449,449,449,450,453,456,460,460,461,463,466,466,467,468,471,473,475,475,475,477,480,484,484,485,487,488,490,490,491,493,494,496,496,497,500,502,502,502,503,506,509,513,513,514,516,519,519,520,521,524,526,528,528,528,530,533,537,537,538,540,541,543,543,544,546,547,549,549,550,553,555,555,555,556,559,562,566,566,567,569,572,572,573,574,577,579,581,581,581,583,586,590,590,591,593,594,596,596,597,599,600,602,602,603,606,608,608,608,609,612,615,619,619,620,622,625,625,626,627,630,632,634,634,634,636,639,643,643,644,646,647,649,649,650,652,653,655,655,656,659,661,661,661,662,665,668,672,672,673,675,678,678,679,680,683,685,687,687,687,689,692,696,696,697,699,700,702,702,703,705,706,708,708,709,712,714,714,714,715,718,721,725,725,726,728,731,731,732,733,736,738,740,740,740,742,745,749,749,750,752,753,755,755,756,758,759,761,761,762,765,767,767,767,768,771,774,778,778,779,781,784,784,785,786,789,791,793,793,793,795,798,802,802,803,805,806,808,808,809,811,812,814,814,815,818,820,820,820,821,824,827,831,831,832,834,837,837,838,839,842,844,846,846,846,848,851,855,855,856,858,859,861,861,862,864,865,867,867,868,871,873,873,873,874,877,880,884,884,885,887,890,890,891,892,895,897,899,899,899,901,904,908,908,909,911,912,914,914,915,917,918,920,920,921,924,926,926,926,927,930,933,937,937,938,940,943,943,944,945,948,950,952,952,952,954,957,961,961,962,964,965,967,967,968,970,971,973,973,974,977,979,979,979,980,983,986,990,990,991,993,996,996,997,998,1001,1003,1005,1005,1005,1007,1010,1014,1014,1015,1017,1018,1020,1020,1021,1023,1024,1026,1026,1027,1030,1032,1032,1032,1033,1036,1039,1043,1043,1044,1046,1049,1049,1050,1051,1054,1056,1058,1058,1058,1060,1063,1067,1067,1068,1070,1071,1073,1073,1074,1076,1077,1079,1079,1080,1083,1085,1085,1085,1086,1089,1092,1096,1096,1097,1099,1102,1102,1103,1104,1107,1109,1111,1111,1111,1113,1116,1120,1120,1121,1123,1124,1126,1126,1127,1129,1130,1132,1132,1133,1136,1138,1138,1138,1139,1142,1145,1149,1149,1150,1152,1155,1155,1156,1157,1160,1162,1164,1164,1164,1166,1169,1173,1173,1174,1176,1177,1179,1179,1180,1182,1183,1185,1185,1186,1189,1191,1191,1191,1192,1195,1198,1202,1202,1203,1205,1208,1208,1209,1210,1213,1215,1217,1217,1217,1219,1222,1226,1226,1227,1229,1230,1232,1232,1233,1235,1236,1238,1238,1239,1242,1244,1244,1244,1245,1248,1251,1255,1255,1256,1258,1261,1261,1262,1263,1266,1268,1270,1270,1270,1272,1275,1279,1279,1280,1282,1283,1285,1285,1286,1288,1289,1291,1291,1292,1295,1297,1297,1297,1298,1301,1304,1308,1308,1309,1311,1314,1314,1315,1316,1319,1321,1323,1323,1323,1325,1328,1332,1332,1333,1335,1336,1338,1338,1339,1341,1342,1344,1344,1345,1348,1350,1350,1350,1351,1354,1357,1361,1361,1362,1364,1367,1367,1368,1369,1372,1374,1376,1376,1376,1378,1381,1385,1385,1386,1388,1389,1391,1391,1392,1394,1395,1397,1397,1398,1401,1403,1403,1403,1404,1407,1410,1414,1414,1415,1417,1420,1420,1421,1422,1425,1427,1429,1429,1429,1431,1434,1438,1438,1439,1441,1442,1444,1444,1445,1447,1448,1450,1450,1451,1454,1456,1456,1456,1457,1460,1463,1467,1467,1468,1470,1473,1473,1474,1475,1478,1480,1482,1482,1482,1484,1487,1491,1491,1492,1494,1495,1497,1497,1498,1500,1501,1503,1503,1504,1507,1509,1509,1509,1510,1513,1516,1520,1520,1521,1523,1526,1526,1527,1528,1531,1533,1535,1535,1535,1537,1540,1544,1544,1545,1547,1548,1550,1550,1551,1553,1554,1556,1556,1557,1560,1562,1562,1562,1563,1566,1569,1573,1573,1574,1576,1579,1579,1580,1581,1584,1586,1588,1588,1588,1590,1593,1597,1597,1598,1600,1601,1603,1603,1604,1606,1607,1609,1609,1610,1613,1615,1615,1615,1616,1619,1622,1626,1626,1627,1629,1632,1632,1633,1634,1637,1639,1641,1641,1641,1643,1646,1650,1650,1651,1653,1654,1656,1656,1657,1659,1660,1662,1662,1663,1666,1668,1668,1668,1669,1672,1675,1679,1679,1680,1682,1685,1685,1686,1687,1690,1692,1694,1694,1694,1696,1699,1703,1703,1704,1706,1707,1709,1709,1710,1712,1713,1715,1715,1716,1719,1721,1721,1721,1722,1725,1728,1732,1732,1733,1735,1738,1738,1739,1740,1743,1745,1747,1747,1747,1749,1752,1756,1756,1757,1759,1760,1762,1762,1763,1765,1766,1768,1768,1769,1772,1774,1774,1774,1775,1778,1781,1785,1785,1786,1788,1791,1791,1792,1793,1796,1798,1800,1800,1800,1802,1805,1809,1809,1810,1812,1813,1815,1815,1816,1818,1819,1821,1821,1822,1825,1827,1827,1827,1828,1831,1834,1838,1838,1839,1841,1844,1844,1845,1846,1849,1851,1853,1853,1853,1855,1858,1862,1862,1863,1865,1866,1868,1868,1869,1871,1872,1874,1874,1875,1878,1880,1880,1880,1881,1884,1887,1891,1891,1892,1894,1897,1897,1898,1899,1902,1904,1906,1906,1906,1908,1911,1915,1915,1916,1918,1919,1921,1921,1922,1924,1925,1927,1927,1928,1931,1933,1933,1933,1934,1937,1940,1944,1944,1945,1947,1950,1950,1951,1952,1955,1957,1959,1959,1959,1961,1964,1968,1968,1969,1971,1972,1974,1974,1975,1977,1978,1980,1980,1981,1984,1986,1986,1986,1987,1990,1993,1997,1997,1998,2000,2003,2003,2004,2005,2008,2010,2012,2012,2012,2014,2017,2021,2021,2022,2024,2025,2027,2027,2028,2030,2031,2033,2033,2034,2037,2039,2039,2039,2040,2043,2046,2050,2050,2051,2053,2056,2056,2057,2058,2061,2063,2065,2065,2065,2067,2070,2074,2074,2075,2077,2078,2080,2080,2081,2083,2084,2086,2086,2087,2090,2092,2092,2092,2093,2096,2099,2103,2103,2104,2106,2109,2109,2110,2111,2114,2116,2118,2118,2118,2120,2123,2127,2127,2128,2130,2131,2133,2133,2134,2136,2137,2139,2139,2140,2143,2145,2145,2145,2146,2149,2152,2156,2156,2157,2159,2162,2162,2163,2164,2167,2169,2171,2171,2171,2173,2176,2180,2180,2181,2183,2184,2186,2186,2187,2189,2190,2192,2192,2193,2196,2198,2198,2198,2199,2202,2205,2209,2209,2210,2212,2215,2215,2216,2217,2220,2222,2224,2224,2224,2226,2229,2233,2233,2234,2236,2237,2239,2239,2240,2242,2243,2245,2245,2246,2249,2251,2251,2251,2252,2255,2258,2262,2262,2263,2265,2268,2268,2269,2270,2273,2275,2277,2277,2277,2279,2282,2286,2286,2287,2289,2290,2292,2292,2293,2295,2296,2298,2298,2299,2302,2304,2304,2304,2305,2308,2311,2315,2315,2316,2318,2321,2321,2322,2323,2326,2328,2330,2330,2330,2332,2335,2339,2339,2340,2342,2343,2345,2345,2346,2348,2349,2351,2351,2352,2355,2357,2357,2357,2358,2361,2364,2368,2368,2369,2371,2374,2374,2375,2376,2379,2381,2383,2383,2383,2385,2388,2392,2392,2393,2395,2396,2398,2398,2399,2401,2402,2404,2404,2405,2408,2410,2410,2410,2411,2414,2417,2421,2421,2422,2424,2427,2427,2428,2429,2432,2434,2436,2436,2436,2438,2441,2445,2445,2446,2448,2449,2451,2451,2452,2454,2455,2457,2457,2458,2461,2463,2463,2463,2464,2467,2470,2474,2474,2475,2477,2480,2480,2481,2482,2485,2487,2489,2489,2489,2491,2494,2498,2498,2499,2501,2502,2504,2504,2505,2507,2508,2510,2510,2511,2514,2516,2516,2516,2517,2520,2523,2527,2527,2528,2530,2533,2533,2534,2535,2538,2540,2542,2542,2542,2544,2547,2551,2551,2552,2554,2555,2557,2557,2558,2560,2561,2563,2563,2564,2567,2569,2569,2569,2570,2573,2576,2580,2580,2581,2583,2586,2586,2587,2588,2591,2593,2595,2595,2595,2597,2600,2604,2604,2605,2607,2608,2610,2610,2611,2613,2614,2616,2616,2617,2620,2622,2622,2622,2623,2626,2629,2633,2633,2634,2636,2639,2639,2640,2641,2644,2646,2648,2648,2648,2650,2653,2657,2657,2658,2660,2661,2663,2663,2664,2666,2667,2669,2669,2670,2673,2675,2675,2675,2676,2679,2682,2686,2686,2687,2689,2692,2692,2693,2694,2697,2699,2701,2701,2701,2703,2706,2710,2710,2711,2713,2714,2716,2716,2717,2719,2720,2722,2722,2723,2726,2728,2728,2728,2729,2732,2735,2739,2739,2740,2742,2745,2745,2746,2747,2750,2752,2754,2754,2754,2756,2759,2763,2763,2764,2766,2767,2769,2769,2770,2772,2773,2775,2775,2776,2779,2781,2781,2781,2782,2785,2788,2792,2792,2793,2795,2798,2798,2799,2800,2803,2805,2807,2807,2807,2809,2812,2816,2816,2817,2819,2820,2822,2822,2823,2825,2826,2828,2828,2829,2832,2834,2834,2834,2835,2838,2841,2845,2845,2846,2848,2851,2851,2852,2853,2856,2858,2860,2860,2860,2862,2865,2869,2869,2870,2872,2873,2875,2875,2876,2878,2879,2881,2881,2882,2885,2887,2887,2887,2888,2891,2894,2898,2898,2899,2901,2904,2904,2905,2906,2909,2911,2913,2913,2913,2915,2918,2922,2922,2923,2925,2926,2928,2928,2929,2931,2932,2934,2934,2935,2938,2940,2940,2940,2941,2944,2947,2951,2951,2952,2954,2957,2957,2958,2959,2962,2964,2966,2966,2966,2968,2971,2975,2975,2976,2978,2979,2981,2981,2982,2984,2985,2987,2987,2988,2991,2993,2993,2993,2994,2997,3000,3004,3004,3005,3007,3010,3010,3011,3012,3015,3017,3019,3019,3019,3021,3024,3028,3028,3029,3031,3032,3034,3034,3035,3037,3038,3040,3040,3041,3044,3046,3046,3046,3047,3050,3053,3057,3057,3058,3060,3063,3063,3064,3065,3068];

function part1() {
    const jets = jetIterator();
    const shapes = shapeIterator();
    let chamber = emptyChamber();
    let topRow = 0;
    let maxDepth = 0;

    let shapeCount = 0;
    for (let i=0; i<2022; i++) {
        const shape = shapes.next().value;
        shapeCount++;
        if (shapeCount === 2023) break;
        let row = topRow + 4;
        let col = 2;
        //if (i<=11) log(printChamber(chamber, shape, row, col) + "\n");
        while(true) {
            // if (i === 21) {
            //     log(printChamber(chamber, shape, row, col) + "\n");
            // }
            const jet = jets.next().value;
            if (jet === '>' && canMoveRight(shape, row, col, chamber)) {
                col++;
            } else if (jet === '<' && canMoveLeft(shape, row, col, chamber)) {
                col--;
            }
            if (canMoveDown(shape, row, col, chamber)) {
                row--;
            } else {
                setShape(shape, row, col, chamber);
                topRow = Math.max(topRow, row + shape.height - 1);
                if (row < topRow && topRow - row > maxDepth) maxDepth = topRow - row;
                if (DEBUG && topRow !== check[i]) {
                    log("===============");
                    log(printChamber(chamber));
                    throw new Error(`Incorrect height after rock ${i} - expected ${check[i]} but is ${topRow}`);
                }
                break;
            }
        }
    }

    console.log(`Max depth: ${maxDepth}`);

    log(printChamber(chamber.slice(-10)));


    return topRow;
}

const cache = {};

function memoize(f, args, meta) {
    const s = JSON.stringify(args);
    if (cache[s]) {
        // log(`Cached: ${s}`);
        return cache[s];
    }
    // log(`Not cached: ${s}`);
    const r = f(...args);
    cache[s] = {
        cached: true,
        ...meta,
        ...r
    };
    return r;
}

function canMoveRight2(shape, col, chamber) {
    // check for right-edge
    if (col + shape.width >= 7) return false;

    const shiftLeft = getShiftLeft(shape, col) - 1;

    for(let y=0; y<shape.height; y++) {
        const chamberRow = chamber[y+1];
        if (!chamberRow) continue;
        
        let shapeRow = shape.rows[shape.height-y-1];
        shapeRow = shapeRow << shiftLeft;
        if ((shapeRow & chamberRow) > 0) return false;
    }

    return true;
}

function canMoveDown2(shape, col, chamber) {
    const shiftLeft = getShiftLeft(shape, col);

    for (let y=0; y<shape.height; y++) {
        const chamberRow = chamber[y];
        if (!chamberRow) continue;
        
        let shapeRow = shape.rows[shape.rows.length-y-1];
        shapeRow = shapeRow << shiftLeft;
        if ((chamberRow & shapeRow) > 0) return false;
    }

    return true;
}


function fitShape(shapeIndex, jetIndex, chamber, topRow) {
    const shape = allShapes[shapeIndex];
    let row = topRow + 4;
    let col = 2;

    while(true) {
        const jet = raw[jetIndex];
        jetIndex = (jetIndex + 1) % raw.length;

        if (jet === '>' && canMoveRight(shape, row, col, chamber)) {
            col++;
        } else if (jet === '<' && canMoveLeft(shape, row, col, chamber)) {
            col--;
        }
        if (canMoveDown(shape, row, col, chamber)) {
            row--;
        } else {
            setShape(shape, row, col, chamber);
            topRow = Math.max(topRow, row + shape.height - 1);
            break;
        }
    }

    return {
        chamber,
        jetIndex,
        topRow
    };
}

function part2() {
    const MAX_HEIGHT = 100;
    const LIMIT = BigInt("1000000000000");

    let chamber = emptyChamber();
    let topRow = 0;
    let offset = BigInt(0);

    let shapeCount = BigInt(0);
    let shapeIndex = 0;
    let jetIndex = 0;
    while(true) {
        const r = memoize(fitShape, [shapeIndex, jetIndex, [...chamber], topRow], { shapeCount, actualTop: offset + BigInt(topRow) });

        if (r.cached) {
            const loopLength = shapeCount - r.shapeCount;
            const loopGrow = (BigInt(topRow) + offset) - r.actualTop;
            console.log(`Count ${shapeCount} repeats ${r.shapeCount}`);
            const initialCount = r.shapeCount;
            const loops = (LIMIT - r.shapeCount) / loopLength;
            const remainder = (LIMIT - r.shapeCount) % loopLength;
            const last = cache[Object.getOwnPropertyNames(cache).find(n => cache[n].shapeCount === r.shapeCount + remainder)];
            const remainderAdd = last.actualTop - r.actualTop;
            return r.actualTop + (loops * loopGrow) + remainderAdd;
        }

        jetIndex = r.jetIndex;
        topRow = r.topRow;
        chamber = r.chamber;
        shapeCount = shapeCount + BigInt(1);
        shapeIndex = (shapeIndex + 1) % allShapes.length;

        if (topRow < chamber.length - 1) chamber = chamber.slice(0, topRow+1);
        if (topRow >= chamber.length) {
            throw new Error(`Overtopped`);
        }

        // if (topRow + offset !== check[shapeCount-1]) {
        //     throw new Error(`Mismatch for shape ${shapeCount - 1}`);
        // }

        //if (shapeCount < 11) log(printChamber(chamber) + "\n");

        if (topRow > MAX_HEIGHT) {
            const toRemove = topRow - MAX_HEIGHT;
            offset = offset + BigInt(toRemove);
            chamber = chamber.slice(toRemove);
            topRow -= toRemove;
        }
        
        if (shapeCount === LIMIT) break;
    }

    log(printChamber(chamber.slice(-10)));

    return topRow + offset;
}

const p1 = part1();
console.log(`Part1: ${p1}`);

const p2 = part2();
console.log(`Part2: ${p2}`);
