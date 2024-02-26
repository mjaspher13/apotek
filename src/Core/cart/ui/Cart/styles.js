import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';

const styles = (appStyles, theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[theme].mainThemeBackgroundColor,
    },
    emptyTitle: {
      flex: 1,
      alignSelf: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
      justifyContent: 'center',
      color: appStyles.colorSet[theme].mainTextColor,
    },
    flat: {
      flex: 1,
      margin: 10,
    },
    rowContainer: {
      flexDirection: 'row',
    },
    count: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 1,
      borderWidth: 1,
      fontFamily: appStyles.fontFamily.main,
      paddingTop: 3,
      paddingLeft: 5,
      paddingRight: 5,
      textAlign: 'center',
      color: appStyles.colorSet[theme].mainThemeForegroundColor,
      borderColor: appStyles.colorSet[theme].grey6,
    },
    attachment: {
      marginTop: 10,
      marginRight: 4,
      width: 22,
      height: 22,
      color: appStyles.colorSet[theme].mainTextColor,
    },
    price: {
      width: 70,
      paddingTop: 10,
      paddingBottom: 10,
      color: appStyles.colorSet[theme].mainTextColor,
      fontFamily: appStyles.fontFamily.bold,
      textAlign: 'right',
    },
    originalPrice: {
      width: 'auto',
      textDecorationLine: 'line-through',
      textShadowColor: appStyles.colorSet[theme].mainTextColor,
    },
    discounted: {
      color: 'green',
    },
    discountNotice: {
      paddingLeft: 20,
      color: appStyles.colorSet[theme].mainSubtextColor,
      fontSize: 14,
      paddingVertical: 12,
    },
    discountGoContainer: {
      borderColor: appStyles.colorSet[theme].mainThemeForegroundColor,
      borderWidth: 1,
      borderRadius: 8,
      margin: 16,
      marginTop: 0,
      padding: 10,
    },
    discountGoText: {
      color: appStyles.colorSet[theme].mainThemeForegroundColor,
      fontFamily: appStyles.fontFamily.regular,
    },
    title: {
      flex: 10,
      padding: 10,
      color: appStyles.colorSet[theme].mainTextColor,
      fontFamily: appStyles.fontFamily.bold,
      fontWeight: 'bold',
      textAlign: 'left',
    },
    rxListContainer: {
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 20,
    },
    rxListHeader: {
      paddingLeft: 20,
      color: appStyles.colorSet[theme].mainSubtextColor,
      fontFamily: appStyles.fontFamily.bold,
      fontSize: 16,
    },
    rxListItem: {
      flexDirection: 'row',
      paddingTop: 4,
      paddingBottom: 2,
    },
    rxListIcon: {
      width: 20,
      height: 20,
    },
    rxListText: {
      flex: 1,
      textDecorationLine: 'underline',
      color: 'blue',
      paddingLeft: 8,
    },
    actionButtonContainer: {
      padding: 16,
      backgroundColor: appStyles.colorSet[theme].mainThemeForegroundColor,
      marginBottom: 16,
      marginLeft: 16,
      marginRight: 16,
      borderRadius: 8,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: 'white',
    },
    emptyViewContainer: {
      marginTop: '25%',
      flex: 1,
    },
    loading: {
      position: 'absolute',
      backgroundColor: 'black',
      opacity: 0.8,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImageContainer: {
      zIndex: 99,
      // borderWidth: 1,
    },
    previewImageContainer2: {
      flex: 1,
      backgroundColor: 'black',
      position: 'absolute',
      opacity: 0.3,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewInstructions: {
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      opacity: 0.8,
      zIndex: 100,
      color: appStyles.colorSet[theme].mainTextColor,
      position: 'absolute',
      left: '30%',
      right: '30%',
      bottom: '10%',
      backgroundColor: 'black',
      borderRadius: 4,
    },
    previewImage: {
      position: 'absolute',

      left: 30,
      right: 30,
      top: 30,
      bottom: 30,
      width: null,
      height: null,
    },
  });

export default styles;
