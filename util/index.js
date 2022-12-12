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

function recursiveCompare(obj, reference){
    if(obj === reference) return true;
    if(obj.constructor !== reference.constructor) return false;
    if(obj instanceof Array){
         if(obj.length !== reference.length) return false;
         for(var i=0, len=obj.length; i<len; i++){
             if(typeof obj[i] == "object" && typeof reference[j] == "object"){
                 if(!recursiveCompare(obj[i], reference[i])) return false;
             }
             else if(obj[i] !== reference[i]) return false;
         }
    }
    else {
        var objListCounter = 0;
        var refListCounter = 0;
        for(var i in obj){
            objListCounter++;
            if(typeof obj[i] == "object" && typeof reference[i] == "object"){
                if(!recursiveCompare(obj[i], reference[i])) return false;
            }
            else if(obj[i] !== reference[i]) return false;
        }
        for(var i in reference) refListCounter++;
        if(objListCounter !== refListCounter) return false;
    }
    return true; //Every object and array is equal
}

module.exports = {
    raw,
    DEBUG,
    log,
    deepClone,
    recursiveCompare
};