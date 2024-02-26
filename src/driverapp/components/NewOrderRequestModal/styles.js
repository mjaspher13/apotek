import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';
import {widthPercentageToDP as w} from 'react-native-responsive-screen';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = appStyles =>
  StyleSheet.create({
    container: {
      width: w(100),
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      alignItems: 'center',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    modalContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    buttonText: {
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 35,
    },
    actionButtonContainer: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      margin: 10,
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      fontSize: 16
    },
    title: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: appStyles.fontFamily.bold,
      padding: 10,
      marginVertical: 10,
      fontSize: 18,
      textAlign: 'center',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
      borderColor: appStyles.colorSet[COLOR_SCHEME].grey3,
    },
    cancel: {
      color: '#FF0000',
      textAlign: 'center',
      marginBottom: 32,
      fontSize: 14,
      marginTop: 5
    }
  });

export default dynamicStyles;
