import { RootState } from '../store';

export const selectBurgerConstructor = (state: RootState) =>
  state.burgerConstructor;

export const selectBurgerBun = (state: RootState) =>
  state.burgerConstructor.bun;

export const selectBurgerIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
