import { StyleSheet, Dimensions } from 'react-native';
import {Appearance} from 'react-native-appearance';
import DynamicAppStyles from '../../DynamicAppStyles';

const styles = (theme) => StyleSheet.create({
    container: {
        backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
        padding: 24,
    },
    headerContainer: {
        textAlign: 'center',
    },
    header: {
        fontSize: 24,
        color: DynamicAppStyles.colorSet[theme].mainTextColor,
    },
    questionContainer: {
        marginVertical: 8,
    },
    question: {
        fontWeight: 'bold',
        fontSize: 18,
        color: DynamicAppStyles.colorSet[theme].mainTextColor,
    },
    answer: {
        color: DynamicAppStyles.colorSet[theme].mainSubtextColor
    }
});

export default styles;
