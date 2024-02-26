import {widthPercentageToDP as w} from 'react-native-responsive-screen';
import {Appearance} from 'react-native-appearance';
import {StyleSheet, I18nManager} from 'react-native';
import {
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';

const dynamicStyles = (appStyles, theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: w(100),
      backgroundColor:
        appStyles.colorSet[theme].mainThemeBackgroundColor,
      alignSelf: 'center',
      paddingTop: 20
    },
    modal: {
      justifyContent: 'flex-end',
    },
    horizontalPane: {
      flexDirection: 'row',
      padding: 3,
      justifyContent: 'space-between',
      marginVertical: 10,
      alignItems: 'center',
    },
    textInputLabel: {
      fontSize: 14,
      color: appStyles.colorSet[theme].mainTextColor,
      width: w(50),
      textAlign: 'right',
      flex: 1,
      marginRight: 10,
      fontWeight: 'bold'
    },
    textInput: {
      fontSize: appStyles.fontSet.normal,
      color: appStyles.colorSet[theme].mainTextColor,
      textAlign: 'left',
      flex: 3,
      height: 42,
      borderWidth: 1,
      borderColor: appStyles.colorSet[theme].grey3,
      paddingLeft: 20,
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: 5,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      marginRight: 20
    },
    pickerContainer: {
      fontSize: appStyles.fontSet.normal,
      backgroundColor: appStyles.colorSet[theme].mainThemeBackgroundColor,
      flex: 3,
      borderWidth: 1,
      borderColor: appStyles.colorSet[theme].grey3,
      borderRadius: 5,
      height: 42,
      marginRight: 20,
      marginLeft: -4,
      paddingLeft: 10,
      flexDirection: 'column',
    },
    picker: {
      marginTop: -6,
      color: appStyles.colorSet[theme].mainTextColor,
      width: '100%',
      ...Platform.select({
        ios: {
          backgroundColor: appStyles.colorSet.whiteSmoke,
          borderRadius: 12,
        },
        default: {}
      })
    },
    iosPickerModal: {
      margin: 0,
      height: h(40),
    },
    iosPickerSelected: {
      fontSize: appStyles.fontSet.normal,
      color: appStyles.colorSet[theme].mainTextColor,
      paddingLeft: 10,
      paddingTop: 8,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor:
        appStyles.colorSet[theme].mainThemeForegroundColor,
      marginVertical: 30,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: 'white',
      fontSize: 14
    },
  });

export default dynamicStyles;
