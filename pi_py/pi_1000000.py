import logging
import string
import sys

from pi_py.utils import pi_digits_writer_from_ext


def read_digits(file_path: str) -> list[int]:
    with open(file_path, 'r') as f:
        content = f.read().strip('\r').strip('\n')

    digits = [int(d) for d in content if d in string.digits]

    return digits


def main():
    logging.basicConfig(
        level=logging.DEBUG, format='{asctime} - {module} - {funcName} - {levelname} - {message}', style='{')
    logging.getLogger().setLevel(level=logging.DEBUG)

    file_path = './etc/pi1000000.txt'
    logging.info(f'Reading {file_path} ...')

    digits = read_digits(file_path)

    logging.info(f'Reading {file_path} ... done')

    file_path = sys.argv[1] if len(sys.argv) > 1 else './wasm/src/pi_1000000.zig'
    logging.info(f'Writing {file_path} ...')

    writer = pi_digits_writer_from_ext(file_path)

    with open(file_path, 'w') as f:
        writer(f, digits, __spec__.name, file_path, 'pi_1000000_seed')

    logging.info(f'Writing {file_path} ... done')


if __name__ == '__main__':
    main()
