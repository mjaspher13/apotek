import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from 'react-native-responsive-screen';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = appStyles =>
  StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignSelf: 'center',
      height: h(80),
      padding: 5,
      width: w(100),
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
      marginBottom: 30,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    reviewText: {
      fontSize: 20,
      margin: 10,
      fontWeight: 'bold',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    input: {
      fontSize: 15,
      color: appStyles.colorSet[COLOR_SCHEME].mainSubtextColor,
    },
  });

export default dynamicStyles;
