import React, {Component, createRef} from 'react';
import {
  FlatList,
  Platform,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {BackHandler} from 'react-native';
import {Badge, ListItem, Icon as RNIcon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {FoodListItemStyle, colorSet} from '../../AppStyles';
import Hamburger from '../../components/Hamburger/Hamburger';
import {firebase} from '../../Core/firebase/config';
import Modal from 'react-native-modal';
import SingleItemDetail from '../SingleItemDetail/SingleItemDetailScreen';
import preStyles from './styles';
import {VENDOR_ID, VENDOR_PRODUCTS} from '../../Configuration';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import SearchBar from '../../Core/ui/SearchBar/SearchBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchModal from './SearchModal';
import DynamicAppStyles from '../../DynamicAppStyles';
import AppConfig from '../../SingleVendorAppConfig';
import {Appearance} from 'react-native-appearance';
import ShoppingCartButton from '../../components/ShoppingCartButton/ShoppingCartButton';
import {logSearch} from '../../Core/firebase/analytics';

let styles;

class SearchScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => {
    const {params = {}} = navigation.state;
    const searchRef = createRef();
    return {
      headerLeft: () => {
        const {isGuest} = params;
        if (isGuest) {
          const tint =
            DynamicAppStyles.colorSet[screenProps.theme]
              .mainThemeForegroundColor;
          // Go back, no drawer.
          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FastImage
                source={require('react-navigation-stack/src/views/assets/back-icon.png')}
                tintColor={tint}
                style={{
                  width: 25,
                  height: 25,
                  margin: 6,
                  tintColor: tint,
                }}
              />
            </TouchableOpacity>
          );
        }
        return (
          <Hamburger
            onPress={() => {
              navigation.openDrawer();
            }}
          />
        );
      },
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
            }}
            onPress={() => params.toggleFilters()}>
            <Icon
              name="sliders"
              size={28}
              onPress={() => params.toggleFilters()}
              color={
                DynamicAppStyles.colorSet[screenProps.theme]
                  .mainThemeForegroundColor
              }
            />
          </TouchableOpacity>
          <ShoppingCartButton
            onPress={() => {
              if (params.isGuest) {
                navigation.navigate('Login', {
                  appStyles: DynamicAppStyles,
                  appConfig: AppConfig,
                });
                return;
              }
              navigation.navigate('Cart', {
                appStyles: DynamicAppStyles,
                appConfig: AppConfig,
              });
            }}
          />
        </View>
      ),
      headerTitle: () => (
        <SearchBar
          searchRef={searchRef}
          appStyles={DynamicAppStyles}
          onSearch={text => {
            params.handleSearch(text);
          }}
          onChangeText={text => {
            params.handleSearch(text);
          }}
          onSearchBarCancel={text => {
            searchRef.current.clearText();
            params.handleSearch(text);
            Keyboard.dismiss();
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    const {isGuest} = props.navigation.state.params || {};
    console.log('SearchScreen: isGuest?', isGuest);

    this.state = {
      // keyword: 'nadfaef',
      // loading: false,
      availableCategories: [],
      data: [],
      selectedItem: {},
      isVisible: false,
      filtersVisible: false,
      filters: {
        minPrice: 0,
        maxPrice: 10000,
        price: [0, 10000],
        inStock: false,
        categories: [],
      },
      sort: 'None', // One of: 'None', 'A-Z', 'Z-A', 'Price High To Low', 'Price Low to High'
      // error: null,
      // refreshing: false,
    };

    this.ref = firebase
      .firestore()
      .collection(VENDOR_PRODUCTS)
      .where('vendorID', '==', VENDOR_ID);
    this.unsubscribe = null;
    this.toggleFilter = () => {
      this.setState({
        filtersVisible: true,
      });
    };
  }

  /* navToMap(vendors) {
    if (vendors.length > 0 || vendors !== undefined) {
      this.props.navigation.navigate('Map', {vendors});
    }
  } */

  componentDidMount() {
    const {vendors} = this.props;
    //this.props.navigation.setParams({navToMap: () => this.navToMap(vendors)});
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.props.navigation.setParams({
      toggleFilters: this.toggleFilter,
      handleSearch: this.onSearch,
      search: '',
    });

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

  toggleFilter = () => {
    this.setState({
      filtersVisible: true,
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
    this.didFocusSubscription?.remove();
    this.willBlurSubscription?.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  // Note: not using this.state.sort, but instead a copy of sort
  // So that we don't need to wait for re-render
  sortData = (data, sort) => {
    if (sort === 'A-Z') {
      data.sort((a, b) => {
        return a.name >= b.name;
      });
    } else if (sort === 'Z-A') {
      data.sort((a, b) => {
        return a.name < b.name;
      });
    } else if (sort === '₱ - ₱₱₱') {
      data.sort((a, b) => {
        return a.price >= b.price;
      });
    } else if (sort === '₱₱₱ - ₱') {
      data.sort((a, b) => {
        return a.name < b.name;
      });
    } else {
      // None.
    }

    // No return, sort does it in place.
    // MAKE SURE TO CALL THIS WITH A PRE-CLONED OBJECT (from state)!
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    const availableCategoriesFromResults = new Set();
    const allPrices = [];
    let initialItemOpen = {};

    querySnapshot.forEach(doc => {
      const navParams = this.props.navigation.state.params;
      const data2 = doc.data();
      const {company} = this.props.user;
      const {
        name,
        classification,
        description,
        photo,
        minimumOrderQuantity,
        stock,
        price,
        tags,
      } = data2;
      const text =
        this.searchedText != null ? this.searchedText.toLowerCase() : '';
      let index = name.toLowerCase().search(text);
      if (index === -1) {
        index = tags.toLowerCase().search(text);
      }
      if (index !== -1) {
        data.push({
          id: doc.id,
          categoryID: data2.categoryID,
          name,
          description,
          photo,
          // doc,
          stock,
          classification,
          minimumOrderQuantity,
          // price: !!data2[company] ? data2[company]: data2.retail, // TODO - better default
          price: data2.retail, // TDS
          tags,
        });

        allPrices.push(data2[company] ? data2[company] : data2.retail);

        // Get third-level tag (GENERAL,CATEGORY,TAG,BRAND)
        const level = data2.tags.split(',')[2];
        if (level !== undefined) {
          availableCategoriesFromResults.add(level);
        }
      }

      // Open the "initial" item whether or not it was in the search results.
      if (navParams.item?.length && data2.code === navParams.item) {
        initialItemOpen = data2;
      }
    });

    const copy = {...this.state.filters};
    copy.categories = [...copy.categories];
    for (let i = copy.categories.length - 1; i >= 0; i--) {
      // Remove filter if not in results array.
      // Don't add any new tapped categories, because the user couldn't have tapped them if they weren't in the previous result
      if (!availableCategoriesFromResults.has(copy.categories[i])) {
        copy.categories.splice(i, 1);
      }
    }
    if (allPrices.length) {
      copy.minPrice = Math.min(...allPrices);
      copy.maxPrice = Math.max(...allPrices);
    }
    copy.price[0] = copy.minPrice || 0;
    copy.price[1] = copy.maxPrice || 10000;

    // Always set the "initial" to null afterward so future reloads/searches don't get messed up.
    this.props.navigation.setParams({
      item: null,
    });

    this.sortData(data, this.state.sort);
    this.setState({
      isVisible: initialItemOpen.id ? true : false,
      selectedItem: initialItemOpen.id ? initialItemOpen : {},
      availableCategories: Array.from(availableCategoriesFromResults),
      data,
      filters: copy,
      // loading: false,
    });
  };

  onSearch = text => {
    console.log('onSearch', text);
    logSearch(text);
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // this.props.navigation.setParams({
    //   search: text
    // });
    this.ref = firebase
      .firestore()
      .collection(VENDOR_PRODUCTS)
      .where('vendorID', '==', VENDOR_ID);
    this.searchedText = text;

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
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

  onUpdateSort = newValue => {
    const copy = [...this.state.data];
    this.sortData(copy, newValue);
    this.setState({
      sort: newValue,
      data: copy,
    });
  };

  onUpdateFilters = (newFilters = []) => {
    const copy = {...this.state.filters};
    for (let i = 0; i < newFilters.length; i++) {
      const key = newFilters[i][0];
      copy[key] = newFilters[i][1];
    }
    console.log('SearchScreen: onUpdateFilters', newFilters, copy);
    this.setState(
      {
        filters: copy,
      },
      () => {
        console.log('FILTERS WERE UPDATED', this.state.filters);
      },
    );
  };

  onPress = item => {
    this.setState({selectedItem: item});
    this.setState({isVisible: true});
  };

  filterItems = item => {
    const available = this.state.availableCategories;
    const {inStock, categories, price} = this.state.filters;
    if (inStock && item.stock < 1) {
      return false;
    }
    const splitTags = item.tags !== undefined ? item.tags.split(',') : [];
    let categoryFound = false;
    if (categories.length) {
      for (let i = 0; i < categories.length && !categoryFound; i++) {
        // For each category, check if THIS product has it.
        for (let j = 0; j < splitTags.length; j++) {
          if (available[categories[i]] === splitTags[j]) {
            categoryFound = true;
            break;
          }
        }
      }
      if (!categoryFound) {
        return false;
      }
    }

    // Exclude if item price not between the min and max
    if (item.price < price[0] || item.price > price[1]) {
      return false;
    }

    // Otherwise, valid!
    return true;
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
          <ListItem.Subtitle style={{flex: 1, marginBottom: -10}}>
            <Text style={styles.description}>{desc}</Text>
          </ListItem.Subtitle>
          <Text style={styles.price}>₱{price}</Text>
          <View style={styles.tagContainer}>
            {item.tags?.split(',').map(tag =>
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
          </View>
        </ListItem.Content>
        <FastImage
          style={FoodListItemStyle.rightIcon}
          source={{uri: item.photo}}
        />
      </ListItem>
    );
  };

  render() {
    const {isVisible, filtersVisible, selectedItem} = this.state;

    this.COLOR_SCHEME = Appearance.getColorScheme();
    styles = preStyles(this.COLOR_SCHEME);
    return (
      <View style={styles.container}>
        <Modal
          style={styles.modalContainer}
          // swipeDirection="down"
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
            foodItem={selectedItem}
          />
        </Modal>
        <SearchModal
          categories={this.state.availableCategories}
          filters={this.state.filters}
          screenProps={this.props.screenProps}
          isVisible={filtersVisible}
          sort={this.state.sort}
          updateSort={this.onUpdateSort}
          updateFilters={this.onUpdateFilters}
          resetFilters={() => {
            const {minPrice, maxPrice} = this.state.filters;
            this.setState({
              sort: 'None',
              filters: {
                minPrice,
                maxPrice,
                price: [minPrice, maxPrice],
                inStock: false,
                categories: [],
              },
            });
          }}
          onClose={() => this.setState({filtersVisible: false})}
        />
        <FlatList
          data={this.state.data.filter(this.filterItems)}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}

SearchScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = state => ({
  user: state.auth.user,
  vendors: state.vendor.vendorList,
});

export default connect(mapStateToProps)(SearchScreen);
