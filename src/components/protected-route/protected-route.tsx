import { FC } from 'react';
import { ProtectedRouteProps } from './type';
import { useSelector } from '@store';
import { selectIsAuthChecked, selectUser } from '@selectors';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type TLocationState = { from?: { pathname: string } };

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as TLocationState | null)?.from?.pathname;
    return <Navigate to={from ?? '/'} replace />;
  }

  return children;
};
