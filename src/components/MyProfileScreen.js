import React, {Component} from 'react';
import {BackHandler, View} from 'react-native';
import {connect} from 'react-redux';
import {AppIcon} from '../AppStyles';
import authManager from '../Core/onboarding/utils/authManager';
import DynamicAppStyles from '../DynamicAppStyles';
import VendorAppConfig from '../SingleVendorAppConfig';
import {IMUserProfileComponent} from '../Core/profile';
import {logout, setUserData} from '../Core/onboarding/redux/auth';
import {IMLocalized} from '../Core/localization/IMLocalization';
import AsyncStorage from '@react-native-community/async-storage';

class MyProfileScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      title: IMLocalized('My Profile'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: {color: currentTheme.fontColor},
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerRight: () => <View />,
    };
  };

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  constructor(props) {
    super(props);

    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.willBlurSubscription = props.navigation.addListener(
      'willBlur',
      payload =>
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

  onLogout() {
    authManager.logout(this.props.user);

    // Also clear the user cart, if anything was stored
    AsyncStorage.setItem(
      '@MySuperCart:key',
      '{"prescriptions": [], "vendor": null, "cartItems": [] }',
    );

    this.props.logout();
    this.props.navigation.navigate('LoadScreen', {
      appStyles: DynamicAppStyles,
      appConfig: VendorAppConfig,
    });
  }

  onUpdateUser = newUser => {
    this.props.setUserData({user: newUser});
  };

  render() {
    var menuItems = [
      {
        title: IMLocalized('Account Details'),
        icon: AppIcon.images.accountDetail,
        tintColor: '#6b7be8',
        onPress: () =>
          this.props.navigation.navigate('AccountDetail', {
            appStyles: DynamicAppStyles,
            form: VendorAppConfig.editProfileFields,
            screenTitle: IMLocalized('Edit Profile'),
          }),
      },
      {
        title: IMLocalized('Order History'),
        icon: AppIcon.images.delivery,
        tintColor: '#272700',
        onPress: () =>
          this.props.navigation.navigate('OrderList', {
            appStyles: DynamicAppStyles,
            appConfig: VendorAppConfig,
          }),
      },
      {
        title: IMLocalized('Settings'),
        icon: AppIcon.images.settings,
        tintColor: '#a6a4b1',
        onPress: () =>
          this.props.navigation.navigate('Settings', {
            appStyles: DynamicAppStyles,
            form: VendorAppConfig.userSettingsFields,
            screenTitle: IMLocalized('Settings'),
          }),
      },
      {
        title: IMLocalized('Contact Us'),
        icon: AppIcon.images.contactUs,
        tintColor: '#9ee19f',
        onPress: () =>
          this.props.navigation.navigate('Contact', {
            appStyles: DynamicAppStyles,
            form: VendorAppConfig.contactUsFields,
            screenTitle: IMLocalized('Contact us'),
          }),
      },
    ];

    if (this.props.isAdmin) {
      menuItems.push({
        title: IMLocalized('Admin Dashboard'),
        tintColor: '#8aced8',
        icon: AppIcon.images.checklist,
        onPress: () => this.props.navigation.navigate('AdminDashboard'),
      });
    }

    return (
      <IMUserProfileComponent
        user={this.props.user}
        onUpdateUser={user => this.onUpdateUser(user)}
        onLogout={() => this.onLogout()}
        menuItems={menuItems}
        appStyles={DynamicAppStyles}
      />
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
    isAdmin: auth.user && auth.user.isAdmin,
  };
};

export default connect(mapStateToProps, {
  logout,
  setUserData,
})(MyProfileScreen);
