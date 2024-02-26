import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import IconBadge from 'react-native-icon-badge';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './styles';
import DynamicAppStyles from '../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';

function ShoppingCartButton (props) {
  const cartItems = useSelector(state => state.cart.cartItems)
  const theme = Appearance.getColorScheme();
  const tint = props.style?.tintColor ?
                props.style.tintColor :
                DynamicAppStyles.navThemeConstants[theme].activeTintColor;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onPress}>
        <IconBadge
          MainElement={
            <FastImage
              source={DynamicAppStyles.iconSet.cart}
              tintColor={tint}
              style={{
                width: 25,
                height: 25,
                margin: 6,
                tintColor: tint
              }}
            />
          }
          BadgeElement={
            <Text style={{ color: '#FFFFFF' }}>
              {cartItems.reduce((prev, next) => prev + next.quantity, 0)}
            </Text>
          }
          Hidden={cartItems.length === 0}
          IconBadgeStyle={{
            width: 20,
            height: 20,
            backgroundColor: '#ff5e69',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

ShoppingCartButton.propTypes = {
  onPress: PropTypes.func,
  cartItems: PropTypes.array,
};

export default ShoppingCartButton;
