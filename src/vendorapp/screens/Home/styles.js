import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const styles = StyleSheet.create({
  flat: {
    flex: 1,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
  },
  container: {
    marginBottom: 30,
    flex: 1,
    padding: 10,
  },
  photo: {
    width: '100%',
    height: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  address: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    color: '#eeeeee',
    opacity: 0.8,
    fontWeight: 'bold',
    textAlign: "center"
  },
  rowContainer: {
    flexDirection: 'row',
  },
  count: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    borderWidth: 1,
    fontWeight: 'bold',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 2,
    paddingBottom: 2,
    textAlign: 'center',
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    backgroundColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    borderColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    borderWidth: 1,
    borderRadius: 3,
  },
  price: {
    padding: 10,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    flex: 1,
    padding: 10,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: "row",
    flex: 2
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  total: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
    borderColor: DynamicAppStyles.colorSet.grey3,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 4,
    backgroundColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
  },
  actionButtonText: {
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    fontSize: 16,
    fontFamily: DynamicAppStyles.fontFamily.bold,
  },
  rejectButtonContainer: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    borderRadius: 5,
  },
  rejectButtonText: {
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    fontSize: 14,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    textAlign: "center",
  },
  statusText: {
    marginRight: 8,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    fontSize: 14,
    borderWidth: 1,
    borderColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    borderRadius: 5,
    textAlign: "center",
    alignItems: "center",
    alignSelf: 'center',
    padding: 10
  }
});

export default styles;
