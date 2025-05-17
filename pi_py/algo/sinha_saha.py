'''
Implememntation of the Sinha/Saha algorithm described at: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137
'''
import logging

from mpmath import mp
from mpmath.ctx_mp_python import mpf as mpf_type

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator
from pi_py.algo.mpmath_executor import mpmath_generator_executor

N_TERMS = [8_501, 5_000, 2_300][1]
λ_VAL = 575
PREC = [2_000, 711, 500][1]


def _collector(results: list[mpf_type]) -> mpf_type:
    return mp.mpf(4.0) + mp.fsum(results)


def sinha_saha_term(n: int) -> mpf_type:
    recip_fact = mp.mpf(1.0) / mp.factorial(n)

    middle = (mp.mpf(1.0) / (n + λ_VAL)) - (4 / (2*n + 1))

    poch_expr = (mp.power(2*n + 1, 2) / (4*(n + λ_VAL))) - n
    poch = mp.rf(poch_expr, n - 1)

    rc = recip_fact * middle * poch
    return rc


@pi_digits_generator
def sinha_saha_mproc(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    return mpmath_generator_executor(
        terms_worker_func=sinha_saha_term,
        num_digits=max(num_digits, PREC)+10,
        start=1,
        terms=max(terms, N_TERMS),
        collector=_collector)


@pi_digits_generator
def sinha_saha_single(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    import sympy as sym
    n, nterms = sym.symbols('n nterms', integer=True, positive=True)
    λ, π = sym.symbols('λ π', real=True)
    # SinhaSaha = sym.symbols('SinhaSaha', cls=sym.Function)

    recip_factorial = 1 / sym.factorial(n)

    middle = 1 / (n + λ) - 4 / (2*n + 1)

    poch_expr = (2*n + 1)**2 / (4 * (n + λ)).factor() - n
    poch = sym.RisingFactorial(poch_expr, n - 1)

    SinhaSaha = 4 + sym.Sum(recip_factorial * middle * poch, (n, 1, nterms))

    SinhaSaha_subs = SinhaSaha.subs({λ: λ_VAL, nterms: N_TERMS}).gammasimp()

    pi = SinhaSaha_subs.evalf(PREC)

    logging.debug(f'sinha_saha: {N_TERMS=}, {pi=}')

    pi_parts = str(pi).partition('.')
    pi_chars = [pi_parts[0], *pi_parts[2]]

    return (int(digit) for digit in pi_chars)


sinha_saha = sinha_saha_mproc
