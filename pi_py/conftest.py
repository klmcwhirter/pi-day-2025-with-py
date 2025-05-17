from itertools import islice

from pi_py.algo.from_file import read_digits


class TimeoutException(Exception):
    pass


_pi_1_000_000: list[int] | None = None


def pi_digits_n(num_digits: int) -> list[int]:
    global _pi_1_000_000
    if _pi_1_000_000 is None:
        _pi_1_000_000 = read_digits('./etc/pi_1000000.txt')
        # print(f'{len(_pi_1_000_000)=:_}')

    rc = [*islice(_pi_1_000_000, num_digits)]
    # print(f'{rc=}')

    return rc
