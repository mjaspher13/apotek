import React, {useState, useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {Appearance} from 'react-native-appearance';
import DynamicAppStyles from '../../../DynamicAppStyles';
import styles from './styles';
import Hamburger from '../../../components/Hamburger/Hamburger';
import {IMLocalized} from '../../../Core/localization/IMLocalization';
import {VendorOrderAPIManager} from '../../api/orders';

function HomeScreen() {
  const [orders, setOrders] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const apiManager = new VendorOrderAPIManager(setOrders);
  const COLOR_SCHEME = Appearance.getColorScheme();

  useEffect(() => {
    apiManager.subscribe(currentUser);

    // Return FUNCTION to call to unsubscribe
    return apiManager.unsubscribe;
  }, [currentUser]);

  const onAccept = (order) => {
    apiManager.accept(order)
  }

  const onReject = (order) => {
    apiManager.reject(order)
  }

  const renderItem = ({item}) => {
    const address = item.address
    const addressText = IMLocalized("Deliver to: ")
    return (
      <View style={styles.container}>
        <View>
          {item != null &&
            item.products != null &&
            item.products[0] != null &&
            item.products[0].photo != null &&
            item.products[0].photo.length > 0 && (
              <FastImage
                placeholderColor={DynamicAppStyles.colorSet[COLOR_SCHEME].grey9}
                style={styles.photo}
                source={{uri: item.products[0].photo}}
              />
            )}
          <View style={styles.overlay} />
          <Text style={styles.address}>
            {`${addressText} ${address?.line1} ${address?.line2} ${address?.city} ${address?.postalCode}`}
          </Text>
        </View>
        {item.products.map(product => {
          return (
            <View style={styles.rowContainer} key={product.id}>
              <Text style={styles.count}>{product.quantity}</Text>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.price}>₱{product.price}</Text>
            </View>
          );
        })}
        <View style={styles.actionContainer}>
          <Text style={styles.total}>
            {IMLocalized("Total: ₱")}
            {(
              item.products.reduce(
                (prev, next) => prev + next.price * next.quantity,
                0,
              )
            ).toFixed(2)}
          </Text>
          {item.status === "Order Placed" ? (
            <View style={styles.buttonsContainer}>
              <Button
                containerStyle={styles.actionButtonContainer}
                style={styles.actionButtonText}
                onPress={() => onAccept(item)}>
                {IMLocalized("Accept")}
              </Button>
              <Button
                containerStyle={styles.rejectButtonContainer}
                style={styles.rejectButtonText}
                onPress={() => onReject(item)}>
                {IMLocalized("Reject")}
              </Button>
            </View>
          ) : (
            <Text style={styles.statusText}>
              {item.status}
            </Text>
          )}
        </View>
      </View>
    )
  }
  return (
    <FlatList
      style={styles.flat}
      data={orders}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  );
}

HomeScreen.navigationOptions = ({navigation}) => ({
  title: IMLocalized('Orders'),
  headerRight: null,
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
