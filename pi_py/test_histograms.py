
import timeit

import pytest

from pi_py import PiAdapter
from pi_py.conftest import TimeoutException, time_limit

MAX_SECS = 30

__adapter = PiAdapter()


@pytest.fixture
def adapter() -> PiAdapter:
    return __adapter


@pytest.mark.parametrize(
    ['n', 'expected'],
    [
        pytest.param(
            100000,  # times out
            [9999, 10137, 9908, 10026, 9971, 10026, 10028, 10025, 9978, 9902],
            marks=[pytest.mark.slow, pytest.mark.skip(reason=f'times out at MAX_SECS={MAX_SECS}')]),
        pytest.param(50000, [5033, 5054, 4867, 4948, 5011, 5052, 5018, 4977, 5030, 5010], marks=[pytest.mark.slow]),
        pytest.param(40000, [3989, 4060, 3892, 3972, 4014, 4040, 4026, 3977, 4032, 3998], marks=[pytest.mark.slow]),
        pytest.param(30000, [2998, 3048, 2897, 2979, 3057, 3049, 3012, 2974, 2972, 3014], marks=[pytest.mark.slow]),
        pytest.param(25000, [2476, 2519, 2403, 2492, 2549, 2567, 2541, 2479, 2465, 2509], marks=[pytest.mark.slow]),
        [20000, [1954, 1997, 1986, 1987, 2043, 2082, 2017, 1953, 1961, 2020]],
        [10000, [968, 1026, 1021, 975, 1012, 1046, 1021, 970, 947, 1014]],
        [1024, [96, 117, 106, 105, 94, 101, 96, 97, 105, 107]],
        [1000, [93, 116, 103, 103, 93, 97, 94, 95, 101, 105]],
        [100, [8, 8, 12, 12, 10, 8, 9, 8, 12, 13]],
        [10, [0, 2, 1, 2, 1, 2, 1, 0, 0, 1]],
    ]
)
def test_histogram_n_digits(adapter: PiAdapter, n: int, expected: list[int]):
    try:
        with time_limit(MAX_SECS):
            rc = adapter.histogram(n)
    except TimeoutException:
        pytest.fail(f'adapter.histogram(num_digits={n}) timed out at MAX_SECS={MAX_SECS} seconds', pytrace=False)

    assert expected == rc


collected: dict[int, list[int]] = {}


def collect_histogram_for_n_digits(n: int):
    adapter = PiAdapter()  # fresh adapter each time - no caching on purpose
    rc = adapter.histogram(n)
    collected[n] = rc
    return rc


@pytest.mark.slow
@pytest.mark.parametrize(
    ['n', 'expected_secs'],
    [
        pytest.param(
            100000,  0,
            marks=[pytest.mark.slow, pytest.mark.skip(reason=f'times out at MAX_SECS={MAX_SECS}')]),
        pytest.param(50000, 24.5, marks=[pytest.mark.slow]),
        pytest.param(40000, 15.03, marks=[pytest.mark.slow]),
        pytest.param(30000, 8.5, marks=[pytest.mark.slow]),
        pytest.param(25000, 5.75, marks=[pytest.mark.slow]),
        [20000, 3.75],
        [10000, 1.5],
        [1024, 0.105],
        [1000, 0.100],
        [100, 0.0015],
        [10, 0.00025],
        [-1, 0]  # sentinel to produce output
    ]
)
def test_histogram_perf(n: int, expected_secs: float):
    '''Time the execution for succeeding larger orders of magnitude (10^n) and stop when larger than 10 secs'''
    # print(f'\nRunning with MAX_SECS={MAX_SECS}')

    if n > 0:
        stmt = f'collect_histogram_for_n_digits({n})'
        # print(f'Executing {stmt}')

        secs = 0
        try:
            with time_limit(MAX_SECS):
                secs = timeit.timeit(stmt=stmt, number=1, globals=globals())
        except TimeoutException:
            print(f'n={n} timed out')
            raise

        msg = f'n={n} ran in {secs: .4F} secs, expected_secs={expected_secs}'
        print(msg)

        assert expected_secs >= secs, msg

    if n < 0:
        print('\n')
        for n, histogram in collected.items():
            max_n = histogram.index(max(histogram))
            min_n = histogram.index(min(histogram))
            print(f'{n}: min={min_n}, max={max_n}, histogram={histogram}')
