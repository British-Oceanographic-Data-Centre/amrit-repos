package fr.ifremer.example.fruits.services;

import fr.ifremer.example.fruits.clients.StubNutritionScoresClient;
import fr.ifremer.example.fruits.models.Fruit;
import fr.ifremer.example.fruits.repositories.FakeFruitRepository;
import fr.ifremer.example.fruits.repositories.IFruitRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;

@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
class FruitServiceTest {

  private FruitService fruitService;

  private IFruitRepository fruitRepository;

  @BeforeEach
  void setup() {
    this.fruitRepository = new FakeFruitRepository();
    this.fruitService = new FruitService(fruitRepository, new StubNutritionScoresClient());
  }

  @Test
  void should_get_all_fruits() {

    // Arrange
    var fruitExpected = new Fruit(1, "Pomme", "Pomme de CodeWhisperer");
    this.fruitRepository.save(fruitExpected);

    // Act
    var fruits = this.fruitService.all();

    // Assert
    Assertions.assertThat(fruits).containsOnly(fruitExpected);
  }

  @Test
  void should_get_fruit_by_id() {

    // Arrange
    var fruitExpected = new Fruit(1, "Pomme", "Pomme de CodeWhisperer");
    this.fruitRepository.save(fruitExpected);

    // Act
    var fruit = this.fruitService.byId(1);

    // Assert
    Assertions.assertThat(fruit).isPresent().get().isEqualTo(fruitExpected);
  }

  @Test
  void should_get_empty_fruit_by_id() {

    // Act
    var fruit = this.fruitService.byId(10);

    // Assert
    Assertions.assertThat(fruit).isNotPresent();
  }

  @Test
  void should_save_fruit() {

    // Arrange
    var fruit = new Fruit(1, "Poire", "Poire de CodeWhisperer");

    // Act
    var id = this.fruitService.save(fruit);

    // Assert
    Assertions.assertThat(id).isNotNull();
  }
}
