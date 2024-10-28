import logging
import string
import sys

from pi_py.utils import config_logging
from pi_py.writer import (pi_digits_writer_from_ext,
                          pi_digits_writer_supported_exts)


def read_digits(file_path: str) -> list[int]:
    with open(file_path, 'r') as f:
        content = f.read().strip('\r').strip('\n')

    digits = [int(d) for d in content if d in string.digits]

    return digits


def main():
    config_logging()

    if len(sys.argv) < 3:
        logging.error(
            f'''
python -m pi_py.pi_1000000 input_file.txt output_file.ext

where
    input_file.txt contains text of digits of pi, e.g., 3.141592653...
    .ext if one of {pi_digits_writer_supported_exts()}
''')
        return 255

    file_path = sys.argv[1] if len(sys.argv) > 1 else './etc/pi_1000000.txt'
    logging.info(f'Reading {file_path} ...')

    digits = read_digits(file_path)

    logging.info(f'Reading {file_path} ... done')

    file_path = sys.argv[2] if len(sys.argv) > 2 else './pi_wasm/src/pi_digits/pi_1000000.zig'
    logging.info(f'Writing {file_path} ...')

    writer = pi_digits_writer_from_ext(file_path)

    with open(file_path, 'w') as f:
        file_path = f'{sys.argv[1]} {sys.argv[2]}'
        writer(f, digits, __spec__.name, file_path, 'pi_1000000_seed')

    logging.info(f'Writing {file_path} ... done')


if __name__ == '__main__':
    main()
