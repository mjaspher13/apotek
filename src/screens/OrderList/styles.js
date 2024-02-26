import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from "react-native-appearance";
import dynamicStyles from '../../Core/truly-native/TNTouchableIcon/styles';

const styles = (theme) => StyleSheet.create({
  flat: {
    flex: 1,
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
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
  headerTitle: {
    
    // position: 'absolute', // Commented out for no photo
    // top: 30,
    // left: 0,
    // right: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    // color: 'white',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontSize: 14,
    opacity: 0.8
  },
  headerTitleID: {
    fontSize: 16,
    opacity: 0.9,
    marginVertical: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
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
    color: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    borderColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    borderWidth: 1,
    borderRadius: 3
  },
  price: {
    padding: 10,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    flex: 1,
    padding: 10,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  total: {
    flex: 3,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    borderColor: DynamicAppStyles.colorSet.grey3,
  },
  actionButtonContainer: {
    flex: 2,
    borderRadius: 5,
    padding: 16,
    marginRight: 40,
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },
  actionButtonText: {
    color: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    fontSize: 12,
    fontFamily: DynamicAppStyles.fontFamily.bold,
  },
  emptyContainer: {
    marginTop: '25%',
  },
  emptyText: {
    
  }
});

export default styles;
