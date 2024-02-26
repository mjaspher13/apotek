import {Appearance} from 'react-native-appearance';
import {StyleSheet} from 'react-native';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = (appStyles, theme) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      marginVertical: 2,
      paddingVertical: 5,
      alignItems: 'center',
    },
    visaIcon: {
      width: 25,
      height: 25,
      marginRight: 10,
      opacity: 0.7,
    },
    cardText: {
      color: appStyles.colorSet[theme].mainThemeForegroundColor,
    },
    tick: {
      width: 20,
      height: 20,
      marginHorizontal: 10,
    },
    actionButtonContainer: {
      padding: 16,
      backgroundColor:
        appStyles.colorSet[theme].mainThemeForegroundColor,
      marginVertical: 30,
      borderRadius: 16,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: 'white',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 10,
      backgroundColor:
        appStyles.colorSet[theme].mainThemeBackgroundColor,
    },
    cardImage: {
      width: 200,
      height: 150,
      marginVertical: 25,
      alignSelf: 'center',
    },
    line: {
      backgroundColor:
        appStyles.colorSet[theme].mainThemeForegroundColor,
      height: 0.5,
      width: '100%',
      opacity: 0.4,
      marginVertical: 3,
    },
  });

export default dynamicStyles;
