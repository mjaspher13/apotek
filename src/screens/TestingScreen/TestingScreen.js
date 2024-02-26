import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';

import {IMLocalized} from '../../Core/localization/IMLocalization';
import ComingSoonScreen from '../../components/ComingSoon/ComingSoon';

import DynamicAppStyles from '../../DynamicAppStyles';
import styles from './styles';

function TestingScreen(props) {
  function handler() {
    props.navigation.goBack();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);

  return <ComingSoonScreen screenProps={props.screenProps} />;
}

TestingScreen.navigationOptions = ({navigation, screenProps}) => {
  let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
  return {
    headerTitle: IMLocalized('Testing'),
    headerTintColor: currentTheme.activeTintColor,
    headerTitleStyle: {color: currentTheme.fontColor},
    headerStyle: {
      backgroundColor: currentTheme.backgroundColor,
    },
  };
};
export default TestingScreen;
