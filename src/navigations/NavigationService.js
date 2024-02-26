import React from 'react';
import { NavigationActions } from 'react-navigation';

const navigationRef = React.createRef();
let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  try {
    navigationRef.current?.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
  } catch (err) {
    console.warn('Warning - Ref issues:', err.message);
  }
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  navigationRef
};
