import logging

from pi_py.algo.bbp import bbp
from pi_py.algo.bellard import bellard
from pi_py.algo.decorator import PiAlgoGenerator
from pi_py.algo.gosper import gosper
from pi_py.algo.madhava import madhava
from pi_py.algo.sinha_saha import sinha_saha


def digits_gen_from_algo(algo: str) -> PiAlgoGenerator:
    if algo == 'gosper':
        generator = gosper
    elif algo == 'madhava':
        generator = madhava
    elif algo == 'bbp':
        generator = bbp
    elif algo == 'bellard':
        generator = bellard
    elif algo == 'sinha_saha':
        generator = sinha_saha
    else:
        logging.error(f'Unsupported generator: {algo}')

    return generator
