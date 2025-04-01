package fr.ifremer.example.fruits.controllers.configurations;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.testcontainers.containers.PostgreSQLContainer;
import org.wiremock.integrations.testcontainers.WireMockContainer;

@TestConfiguration(proxyBeanMethods = false)
public class ContainersConfiguration {

  @Bean
  @ServiceConnection("postgres")
  public PostgreSQLContainer<?> fruitsPostgreSQLContainer() {
    return new PostgreSQLContainer<>("postgres:15.6-alpine").withDatabaseName("fruits");
  }

  @Bean
  public WireMockContainer nutritionScoresContainer(DynamicPropertyRegistry dynamicPropertyRegistry)
      throws IOException {

    var jsonSpec =
        Files.readAllBytes(Paths.get("src/test/resources/wiremock/nutrition-scores.json"));

    var wireMockContainer =
        new WireMockContainer(WireMockContainer.OFFICIAL_IMAGE_NAME)
            .withMappingFromJSON(new String(jsonSpec))
            .withCliArg("--global-response-templating");

    dynamicPropertyRegistry.add(
        "fruits.clients.nutrition-scores.url",
        () -> "http://%s:%d".formatted(wireMockContainer.getHost(), wireMockContainer.getPort()));

    return wireMockContainer;
  }
}
