import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../DynamicAppStyles'

const font = DynamicAppStyles.fontFamily.main;
const styles = (theme) => StyleSheet.create({
    container: {
        
    },
    modalView: {
        color: 'black',
        padding: 20,
        backgroundColor: 'white',
    },
    titleStyle: {
        fontSize: 17.5,
        fontFamily: DynamicAppStyles.fontFamily.bold,
        marginBottom: 8,
    },
    defaultBodyStyle: {
        fontSize: 17,
    },
    okContainer: {
        alignSelf: 'flex-end',
    },
    okText: {
        color: 'black',
        fontFamily: DynamicAppStyles.fontFamily.bold ,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default styles;
