import React from 'react';
import {ScrollView, View, Text, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './styles';
import MenuButton from '../../components/MenuButton/MenuButton';
import authManager from '../../Core/onboarding/utils/authManager';
import DynamicAppStyles from '../../DynamicAppStyles';
import AppConfig from '../../VendorAppConfig';
import {logout} from '../../Core/onboarding/redux/auth';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

class DrawerContainer extends React.Component {
  render() {
    const {navigation, user} = this.props;

    if (user.isAdmin) {
      return (
        <ScrollView style={styles.content}>
          <Text style={styles.header}>{user.firstName ? "Hello, " + user.firstName : "Welcome"}!</Text>
          <View style={styles.container}>
            <MenuButton
              title={IMLocalized('HOME')}
              source={require('../../../assets/icons/shop.png')}
              onPress={() => {
                navigation.navigate('Restaurants');
              }}
            />
            <MenuButton
              title={IMLocalized('ORDERS')}
              source={require('../../../assets/icons/delivery.png')}
              onPress={() => {
                navigation.navigate('AdminOrder');
              }}
            />
            <MenuButton
              title={IMLocalized('DELIVERY')}
              source={require('../../../assets/icons/delivery.png')}
              onPress={() => {
                navigation.navigate('Map');
              }}
            />
            <MenuButton
              title={IMLocalized('LOG OUT')}
              source={require('../../../assets/icons/shutdown.png')}
              onPress={() => {
                // Reset stored cart completely on logout.
                AsyncStorage.setItem("@MySuperCart:key", '{"prescriptions": [], "vendor": null, "cartItems": [] }');

                authManager.logout(this.props.user);
                this.props.logout();
                this.props.navigation.navigate('LoadScreen', {
                  appStyles: DynamicAppStyles,
                  appConfig: AppConfig,
                });
              }}
            />
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView contentContainerStyle={{
          ...styles.content,
          marginTop: Platform.OS === 'ios' ? 24 : 0
        }}>
        <Text style={styles.header}>{user.firstName ? "Hello, " + user.firstName : "Welcome"}!</Text>
        <View style={styles.container}>
          <MenuButton
            title={IMLocalized('HOME')}
            source={require('../../../assets/icons/Home.png')}
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
          <MenuButton
            title={IMLocalized('CUISINES')}
            source={require('../../../assets/icons/Medicine.png')}
            onPress={() => {
              navigation.navigate('CategoryList');
            }}
          />
          <MenuButton
            comingSoon={true}
            title={IMLocalized('VACCINES')}
            source={require('../../../assets/icons/Vaccine.png')}
            onPress={() => {
              navigation.navigate('VaccinationsScreen');
            }}
          />
          <MenuButton
            comingSoon={true}
            title={IMLocalized('TESTING')}
            source={require('../../../assets/icons/Testing.png')}
            onPress={() => {
              navigation.navigate('TestingScreen');
            }}
          />
          <MenuButton
            title={IMLocalized('SEARCH')}
            source={require('../../../assets/icons/Search.png')}
            onPress={() => {
              navigation.navigate('Search', {});
            }}
          />
          <MenuButton
            title={IMLocalized('CART')}
            source={require('../../../assets/icons/Cart.png')}
            onPress={() => {
              navigation.navigate('Cart', {
                appStyles: DynamicAppStyles,
                appConfig: AppConfig,
              });
            }}
          />
          {/* !AppConfig.isMultiVendorEnabled && (
            <MenuButton
              title={IMLocalized('RESERVATIONS')}
              source={require('../../../assets/icons/reserve.png')}
              onPress={() => {
                navigation.navigate('ReservationScreen', {
                  appStyles: DynamicAppStyles,
                  appConfig: AppConfig,
                });
              }}
            />
          ) */}
          <MenuButton
            title={IMLocalized('FAQ')}
            source={require('../../../assets/icons/question-circle.png')}
            onPress={() => {
              navigation.navigate('FAQ');
            }}
          />
          <MenuButton
            title={IMLocalized('PROFILE')}
            source={require('../../../assets/icons/profile.png')}
            onPress={() => {
              navigation.navigate('MyProfile');
            }}
          />
          <MenuButton
            title={IMLocalized('ORDERS')}
            source={require('../../../assets/icons/OrderHistory.png')}
            onPress={() => {
              navigation.navigate('OrderList', {
                appStyles: DynamicAppStyles,
                appConfig: AppConfig,
              });
            }}
          />
          <MenuButton
            title={IMLocalized('LOG OUT')}
            source={require('../../../assets/icons/Log-out.png')}
            onPress={() => {
              // Reset stored cart completely on logout.
              AsyncStorage.setItem("@MySuperCart:key", '{"prescriptions": [], "vendor": null, "cartItems": [] }');

              authManager.logout(this.props.user);
              this.props.logout();
              this.props.navigation.navigate('LoadScreen', {
                appStyles: DynamicAppStyles,
                appConfig: AppConfig,
              });
            }}
          />
        </View>
      </ScrollView>
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
