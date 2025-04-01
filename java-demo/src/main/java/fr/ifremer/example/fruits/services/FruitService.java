package fr.ifremer.example.fruits.services;

import fr.ifremer.example.fruits.clients.INutritionScoresClient;
import fr.ifremer.example.fruits.models.Fruit;
import fr.ifremer.example.fruits.repositories.IFruitRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FruitService {

  private final IFruitRepository fruitRepository;

  private final INutritionScoresClient nutritionScoresClient;

  private static final Logger LOGGER = LoggerFactory.getLogger(FruitService.class);

  public FruitService(
      IFruitRepository fruitRepository, INutritionScoresClient nutritionScoresClient) {
    this.fruitRepository = fruitRepository;
    this.nutritionScoresClient = nutritionScoresClient;
  }

  public List<Fruit> all() {

    LOGGER.info("Collecting all the fruit");
    return this.fruitRepository.findAll();
  }

  public Optional<Fruit> byId(Integer id) {

    LOGGER.info("Collecting fruit of Id : {}", id);
    return this.fruitRepository.findById(id);
  }

  public Integer save(Fruit fruit) {

    LOGGER.info("Get nutrition score of fruit Id : {}", fruit.id());
    var nutritionScore = this.nutritionScoresClient.getNutritionScore();

    fruit = fruit.withNutritionScore(nutritionScore);

    LOGGER.info("Save fruit -> {}", fruit);
    return this.fruitRepository.save(fruit).id();
  }
}
