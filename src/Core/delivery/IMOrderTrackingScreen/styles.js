import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';
import {widthPercentageToDP as w} from 'react-native-responsive-screen'
const COLOR_SCHEME = Appearance.getColorScheme();

const styles = (appStyles, theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[theme].whiteSmoke,
      paddingTop: 20,
    },
    upperPane: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
      alignItems: 'center'
    },
    time: {
      color: appStyles.colorSet[theme].mainTextColor,
      fontSize: 27,
      fontWeight: 'bold',
    },
    eta: {
      fontSize: 14,
      marginHorizontal: 10,
      color: appStyles.colorSet[theme].mainSubtextColor,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    filled: {
      width: 20,
      height: 4,
      backgroundColor:
        appStyles.colorSet[theme].mainThemeForegroundColor,
    },
    overlay: {
      bottom: 15,
      width: w(100),
      elevation: 4,
      shadowOffset: {width: 4, height: 4},
    },
    unfilled: {
      width: 20,
      height: 4,
      backgroundColor: appStyles.colorSet[theme].mainTextColor,
    },
    progressPane: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: 20,
      marginHorizontal: 10,
    },
    prepText: {
      fontSize: 18,
      color: appStyles.colorSet[theme].mainTextColor,
      paddingRight: 5,
      marginHorizontal: 10,
      fontWeight: 'bold',
      marginBottom: 10
    },
    bar: {
      marginVertical: 20,
      alignSelf: 'center',
      marginHorizontal: 10,
    },
    image: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      marginVertical: 100,
      elevation: 4,
      shadowOffset: {width: 4, height: 4},
    },
    mapStyle: {
      width: '100%',
      height: 300,
      marginVertical: 20,
    },
    scroll: {
      backgroundColor: appStyles.colorSet[theme].whiteSmoke,
    },
    mapCarIcon: {
      height: 32,
      width: 32,
      tintColor: appStyles.colorSet[theme].mainThemeForegroundColor,
    },
    markerTitle: {
      backgroundColor: appStyles.colorSet[theme].mainThemeBackgroundColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 5,
      color: appStyles.colorSet[theme].mainTextColor,
      fontSize: 12,
      fontWeight: 'bold',
      alignItems: "center",
      overflow: "visible"
    },
    marker: {
      overflow: 'visible'
    },
    thirdParty: {
      marginBottom: 24,
      marginHorizontal: 24,
      color: appStyles.colorSet[theme].mainTextColor,
    },
    cancelContainer: {
      height: 60,
      marginHorizontal: 24,
      marginBottom: 24,
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[theme].mainThemeBackgroundColor,
      borderColor: appStyles.colorSet[theme].mainThemeForegroundColor,
      borderWidth: 1,
      borderRadius: 5
    },
    cancelText: {
      color: appStyles.colorSet[theme].mainThemeForegroundColor,
    },
    receiveContainer: {
      height: 60,
      marginHorizontal: 24,
      marginBottom: 24,
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[theme].mainThemeForegroundColor,
      borderRadius: 5,
    },
    receiveText: {
      fontWeight: 'bold',
      color: appStyles.colorSet[theme].whiteSmoke,
    }
  });

export default styles;
