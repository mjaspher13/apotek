import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import {BackHandler} from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { Appearance } from "react-native-appearance";
import PropTypes from 'prop-types';
import DynamicAppStyles from '../../../DynamicAppStyles';
import styles from './styles';
import Hamburger from '../../../components/Hamburger/Hamburger';
import { IMLocalized } from '../../../Core/localization/IMLocalization';
import {OrdersAPIManager} from '../../api/orders';
import { TNEmptyStateView, TNActivityIndicator } from '../../../Core/truly-native';

const COLOR_SCHEME = Appearance.getColorScheme()

const OrdersScreen = (props) => {
  
    const [orders, setOrders] = useState(null)

    const currentUser = useSelector((state) => state.auth.user);

    const onOrdersUpdate = (orders) => {
        setOrders(orders)
    }

    const apiManager = new OrdersAPIManager(onOrdersUpdate);

    useEffect(() => {
        if (currentUser) {
            apiManager.subscribe(currentUser.id);
        }

        // Return unsubscriber
        return apiManager.unsubscribe;
    }, [currentUser.id]);

    useEffect(() => {
      const backAction = () => {
        props.navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, []);

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
                <Text style={styles.statusText}>
                    {item.status}
                </Text>
            </View>
          </View>
        )
    }

    const emptyStateConfig = {
        title: IMLocalized('No Orders'),
        description: IMLocalized(
          'You have not delivered any orders yet. All your orders will be displayed here.',
        ),
    };

    if (orders == null) {
        return (
            <TNActivityIndicator />
        )
    }

    if (orders.length == 0) {
        return (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              appStyles={DynamicAppStyles}
              emptyStateConfig={emptyStateConfig}
            />
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

OrdersScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  })
};

OrdersScreen.navigationOptions = ({ navigation }) => ({
    title: IMLocalized('Orders'),
    headerLeft: () => (
      <Hamburger
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
});


export default OrdersScreen;
