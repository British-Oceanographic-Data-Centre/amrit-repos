package fr.ifremer.example.fruits.repositories;

import fr.ifremer.example.fruits.models.Fruit;
import java.util.List;
import java.util.Optional;

public interface IFruitRepository {

  Optional<Fruit> findById(Integer id);

  Fruit save(Fruit fruit);

  List<Fruit> findAll();
}
