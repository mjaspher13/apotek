import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DeliverIcon from '../../../../../../assets/icons/deliver.png';
import styles from './styles';
import MAP_STYLE from '../../../../../MapStyle';
import {AdminDeliveryMapAPI} from '../../api/AdminDeliveryMapAPI';
import Hamburger from '../../../../../components/Hamburger/Hamburger';

export default function AdminDeliveryMapScreen({navigation}) {
  const initialViewPH = {
    latitude: 14.5853,
    longitude: 121.0613,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [region, setRegion] = useState(initialViewPH);
  const [markers, setMarkers] = useState([]);
  const orders = new AdminDeliveryMapAPI(setMarkers);

  useEffect(() => {
    return () => {
      orders.unsubscribe();
    };
  }, [orders]);

  return (
    <View style={styles.container}>
      <MapView region={region} style={styles.map} customMapStyle={MAP_STYLE}>
        {markers.map(marker => (
          <Marker
            coordinate={{
              latitude: marker.data.location.lat,
              longitude: marker.data.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            image={DeliverIcon}
            title={'Delivery of your burger king'}
          />
        ))}
      </MapView>
    </View>
  );
}

AdminDeliveryMapScreen.navigationOptions = ({navigation}) => ({
  title: 'Delivery',
  headerTitle: 'MapScreen',
  headerRight: () => <Text />,
});
