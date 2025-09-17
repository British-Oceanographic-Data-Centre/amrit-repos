A simple example of a Python API using FastAPI with a Dockerfile and Helm charts for deploying to a Kubernetes cluster.

### Prerequisites:

The following need to be installed locally before completing the steps below:

1. Docker
2. Kubernetes
3. Helm

An installation of all three tools is provided for example with Rancher Desktop.

### Usage:

1. Build the Docker image
    ```shell
    docker build . -t python-kubernetes
    ```
    The Docker image can be run locally using the following command, making the /hello-world endpoint available on http://localhost:8000/hello-world
    ```shell
    docker run -p 8000:8000 python-kubernetes
    ```

2. Deploy to Kubernetes manually

    ```shell
    kubectl run python-kubernetes --image=python-kubernetes:latest  --image-pull-policy=Never --port=8000
    kubectl port-forward pods/python-kubernetes 8000:8000
    ```
   The /hello-world endpoint should then be available on http://localhost:8000/hello-world

    Remove the pod by running:
    ```shell
    kubectl delete pod python-kubernetes
    ```
   
3. Deploy to Kubernetes using Helm
   ```shell
   helm install python-kubernetes .\helm-chart\
   kubectl get pods
   kubectl port-forward {pod-name} 8000:8000
   ```
   The /hello-world endpoint should then be available on http://localhost:8000/hello-world
    
    Uninstall the Helm deployment using
    ```shell
    helm uninstall python-kubernetes
    ```