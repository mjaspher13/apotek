import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../../../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';

const THEME = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
    backgroundColor: DynamicAppStyles.colorSet[THEME].mainThemeBackgroundColor,
  },
  subText: {
    fontSize: 14,
    marginTop: 3,
    color: DynamicAppStyles.colorSet[THEME].mainSubtextColor,
  },
  mainText: {
    fontSize: 16,
    marginTop: 3,
    color: DynamicAppStyles.colorSet[THEME].mainTextColor,
  },
  divider: {
    width: '100%',
    height: 10,
    backgroundColor: DynamicAppStyles.colorSet[THEME].whiteSmoke,
    marginVertical: 5,
  },
  button: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 4,
    backgroundColor: DynamicAppStyles.colorSet[THEME].mainThemeForegroundColor,
    height: 50,
    textAlignVertical: 'center',
  },
});

export default styles;
