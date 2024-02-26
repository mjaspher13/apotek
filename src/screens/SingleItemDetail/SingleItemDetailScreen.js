import React, {useRef} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Badge} from 'react-native-elements';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import preStyles from './styles';
import DynamicAppStyles from '../../DynamicAppStyles';
import {
  addToCart,
  updateCart,
  setCartVendor,
} from '../../Core/cart/redux/actions';
import {Appearance} from 'react-native-appearance';
import {firebase} from '../../Core/firebase/config';
import {firebaseStorage} from '../../Core/firebase/storage';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import {storeCartToDisk} from '../../Core/cart/redux/reducers';
import {
  LOW_STOCK_THRESHOLD,
  VENDOR_PRODUCTS,
  VENDOR,
} from '../../Configuration';
import AppConfig from '../../SingleVendorAppConfig';
import {logAddToCart, logViewItem} from '../../Core/firebase/analytics';
import ImagePreview from './ImagePreview';
import imagePermissions from '../../Core/helpers/imagePermissions';

let styles;

const getPermissionAsync = imagePermissions.getPermissionAsync;

class SingleItemDetail extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title:
      typeof navigation.state.params === 'undefined' ||
      typeof navigation.state.params.item === 'undefined'
        ? IMLocalized('Food')
        : navigation.state.params.item.name,
  });

  constructor(props) {
    super(props);
    const {isGuest} = props.navigation.state.params || {};
    console.log('SingelItemDetailScreen: isGuest?', isGuest);

    this.COLOR_SCHEME = Appearance.getColorScheme();

    const {navigation, foodItem} = props;
    const item = foodItem || props.navigation.getParam('item');

    this.ref =
      firebase
        .firestore()
        .collection(VENDOR_PRODUCTS)
        .doc(item.id);
    this.vendorRef = null;

    this.state = {
      prescription: null,
      showPrescription: false,
      minimumToAdd: 1,
      uploading: false,
      product: {},
      // TODO - Initial quantity set to min. required quantity
      // TODO - detect if already in cart, then can add LESS than the min. required here
      quantity: 1,
      photo: item.photo,
      loading: true,
      itemAlreadyInCart: {},
      indexAlreadyInCart: -1,
      vendor: props.vendor || null,
    };

    logViewItem(item, props.user);
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onDocUpdate);
    this.unsubscribeVendor = null;
    this.checkAlreadyAdded();
  }

  componentWillUnmount() {
    this.unsubscribe();
    // this.unsubscribeVendor && this.unsubscribeVendor();
  }

  onDocUpdate = doc => {
    const params = this.props.navigation.state.params;
    const data = doc.data();
    const {company} = this.props.user;
    if (company != undefined && data[company]) {
      data.price = data[company];
    } else {
      data.price = data.retail; // TODO - better default
    }

    // We only need to load it once, just get it instead of using onSnapshot
    if (this.vendorRef == null) {
      this.vendorRef = firebase
        .firestore()
        .collection(VENDOR)
        .doc(data.vendorID)
        .get()
        .then(vendor => {
          this.setState({
            vendor: vendor.data(),
          });
        });
    }

    this.setState({
      product: data,
    });
  };

  onIncrease = () => {
    if (this.state.quantity < this.state.product.stock) {
      this.setState(prevState => ({quantity: prevState.quantity + 1}));
    }
  };

  onDecrease = () => {
    if (this.state.quantity > this.state.product.minimumOrderQuantity) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}));
    }
  };

  onAddPrescription = async () => {
    const {isGuest} = this.props.navigation.state.params || {};
    if (isGuest) {
      // Same as Add To Cart
      this.props.close();
      this.props.navigation.push('Login', {
        appStyles: DynamicAppStyles,
        appConfig: AppConfig,
      });
      return;
    }

    // From TNProfilePictureSelector
    const options = imagePermissions.options;
    const allowed = await getPermissionAsync();
    if (!allowed) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.cancelled) {
      this.setState({
        uploading: true,
      });
      firebaseStorage
        .uploadImage(result.uri)
        .then(response => {
          this.setState({
            uploading: false,
            prescription: response.downloadURL,
          });
        })
        .catch(err => {
          console.error('UPLOAD ERROR', err);
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
  };

  onViewPrescription = () => {
    this.setState({
      showPrescription: !this.state.showPrescription,
    });
  };

  onAddToCart = () => {
    const {user, navigation} = this.props;
    const {isGuest} = navigation.state.params || {};
    console.log('SingleItemDetailScreen: onAddToCart', isGuest);
    if (isGuest) {
      this.props.close();
      navigation.push('Login', {
        appStyles: DynamicAppStyles,
        appConfig: AppConfig,
      });
      return;
    }

    logAddToCart(
      {
        ...this.state.product,
        quantity: this.state.quantity,
      },
      user,
      this.props.settings,
    );
    if (this.state.indexAlreadyInCart !== -1) {
      let tempCart = this.state.itemAlreadyInCart;
      tempCart.prescription = tempCart.prescription || this.state.prescription;
      tempCart.quantity = this.state.quantity + tempCart.quantity;
      this.props.updateCart(tempCart, this.state.added, user);
      this.props.setCartVendor(this.state.vendor, user); // Use new vendor state, retrieved from item vendorID
      storeCartToDisk(
        this.props.cartItems,
        this.state.vendor,
        this.props.prescriptions,
        user.id,
      );
      this.props.close();
      return;
    }
    const item = {
      ...this.state.product,
      quantity: this.state.quantity,
      prescription: this.state.prescription,
    };
    const len = this.props.cartItems.length;
    if (
      false
    ) {
       

      // CUSTOM ALERT BEHAVIOR
      alert(
        'Alert',
        IMLocalized("You're trying to add an item from a different vendor"),
        [
          {
            text: 'Clear All',
            onPress: () => {
              this.props.overrideCart([item]);
              this.props.setCartVendor(this.props.vendor, this.props.user);
              storeCartToDisk(
                this.props.cartItems,
                this.props.vendor,
                this.props.prescriptions,
                this.props.user.id,
              );
              this.props.close();
              alert(
                'Your cart has been cleared and the new item has been added.',
              );
            },
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
      return;
    }
    this.props.addToCart(
      {
        ...item,
        prescription: this.state.prescription,
      },
      user.id,
    );
    this.props.setCartVendor(this.state.vendor, user);
    // storeCartToDisk(this.props.cartItems, this.state.vendor, this.props.prescriptions, this.props.user.id);
    this.props.close();
  };

  onPressItem = item => {
    this.setState({photo: item});
  };

  renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.onPressItem(item)}>
      <FastImage
        style={styles.detail}
        placeholderColor={DynamicAppStyles.colorSet[this.COLOR_SCHEME].grey9}
        source={{uri: item}}
      />
    </TouchableOpacity>
  );

  checkAlreadyAdded = () => {
    let {cartItems, foodItem} = this.props;
    foodItem = foodItem || this.props.navigation.getParam('item');
    const added = cartItems.findIndex(
      singleCartItem => singleCartItem.id === foodItem.id,
    );
    if (added !== -1) {
      this.setState({itemAlreadyInCart: cartItems[added]});
      this.setState({indexAlreadyInCart: added});
      // TODO - Check this!
      this.setState({
        prescription: cartItems[added].prescription,
        quantity: Math.max(
          foodItem.minimumOrderQuantity - cartItems[added].quantity,
          1,
        ),
        minimumToAdd: Math.max(
          foodItem.minimumOrderQuantity - cartItems[added].quantity,
          0,
        ),
      });
    } else {
      this.setState({
        indexAlreadyInCart: added,
        prescription: null,
        minimumToAdd: foodItem.minimumOrderQuantity,
        quantity: foodItem.minimumOrderQuantity,
      });
    }
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          width: 10,
          height: '100%',
        }}
      />
    );
  };

  render() {
    styles = preStyles(this.props.screenProps.theme);
    // Grammar stuff
    let {unitOfMeasure, packaging, quantityPerBox, minimumOrderQuantity} =
      this.state.product;
    switch (unitOfMeasure) {
      case 'TAB':
        unitOfMeasure = 'tablet(s)';
        break;
      case 'CAP':
        unitOfMeasure = 'capsule(s)';
        break;
      case 'BOX':
        unitOfMeasure = 'box(es)';
        break;
      case 'BOT':
        unitOfMeasure = 'bottle(s)';
        break;
      case 'AMP':
        unitOfMeasure = 'ampule(s)';
        break;
      case 'pack':
        unitOfMeasure = 'pack(s)';
        break;
    }
    packaging = packaging?.toLowerCase();
    if (packaging == 'bot') {
      packaging = 'bottle';
    }
    let packagingPlural = packaging;
    if (packagingPlural === 'box') {
      packagingPlural = 'boxes';
    } else {
      packagingPlural = packagingPlural + '(s)';
    }
    let packageContents;
    if (this.state.product.packaging == this.state.product.unitOfMeasure) {
      packageContents = `Contains ${quantityPerBox} ${packaging}.`;
    } else {
      packageContents = `Each ${packaging} contains ${quantityPerBox} ${unitOfMeasure}.`;
    }

    const addDisabled =
      this.state.quantity < this.state.minimumToAdd ||
      this.state.product.stock < 1 ||
      (this.state.product.classification === 'RX' &&
        this.state.prescription === null);
    // OKKKKK, so today I learned that you can't edit STYLE objects????
    // TODO - More research into WHY. Yeah the examples I've seen use this syntax:
    /*
      {
        ...style1,
        ...style2,
      }
    */
    const addStyle = Object.assign({}, styles.actionButtonContainer);
    if (addDisabled) {
      addStyle.backgroundColor = '#90919e';
    }

    const desc = this.state.product.description
      ? this.state.product.description.replace(/\\n/g, '\n')
      : '';
    // No cutoff for single item detail!

    // Actually the `initialState` uses LOW_STOCK_THRESHOLD as an initializer anyway so this "or" isn't necessary
    const lowStockThreshold =
      this.props.settings.low_stock_threshold?.value || LOW_STOCK_THRESHOLD;
    let photos = '';
    if (this.state.product.photos?.length) {
      photos = `${this.state.product.photo},${this.state.product.photos}`;
    } else {
      photos = this.state.product.photo || ''; // Default to at least the main
    }

    return (
      <ScrollView style={styles.container}>
        <View flexDirection="row" justifyContent="space-between">
          <Text style={styles.title}> {this.state.product.name} </Text>
          <Button
            style={styles.close}
            onPress={() => {
              this.props.close();
            }}
            title="Close">
            <Text style={styles.close}>✕</Text>
          </Button>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.setState({
              isPreviewing: true,
            });
          }}>
          <FastImage
            resizeMode="contain"
            source={{
              uri: this.state.photo,
            }}
            style={styles.photo}
          />
        </TouchableOpacity>

        <ImagePreview
          photo={this.state.photo}
          screenProps={this.props.screenProps}
          isVisible={this.state.isPreviewing}
          onPressItem={this.onPressItem}
          galleryPhotos={photos.split(',')}
          galleryIndex={photos.indexOf(this.state.photo)}
          onClose={() => {
            this.setState({
              isPreviewing: false,
            });
          }}
        />
        {this.state.product.photos?.length > 0 ? (
          <View style={styles.detailPhotos}>
            <FlatList
              style={styles.flat}
              horizontal
              ItemSeparatorComponent={this.renderSeparator}
              data={photos.split(',')}
              renderItem={this.renderItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `${item}`}
            />
          </View>
        ) : null}

        <Text style={styles.description}> {desc}</Text>
        <View style={styles.tagContainer}>
          {this.state.product.tags?.split(',').map(tag =>
            Platform.OS === 'ios' ? (
              <Text key={tag}>
                <Text
                  style={{
                    color: 'white',
                    backgroundColor: 'gray',
                    borderRadius: 12,
                  }}>
                  {tag}
                </Text>
                <Text>&nbsp;</Text>
              </Text>
            ) : (
              <View style={{padding: 1}} key={tag}>
                <Badge value={tag} badgeStyle={styles.tags} />
              </View>
            ),
          )}
          <Text>{'\n'}</Text>
        </View>

        {this.state.product.classification == 'RX' &&
          <View style={styles.rxContainer}>
            <FastImage
              style={{width: 30, height: 30, align: 'center'}}
              placeholderColor={
                DynamicAppStyles.colorSet[this.COLOR_SCHEME]
                  .mainThemeForegroundColor
              }
              source={DynamicAppStyles.iconSet.rx}></FastImage>
            <Text style={styles.rxProductWarning}>
              This product is a prescription drug.
            </Text>
            <Text style={styles.rxProductInstructions}>
              Please attach a prescription image to enable the "Add To Cart"
              button.
            </Text>
            {!this.state.prescription && !this.state.uploading ? (
              <Button
                containerStyle={styles.actionButtonContainer}
                style={styles.actionButtonText}
                onPress={this.onAddPrescription}>
                {IMLocalized('Attach Prescription')}
              </Button>
            ) : this.state.uploading ? (
              <Button
                containerStyle={styles.actionButtonContainer}
                style={styles.actionButtonText}>
                Uploading...
              </Button>
            ) : (
              <Button
                containerStyle={styles.actionButtonContainer}
                style={styles.actionButtonText}
                onPress={this.onViewPrescription}>
                {IMLocalized('View Prescription')}
              </Button>
            )}
            {this.state.prescription && this.state.showPrescription && (
              <View
                styles={{
                  width: 400,
                  textAlign: 'center',
                  backgroundColor: 'red',
                  flex: 1,
                }}>
                <FastImage
                  style={styles.prescriptionPreview}
                  source={{uri: this.state.prescription}}
                />
              </View>
            )}
          </View>
        )}
        {/* <Text style={styles.packaging}>{packageContents}</Text> */}
        {this.state.product.minimumOrderQuantity > 1 ? (
          <Text style={styles.minimumOrderQuantity}>
            You need to order a minimum of {minimumOrderQuantity}{' '}
            {unitOfMeasure}.
          </Text>
        ) : (
          <Text style={styles.minimumOrderQuantity}>No minimum order.</Text>
        )}
        {this.state.product.stock < 1 && (
          <Text style={styles.outOfStock}>This product is out of stock!</Text>
        )}
        {this.state.product.stock < lowStockThreshold &&
          this.state.product.stock > 0 && (
            <Text style={styles.outOfStock}>This product is low in stock!</Text>
          )}

        <View style={styles.buttonSetContainer}>
          <View style={styles.buttonSet}>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.buttonText}
              onPress={this.onDecrease}>
              -
            </Button>
            <Text style={styles.count}>{this.state.quantity}</Text>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.buttonText}
              onPress={this.onIncrease}>
              +
            </Button>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <Text style={styles.price}>
            ₱{(this.state.product.price * this.state.quantity).toFixed(2)}
          </Text>

          <Button
            disabled={addDisabled}
            containerStyle={addStyle}
            style={styles.actionButtonText}
            onPress={this.onAddToCart}>
            {IMLocalized('Add to Cart')}
          </Button>
        </View>
        {this.props.user?.discountVerified === 'APPROVED' ? (
          <Text style={styles.discountHint}>
            Any discounts will be applied on checkout.
          </Text>
        ) : null}
      </ScrollView>
    );
  }
}

SingleItemDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  foodItem: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  settings: state.settings,
  user: state.auth.user,
  cartItems: state.cart.cartItems,
  prescriptions: state.cart.prescriptions,
});

export default connect(mapStateToProps, {addToCart, updateCart, setCartVendor})(
  SingleItemDetail,
);
