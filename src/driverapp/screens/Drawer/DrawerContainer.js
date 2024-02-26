import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './styles';
import MenuButton from '../../../components/MenuButton/MenuButton';
import authManager from '../../../Core/onboarding/utils/authManager';
import DynamicAppStyles from '../../../DynamicAppStyles';
import AppConfig from '../../../SingleVendorAppConfig';
import {logout} from '../../../Core/onboarding/redux/auth';
import {IMLocalized} from '../../../Core/localization/IMLocalization';
import AsyncStorage from '@react-native-community/async-storage';

class DrawerContainer extends React.Component {
  render() {
    const {navigation, user} = this.props;

    return (
    <View style={styles.content}>
        <Text style={styles.header}>Hello, {user.firstName}!</Text>
        <View style={styles.container}>
        <MenuButton
            title={IMLocalized('HOME')}
            source={require('../../../../assets/icons/Home.png')}
            onPress={() => {
              navigation.navigate('Home');
            }}
        />
        <MenuButton
            title={IMLocalized('ORDERS')}
            source={require('../../../../assets/icons/OrderHistory.png')}
            onPress={() => {
              navigation.navigate('OrderList');
            }}
        />
        <MenuButton
            title={IMLocalized('PROFILE and SETTINGS')}
            source={require('../../../../assets/icons/profile.png')}
            onPress={() => {
              navigation.navigate('MyProfile');
            }}
        />
        <MenuButton
            title={IMLocalized('LOG OUT')}
            source={require('../../../../assets/icons/Log-out.png')}
            onPress={() => {
              // Reset stored cart completely on logout.
              AsyncStorage.setItem("@MySuperCart:key", '{"prescriptions": [], "vendor": null, "cartItems": [] }');

            authManager.logout(user);
            this.props.logout();
            this.props.navigation.navigate('LoadScreen', {
                appStyles: DynamicAppStyles,
                appConfig: AppConfig,
              });
            }}
        />
        </View>
    </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {logout})(DrawerContainer);
