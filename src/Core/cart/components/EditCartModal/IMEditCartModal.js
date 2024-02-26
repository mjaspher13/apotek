import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../localization/IMLocalization';
export default function EditCartModal({
  id,
  close,
  item,
  updateCart,
  viewPrescription,
  deleteCart,
  appStyles,
  isVisible,
  onModalHide,
  user,
}) {
  const [quantity, setQuantity] = useState(0);
  const styles = dynamicStyles(appStyles);
  return (
    <Modal
      style={styles.modalContainer}
      swipeDirection="down"
      isVisible={isVisible}
      onBackButtonPress={close}
      onBackdropPress={close}
      onModalShow={() => setQuantity(item.quantity)}
      onModalHide={onModalHide}
      onSwipeComplete={close}>
      <View style={styles.container}>
        <Text style={styles.price}>{item.name}</Text>
        <View style={styles.buttonSet}>
          <Button
            containerStyle={styles.buttonContainer}
            style={styles.buttonText}
            onPress={() => {
              if (quantity > item.minimumOrderQuantity) {
                setQuantity(quantity - 1);
              }
            }}>
            -
          </Button>
          <Text style={styles.count}>{quantity}</Text>
          <Button
            containerStyle={styles.buttonContainer}
            style={styles.buttonText}
            onPress={() => {
              if (quantity < item.stock) {
                setQuantity(quantity + 1)
              }
            }}>
            +
          </Button>
        </View>
        <View style={{
          ...styles.actionContainer,
          marginTop: 4,
        }}>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => {
              item.quantity = quantity;
              updateCart(item, id, user);
              close();
            }}>
            {IMLocalized("Update Cart")}
          </Button>
        </View>
        <Button style={styles.deleteItem} onPress={deleteCart}>
          {IMLocalized("Remove from Cart")}
        </Button>
      </View>
    </Modal>
  );
}
