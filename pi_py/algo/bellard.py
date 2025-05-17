'''
Implememntation of Bellard's algorithm described at: https://en.wikipedia.org/wiki/Bellard%27s_formula
'''

from mpmath import mp
from mpmath.ctx_mp_python import mpf as mpf_type

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator
from pi_py.algo.mpmath_executor import mpmath_generator_executor


def bellard_term(n: int) -> mpf_type:

    return (mp.power(-1, n) / mp.power(2, 10*n)) * \
        (
        mp.mpf(-1)*(mp.power(2, 5) / (4*n + 1))
        - (mp.mpf(1) / (4*n + 3))
        + (mp.power(2, 8) / (10*n + 1))
        - (mp.power(2, 6) / (10*n + 3))
        - (mp.power(2, 2) / (10*n + 5))
        - (mp.power(2, 2) / (10*n + 7))
        + (mp.mpf(1) / (10*n + 9))
    )


def _collector(results: list[mpf_type]) -> mpf_type:
    pi = mp.power(2, -6) * mp.fsum(results)
    return pi


@pi_digits_generator
def bellard(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    '''From https://en.wikipedia.org/wiki/Bellard%27s_formula - executes in about 00:04:20'''

    return mpmath_generator_executor(terms_worker_func=bellard_term, num_digits=num_digits+10, start=0, terms=max(100_000, terms), collector=_collector)


# @pi_digits_generator
# def bellard_pi_digits_single(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
#     '''From https://en.wikipedia.org/wiki/Bellard%27s_formula'''

#     two_2 = mp.power(2, 2)
#     two_5 = mp.power(2, 5)
#     two_6 = mp.power(2, 6)
#     two_8 = mp.power(2, 8)

#     def pi_digits_bellard_term(n: int) -> mpf_type:
#         four_x_n = mp.mpf(4 * n)
#         ten_x_n = mp.mpf(10 * n)

#         return (mp.power(-1, n) / mp.power(2, ten_x_n)) * \
#             (
#                 -
#             (two_5 / (four_x_n + 1)) -
#             (1 / (four_x_n + 3)) +
#             (two_8 / (ten_x_n + 1)) -
#             (two_6 / (ten_x_n + 3)) -
#             (two_2 / (ten_x_n + 5)) -
#             (two_2 / (ten_x_n + 7)) -
#             (1 / (ten_x_n + 9))
#         )

#     # num_digits: int = 1_000_003 if 'num_digits' not in kwargs else kwargs['num_digits'] + 3
#     # terms: int = 100_000 if 'terms' not in kwargs else kwargs['terms']

#     mp.dps = max(num_digits, mp.dps)

#     pi = (1 / two_6) * mp.nsum(pi_digits_bellard_term, [0, terms], method='d')

#     pi_parts = mp.nstr(pi, num_digits).partition('.')
#     pi_chars = [pi_parts[0], *pi_parts[2]]
#     print(f'{num_digits=:_}, {terms=:_}, {len(pi_chars)=:_}')

#     for digit in pi_chars:
#         yield int(digit)
