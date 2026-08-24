import { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feed.feedOrders;

export const selectFeedTotal = (state: RootState) => state.feed.total;

export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;

export const selectOrdersHistory = (state: RootState) =>
  state.feed.historyOrders;

export const selectOrderDetails = (state: RootState) => state.feed.orderDetails;
