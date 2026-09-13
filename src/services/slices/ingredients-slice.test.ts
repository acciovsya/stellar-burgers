import { TIngredient } from '@utils-types';
import {
  fetchIngredients,
  ingredientsReducer,
  initialState
} from './ingredients-slice';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
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
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 10,
    price: 50,
    image: 'img',
    image_large: 'img-large',
    image_mobile: 'img-mobile'
  }
];

describe('[ingredientsSlice] - редьюсер', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    describe('.pending', () => {
      test('ставит isLoading = true и сбрасывает error', () => {
        const action = { type: fetchIngredients.pending.type };
        const result = ingredientsReducer(undefined, action);

        expect(result.isLoading).toBe(true);
        expect(result.error).toBeNull();
        expect(result.items).toEqual([]);
      });
    });

    describe('.fulfilled', () => {
      test('сохраняет ингриденты и снимает isLoading', () => {
        const action = {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        };
        const result = ingredientsReducer(undefined, action);

        expect(result.isLoading).toBe(false);
        expect(result.items).toEqual(mockIngredients);
      });
    });

    describe('.rejected', () => {
      test('сохраняет сообщение об ошибке', () => {
        const action = {
          type: fetchIngredients.rejected.type,
          error: { message: 'Ошибка сети' }
        };
        const result = ingredientsReducer(undefined, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBe('Ошибка сети');
      });

      test('подставляет фоллбек, если текст об ошибке отсутствует', () => {
        const action = {
          type: fetchIngredients.rejected.type,
          error: {}
        };
        const result = ingredientsReducer(undefined, action);

        expect(result.isLoading).toBe(false);
        expect(result.error).toBe('Не удалось загрузить ингредиенты');
      });
    });
  });
});
