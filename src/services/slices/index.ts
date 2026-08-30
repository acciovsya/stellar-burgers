export {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
  burgerConstructorReducer
} from './burger-constructor-slice';
export { ingredientsReducer, fetchIngredients } from './ingredients-slice';
export {
  checkUserAuth,
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  userReducer
} from './user-slice';
export { createOrder, closeOrderModal, orderReducer } from './order-slice';
export {
  fetchFeed,
  fetchOrders,
  fetchOrderByNumber,
  feedReducer
} from './feed-slice';
