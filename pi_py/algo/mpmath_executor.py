import concurrent.futures
import logging
import os
from typing import Callable

from mpmath import mp
from mpmath.ctx_mp_python import mpf as mpf_type

from pi_py.algo.decorator import PiAlgoGenerator
from pi_py.utils import config_logging


def _max_workers() -> int:
    return min(12, os.process_cpu_count() or 1)


def _number_ranges(start: int, max_n: int, num_workers: int) -> list[tuple[int, int]]:
    '''Distribute work evenly across all workers; returns list of begin/end number ranges'''

    windows = [(0, 0)] * num_workers

    items_per_worker = int(max_n // num_workers) + 1

    last_idx = start
    for t in range(num_workers):
        next_idx = min(max_n, last_idx + items_per_worker)

        windows[t] = (last_idx, next_idx)

        if next_idx >= max_n:
            break

        last_idx = next_idx + 1

    return windows


def _process_initializer(num_digits: int) -> None:
    '''initialize state that is needed in each sub-process'''
    mp.dps = num_digits
    config_logging()


def _terms_sum(terms_worker_func, num_digits: int, rng: tuple[int], idx: int = 0, **_kwargs) -> mpf_type:
    mp.dps = num_digits  # new process so reset dps

    logging.debug(f'Worker-{idx} processing ({rng[0]:_}, {rng[-1]:_})')

    rc = mp.mpmathify('0.0')

    for k in range(rng[0], rng[-1]+1):
        rc += terms_worker_func(k)

    return rc


def mpmath_generator_executor(*, terms_worker_func, num_digits: int, start: int, terms: int,
                              collector: Callable[[list[mpf_type]], mpf_type]) -> PiAlgoGenerator:
    mp.dps = num_digits

    num_workers = _max_workers()
    results: list[mpf_type] = [mp.mpmathify('0.0')] * num_workers

    with concurrent.futures.ProcessPoolExecutor(max_workers=num_workers, initializer=_process_initializer, initargs=(num_digits,)) as executor:
        '''Use executor to parallelize the process of finding perfect numbers'''

        futures = {
            executor.submit(_terms_sum, terms_worker_func=terms_worker_func, num_digits=num_digits, terms=terms, rng=rng, idx=idx): idx
            for idx, rng in enumerate(_number_ranges(start, terms, num_workers))
        }

        for future in concurrent.futures.as_completed(futures):
            idx = futures[future]
            result = future.result() or mp.mpmathify('0.0')

            logging.debug(f'Adding result from Worker-{idx}')
            results[idx] = result

    # print('results:')
    # for i in range(len(results)):
    #     print(f'{i}: "{mp.nstr(results[i], 20)}..."')
    # print()

    pi = collector(results)

    pi_partition = mp.nstr(pi, num_digits, min_fixed=num_digits).partition('.')
    pi_chars = [pi_partition[0], *pi_partition[2]]
    logging.info(f'{num_digits=:_}, {terms=:_}, {len(pi_chars)=:_}')

    for digit in pi_chars:
        yield int(digit)
