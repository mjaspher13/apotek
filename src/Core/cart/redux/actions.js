import IMCartActionsConstants from './types';

export const addToCart = (data, user) => ({
  type: IMCartActionsConstants.ADD_TO_CART,
  data,
  user: user.id,
});

export const removeFromCart = (data, user) => ({
  type: IMCartActionsConstants.REMOVE_FROM_CART,
  data,
  user: user.id,
});

export const overrideCart = (data, user) => {
  return {
    type: IMCartActionsConstants.OVERRIDE_CART,
    data,
    user: user.id,
  };
};

export const overrideRx = (data, user) => {
  return {
    type: IMCartActionsConstants.OVERRIDE_PRESCRIPTIONS,
    data,
    user: user.id,
  };
};

export const addPrescription = (data, user) => {
  return {
    type: IMCartActionsConstants.ADD_PRESCRIPTION,
    data,
    user: user.id,
  };
};
export const updateCart = (cartItem, id, user) => {
  return {
    type: IMCartActionsConstants.UPDATE_CART,
    cartItem,
    id,
    user: user.id,
  };
};

export const setCartVendor = (data, user) => ({
  type: IMCartActionsConstants.SET_CART_VENDOR,
  data,
  user: user.id,
});
