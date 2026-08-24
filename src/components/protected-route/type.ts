import { ReactElement } from 'react';

export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};
