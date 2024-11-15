import random

import dagger
from dagger import dag, function, object_type


@object_type
class AmritRepos:
    @function
    async def publish(self, source: dagger.Directory) -> str:
        """Publish the application container after building and testing it on-the-fly"""
        await self.lint(source)
        return await self.build(source).publish(
            f"ttl.sh/amrit-frontend-{random.randrange(10 ** 8)}"
        )

    @function
    def build(self, source: dagger.Directory) -> dagger.Container:
        """Build the application container"""
        build = (
            self.build_env(source)
            .with_exec(["npm", "run", "build"])            
        )
        public_folder = (build.directory("./public"))        
        static_folder = (build.directory("./.next/static"))
        standalone = (build.directory("./.next/standalone"))
         
        return (
            dag.container()
            .from_("cgr.dev/chainguard/node")
            .with_workdir("/app")
            .with_env_variable("NODE_ENV","production")
            .with_env_variable("HOSTNAME","0.0.0.0")
            .with_directory("/app/public", public_folder)
            .with_directory("/app/.next/static", static_folder)
            .with_directory("/app/", standalone)
            .with_exposed_port(3000)
            .with_entrypoint(["node","server.js"])
        )

    @function
    async def lint(self, source: dagger.Directory) -> str:
        """Return the result of running unit tests"""
        return await (
            self.build_env(source)            
            .with_exec(["npm", "run", "lint"])
            .stdout()
        )

    @function
    def build_env(self, source: dagger.Directory) -> dagger.Container:
        """Build a ready-to-use development environment"""
        node_cache = dag.cache_volume("node")
        return (
            dag.container()
            .from_("cgr.dev/chainguard/node")
            .with_directory("/src", source, owner="node")
            .with_mounted_cache("/root/.npm", node_cache)                   
            .with_workdir("/src")
            .with_exec(["npm", "ci"])
        )
