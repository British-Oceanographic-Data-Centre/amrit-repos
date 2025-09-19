import os
from fastapi import FastAPI

ROOT_PATH = os.getenv("API_ROOT_PATH", "")

app = FastAPI(root_path=ROOT_PATH)


@app.get("/")
def app_status():
    return {"OK"}


@app.get("/hello-world")
def hello_world():
    return {"Hello World!"}
