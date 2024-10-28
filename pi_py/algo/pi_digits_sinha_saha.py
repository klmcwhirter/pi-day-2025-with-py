'''
Implememntation of the Sinha/Saha algorithm described at: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137
'''
import logging

import sympy as sym

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator

N_TERMS = [5000, 2300][0]
λ_VAL = 575
PREC = [711, 500][0]


@pi_digits_generator
def sinha_saha_pi_digits(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
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

    pi_parts = str(pi).partition('.')
    pi_chars = [pi_parts[0], *pi_parts[2]]

    return (int(digit) for digit in pi_chars)
