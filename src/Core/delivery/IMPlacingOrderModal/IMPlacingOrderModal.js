import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {Text, View} from 'react-native';
import { ScrollView } from 'react-native';
import * as Image from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Tick from '../../../CoreAssets/tick.png';
import * as Progress from 'react-native-progress';
import {IMLocalized} from '../../localization/IMLocalization';
import preStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

export function IMPlacingOrderModal(props) {
  const theme = useColorScheme();
  const styles = preStyles(theme);

  const {
    isVisible,
    onCancel,
    cartItems,
    user,
    shippingAddress
  } = props;

  function undo() {
    onCancel();
  }

  function renderCartItems(item) {
    return (
      <View style={styles.orderPane} key={item.id}>
        <Text style={[styles.productItem, styles.number]}>{item.quantity}</Text>
        <Text style={[styles.productItem]}>{item.name}</Text>
      </View>
    );
  }

  return (
    <Modal
      onModalHide={() => clearTimeout(countDown())}
      isVisible={isVisible}
      propagateSwipe={true}
      style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>{IMLocalized('Placing Order...')}</Text>
        <View style={styles.progress}>
          <Progress.Circle
            animated
            color="blue"
            indeterminate
            indeterminateAnimationDuration={6000}
            size={24}
            borderWidth={3}
          />
        </View>
        <View style={styles.addressPane}>
          <Image style={styles.tick} source={Tick} />
          <View>
          <Text style={styles.text}>{`${shippingAddress.line1 || ''} ${shippingAddress.line2 || ''} ${shippingAddress.postalCode || ''} ${shippingAddress.city || ''}`} </Text>
          <Text style={styles.description}>Deliver to door</Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.addressPane}>
          <Image style={styles.tick} source={Tick} />
          <View>
            <Text style={styles.text}>
              {IMLocalized('Your order, ') + user.firstName}
            </Text>
          </View>
        </View>
        <ScrollView>
          {cartItems.map((item) => renderCartItems(item))}
        </ScrollView>
        <Text style={styles.undo} onPress={() => undo()}>
          {IMLocalized('Cancel')}
        </Text>
      </View>
    </Modal>
  );
}

IMPlacingOrderModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onFinish: PropTypes.func,
  cartItems: PropTypes.array,
  user: PropTypes.object,
};
