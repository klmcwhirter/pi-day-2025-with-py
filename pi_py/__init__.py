'''piadapter - adapter for tests'''

import logging
import os
import sys
from dataclasses import dataclass
from functools import cache
from typing import Optional

from pi_py.pi_digits import gosper_pi_digits
from pi_py.utils import batched


@dataclass
class HistogramInterop:
    num_digits: int
    histogram: list[int]


logging.basicConfig(level=logging.DEBUG, format='PYTHON: {asctime} - {module} - {funcName} - {levelname} - {message}', style='{')


class PiAdapter:
    def __init__(self) -> None:
        self._cached_pi: list[int] = []
        self.histograms: dict[int, list[int]] = {}
        self._version: Optional[list[str]] = None

    def __repr__(self) -> str:
        return 'PiAdapter()'

    def _cache_pi_digits(self, num_digits: int):
        if len(self._cached_pi) < num_digits:
            self._cached_pi = [d for d in gosper_pi_digits(num_digits)]

    def seed_pi_digits(self, pi_digits_seed: list[int]):
        self._cached_pi = pi_digits_seed

    def histograms_seed_cache(self, histograms: list[HistogramInterop]):
        logging.info('PiAdapter.histograms_seed_cache(...)')

        # seed the cache
        self.histograms = {hi.num_digits: hi.histogram for hi in histograms}

        from pprint import pformat
        logging.info(f'PiAdapter.histograms_seed_cache: histograms={pformat(self.histograms, width=132, sort_dicts=False)}')

    @cache
    def histogram(self, num_digits: int) -> list[int]:
        rc: list[int] = self.histograms[num_digits] if num_digits in self.histograms else []

        if len(rc) == 0:
            #
            # leave this logic here for perf tests
            #
            self._cache_pi_digits(num_digits)

            # leverage the fact that pi_digit_generator is idempotent for some max num_digits value
            # the first num_digits of pi will be the same for any num_digits value up to and including num_digits
            digits = [n for n in self._cached_pi[:num_digits]]

            rc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
            for d in digits:
                rc[d] += 1

            from pprint import pformat
            logging.info(f'PiAdapter.histogram({num_digits}): {pformat(rc)}')

        return rc

    def pi_digits(self, num_digits: int, n: int) -> list[list[int]]:
        '''Return num_digits of PI batched n at a time'''
        logging.info(f'PiAdapter.pi_digits({num_digits}, {n})')
        self._cache_pi_digits(num_digits)

        # leverage the fact that pi_digit_generator is idempotent for some max num_digits value
        # the first num_digits of pi will be the same for any num_digits value up to and including num_digits
        return [da for da in batched([int(digit) for digit in self._cached_pi[:num_digits]], n)]

    def version(self):
        if not self._version:
            python_ver = f'{sys.version}]'

            os_uname = os.uname()
            os_version = f'{os_uname.sysname} {os_uname.machine} {os_uname.release}'

            self._version = [
                f'Python: {python_ver}',
                f'Host: {os_version}'
            ]
            logging.info(f'PiAdapter.version: {self._version}')

        return self._version


pia = PiAdapter()
