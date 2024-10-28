

import logging
from collections.abc import Callable
from functools import wraps
from itertools import islice
from typing import Generator, Iterator

PiAlgoGenerator = Generator[int, None, None]


def pi_digits_generator(gen_func: Callable[[], PiAlgoGenerator]) -> Callable[[], PiAlgoGenerator]:
    @wraps(gen_func)
    def wrapper(num_digits: int, **kwargs) -> Iterator[int]:
        logging.info(f'{gen_func.__name__}({num_digits=:_})')
        kwargs = {'num_digits': num_digits, **kwargs}
        return islice(gen_func(**kwargs), num_digits)
    return wrapper
