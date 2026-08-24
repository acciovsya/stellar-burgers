import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]): Promise<TOrder> => {
    const { order } = await orderBurgerApi(ingredientIds);
    return {
      _id: order._id,
      status: order.status,
      name: order.name,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      number: order.number,
      ingredients: ingredientIds
    };
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
