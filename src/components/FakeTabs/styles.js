import { StyleSheet } from "react-native";
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from 'react-native-appearance';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
const COLOR_SCHEME = Appearance.getColorScheme();

export default StyleSheet.create({
    container: {
      paddingTop: 4, 
      backgroundColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
      height: 58,
      flexDirection: 'row',
      borderTopColor: 'grey',
    },
    tabContainer: {
      // flex: 1,
      // textAlign: 'center',
    },
    label: {
      color: 'white',
      fontSize: 12,
    },
    tabImage: {
      tintColor: 'white',
      width: 32,
      height: 32,
    }
});
