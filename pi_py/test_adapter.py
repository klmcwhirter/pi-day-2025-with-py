

import pytest

from pi_py import PiAdapter

MAX_SECS = 30

__adapter = PiAdapter()


@pytest.fixture
def adapter() -> PiAdapter:
    return __adapter


def test_adapter_pi_digits_first_10(adapter: PiAdapter):
    expected = [[3, 1, 4, 1, 5, 9, 2, 6, 5, 3]]
    rc = adapter.pi_digits(10, 10)

    assert expected == rc
