import * as pi_wasm from './pi-digits.js';
import { logJS } from "./utils.mjs";

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

const supported_algos = pi_wasm.supported_algos();
log_array(supported_algos, 'Supported Algorithms');

const BASELINE = supported_algos[0];
const BBP = supported_algos[1];
const SINHA_SAHA = supported_algos[4];
const TEN_DIGITS = supported_algos[6];
const TEST_TEN = supported_algos[7];

logJS('gathering digits...');
const digits = pi_wasm.pi_digits(TEN_DIGITS);
logJS(`pi_wasm.pi_digits('${TEN_DIGITS}')=[${digits}]`);

log_array(pi_wasm.map_colors(digits, 0), 'pi_wasm.map_colors');

const digit_diffs = pi_wasm.cmp_digits(TEN_DIGITS, TEST_TEN);

logJS(`cmp_digits('${TEN_DIGITS}', '${TEST_TEN}')=[${digit_diffs}]`);
log_array(pi_wasm.map_colors(digit_diffs, 1), `diff colors`);

logJS(`histogram('${TEN_DIGITS}')`);
const rc = pi_wasm.histogram(TEN_DIGITS);
if (rc) {
    logJS(`JS: rc=[${rc}]`);
}

logJS(`pi_wasm.pi_digits_len('${BASELINE}')=${pi_wasm.pi_digits_len(BASELINE)}`);
logJS(`pi_wasm.pi_digits_len('${BBP}')=${pi_wasm.pi_digits_len(BBP)}`);
logJS(`pi_wasm.pi_digits_len('${SINHA_SAHA}')=${pi_wasm.pi_digits_len(SINHA_SAHA)}`);

logJS(`histogram('${BASELINE}')`);
const rcb = pi_wasm.histogram(BASELINE);
if (rcb) {
    logJS(`JS: rcb=[${rcb}]`);
}
