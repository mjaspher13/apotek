import React, { Component } from 'react';
import { BackHandler, Linking, View } from 'react-native';
import VendorAppConfig from '../../../../VendorAppConfig';
import { IMLocalized } from '../../../localization/IMLocalization';
import IMFormComponent from '../IMFormComponent/IMFormComponent';

class IMContactUsScreen extends Component {
  static navigationOptions = ({ screenProps, navigation }) => {
    let appStyles = navigation.state.params.appStyles;
    let screenTitle =
      navigation.state.params.screenTitle || IMLocalized('Contact Us');
    let currentTheme = appStyles.navThemeConstants[screenProps.theme];
    return {
      headerTitle: screenTitle,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerRight: () => <View />,
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);

    this.appStyles = props.navigation.getParam('appStyles') || props.appStyles;
    this.form = props.navigation.getParam('form') || props.form;
    this.phone = props.navigation.getParam('phone') || props.phone;
    this.initialValuesDict = {};

    this.state = {
      alteredFormDict: {},
    };

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onFormButtonPress = (_buttonField) => {
    Linking.canOpenURL(`tel:${this.phone.replace(/ /g, ' ')}`).then(canDoIt => {
      if (canDoIt) {
        Linking.openURL(`tel:${this.phone.replace(/ /g, '')}`).catch(err => {
          console.warn('Still failed to open tel', err.message);
        });
      } else {
        console.warn('Unable to open Dialer');
      }
    });
  };

  render() {
    console.log('IMContactUsScreen: render', this.form, this.initialValuesDict)
    return (
      // <View>Contact Us</View>
      <IMFormComponent
        form={this.form}
        initialValuesDict={this.initialValuesDict}
        navigation={this.props.navigation}
        appStyles={this.appStyles}
        onFormButtonPress={this.onFormButtonPress}
      />
    );
  }
}

IMContactUsScreen.defaultProps = {
  phone: VendorAppConfig.contactUsPhoneNumber,
};

export default IMContactUsScreen;
