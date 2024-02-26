import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../../DynamicAppStyles';
import { Appearance } from "react-native-appearance";

const COLOR_SCHEME = Appearance.getColorScheme()

const styles = StyleSheet.create({
    emptyViewContainer: {
        marginTop: '25%',
        flex: 1
    },
    flat: {
        flex: 1,
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      },
    container: {
        marginBottom: 30,
        flex: 1,
        padding: 10,
      },
    photo: {
        width: '100%',
        height: 100,
      },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    address: {
      paddingTop: 8,
      paddingBottom: 8,
        // position: 'absolute',
        // top: 16,
        // left: 16,
        // right: 16,
        color: '#eeeeee',
        // opacity: 0.8,
        fontWeight: 'bold',
        textAlign: "center"
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
        fontWeight: 'bold',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 2,
        paddingBottom: 2,
        textAlign: 'center',
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        backgroundColor:
          DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
        borderColor:
          DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        borderWidth: 1,
        borderRadius: 3,
      },
    price: {
        padding: 10,
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
        fontFamily: DynamicAppStyles.fontFamily.bold,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    title: {
        flex: 1,
        padding: 10,
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
        fontFamily: DynamicAppStyles.fontFamily.bold,
        fontWeight: 'bold',
        textAlign: 'left',
      },
    buttonsContainer: {
        flexDirection: "row",
        flex: 2
      },
    actionContainer: {
        flexDirection: 'row',
        marginTop: 30,
      },
    total: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: DynamicAppStyles.fontFamily.bold,
        fontWeight: 'bold',
        padding: 5,
        textAlign: 'center',
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
        borderColor: DynamicAppStyles.colorSet.grey3,
      },
    statusText: {
        marginRight: 8,
        color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        fontSize: 14,
        borderWidth: 1,
        borderColor: DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
        borderRadius: 5,
        textAlign: "center",
        alignItems: "center",
        alignSelf: 'center',
        padding: 10
      }
});

export default styles;
