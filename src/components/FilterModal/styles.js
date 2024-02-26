import { StyleSheet } from "react-native";
import DynamicAppStyles from '../../DynamicAppStyles';
import {Appearance} from 'react-native-appearance';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';

const COLOR_SCHEME = Appearance.getColorScheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: w(100),
    height: h(80),
    marginTop: h(5),
    alignSelf: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor:
      DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalHeaderContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: DynamicAppStyles.colorSet[COLOR_SCHEME].grey0,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  singleFilterContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: DynamicAppStyles.colorSet[COLOR_SCHEME].grey0,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTitle: {
    marginTop: 15,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].mainTextColor,
    fontSize: 15,
  },
  filterSubtitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    color: DynamicAppStyles.colorSet[COLOR_SCHEME].grey,
  },
  doneContainer: {
    zIndex: 11212,
    right: 10,
    position: 'absolute',
  },
  scrollView: {
    width: w(100),
  },
});

export default styles;
