"""An example application entry-point module."""

from .example import hello

__all__: list[str] = ["main"]


def main() -> None:
    """Print a Hello World message to the console.

    Obtains a Hello World string and prints it.

    Note the use of "Google-style" docstrings:
    https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_google.html 
    """
    message = hello()
    print(message)


if __name__ == "__main__":
    main()
