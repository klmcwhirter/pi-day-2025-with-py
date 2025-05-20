
import { palette_from_id } from "./colors";
import { pi_baseline_seed } from './pi-digits/pi_baseline';
import { pi_bbp_seed } from './pi-digits/pi_bbp';
import { pi_bellard_seed } from './pi-digits/pi_bellard';
import { pi_gosper_seed } from './pi-digits/pi_gosper';
import { pi_sinha_saha_seed } from './pi-digits/pi_sinha_saha';
import { pi_tachus_seed } from './pi-digits/pi_tachus';
import { pi_ten_digits_seed } from './pi-digits/pi_ten_digits';


@external('./utils.mjs', 'logAS')
declare function logAS(msg: string): void;

export function as_log(msg: string): void {
  logAS(msg);
}

export function as_version(): string {
  return `assemblyscript: ${ASC_VERSION_MAJOR}.${ASC_VERSION_MINOR}.${ASC_VERSION_PATCH}`;
}

const algos = new Map<string, u8[]>();

function init_algos(): void {
  if (algos.size === 0) {
    // Make sure the keys match those in pi.context.tsx#PiAlgorithms.
    algos
      .set('Baseline', pi_baseline_seed)
      .set('BBP', pi_bbp_seed)
      .set('Bellard', pi_bellard_seed)
      .set('Gosper', pi_gosper_seed)
      .set('Sinha_Saha', pi_sinha_saha_seed)
      .set('Tachus', pi_tachus_seed)
      .set('Ten_Digits', pi_ten_digits_seed)
      // For testing purposes only - reverse Ten_Digits
      .set('test-ten', pi_ten_digits_seed.map((_v: u8, i: i32, a: u8[]): u8 => a[9 - i]));
  }
}

export function supported_algos(): string[] {
  as_log('supported_algos()');

  init_algos();
  return algos.keys();
}

export function cmp_digits(src_algo: string, other_algo: string): u8[] {
  as_log(`cmp_digits('${src_algo}', '${other_algo}')`);

  init_algos();

  const src = pi_digits(src_algo, true);
  const other = pi_digits(other_algo, true);

  const rc: u8[] = new Array(src.length);
  // as_log(`after initialize, rc=${rc}`);

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
  init_algos();
  const src = algos.has(src_algo) ? algos.get(src_algo) : [];

  as_log(`histogram('${src_algo}'), src.length=${src.length}`);

  const rc: i32[] = new Array<i32>(10);
  // as_log(`after initialize, rc=${rc}`);

  for (let i = 0; i < src.length; i++) {
    const digit: i32 = i32(src[i]);
    rc[digit] += 1;
  }

  return rc;
}

export function map_colors(src: u8[], palette_id: u8): u8[][] {
  as_log(`map_colors(src, pallette_id='${palette_id}')`);

  const rc: u8[][] = new Array<u8[]>(src.length);

  const palette = palette_from_id(palette_id);

  for (let i = 0; i < src.length; i++) {
    rc[i] = palette[src[i]];
  }

  return rc;
}

export function pi_digits(algo: string, internal: bool = false): u8[] {
  if (!internal) as_log(`pi_digits('${algo}')`);

  init_algos();
  return algos.has(algo) ? algos.get(algo) : [];
}

export function pi_digits_len(algo: string): i32 {
  as_log(`pi_digits_len('${algo}')`);

  const pi = pi_digits(algo, true);
  return pi.length;
}
