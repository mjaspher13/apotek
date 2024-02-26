import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles'

const styles = (theme) => StyleSheet.create({
    container: {
        padding: 8,
        paddingBottom: 6,
        margin: 2,
        borderWidth: 1,
        borderRadius: 24,
    },
    outlineContainer: {
        backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
        borderColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    },
    solidContainer: {
        borderColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
        backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    },
    outlineText: {
        fontSize: 12,
        color: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    },
    solidText: {
        fontSize: 12,
        color: 'white', // Against main color,
    },
})

export default styles;
