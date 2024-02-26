import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles'
import {Appearance} from 'react-native-appearance';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h
} from 'react-native-responsive-screen';

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    flex: 1,
  },
  emptyState: {
    fontSize: DynamicAppStyles.fontSet.normal,
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginTop: h(40),
    textAlign: 'center',
    width: 300,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: h(2),
  },
  emptyViewContainer: {
    marginTop: '25%',
    flex: 1
  },
  listItemContainer: {
    borderBottomWidth: 0,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor
  },
  title: {
    fontSize: 16,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontWeight: '500'
  },
  subtitleView: {
    paddingTop: 5,
  },
  description: {
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
    fontSize: 13,
  },
  price: {
    fontSize: 16,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    marginTop: 10,
    // paddingLeft: 8,
  },
  rightIcon: {
    width: 100,
    height: 100,
    margin: -20,
  },
  tags: {
    height: 20,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainSubtextColor,
  },
  tagContainer: {
    // marginLeft: 8,
    flexDirection: 'row',
    flexWrap: "wrap",
  }
});

export default styles;
