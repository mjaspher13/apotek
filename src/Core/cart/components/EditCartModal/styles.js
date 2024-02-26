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
    buttonSetContainer: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSet: {
      flexDirection: 'row',
      borderWidth: 1,
      borderRadius: 25,
      borderColor: appStyles.colorSet[COLOR_SCHEME].grey6,
      alignItems: 'center',
    },
    buttonContainer: {
      padding: 10,
      width: 50,
    },
    buttonText: {
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    actionContainer: {
      flexDirection: 'row',
      marginTop: 35,
    },
    prescriptionButtonContainer: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    },
    prescriptionButtonText: {
      // fontFamily: appStyles.fontFamily.bold,
      // color: '#FFF',
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    },
    count: {
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
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
    price: {
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
    deleteItem: {
      color: '#FF0000',
      textAlign: 'center',
      marginBottom: 32,
      fontSize: 14,
      marginTop: 5
    }
  });

export default dynamicStyles;
