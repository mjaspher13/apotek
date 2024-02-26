import React, {useState, useEffect} from 'react';
import {Text, View, Dimensions, Image, ScrollView} from 'react-native';
import Button from 'react-native-button';
import {Bar} from 'react-native-progress';
import dynamicStyles from './styles';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {IMLocalized} from '../../localization/IMLocalization';
import {IMSingleOrderAPIManager} from '../api/IMSingleOrderAPIManager';
import {useColorScheme} from 'react-native-appearance';
import IMDeliveryView from '../IMDelivery/IMDeliveryView';
import FastImage from 'react-native-fast-image';
import {getDirections, getETA} from '../api/directions';
import {ORDER_STATUSES} from '../../../Configuration';
import moment from 'moment';

export default function IMOrderTrackingScreen({navigation, screenProps}) {
  const COLOR_SCHEME = screenProps.theme;

  const appStyles = navigation.getParam('appStyles');
  const styles = dynamicStyles(appStyles, COLOR_SCHEME);

  const item = navigation.getParam('item');
  const [order, setOrder] = useState(item);
  const [eta, setEta] = useState(0);
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [receiveHandler, setReceiveHandler] = useState(() => {}); // Self note: AUTO-CALLED SOMEHOW. See useEffect
  const [cancelHandler, setCancelHandler] = useState(() => {}); // Self note: AUTO-CALLED SOMEHOW. See useEffect

  const {width} = Dimensions.get('screen');
  let singleOrderManager = null;
  const stages = [
    ORDER_STATUSES.Placed,
    ORDER_STATUSES.Preparing,
    ORDER_STATUSES.Shipped,
    ORDER_STATUSES.InTransit,
    ORDER_STATUSES.Completed,
    ORDER_STATUSES.Received,
  ];

  useEffect(() => {
    singleOrderManager = new IMSingleOrderAPIManager(setOrder, item.id);
    setReceiveHandler(() => {
      // Self note: Need to return the ACTUAL function within this function so that it doesn't get auto-called
      // Probably because we set the onPress to be {receiveHandler}. Yeah that's probably it....
      return () => {
        singleOrderManager.receive();
      };
    });
    setCancelHandler(() => {
      return () => {
        singleOrderManager.cancel();
      };
    });

    return () => {
      singleOrderManager.unsubscribe();
    };
  }, [item]);

  const computeETA = async () => {
    const preparingTime = 900;

    if (
      (order.status === ORDER_STATUSES.Placed ||
        order.status === ORDER_STATUSES.Preparing ||
        order.status === ORDER_STATUSES.DriverPending ||
        order.status === ORDER_STATUSES.DriverAccepted ||
        order.status === ORDER_STATUSES.DriverRejected) &&
      order.address &&
      order.author
    ) {
      return;
    }
    if (order.driver && order.vendor && order.address) {
      if (order.status === ORDER_STATUSES.Shipped) {
        // ETA = 2 * (driver_to_restaurant + restaurant_to_customer)
        const eta1 = await getETA(order.driver.location, {
          latitude: order.vendor.latitude,
          longitude: order.vendor.longitude,
        });
        const eta2 = await getETA(
          {latitude: order.vendor.latitude, longitude: order.vendor.longitude},
          order.address.location
            ? order.address.location
            : order.author.location,
        );
        setEta(eta1 + eta2 + preparingTime);
        return;
      }
      if (order.status === ORDER_STATUSES.InTransit) {
        if (order.driver) {
          const eta = await getETA(
            order.driver.location,
            order.address.location,
          );
          setEta(eta);
          return;
        } else {
          console.log('No driver info', estimatedHours * 60 * 60 * 1000);
          setEta(estimatedHours * 60 * 60 * 1000);
          return;
        }
      }
    }
    setEta(0);
  };

  const computePolylineCoordinates = () => {
    if (!order) {
      // invalid order
      return;
    }
    const {driver, author, vendor, address} = order;

    if (order.status === ORDER_STATUSES.Shipped && vendor && driver) {
      // Driver has been allocated, and they're driving to pick up the order from the vendor location
      const sourceCoordinate = {
        latitude: driver.location?.latitude || 0,
        longitude: driver.location?.longitude || 0,
      };
      const destCoordinate = {
        latitude: vendor.latitude || 0,
        longitude: vendor.longitude || 0,
      };
      getDirections(sourceCoordinate, destCoordinate, coordinates => {
        const pointOfInterests = [
          sourceCoordinate,
          ...coordinates,
          destCoordinate,
        ];
        setRouteCoordinates(coordinates);
        centerMap(pointOfInterests);
      });
      return;
    }

    if (order.status === ORDER_STATUSES.InTransit && vendor && driver) {
      // Driver has picked up the order from the vendor, and now they're delivering it to the shipping address
      const sourceCoordinate = {
        latitude: driver.location?.latitude || 0,
        longitude: driver.location?.longitude || 0,
      };
      const destLocation = address ? address.location : author.location;
      const destCoordinate = {
        latitude: destLocation.latitude || 0,
        longitude: destLocation.longitude || 0,
      };
      getDirections(sourceCoordinate, destCoordinate, coordinates => {
        const pointOfInterests = [
          sourceCoordinate,
          ...coordinates,
          destCoordinate,
        ];
        setRouteCoordinates(coordinates);
        centerMap(pointOfInterests);
      });
      return;
    }
  };

  const centerMap = pointOfInterests => {
    var maxLatitude = -400;
    var minLatitude = 400;
    var maxLongitude = -400;
    var minLongitude = 400;
    pointOfInterests.forEach(coordinate => {
      if (maxLatitude < coordinate.latitude) {
        maxLatitude = coordinate.latitude;
      }
      if (minLatitude > coordinate.latitude) {
        minLatitude = coordinate.latitude;
      }
      if (maxLongitude < coordinate.longitude) {
        maxLongitude = coordinate.longitude;
      }
      if (minLongitude > coordinate.longitude) {
        minLongitude = coordinate.longitude;
      }
    });

    setRegion({
      latitude: (maxLatitude + minLatitude) / 2,
      longitude: (maxLongitude + minLongitude) / 2,
      latitudeDelta: Math.abs(
        (maxLatitude - (maxLatitude + minLatitude) / 2) * 4,
      ),
      longitudeDelta: Math.abs(
        (maxLongitude - (maxLongitude + minLongitude) / 2) * 4,
      ),
    });
  };

  useEffect(() => {
    computeETA();
    computePolylineCoordinates();
  }, [order?.status]);

  var deliveryDate = new Date();
  if (eta > 0) {
    deliveryDate.setSeconds(deliveryDate.getSeconds() + eta);
  }

  var latestArrivalDate = new Date();
  latestArrivalDate.setSeconds(latestArrivalDate.getSeconds() + eta + 20 * 60);
  const now = new Date();
  const sameDayLimit = 17; // 5PM

  const etaString =
    eta > 0
      ? (deliveryDate.getHours() < 10
          ? '0' + deliveryDate.getHours()
          : deliveryDate.getHours()) +
        ':' +
        (deliveryDate.getMinutes() < 10
          ? '0' + deliveryDate.getMinutes()
          : deliveryDate.getMinutes())
      : now.getHours() > sameDayLimit
      ? 'Tomorrow'
      : 'Later today';
  let latestArrivalString =
    eta > 0
      ? (latestArrivalDate.getHours() < 10
          ? '0' + latestArrivalDate.getHours()
          : latestArrivalDate.getHours()) +
        ':' +
        (latestArrivalDate.getMinutes() < 10
          ? '0' + latestArrivalDate.getMinutes()
          : latestArrivalDate.getMinutes())
      : now.getHours() > sameDayLimit
      ? 'tomorrow'
      : 'today';
  let tempIndex = stages.indexOf(order.status);
  if (order.status === ORDER_STATUSES.ManualShipped) {
    tempIndex = 2;
  } else if (order.status === ORDER_STATUSES.ManualDelivered) {
    tempIndex = 4;
  } else if (order.status === ORDER_STATUSES.Rejected) {
    tempIndex = -2; // Hehe
  }
  const stagesIndex = tempIndex === -1 ? 0 : tempIndex;

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        {[
          ORDER_STATUSES.Rejected,
          ORDER_STATUSES.Cancelled,
          ORDER_STATUSES.Completed,
          ORDER_STATUSES.ManualDelivered,
          ORDER_STATUSES.ManualShipped,
          ORDER_STATUSES.Received,
        ].indexOf(order.status) > -1 ? (
          <View style={styles.upperPane}>
            <Text style={styles.time}>{IMLocalized(order.status)}</Text>
            {order.status === ORDER_STATUSES.Received &&
              order.updatedAt?.seconds && (
                <Text style={styles.eta}>
                  {moment(order.updatedAt.seconds * 1000).format(
                    'MM/DD/YYYY HH:mm',
                  )}
                </Text>
              )}
          </View>
        ) : (
          <View style={styles.upperPane}>
            <Text style={styles.time}>{etaString}</Text>
            <Text style={styles.eta}>{IMLocalized('Estimated arrival')}</Text>
          </View>
        )}

        {order.status !== ORDER_STATUSES.Received &&
          order.status !== ORDER_STATUSES.Cancelled &&
          order.status !== ORDER_STATUSES.Rejected && (
            <Bar
              progress={(1 / stages.length) * (stagesIndex + 1)}
              color={appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor}
              borderWidth={0}
              width={width - 20}
              unfilledColor={appStyles.colorSet[COLOR_SCHEME].grey0}
              style={styles.bar}
            />
          )}
        <Text style={styles.prepText}>
          {order.status === ORDER_STATUSES.Placed ||
          order.status === ORDER_STATUSES.Preparing ||
          order.status === ORDER_STATUSES.Accepted ||
          order.status === ORDER_STATUSES.DriverPending ||
          order.status === ORDER_STATUSES.DriverAccepted ||
          order.status === ORDER_STATUSES.DriverRejected
            ? IMLocalized('Preparing your order...')
            : order.status === ORDER_STATUSES.InTransit
            ? (order.driver ? order.driver.firstName : 'Your driver') +
              IMLocalized(' is heading your way')
            : order.status === ORDER_STATUSES.Shipped
            ? (order.driver ? order.driver.firstName : 'Your driver') +
              IMLocalized(' is picking up your order')
            : ''}
        </Text>
        {[
          ORDER_STATUSES.Rejected,
          ORDER_STATUSES.Cancelled,
          ORDER_STATUSES.Completed,
          ORDER_STATUSES.ManualShipped,
          ORDER_STATUSES.ManualDelivered,
          ORDER_STATUSES.Received,
        ].indexOf(order.status) === -1 && (
          <Text style={styles.eta}>
            {IMLocalized('Latest arrival by')} {latestArrivalString}
          </Text>
        )}
        {(stagesIndex === 0 || stagesIndex === 1) && (
          <FastImage
            source={require('../../../../assets/images/Nurse.png')}
            resizeMode={'contain'}
            style={styles.image}
          />
        )}

        {/* {order.status === ORDER_STATUSES.Placed &&
          <>
            <Text style={styles.thirdParty}>You may only cancel if the warehouse has not yet approved your order.</Text>
            <Button
              containerStyle={styles.cancelContainer}
              style={styles.cancelText}
              onPress={cancelHandler}
            >Cancel</Button>
          </>
        } */}

        {order.status === ORDER_STATUSES.ManualShipped && (
          <Text style={styles.thirdParty}>
            The seller has shipped your order with a third-party, so we are
            unable to show real-time updates. However, you may receive updates
            via SMS or other channels from the seller or driver.
          </Text>
        )}

        {(order.status === ORDER_STATUSES.ManualDelivered ||
          order.status === ORDER_STATUSES.Completed) && (
          <>
            <Text style={styles.thirdParty}>
              Please verify that the order has arrived by clicking the button
              below.
            </Text>
            <Button
              containerStyle={styles.receiveContainer}
              style={styles.receiveText}
              onPress={receiveHandler}>
              RECEIVE
            </Button>
          </>
        )}
        {region &&
          (order.status === ORDER_STATUSES.InTransit ||
            order.status === ORDER_STATUSES.Shipped) && (
            <MapView
              initialRegion={region}
              provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
              showsUserLocation={true}
              style={styles.mapStyle}>
              <Polyline coordinates={routeCoordinates} strokeWidth={5} />
              {order.driver !== undefined && (
                <Marker
                  title={order.driver?.firstName}
                  coordinate={{
                    latitude: order.driver?.location.latitude || 0,
                    longitude: order.driver?.location.longitude || 0,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/car-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.driver.firstName}</Text> */}
                </Marker>
              )}
              {order.status === 'Order Shipped' && order.vendor && (
                <Marker
                  title={order.vendor.title}
                  coordinate={{
                    latitude: parseFloat(order.vendor.latitude) || 0,
                    longitude: parseFloat(order.vendor.longitude) || 0,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/destination-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.vendor.title}</Text> */}
                </Marker>
              )}

              {order.status === 'In Transit' && order.address && (
                <Marker
                  title={`${order.address?.line1} ${order.address?.line2}`}
                  coordinate={{
                    latitude: order.address.location
                      ? order.address.location.latitude
                      : order.author.location.latitude || 0,
                    longitude: order.address.location
                      ? order.address.location.longitude
                      : order.author.location.longitude || 0,
                  }}
                  style={styles.marker}>
                  <Image
                    source={require('../assets/destination-icon.png')}
                    style={styles.mapCarIcon}
                  />
                  {/* <Text style={styles.markerTitle}>{order.vendor.title}</Text> */}
                </Marker>
              )}
            </MapView>
          )}
        <IMDeliveryView
          screenProps={screenProps}
          navigation={navigation}
          defaultItem={order}
          appStyles={styles.overlay}
        />
      </View>
    </ScrollView>
  );
}

IMOrderTrackingScreen.navigationOptions = ({navigation, screenProps}) => {
  const appStyles = navigation.getParam('appStyles');
  const styles = dynamicStyles(appStyles, screenProps.theme);
  return {
    title: IMLocalized('Your Order'),
    headerRight: () => <View />,
  };
};
