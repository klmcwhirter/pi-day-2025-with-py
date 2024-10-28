
import logging
import math

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator

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


@pi_digits_generator
def gosper(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    '''
    This algorithm is based on an unproven conjecture but successfully produces at least the first 1 million digits.
    Read more about it here: https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/#using-gospers-series

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
