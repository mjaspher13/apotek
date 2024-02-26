import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BackHandler } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import preStyles from './styles';
import Hamburger from '../../components/Hamburger/Hamburger';
import DynamicAppStyles from '../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance'
import {firebase} from '../../Core/firebase/config';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { VENDOR_CATEGORIES, VENDOR_ID } from '../../Configuration';
import AppConfig from '../../SingleVendorAppConfig';
import { connect } from 'react-redux';

let styles;

class CategoryListScreen extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: IMLocalized('Categories'),
    headerLeft: () => (
      <Hamburger
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
  });

/*   navToMap() {
    const {vendors} = this.props;
    if (vendors.length > 0 || vendors !== undefined) {
      this.props.navigation.navigate('Map', {vendors});
    }
  } */

  constructor(props) {
    super(props);

    this.ref = 
      firebase
        .firestore()
        .collection(VENDOR_CATEGORIES)
        .where('vendorID', '==', VENDOR_ID)
        .orderBy('order', 'asc');
    this.unsubscribe = null;

    this.state = {
      // loading: false,
      data: [],
      // page: 1,
      // seed: 1,
      // error: null,
      // refreshing: false,
    };

    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid
        ),
    );
  }

  componentDidMount() {
    //const {vendors} = this.props;
    //this.props.navigation.setParams({navToMap: () => this.navToMap(vendors)});
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  onCollectionUpdate = querySnapshot => {
    this.setState({
      data: querySnapshot.docs.map(doc => doc.data()),
    });
  };

  onPress = item => {
    if(AppConfig.isMultiVendorEnabled) {
      this.props.navigation.navigate('Vendor', {
        category: item,
        appStyles: DynamicAppStyles,
        appConfig: AppConfig,
      });
    } else {
      this.props.navigation.navigate('SingleVendor', {
        category: item
      });
    }
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPress(item)}>
      <View style={styles.container}>
        <FastImage
          placeholderColor={DynamicAppStyles.colorSet[this.COLOR_SCHEME].grey9}
          style={styles.photo}
          source={{ uri: item.photo }}
          tintColor={DynamicAppStyles.colorSet.mainThemeForegroundColor}
        />
        <View style={styles.overlay} />
        <Text numberOfLines={3} style={styles.title}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    this.COLOR_SCHEME = this.props.screenProps.theme;
    styles = preStyles(this.COLOR_SCHEME);

    return (
      <FlatList
        vertical
        showsVerticalScrollIndicator={false}
        style={styles.listStyle}
        numColumns={2}
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => `${item.id}`}
      />
    );
  }
}

CategoryListScreen.propTypes = {
  serviceType: PropTypes.oneOf(['vaccines', 'medicines', 'testing']),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = state => ({
  vendors: state.vendor.vendorList,
});

export default connect(mapStateToProps)(CategoryListScreen);
