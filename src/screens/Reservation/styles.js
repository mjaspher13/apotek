import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from "react-native-appearance";

const COLOR_SCHEME = Appearance.getColorScheme()

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  photo: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  info: {
    padding: 20,
    alignItems: 'center',
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'center',
  },
  title: {
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
    fontSize: 25,
  },
  description: {
    marginTop: 10,
    fontFamily: DynamicAppStyles.fontFamily.main,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 5,
    width: '100%',
    backgroundColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  secondaryButtonContainer: {
    marginTop: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    padding: 10,
  },
  secondaryButtonText: {
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
    fontSize: 14
  },
  textInputContainer: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: DynamicAppStyles.colorSet[COLOR_SCHEME].grey3,
    borderRadius: 5,
  },
  textInput: {
    height: 42,
    paddingLeft: 10,
    paddingRight: 10,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
  },
});

export default styles;
