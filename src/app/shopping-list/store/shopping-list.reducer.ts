import { Action } from '@ngrx/store';
import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 5)],
};

export function ShoppingListReducer(
  state = initialState,
  action: ShoppingListActions.AddIngredient
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIANT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
  }
}
