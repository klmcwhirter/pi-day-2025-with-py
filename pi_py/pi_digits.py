'''Digits of PI algorithm'''

import logging
import math
from collections.abc import Callable
from functools import partial, wraps
from itertools import islice
# from pprint import pformat
from typing import Generator


def _pi_digits_generator(gen_func: Callable[[None], Generator[int, None, None]]) -> Callable[[None], Generator[int, None, None]]:
    @wraps(gen_func)
    def wrapper(num_digits: int, **kwargs) -> Generator[int, None, None]:
        logging.info(f'{gen_func.__name__}({num_digits=:_})')
        return islice(gen_func(**kwargs), num_digits)
    return wrapper


max_len = {
    'q': (0, 0),
    'r': (0, 0),
    't': (0, 0),
    'i': (0, 0),
}


def _update_max_len(q: int, r: int, t: int, i: int, n: int):
    for v, k in zip([q, r, t, i], ['q', 'r', 't', 'i']):
        l: int = int(math.log10(v)) + 1
        if l > max_len[k][0]:
            max_len[k] = (l, n)


@_pi_digits_generator
def gosper_pi_digits(**_kwargs) -> Generator[int, None, None]:
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


@_pi_digits_generator
def madhava_pi_digits(**kwargs) -> Generator[int, None, None]:
    '''From https://scipython.com/book/chapter-2-the-core-python-language-i/questions/the-madhava-series/

    Unfortanately, the formula as written does not lend itself easily to a Generator. Do the simnple thing for readability.

    The Madhava series is not the primary focus of this project.

    Note that the Madhava series is stated to take 5 billion terms to converge accurately to 10 decimal places of pi.
    Although, 20_000 seems to be good enough for our purposes.

    Reference: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#und4
    '''
    terms: int = 20_000 if 'terms' not in kwargs else kwargs['terms']

    pi = 0.0
    for k in range(terms):
        pi += pow(-3, -k) / (2*k+1)

    pi *= math.sqrt(12)
    logging.debug(f'mahdhava_pi_digits: {terms=}, {pi=}')

    # note that partition will cause problems for large values of terms
    # TODO look for a Generator expression instead
    pi_chars = ['3', *str(pi).partition('.')[2]]
    for digit in pi_chars:
        yield int(digit)


@_pi_digits_generator
def saha_sinha_pi_digits(**_kwargs):
    for n in [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]:
        yield n

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

    generator = gosper_pi_digits
    num_digits = 50_000

    if len(sys.argv) < 2:
        print('''Usage: python -m pi_py.pi_digits filename.ext [generator] [num_digits]
              where
              generator is one of gosper, madhava or saha_sinha - default: gosper
              ext is one of go, js, py, ts, zig''')
        sys.exit(1)

    if len(sys.argv) > 2:
        if sys.argv[2] == 'gosper':
            generator = gosper_pi_digits
        elif sys.argv[2] == 'madhava':
            generator = partial(madhava_pi_digits, terms=150_000)
        elif sys.argv[2] == 'saha_sinha':
            generator = saha_sinha_pi_digits
        else:
            logging.error(f'Unsupported generator: {sys.argv[2]}')

    if len(sys.argv) > 3:
        num_digits = int(sys.argv[3])

    logging.basicConfig(level=logging.DEBUG, format='{asctime} - {module} - {funcName} - {levelname} - {message}', style='{')
    # logging.getLogger().setLevel(level=logging.DEBUG)

    logging.info(f'Start generating {num_digits} digits of pi ...')
    digits = [d for d in generator(num_digits)]
    logging.info('Done generating digits of pi')

    from .utils import pi_digits_writer_from_ext

    file_path = sys.argv[1]
    logging.info(f'Start writing to {file_path}...')

    writer = pi_digits_writer_from_ext(file_path)

    with open(file_path, 'w') as f:
        writer(f, digits)

    # logging.debug(f'max_lens:\n{pformat(max_len, sort_dicts=False, underscore_numbers=True)}')

    logging.info(f'Done writing to {file_path}.')
