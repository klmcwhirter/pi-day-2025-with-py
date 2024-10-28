import pytest

from pi_py.writer import (_go_writer, _js_writer, _py_writer, _ts_writer,
                          _zig_writer, pi_digits_writer_from_ext)


@pytest.mark.parametrize(
    ['filepath', 'expected'],
    [
        # just filename
        ('pi.go', _go_writer),
        ('pi.js', _js_writer),
        ('pi.py', _py_writer),
        ('pi.ts', _ts_writer),
        ('pi.zig', _zig_writer),

        # with path
        ('/absolute/path/pi.go', _go_writer),
        ('/absolute/path/pi.js', _js_writer),
        ('/absolute/path/pi.py', _py_writer),
        ('/absolute/path/pi.ts', _ts_writer),
        ('/absolute/path/pi.zig', _zig_writer),
    ]
)
def test_pi_digits_writer_from_ext(filepath: str, expected):
    rc = pi_digits_writer_from_ext(filepath)
    assert expected == rc


@pytest.mark.parametrize(
    ['filepath'],
    [
        ('.ts',),  # no stem in filepath
        ('',),
        (None,),
    ]
)
def test_pi_digits_writer_from_ext_throws(filepath):
    with pytest.raises(ValueError):  # as e_info:
        _ = pi_digits_writer_from_ext(filepath)
