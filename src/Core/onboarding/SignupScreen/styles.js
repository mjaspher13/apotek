import { StyleSheet, Dimensions, I18nManager } from 'react-native';

const { height } = Dimensions.get('window');
const imageSize = height * 0.232;
const photoIconSize = imageSize * 0.27;

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
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 30,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 35,
    },

    content: {
      paddingLeft: 50,
      paddingRight: 50,
      textAlign: 'center',
      fontSize: appStyles.fontSet.middle,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    loginContainer: {
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 30,
    },
    loginText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    placeholder: {
      color: 'red',
    },
    InputContainer: {
      flexDirection: 'row',
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
    datePickerLabel: {
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      paddingTop: 10,
      paddingBottom: 8,
    },
    datePicker: {
      width: '100%',
    },
    iosPickerModal: {
      width: '100%',
      backgroundColor: appStyles.colorSet['light'].mainThemeBackgroundColor,
      borderRadius: 8,
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 4,
    },
    idUploadHint: {
      width: '80%',
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
    },
    idToggleContainer: {
      width: '80%',
      flexDirection: 'row',
      height: 42,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    idToggleText: {
      height: '100%',
      alignItems: 'center',
      textAlignVertical: 'center',
    },
    idUploadContainer: {
      alignSelf: 'center',
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      borderWidth: 1,
      width: appStyles.sizeSet.buttonWidth,
      padding: 10,
      marginTop: 10,
    },
    idUploadAction: {
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    idPreview: {
      marginTop: 10,
      borderRadius: 10,
      alignSelf: 'center',
      backgroundColor: colorScheme === 'dark' ? '#333' : '#EEE',
      width: '80%',
      height: 200, 
    },
    
    signupContainer: {
      alignSelf: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: appStyles.sizeSet.radius,
      padding: 10,
      marginTop: 50,
    },
    signupText: {
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imageBlock: {
      flex: 2,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      height: imageSize,
      width: imageSize,
      borderRadius: imageSize,
      shadowColor: '#006',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      overflow: 'hidden',
    },
    formContainer: {
      width: '100%',
      flex: 4,
      alignItems: 'center',
    },
    photo: {
      marginTop: imageSize * 0.77,
      marginLeft: -imageSize * 0.29,
      width: photoIconSize,
      height: photoIconSize,
      borderRadius: photoIconSize,
    },

    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#d9d9d9',
      opacity: 0.8,
      zIndex: 2,
    },
    orTextStyle: {
      color: 'black',
      marginTop: 20,
      marginBottom: 10,
      alignSelf: 'center',
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    PhoneNumberContainer: {
      marginTop: 10,
      marginBottom: 10,
      alignSelf: 'center',
    },
    smsText: {
      color: '#4267b2',
    },
    tos: {
      marginTop: 40,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30,
      marginBottom: 16,
    },
  });
};

export default dynamicStyles;
