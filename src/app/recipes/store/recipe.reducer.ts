import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function RecipeReducer(
  state = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    default:
      return state;
  }
}
