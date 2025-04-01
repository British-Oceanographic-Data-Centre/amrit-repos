package fr.ifremer.example.fruits.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Column;

public record Fruit(
    @Id Integer id,
    String name,
    String description,
    @Column("score") NutritionScore nutritionScore,
    @Version Integer version) {

  public Fruit(Integer id, String name, String description) {
    this(id, name, description, null, null);
  }

  public Fruit withNutritionScore(NutritionScore nutritionScore) {
    return new Fruit(id, name, description, nutritionScore, version);
  }

  @Override
  public boolean equals(Object o) {

    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Fruit fruit = (Fruit) o;

    return id.equals(fruit.id);
  }

  @Override
  public int hashCode() {
    return id.hashCode();
  }

  public enum NutritionScore {
    A,
    B,
    C,
    D,
    E;
  }
}
