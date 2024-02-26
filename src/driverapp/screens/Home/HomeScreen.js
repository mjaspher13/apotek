import React, {useState, useEffect} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import DynamicAppStyles from '../../../DynamicAppStyles';
import styles from './styles';
import Hamburger from '../../../components/Hamburger/Hamburger';
import {IMLocalized} from '../../../Core/localization/IMLocalization';
import {setUserData} from '../../../Core/onboarding/redux/auth';
import {firebaseUser} from '../../../Core/firebase';
import {getDistance} from '../../../Core/location';
import {DriverAPIManager} from '../../api/driver';
import {TNEmptyStateView} from '../../../Core/truly-native';
import {NewOrderRequestModal} from '../../components';
import {getDirections} from '../../../Core/delivery/api/directions';
import {OrderPreviewCard} from '../../components';
import {ORDER_STATUSES} from '../../../Configuration';
import app from '../../../../app.json';

function HomeScreen(props) {
  const [deliveryDriverData, setDeliveryDriverData] = useState(null);
  const [order, setOrder] = useState(null);
  const [isWaitingForOrders, setIsWaitingForOrders] = useState(false);

  const currentUser = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const onDriverUpdate = data => {
    const orderRequestData = data?.orderRequestData;
    const inProgressOrderID = data?.inProgressOrderID;
    setDeliveryDriverData({orderRequestData, inProgressOrderID});
    if (!orderRequestData && !inProgressOrderID && data.isActive === true) {
      // Driver has no in-progress order, so they can go offline => enable button, show user location on map
      setIsWaitingForOrders(true);
      setRouteCoordinates([]);
      props.navigation.setParams({
        goOffline: goOffline,
      });
    } else {
      // Disable button, hide user location on map
      setIsWaitingForOrders(false);
      props.navigation.setParams({
        goOffline: undefined,
      });
    }
    dispatch(setUserData({user: data}));
  };
  const apiManager = new DriverAPIManager(onDriverUpdate, setOrder);

  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [positionWatchID, setPositionWatchID] = useState(null);

  useEffect(() => {
    apiManager.unsubscribe();
    apiManager.subscribeToDriverDataUpdates(currentUser);
    if (currentUser) {
      setRegion({
        latitude: currentUser.location?.latitude,
        longitude: currentUser.location?.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    }
    return () => {
      positionWatchID != null && Geolocation.clearWatch(positionWatchID);
      apiManager.unsubscribe();
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (deliveryDriverData && deliveryDriverData.inProgressOrderID) {
      apiManager.subscribeToOrder(deliveryDriverData.inProgressOrderID);
    }
  }, [deliveryDriverData]);

  useEffect(() => {
    if (order) {
      computePolylineCoordinates(order);
      trackDriverLocation();
    } else {
      positionWatchID != null && Geolocation.clearWatch(positionWatchID);
      setRouteCoordinates([]);
    }
  }, [order]);

  const goOnline = () => {
    apiManager.goOnline(currentUser);
  };

  const goOffline = () => {
    apiManager.goOffline(currentUser);
  };

  const onMessagePress = () => {
    const customerID = order.author && order.author.id;
    const viewerID = currentUser.id || currentUser.userID;
    let channel = {
      id: viewerID < customerID ? viewerID + customerID : customerID + viewerID,
      participants: [order.author],
    };
    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: DynamicAppStyles,
    });
  };

  const emptyStateConfig = {
    title: IMLocalized("You're offline"),
    description: IMLocalized(
      'Go online in order to start getting delivery requests from customers and vendors.',
    ),
    buttonName: IMLocalized('Go Online'),
    onPress: goOnline,
  };

  const onAcceptNewOrder = () => {
    deliveryDriverData?.orderRequestData &&
      apiManager.accept(deliveryDriverData.orderRequestData, currentUser);
  };

  const onRejectNewOrder = () => {
    deliveryDriverData?.orderRequestData &&
      apiManager.reject(deliveryDriverData.orderRequestData, currentUser);
  };

  const computePolylineCoordinates = order => {
    if (!order) {
      // invalid order
      return;
    }
    const driver = currentUser;
    const author = order.author;
    const vendor = order.vendor;
    const address = order.address;

    if (order.status === ORDER_STATUSES.Shipped && vendor && driver) {
      // Driver has been allocated, and they're driving to pick up the order from the vendor location
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      };
      const destCoordinate = {
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      };
      getDirections(sourceCoordinate, destCoordinate, coordinates => {
        setRouteCoordinates(coordinates);
      });
      return;
    }

    if (order.status === ORDER_STATUSES.InTransit && vendor && driver) {
      // Driver has picked up the order from the vendor, and now they're delivering it to the shipping address
      const sourceCoordinate = {
        latitude: driver.location?.latitude,
        longitude: driver.location?.longitude,
      };
      const destLocation = address ? address.location : author.location;
      const destCoordinate = {
        latitude: destLocation.latitude,
        longitude: destLocation.longitude,
      };
      getDirections(sourceCoordinate, destCoordinate, coordinates => {
        setRouteCoordinates(coordinates);
      });
      return;
    }
  };

  const renderMapElements = () => {
    if (!order || routeCoordinates.length < 2 || isWaitingForOrders) {
      return null;
    }
    return (
      <>
        <Polyline coordinates={routeCoordinates} strokeWidth={5} />
        {order.driver !== undefined && (
          <Marker
            title={order.driver.firstName}
            coordinate={routeCoordinates[0]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/car-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
        {order.status === ORDER_STATUSES.Shipped && order.vendor && (
          <Marker
            title={order.vendor?.title}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}

        {order.status === ORDER_STATUSES.InTransit && order.address && (
          <Marker
            title={`${order.address?.line1} ${order.address?.line2}`}
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
            style={styles.marker}>
            <Image
              source={require('../../../Core/delivery/assets/destination-icon.png')}
              style={styles.mapCarIcon}
            />
          </Marker>
        )}
      </>
    );
  };

  const updatePolyline = location => {
    if (routeCoordinates.length < 2) {
      computePolylineCoordinates(order);
      return;
    }
    const firstPoint = routeCoordinates[0];
    const distance = getDistance(
      firstPoint.latitude,
      firstPoint.longitude,
      location.latitude,
      location.longitude,
    );
    if (distance < 1) {
      const tmp = routeCoordinates.splice(0, 1);
      setRouteCoordinates(tmp);
    } else if (distance > 2) {
      // we need to reroute since driver took a wrong turn
      computePolylineCoordinates(order);
    }
  };

  const watchPosition = () => {
    return Geolocation.watchPosition(position => {
      const coords = position.coords;
      const locationDict = {
        location: {
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        },
      };
      dispatch(setUserData({user: {...currentUser, ...locationDict}}));
      firebaseUser.updateUserData(currentUser.id, locationDict);
      updatePolyline(coords);
      setRegion({
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00421,
      });
    });
  };

  const handleAndroidLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: IMLocalized('Instamobile'),
          message: IMLocalized('Instamobile wants to access your location.'),
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPositionWatchID(watchPosition());
      } else {
        alert(
          IMLocalized(
            'Location permission denied. Turn on location to use the app.',
          ),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const trackDriverLocation = async () => {
    if (Platform.OS === 'ios') {
      setPositionWatchID(watchPosition());
    } else {
      handleAndroidLocationPermission();
    }
  };

  if (currentUser && !currentUser.isActive) {
    return (
      <View style={styles.inactiveViewContainer}>
        <TNEmptyStateView
          appStyles={DynamicAppStyles}
          emptyStateConfig={emptyStateConfig}
        />
      </View>
    );
  }

  if (currentUser && currentUser.isActive) {
    if (deliveryDriverData?.orderRequestData) {
    }
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={region}
          region={region}
          showsUserLocation={isWaitingForOrders}
          provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
          style={styles.mapStyle}>
          {renderMapElements()}
        </MapView>
        {deliveryDriverData?.orderRequestData && (
          <NewOrderRequestModal
            onAccept={onAcceptNewOrder}
            onReject={onRejectNewOrder}
            appStyles={DynamicAppStyles}
            isVisible={!!deliveryDriverData?.orderRequestData}
            onModalHide={onRejectNewOrder}
            from={deliveryDriverData?.orderRequestData?.vendor?.title || ''}
            to={
              deliveryDriverData?.orderRequestData?.address?.line2 +
              ' ' +
              deliveryDriverData?.orderRequestData?.address?.city
            }
          />
        )}
        {order && currentUser.inProgressOrderID && (
          <OrderPreviewCard
            onMessagePress={onMessagePress}
            driver={currentUser}
            order={order}
            appStyles={DynamicAppStyles}
          />
        )}
      </View>
    );
  }

  return null;
}

HomeScreen.navigationOptions = ({navigation}) => ({
  title: app.displayName,
  headerRight:
    navigation.state.params?.goOffline !== undefined ? (
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={navigation.state.params?.goOffline}>
        <Image
          source={require('../../../../assets/icons/shutdown.png')}
          style={styles.logoutButtonImage}
        />
      </TouchableOpacity>
    ) : null,
  headerLeft: () => (
    <Hamburger
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  ),
});

HomeScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

export default HomeScreen;
