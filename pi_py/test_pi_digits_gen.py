
from collections.abc import Callable
from functools import partial
from typing import Generator

import pytest

from pi_py.conftest import pi_digits_n
from pi_py.pi_digits import gosper_pi_digits, madhava_pi_digits
from pi_py.pi_digits_bbp import bbp_pi_digits
from pi_py.pi_digits_sinha_saha import sinha_saha_pi_digits


def n_digits_bbp(n: int):
    return partial(bbp_pi_digits, n=n)


@pytest.mark.parametrize(
    ['generator'],
    [
        [n_digits_bbp(10)],
        [gosper_pi_digits],
        [madhava_pi_digits],
        pytest.param(sinha_saha_pi_digits, marks=[pytest.mark.slow, pytest.mark.skip]),
    ]
)
def test_pi_digit_generator_first_10(generator: Callable[[], Generator[int, None, None]]):
    expected = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    rc = [d for d in generator(num_digits=10)]

    assert expected == rc


@pytest.mark.parametrize(
    ['num_digits', 'generator'],
    [
        [10, n_digits_bbp(10)],
        [10, gosper_pi_digits],
        [10, madhava_pi_digits],
        pytest.param(10, sinha_saha_pi_digits, marks=[pytest.mark.slow, pytest.mark.skip]),

        [100, n_digits_bbp(100)],
        [100, gosper_pi_digits],
        pytest.param(100, madhava_pi_digits, marks=pytest.mark.skip),
        pytest.param(100, sinha_saha_pi_digits, marks=[pytest.mark.slow, pytest.mark.skip]),

        [500, gosper_pi_digits],
        pytest.param(500, sinha_saha_pi_digits, marks=[pytest.mark.slow]),

        [1_000, n_digits_bbp(1_000)],
        [1_000, gosper_pi_digits],
        pytest.param(1_000, madhava_pi_digits, marks=pytest.mark.skip),
        pytest.param(1_000, sinha_saha_pi_digits, marks=pytest.mark.skip),

        pytest.param(10_000, n_digits_bbp(10_000), marks=pytest.mark.slow),
        [10_000, gosper_pi_digits],
        pytest.param(10_000, madhava_pi_digits, marks=pytest.mark.skip),
        pytest.param(10_000, sinha_saha_pi_digits, marks=pytest.mark.skip),

        pytest.param(100_000, n_digits_bbp(100_000), marks=[pytest.mark.slow]),
        pytest.param(100_000, gosper_pi_digits, marks=[pytest.mark.slow]),
        pytest.param(100_000, madhava_pi_digits, marks=[pytest.mark.slow, pytest.mark.skip]),
        pytest.param(100_000, sinha_saha_pi_digits, marks=[pytest.mark.slow, pytest.mark.skip]),
    ]
)
def test_pi_digit_generator_first_n(num_digits: int, generator: Callable[[None], Generator[int, None, None]]):
    expected_values = pi_digits_n(num_digits)
    rc = [d for d in generator(num_digits=num_digits)]

    assert expected_values == rc
