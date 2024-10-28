'''
Implememntation of the BBP algorithm described at: https://mathworld.wolfram.com/BBPFormula.html
'''

from mpmath import mp
from mpmath.ctx_mp_python import mpf as mpf_type

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator
from pi_py.algo.mpmath_executor import mpmath_generator_executor


def pi_digits_bbp_term(n: int) -> mpf_type:
    return (
        mp.mpf(4)/(8*n + 1) -
        mp.mpf(2)/(8*n + 4) -
        mp.mpf(1)/(8*n + 5) -
        mp.mpf(1)/(8*n + 6)) * \
        mp.power(0.0625, n)  # (1/16)**n


@pi_digits_generator
def bbp_pi_digits(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    '''From https://stackoverflow.com/a/28285228
        Also, https://en.wikipedia.org/wiki/Bailey%E2%80%93Borwein%E2%80%93Plouffe_formula
        https://mathworld.wolfram.com/BBPFormula.html
    '''

    return mpmath_generator_executor(terms_worker_func=pi_digits_bbp_term, num_digits=num_digits+10, terms=max(10_000, terms))
