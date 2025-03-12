AMRIT JWS test

Testing JWS for AMRIT


## Overview
A sample API that responds with a JSON object containing arbitrary data, 
a signature with a hash of the data as well as an indication of the author of the data and public key
required to verify the signature.


## Documentation

https://gitlab.com/-/snippets/4819237


## Development

### Running Locally

`pip install -r requirements.txt`

`fastapi run app/main.py --port 80 --reload`

API response will be available on http://localhost/