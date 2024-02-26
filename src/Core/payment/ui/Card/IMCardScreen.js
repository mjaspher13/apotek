import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import { connect, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import {Appearance} from 'react-native-appearance';
import stripe from 'tipsi-stripe';
import {stripeDataManager} from '../../api/index';
import {
  updateUserPaymentMethods,
  savePaymentSource,
  subscribePaymentMethods,
} from '../../../firebase/paymentMethods';
import {
  updatePaymentMethods,
  removePaymentMethod,
  setSelectedPaymentMethod,
} from '../../redux/checkout';
import dynamicStyles from './styles';
import Button from 'react-native-button';
import {IMLocalized} from '../../../localization/IMLocalization';

const COLOR_SCHEME = Appearance.getColorScheme();

function CardScreen(props) {
  const appStyles = props.navigation.getParam('appStyles', {});
  const appConfig = props.navigation.getParam('appConfig', {});

  const currentUser = useSelector((state) => state.auth.user);
  const shippingAddress = useSelector((state) => state.checkout.shippingAddress);
  const options = {
    requiredBillingAddressFields: 'full',
    prefilledInformation: {
      billingAddress: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        line1: `${shippingAddress.line1}`,
        line2: `${shippingAddress.line2}`,
        city: `${shippingAddress.city}`,
        state: `${shippingAddress.state}`,
        country: `${shippingAddress.country}`,
        postalCode: `${shippingAddress.postalCode}`,
      },
    },
  };

  const options1 = {
    requiredBillingAddressFields: ['all'],
    billing_address_required: true,
    total_price: '50',
    currency_code: 'USD',
    shipping_countries: ['US', 'CA'], //android
    line_items: [
      {
        currency_code: 'USD',
        description: 'Pay Shopertino, Inc',
        unit_price: '10',
        total_price: '50',
        // total_price: "0.1",
        // unit_price: `0.1`,
        quantity: '5',
      },
    ],
    shippingMethods: 'DHL',
  };
  const styles = dynamicStyles(appStyles, props.screenProps.theme);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(0);
  const nativePay = async () => {
    const items = [
      {
        label: 'Shopertino, Inc',
        amount: '$50',
      },
    ];
    const token = await stripe.paymentRequestWithNativePay(options1, items);
    addToken(token);
  };

  const cardPay = async () => {
    const token = await stripe.paymentRequestWithCardForm(options);
    addToken(token);
  };

  const addToken = async token => {
    if (token) {
      const source = await stripeDataManager.addNewPaymentSource(
        props.user.stripeCustomer,
        token.tokenId,
      );

      onUpdatePaymentMethod(token, source);
    }
  };

  const onUpdatePaymentMethod = (token, source) => {
    onFirebaseUpdatePaymentMethod(token, source);
  };

  const onFirebaseUpdatePaymentMethod = async (token, source) => {
    const {user} = props;

    if (source.success && source.data.response) {
      await updateUserPaymentMethods({
        ownerId: user.id,
        card: token.card,
      });
      await savePaymentSource(user.id, source.data.response);
    } else {
      console.log(source);
      alert('An error occured, please try again.');
    }
  };

  const subscribeFirebasePaymentMethods = () => {
    const unsubscribePaymentMethods = subscribePaymentMethods(
      props.user.id,
      setPaymentMethods,
    );
    return unsubscribePaymentMethods;
  };

  const setPaymentMethods = methods => {
    props.updatePaymentMethods(methods);
  };

  // useEffect(() => {
  //   subscribeFirebasePaymentMethods();
  // }, [subscribeFirebasePaymentMethods]);

  const renderItem = (
    imgSource,
    text,
    onPress,
    tintColor = appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
  ) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.itemContainer}>
          <FastImage
            tintColor={tintColor}
            style={styles.visaIcon}
            source={imgSource}
          />
          <Text style={styles.cardText}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPaymentMethodPress = (index, item) => {

    setSelectedMethodIndex(index);
    props.setSelectedPaymentMethod(item);
  };

  const renderCard = (item, index) => {
    return (
      <View key={index}>
        <TouchableOpacity onPress={() => onPaymentMethodPress(index, item)}>
          <View style={styles.itemContainer}>
            <FastImage style={styles.tick} source={item.iconSource} />
            <Text style={styles.cardText}>{item.title}</Text>
            {index === selectedMethodIndex && (
              <FastImage
                source={require('../../../../CoreAssets/tick.png')}
                tintColor={
                  appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor
                }
                style={styles.tick}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FastImage
        source={require('../../../../CoreAssets/cardimage.png')}
        style={styles.cardImage}
        resizeMode="contain"
        tintColor={appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor}
      />
      <View style={styles.line} />
      {/*/renderNativePayButton()*/}
      {props.paymentMethods.map((item, index) => renderCard(item, index))}
      <View style={styles.line} />
      {/* renderItem(
        require('../../../../CoreAssets/add.png'),
        IMLocalized('Add new card'),
        cardPay,
      ) */}
      <Button
        containerStyle={styles.actionButtonContainer}
        onPress={() =>
          props.navigation.navigate('Checkout', {appStyles, appConfig})
        }
        style={styles.actionButtonText}>
        {IMLocalized('PROCEED')}
      </Button>
    </View>
  );
}

CardScreen.navigationOptions = {
  headerRight: () => <View />,
};

const mapStateToProps = ({auth, checkout}) => ({
  user: auth.user,
  cardNumbersEnding: checkout.cardNumbersEnding,
  paymentMethods: checkout.paymentMethods,
});

export default connect(mapStateToProps, {
  updatePaymentMethods,
  removePaymentMethod,
  setSelectedPaymentMethod,
})(CardScreen);
