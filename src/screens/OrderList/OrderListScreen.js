import React, {Component} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from 'react-native-button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import DynamicAppStyles from '../../DynamicAppStyles';
import preStyles from './styles';
import Hamburger from '../../components/Hamburger/Hamburger';
import {
  overrideCart,
  overrideRx,
  setCartVendor,
} from '../../Core/cart/redux/actions';
import {updateOrders} from '../../Core/delivery/redux';
import {logAddToCart} from '../../Core/firebase/analytics';
import {Appearance} from 'react-native-appearance';
import {TNEmptyStateView} from '../../Core/truly-native';
import {firebase} from '../../Core/firebase/config';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import {
  DELIVERY_FEE,
  ORDER_STATUSES,
  PWD_MULTIPLIER,
  VENDOR_ORDERS,
  VENDOR_PRODUCTS,
} from '../../Configuration';

let styles;

class OrderListScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: IMLocalized('Orders'),
  });

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  constructor(props) {
    super(props);

    this.COLOR_SCHEME = Appearance.getColorScheme();
    this.ref = firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .where('authorID', '==', this.props.user.id)
      .orderBy('createdAt', 'desc');
    this.productsRef = firebase.firestore().collection(VENDOR_PRODUCTS);

    this.state = {
      data: [],
    };

    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);

    this.goBack = props.navigation.goBack;
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
    this.willBlurSubscription = props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.willBlurSubscription?.remove();
    this.didFocusSubscription?.remove();
  }

  onReorderPress = item => {
    // Version 2: Just fetch so we have complete (and updated) data!
    this.productsRef
      .where(
        'id',
        'in',
        item.products.map(i => i.id),
      )
      .get()
      .then(completeItemData => {
        const stockWarningItemNames = [];
        const company = this.props.user.company || 'retail';
        const dataWithFormatWeExpect = [];
        completeItemData.forEach(doc => {
          const data2 = doc.data();
          const {
            name,
            description,
            photo,
            classification,
            minimumOrderQuantity,
            stock,
            tags,
          } = data2;
          const oldCartItem = item.products.filter(old => old.id === data2.id);

          if (data2.stock < oldCartItem[0].quantity) {
            // Alert user that stocks may not be sufficient
            stockWarningItemNames.push({
              name,
              original: oldCartItem[0].quantity,
              now: data2.stock,
            });
          }
          if (data2.stock) {
            dataWithFormatWeExpect.push({
              // Most importantly, get the quantity from the original item, but limit to stock value
              quantity: Math.min(oldCartItem[0].quantity, data2.stock),

              id: doc.id,
              categoryID: data2.categoryID,
              name,
              description,
              photo,
              // doc,
              classification,
              minimumOrderQuantity,
              stock,
              // price: !!data2[company] ? data2[company]: data2.retail, // TODO - better default
              price: data2.retail, // TDS
              tags,
            });
          }

          this.props.overrideCart(dataWithFormatWeExpect, this.props.user);
          this.props.setCartVendor(item.vendor, this.props.user);
          this.props.overrideRx(item.prescriptions, this.props.user);

          logAddToCart(dataWithFormatWeExpect, this.props.user);

          if (stockWarningItemNames.length) {
            setTimeout(() => {
              Alert.alert(
                'Quantity Changes',
                "Due to stock limitations, some items' quantities have been reduced for your reorder:\n\n" +
                  stockWarningItemNames.map(warn => warn.name).join('\n'),
              );
            }, 100); // Show after we navigate
          }

          this.props.navigation.navigate('Cart', {
            appStyles: DynamicAppStyles,
            appConfig: this.props.navigation.state.params.appConfig,
          });
        });
      })
      .catch(err => {
        console.warn('ERROR', err.message);
      });
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];

    querySnapshot.forEach(doc => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData,
      });
    });

    this.props.updateOrders(data);
    this.setState({
      data,
      // loading: false,
    });
  };

  renderItem = ({item}) => {
    const fromSettings =
      this.props.settings.delivery_fee?.value || DELIVERY_FEE;
    const delivery_fee =
      item.deliveryFee !== undefined ? item.deliveryFee : fromSettings;
    // `item` is one Order.
    const totalPaid =
      item.products.reduce(
        (prev, next) => prev + next.price * next.quantity,
        0,
      ) + delivery_fee;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() =>
          this.props.navigation.navigate('OrderTrackingScreen', {
            item,
            appStyles: DynamicAppStyles,
          })
        }>
        <View>
          <Text style={styles.headerTitleID}>{item.id}</Text>
          <Text style={styles.headerTitle}>
            {new Date(item.createdAt?.toDate()).toDateString()} -{' '}
            {item.status === ORDER_STATUSES.Completed
              ? 'Order Delivered'
              : item.status}
          </Text>
        </View>
        {item.products.map(food => {
          return (
            <View style={styles.rowContainer} key={food.id}>
              <Text style={styles.count}>{food.quantity}</Text>
              <Text style={styles.title}>{food.name}</Text>
              <Text style={styles.price}>₱{food.price.toFixed(2)}</Text>
            </View>
          );
        })}
        <View style={styles.actionContainer}>
          <Text style={styles.total}>Total: ₱{totalPaid.toFixed(2)}</Text>
          <Button
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => this.onReorderPress(item)}>
            {IMLocalized('REORDER')}
          </Button>
        </View>
      </TouchableOpacity>
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          width: '92%',
          marginLeft: '4%',
          marginRight: '4%',
          backgroundColor:
            DynamicAppStyles.colorSet[this.COLOR_SCHEME].mainTextColor,
          height: 1,
        }}
      />
    );
  };

  render() {
    styles = preStyles(this.props.screenProps.theme);

    const emptyStateConfig = {
      title: IMLocalized('No Orders'),
      description: IMLocalized(
        'No orders yet. Try our quick and hassle-free delivery here!',
      ),
      buttonName: 'Orders',
      onPress: () => {
        this.props.navigation.navigate('CategoryList');
      },
    };
    return (
      <FlatList
        style={styles.flat}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={this.renderSeparator}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={DynamicAppStyles}
            />
          </View>
        )}
        initialNumToRender={5}
      />
    );
  }
}

OrderListScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    router: PropTypes.any,
  }),
};

// export default CartScreen;
const mapStateToProps = state => ({
  settings: state.settings,
  user: state.auth.user,
  orderList: state.orders.orderList,
});

export default connect(mapStateToProps, {
  overrideCart,
  overrideRx,
  setCartVendor,
  updateOrders,
})(OrderListScreen);
