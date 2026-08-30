import { FC } from 'react';

import { useSelector } from '@store';
import { selectIngredientsLoading } from '@selectors';

import { ConstructorPageUI } from '@ui-pages';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
