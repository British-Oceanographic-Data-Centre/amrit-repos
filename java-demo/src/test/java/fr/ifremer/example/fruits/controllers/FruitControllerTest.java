package fr.ifremer.example.fruits.controllers;

import static io.restassured.RestAssured.given;

import fr.ifremer.example.fruits.controllers.configurations.ContainersConfiguration;
import fr.ifremer.example.fruits.models.Fruit;
import fr.ifremer.example.fruits.repositories.IFruitRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Import(ContainersConfiguration.class)
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@ActiveProfiles("TEST")
@Disabled("Testcontainers encounters problems in Gitlab CI")
class FruitControllerTest {

  @LocalServerPort int port;

  @Autowired private IFruitRepository fruitRepository;

  @BeforeEach
  void setup() {
    RestAssured.port = port;
  }

  @Test
  void should_get_all_fruits() {

    // Arrange
    var fruit = new Fruit(1, "Pomme", "Pomme", Fruit.NutritionScore.B, null);
    this.fruitRepository.save(fruit);

    // Act
    var fruits =
        given()
            .contentType(ContentType.JSON)
            .when()
            .get("/fruits")
            .then()
            .log()
            .all()
            .assertThat()
            .statusCode(200)
            .extract()
            .as(Fruit[].class);

    // Assert
    Assertions.assertThat(fruits).hasSizeGreaterThanOrEqualTo(1);
  }

  @Test
  void should_get_fruit_by_id() {

    // Arrange
    var fruit = new Fruit(2, "Poire", "Poire", Fruit.NutritionScore.A, null);
    fruit = this.fruitRepository.save(fruit);

    // Act
    var fruitResult =
        given()
            .contentType(ContentType.JSON)
            .when()
            .get("/fruits/" + fruit.id())
            .then()
            .log()
            .all()
            .assertThat()
            .statusCode(200)
            .extract()
            .as(Fruit.class);

    // Assert
    Assertions.assertThat(fruitResult).isEqualTo(fruit);
  }

  @Test
  void should_get_notfound_fruit_by_id() {

    // Act + Assert
    var fruitResult =
        given()
            .contentType(ContentType.JSON)
            .when()
            .get("/fruits/" + 20)
            .then()
            .log()
            .all()
            .assertThat()
            .statusCode(404);
  }

  @Test
  void should_save_fruit() {

    // Arrange
    var fruit = new Fruit(3, "Banane", "Banane");
    ;

    // Act + Assert
    given()
        .contentType(ContentType.JSON)
        .when()
        .body(fruit)
        .post("/fruits")
        .then()
        .log()
        .all()
        .assertThat()
        .statusCode(201);
  }
}
