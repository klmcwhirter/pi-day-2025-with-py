import logging
import os
from collections.abc import Callable
from functools import wraps
from io import TextIOWrapper
from itertools import islice
from typing import Generator, Iterator, Sequence


def _pi_digits_generator(gen_func: Callable[[], Generator[int, None, None]]) -> Callable[[], Generator[int, None, None]]:
    @wraps(gen_func)
    def wrapper(num_digits: int, **kwargs) -> Iterator[int]:
        logging.info(f'{gen_func.__name__}({num_digits=:_})')
        return islice(gen_func(**kwargs), num_digits)
    return wrapper


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


_writer_map = {
    '.go': _pi_digits_go_writer,
    '.js': _pi_digits_js_writer,
    '.py': _pi_digits_py_writer,
    '.ts': _pi_digits_ts_writer,
    '.zig': _pi_digits_zig_writer,
}


def pi_digits_writer_supported_exts() -> list[str]:
    return [k for k in _writer_map.keys()]


def pi_digits_writer_from_ext(file_path: str):
    try:
        file_parts = os.path.splitext(file_path)
        # print(file_parts)

        (_, ext) = file_parts

        if ext in _writer_map:
            return _writer_map[ext]
        else:
            raise ValueError(f'Unsupported file ext: {file_path}')

    except TypeError:
        raise ValueError(f'Unsupported file ext: {file_path}')
