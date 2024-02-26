import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import dynamicStyles from './styles';
import IMRatingReview from '../../components/IMRatingReview/IMRatingReview';
import {Appearance} from 'react-native-appearance';
import IMVendorFilterModal from '../../components/IMVendorFilterModal/IMVendorFilterModal';
import {connect} from 'react-redux';

function IMVendorsScreen({navigation, vendors}) {
  const category = navigation.getParam('category', {});
  const appStyles = navigation.getParam('appStyles', {});
  const appConfig = navigation.state.params.appConfig;

  const styles = dynamicStyles(appStyles);

  const [foods, setVendors] = useState([]);
  const [filters, setFilters] = useState({});
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (!category.id) {
      setVendors(vendors);
    } else {
      let vendorCategoryList = vendors.filter(
        vendorItem => vendorItem.categoryID === category.id,
      );
      setVendors(vendorCategoryList);
    }
  }, [category.id, vendors]);
  const COLOR_SCHEME = Appearance.getColorScheme();

  const onPressVendorItem = item => {
    navigation.navigate('SingleVendor', {
      item: item,
    });
  };

  const onPressReview = item => {
    navigation.navigate('Reviews', {
      entityID: item.id,
      appStyles,
      appConfig,
    });
  };

  const onViewFilter = currentFilter => {
    setFilters(currentFilter);
    setVisible(true);
  };

  const renderVendorItem = ({item}) => {
    let count = item.reviewsCount === undefined ? 0 : item.reviewsCount;
    let reviewAvg =
      item.reviewsCount === undefined
        ? 0
        : Math.fround(item.reviewsSum / item.reviewsCount);
    reviewAvg = Number(Math.round(reviewAvg + 'e' + 2) + 'e-' + 2);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressVendorItem(item)}>
        <View style={styles.vendorItemContainer}>
          <FastImage
            placeholderColor={appStyles.colorSet[COLOR_SCHEME].grey9}
            style={styles.foodPhoto}
            source={{uri: item.photo}}
          />
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.title}</Text>
          </View>
          <Text
            onPress={() => onViewFilter(item.filters)}
            style={styles.description}>
            Outdoor Seats, Free WIFI
          </Text>
          <IMRatingReview
            appStyles={appStyles}
            onPressReview={onPressReview}
            number={count}
            rating={reviewAvg}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <IMVendorFilterModal
        appStyles={appStyles}
        isVisible={isVisible}
        filters={filters}
        close={() => setVisible(false)}
      />
      <FlatList
        initialNumToRender={2}
        data={foods}
        renderItem={renderVendorItem}
        keyExtractor={item => `${item.id}`}
      />
    </View>
  );
}

IMVendorsScreen.navigationOptions = ({navigation}) => {
  return {
    headerRight: () => <View />,
    headerTitle: `${navigation.state.params.category.title}`,
  };
};

const mapStateToProps = state => ({
  vendors: state.vendor.vendors,
});

export default connect(mapStateToProps)(IMVendorsScreen);
