# Airflow – Local Instance (Docker Compose)

This repository provides a ready-to-use **Apache Airflow** instance for **local usage** with **Docker Compose**.

## 🚀 Quick Start

Prerequisites:

- Docker (Engine) + Docker Compose (either the `docker compose` plugin or `docker-compose` binary)
- Linux/macOS/WSL2
- Run Airflow

```bash
./run-airflow.sh
```

The script:

- initializes `AIRFLOW_UID` and `AIRFLOW_GID` with your current user/group IDs,
- performs a `pull`/`build` if needed,
- starts the services in detached mode (`up -d`),
- shows the status and reminds you of useful commands.

- stop Airflow

```bash
./stop-airflow.sh
```

### Web Access

Once running, the Airflow web interface is usually available at:

- <http://localhost:8080>

(The exact port depends on your `compose.yml`.)

## 🗂️ Project Structure

```text
airflow-demo-instance/
├── .env                  # Environment variables (UID, GID, Compose options, etc.)
├── Dockerfile            # Custom Airflow image build (optional)
├── compose.yml           # Main Docker Compose stack
├── compose.override.yml  # Local overrides (ports, extra mounts, etc.)
├── requirements.txt      # Additional Python dependencies installed at startup
├── dags/                 # Your Airflow DAGs (.py files go here)
├── plugins/              # Airflow plugins (custom operators/hooks/providers)
├── logs/                 # Airflow logs (mounted as a volume for persistence)
├── config/               # Airflow configs (default airflow.cfg)
├── data/                 # Data/artifacts used by DAGs (mounted inside containers)
└── run-airflow.sh        # Launch script
```

## ⚙️ Decoder processing chain with Airflow

TODO

## 🔧 Useful Commands

Depending on your environment, replace `docker compose` with `docker-compose` if needed.

```bash
# Check services
docker compose ps

# Follow logs
docker compose logs -f

# Restart after modifications
docker compose up -d --build

# Stop services (keep volumes)
docker compose down

# Stop AND remove volumes (⚠️ deletes Airflow metadata)
docker compose down -v
```

## ❓ Troubleshooting (FAQ)

- **Permission denied on logs or Airflow home**  
  Ensure `AIRFLOW_UID`/`AIRFLOW_GID` match your current user. Re-run `./run-airflow.sh`.

- **`docker: command not found` or Compose not found**  
  Install Docker and the Compose plugin (or the `docker-compose` binary), then try again.

- **Port 8080 already in use**  
  Change the port mapping in `compose.override.yml`.

---

Happy flying ✈️ with Airflow!
