import * as ShoppingListActions from './shopping-list.actions';
import { Ingredient } from 'src/app/shared/ingredient.model';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 4), new Ingredient('Tomatoes', 5)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function ShoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      const updatedIngredients: Ingredient[] = state.ingredients.filter(
        (ig, igIndex) => {
          return igIndex !== action.payload;
        }
      );
      return {
        ...state,
        ingredients: updatedIngredients,
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updIngredient = {
        ...ingredient,
        ...action.payload.ingredient,
      };
      const updIngredients = [...state.ingredients];
      updIngredients[action.payload.index] = updIngredient;
      return {
        ...state,
        ingredients: updIngredients,
      };
    default:
      return state;
  }
}
