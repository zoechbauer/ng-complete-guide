import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { environment } from 'src/environments/environment';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const url = environment.firebaseUrl + 'recipes.json';
    const recipes = this.recipeService.getRecipes();
    this.http.put(url, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    const url = environment.firebaseUrl + 'recipes.json';
    this.http
      .get<Recipe[]>(url)
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        })
      )
      .subscribe(recipes => {
        this.recipeService.setRecipes(recipes);
        console.log(recipes);
      });
  }
}
