import base64
import dns.resolver
import requests
from cryptography.hazmat.primitives.serialization import load_pem_public_key

if __name__ == "__main__":
    api_response = requests.get('http://localhost')
    json = api_response.json()

    answers = dns.resolver.resolve(json["key"], 'TXT')
    for answer in answers:
        public_key_data = f"-----BEGIN PUBLIC KEY-----\n{str(answer)[1:-1]}\n-----END PUBLIC KEY-----"
        signature = base64.b64decode(json["signature"])
        key = load_pem_public_key(public_key_data.encode())
        valid_check = key.verify(signature, json["data"].encode()) # passes
        # invalid_check = key.verify(signature, ("something").encode()) # raises InvalidSignature error

