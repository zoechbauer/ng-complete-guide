import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Schnitzel',
  //     'one of my favorite meals',
  //     'https://cdn.pixabay.com/photo/2014/05/28/12/20/wiener-schnitzel-356436_960_720.jpg',
  //     [new Ingredient('meat', 1), new Ingredient('French fries', 20)]
  //   ),
  //   new Recipe(
  //     'shrimp recipe',
  //     'this is a tasty shrimp salad recipe',
  //     'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
  //     [new Ingredient('shrimps', 5), new Ingredient('salade', 10)]
  //   )
  // ];
  private recipes: Recipe[] = [];

  recipeChanged = new Subject<Recipe[]>();

  constructor(private store: Store<fromShoppingList.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
