
import logging
import math

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator


@pi_digits_generator
def madhava(*, num_digits: int, terms: int, **kwargs) -> PiAlgoGenerator:
    '''From https://scipython.com/book/chapter-2-the-core-python-language-i/questions/the-madhava-series/

    Unfortanately, the formula as written does not lend itself easily to a Generator. Do the simnple thing for readability.

    The Madhava series is not the primary focus of this project.

    Note that the Madhava series is stated to take 5 billion terms to converge accurately to 10 decimal places of pi.
    Although, 20_000 seems to be good enough for our purposes.

    Reference: https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137
    '''

    pi = 0.0
    for k in range(max(50_000+1, terms)):
        pi += pow(-3, -k) / (2*k+1)

    pi *= math.sqrt(12)
    logging.debug(f'mahdhava_pi_digits: {terms=}, {pi=}')

    pi_parts = str(pi).partition('.')
    pi_chars = [pi_parts[0], *pi_parts[2]]
    for digit in pi_chars:
        yield int(digit)
