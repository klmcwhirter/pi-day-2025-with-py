import logging

from pi_py.algo.decorator import PiAlgoGenerator
from pi_py.algo.pi_digits_bbp import bbp_pi_digits
from pi_py.algo.pi_digits_bellard import bellard_pi_digits
from pi_py.algo.pi_digits_gosper import gosper_pi_digits
from pi_py.algo.pi_digits_madhava import madhava_pi_digits
from pi_py.algo.pi_digits_sinha_saha import sinha_saha_pi_digits


def digits_gen_from_algo(algo: str) -> PiAlgoGenerator:
    if algo == 'gosper':
        generator = gosper_pi_digits
    elif algo == 'madhava':
        generator = madhava_pi_digits
    elif algo == 'bbp':
        generator = bbp_pi_digits
    elif algo == 'bellard':
        generator = bellard_pi_digits
    elif algo == 'sinha_saha':
        generator = sinha_saha_pi_digits
    else:
        logging.error(f'Unsupported generator: {algo}')

    return generator
