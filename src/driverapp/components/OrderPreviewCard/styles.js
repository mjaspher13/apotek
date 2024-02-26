import {StyleSheet} from 'react-native';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = appStyles =>
  StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 144,
        padding: 20,
        flex: 1,
    },
    contentView: {
        position: "relative",
        flex: 1,
    },
    textContainer: {
    },
    headline: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5
    },
    description: {
        fontSize: 12
    },
    buttonsContainer: {
        marginTop: 12,
        flexDirection: 'row',
    },
    actionButtonContainer: {
        borderRadius: 5,
        padding: 14,
        backgroundColor: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        alignSelf: "center",
      },
    actionButtonText: {
        color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
        fontSize: 14,
        fontFamily: appStyles.fontFamily.bold,
    },
    secondaryButtonContainer: {
        padding: 13,
        borderWidth: 1,
        borderColor: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        borderRadius: 5,
        alignSelf: "center",
        marginLeft: 5
    },
    secondaryButtonText: {
        color: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        fontSize: 14,
        fontFamily: appStyles.fontFamily.bold,
        textAlign: "center",
    }
  });

export default dynamicStyles;
