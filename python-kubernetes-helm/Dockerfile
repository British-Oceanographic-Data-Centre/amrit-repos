FROM python:3.13.5-slim

COPY ./poetry.lock ./pyproject.toml ./README.md /app/
COPY ./amrit_argo_template /app/amrit_argo_template
WORKDIR /app

RUN pip install 'poetry~=2.2.0' && \
    poetry config virtualenvs.create false && \
    poetry install

CMD ["poetry", "run", "gunicorn", "amrit_argo_template:app", "-w", "4", "-b", "0.0.0.0:8000", "-k", "uvicorn.workers.UvicornWorker", "--timeout", "300"]
