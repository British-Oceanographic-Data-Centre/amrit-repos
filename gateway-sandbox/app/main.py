import base64
from cryptography.hazmat.primitives.serialization import load_pem_public_key
from cryptography.hazmat.primitives import serialization
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import json
import os
import dns.resolver
import requests
from requests.exceptions import ConnectionError


app = FastAPI()


def read_peers_file(peer_names_file):
    with open(peer_names_file, "r") as peers_file:
        peers = [line.rstrip() for line in peers_file]
    return peers

def retrieve_metadata_from_peer(peer_address):
    try:
        api_response = requests.get(f"{peer_address}/query")
    except ConnectionError as e:
        print(e)
        return False

    if api_response.status_code == 200:
        json = api_response.json()

        metadata_items = []
        for item in json["data"]:
            answers = dns.resolver.resolve(item["key"], 'TXT')
            for answer in answers:
                public_key_data = f"-----BEGIN PUBLIC KEY-----\n{str(answer)[1:-1]}\n-----END PUBLIC KEY-----"
                signature = base64.b64decode(item["signature"])
                key = load_pem_public_key(public_key_data.encode())
                key.verify(signature, item["metadata"].encode()) # will raise InvalidSignature error if not verified
                print(f"Data signature verified with key {item['key']}")
                metadata_items.append(item)
        return metadata_items
    else:
        return False


@app.get("/retrieve_from_peers")
def retrieve_from_peers():
    peers = read_peers_file(os.path.join(f"/peers/peers_{os.getenv('SERVICE_NUMBER', 1)}.txt"))
    print(f"Querying {len(peers)} peer{'' if len(peers) == 1 else 's'}")
    for peer in peers:
        data = retrieve_metadata_from_peer(peer)
        if data:
            filepath = f"/data/test_{os.getenv('SERVICE_NUMBER', 1)}.json"
            with open(filepath, "r") as data_file:
                local_content = json.loads(data_file.read())
            local_content["data"] = local_content["data"] + data
            with open(filepath, "w") as data_file:
                data_file.write(json.dumps(local_content, sort_keys=True))


@app.get("/query")
def read_data():
    with open(f"/data/test_{os.getenv('SERVICE_NUMBER', 1)}.json", "r") as data_file:
        return json.loads(data_file.read())


@app.get("/read_in_data")
def read_root():
    print("Reading in data")
    with open(f"/data/data_in.json", "r") as data_file:
        dummy_metadata = json.dumps(data_file.read(), sort_keys=True)

    with open("/keys/private_key.pem", "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None
        )

    signed = private_key.sign(dummy_metadata.encode())

    # verify signature
    public_key = private_key.public_key()
    check = public_key.verify(signed, dummy_metadata.encode())

    # encode signature so it can be returned as part of the JSON response
    jsonable_signature = jsonable_encoder(signed, custom_encoder={
        bytes: lambda v: base64.b64encode(v).decode('utf-8')})

    # verify decoded signature
    decoded = base64.b64decode(jsonable_signature)
    check_2 = public_key.verify(decoded, dummy_metadata.encode())

    json_payload = {
        "author": "bodc.ac.uk",
        "key": "bd20c3bc-c2d5-4f98-bbec-413bd63cedd4.keys.bodc.uk",
        "metadata": dummy_metadata,
        "signature": jsonable_signature
    }

    filepath = f"/data/test_{os.getenv('SERVICE_NUMBER', 1)}.json"
    with open(filepath, "r") as data_file:
        stored_data = json.loads(data_file.read())
    if not any(x for x in stored_data["data"] if x["metadata"] == json_payload["metadata"]):
        stored_data["data"].append(json_payload)
        with open(filepath, "w") as data_file:
            data_file.write(json.dumps(stored_data, sort_keys=True))

    return JSONResponse(content=json_payload)
