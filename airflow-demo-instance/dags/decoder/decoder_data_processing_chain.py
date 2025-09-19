"""DAG Processor — pour CHAQUE message : create dir -> validate (Singularity) -> trigger publish"""

from __future__ import annotations
from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.singularity.operators.singularity import SingularityOperator

HOST_DATA_DIRECTORY = "/opt/airflow/data"

processor_dag = DAG(
    dag_id="argo-decoder-data-processing-chain",
    dag_display_name="#️⃣ Argo - Decoder data processing chain",
    default_args={
        "owner": "lbruvryl",
        "depends_on_past": False,
        "email": ["lbruvryl@ifremer.fr"],
        "email_on_failure": False,
        "email_on_retry": False,
        "start_date": datetime(2025, 3, 24),
        "retries": 3,
        "retry_delay": timedelta(seconds=30),
        "retry_exponential_backoff": True,
    },
    description="Validates a single MQTT message, then triggers the publish DAG.",
    schedule=None,  # déclenché par le listener
    catchup=False,
    is_paused_upon_creation=False,
    tags=["Argo", "AMRIT", "Decoder"],
)


decoder_data_processing_task = SingularityOperator(
    task_id="decoder_data_processing_task",
    image="docker://ghcr.io/euroargodev/coriolis-data-processing-chain-for-argo-floats-container:066a",
    command="python3 /app/wis2_data_processing_chain/standards/validate_stac.py",
    force_pull=False,
    options=[
        "--bind",
        "runtime-matlab-volume:/mnt/runtime:ro",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo_inputs/input:/mnt/data/rsync:rw",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo_inputs/config:/mnt/data/config:ro",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo_outputs:/mnt/data/output:rw",
    ],
    environment={
        # "APPTAINER_DOCKER_USERNAME": "{{ var.value.project_registry_user }}",
        # "APPTAINER_DOCKER_PASSWORD": "{{ var.value.project_registry_password }}",
    },
    dag=processor_dag,
)


(decoder_data_processing_task)
