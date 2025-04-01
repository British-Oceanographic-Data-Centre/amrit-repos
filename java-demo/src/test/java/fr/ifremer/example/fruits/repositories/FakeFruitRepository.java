package fr.ifremer.example.fruits.repositories;

import fr.ifremer.example.fruits.models.Fruit;
import java.util.*;

public class FakeFruitRepository implements IFruitRepository {

  private final Set<Fruit> FRUITS = new HashSet<>();

  @Override
  public Optional<Fruit> findById(Integer id) {

    return FRUITS.stream().filter(fruit -> Objects.equals(id, fruit.id())).findFirst();
  }

  @Override
  public Fruit save(Fruit fruit) {

    if (Objects.isNull(fruit) || FRUITS.contains(fruit)) {
      throw new RuntimeException("Fruit already exists or null");
    }

    FRUITS.add(fruit);

    return fruit;
  }

  @Override
  public List<Fruit> findAll() {
    return FRUITS.stream().toList();
  }
}
