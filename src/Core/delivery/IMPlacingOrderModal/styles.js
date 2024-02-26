import {StyleSheet, Dimensions} from 'react-native';
import DynamicAppStyles from '../../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = (theme) => StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      width: wp(100),
      height: hp(70),
      marginTop: hp(5),
      justifyContent: 'flex-start',
      backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
      alignSelf: 'center',
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
    },
    title: {
      fontSize: 28,
      margin: 12,
      marginTop: 30,
      fontWeight: 'bold',
      color: DynamicAppStyles.colorSet[theme].mainTextColor,
    },
    text: {
      fontSize: 18,
      color: DynamicAppStyles.colorSet[theme].mainTextColor,
      flexWrap: 'wrap',
      width: 300,
      // flex: 1,
      fontWeight: 'bold'
    },
    description: {
      fontSize: 14,
      color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
      marginTop: 5
    },
    addressPane: {
      marginLeft: 20,
      flexDirection: 'row',
      marginVertical: 30,
      alignItems: 'center',
    },
    tick: {
      width: 20,
      height: 20,
      marginRight: 15,
    },
    line: {
      width: wp(80),
      alignSelf: 'center',
      height: 0.5,
      backgroundColor: DynamicAppStyles.colorSet[theme].hairlineColor,
    },
    orderPane: {
      flexDirection: 'row',
      marginVertical: 10,
      marginLeft: 30,
      alignItems: 'flex-start'
    },
    productItem: {
      flex: 1,
      marginTop: -2,
      fontSize: 12,
      color: DynamicAppStyles.colorSet[theme].mainTextColor,
      fontWeight: 'bold',
    },
    number: {
      flex: 0,
      padding: 4,
      backgroundColor: '#EDEEED',
      marginRight: 15,
      borderRadius: 3,
      width: 35,
      textAlign: 'center',
    },
    progress: {
      position: 'absolute',
      top: 35,
      right: 20,
      zIndex: 777,
    },
    undo: {
      padding: 10,
      paddingHorizontal: 15,
      backgroundColor: '#EDEEED',
      marginRight: 15,
      borderRadius: 22,
      fontSize: 16,
      textAlign: 'center',
      // position: 'absolute',
      // bottom: 30,
      marginBottom: 12,
      alignSelf: 'center',
      color: '#333333',
      fontWeight: 'bold'
    },
});

export default styles;
