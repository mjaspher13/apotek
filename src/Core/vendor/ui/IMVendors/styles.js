import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import {Appearance} from 'react-native-appearance';
const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = appStyles =>
  StyleSheet.create({
    vendorItemContainer: {
      flex: 1,
      marginHorizontal: 8,
      marginBottom: 8,
      elevation: 1,
      padding: 10,
      shadowColor: appStyles.colorSet[COLOR_SCHEME].grey,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.4,
      shadowRadius: 1,
      borderColor: '#000',
      borderRadius: 5,
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
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
      fontFamily: appStyles.fontFamily.bold,
      textAlign: 'left',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
      fontSize: 15,
      marginVertical: 4,
    },
    foodPrice: {
      flex: 1,
      fontFamily: appStyles.fontFamily.bold,
      textAlign: 'right',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    description: {
      color: appStyles.colorSet[COLOR_SCHEME].mainSubtextColor,
      fontSize: 13,
    },
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[COLOR_SCHEME].whiteSmoke,
    },
  });

export default dynamicStyles;
