# AMRIT Repos

A series of "best practice" examples for code quality, testing, and style for open source code written under the AMRIT banner, leveraging CI/CD pipelines for package publication and automatic enforcement of these requirements.

## Languages
- Java
- Python
- TypeScript

## Requirements
- Code linting
- Code testing
- Code type-checking (Python-only)
- Containerised development environments and application images

## Implementation and Frameworks
| Language | Linting | Testing | Typing | Containerisation | Images | CI/CD |
| :------: | :-----: | :-----: | :----: | :--------------: | :----: | :---: |
| Java | [Spotless](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos%20%3CgroupId%3Ecom.diffplug.spotless%3C%2FgroupId%3E&type=code) | [JUnit](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/tree/main/java-demo/src/test) | [N/A](## "Java is a statically typed language.") | [Docker](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/java-demo/Dockerfile) + [Compose](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/java-demo/compose.yaml) | [GitHub Packages](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/pkgs/container/amrit-repos%2Fjava%2Fapp) | [GitHub Actions](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos+path%3A.github%2Fworkflows%2Fjava-*.yml+&type=code) |
| Python | [Ruff](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos%20%5Btool.ruff%5D&type=code) | [PyTest](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/example-python/tests/test_main.py) | [MyPy](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos%20%5Btestenv%3Atype%5D&type=code) | [Docker](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/example-python/Dockerfile) | [GitHub Packages](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/pkgs/container/amrit-repos%2Fpython%2Fapp) | [GitHub Actions](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos+path%3A.github%2Fworkflows%2Fpython-*.yaml+&type=code) |
| TypeScript | [ESLint](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/typescript-demo/.eslintrc.json) | [N/A](## "In future, we expect to use front-end testing frameworks such as Cypress.") | [Strict](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos+path%3Atypescript-demo%2Ftsconfig.json+%22strict%22%3A+&type=code) | [Docker](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/blob/main/typescript-demo/Dockerfile) | [GitHub Packages](https://github.com/British-Oceanographic-Data-Centre/amrit-repos/pkgs/container/amrit-repos%2Ftypescript%2Fapp) | [GitHub Actions](https://github.com/search?q=repo%3ABritish-Oceanographic-Data-Centre%2Famrit-repos+path%3A.github%2Fworkflows%2Fts-*.yml&type=code) |

All of our chosen linting rules, tests, as well as package builds can be executed both locally on developer machines and in the cloud via GitHub Actions.

### Java
#### Spotless
[Spotless](https://github.com/diffplug/spotless) is a static analysis and formatting tool for multiple languages, including Java. Our Java example runs spotless via Maven.

#### JUnit
[JUnit](https://junit.org/) is a testing framework for Java. The unit tests we have written for this example run automatically at build time.


#### Maven

### Python
#### Ruff
[Ruff](https://github.com/astral-sh/ruff) is a static analysis and formatting tool for Python, serving as an aggregator of rules multiple analysis and formatting tools. Our Python example is subject to a customised collection of Ruff rules including (but not limited to) those from [Black](https://black.readthedocs.io/en/stable/), [PyLint](https://pylint.readthedocs.io/en/latest/), [Flake8](https://github.com/pycqa/flake8), and [Bandit](https://github.com/PyCQA/bandit). Our Ruff rules are evaluated via Tox.

#### PyTest
[PyTest](https://docs.pytest.org/en/stable/) is a testing framework for Python. The unit tests we have written for this example are run via Tox.

#### MyPy
[MyPy](https://github.com/python/mypy) is a static type checker for Python. It is run against our example code via Tox.

#### Tox
[Tox](https://tox.wiki/en/4.23.2/) is a tool for automating the application of tests and other jobs against Python code.

### TypeScript
#### ESLint
[ESLint](https://eslint.org/) is a static analysis and formatting tool for JavaScript with official plugins supporting NextJS and TypeScript.

#### Strict mode
TypeScript features optional static typing via [strict mode](https://www.typescriptlang.org/tsconfig/#strict), which has been enabled for our example code.

### Docker and Docker Compose
[Docker](https://www.docker.com/) is a tool for the development and execution of OCI-standard container images. It is used to build and run images for our Java, Python, and TypeScript example applications.

[Docker Compose](https://docs.docker.com/compose/) is a tool for the orchestration of simple container-based applications, using declarative configuration files to manage single or multi-image applications that may be made up of multiple discrete services or single, self-sufficient images. It is used to run our Java example application.

### GitHub Packages
[GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages) is a software package hosting service that is tightly integrated with GitHub's ecosystem. By hosting our container images here, we make the process of downloading and running these example applications trivial:
```console
$ docker run -it -p 3000:3000 ghcr.io/british-oceanographic-data-centre/amrit-repos/typescript/app:v0.0.1
Unable to find image 'ghcr.io/british-oceanographic-data-centre/amrit-repos/typescript/app:v0.0.1' locally
v0.0.1: Pulling from british-oceanographic-data-centre/amrit-repos/typescript/app
e9a0b478e7f1: Pull complete 
4f4fb700ef54: Pull complete 
8c0df919cab1: Pull complete 
f45f60386990: Pull complete 
f776f51c2328: Pull complete 
8775af10215f: Pull complete 
249fa440efa3: Pull complete 
34abd3a84db0: Pull complete 
aa9688cbfd22: Pull complete 
Digest: sha256:9b183d5aebd53fa96ec45fb9dc355cdb60147afc0232c43870da6aaedeb017ff
Status: Downloaded newer image for ghcr.io/british-oceanographic-data-centre/amrit-repos/typescript/app:v0.0.1
   ▲ Next.js 15.0.3
   - Local:        http://localhost:3000
   - Network:      http://0.0.0.0:3000

 ✓ Starting...
 ✓ Ready in 58ms
```
```console
$ firefox http://localhost:3000
```
![image](https://github.com/user-attachments/assets/87cdc725-f981-400b-ad86-e8351fb2af2d)


### GitHub Actions
[GitHub Actions](https://github.com/features/actions) is a CI/CD service that allows developers to run customised jobs for building, testing, and deploying code in a variety of different ways. Our example code is tested and built in the cloud via GitHub actions, then automatically included in container image builds that are published to the GitHub Packages namespace associated with this repository whenever a new release is created.
