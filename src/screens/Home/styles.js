import {StyleSheet, Dimensions} from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from 'react-native-responsive-screen';

const {width: viewportWidth} = Dimensions.get('window');

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    flex: 1,
  },
  headerWithBG: {
    zIndex: 999,
    padding: 8,
    marginBottom: -20, // Remove if hiding tilt
    position: 'relative',
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: h(27),
  },
  headerImage: {
    resizeMode: 'contain',
    flex: 1,
    borderWidth: 3,
    width: '100%',
    height: 'auto',
    // tintColor: '#FFFFFF',
  },
  headerText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
    flex: 0,
  },
  headerTilt: {
    flex: 0,
    bottom: -15,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    position: 'absolute',
    width: w(110),
    zIndex: -10,
    height: 30,
    // translateX: -10,
    // translateY: 24,
    transform: [
      {
        rotateZ: "4.4deg",
      },
    ]
  },
  categories: {
    // height: 106,
    // marginTop: -5,
    // marginBottom: 10
  },
  categoryItemContainer: {
    margin: 10,
    alignItems: 'flex-start',
  },
  categoryItemPhoto: {
    height: 70,
    width: 70,
    // borderRadius: 35,
  },
  categoryItemTitle: {
    marginTop: 5,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontSize: 14,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  deals: {
    minHeight: 250,
    marginBottom: 10
  },
  carousel: {
    color: 'white',
  },
  dealItemContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 250,
  },
  dealPhoto: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 250,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dealName: {
    fontFamily: DynamicAppStyles.fontFamily.bold,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    opacity: 0.8
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    // backgroundColor: 'green',
    paddingVertical: 8,
    marginTop: 210,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },

  foods: {},
  vendorItemContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 8,
    elevation: 1,
    padding: 10,
    shadowColor: DynamicAppStyles.colorSet[theme].grey,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
  },
  mapImage: {width: 25, height: 25},
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodPhoto: {
    width: '100%',
    height: 200,
  },
  foodInfo: {
    marginTop: 10,
    flexDirection: 'row',
  },
  foodName: {
    flex: 1,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    textAlign: 'left',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontSize: 15,
    marginVertical: 4,
  },
  foodPrice: {
    flex: 1,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    textAlign: 'right',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  title: {
    marginTop: 20,
    marginLeft: 5,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontSize: 20,
    marginBottom: 15
  },
  photo: {
    height: 300,
  },
  detail: {
    height: 60,
    width: 100,
    marginRight: 10,
  },

  description: {
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
    fontSize: 13,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSetContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSet: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: DynamicAppStyles.colorSet[theme].grey3,
  },
  count: {
    padding: 10,
    marginTop: 2,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 10,
    width: 50,
  },
  buttonText: {
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  mostPopular: {
    backgroundColor: DynamicAppStyles.colorSet[theme].whiteSmoke,
  },
  price: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    borderColor: DynamicAppStyles.colorSet[theme].grey3,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 50,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },
  actionButtonText: {
    color: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
  },
  footerContainer: {
    // display: 'none',
    flexDirection: 'row',
    margin: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    textAlign: 'center',
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: 'gray'
  }
});

export default styles;
