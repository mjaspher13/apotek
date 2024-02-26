import {combineReducers} from 'redux';
import {createNavigationReducer} from 'react-navigation-redux-helpers';
import {RootNavigator} from '../navigations/AppNavigation';
import {auth} from '../Core/onboarding/redux/auth';
import {chat} from '../Core/chat/redux';
import {orders} from '../Core/delivery/redux';
import {cart} from '../Core/cart/redux/reducers';
import {checkout} from '../Core/payment/redux/checkout';
import {vendor} from '../Core/vendor/redux';
// import { notification } from './notification';
import { settings } from './settings';

const navReducer = createNavigationReducer(RootNavigator);

const AppReducer = combineReducers({
  nav: navReducer,
  auth,
  chat,
  cart,
  orders,
  checkout,
  vendor,
  // notification,
  settings,
});

export default AppReducer;
