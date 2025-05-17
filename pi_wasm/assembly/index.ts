
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
@external('env', 'console.trace')
declare function log(msg: string): void;

export function as_log(msg: string): void {
  log(msg);
}

export function as_version(): string {
  return `assemblyscript: ${ASC_VERSION_MAJOR}.${ASC_VERSION_MINOR}.${ASC_VERSION_PATCH}`;
}

export function cmp_digits(src: u8[], other: u8[]): u8[] {
  as_log(`cmp_digits(src, other)`);

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

export function histogram(src: u8[]): i32[] {
  as_log(`histogram(src), src.length=${src.length}`);

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

export function pi_baseline(): u8[] {
  return pi_baseline_seed;
}

export function pi_bbp(): u8[] {
  return pi_bbp_seed;
}

export function pi_bellard(): u8[] {
  return pi_bellard_seed;
}

export function pi_gosper(): u8[] {
  return pi_gosper_seed;
}

export function pi_sinha_saha(): u8[] {
  return pi_sinha_saha_seed;
}

export function pi_tachus(): u8[] {
  return pi_tachus_seed;
}

export function pi_ten_digits(): u8[] {
  return pi_ten_digits_seed;
}
