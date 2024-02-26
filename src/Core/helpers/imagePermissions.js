import {
  Alert,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const imagePermissions = {
  options: {
    title: 'Select photo',
    cancelButtonTitle: 'Cancel',
    takePhotoButtonTitle: 'Take Photo',
    chooseFromLibraryButtonTitle: 'Choose from Library',
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    exif: false,
    storageOptions: {
      skipBackup: true,
      path: 'images',
    }
  },
  getPermissionAsync: async () => {
    try {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Photo permissions:', result);
      let spiel = 'Sorry, we need media permissions to make this work!';
      if (!result.canAskAgain) {
        spiel = spiel + ' Go to Settings to add or remove Storage access.';
      }
      if (result.status === 'denied') {
        Alert.alert(
          '',
          spiel,
          [{
            text: 'Cancel',
          }, {
            text: 'Settings',
            onPress: () => {
              Linking.openSettings();
            }
          }],
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
  }
}

export default imagePermissions;
