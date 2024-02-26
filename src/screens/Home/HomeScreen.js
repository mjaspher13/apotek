import React, { Fragment } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DynamicAppStyles from '../../DynamicAppStyles';
import preStyles from './styles';
import {storeCartToDisk} from '../../Core/cart/redux/reducers';
import {overrideCart, setCartVendor, overrideRx} from '../../Core/cart/redux/actions';
import { setUserData } from '../../Core/onboarding/redux/auth';

import Modal from 'react-native-modal';
import Hamburger from '../../components/Hamburger/Hamburger';
import { Appearance, useColorScheme } from 'react-native-appearance';
import {firebase} from '../../Core/firebase/config';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import AdminVendorListScreen from '../../Core/vendor/admin/ui/AdminVendorList/AdminVendorListScreen';
import IMVendorFilterModal from '../../components/FilterModal/FilterModal';
import { VENDOR_DEALS, VENDOR, VENDOR_ID, VENDOR_CATEGORIES } from '../../Configuration';
import {setVendors, setPopularProducts} from '../../Core/vendor/redux';
import ProductsAPIManager from '../../api/ProductsAPIManager';
import IMVendorListAPI from '../../Core/vendor/api/IMVendorListAPI';
import FakeTabs from '../../components/FakeTabs/FakeTabs';
import BottomLabelIcon from '../../components/BottomLabelIcon/BottomLabelIcon';
import VendorAppConfig from '../../SingleVendorAppConfig';
import { Button } from 'react-native-vector-icons/FontAwesome';
import ShoppingCartButton from '../../components/ShoppingCartButton/ShoppingCartButton';
import SingleItemDetail from '../SingleItemDetail/SingleItemDetailScreen';
import CustomAlert from '../../components/CustomAlert';

const {width: viewportWidth} = Dimensions.get('window');
let styles;

// Either 3 or 4
const FLAT_LIST_SIZE = 4;

