FROM python:3.12 AS base
# Common base image.
LABEL org.opencontainers.image.authors="matcaz@noc.ac.uk"
LABEL org.opencontainers.image.description="Example OCI image for a Python application."
LABEL org.opencontainers.image.url="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.source="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.documentation="https://github.com/British-Oceanographic-Data-Centre/amrit-repos/wiki"
LABEL org.opencontainers.image.licenses="TBD"
LABEL org.opencontainers.image.vendor="Advance Marine Research Infrastructures Together (AMRIT)"

# Install Poetry for dependency management.
ENV POETRY_HOME=/opt/poetry
ENV PATH="${POETRY_HOME}/bin:${PATH}"
RUN mkdir -p /opt/poetry/project /opt/poetry/bin
RUN curl -sSL https://install.python-poetry.org | python -

# Install dependencies.
COPY pyproject.toml poetry*.lock README.md /opt/poetry/project/
RUN \
    cd /opt/poetry/project && \
    poetry config virtualenvs.create false && \
    if [ ! -f poetry.lock ]; then poetry lock; fi && \
    poetry install --no-root && \
    poetry env info


FROM base AS dev
# Shared development environment.
RUN useradd -ms /bin/bash developer
USER developer
WORKDIR /home/developer
USER root
# Install extra dependencies.
RUN cd /opt/poetry/project && poetry install --no-root --with build,lint,test
USER developer


FROM base AS build
# Ephemeral environment for building packages.
RUN --mount=type=bind,source=.,target=/opt/project,rw=true \
    cd /opt/project && \
    rm -rf ./dist && \
    poetry build && \
    mkdir /opt/build && \
    mv ./dist/*.whl /opt/build


FROM base AS app
# User-facing application environment.
RUN --mount=type=bind,from=build,source=/opt/build,target=/opt/build \
    pip install /opt/build/*.whl && \
    which amrit-example
RUN useradd -ms /bin/bash app
USER app
WORKDIR /home/app
# Start application on run.
ENTRYPOINT ["amrit-example"]
