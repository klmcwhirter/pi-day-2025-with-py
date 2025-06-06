'''Generate file for digits of PI by algorithm and file extension'''

import logging
import multiprocessing
import sys

from pi_py.algo.generators import digits_gen_from_algo
from pi_py.utils import config_logging
from pi_py.writer import pi_digits_writer_from_ext


def main() -> None:
    config_logging()

    #
    # pre-generate these - gosper takes ~3 hrs for 1_000_000 digits!
    #
    # pdm gen pi_wasm/assembly/pi-digits/pi_baseline.ts baseline
    # pdm gen pi_wasm/assembly/pi-digits/pi_bbp.ts bbp 1_000_000
    # pdm gen pi_wasm/assembly/pi-digits/pi_bellard.ts bellard 1_000_000 350_000
    # pdm gen pi_wasm/assembly/pi-digits/pi_gosper.ts gosper
    # pdm gen pi_wasm/assembly/pi-digits/pi_sinha_saha.ts sinha_saha 711 5_000

    if len(sys.argv) < 3:
        print('''Usage: python -m pi_py.pi_digits filename.ext generator [num_digits] [terms]
              where
              generator is one of baseline, bbp, bellard, gosper, madhava, sinha_saha, tachus
              ext is one of go, js, py, ts, zig''')
        sys.exit(1)

    num_digits = int(sys.argv[3]) if len(sys.argv) > 3 else 1_000_000
    terms = int(sys.argv[4]) if len(sys.argv) > 4 else num_digits

    algo = sys.argv[2]
    generator = digits_gen_from_algo(algo)

    logging.info(f'Start generating {num_digits:_} digits of pi ...')
    digits = [d for d in generator(num_digits=num_digits, terms=terms)]
    logging.info('Done generating digits of pi')

    file_path = sys.argv[1]
    logging.info(f'Start writing to {file_path}...')

    writer = pi_digits_writer_from_ext(file_path)

    with open(file_path, 'w') as f:
        writer(f, digits, __spec__.name, ' '.join([file_path, algo]), f'pi_{algo}_seed')

    logging.info(f'Done writing to {file_path}.')


if __name__ == '__main__':
    multiprocessing.set_start_method('spawn')  # prepare for ProcessPoolExecutor use

    main()
