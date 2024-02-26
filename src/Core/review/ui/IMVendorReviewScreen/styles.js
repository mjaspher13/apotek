import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = appStyles =>
  StyleSheet.create({
    container: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    horizontalPane: {
      flexDirection: 'row',
    },
    pad: {
      padding: 10,
      justifyContent: 'space-between',
    },
    reviewText: {
      fontSize: 15,
      paddingHorizontal: 10,
      fontWeight: 'bold',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    authorName: {
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
      fontSize: 15,
      fontWeight: 'bold',
    },
    date: {
      color: appStyles.colorSet[COLOR_SCHEME].mainSubtextColor,
      fontSize: 13,
    },
    headerRightContainer: {
      width: 25,
      height: 25,
      marginHorizontal: 10,
    },
    starBox: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    }
  });

export default dynamicStyles;
