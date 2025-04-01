package fr.ifremer.example.fruits.clients;

import fr.ifremer.example.fruits.models.Fruit;

public class StubNutritionScoresClient implements INutritionScoresClient {

  @Override
  public Fruit.NutritionScore getNutritionScore() {
    return Fruit.NutritionScore.A;
  }
}
