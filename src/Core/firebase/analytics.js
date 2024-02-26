import {Platform} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {PWD_MULTIPLIER, PWD_DISCOUNTABLE_TAGS} from '../../Configuration';
import {AppEventsLogger} from 'react-native-fbsdk';
import {TouchableNativeFeedbackComponent} from 'react-native';

const instance = analytics();

// Make simplified versions of select events
// which need some custom, non-trivial handling

const getAnalyticsItem = (item, isUserDiscountVerified = false) => {
  const split = item.tags ? item.tags.split(',') : [];
  let price = item.price;
  if (isUserDiscountVerified && PWD_DISCOUNTABLE_TAGS.indexOf(item[2]) > -1) {
    price = item.price * PWD_MULTIPLIER;
  }
  return {
    item_id: item.id,
    item_name: item.name,
    item_price: price,
    item_category: split[0],
    item_category2: split[1],
    item_category3: split[2],
    item_category4: split[3],
  };
};

/**
 * @param cartItems - cartItems from redux
 * @param user - user from redux, including whether they have _any_ past orders (bool)
 * @param deliveryFee - delivery_fee (where applicable).
 *
 * Note we're only applying the deliveryFee to the cart value at two points: ViewCart
 * (supplied to the function separately) AND Purchase (built in to the `order` param).
 */

/** @param found {boolean} Whether any products were found */
const logSearch = (term, found = true) => {
  let eventName = 'EVENT_NAME_SEARCHED';
  let contentTypeParam = 'EVENT_PARAM_CONTENT_TYPE';
  let searchStringParam = 'EVENT_PARAM_SEARCH_STRING';
  let successParam = '';
  if (Platform.OS === 'ios') {
    eventName = 'FBSDKAppEventNameSearched';
    contentTypeParam = 'FBSDKAppEventParameterNameContentType';
    searchStringParam = 'FBSDKAppEventParameterNameSearchString';
    successParam = 'FBSDKAppEventParameterNameSuccess';
  }
  AppEventsLogger.logEvent(eventName, {
    [contentTypeParam]: 'product',
    [searchStringParam]: term,
    [successParam]: found ? 1 : 0,
  });
  return instance.logSearch({
    search_term: term,
  });
};
const logViewItem = (item, user) => {
  const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
  const p = anItem.item_price;
  delete anItem.item_price;

  let eventName = 'EVENT_NAME_VIEWED_CONTENT';
  let contentTypeParam = 'EVENT_PARAM_CONTENT_TYPE';
  let contentIdParam = 'EVENT_PARAM_CONTENT_ID';
  if (Platform.OS === 'ios') {
    eventName = 'FBSDKAppEventNameViewedContent';
    contentTypeParam = 'FBSDKAppEventParameterNameContentType';
    contentIdParam = 'FBSDKAppEventParameterNameContentID';
  }
  AppEventsLogger.logEvent(eventName, p, {
    [contentTypeParam]: 'product',
    [contentIdParam]: item.code,
  });
  return instance.logViewItem({
    currency: p && 'PHP',
    items: [anItem],
    value: p,
  });
};
const logAddToCart = (items, user) => {
  if (!(items instanceof Array)) {
    items = [items];
  }

  let eventName = 'EVENT_NAME_ADDED_TO_CART';
  let contentTypeParam = 'EVENT_PARAM_CONTENT_TYPE';
  let contentParam = 'EVENT_PARAM_CONTENT';
  if (Platform.OS === 'ios') {
    eventName = 'FBSDKAppEventNameAddedToCart';
    contentTypeParam = 'FBSDKAppEventParameterNameContentType';
    contentParam = 'FBSDKAppEventParameterNameContent';
  }

  let total = 0;
  const copy = items.map(item => {
    const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
    total = total + item.quantity * anItem.item_price;
    delete anItem.item_price;
    return anItem;
  });
  const fbContentValue = items.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  AppEventsLogger.logEvent(eventName, total, {
    [contentTypeParam]: 'product',
    [contentParam]: JSON.stringify(fbContentValue),
  });

  return instance.logAddToCart({
    currency: 'PHP',
    items: copy,
    value: total,
  });
};
const logRemoveFromCart = (item, user) => {
  const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
  const p = anItem.item_price;
  delete anItem.item_price;
  return instance.logRemoveFromCart({
    currency: 'PHP',
    items: [anItem],
    value: p,
  });
};
const logViewCart = (cartItems, user, deliveryFee) => {
  let total = 0;
  const copy = cartItems.map(item => {
    const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
    total = total + item.quantity * anItem.item_price;
    delete anItem.item_price;
    return anItem;
  });
  console.log('[Analytics] View Cart', copy, deliveryFee);
  return instance.logViewCart({
    currency: 'PHP',
    items: copy,
    value: total + deliveryFee,
  });
};
const logBeginCheckout = (cartItems, user) => {
  let total = 0;
  const copy = cartItems.map(item => {
    const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
    total = total + item.quantity * anItem.item_price;
    delete anItem.item_price;
    return anItem;
  });

  let eventName = 'EVENT_NAME_INITIATED_CHECKOUT';
  let contentTypeParam = 'EVENT_PARAM_CONTENT_TYPE';
  let numItemsParam = 'EVENT_PARAM_NUM_ITEMS';
  let currencyParam = 'EVENT_PARAM_CURRENCY';
  if (Platform.OS === 'ios') {
    eventName = 'FBSDKAppEventNameInitiatedCheckout';
    contentTypeParam = 'FBSDKAppEventParameterNameContentType';
    numItemsParam = 'FBSDKAppEventParameterNameNumItems';
    currencyParam = 'FBSDKAppEventParameterNameCurrency';
  }
  AppEventsLogger.logEvent(eventName, {
    [contentTypeParam]: 'product_group',
    [numItemsParam]: cartItems.length,
    [currencyParam]: 'PHP',
  });
  console.log('[Analytics] Checkout', copy);
  return instance.logBeginCheckout({
    currency: 'PHP',
    items: copy,
    value: total,
  });
};
const logPurchase = (order, user) => {
  let total = 0;
  const copy = order.products.map(item => {
    const anItem = getAnalyticsItem(item, user.discountVerified === 'APPROVED');
    total = total + item.quantity * item.price; // Discounts are applied to the cart item!
    delete anItem.item_price;
    return anItem;
  });
  console.log('[Analytics] Purchase', copy);

  let contentParam = 'EVENT_PARAM_CONTENT';
  let currencyParam = 'EVENT_PARAM_CURRENCY';
  if (Platform.OS === 'ios') {
    contentParam = 'FBSDKAppEventParameterNameContent';
    currencyParam = 'FBSDKAppEventParameterNameCurrency';
  }
  const fbContentValue = order.products.map(item => ({
    id: item.code,
    quantity: item.quantity,
  }));
  AppEventsLogger.logPurchase(total, 'PHP', {
    [contentParam]: JSON.stringify(fbContentValue),
    [currencyParam]: 'PHP',
  });
  return instance.logPurchase({
    currency: 'PHP',
    items: copy,
    value: total + order.deliveryFee,
  });
};

export {
  instance,
  logSearch,
  logViewItem,
  logAddToCart,
  logRemoveFromCart,
  logViewCart,
  logBeginCheckout,
  logPurchase,
};
