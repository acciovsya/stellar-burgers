import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  feedOrders: TOrder[];
  total: number;
  totalToday: number;
  isFeedLoading: boolean;
  historyOrders: TOrder[];
  isHistoryLoading: boolean;
  orderDetails: TOrder | null;
};

const initialState: TFeedState = {
  feedOrders: [],
  total: 0,
  totalToday: 0,
  isFeedLoading: false,
  historyOrders: [],
  isHistoryLoading: false,
  orderDetails: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);
export const fetchOrders = createAsyncThunk('feed/fetchOrders', getOrdersApi);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isFeedLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.isFeedLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.isHistoryLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.historyOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.isHistoryLoading = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderDetails = action.payload;
      });
  }
});

export const feedReducer = feedSlice.reducer;
