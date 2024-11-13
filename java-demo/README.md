# Java api template

## TOOLS

### SDKMAN

SDKMAN, an acronym for “Software Development Kit Manager”, is an interesting tool for Java developers wishing to manage JDK (Java Development Kit) versions efficiently. It greatly simplifies the management of different JDK versions, offering simple control of the Java development environment.

Follow this guide to learn how to use Sdkman : <https://www.baeldung.com/java-sdkman-intro>

### Maven Wrapper

Thanks to the wrapper, Maven is embedded in the project (in a defined version). No need to install Maven on your development workstation, just use the wrapper script included in the project.

## Getting Started

Build the application :

```bash
./mvnw clean install
```

## Quality / linting

### Spotless

[Spotless](https://github.com/diffplug/spotless/) is a general-purpose formatting plugin used by 15,000 projects on GitHub (Jan 2023). It is completely à la carte, but also includes powerful "batteries-included" if you opt-in.

Command to build check / apply coding standard with Spotless :

```bash
./mvnw spotless:check
./mvnw spotless:apply
```

### Sonarqube

We can also do more extensive quality control / Linting thanks to Sonarqube and Maven, but to automate this, **it required a SonarQube server that run somewhere**.

In any case, **you can have analysis directly during your devs by adding [SonarLint](https://docs.sonarsource.com/sonarlint/vs-code/) plugin to your IDE**. It provides immediate feedback in your IDE as you write code so you can find and fix issues before a commit.

Thanks to Docker it's also possible to run a Sonarqube locally to execute an analysis with Maven :

1. Automatically run a Sonarqube server locally and execute an analysis on your code :

    ```bash
    docker compose -f compose.sonarqube.yaml up
    ```

2. View the analysis result on the Sonarqube UI running locally : <http://localhost:9000/dashboard?id=fruits&codeScope=overall>

   - login : admin
   - password : sonarqube

#### Costumized configurations

Sonar analysis can be configured via Maven using the dedicated plugin.

```xml
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.10.0.2594</version>
</plugin>
```

Properties can be override throw properties defined in maven configuration file : `pom.xml`.

```xml
<properties>
    <!-- Sonar Plugin Properties-->
    <sonar.language>java</sonar.language>
    <sonar.java.coveragePlugin>jacoco</sonar.java.coveragePlugin>
    <sonar.dynamicAnalysis>reuseReports</sonar.dynamicAnalysis>
    <sonar.coverage.jacoco.xmlReportPaths>${project.build.directory}/site/jacoco/jacoco.xml</sonar.coverage.jacoco.xmlReportPaths>
    <sonar.projectKey>${project.artifactId}</sonar.projectKey>
    <sonar.projectName>${project.artifactId}</sonar.projectName>
    <sonar.host.url>http://localhost:9000</sonar.host.url>
    <sonar.token>REPLACE_BY_YOUR_TOKEN</sonar.token>
    <sonar.qualitygate.wait>true</sonar.qualitygate.wait>
    <sonar.sources>${project.basedir}</sonar.sources>
    <sonar.exclusions>target/**/*, src/test/**/*</sonar.exclusions>
    <sonar.tests>${project.basedir}</sonar.tests>
    <sonar.tests.inclusions>${project.basedir}/src/test/**/*</sonar.tests.inclusions>
    <sonar.skip>false</sonar.skip>
</properties>
```
