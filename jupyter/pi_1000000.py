
import sympy as sym


def read_digits(file_path: str) -> str:
    content = '3.141592653'

    with open(file_path, 'r') as f:
        content = f.read().strip('\r').strip('\n')

    return content


def read_pi_control(file_path: str, num_digits: int) -> sym.Float:
    digits = read_digits(file_path=file_path)
    rc = sym.Float(digits, num_digits)
    return rc
