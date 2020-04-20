import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIANT = 'ADD_INGREDIANT';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIANT;
  payload: Ingredient;
}
