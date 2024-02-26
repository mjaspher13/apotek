import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';
import DynamicAppStyles from '../../DynamicAppStyles';
const theme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  headerButtonContainer: {
    padding: 10,
  },
  headerButtonImage: {
    justifyContent: 'center',
    width: 25,
    height: 25,
    margin: 6,
    tintColor: DynamicAppStyles.navThemeConstants[theme].activeTintColor,
  },
});

export default styles;
