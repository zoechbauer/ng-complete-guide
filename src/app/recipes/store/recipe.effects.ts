import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as RecipesActions from '../store/recipe.actions';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      const url = environment.firebaseUrl + 'recipes.json';
      return this.http.get<Recipe[]>(url);
    }),
    map((recipes) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes) => new RecipesActions.SetRecipes(recipes))
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
