"""Example unit testing (via PyTest) module for an application entry point."""

from example.__main__ import main


def test_main(mocker):
    """Test that main prints the correct message."""
    mock_print = mocker.patch("builtins.print")

    main()

    mock_print.assert_called_once_with("Hello World!")
