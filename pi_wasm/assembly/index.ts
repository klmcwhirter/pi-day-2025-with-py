
import { palette_from_id } from "./colors";
import { pi_baseline_seed } from './pi-digits/pi_baseline';
import { pi_bbp_seed } from './pi-digits/pi_bbp';
import { pi_bellard_seed } from './pi-digits/pi_bellard';
import { pi_gosper_seed } from './pi-digits/pi_gosper';
import { pi_sinha_saha_seed } from './pi-digits/pi_sinha_saha';
import { pi_tachus_seed } from './pi-digits/pi_tachus';
import { pi_ten_digits_seed } from './pi-digits/pi_ten_digits';

// hack until AssemblyScript allows customization with ESM bindings
// console.trace just happens to be bound and we don't need it

// See: https://www.assemblyscript.org/compiler.html#host-bindings
// > These assumptions cannot be intercepted or customized since,
// > to provide static ESM exports from the bindings file directly,
// > instantiation must start immediately when the bindings file is imported.
// > If customization is required, --bindings raw can be used instead.

// Make sure that `globalThis.loggingAS = logAS;` is set early in the client code
@external('env', 'loggingAS')
declare function loggingAS(msg: string): void;

export function as_log(msg: string): void {
  loggingAS(msg);
}

export function as_version(): string {
  return `assemblyscript: ${ASC_VERSION_MAJOR}.${ASC_VERSION_MINOR}.${ASC_VERSION_PATCH}`;
}

const algos = new Map<string, u8[]>();

function init_algos(): void {
  // Make sure the keys match those in pi.context.tsx#PiAlgorithms.
  algos
    .set('Baseline', pi_baseline_seed)
    .set('BBP', pi_bbp_seed)
    .set('Bellard', pi_bellard_seed)
    .set('Gosper', pi_gosper_seed)
    .set('Sinha_Saha', pi_sinha_saha_seed)
    .set('Tachus', pi_tachus_seed)
    .set('Ten_Digits', pi_ten_digits_seed);
}

export function supported_algos(): string[] {
  if (algos.size === 0) {
    init_algos();
  }
  return algos.keys();
}

export function cmp_digits(src_algo: string, other_algo: string): u8[] {
  as_log(`cmp_digits('${src_algo}', '${other_algo}')`);

  const src = algos.has(src_algo) ? algos.get(src_algo) : [];
  const other = algos.has(other_algo) ? algos.get(other_algo) : [];

  const rc: u8[] = [];
  rc.fill(0, src.length);

  for (let i = 0; i < src.length; i++) {
    if (i < other.length) {
      if (src[i] === other[i]) {
        rc[i] = 1;
      }
    }
  }

  return rc;
}

export function histogram(src_algo: string): i32[] {
  const src = algos.has(src_algo) ? algos.get(src_algo) : [];

  as_log(`histogram('${src_algo}'), src.length=${src.length}`);

  const rc: i32[] = new Array<i32>(10);
  // rc.fill(0, 10);

  for (let i = 0; i < src.length; i++) {
    const digit: i32 = i32(src[i]);
    rc[digit] += 1;
  }

  return rc;
}

export function map_colors(src: u8[], palette_id: u8): u8[][] {
  const rc: u8[][] = new Array<u8[]>(src.length);

  const palette = palette_from_id(palette_id);
  // rc.fill([0, 0, 0], src.length);

  for (let i = 0; i < src.length; i++) {
    rc[i] = palette[src[i]];
  }

  return rc;
}

export function pi_digits(algo: string): u8[] {
  return algos.has(algo) ? algos.get(algo) : [];
}

export function pi_digits_len(algo: string): i32 {
  const pi = pi_digits(algo);
  return pi.length;
}

