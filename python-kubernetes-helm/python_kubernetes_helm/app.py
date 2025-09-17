from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def app_status():
    return {"OK"}


@app.get("/hello-world")
def hello_world():
    return {"Hello World!"}
