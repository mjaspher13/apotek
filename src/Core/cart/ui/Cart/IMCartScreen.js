import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BackHandler} from 'react-native';
import Button from 'react-native-button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import {
  removeFromCart,
  overrideCart,
  overrideRx,
  addPrescription,
  updateCart,
} from '../../redux/actions';
import {IMLocalized} from '../../../localization/IMLocalization';
import {TNEmptyStateView} from '../../../truly-native';
import EditCartModal from '../../components/EditCartModal/IMEditCartModal';
import {storeCartToDisk} from '../../redux/reducers';
import {
  DELIVERY_FEE,
  PWD_DISCOUNTABLE_TAGS,
  PWD_DISCOUNTABLE_CATEGORIES,
  PWD_MULTIPLIER,
} from '../../../../Configuration.js';
import {logViewCart, logRemoveFromCart} from '../../../firebase/analytics';

// Image upload
import {firebaseStorage} from '../../../firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as imageHelper from '../../../helpers/imagePermissions';

const getPermissionAsync = imageHelper.getPermissionAsync;

class CartScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: IMLocalized('Your Cart'),
    headerRight: () => <View />,
  });

  constructor(props) {
    super(props);

    const rxFromCart = props.cartItems
      .filter(item => item.classification === 'RX' && item.prescription)
      .map(item => item.prescription);
    const rxFromExtra = props.prescriptions;

    let pwdMultiplier = 1; // No discount by default
    if (this.props.user.discountVerified === 'APPROVED') {
      pwdMultiplier = PWD_MULTIPLIER;
    }

    this.state = {
      item: {},
      previewImageContainer: null,
      loadingOverlay: false,
      prescriptions: rxFromCart.concat(rxFromExtra),
      isVisible: false,
      id: 0,
      placeOrderVisible: false,
      pwdMultiplier,
      discountableTags: props.settings.pwd_discountable_tags
        ? props.settings.pwd_discountable_tags.value.split(',')
        : PWD_DISCOUNTABLE_TAGS,
    };

    this.didFocusSubscription = props.navigation.addListener('didFocus', () =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      ),
    );

    // Used for Analytics, not for rendering
    const {delivery_fee, first_delivery_free} = this.props.settings;
    let delivery = delivery_fee ? delivery_fee.value : DELIVERY_FEE;
    if (delivery_fee && delivery_fee.value !== 0) {
      // Since global free delivery isn't available,
      // check if first_delivery_free AND hasPastOrder === 0
      if (first_delivery_free?.value && !this.props.user.hasPastOrder) {
        // Override to free delivery!
        delivery = 0;
      }
    }
    logViewCart(props.cartItems, props.user, delivery);
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        );
      },
    );
  }

  componentWillUnmount() {
    this.willBlurSubscription.remove();
    this.didFocusSubscription.remove();
  }

  componentDidUpdate(prevProps) {
    // May need to update pwd multiplier
    if (prevProps.user.discountVerified !== this.props.user.discountVerified) {
      this.setState({
        pwdMultiplier:
          this.props.user.discountVerified === 'APPROVED' ? PWD_MULTIPLIER : 1,
      });
    }
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.pop();

    return true;
  };

  renderFooter = () => {
    const {delivery_fee, first_delivery_free} = this.props.settings;
    let delivery = delivery_fee ? delivery_fee.value : DELIVERY_FEE;
    if (delivery_fee && delivery_fee.value !== 0) {
      if (first_delivery_free?.value && !this.props.user.hasPastOrder) {
        delivery = 0;
      }
    }
    const {discountableTags} = this.state;
    const itemTotal = this.props.cartItems.reduce((prev, next) => {
      const split = next.tags ? next.tags.split(',') : [];
      if (
        this.props.user.discountVerified === 'APPROVED' &&
        (discountableTags.indexOf(split[1]) > -1 ||
          discountableTags.indexOf(split[2]) > -1)
      ) {
        return prev + next.price * next.quantity * this.state.pwdMultiplier;
      }
      return prev + next.price * next.quantity;
    }, 0);

    const {navigation} = this.props;
    const appStyles = navigation.getParam('appStyles', {});
    const styles = dynamicStyles(appStyles, this.props.screenProps.theme);
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{IMLocalized('Delivery Fee')}</Text>
          <Text style={styles.price}>₱{delivery.toFixed(2)}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{IMLocalized('Total')}</Text>
          <Text style={styles.price}>₱{(itemTotal + delivery).toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  onItemPress = (item, id) => {
    this.setState({id});
    this.setState({item});
    this.setState({isVisible: true});
    return;
  };

  onPress = () => {
    const {navigation} = this.props;
    const appStyles = navigation.getParam('appStyles', {});
    const appConfig = navigation.getParam('appConfig', {});
    navigation.navigate('AddAddress', {appStyles, appConfig});
    return;
  };

  goToProfile = () => {
    const {navigation} = this.props;
    const appStyles = navigation.getParam('appStyles', {});
    const appConfig = navigation.getParam('appConfig', {});
    navigation.navigate('AccountDetail', {
      appStyles,
      appConfig,
      form: appConfig.editProfileFields,
      screenTitle: IMLocalized('Edit Profile'),
    });
    return;
  };

  renderItem = ({item}) => {
    const {navigation} = this.props;
    const appStyles = navigation.getParam('appStyles', {});
    const styles = dynamicStyles(appStyles, this.props.screenProps.theme);
    const {discountVerified} = this.props.user;
    const split = item.tags ? item.tags.split(',') : [];
    const {discountableTags} = this.state;
    const isDiscounted =
      discountVerified === 'APPROVED' &&
      (discountableTags.indexOf(split[1]) > -1 ||
        discountableTags.indexOf(split[2]) > -1);
    const price = (
      item.quantity *
      item.price *
      (isDiscounted ? this.state.pwdMultiplier : 1)
    ).toFixed(2);

    // const isDiscounted = true;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.onItemPress(item)}
        style={styles.container}>
        <View style={styles.rowContainer} key={item.id}>
          {item.classification === 'RX' ? (
            <FastImage
              style={[styles.attachment, {color: undefined}]}
              source={appStyles.iconSet.rx}
              tintColor={appStyles.colorSet.mainThemeForegroundColor}
            />
          ) : (
            <View style={styles.attachment} />
          )}
          <Text style={styles.count}>{item.quantity}</Text>
          <Text style={styles.title}>{item.name}</Text>
          {isDiscounted && (
            <Text style={[styles.price, styles.originalPrice]}>
              P{item.price.toFixed(2)} &nbsp;
            </Text>
          )}
          <Text
            style={[
              styles.price,
              isDiscounted ? styles.discounted : null,
              {
                width: 'auto',
              },
            ]}>
            ₱{price}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  previewRx(prescription) {
    this.setState({
      previewImage: prescription,
    });
  }

  renderPrescriptionListItem(prescription, i) {
    const {navigation} = this.props;
    const appStyles = navigation.getParam('appStyles', {});
    const styles = dynamicStyles(appStyles, this.props.screenProps.theme);
    return (
      <TouchableOpacity
        style={styles.rxListItem}
        onPress={() => {
          this.previewRx(prescription);
        }}>
        <FastImage
          source={appStyles.iconSet.attachment}
          style={styles.rxListIcon}
        />
        <Text key={prescription} style={styles.rxListText}>
          Image {i + 1}
        </Text>
      </TouchableOpacity>
    );
  }

  async attachPrescription() {
    // Copied from SingleItemDetailScreen lol
    const allowed = await getPermissionAsync();
    if (!allowed) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync(imageHelper.options);

    if (!result.cancelled) {
      this.setState({
        loadingOverlay: true,
      });
      firebaseStorage
        .uploadImage(result.uri)
        .then(response => {
          this.props.addPrescription(response.downloadURL);
          this.setState({
            loadingOverlay: false,
            prescriptions: [...this.state.prescriptions, response.downloadURL],
          });
        })
        .catch(err => {
          console.log('UPLOAD ERROR', err);
          this.setState({
            loadingOverlay: false,
          });
          Alert.alert(
            '',
            IMLocalized(
              'Sorry, something went wrong while uploading your prescription. Please try again later.',
            ),
            [{text: IMLocalized('OK')}],
            {
              cancelable: false,
            },
          );
        });
    } else {
      console.log('Image Picker: Cancelled?', result);
    }
  }

  closePreview(e) {
    this.setState({previewImage: null});
  }

  render() {
    const {item, isVisible, id, placeOrderVisible} = this.state;
    const {navigation, cartItems, user} = this.props;
    const {prescriptions} = this.state;
    const appStyles = navigation.getParam('appStyles', {});
    const styles = dynamicStyles(appStyles, this.props.screenProps.theme);
    const emptyStateConfig = {
      title: IMLocalized('Empty Cart'),
      description: IMLocalized(
        'Your cart is currently empty. The food items you add to your cart will show up here.',
      ),
    };
    const hasRx = cartItems.reduce(
      (prev, item) => prev || item.classification === 'RX',
      false,
    );
    let discountText;
    const {discountID, discountVerified} = this.props.user;
    if (discountID?.length) {
      if (discountVerified === 'APPROVED') {
        discountText = (
          <Text style={styles.discountNotice}>
            Your Senior/PWD ID discounts have been applied.
          </Text>
        );
      } else if (discountVerified === 'PENDING') {
        discountText = (
          <Text style={styles.discountNotice}>
            Your Senior/PWD ID is still waiting for verification.
          </Text>
        );
      } else if (discountVerified === 'REJECTED') {
        discountText = (
          <Text style={styles.discountNotice}>
            The ID you uploaded was rejected; no discounts are applied. You can
            upload a different ID in the Profile section.
          </Text>
        );
      }
    } else {
      discountText = (
        <View>
          <Text style={styles.discountNotice}>
            You can add a Senior/PWD ID in the profile screen. Click the button
            below to go there now.
          </Text>
          <Button
            containerStyle={styles.discountGoContainer}
            style={styles.discountGoText}
            onPress={this.goToProfile}>
            Go To Profile
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.state.loadingOverlay && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}

        <EditCartModal
          item={item}
          id={id}
          style={styles}
          appStyles={appStyles}
          close={() => this.setState({isVisible: false})}
          deleteCart={() => {
            this.setState({isVisible: false});
            this.props.removeFromCart(item, this.props.user);
            logRemoveFromCart(item, this.props.user);
          }}
          updateCart={(newCartItem, newCartid, user) =>
            this.props.updateCart(newCartItem, newCartid, user)
          }
          isVisible={isVisible}
          onModalHide={async () =>
            storeCartToDisk(
              this.props.cartItems,
              this.props.cartVendor,
              this.props.prescriptions,
              this.props.user.id,
            )
          }
          user={this.props.user}
        />
        {this.props.cartItems.length > 0 && (
          <FlatList
            style={styles.flat}
            data={this.props.cartItems}
            renderItem={this.renderItem}
            keyExtractor={singleCartItem => `${singleCartItem.id}`}
            ListFooterComponent={this.renderFooter}
          />
        )}
        {this.props.cartItems.length === 0 && (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={appStyles}
            />
          </View>
        )}
        {hasRx && (
          <View style={styles.rxListContainer}>
            <Text style={styles.rxListHeader}>Attached Prescriptions:</Text>
            {prescriptions.map((p, i) => this.renderPrescriptionListItem(p, i))}
          </View>
        )}
        {hasRx ? (
          <Button
            disabled={this.state.loadingOverlay}
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => this.attachPrescription()}>
            {IMLocalized('Attach Prescription')}
          </Button>
        ) : null}
        {this.props.cartItems.length > 0 && discountText}
        {this.props.cartItems.length > 0 && (
          <Button
            disabled={this.state.loadingOverlay}
            containerStyle={styles.actionButtonContainer}
            style={styles.actionButtonText}
            onPress={() => this.onPress()}>
            {IMLocalized('CHECKOUT')}
          </Button>
        )}
        {this.state.previewImage && (
          <View style={styles.previewImageContainer2} />
        )}
        {this.state.previewImage && (
          <TouchableWithoutFeedback
            style={styles.previewImageContainer}
            onPress={() => this.closePreview()}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              }}>
              <FastImage
                source={{uri: this.state.previewImage}}
                style={styles.previewImage}
              />
              <Text
                onPress={() => this.closePreview()}
                style={styles.previewInstructions}>
                Tap to close
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

CartScreen.propTypes = {
  user: PropTypes.shape(),
  cartItems: PropTypes.array,
  prescriptions: PropTypes.array,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = state => ({
  settings: state.settings,
  cartItems: state.cart.cartItems,
  prescriptions: state.cart.prescriptions,
  cartVendor: state.cart.vendor,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  removeFromCart,
  addPrescription,
  overrideCart,
  overrideRx,
  updateCart,
})(CartScreen);
