import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from './styles';
import MenuButton from '../../../components/MenuButton/MenuButton';
import authManager from '../../../Core/onboarding/utils/authManager';
import DynamicAppStyles from '../../../DynamicAppStyles';
import AppConfig from '../../../VendorAppConfig';
import {logout} from '../../../Core/onboarding/redux/auth';
import {IMLocalized} from '../../../Core/localization/IMLocalization';

class DrawerContainer extends React.Component {
  render() {
    const {navigation, user} = this.props;

    return (
    <View style={styles.content}>
        <View style={styles.container}>
        <MenuButton
            title={IMLocalized('HOME')}
            source={require('../../../../assets/icons/shop.png')}
            onPress={() => {
            navigation.navigate('Home');
            }}
        />
        <MenuButton
            title={IMLocalized('LOG OUT')}
            source={require('../../../../assets/icons/shutdown.png')}
            onPress={() => {
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
