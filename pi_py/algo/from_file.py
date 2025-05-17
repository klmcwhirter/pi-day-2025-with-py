'''
Provides digits from ./etc/pi_baseline.txt
'''

import string

from pi_py.algo.decorator import PiAlgoGenerator, pi_digits_generator


def read_digits(file_path: str) -> list[int]:
    with open(file_path, 'r') as f:
        content = f.read().strip('\r').strip('\n')

    digits = [int(d) for d in content if d in string.digits]

    return digits


@pi_digits_generator
def from_file(*, num_digits: int, file_path: str, **kwargs) -> PiAlgoGenerator:
    print(f'{file_path=}')

    digits = read_digits(file_path)

    for digit in digits:
        yield digit
