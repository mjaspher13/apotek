import React from 'react';
import {View, Text, Linking} from 'react-native';
import { useSelector } from 'react-redux';
import {Icon} from 'react-native-elements';
//import {Circle} from 'react-native-progress';
import dynamicStyles from './styles';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {IMLocalized} from '../../localization/IMLocalization';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { DELIVERY_FEE, ORDER_STATUSES } from '../../../Configuration.js';

export default function IMDeliveryView({navigation, defaultItem, style, screenProps }) {
  const item = defaultItem || navigation.getParam('item', defaultItem);
  const appStyles = navigation.getParam('appStyles');

  const currentUser = useSelector((state) => state.auth.user);
  const delivery_fee = item.deliveryFee !== undefined ? item.deliveryFee : DELIVERY_FEE // useSelector(state => item.delivery_fee?.value) || DELIVERY_FEE; // Enforce default in case not yet loaded

  const styles = dynamicStyles(appStyles, screenProps.theme);

  const renderOrderSummary = singleItem => {
    return (
      <View style={styles.orderPane} key={singleItem.id}>
        <Text style={styles.qty}>{singleItem.quantity}</Text>
        <Text style={styles.productItem}>{singleItem.name}</Text>
      </View>
    );
  };

  const onCallButtonPress = () => {
    const phoneNumber = (item.driver && item.driver.phone)
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
    }
  }

  const onSendMessageButtonPress = () => {
    const driverID = (item.driver && item.driver.id)
    const viewerID = currentUser.id || currentUser.userID
    let channel = {
      id: viewerID < driverID ? viewerID + driverID : driverID + viewerID,
      participants: [item.driver],
    };
    navigation.navigate('PersonalChat', {
      channel,
      appStyles,
    });
  }

  const renderDriver = driver => {
    return (
      <View>
        <View style={styles.medalContainer}>
          <View styles={styles.driverContainer}>
            <Text style={styles.driverTitle}>{driver.firstName} {IMLocalized("is in a")} {driver.carName}</Text>
            <Text style={styles.plateNum}>{driver.carNumber}</Text>
          </View>
          <View style={styles.imagesContainer}>
            {driver.profilePictureURL && (
              <FastImage
                style={styles.driverImage}
                source={{uri: driver.profilePictureURL}}
              />
            )}
            {driver.carPictureURL && (
              <FastImage
                style={styles.carImage}
                source={{uri: driver.carPictureURL}}
              />
            )}
          </View>
        </View>

        <View style={styles.contactPane}>
          <TouchableOpacity style={styles.callButton} onPress={onCallButtonPress}>
            <Icon name="call" onPress={onCallButtonPress} />
          </TouchableOpacity>
          <Text style={styles.messageButton} onPress={onSendMessageButtonPress}>
            { IMLocalized('Send a message')}
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={[styles.container, style]}>
        {item.driver !== undefined &&
          (item.status !== ORDER_STATUSES.Completed && item.status !== ORDER_STATUSES.Received)
          && renderDriver(item.driver)
        }
        <Text style={styles.sectionTitle}>{IMLocalized('Delivery Details')}</Text>
        <Text style={styles.subMainTitle}>{IMLocalized('Address')}</Text>
        <Text style={styles.subText}>
          {`${item.address.line1} ${item.address.line2}, ${item.address.city} ${item.address.postalCode}`}
        </Text>
        {/* <View style={styles.line} />
        <Text style={styles.subMainTitle}>{IMLocalized('Type')}</Text>
        <Text style={styles.subText}>Deliver to door</Text> */}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>{IMLocalized('Order Summary')}</Text>
        <Text style={styles.orderId}>{item.id}</Text>
        <View style={styles.horizontalPane}>
          <Text style={styles.vendorTitle}>{item.vendor && item.vendor.title}</Text>
          <Text style={styles.receipts}>{IMLocalized('View Receipts')}</Text>
        </View>
        {item.products.map(singleItem => renderOrderSummary(singleItem))}
        {/* <View style={styles.showMoreContainer}>
          <Text style={styles.showMoreText}>Show more </Text>
          <Icon type="ionicon" size={15} name="ios-arrow-down" />
        </View> */}

        <View style={styles.horizontalPane}>
          <Text style={styles.totalText}>{IMLocalized('Total')}</Text>
          <Text style={styles.totalPrice}>
            ₱
            {(
              item.products.reduce(
                (prev, next) => prev + next.price * next.quantity,
                0,
              )
              + delivery_fee
            ).toFixed(2)}
          </Text>
        </View>
        {/* <View style={styles.divider} />
        <View style={styles.medalContainer}>
          <View style={styles.medalTextContainer}>
            <Image
              style={styles.medalImage}
              source={require('../../../CoreAssets/gold.png')}
            />
            <Text>Gold</Text>
          </View>
          <View style={styles.medalTextContainer}>
            <Text style={styles.nextReward}>
              {IMLocalized('Your next reward')}
            </Text>
            <Circle
              progress={0.5}
              thickness={6}
              color="#D4AF37"
              unfilledColor="#FFDF00"
              size={24}
              width={25}
              borderWidth={0}
            />
          </View>
        </View> */}
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
}

IMDeliveryView.propTypes = {
  // styles: PropTypes.shape().style,
  defaultItem: PropTypes.object,
}

IMDeliveryView.navigationOptions = ({navigation}) => ({
  title: IMLocalized('Delivery Screen'),
  headerRight: () => <Icon name="options-vertical" type="simple-line-icon" />,
  headerStyle: {
    backgroundColor: '#f5e9e9',
  },
});
