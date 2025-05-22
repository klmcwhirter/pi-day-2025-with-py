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
const TEN_DIGITS = supported_algos[6];
const TEST_TEN = supported_algos[7];


const digits = pi_wasm.pi_digits(TEN_DIGITS);
logJS(`pi_wasm.pi_digits('${TEN_DIGITS}')=[${digits}]`);
log_array(pi_wasm.map_colors(digits, 0), 'pi_wasm.map_colors');


const digit_matches = pi_wasm.cmp_digits(TEN_DIGITS, TEST_TEN);

logJS(`cmp_digits('${TEN_DIGITS}', '${TEST_TEN}')=[${digit_matches}]`);
log_array(pi_wasm.map_colors(digit_matches, 1), `diff colors`);


logJS(`histogram('${TEN_DIGITS}')`);
const rc = pi_wasm.histogram(TEN_DIGITS);
if (rc) {
    logJS(`JS: rc=[${rc}]`);
}

supported_algos.forEach((algo) => {
    logJS(`pi_wasm.pi_digits_len('${algo}')=${pi_wasm.pi_digits_len(algo, true)}`);
});


logJS(`histogram('${BASELINE}')=[${pi_wasm.histogram(BASELINE)}]`);
