# amrit-repos

## dagger ci/cd
This branch contains an example dagger pipeline for builidng a container and pushing it to ttl.sh for the typescript-demo folder. 

To run this pipeline a developer will need to install dagger on their machine. 
best option is to follow the install path given via the dagger [website](https://docs.dagger.io/install).

once installed make sure your are in the amrit-repos directory then you can test/run the pipeline with
```shell
dagger call publish --source=typescript-demo 
```
if only linting is wanted to be run then 
```shell
dagger call lint --source=typescript-demo
```