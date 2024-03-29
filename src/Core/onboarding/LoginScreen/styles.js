import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    contentContainer: {
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 20,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 30,
    },
    loginContainer: {
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    loginText: {
      color: '#ffffff',
    },
    placeholder: {
      color: 'red',
    },
    InputContainer: {
      height: 42,
      borderWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      paddingLeft: 20,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 25,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    passwordContainer: {
      flexDirection: 'row',
      width: '80%',
      alignSelf: 'center',
    },
    passwordInput: {
      width: '100%',
    },
    passwordIcon: {
      position: 'absolute',
      right: 10,
      top: 28,
      zIndex: 99,
    },

    facebookContainer: {
      width: '70%',
      backgroundColor: '#4267B2',
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    appleButtonContainer: {
      width: '70%',
      height: 44,
      marginTop: 30,
      alignSelf: 'center',
    },
    facebookText: {
      color: '#ffffff',
    },
    phoneNumberContainer: {
      marginTop: 20,
    },
    forgotPasswordContainer: {
      width: '80%',
      alignSelf: 'center',
      alignItems: 'flex-end',
    },
    forgotPasswordText: {
      fontSize: 14,
      padding: 4,
    },
    redirectSigninPrompt: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      alignSelf: 'center',
      marginTop: 40,
    },
    redirectSigninButton: {
      width: '70%',
      padding: 10,
      alignSelf: 'center',
      borderRadius: 25,
    }
  });
};

export default dynamicStyles;
