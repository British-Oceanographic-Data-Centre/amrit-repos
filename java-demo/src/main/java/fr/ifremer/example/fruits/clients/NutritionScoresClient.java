package fr.ifremer.example.fruits.clients;

import fr.ifremer.example.fruits.models.Fruit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NutritionScoresClient implements INutritionScoresClient {

  @Value("${fruits.clients.nutrition-scores.url}")
  private String baseUrl;

  private final RestClient restClient;

  public NutritionScoresClient(RestClient.Builder builder) {
    this.restClient = builder.build();
  }

  @Override
  public Fruit.NutritionScore getNutritionScore() {

    return this.restClient
        .get()
        .uri(this.baseUrl + "/fruit")
        .exchange(
            (request, response) -> {
              if (response.getStatusCode().is2xxSuccessful()) {
                var body = response.bodyTo(NutritionScore.class);
                return Fruit.NutritionScore.valueOf(body.score);
              }

              throw new RuntimeException("Response status : " + response.getStatusCode());
            });
  }

  private record NutritionScore(String score) {}
}
