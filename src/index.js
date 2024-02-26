import React from 'react';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import 'react-native-gesture-handler';
import ShoppingCartButton from './components/ShoppingCartButton';
import CartScreen from './screens/Cart/CartScreen';
import CategoryListScreen from './screens/CategoryList/CategoryListScreen';
import DetailsScreen from './screens/Details/DetailsScreen';
import SingleItemDetailScreen from './screens/SingleItemDetail/SingleItemDetailScreen';
import SingleVendorScreen from './screens/SingleVendor/SingleVendorScreen';
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/Login/LoginScreen';
import OrderListScreen from './screens/OrderList/OrderListScreen';
import ReservationScreen from './screens/Reservation/ReservationScreen';
import ReservationHistoryScreen from './screens/ReservationHistory/ReservationHistoryScreen';
import SearchScreen from './screens/Search/SearchScreen';
import SignupScreen from './screens/Signup/SignupScreen';
import WelcomeScreen from './screens/Welcome/WelcomeScreen';

export default createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Cart: { screen: CartScreen },
  },
  {
    drawerPosition: 'left',
    initialRouteName: 'Home',
    drawerWidth: 200,
  }
);

const app = createStackNavigator(
  {
    Home: HomeScreen,
    Welcome: WelcomeScreen,
    Cart: CartScreen,
    OrderList: OrderListScreen,
    Reservation: ReservationScreen,
    Search: SearchScreen,
    FoodList: SingleVendorScreen,
    SingleItemDetail: SingleItemDetailScreen,
    CategoryList: CategoryListScreen,
    Details: DetailsScreen,
    Login: LoginScreen,
    SignUp: SignupScreen,
    ReservationHistory: ReservationHistoryScreen,
  },

  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1,
        fontFamily: 'MuseoSansRounded-300',
      },
      headerRight: () => <ShoppingCartButton />,
    },
  }
);
