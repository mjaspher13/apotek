import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableHighlight,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImageView from 'react-native-image-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import dynamicStyles from './styles';
import {useColorScheme} from 'react-native-appearance';
import {IMLocalized} from '../../localization/IMLocalization';

import FastImage from 'react-native-fast-image';
import {createKeyboardAwareNavigator} from 'react-navigation';
import imagePermissions from '../../helpers/imagePermissions';

const Image = FastImage;

const TNProfilePictureSelector = props => {
  const [profilePictureURL, setProfilePictureURL] = useState(
    props.profilePictureURL || '',
  );
  const originalProfilePictureURL = useRef(props.profilePictureURL || '');
  if (originalProfilePictureURL.current !== (props.profilePictureURL || '')) {
    originalProfilePictureURL.current = props.profilePictureURL || '';
    setProfilePictureURL(props.profilePictureURL || '');
  }

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [tappedImage, setTappedImage] = useState([]);
  const actionSheet = useRef(null);
  const {appStyles} = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const handleProfilePictureClick = url => {
    if (url) {
      const isAvatar = url.search('avatar');
      const image = [
        {
          source: {
            uri: url,
          },
        },
      ];
      if (isAvatar === -1) {
        setTappedImage(image);
        setIsImageViewerVisible(true);
      } else {
        showActionSheet();
      }
    } else {
      showActionSheet();
    }
  };

  const onImageError = () => {
    if (profilePictureURL.length) {
      console.log('Error: URL', profilePictureURL);
    }
  };

  const getPermissionAsync = imagePermissions.getPermissionAsync;

  const onPressAddPhotoBtn = async () => {
    const options = imagePermissions.options;

    await getPermissionAsync();

    const result = await ImagePicker.launchImageLibraryAsync(options);

    console.log('Selected photo', result);

    if (!result.cancelled) {
      setProfilePictureURL(result.uri);
      props.setProfilePictureURL(result.uri);
    }
  };

  const closeButton = () => (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setIsImageViewerVisible(false)}>
      <Image style={styles.closeIcon} source={appStyles.iconSet.close} />
    </TouchableOpacity>
  );

  const showActionSheet = index => {
    setSelectedPhotoIndex(index);
    actionSheet.current.show();
  };

  const onActionDone = index => {
    if (index == 0) {
      onPressAddPhotoBtn();
    }
    if (index == 2) {
      // Remove button
      if (profilePictureURL) {
        setProfilePictureURL(null);
        props.setProfilePictureURL(null);
      }
    }
  };

  return (
    <>
      <View style={styles.imageBlock}>
        <TouchableHighlight
          style={styles.imageContainer}
          onPress={() => handleProfilePictureClick(profilePictureURL)}>
          <Image
            style={[styles.image, {opacity: profilePictureURL ? 1 : 0.3}]}
            source={
              profilePictureURL
                ? {uri: profilePictureURL}
                : appStyles.iconSet.userAvatar
            }
            resizeMode="cover"
            onError={onImageError}
          />
        </TouchableHighlight>

        <TouchableOpacity onPress={showActionSheet} style={styles.addButton}>
          <Icon name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ActionSheet
          ref={actionSheet}
          title={IMLocalized('Confirm action')}
          options={[
            IMLocalized('Change Profile Photo'),
            IMLocalized('Cancel'),
            IMLocalized('Remove Profile Photo'),
          ]}
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          onPress={index => {
            onActionDone(index);
          }}
        />
        <ImageView
          images={tappedImage}
          isVisible={isImageViewerVisible}
          onClose={() => setIsImageViewerVisible(false)}
          controls={{close: closeButton}}
        />
      </ScrollView>
    </>
  );
};

export default TNProfilePictureSelector;
