import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import {
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    logo: {
      width: 250,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: h(10),
      // marginTop: -100,
    },
    logoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      // tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
    },
    caption: {
      fontSize: 16,
      paddingHorizontal: 50,
      marginBottom: 20,
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    loginContainer: {
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      marginTop: 30,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      fontSize: 17,
    },
    signupContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderRadius: appStyles.sizeSet.radius,
      borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 20,
      height: 45,
    },
    signupText: {
      fontSize: 17,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    guestContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderRadius: appStyles.sizeSet.radius,
      borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
      borderColor: 'transparent',
      marginTop: 20,
      height: 45,
      marginBottom: 60,
    },
    guestText: {
      fontSize: 17,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    }
  });
};

export default dynamicStyles;
