'''
Implememntation of the Sinha/Saha algorithm described at: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137
'''
from typing import Generator

from mpmath import mp
from mpmath.ctx_mp_python import mpf as mpf_type

from pi_py.utils import _pi_digits_generator


@_pi_digits_generator
def bbp_pi_digits(**kwargs) -> Generator[int, None, None]:
    '''From https://stackoverflow.com/a/28285228
    Also, https://en.wikipedia.org/wiki/Bailey%E2%80%93Borwein%E2%80%93Plouffe_formula
    https://mathworld.wolfram.com/BBPFormula.html
    '''

    def pi_digits_bbp_term(k: int) -> mpf_type:
        return 1/mp.mpf(16)**k * \
            (mp.mpf(4)/(8*k+1) -
             mp.mpf(2)/(8*k+4) -
             mp.mpf(1)/(8*k+5) -
             mp.mpf(1)/(8*k+6))

    n: int = 1_000_003 if 'n' not in kwargs else kwargs['n'] + 3

    mp.dps = max(n, mp.dps)

    pi = mp.nsum(pi_digits_bbp_term, [0, n], method='d')

    pi_chars = ['3', *mp.nstr(pi, n).partition('.')[2]]
    print(f'{n=:_}, {len(pi_chars)=:_}')

    for digit in pi_chars:
        yield int(digit)
