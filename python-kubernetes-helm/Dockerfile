FROM python:3.13.5-slim

COPY ./poetry.lock ./pyproject.toml ./README.md /app/
COPY ./python_kubernetes_helm /app/python_kubernetes_helm
WORKDIR /app

RUN pip install 'poetry~=2.2.0' && \
    poetry config virtualenvs.create false && \
    poetry install

CMD ["poetry", "run", "gunicorn", "python_kubernetes_helm:app", "-w", "4", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "--timeout", "300"]
