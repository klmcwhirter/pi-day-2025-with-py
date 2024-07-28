'''Digits of PI algorithm'''

import logging
from itertools import islice
from math import log10, sqrt
from pprint import pformat
from typing import Generator


def pi_digit_generator(num_digits: int) -> Generator[int, None, None]:
    logging.info(f'pi_digit_generator({num_digits=:_})')
    return islice(_gosper_pi_unproven(), num_digits)


max_len = {
    'q': (0, 0),
    'r': (0, 0),
    't': (0, 0),
    'i': (0, 0),
}


def _update_max_len(q: int, r: int, t: int, i: int, n: int):
    for v, k in zip([q, r, t, i], ['q', 'r', 't', 'i']):
        l = int(log10(v)) + 1
        if l > max_len[k][0]:
            max_len[k] = (l, n)


def _gosper_pi_unproven() -> Generator[int, None, None]:
    '''
    This algorithm is based on an unproven conjecture but successfully produces at least the first 1 million digits.
    Read more about it here: https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/

    And here - Gosper's series: https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/#the-open-problem
    '''
    n = 1
    q, r, t, i = 1, 180, 60, 2
    while True:
        u, y = 3*(3*i+1)*(3*i+2), (q*(27*i-12)+5*r)//(5*t)
        yield y
        q, r, t, i = 10*q*i*(2*i-1), 10*u*(q*(5*i-2)+r-y*t), t*u, i+1
        n += 1

        if n % 100_000 == 0:
            logging.info(f'Found {n:_} digits ...')

        # _update_max_len(q, r, t, i, n)


def _madhava_pi() -> float:
    '''From https://scipython.com/book/chapter-2-the-core-python-language-i/questions/the-madhava-series/'''
    pi = 0.0
    for k in range(20):
        pi += pow(-3, -k) / (2*k+1)

    pi *= sqrt(12)
    return pi


def _saha_sinha_pi():
    ...

# region

# def pi_digit_generator_orig(num_digits: int) -> Generator[int, None, None]:
#     '''Generate num_digits digits of Pi

#         Run the algorithm below using CPython, Cython, PyPy and Numba and compare
#         their performance. (This is implementing a spigot algorithm by A. Sale,
#         D. Saada, S. Rabinowitz, mentioned on

#         http://mail.python.org/pipermail/edu-sig/2012-December/010721.html).
#     '''
#     logging.info(f'pi_digit_generator(num_digits={num_digits})')

#     k, a, b, a1, b1 = 2, 4, 1, 12, 4
#     while num_digits > 0:
#         p, q, k = k * k, 2 * k + 1, k + 1
#         a, b, a1, b1 = a1, b1, p*a + q*a1, p*b + q*b1
#         d, d1 = a/b, a1/b1
#         while d == d1 and num_digits > 0:
#             yield int(d)
#             num_digits -= 1
#             a, a1 = 10*(a % b), 10*(a1 % b1)
#             d, d1 = a/b, a1/b1

# endregion


if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print('Usage: python -m pi_py.pi_digits filename.ext\nwhere ext is one of go, js, py, ts, zig')
        sys.exit(1)

    logging.basicConfig(level=logging.DEBUG, format='{asctime} - {module} - {funcName} - {levelname} - {message}', style='{')
    logging.getLogger().setLevel(level=logging.DEBUG)

    logging.info('Start generating digits of pi ...')
    digits = [d for d in pi_digit_generator(1_000_000)]
    logging.info('Done generating digits of pi')

    from .utils import pi_digits_writer_from_ext

    for file_path in sys.argv[1:]:
        logging.info(f'Start writing to {file_path}...')

        writer = pi_digits_writer_from_ext(file_path)

        with open(file_path, 'w') as f:
            writer(f, digits)

        logging.debug(f'max_lens:\n{pformat(max_len, sort_dicts=False, underscore_numbers=True)}')

        logging.info(f'Done writing to {file_path}.')