class HomeScreen extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: IMLocalized('Home'), // VendorAppConfig.applicationName,
    headerStyle:{
      backgroundColor: DynamicAppStyles.colorSet[Appearance.getColorScheme()].mainThemeForegroundColor,
      // elevation: 0, // remove shadow on Android
      // shadowOpacity: 0, // remove shadow on iOS
    },
    headerTintColor: '#FFF',
    headerLeft: () => {
      const { isGuest } = navigation.state.params || {};
      if (isGuest) {
        // Go back
        return null;
      }
      return <Hamburger
        style={{ tintColor: "#FFF" }}
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    },
    headerRight: () => (
      <ShoppingCartButton
        style={{ tintColor: 'white' }}
        onPress={() => {
          if (navigation.state.params.isGuest) {
            navigation.navigate('Login', {
              appStyles: DynamicAppStyles,
              appConfig: VendorAppConfig,
            })
            return;
          }
          navigation.navigate('Cart', {
            appStyles: DynamicAppStyles,
            appConfig: VendorAppConfig,
          });
        }}/>
    )
  });

  constructor(props) {
    super(props);

    const appConfig = props.navigation.state.params.appConfig;
    if (appConfig.isMultiVendorEnabled){
      this.vendorAPIManager = new IMVendorListAPI(props.setVendors, VENDOR);
    } else {
      this.productsAPIManager = new ProductsAPIManager(props.setPopularProducts);
    }

    const { isGuest } = props.navigation.state.params;

    this.categoriesRef = 
      firebase
        .firestore()
        .collection(VENDOR_CATEGORIES)
        .where('vendorID', '==', VENDOR_ID)
        .orderBy('order', 'asc');
    // TODO - Deals table. Editable in CMS
    // this.dealsRef =
    //   firebase
    //     .firestore()
    //     .collection(VENDOR_DEALS)
    //     .where('order', ">", "")
    //     .orderBy('order');
   
    this.categorieUnsubscribe = null;
    this.dealsUnsubscribe = null;
    this.foodsUnsubscribe = null;

    this.state = {
      activeSlide: 0,
      categories: [],
      deals: [],
      foods: [],
      vendors: [],
      filters: {},
      index: 0,
      // loading: false,
      // error: null,
      // refreshing: false,
    };
  }

  componentDidMount() {
    if (!this.props.navigation.state.params?.isGuest) {
      this.initCartFromPersistentStore();
    }
    this.initBannersFromPersistentStore();
    this.categorieUnsubscribe = this.categoriesRef.onSnapshot(
      this.onCategoriesCollectionUpdate,
    );
    // this.dealsUnsubscribe = this.dealsRef.onSnapshot(
    //   this.onDealsCollectionUpdate,
    // );
  }

  navToMap(vendors, navigation) {
    if (vendors.length > 0 || vendors !== undefined) {
      navigation.navigate('Map', {vendors});
    }
  }

  componentWillUnmount() {
    this.categorieUnsubscribe && this.categorieUnsubscribe();
    this.dealsUnsubscribe && this.dealsUnsubscribe();
    this.vendorAPIManager?.unsubscribe && this.vendorAPIManager.unsubscribe();
    this.productsAPIManager?.unsubscribe && this.productsAPIManager.unsubscribe();
  }

  onPressCategoryItem = item => {
    const appConfig = this.props.navigation.state.params.appConfig;
    const appStyles = this.props.navigation.state.params.appStyles;
    if (appConfig.isMultiVendorEnabled) {
      this.props.navigation.navigate('Vendor', {
        category: item,
        appStyles,
        appConfig,
      });
    } else {
      const { isGuest } = this.props.navigation.state.params;
      const newScreen = isGuest ? 'SingleVendorGuest' : 'SingleVendor';
      this.props.navigation.navigate(newScreen, {
        category: item,
        isGuest
      });
    }
  };

  onPressDealItem = item => {
    const appConfig = this.props.navigation.state.params.appConfig;
    const appStyles = this.props.navigation.state.params.appStyles;
    if (appConfig.isMultiVendorEnabled) {
      this.props.navigation.navigate('Vendor', {
        category: item,
        appStyles,
        appConfig,
      });
    } else {
      const { isGuest } = this.props.navigation.state.params;
      const newScreen = isGuest ? 'SingleVendorGuest' : 'SingleVendor';
      this.props.navigation.navigate(newScreen, {
        category: item,
        isGuest
      });
    }
  };

  onCategoriesCollectionUpdate = querySnapshot => {
    this.setState({
      categories: querySnapshot.docs.map(doc => doc.data()),
    });
  };

  onDealsCollectionUpdate = querySnapshot => {
    this.setState({
      deals: querySnapshot.docs.map(doc => doc.data()),
      selectedItem: {},
      isVisible: false,
    });
  };

  initCartFromPersistentStore() {
    const id = this.props.user?.id || '';
    AsyncStorage.getItem('@MySuperCart:key') // + id)
      .then(res => {
        if (res != null) {
          const cart = JSON.parse(res)
          this.props.overrideCart(cart.cartItems || [], { id });
          this.props.setCartVendor(cart.vendor || {}, { id })
          this.props.overrideRx(cart.prescriptions || [], { id });
        }
      })
      .catch(error => {
        console.log(`Promise is rejected with error: ${error}`, error.stack);
      });
  }

  /*
    Banner fromat in storage: {
      banners: [
        {
          url: ...,
          productID: ...,
          ...
        }
      ],
      retrievedDate: <timestamp in milliseconds>
    }
   */
  initBannersFromPersistentStore() {
    const BANNERS_KEY = "@REBanners:key";
    const fetch = () => {
      return firebase.firestore()
        .collection(VENDOR_DEALS)
        .get().then(querySnapshot => {
          const banners = [];
          querySnapshot.forEach(doc => {
            banners.push(doc.data());
          });

          // Then re-store
          AsyncStorage.setItem(BANNERS_KEY, JSON.stringify({
            banners,
            retrievedDate: Date.now(),
          }));
          this.setState({
            deals: banners,
          })
        }).catch(err => {
          console.log('Failed to get banners', err);
        });
    }
    AsyncStorage.getItem(BANNERS_KEY).then(res => {
      if (res != null) {
        const data = JSON.parse(res);
        const days = 1;
        const tooOldThreshold =  days * 24 * 60 * 60 * 1000; // TOO OLD IF timestamp is LESS than this
        if (data && Date.now() - data.retrievedDate < tooOldThreshold) { // Cache for 1 day
          this.setState({
            deals: data.banners
          })
        } else {
          fetch();
        }
      } else {
        fetch();
      }
    }).catch(err => {
      console.warn('ERROR FETCHING BANNERS FROM CACHE', err);
    });
  }

  renderCategoryItem_ = ({item}) => (
    <TouchableOpacity onPress={() => this.onPressCategoryItem(item)}>
      <View style={styles.categoryItemContainer}>
        <FastImage
          placeholderColor={DynamicAppStyles.colorSet[this.COLOR_SCHEME].grey9}
          style={styles.categoryItemPhoto}
          source={{uri: item.photo}}
        />
        <Text style={styles.categoryItemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  renderCategoryItem = ({ item }) => {
    let length = 50;
    if (FLAT_LIST_SIZE === 3) {
      length = 65;
    } else if (FLAT_LIST_SIZE === 4) {
      length = 55;
    } else {
      length = 60;
    }
    const imageStyle = {
      width: length,
      height: length,
    };
    return (
      <BottomLabelIcon
        color={DynamicAppStyles.colorSet[this.COLOR_SCHEME].mainThemeForegroundColor}
        isAvatar={true}
        style={styles.categoryItemContainer}
        label={item.title}
        labelStyle={{ fontSize: 12}}
        onPress={() => this.onPressCategoryItem(item)}
        imageSource={{ uri: item.photo }}
        imageStyle={imageStyle}
      />
    );
  }

  // onPress={() => this.onPressDealItem(item)}>
  renderDealItem = ({item}) => {
    return (
    <TouchableOpacity onPress={() => {
      if (item.productID) {
        this.setState({
          isVisible: true,
          selectedItem: item,
          bannerProductID: item.productID,
        })
      }
    }}> 
      <View style={styles.dealItemContainer}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          placeholderColor={DynamicAppStyles.colorSet[this.COLOR_SCHEME].grey9}
          style={styles.dealPhoto}
          source={{uri: item.url}}
        />
        {/* <View style={styles.overlay} />
        <Text style={styles.dealName}>{item.title}</Text> */}
      </View>
    </TouchableOpacity>
  );
  };

  renderCategorySeparator = () => {
    return (
      <View
        style={{
          width: 10,
          height: '100%',
        }}
      />
    );
  };

  navigateTo = (screen, options) => {
    this.props.navigation.navigate(screen, options);
  }

  render() {
    const { isGuest } = this.props.navigation.state.params;
    const {user} = this.props;
    this.COLOR_SCHEME = this.props.screenProps.theme;
    styles = preStyles(this.COLOR_SCHEME);

    if (user.isAdmin) {
      return <AdminVendorListScreen />;
    }

    const {activeSlide, filters, isVisible} = this.state;
    const appConfig = this.props.navigation.state.params.appConfig;
    const faketabs = [{
      label: 'Search',
      icon: DynamicAppStyles.iconSet.search,
      navigationTarget: 'Search',
      navigationOptions: {}
    },{
      label: 'Messages',
      icon: require('../../../assets/icons/Messages.png'),
      navigationTarget: 'ChatList',
      navigationOptions: {
        appStyles: DynamicAppStyles,
        appConfig: VendorAppConfig,
        channel: {},
      }
    },{
      label: 'Orders',
      icon: require('../../../assets/icons/OrderHistory.png'),
      navigationTarget: 'OrderList',
      navigationOptions: {
        appStyles: DynamicAppStyles,
        appConfig: VendorAppConfig,
      }
    }, {
      label: 'Account',
      icon: require('../../../assets/icons/Setting.png'),
      navigationTarget: 'MyProfile',
      navigationOptions: {
        appStyles: DynamicAppStyles,
        appConfig: VendorAppConfig,
        form: VendorAppConfig.editProfileFields
      }
    }];
    if (isGuest) {
      faketabs.length = 0;
      faketabs.push({
        label: 'Search',
        icon: DynamicAppStyles.iconSet.search,
        navigationTarget: 'SearchGuest',
        navigationOptions: {
          isGuest: true
        }
      });
      faketabs.push({
        label: 'Sign In',
        icon: DynamicAppStyles.iconSet.profile,
        navigationTarget: 'Login',
        navigationOptions: {
          appStyles: DynamicAppStyles,
          appConfig: VendorAppConfig,
        }
      })
    }

    // {/* <View style={styles.headerTilt} /> */}
    return (
      <Fragment>
        <FlatList
          style={styles.container}
          ListHeaderComponent={
            <>
            {/* <View style={styles.headerWithBG}>
              <Text style={styles.headerText}>Welcome to {"\n" + VendorAppConfig.applicationName}.</Text>
              <Image
                style={styles.headerImage}
                source={DynamicAppStyles.iconSet.logo} />
            </View> */}
            <View style={styles.deals}>
              <View style={styles.carousel}>
                <Carousel
                  ref={c => { this.slider1Ref = c; }}
                  data={this.state.deals}
                  renderItem={this.renderDealItem}
                  sliderWidth={viewportWidth}
                  itemWidth={viewportWidth}
                  // hasParallaxImages={true}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={1}
                  firstItem={0}
                  loop={true}
                  // loopClonesPerSide={2}
                  autoplay={true}
                  lockScrollWhileSnapping={true}
                  autoplayDelay={500}
                  autoplayInterval={4000}
                  onSnapToItem={index => this.setState({activeSlide: index})}
                />
                <Pagination
                  dotsLength={this.state.deals.length}
                  activeDotIndex={activeSlide}
                  containerStyle={styles.paginationContainer}
                  // dotColor="rgba(0, 44, 113, 0.95)"
                  dotStyle={styles.paginationDot}
                  // inactiveDotColor="grey"
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this.slider1Ref}
                  tappableDots={!!this.slider1Ref}
                />
              </View>
            </View>
            </>
          }
          ListFooterComponent={
            <View style={styles.footerContainer}>
                <Button name="lightbulb-o" size={20}
                  backgroundColor={DynamicAppStyles.colorSet[this.COLOR_SCHEME].mainThemeBackgroundColor}
                  color="#aa8c69"
                  style={{
                    marginBottom: 4,
                }} />
              <Text style={styles.footerText}>Keep your account secure! We will never ask for your passwords/OTP through a call or email.</Text>

              <Modal
                style={styles.modalContainer}
                // swipeDirection="down"
                onModalHide={async () =>
                  storeCartToDisk(this.props.cartItems, this.props.cartVendor, this.props.prescriptions, this.props.user.id)
                }
                onBackButtonPress={() => {
                  this.setState({ isVisible: false, bannerProductID: null });
                }}
                onBackdropPress={() => {
                  this.setState({ isVisible: false, bannerProductID: null });
                }}
                // onSwipeComplete={() => this.setState({isVisible: false, bannerProductID: null})}
                isVisible={isVisible}>
                <SingleItemDetail
                  navigation={this.props.navigation}
                  screenProps={this.props.screenProps}
                  close={() => this.setState({isVisible: false, bannerProductID: null})}
                  vendor={this.state.vendor}
                  foodItem={this.state.selectedItem}
                />
              </Modal>
            </View>
          }
          numColumns={FLAT_LIST_SIZE}
          initialNumToRender={4}
          data={this.state.categories}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderCategoryItem}
          keyExtractor={item => `${item.id}`}
        />

        <FakeTabs navigation={this.props.navigation} buttons={faketabs}/>

        {this.props.settings.first_delivery_free?.value &&
          this.props.user?.showFDF &&
          <CustomAlert
            title="Welcome!"
            body="You get free delivery on your first order!"
            theme={this.props.screenProps.theme}
            close={() => {
              this.props.setUserData({
                user: {
                  ...this.props.user,
                  showFDF: false,
                }
              })
            }}
          />
        }
      </Fragment>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = state => ({
  user: state.auth.user,
  settings: state.settings,
  vendors: state.vendor.vendors,
  popularProducts: state.vendor.popularProducts
});

export default connect(mapStateToProps, {
  setUserData,
  overrideCart, overrideRx,
  setVendors,
  setPopularProducts,
  setCartVendor
})(HomeScreen);
