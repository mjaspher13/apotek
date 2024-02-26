import {Platform, Dimensions, I18nManager} from 'react-native';
import invert from 'invert-color';
import {Appearance} from 'react-native-appearance';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const COLOR_SCHEME = Appearance.getColorScheme();

const lightColorSet = {
  mainThemeBackgroundColor: '#ffffff',
  mainTextColor: '#555555',
  mainSubtextColor: '#7e7e7e',
  mainThemeForegroundColor: '#c2411f', // '#002c71', #dd5000 (based on TDSicon)
  hairlineColor: '#e0e0e0',
  grey0: '#eaeaea',
  grey3: '#e6e6f2',
  grey6: '#d6d6d6',
  grey9: '#939393',
  whiteSmoke: '#f5f5f5',
  grey: 'grey',
};

const darkColorSet = {
  mainThemeBackgroundColor: '#111111',
  mainTextColor: invert(lightColorSet.mainTextColor),
  mainSubtextColor: invert(lightColorSet.mainSubtextColor),
  mainThemeForegroundColor: lightColorSet.mainThemeForegroundColor,
  hairlineColor: '#5F5F5F', // invert(lightColorSet.hairlineColor),
  grey0: lightColorSet.grey9, // invert(lightColorSet.grey0),
  grey3: lightColorSet.grey6, // invert(lightColorSet.grey3),
  grey6: lightColorSet.grey3, // invert(lightColorSet.grey6),
  grey9: lightColorSet.grey0, // invert(lightColorSet.grey9),
  whiteSmoke: invert(lightColorSet.whiteSmoke),
  grey: 'grey',
};

const colorSet = {
  dark: darkColorSet,
  light: lightColorSet,
  'no-preference': lightColorSet,
  mainThemeBackgroundColor: lightColorSet.mainThemeBackgroundColor,
  mainTextColor: lightColorSet.mainTextColor,
  mainSubtextColor: lightColorSet.mainSubtextColor,
  mainThemeForegroundColor: lightColorSet.mainThemeForegroundColor,
  hairlineColor: lightColorSet.hairlineColor,
  grey0: lightColorSet.grey0,
  grey3: lightColorSet.grey3,
  grey6: lightColorSet.grey6,
  grey9: lightColorSet.grey9,
  whiteSmoke: lightColorSet.whiteSmoke,
  grey: 'grey',
};

const navThemeConstants = {
  light: {
    backgroundColor: '#fff',
    fontColor: '#000',
    headerStyleColor: '#E8E8E8',
    iconBackground: '#F4F4F4',
    activeTintColor: lightColorSet.mainThemeForegroundColor,
  },
  dark: {
    backgroundColor: invert('#fff'),
    fontColor: invert('#000'),
    headerStyleColor: invert('E8E8E8'),
    iconBackground: invert('#e6e6f2'),
    activeTintColor: darkColorSet.mainThemeForegroundColor,
  },
};
navThemeConstants.default = navThemeConstants.light;
navThemeConstants['no-preference'] = navThemeConstants.light;

const fontFamily = {
  main: 'FallingSky',
  bold: 'FallingSkyBd',
};

const iconSet = {
  logoText: require('../assets/images/LogoWithText.png'),
  logo: require('../assets/images/App_Icon.png'),
  settings: require('../assets/icons/Setting.png'),
  profile: require('../assets/icons/profile.png'),
  cart: require('../assets/icons/Cart.png'),
  search: require('../assets/icons/Search.png'),
  rx: require('../assets/images/Rx.png'),
  attachment: require('../assets/icons/clip.png'),
  menuHamburger: require('../assets/icons/Hamburger.png'),
  playButton: require('./CoreAssets/play-button.png'),
  close: require('./CoreAssets/close-x-icon.png'),
  home: require('../assets/icons/Home.png'),
  userAvatar: require('./CoreAssets/default-avatar.jpg'),
  backArrow: require('./CoreAssets/arrow-back-icon.png'),
  creditCardIcon: require('../assets/icons/credit-card-icon.png'),
  jcb: require('../assets/icons/jcb.png'),
  unionpay: require('../assets/icons/unionpay.png'),
  visaPay: require('../assets/icons/visa.png'),
  stripe: require('../assets/icons/stripe.png'),
  cod: require('../assets/icons/COD.png'),
  americanExpress: require('../assets/icons/american-express.png'),
  dinersClub: require('../assets/icons/diners-club.png'),
  discover: require('../assets/icons/discover.png'),
  mastercard: require('../assets/icons/mastercard.png'),
  paymongo: require('../assets/icons/paymongo.png'),
  create: require('../assets/icons/create.png'),
  medicines: require('../assets/icons/Medicine.png'),
  services: require('../assets/icons/Services.png'),
  vaccines: require('../assets/icons/Vaccine.png'),
  testing: require('../assets/icons/Testing.png'),
};

const fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
  title: 30,
  content: 20,
};

const sizeSet = {
  buttonWidth: '65%',
  inputWidth: '80%',
  radius: 25,
};

const styleSet = {
  menuBtn: {
    container: {
      backgroundColor: colorSet[COLOR_SCHEME].grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: 'black',
      width: 16,
      height: 16,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1,
    },
    input: {
      backgroundColor: colorSet[COLOR_SCHEME].inputBgColor,
      borderRadius: 10,
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: lightColorSet.mainThemeForegroundColor,
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },
};

const StyleDict = {
  fontFamily,
  colorSet,
  navThemeConstants,
  fontSet,
  sizeSet,
  iconSet,
  styleSet,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
};

export default StyleDict;
