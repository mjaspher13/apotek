import {StyleSheet} from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles'
import {Appearance} from 'react-native-appearance';
import {heightPercentageToDP as h} from 'react-native-responsive-screen';

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    flex: 1,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: h(2),
  },
  modalView: {
    padding: 12,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    borderRadius: 12,
    width: '100%',
  },
  mapImage: {width: 25, height: 25},
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  description: {
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
    fontSize: 13,
  },
  rightIcon: {
    width: 100,
    height: 100,
    margin: -20,
  },
  price: {
    fontSize: 16,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    marginTop: 10,
  },
  filterButton: {
    width: 48,
    height: 48,
  },
  filterHeader: {
    fontSize: 18,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  searchHints: {
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
  },
  buttonGroupContainer: {
    borderColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
  },
  selectedButtonGroupContainer: {
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },
  buttonGroupText: {
    color: DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },
  selectedButtonGroupText: {
    color: 'white',
  },
  searchTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  searchPriceView: {
    flexDirection: 'row',
  },
  dockLeft: {
    textAlign: 'left',
    flex: 1,
  },
  dockRight: {
    flex: 1,
    textAlign: 'right',
  },
  tags: {
    height: 20,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainSubtextColor,
  },
  tagContainer: {
    // marginLeft: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default styles;
