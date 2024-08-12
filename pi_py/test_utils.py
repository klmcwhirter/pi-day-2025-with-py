import pytest

from pi_py.utils import (_pi_digits_go_writer, _pi_digits_js_writer,
                         _pi_digits_py_writer, _pi_digits_ts_writer,
                         _pi_digits_zig_writer, pi_digits_writer_from_ext)


@pytest.mark.parametrize(
    ['filepath', 'expected'],
    [
        # just filename
        ('pi.go', _pi_digits_go_writer),
        ('pi.js', _pi_digits_js_writer),
        ('pi.py', _pi_digits_py_writer),
        ('pi.ts', _pi_digits_ts_writer),
        ('pi.zig', _pi_digits_zig_writer),

        # with path
        ('/absolute/path/pi.go', _pi_digits_go_writer),
        ('/absolute/path/pi.js', _pi_digits_js_writer),
        ('/absolute/path/pi.py', _pi_digits_py_writer),
        ('/absolute/path/pi.ts', _pi_digits_ts_writer),
        ('/absolute/path/pi.zig', _pi_digits_zig_writer),
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
