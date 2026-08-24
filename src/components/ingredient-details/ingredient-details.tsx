import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients, selectIngredientsLoading } from '@selectors';
import { useSelector } from '@store';

import { IngredientDetailsUI, Preloader } from '@ui';
import { NotFound404 } from '@pages';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return <NotFound404 />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
