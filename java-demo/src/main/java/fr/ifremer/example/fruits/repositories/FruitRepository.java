package fr.ifremer.example.fruits.repositories;

import fr.ifremer.example.fruits.models.Fruit;
import org.springframework.data.repository.ListCrudRepository;

public interface FruitRepository extends ListCrudRepository<Fruit, Integer>, IFruitRepository {}
