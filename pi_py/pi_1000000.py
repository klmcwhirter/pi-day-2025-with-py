import logging
import string

from .utils import pi_digits_writer_from_ext


def main():
    logging.basicConfig(level=logging.DEBUG, format='{asctime} - {module} - {funcName} - {levelname} - {message}', style='{')
    logging.getLogger().setLevel(level=logging.DEBUG)

    file_path = './etc/pi1000000.txt'
    logging.info(f'Reading {file_path} ...')

    with open(file_path, 'r') as f:
        content = f.read()

    logging.info(f'Reading {file_path} ... done')

    file_path = './wasm/src/pi_1000000.zig'
    logging.info(f'Writing {file_path} ...')

    writer = pi_digits_writer_from_ext(file_path)

    digits = (int(d) for d in content if d in string.digits)
    with open(file_path, 'w') as f:
        writer(f, digits)

    logging.info(f'Writing {file_path} ... done')


if __name__ == '__main__':
    main()
