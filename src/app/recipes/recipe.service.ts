import { Injectable, Output, EventEmitter } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Schnitzel',
      'one of my favorite meals',
      'https://cdn.pixabay.com/photo/2014/05/28/12/20/wiener-schnitzel-356436_960_720.jpg',
      [new Ingredient('meat', 1), new Ingredient('French fries', 20)]
    ),
    new Recipe(
      'shrimp recipe',
      'this is a tasty shrimp salad recipe',
      'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
      [new Ingredient('shrimps', 5), new Ingredient('salade', 10)]
    )
  ];
  recipeSelected = new EventEmitter<Recipe>();

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }
}
