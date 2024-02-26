import React, { useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Button from 'react-native-button';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import DynamicAppStyles from '../../DynamicAppStyles';
import preStyles from './styles';

function ImagePreview(props) {
  const photo = props.photo;
  const visible = props.isVisible;
  const styles = preStyles(props.screenProps.theme);

  // Used to reset zoom level. From https://github.com/DuDigital/react-native-zoomable-view/issues/40
  const [ yes, setYes ] = useState(true);

  const renderGalleryItem = ({ item }) => {
    return <TouchableOpacity
      onPress={() => {
        setYes(false);
        setTimeout(() => {
          setYes(true);
        }, 50);
        props.onPressItem(item)
      }}
      style={[
        styles.galleryItem,
        {
          // borderColor: item == photo ? DynamicAppStyles.colorSet.mainThemeForegroundColor : 'transparent'
        }
      ]}
    >
      <FastImage
        style={styles.detail}
        placeholderColor={DynamicAppStyles.colorSet[props.screenProps.theme].grey9}
        source={{uri: item}}
      />
    </TouchableOpacity>
  };

  return (
    <Modal
      style={styles.zoomPreviewModal}
      isVisible={visible}
      onModalHide={props.onClose}
      onBackButtonPress={props.onClose}
      onBackdropPress={props.onClose}
    >
      <TouchableOpacity style={styles.zoomCloseContainer}
        onPress={() => { props.onClose() }}
        title="Close">
        <Text style={styles.zoomClose}>✕</Text>
      </TouchableOpacity>

        <ReactNativeZoomableView
          zoomEnabled={yes}
          maxZoom={2.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          bindToBorders={true}
          captureEvent={true}
          pinchToZoomInSensitivity={5}
          pinchToZoomOutSensitivity={3}
          style={styles.zoomablePhotoContainer}
        >
          <FastImage
            resizeMode="contain"
            source={{
              uri: photo,
            }}
            style={styles.zoomedPhoto}
          />

        </ReactNativeZoomableView>
        
        {/* Copy of flatlist */}
        <FlatList
            style={styles.gallery}
            horizontal
            data={props.galleryPhotos}
            renderItem={renderGalleryItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `${item}`}
          />
      </Modal>
  );
}

export default ImagePreview;
