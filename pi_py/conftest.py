import signal
from contextlib import contextmanager
from itertools import islice
from typing import Generator

from pi_py.pi_1000000 import read_digits


class TimeoutException(Exception):
    pass


@contextmanager
def time_limit(max_secs: int) -> Generator[None, None, None]:
    def signal_handler(signum: int, frame):
        raise TimeoutException('Timed out!')
    signal.signal(signal.SIGALRM, signal_handler)
    signal.alarm(max_secs)
    try:
        yield
    finally:
        signal.alarm(0)


_pi_1_000_000: list[int] | None = None


def pi_digits_n(num_digits: int) -> list[int]:
    global _pi_1_000_000
    if _pi_1_000_000 is None:
        _pi_1_000_000 = read_digits('./etc/pi_1000000.txt')
        # print(f'{len(_pi_1_000_000)=:_}')

    rc = [*islice(_pi_1_000_000, num_digits)]
    # print(f'{rc=}')

    return rc
