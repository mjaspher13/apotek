import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles'
import {
    heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const styles = (theme) => StyleSheet.create({
    emptyViewContainer: {
        paddingTop: '25%',
        flex: 1,
        backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    },
    emptyState: {
        fontSize: DynamicAppStyles.fontSet.normal,
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginTop: h(40),
        textAlign: 'center',
        width: 300,
        color: DynamicAppStyles.colorSet[theme].mainTextColor,
    }
});

export default styles;
