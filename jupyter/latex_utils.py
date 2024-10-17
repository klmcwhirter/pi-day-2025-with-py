
import logging

import sympy as sym
from IPython.display import Math, display
from sympy import Basic

_display_level = logging.DEBUG


def set_display_level(level: int) -> None:
    global _display_level
    _display_level = level


def sym_display_latex(msg: str, basic: Basic, /, display_level: int = logging.DEBUG) -> None:
    if _display_level == logging.DEBUG or _display_level <= display_level:
        s = msg
        s += sym.latex(basic)
        display(Math(s))


# UTF-8 KaTeX / LaTeX equivs
# --------------------------
# \RIGHTWARDS DOUBLE ARROW    ⇒
# \lambda                     λ
# \pi                         𝜋

# λ = sym.symbols('λ', real=True)
