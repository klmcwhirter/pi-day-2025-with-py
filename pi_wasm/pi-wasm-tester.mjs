import * as pi_wasm from './pi-wasm.js';

import { logAS, logJS } from "./utils.mjs";

console.trace = logAS;

function log_array(arr, msg) {
    logJS(`${msg}:`);
    arr.forEach((e, i) => {
        logJS(`[${i}] ==> [${e}]`);
    });
}

logJS(`pi_wasm.as_version(): '${pi_wasm.as_version()}'`);

// Passing a string across the JS to WASM boundary.
const str = "Hello from AssemblyScript + JS + WASM with unicode ⚡!";
pi_wasm.as_log(str);

logJS('gathering digits...');
const digits = pi_wasm.pi_ten_digits();
logJS(`pi_wasm.pi_ten_digits()=[${digits}]`);

log_array(pi_wasm.map_colors(digits, 0), 'pi_wasm.map_colors');

const rev_digits = digits.toReversed();
const digit_diffs = pi_wasm.cmp_digits(digits, rev_digits);

logJS(`cmp_digits([${digits}], [${rev_digits}])=[${digit_diffs}]`);
log_array(pi_wasm.map_colors(digit_diffs, 1), `diff colors`);

logJS(`histogram([${digits}])`);
const rc = pi_wasm.histogram(digits);
if (rc) {
    logJS(`JS: rc=[${rc}]`);
}

logJS(`pi_wasm.pi_baseline().length=[${pi_wasm.pi_baseline().length}]`);
logJS(`pi_wasm.pi_bbp().length=[${pi_wasm.pi_bbp().length}]`);


logJS(`histogram(baseline)`);
const rcb = pi_wasm.histogram(pi_wasm.pi_baseline());
if (rcb) {
    logJS(`JS: rcb=[${rcb}]`);
}
