import React, {Component} from 'react';
import {FlatList, Image, Platform, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BackHandler} from 'react-native';
import {Appearance} from 'react-native-appearance';
import {Badge, ListItem, Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import DynamicAppStyles from '../../DynamicAppStyles';
import {firebase} from '../../Core/firebase/config';
import {IMLocalized} from '../../Core/localization/IMLocalization';
import {TNEmptyStateView} from '../../Core/truly-native';
import Modal from 'react-native-modal';
import SingleItemDetail from '../SingleItemDetail/SingleItemDetailScreen';
import preStyles from './styles';
import {storeCartToDisk} from '../../Core/cart/redux/reducers';
import {connect} from 'react-redux';
import VendorAppConfig from '../../SingleVendorAppConfig';
import ShoppingCartButton from '../../components/ShoppingCartButton/ShoppingCartButton';

let styles;

class SingleVendorScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const item = navigation.state.params.item;
    const category = navigation.state.params.category;
    return {
      title: item?.title || category?.title,
      headerRight: () => (
        <ShoppingCartButton
          onPress={() => {
            if (navigation.state.params?.isGuest) {
              navigation.navigate('Login', {
                appStyles: DynamicAppStyles,
                appConfig: VendorAppConfig,
              });
              return;
            }
            navigation.navigate('Cart', {
              appStyles: DynamicAppStyles,
              appConfig: VendorAppConfig,
            });
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    const {navigation} = props;
    const item = navigation.getParam('item');
    const category = navigation.getParam('category'); // used only for single vendor config

    if (VendorAppConfig.isMultiVendorEnabled) {
      this.ref = firebase
        .firestore()
        .collection(VendorAppConfig.FIREBASE_COLLECTIONS.PRODUCTS)
        .where('vendorID', '==', item.id);
    } else {
      this.ref = firebase
        .firestore()
        .collection(VendorAppConfig.FIREBASE_COLLECTIONS.PRODUCTS)
        .where('categoryID', '==', category?.id);
    }
    this.unsubscribe = null;
    this.state = {
      data: [],
      refreshing: false,
      selectedItem: {},
      isVisible: false,
      loading: true,
      vendor: item,
      category: navigation.getParam('category'),
    };

    this.didFocusSubscription = navigation.addListener('didFocus', () =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackButtonPressAndroid,
      ),
    );
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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
    this.unsubscribe();
    this.willBlurSubscription?.remove();
    this.didFocusSubscription?.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const data2 = doc.data();
      const {company} = this.props.user;
      const {
        name,
        classification,
        description,
        categoryPhoto,
        minimumOrderQuantity,
        stock,
        price,
        tags,
      } = data2;

      data.push({
        id: doc.id,
        categoryID: data2.categoryID,
        name,
        classification,
        description,
        minimumOrderQuantity,
        photo: data2.photo, // data2.category === 'rx' ? DynamicAppStyles.iconSet.rx : null,
        // doc,
        stock,
        price: data2[company] ? data2[company] : data2.retail, // TODO - Better default???
        tags,
      });
    });

    this.setState({
      data,
      loading: false,
    });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '92%',
          backgroundColor: '#CED0CE',
          marginLeft: '4%',
          marginRight: '4%',
        }}
      />
    );
  };

  onPress = item => {
    this.setState({selectedItem: item});
    this.setState({isVisible: true});
  };

  renderItem = ({item}) => {
    const price = item.price.toFixed(2);
    let desc = item.description.replace(/\\n/g, '\n');
    const DESC_CUTOFF_LN = 70;
    if (desc.length > DESC_CUTOFF_LN) {
      desc = desc.slice(0, DESC_CUTOFF_LN) + '...';
    }

    return (
      <ListItem
        onPress={() => this.onPress(item)}
        containerStyle={styles.listItemContainer}>
        <ListItem.Content style={{flex: 1, alignItems: 'stretch'}}>
          <ListItem.Title style={styles.title}>{item.name}</ListItem.Title>
          <ListItem.Subtitle style={{flex: 1, marginBottom: -20}}>
            <Text style={styles.description}>
              {desc} {'\n'}
            </Text>
          </ListItem.Subtitle>

          <Text style={styles.price}>₱{price}</Text>
          <View style={styles.tagContainer}>
            {item.tags?.split(',').map(tag =>
              Platform.OS === 'ios' ? (
                <Text style={{}} key={tag}>
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
          </View>
        </ListItem.Content>

        <FastImage style={styles.rightIcon} source={{uri: item.photo}} />
      </ListItem>
    );
  };

  render() {
    const {isVisible, selectedItem, data, loading} = this.state;
    const emptyStateConfig = {
      title: IMLocalized('No Items'),
      description: IMLocalized(
        'There are currently no items under this category. Check back again soon!',
      ),
    };
    styles = preStyles(this.props.screenProps.theme);

    return (
      <View style={styles.container}>
        {data.length === 0 && !loading && (
          <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={DynamicAppStyles}
            />
          </View>
        )}
        <Modal
          style={styles.modalContainer}
          // swipeDirection="down"
          onModalHide={async () =>
            storeCartToDisk(
              this.props.cartItems,
              this.props.cartVendor,
              this.props.prescriptions,
              this.props.user.id,
            )
          }
          onBackButtonPress={() => {
            this.setState({isVisible: false});
          }}
          onBackdropPress={() => {
            this.setState({isVisible: false});
          }}
          // onSwipeComplete={() => this.setState({isVisible: false})}
          isVisible={isVisible}>
          <SingleItemDetail
            navigation={this.props.navigation}
            screenProps={this.props.screenProps}
            close={() => this.setState({isVisible: false})}
            vendor={this.state.vendor}
            foodItem={selectedItem}
          />
        </Modal>
        <FlatList
          ItemSeparatorComponent={this.renderSeparator}
          data={this.state.data}
          renderItem={this.renderItem}
          keyExtractor={item => `${item.id}`}
          initialNumToRender={5}
          refreshing={this.state.refreshing}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

SingleVendorScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

// To "GET" a prop using redux, we need to add it here!
// Copied state.auth.user config from
const mapStateToProps = state => ({
  user: state.auth.user,
  cartItems: state.cart.cartItems,
  cartVendor: state.cart.vendor,
  prescriptions: state.cart.prescriptions,
});

export default connect(mapStateToProps)(SingleVendorScreen);
