import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {TNCard} from '../../../Core/truly-native';
import dynamicStyles from './styles';
import {IMLocalized} from '../../../Core/localization/IMLocalization';
import {DriverAPIManager} from '../../api/driver';
import {ORDER_STATUSES} from '../../../Configuration';

import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

const apiManager = new DriverAPIManager();

const getPermissionAsync = async () => {
  try {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.status === 'denied') {
      Alert.alert(
        '',
        IMLocalized('Sorry, we need media permissions to make this work!'),
        [{text: IMLocalized('OK')}],
        {
          cancelable: false,
        },
      );
      return false;
    }
    return true;
  } catch (err) {
    console.warn('ERROR: Permissions', err.message);
    return false;
  }
};

const OrderPreviewCard = ({order, driver, appStyles, onMessagePress}) => {
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const styles = dynamicStyles(appStyles);
  const buttonTitle =
    order.status === ORDER_STATUSES.Shipped
      ? IMLocalized('Complete Pick Up')
      : IMLocalized('Complete Delivery');
  const headlineText =
    order.status === ORDER_STATUSES.Shipped
      ? IMLocalized('Pick up - ') + order.vendor?.title
      : IMLocalized('Deliver to ') + order.author?.firstName;
  const address =
    order.status === ORDER_STATUSES.Shipped
      ? ''
      : order.address?.line1 + ' ' + order.address?.line2;

  const onPress = () => {
    if (order.status === ORDER_STATUSES.Shipped) {
      // Order has been picked up, so we update the status
      apiManager.markAsPickedUp(order);
    } else {
      setUploading(true);
    }
  };

  let shouldShowPhotoUpload = uploading;
  const onUpload = async () => {
    // From TNProfilePictureSelector
    const options = {
      title: IMLocalized('Select photo'),
      cancelButtonTitle: IMLocalized('Cancel'),
      takePhotoButtonTitle: IMLocalized('Take Photo'),
      chooseFromLibraryButtonTitle: IMLocalized('Choose from Library'),
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      exif: false,
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    const allowed = await getPermissionAsync();
    if (!allowed) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      this.setState({
        uploading: true,
      });
      firebaseStorage
        .uploadImage(result.uri)
        .then(response => {
          setPhotoURL(response.downloadURL);
          onComplete();
        })
        .catch(err => {
          console.error('UPLOAD ERROR', err);
          Alert.alert(
            '',
            IMLocalized(
              'Sorry, something went wrong while uploading your prescription. Please try again later.',
            ),
            [{text: IMLocalized('OK')}],
            {
              cancelable: false,
            },
          );
        });
    } else {
      console.warn('Image Picker: Cancelled?', result);
    }
  };
  const onComplete = url => {
    // Order has been delivered, so we update the status of both driver and order
    order.proof = url;
    apiManager.markAsCompleted(order, driver);
  };

  return (
    <TNCard appStyles={appStyles} containerStyle={styles.container}>
      <>
        {photoURL && <FastImage source={{uriL: photoURL}} />}
        {uploading && (
          <TouchableOpacity style={styles.buttonsContainer} onPress={onUpload}>
            Attach Proof
          </TouchableOpacity>
        )}
        <View style={styles.contentView}>
          <View style={styles.textContainer}>
            <Text style={styles.headline}>{headlineText}</Text>
            <Text style={styles.description}>
              {IMLocalized('Order #')}
              {order.id}
            </Text>
            <Text style={styles.description}>{address}</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              disabled={uploading}
              style={styles.actionButtonContainer}
              onPress={onPress}>
              <Text style={styles.actionButtonText}>{buttonTitle}</Text>
            </TouchableOpacity>
            {order.status === ORDER_STATUSES.InTransit && (
              <TouchableOpacity
                style={styles.secondaryButtonContainer}
                onPress={onMessagePress}>
                <Text style={styles.secondaryButtonText}>
                  {IMLocalized('Message')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </>
    </TNCard>
  );
};

export default OrderPreviewCard;
