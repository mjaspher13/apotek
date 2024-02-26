import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Button from 'react-native-button';
import DynamicAppStyles from '../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {firebase} from '../../Core/firebase/config';
import styles from './styles';
import Hamburger from '../../components/Hamburger/Hamburger';
import {VENDOR_ORDERS} from '../../Configuration';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import {overrideCart} from '../../Core/cart/redux/actions';
import {updateOrders} from '../../Core/delivery/redux';

// Refs should NOT be called on each render.
// But it uses the USER from the auth prop

function OrderListScreen(props) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const COLOR_SCHEME = Appearance.getColorScheme();

  const ref = firebase
    .firestore()
    .collection(VENDOR_ORDERS)
    .where('authorID', '==', user.id)
    .orderBy('createdAt', 'desc');
  function onReorderPress(item) {
    dispatch(overrideCart(item.products, user));
    dispatch(overrideRx(item.prescriptions, user));
    props.navigation.navigate('Cart', {appStyles: DynamicAppStyles});
  }
  function onCollectionUpdate(querySnapshot) {
    console.log(
      'OrderListScreen2: onCollectionUpdate',
      data,
      querySnapshot.metadata.fromCache,
    );
    const data2 = [];
    if (!querySnapshot.metadata.fromCache) {
      querySnapshot.forEach((doc, i) => {
        const currentData = doc.data();
        if (!data2[i] || data2[i].id != currentData.id) {
          const docData = currentData;
          data2.push({
            id: doc.id,
            ...docData,
          });
        }
      });
      // dispatch(updateOrders(data2));
      // setData(data2);
    }
  }
  function renderItem({item}) {
    console.log('OrderListScreen2: item.createdAt', Object.keys(item));
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() =>
          props.navigation.navigate('OrderTrackingScreen', {
            item,
            appStyles: DynamicAppStyles,
          })
        }>
        <View>
          <Text style={styles.headerTitle}>
            {new Date(item.createdAt.toDate()).toDateString()} - {item.status}
          </Text>
        </View>
        {item.products.map(food => {
          return (
            <View style={styles.rowContainer} key={food.id}>
              <Text style={styles.count}>{food.quantity}</Text>
              <Text style={styles.title}>{food.name}</Text>
              <Text style={styles.price}>₱{food.price}</Text>
            </View>
          );
        })}
        <View style={styles.actionContainer}>
          <Text style={styles.total}>
            Total: ₱
            {item.products
              .reduce((prev, next) => prev + next.price * next.quantity, 0)
              .toFixed(2)}
          </Text>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => onReorderPress(item)}>
            {IMLocalized('REORDER')}
          </Button>
        </View>
      </TouchableOpacity>
    );
  }

  // Everything that has an onSubscribe should have its own "useEffect"
  useEffect(() => {
    return ref.onSnapshot(onCollectionUpdate, error => {
      console.log(error);
    });
    // constant second argument to make it run only once???
    // BUT since we are calling it in the render function it WILL always run???!??!!?
  }, []);

  return (
    <FlatList
      style={styles.flat}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  );
}

OrderListScreen.navigationOptions = ({navigation}) => ({
  title: IMLocalized('Orders'),
  headerLeft: () => (
    <Hamburger
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  ),
});

export default OrderListScreen;
