
from collections.abc import Callable

import pytest

from pi_py.algo.bbp import bbp
from pi_py.algo.bellard import bellard
from pi_py.algo.decorator import PiAlgoGenerator
from pi_py.algo.gosper import gosper
from pi_py.algo.madhava import madhava
from pi_py.algo.sinha_saha import sinha_saha
from pi_py.conftest import pi_digits_n


@pytest.mark.parametrize(
    ['generator'],
    [
        [bbp],
        [bellard],
        # pytest.param(bellard, marks=[pytest.mark.skip]),
        [gosper],
        [madhava],
        pytest.param(sinha_saha, marks=[pytest.mark.slow, pytest.mark.skip]),
    ]
)
def test_pi_digit_generator_first_10(generator: Callable[[], PiAlgoGenerator]):
    expected = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    rc = [d for d in generator(num_digits=10, terms=10)]

    assert expected == rc


@pytest.mark.parametrize(
    ['num_digits', 'generator'],
    [
        [10, bbp],
        [10, gosper],
        [10, madhava],
        pytest.param(10, sinha_saha, marks=[pytest.mark.slow, pytest.mark.skip]),

        [100, bbp],
        [100, gosper],
        pytest.param(100, madhava, marks=pytest.mark.skip),
        pytest.param(100, sinha_saha, marks=[pytest.mark.slow, pytest.mark.skip]),

        [500, gosper],
        pytest.param(500, sinha_saha, marks=[pytest.mark.slow]),

        [1_000, bbp],
        [1_000, gosper],
        pytest.param(1_000, madhava, marks=pytest.mark.skip),
        pytest.param(1_000, sinha_saha, marks=pytest.mark.skip),

        pytest.param(10_000, bbp, marks=pytest.mark.slow),
        [10_000, gosper],
        pytest.param(10_000, madhava, marks=pytest.mark.skip),
        pytest.param(10_000, sinha_saha, marks=pytest.mark.skip),

        pytest.param(100_000, bbp, marks=[pytest.mark.slow]),
        pytest.param(100_000, gosper, marks=[pytest.mark.slow]),
        pytest.param(100_000, madhava, marks=[pytest.mark.slow, pytest.mark.skip]),
        pytest.param(100_000, sinha_saha, marks=[pytest.mark.slow, pytest.mark.skip]),
    ]
)
def test_pi_digit_generator_first_n(num_digits: int, generator: Callable[[None], PiAlgoGenerator]):
    expected_values = pi_digits_n(num_digits)
    rc = [d for d in generator(num_digits=num_digits, terms=num_digits)]

    assert expected_values == rc
