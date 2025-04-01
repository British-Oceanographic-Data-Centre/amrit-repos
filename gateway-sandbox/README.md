AMRIT JWS test

Testing JWS for AMRIT


## Overview
A sample API that responds with a JSON object containing arbitrary data, 
a signature with a hash of the data as well as an indication of the author of the data and public key
required to verify the signature.

## Documentation
https://gitlab.com/-/snippets/4819237

## Endpoints

This demo makes available the following endpoints:

- GET /read_in_data - Signs and adds the data contained in dummy_data/data_in.json to the data file (test_#.json file in dummy_data folder). Will add duplicates.
- GET /query - Returns all data within the data file. Does not verify signature in current implementation
- GET /retrieve_from_peers - Connects to /query endpoint of other nodes specified in files contained in /peers folder, verifies signature and adds their data to own data file

## Development

### Running Locally

Create a `keys` folder on the same level as the `app` folder and place the BODC private key file inside.

#### Docker Compose

`docker compose up gateway-api-1`

#### Local Python installation

`pip install -r requirements.txt`

`fastapi run app/main.py --port 80 --reload`

API response will be available on http://localhost/query

## Demo

1. Add data: Run `docker compose up gateway-api-1`
2. Check http://localhost/query endpoint: No data should be present
3. Call http://localhost/read_in_data endpoint
4. Check http://localhost/query endpoint: Data from data_in.json file has been added along with a signature, author and key properties


5. Add second node: `docker compose up gateway-api-1 gateway-api-2`
6. Check http://localhost:8080/query endpoint: No data should be present
7. Call http://localhost:8080/retrieve_from_peers endpoint
8. Check http://localhost:8080/query endpoint: Data from node 1 has been added along with original signature. Logs show that signature has been verified


9. Add third node: `docker compose up gateway-api-1 gateway-api-2 gateway-api-3`
10. Check http://localhost:8081/query endpoint: No data should be present
11. Call http://localhost:8081/retrieve_from_peers endpoint
12. Check http://localhost:8081/query endpoint: Data from node 1 has been retrieved from node 2 and added along with original signature from node 1. Logs show that signature has been verified