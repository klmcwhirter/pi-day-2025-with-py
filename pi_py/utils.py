import os
from io import TextIOWrapper
from typing import Sequence


def batched(sequence: Sequence, n: int = 1):
    l: int = len(sequence)
    for ndx in range(0, l, n):
        yield sequence[ndx:min(ndx + n, l)]


def _pi_digits_go_writer(f: TextIOWrapper, digits: list[int], mod_name: str, file_name: str, var_name: str):
    print('\n', file=f)
    print(f'// Automatically generated via python -m {mod_name} {file_name}', file=f)
    print('', file=f)
    digits_len = len(digits)
    print(f'var {var_name} [{digits_len}]uint8 = [{digits_len}]uint8{{', end='', file=f)
    print(', '.join(str(d) for d in digits), end='', file=f)
    print('};', file=f)


def _pi_digits_js_writer(f: TextIOWrapper, digits: list[int], mod_name: str, file_name: str, var_name: str):
    print(f'// Automatically generated via python -m {mod_name} {file_name}', file=f)
    print('', file=f)
    print(f'export const {var_name} = ', end='', file=f)
    print(digits, end='', file=f)
    print(';', file=f)


def _pi_digits_py_writer(f: TextIOWrapper, digits: list[int], mod_name: str, file_name: str, var_name: str):
    print(f"'''Automatically generated via python -m {mod_name} {file_name}'''", file=f)
    print('', file=f)
    print('# region', file=f)
    print(f'{var_name} = ', end='', file=f)
    print(digits, file=f)
    print('# endregion', file=f)


def _pi_digits_ts_writer(f: TextIOWrapper, digits: list[int], mod_name: str, file_name: str, var_name: str):
    print(f'// Automatically generated via python -m {mod_name} {file_name}', file=f)
    print('', file=f)
    print(f'export const {var_name}: u8[] = ', end='', file=f)
    print(digits, end='', file=f)
    print(';', file=f)


def _pi_digits_zig_writer(f: TextIOWrapper, digits: list[int], mod_name: str, file_name: str, var_name: str):
    print(f'// Automatically generated via python -m {mod_name} {file_name}', file=f)
    print('', file=f)
    print(f'pub const {var_name}: []const u8 = &{var_name}_array;', file=f)
    print(f'const {var_name}_array = [_]u8{{ ', end='', file=f)
    print(', '.join(str(d) for d in digits), end='', file=f)
    print(' };', file=f)


def pi_digits_writer_from_ext(file_path: str):
    try:
        file_parts = os.path.splitext(file_path)
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
            raise ValueError(f'Unsupported file ext: {file_path}')

    except TypeError:
        raise ValueError(f'Unsupported file ext: {file_path}')
