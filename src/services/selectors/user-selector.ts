import { RootState } from '@store';

export const selectUser = (state: RootState) => state.user.user;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
