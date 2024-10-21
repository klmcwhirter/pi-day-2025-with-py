'''
Implememntation of the Sinha/Saha algorithm described at: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137
'''
import logging
from typing import Generator

import sympy as sym

from pi_py.utils import _pi_digits_generator

N_TERMS = [5000, 2300][0]
λ_VAL = 575
PREC = [711, 500][0]


@_pi_digits_generator
def sinha_saha_pi_digits(**_kwargs) -> Generator[int, None, None]:
    n, nterms = sym.symbols('n nterms', integer=True, positive=True)
    λ, π = sym.symbols('λ π', real=True)
    # SinhaSaha = sym.symbols('SinhaSaha', cls=sym.Function)

    sum_left_no_factorial = 1 / (n+λ) - 4 / (2*n + 1)
    sum_right = (2*n + 1)**2 / (4 * (n + λ)).factor() - n

    sum_inner = sum_left_no_factorial * sym.RisingFactorial(sum_right, n-1)

    SinhaSaha = 4 + sym.Sum((1 / sym.factorial(n)) * sum_inner, (n, 1, nterms))

    SinhaSaha_subs = SinhaSaha.subs({λ: λ_VAL, nterms: N_TERMS}).gammasimp()

    pi = SinhaSaha_subs.evalf(PREC)

    logging.debug(f'sinha_saha_pi_digits: {N_TERMS=}, {pi=}')

    # note that partition will cause problems for large values of digit precision
    # TODO look for a Generator expression instead
    pi_chars = ['3', *str(pi).partition('.')[2]]

    return (int(digit) for digit in pi_chars)


@_pi_digits_generator
def sinha_saha_pi_digits_100(**_kwargs):
    for n in [
        #  1  2  3  4  5  6  7  8  9
        3, 1, 4, 1, 5, 9, 2, 6, 5, 3,  # 0
        5, 8, 9, 7, 9, 3, 2, 3, 8, 4,  # 1
        6, 2, 6, 4, 3, 3, 8, 3, 2, 7,  # 2
        9, 5, 0, 2, 8, 8, 4, 1, 9, 7,  # 3
        1, 6, 9, 3, 9, 9, 3, 7, 5, 1,  # 4
        0, 5, 8, 2, 0, 9, 7, 4, 9, 4,  # 5
        4, 5, 9, 2, 3, 0, 7, 8, 1, 6,  # 6
        4, 0, 6, 2, 8, 6, 2, 0, 8, 9,  # 7
        9, 8, 6, 2, 8, 0, 3, 4, 8, 2,  # 8
        5, 3, 4, 2, 1, 1, 7, 0, 6, 7,  # 9
    ]:
        yield n
