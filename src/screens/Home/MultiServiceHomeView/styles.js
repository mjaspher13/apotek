import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {heightPercentageToDP as h} from 'react-native-responsive-screen';

const COLOR_SCHEME = Appearance.getColorScheme();
const styles = StyleSheet.create({
  container: {
    backgroundColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  serviceButtonContainer: {
    height: 100,
    borderRadius: 50,
    flexShrink: 1,
    padding: 40,
    margin: 10,
    backgroundColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
  },
  serviceButtonText: {
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
  }
});

export default styles;
