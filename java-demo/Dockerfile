FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

COPY ./.mvn ./.mvn
COPY ./mvnw ./mvnw
COPY ./pom.xml ./pom.xml
COPY ./src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime

# Common base image.
LABEL org.opencontainers.image.authors="Leo.Bruvry.Lagadec@ifremer.fr"
LABEL org.opencontainers.image.description="Example OCI image for a Java application."
LABEL org.opencontainers.image.url="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.source="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
LABEL org.opencontainers.image.documentation="https://github.com/British-Oceanographic-Data-Centre/amrit-repos/wiki"
LABEL org.opencontainers.image.licenses="TBD"
LABEL org.opencontainers.image.vendor="Advance Marine Research Infrastructures Together (AMRIT)"

WORKDIR /app

RUN <<EOF
set -e
addgroup --system --gid 1001 gcontainer
adduser --system --uid 1001 -G gcontainer spring
EOF

COPY --from=builder --chown=root:gcontainer --chmod=750 /build/target/*.jar app.jar
COPY --chown=root:gcontainer --chmod=750 scripts/run.sh run.sh

EXPOSE 8080

USER spring

ENTRYPOINT ["/app/run.sh"]
