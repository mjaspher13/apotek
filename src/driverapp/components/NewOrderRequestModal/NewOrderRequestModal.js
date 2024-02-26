import React from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import dynamicStyles from './styles';
import { IMLocalized } from '../../../Core/localization/IMLocalization';

export default function NewOrderRequestModal({
  onAccept,
  onReject,
  appStyles,
  isVisible,
  onModalHide,
  from, to
}) {
  const styles = dynamicStyles(appStyles);
  return (
    <Modal
      style={styles.modalContainer}
      swipeDirection="down"
      isVisible={isVisible}
      onModalHide={onModalHide}>
      <View style={styles.container}>
        <Text style={styles.title}>{IMLocalized("Accept New Delivery?")}</Text>
        <Text>Pickup at {from}</Text>
        <Text>Deliver to {to}</Text>
        <View style={styles.actionContainer}>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={onAccept}>
            {IMLocalized("Accept")}
          </Button>
        </View>
        <Button style={styles.cancel} onPress={onReject}>
          {IMLocalized("Reject")}
        </Button>
      </View>
    </Modal>
  );
}
