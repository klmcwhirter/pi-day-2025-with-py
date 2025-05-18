import * as pi_wasm from './pi-wasm.js';
import { logAS, logJS } from "./utils.mjs";

globalThis.loggingAS = logAS;

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

log_array(pi_wasm.supported_algos(), 'Supported Algorithms');

const TEN_DIGITS = 'Ten_Digits';

logJS('gathering digits...');
const digits = pi_wasm.pi_digits(TEN_DIGITS);
logJS(`pi_wasm.pi_digits('${TEN_DIGITS}')=[${digits}]`);

log_array(pi_wasm.map_colors(digits, 0), 'pi_wasm.map_colors');

const digit_diffs = pi_wasm.cmp_digits(TEN_DIGITS, TEN_DIGITS);

logJS(`cmp_digits('${TEN_DIGITS}', '${TEN_DIGITS}')=[${digit_diffs}]`);
log_array(pi_wasm.map_colors(digit_diffs, 1), `diff colors`);

logJS(`histogram('${TEN_DIGITS}')`);
const rc = pi_wasm.histogram(TEN_DIGITS);
if (rc) {
    logJS(`JS: rc=[${rc}]`);
}

logJS(`pi_wasm.pi_digits_len('Baseline')=${pi_wasm.pi_digits_len('Baseline')}`);
logJS(`pi_wasm.pi_digits_len('BBP')=${pi_wasm.pi_digits_len('BBP')}`);
logJS(`pi_wasm.pi_digits_len('Sinha_Saha')=${pi_wasm.pi_digits_len('Sinha_Saha')}`);

logJS(`histogram('Baseline')`);
const rcb = pi_wasm.histogram('Baseline');
if (rcb) {
    logJS(`JS: rcb=[${rcb}]`);
}
