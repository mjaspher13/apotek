import IMCartActionsConstants from './types';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  prescriptions: [],
  cartItems: [],
  vendor: null,
};

export const cart = (state = initialState, action) => {
  switch (action.type) {
    case IMCartActionsConstants.ADD_TO_CART: {
      const cartItems = [...state.cartItems, action.data];
      storeCartToDisk(
        cartItems,
        state.vendor,
        state.prescriptions,
        action.user,
      );
      // Return new redux state
      return {...state, cartItems};
    }

    case IMCartActionsConstants.OVERRIDE_PRESCRIPTIONS: {
      storeCartToDisk(state.cartItems, state.vendor, action.data, action.user);
      return {
        ...state,
        prescriptions: action.data,
      };
    }

    case IMCartActionsConstants.ADD_PRESCRIPTION: {
      const newState = {...state};
      if (!state.prescriptions) {
        s;
        newState.prescriptions = [action.data];
      } else {
        newState.prescriptions = state.prescriptions.concat(action.data);
      }
      storeCartToDisk(
        state.cartItems,
        state.vendor,
        newState.prescriptions,
        action.user,
      );
      return newState;
    }

    case IMCartActionsConstants.REMOVE_PRESCRIPTION: {
      const removable = action.data;
      const prescriptions = state.prescriptions.filter(p => p != removable);
      storeCartToDisk(
        state.cartItems,
        state.vendor,
        prescriptions,
        action.user,
      );
      return {
        ...state,
        prescriptions,
      };
    }

    case IMCartActionsConstants.SET_CART_VENDOR: {
      storeCartToDisk(
        state.cartItems,
        action.data,
        state.prescriptions,
        action.user,
      );
      return {...state, vendor: action.data};
    }

    case IMCartActionsConstants.REMOVE_FROM_CART: {
      const itemToBeRemoved = action.data;
      const cartItems = state.cartItems.filter(
        cartItem => itemToBeRemoved.id != cartItem.id,
      );
      storeCartToDisk(
        cartItems,
        state.vendor,
        state.prescriptions,
        action.user,
      );
      return {...state, cartItems};
    }

    case IMCartActionsConstants.OVERRIDE_CART:
      const cartItems = [...action.data];
      storeCartToDisk(
        cartItems,
        state.vendor,
        state.prescriptions,
        action.user,
      );
      return {...state, cartItems};

    case IMCartActionsConstants.UPDATE_CART:
      const tempCartItems = state.cartItems;
      tempCartItems[action.id] = action.cartItem;
      storeCartToDisk(
        tempCartItems,
        state.vendor,
        state.prescriptions,
        action.user,
      );
      return {...state, tempCartItems};
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};

export const storeCartToDisk = async (
  cartItems,
  vendor,
  prescriptions = [],
  userId = '',
) => {
  // Stringify circular list to persist on disk
  var seen = [];
  const cart = {cartItems, vendor, prescriptions};
  const serializedCart = JSON.stringify(cart, function (key, val) {
    if (val != null && typeof val === 'object') {
      if (seen.indexOf(val) >= 0) {
        return;
      }
      seen.push(val);
    }
    return val;
  });
  // Store on disk
  AsyncStorage.setItem('@MySuperCart:key', serializedCart);
  // Plan: Attach userID to each cart object
  // TODO: Make sure all callers of this method provide the userID
  // AsyncStorage.setItem("@MySuperCart:key" + userId, serializedCart);
};

const removeFromCart = (item, state) => {
  const cartArray = [...state];

  const foundIndex = cartArray.findIndex(currCartItem => {
    return currCartItem.id === item.id;
  });

  if (foundIndex >= 0) {
    cartArray.splice(foundIndex, 1);
  }
  AsyncStorage.setItem('@MySuperCart:key', JSON.stringify(cartArray));

  return cartArray;
};
