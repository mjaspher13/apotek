import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = (appStyles, theme) =>
  StyleSheet.create({
    checkoutTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 20,
      color: appStyles.colorSet[theme].mainTextColor,
    },
    enclosing: {
      borderRadius: 4,
      padding: 14,
      marginLeft: 16,
      marginRight: 16,
      backgroundColor: appStyles.colorSet[theme].mainThemeForegroundColor,
    },
    optionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
      paddingVertical: 12,
      borderBottomColor: appStyles.colorSet[theme].grey0,
      borderTopColor: appStyles.colorSet[theme].grey0,
      backgroundColor: appStyles.colorSet[theme].mainThemeBackgroundColor,
      borderTopWidth: 1,
      borderBottomWidth: 1,
    },
    optionTile: {
      flex: 1,
      minWidth: 70,
      color: appStyles.colorSet[theme].mainThemeForegroundColor,
      fontSize: 14,
      fontWeight: '700',
    },
    options: {
      flex: 6.5,
      color: appStyles.colorSet[theme].mainTextColor,
      fontSize: 14,
      fontWeight: '600',
      // backgroundColor: 'red',
    },
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[theme].whiteSmoke,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      backgroundColor: appStyles.colorSet[theme].mainThemeForegroundColor,
      marginBottom: 30,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: 'white',
    },
    close: {
      zIndex: 10,
      position: 'absolute',
      padding: 12,
      right: 0,
      top: 0,
    },
  });

export default dynamicStyles;
