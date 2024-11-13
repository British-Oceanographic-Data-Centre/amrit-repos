"""Example unit testing (via PyTest) module."""

from example import hello


def test_hello():
    """Test that hello returns the correct message."""
    assert hello() == "Hello World!"
