import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import styles from './styles';
import MAP_STYLE from '../../../../MapStyle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function IMVendorMapScreen({navigation, vendors}) {
  const initialViewPH = {
    latitude: 14.5853,
    longitude: 121.0613,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [region, setRegion] = useState({
    ...initialViewPH
  });
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkers(vendors);
  }, [vendors]);

  const onPressMarkerItem = item => {
    navigation.navigate('SingleVendor', {
      item: item,
    });
  };

  return (
    <View style={styles.container}>
      <MapView region={region} style={styles.map} customMapStyle={MAP_STYLE}>
        {markers.map(marker => (
          <Marker
            onPress={() => onPressMarkerItem(marker)}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
}

IMVendorMapScreen.navigationOptions = ({navigation}) => ({
  headerTitle: 'Restaurants',
  headerRight: () => <Text />,
});

IMVendorMapScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    vendors: PropTypes.array.isRequired,
  }),
};

const mapStateToProps = state => ({
  vendors: state.vendor.vendors,
});

export default connect(mapStateToProps)(IMVendorMapScreen);
