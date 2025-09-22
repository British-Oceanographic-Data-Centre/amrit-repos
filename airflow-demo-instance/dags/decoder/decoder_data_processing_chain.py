"""DAG Processor — pour CHAQUE message : create dir -> validate (Singularity) -> trigger publish"""

from __future__ import annotations
from datetime import datetime, timedelta
from airflow import DAG
from airflow.models.param import Param
from airflow.providers.singularity.operators.singularity import SingularityOperator

HOST_DATA_DIRECTORY = "/opt/airflow/data"
HOST_MATLAB_RUNTIME = "/opt/matlab/runtime"
DEFAULT_WMO = 6902892

processor_dag = DAG(
    dag_id="argo-decoder-data-processing-chain",
    dag_display_name="#️⃣ Argo demonstration - Decoder data processing chain",
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
    description="Run Argo decoder Container from https://github.com/euroargodev/Coriolis-data-processing-chain-for-Argo-floats-container",
    schedule=None,
    catchup=False,
    is_paused_upon_creation=False,
    tags=["Argo", "AMRIT", "Decoder"],
    render_template_as_native_obj=True,
    params={
        "float_wmo": Param(
            DEFAULT_WMO,
            type="integer",
            title="Float WMO",
            description="WMO of Argo float with data "
        )
    },
)


decoder_data_processing_task = SingularityOperator(
    task_id="decoder_data_processing_task",
    image="docker://ghcr.io/euroargodev/coriolis-data-processing-chain-for-argo-floats-container:066a",
    command="/app/entrypoint.sh /mnt/runtime rsynclog all configfile /mnt/data/config/decoder_conf.json xmlreport co041404_20250922_6902892.xml floatwmo 6902892 PROCESS_REMAINING_BUFFERS 1",
    force_pull=False,
    options=[
        "--bind",
        f"{HOST_MATLAB_RUNTIME}/R2022b:/mnt/runtime:ro",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo/input:/mnt/data/rsync:rw",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo/config:/mnt/data/config:ro",
        "--bind",
        f"{HOST_DATA_DIRECTORY}/decArgo_demo/outputs:/mnt/data/output:rw",
    ],
    dag=processor_dag,
)


(decoder_data_processing_task)
