import os
from io import TextIOWrapper
from typing import Sequence


def batched(sequence: Sequence, n: int = 1):
    l: int = len(sequence)
    for ndx in range(0, l, n):
        yield sequence[ndx:min(ndx + n, l)]


def _pi_digits_go_writer(f: TextIOWrapper, digits: list[int]):
    print('\n', file=f)
    print("// Automatically generated via python -m piadapter.pi_digits pi-tinygo/pi_digits_seed.go", file=f)
    print('', file=f)
    print('var pi_digits_seed [50000]uint8 = [50000]uint8{', end='', file=f)
    print(', '.join(str(d) for d in digits), end='', file=f)
    print('};', file=f)


def _pi_digits_js_writer(f: TextIOWrapper, digits: list[int]):
    print("// Automatically generated via python -m piadapter.pi_digits pi-as/benchmarks/pi_digits_seed.js", file=f)
    print('export const pi_digits_seed = ', end='', file=f)
    print(digits, end='', file=f)
    print(';', file=f)


def _pi_digits_py_writer(f: TextIOWrapper, digits: list[int]):
    print("'''Automatically generated via python -m piadapter.pi_digits piadapter/pi_digits_seed.py'''", file=f)
    print('# region', file=f)
    print('pi_digits_seed = ', end='', file=f)
    print(digits, file=f)
    print('# endregion', file=f)


def _pi_digits_ts_writer(f: TextIOWrapper, digits: list[int]):
    print("// Automatically generated via python -m piadapter.pi_digits pi-as/assembly/pi_digits_seed.ts", file=f)
    print('export const pi_digits_seed: u8[] = ', end='', file=f)
    print(digits, end='', file=f)
    print(';', file=f)


def _pi_digits_zig_writer(f: TextIOWrapper, digits: list[int]):
    print("// Automatically generated via python -m piadapter.pi_digits pi-zig/src/pi_digits_seed.zig", file=f)
    print('pub const pi_digits_seed: []u8 = &pi_digits_seed_array;', file=f)
    print('var pi_digits_seed_array = [_]u8{', end='', file=f)
    print(', '.join(str(d) for d in digits), end='', file=f)
    print('};', file=f)


def pi_digits_writer_from_ext(filepath: str):
    try:
        file_parts = os.path.splitext(filepath)
        # print(file_parts)

        (_, ext) = file_parts

        if ext == '.go':
            return _pi_digits_go_writer
        elif ext == '.js':
            return _pi_digits_js_writer
        elif ext == '.py':
            return _pi_digits_py_writer
        elif ext == '.ts':
            return _pi_digits_ts_writer
        elif ext == '.zig':
            return _pi_digits_zig_writer
        else:
            raise ValueError(f'Unsupported file ext: {filepath}')

    except TypeError:
        raise ValueError(f'Unsupported file ext: {filepath}')
