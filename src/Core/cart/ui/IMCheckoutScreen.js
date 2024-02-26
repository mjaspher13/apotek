import React, {useState} from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from 'react-native-button';
import {useSelector, useDispatch} from 'react-redux';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';

import {logPurchase} from '../../firebase/analytics';
import CartAPIManager from '../api/CartAPIManager';
import {overrideCart, overrideRx} from '../redux/actions';
import {setUserData} from '../../onboarding/redux/auth';
import {setShippingAddress} from '../../payment/redux/checkout';
import dynamicStyles from './styles';
import {IMPlacingOrderModal} from '../../delivery/IMPlacingOrderModal/IMPlacingOrderModal';
import {IMLocalized} from '../../localization/IMLocalization';
import {
  DELIVERY_FEE,
  PWD_DISCOUNTABLE_TAGS,
  PWD_DISCOUNTABLE_CATEGORIES,
  PWD_MULTIPLIER,
  TARGET_PAYMENT_STATUS,
} from '../../../Configuration.js';

function IMCheckoutScreen(props) {
  const apiManager = new CartAPIManager();
  const appStyles = props.navigation.state.params.appStyles;
  const appConfig = props.navigation.state.params.appConfig;

  const currentUser = useSelector(state => state.auth.user);
  const cartVendor = useSelector(state => state.cart.vendor);

  const [placeOrderVisible, setPlaceOrderVisible] = useState(false);
  const [checkoutDisabled, setCheckoutDisabled] = useState(false);
  const [paymentCloseVisible, setPaymentCloseVisible] = useState(true);

  const styles = dynamicStyles(appStyles, props.screenProps.theme);
  const [isVisible, setVisible] = useState(false);
  const [webviewAddress, setWebview] = useState('');
  const {shippingAddress} = props;

  const rxFromCart = props.cartItems
    .filter(item => item.classification === 'RX' && item.prescription)
    .map(item => item.prescription);
  const rxFromExtra = props.prescriptions;
  const prescriptions = rxFromCart.concat(...rxFromExtra);
  const itemCounts = props.cartItems.reduce(
    (prev, next) => prev + next.quantity,
    0,
  );

  let pwdMultiplier = 1; // No discount by default
  if (props.user.discountVerified === 'APPROVED') {
    pwdMultiplier = PWD_MULTIPLIER;
  }
  const discountableTags = props.settings.pwd_discountable_tags
    ? props.settings.pwd_discountable_tags.value.split(',')
    : PWD_DISCOUNTABLE_TAGS;
  const itemTotal = props.cartItems.reduce((prev, next) => {
    const split = next.tags ? next.tags.split(',') : [];
    if (
      discountableTags.indexOf(split[1]) > -1 ||
      discountableTags.indexOf(split[2]) > -1
    ) {
      return prev + next.price * next.quantity * pwdMultiplier;
    }
    return prev + next.price * next.quantity;
  }, 0);

  const {delivery_fee, first_delivery_free} = props.settings;
  let delivery = delivery_fee ? delivery_fee.value : DELIVERY_FEE;
  if (delivery_fee && delivery_fee.value !== 0) {
    if (first_delivery_free?.value && !currentUser.hasPastOrder) {
      delivery = 0;
    }
  }

  const onPaymentSuccess = payment => {
    setPlaceOrderVisible(true);

    return apiManager
      .placeOrder(
        props.cartItems.map(item => {
          // Final: Apply discount to price here!
          const split = item.tags ? item.tags.split(',') : [];
          const isDiscounted =
            props.user.discountVerified === 'APPROVED' &&
            (discountableTags.indexOf(split[1]) > -1 ||
              discountableTags.indexOf(split[2]) > -1);
          item.price = isDiscounted ? item.price * pwdMultiplier : item.price;
          item.discounted = isDiscounted;
          return item;
        }),
        currentUser,
        shippingAddress,
        cartVendor,
        prescriptions,
        payment,
        delivery,
        finalOrder => {
          logPurchase(finalOrder, props.user, props.settings);

          setTimeout(() => {
            setPlaceOrderVisible(false);
            props.overrideCart([], props.user);
            props.overrideRx([], props.user);
            props.navigation.navigate('Home');
          }, 3000);

          if (!props.user.hasPastOrder) {
            props.setUserData({
              user: {
                ...props.user,
                hasPastOrder: true,
                showFDF: false,
              },
            });
          }
        },
      )
      .catch(() => {
        Alert.alert(
          '',
          IMLocalized(
            'Sorry, something went wrong while placing your order. Please try again later.',
          ),
          [{text: IMLocalized('OK')}],
          {
            cancelable: false,
          },
        );
      });
  };

  const dismissWebview = () => {
    setWebview('');
    setCheckoutDisabled(false);
  };

  const placeOrder = async () => {
    setCheckoutDisabled(true);
    try {
      if (props.selectedPaymentMethod.key === 'COD') {
        return onPaymentSuccess({
          reference: 'COD',
          method: 'COD',
        });
      }

      const paymentResponse = await apiManager.chargeCustomer({
        customer: currentUser,
        currency: 'PHP',
        source: props.selectedPaymentMethod,
        amount: itemTotal + delivery,
        appConfig,
        onPaymentUpdate: doc => {
          if (doc?.status === TARGET_PAYMENT_STATUS) {
            dismissWebview();
            doc.method = props.selectedPaymentMethod.last4;
            onPaymentSuccess(doc);
          } else {
            alert(IMLocalized('Transaction failed, please try again'));
            setCheckoutDisabled(false);
          }
        },
      });

      setWebview(paymentResponse.redirect_url || '');
      return;
    } catch (err) {
      setCheckoutDisabled(false);
      Alert.alert(
        '',
        IMLocalized(
          'Sorry, something went wrong while processing your payment. Please try again later.',
        ),
        [{text: IMLocalized('OK')}],
        {
          cancelable: false,
        },
      );
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.checkoutTitle}>{IMLocalized('Checkout')}</Text>
      {placeOrderVisible && (
        <IMPlacingOrderModal
          appStyles={appStyles}
          onCancel={() => setPlaceOrderVisible(false)}
          cartItems={props.cartItems}
          shippingAddress={shippingAddress}
          isVisible={placeOrderVisible}
          user={currentUser}
        />
      )}
      <View style={styles.enclosing}>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTile}>{IMLocalized('Payment')}</Text>
          <TouchableWithoutFeedback
            onPress={() => props.navigation.navigate('Cards', {appStyles})}>
            <Text style={styles.options}>
              {props.selectedPaymentMethod.last4}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTile}>{IMLocalized('Recipient')}</Text>
          <TouchableWithoutFeedback>
            <Text onPress={() => setVisible(true)} style={styles.options}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTile}>{IMLocalized('Deliver to')}</Text>
          <TouchableWithoutFeedback>
            <Text onPress={() => setVisible(true)} style={styles.options}>
              {shippingAddress.length === 0
                ? IMLocalized('Select Address')
                : `${shippingAddress.line1} ${shippingAddress.line2}, ${shippingAddress.city}`}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionTile}>
            {IMLocalized('Total')} ({itemCounts} Items)
          </Text>
          <TouchableWithoutFeedback>
            <Text style={styles.options}>
              ₱{(itemTotal + delivery).toFixed(2)}
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <Modal
        style={{
          marginTop: Platform.OS === 'ios' ? 40 : undefined,
          backgroundColor: 'white',
        }}
        isVisible={webviewAddress.length > 0}
        animationType="slide"
        onDismiss={dismissWebview}
        onBackdropPress={dismissWebview}
        onRequestClose={dismissWebview}>
        <Button
          containerStyle={{
            ...styles.close,
          }}
          style={{fontWeight: 'bold'}}
          onPress={dismissWebview}
          title="Close">
          ✕
        </Button>
        <WebView
          style={{
            flex: 0.95,
          }}
          onMessage={event => {
            // This flow is for Paymongo CC only
            setCheckoutDisabled(false);
            try {
              const decoded = JSON.parse(event.nativeEvent.data);
              if (decoded.status === TARGET_PAYMENT_STATUS) {
                // COMPLETED FLOW (for credit card only)
                setTimeout(() => {
                  dismissWebview();
                  onPaymentSuccess({
                    reference: decoded.ref,
                    status: decoded.status,
                  });
                }, 3000);
              }
            } catch (err) {
              alert(IMLocalized('Transaction failed, please try again.'));
            }
          }}
          source={{uri: webviewAddress}}
        />
      </Modal>

      <Button
        disabled={checkoutDisabled}
        containerStyle={{
          ...styles.actionButtonContainer,
          backgroundColor: checkoutDisabled
            ? 'gray'
            : styles.actionButtonContainer.backgroundColor,
        }}
        onPress={() => placeOrder()}
        style={styles.actionButtonText}>
        {checkoutDisabled ? 'Loading payment...' : 'CONFIRM ORDER'}
      </Button>
    </View>
  );
}

IMCheckoutScreen.navigationOptions = {
  headerRight: () => <View />,
};

const mapStateToProps = state => ({
  settings: state.settings,
  cartItems: state.cart.cartItems,
  prescriptions: state.cart.prescriptions,
  user: state.auth.user,
  selectedPaymentMethod: state.checkout.selectedPaymentMethod,
  shippingAddress: state.checkout.shippingAddress,
});

export default connect(mapStateToProps, {
  overrideCart,
  overrideRx,
  setShippingAddress,
  setUserData,
})(IMCheckoutScreen);
