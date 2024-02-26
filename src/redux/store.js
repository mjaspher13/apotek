import AppReducer from './index';
import { createStore, applyMiddleware } from 'redux';
import { instance as analytics } from '../Core/firebase/analytics';
import { NavigationActions } from 'react-navigation';
import thunk from "redux-thunk";
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

// gets the current screen from navigation state
function getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return getCurrentRouteName(route);
    }
    return route.routeName;
  }

const middlewares = createReactNavigationReduxMiddleware(state => state.nav);
const analyticsware = ({ getState }) => next => (action) => {
    if (
        action.type !== NavigationActions.NAVIGATE
        && action.type !== NavigationActions.BACK
    ) {
        return next(action);
    }

    const currentScreen = getCurrentRouteName(getState().nav);
    const result = next(action);
    const nextScreen = getCurrentRouteName(getState().nav);
    if (nextScreen !== currentScreen) {
      // the line below uses the Google Analytics tracker
      // change the tracker here to use other Mobile analytics SDK.

      console.log('[Analytics] Navigate -', nextScreen);
      return analytics.logScreenView({
        screen_name: nextScreen,
        screen_class: nextScreen,
      }).catch(err => {
          console.warn('Help!', err.message);
      });
    }
    return result;
  };
const reduxStore = createStore(AppReducer, applyMiddleware(thunk,
    middlewares,
    analyticsware,
));

export default reduxStore;