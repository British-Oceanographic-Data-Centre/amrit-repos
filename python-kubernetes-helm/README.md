A simple example of a Python API using FastAPI with a Dockerfile and Helm charts for deploying to a Kubernetes cluster.

### Prerequisites:

The following need to be installed locally before completing the steps below:

1. Docker
2. Kubernetes
3. Helm

An installation of all three tools is provided for example with [Rancher Desktop](https://rancherdesktop.io/).

Alternatively, Docker Compose can be installed and used to run the container via
```shell
docker compose up
```
The /hello-world endpoint should then be available on http://localhost:8000/hello-world

The containers can be removed when no longer required using
```shell
docker compose down
```

### Usage:

1. #### Build the Docker image
    ```shell
    docker build . -t python-kubernetes
    ```
    The Docker image can be run locally using the following command, making the /hello-world endpoint available on http://localhost:8000/hello-world
    ```shell
    docker run -p 8000:8000 python-kubernetes
    ```
   Stop the Docker container before moving on to the next step.

2. #### Deploy to Kubernetes manually

    ```shell
    kubectl run python-kubernetes --image=python-kubernetes:latest  --image-pull-policy=Never --port=8000
    kubectl port-forward pods/python-kubernetes 8000:8000
    ```
   The /hello-world endpoint should then be available on http://localhost:8000/hello-world

    Remove the pod by running:
    ```shell
    kubectl delete pod python-kubernetes
    ```
   
3. #### Deploy to Kubernetes using Helm
   
   The Helm charts are configured to deploy images that are part of the Argo toolbox. The ingress routes requests to the different service backends.

   ```shell
   helm install python-kubernetes .\helm-chart\
   kubectl get pods
   kubectl port-forward {pod-name} 8000:8000
   ```
   The /hello-world endpoint should then be available on http://localhost:8000/argo-toolbox/api/boilerplate/hello-world
    
    Uninstall the Helm deployment using
    ```shell
    helm uninstall python-kubernetes
    ```