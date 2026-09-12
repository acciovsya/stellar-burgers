import { TConstructorIngredient } from '@utils-types';
import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from './burger-constructor-slice';

const bun: TConstructorIngredient = {
  _id: '1',
  id: 'bun-id',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 100,
  image: 'img',
  image_large: 'img-large',
  image_mobile: 'img-mobile'
};

const main1: TConstructorIngredient = {
  ...bun,
  _id: '2',
  id: 'main-1',
  name: 'Начинка 1',
  type: 'main'
};

const main2: TConstructorIngredient = {
  ...bun,
  _id: '3',
  id: 'main-2',
  name: 'Начинка 2',
  type: 'main'
};

const sauce: TConstructorIngredient = {
  ...bun,
  _id: '4',
  id: 'sauce-1',
  name: 'Соус',
  type: 'sauce'
};

describe('[burgerConstructorSlice] - редьюсер', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const result = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      bun: null,
      ingredients: []
    });
  });

  describe('addIngredient', () => {
    test('кладет булку в bun', () => {
      const action = addIngredient(bun);
      const result = burgerConstructorReducer(undefined, action);

      expect(result.bun).toEqual(action.payload);
      expect(result.ingredients).toEqual([]);
    });

    test('кладет начинку в ingredients', () => {
      const action = addIngredient(main1);
      const result = burgerConstructorReducer(undefined, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toEqual([action.payload]);
    });
  });

  describe('removeIngredient', () => {
    test('удаляет ингредиент по id', () => {
      const state = {
        bun: null,
        ingredients: [main1, main2, sauce]
      };
      const action = removeIngredient('main-1');
      const result = burgerConstructorReducer(state, action);

      expect(result.ingredients).toEqual([main2, sauce]);
    });

    test('не трогает состояние, если id не найден', () => {
      const state = {
        bun: null,
        ingredients: [main1]
      };
      const action = removeIngredient('unknown-id');
      const result = burgerConstructorReducer(state, action);

      expect(result.ingredients).toEqual([main1]);
    });
  });

  describe('clearIngredient', () => {
    test('полностью очищает конструктор', () => {
      const state = {
        bun,
        ingredients: [main1, main2]
      };
      const action = clearConstructor();
      const result = burgerConstructorReducer(state, action);
      expect(result).toEqual({ bun: null, ingredients: [] });
    });
  });

  describe('moveIngredient', () => {
    test('перемещает ингредиент с from на to', () => {
      const state = {
        bun: null,
        ingredients: [main1, main2, sauce]
      };
      const action = moveIngredient({ from: 0, to: 2 });
      const result = burgerConstructorReducer(state, action);

      expect(result.ingredients).toEqual([main2, sauce, main1]);
    });

    test('игнорирует выход за границы (to < 0)', () => {
      const state = {
        bun,
        ingredients: [main1, main2]
      };
      const action = moveIngredient({ from: 0, to: -1 });
      const result = burgerConstructorReducer(state, action);

      expect(result.ingredients).toEqual([main1, main2]);
    });

    test('игнорирует выход за границы (to >= length)', () => {
      const state = {
        bun,
        ingredients: [main1, main2]
      };
      const action = moveIngredient({ from: 0, to: 5 });
      const result = burgerConstructorReducer(state, action);

      expect(result.ingredients).toEqual([main1, main2]);
    });
  });
});
