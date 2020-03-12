import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'my test recipe',
      'this is the description of the recipe',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'
    ),
    new Recipe(
      'shrimp recipe',
      'this is a tasty shrimp salad recipe',
      'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg'
    )
  ];

  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }
}
