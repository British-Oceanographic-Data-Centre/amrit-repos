package fr.ifremer.example.fruits.controllers;

import fr.ifremer.example.fruits.models.Fruit;
import fr.ifremer.example.fruits.services.FruitService;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("fruits")
public class FruitController {

  private final FruitService fruitService;

  public FruitController(FruitService fruitService) {
    this.fruitService = fruitService;
  }

  @GetMapping
  public List<Fruit> getFruits() {
    return this.fruitService.all();
  }

  @GetMapping("{id}")
  public ResponseEntity<Fruit> getFruitById(@PathVariable Integer id) {
    var fruit = this.fruitService.byId(id);

    return fruit.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Fruit> saveFruit(@RequestBody Fruit fruit) {

    var id = this.fruitService.save(fruit);

    return ResponseEntity.created(URI.create("http://localhost:8080/fruits/" + id)).build();
  }
}
