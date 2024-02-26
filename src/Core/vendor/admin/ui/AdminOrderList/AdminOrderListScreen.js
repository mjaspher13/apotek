import React, {useState, useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DynamicAppStyles from '../../../../../DynamicAppStyles';
import styles from './styles';
import Hamburger from '../../../../../components/Hamburger/Hamburger';
import {overrideCart} from '../../../../cart/redux/actions';
import {Appearance} from 'react-native-appearance';
import {IMLocalized} from '../../../../localization/IMLocalization';
import {AdminOrderAPIManager} from '../../api/AdminOrderAPIManager';

function AdminOrderListScreen() {
  const [data, setData] = useState([]);
  const apiManager = new AdminOrderAPIManager(setData);
  const COLOR_SCHEME = Appearance.getColorScheme();

  useEffect(() => {
    return () => {
      apiManager.unsubscribe();
    };
  }, [apiManager]);

  const renderItem = ({item}) => (
    <View style={styles.container}>
      <View>
        {item != null &&
          item.products != null &&
          item.products[0] != null &&
          item.products[0].photo != null &&
          item.products[0].photo.length > 0 && (
            <FastImage
              animationStyle="fade"
              placeholderColor={DynamicAppStyles.colorSet[COLOR_SCHEME].grey9}
              style={styles.photo}
              source={{uri: item.products[0].photo}}
            />
          )}
        <View style={styles.overlay} />
      </View>
      {item.products.map(food => {
        return (
          <View style={styles.rowContainer} key={food.id}>
            <Text style={styles.count}>{food.count}</Text>
            <Text style={styles.title}>{food.name}</Text>
            <Text style={styles.price}>₱{food.price}</Text>
          </View>
        );
      })}
      <View style={styles.actionContainer}>
        <Text style={styles.total}>
          Total: ₱
          {(
            item.products.reduce(
              (prev, next) => prev + next.price * next.count,
              0,
            ) + 1
          ).toFixed(2)}
        </Text>
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={() => apiManager.onDelete(item.id)}>
          Delete
        </Button>
      </View>
    </View>
  );
  return (
    <FlatList
      style={styles.flat}
      data={data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      initialNumToRender={5}
    />
  );
}

AdminOrderListScreen.navigationOptions = ({navigation}) => ({
  title: IMLocalized('Orders'),
  headerRight: null,
  headerLeft: () => (
    <Hamburger
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  ),
});

AdminOrderListScreen.propTypes = {
  user: PropTypes.shape(),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

// export default CartScreen;
const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {overrideCart})(AdminOrderListScreen);
