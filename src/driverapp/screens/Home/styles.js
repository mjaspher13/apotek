import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
const COLOR_SCHEME = Appearance.getColorScheme();

const styles = StyleSheet.create({
  flat: {
    flex: 1,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
  },
  container: {
    flex: 1,
  },
  emptyOrderContainer: {
    flex: 1,
    marginTop: 16,
    alignItems: 'center'
  },
  logoutButton: {
    padding: 8
  },
  logoutButtonImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: 'red'
  },
  inactiveViewContainer: {
    flex: 1,
    marginTop: h(25)
  },
  goOnlineButton: {
    width: 200,
    paddingVertical: 16,
    backgroundColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    alignItems: "center",
    borderRadius: 8
  },
  goOnlineButtonText: {
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].whiteSmoke,
    fontSize: 20,
    fontWeight: "bold"
  },
  mapStyle: {
    flex: 1
  },
  mapCarIcon: {
    height: 32,
    width: 32,
    tintColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
  }
});

export default styles;
