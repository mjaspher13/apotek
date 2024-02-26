import { Platform, StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from 'react-native-appearance';
import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
    flex: 1,
    padding: 10,
    width: w(100),
    height: h(80),
    marginTop: Platform.OS === 'ios' ? 40 : undefined,
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    flex: 1,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontSize: 25,
    marginVertical: 12
  },
  close: {
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontSize: 23,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    marginVertical: 12,
    marginRight: 8,
    marginLeft: 8,
  },
  zoomPreviewModal: {
    backgroundColor: '#00000099',
    flexDirection: 'row',
    height: h(100),
    width: w(100),
    margin: 0,
  },
  zoomablePhotoContainer: {
    flex: 1,
  },
  zoomedPhoto: {
    flex: 1,
  },
  gallery: {
    position: 'absolute',
    maxWidth: '100%',
    height: 75,
    bottom: 10,
    marginBottom: 10,
  },
  galleryItem: {
    margin: 3,
    height: 65,
    width: 65,
  },
  zoomCloseContainer: {
    zIndex: 10,
    borderRadius: 23,
    backgroundColor: 'gray',
    position: 'absolute',
    padding: 0,
    top: 50,
    width: 46,
    height: 46,
    right: 10,
    flex: 0,
  },
  zoomClose: {
    color: 'lightgrey',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
    height: 46,
    lineHeight: 46,
  },
  photo: {
    width: 'auto',
    height: 200,
    marginTop: 2,
    marginBottom: 2,
  },
  detail: {
    height: 65,
    width: 65,
    marginBottom: 5,
  },
  detailPhotos: {
    height: 65,
    marginTop: 10,
  },
  description: {
    marginTop: 20,
    marginBottom: 8,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tags: {
    height: 20,
    backgroundColor: DynamicAppStyles.colorSet[theme].mainSubtextColor,
  },
  packaging: {
    marginTop: 20,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  minimumOrderQuantity: {
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
  },
  rxContainer: {
    borderRadius: 6,
    borderColor: 'pink',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    textAlign: 'center'
  },
  rxProductWarning: {
    color: '#dd1111',
    marginBottom: 8,
  },
  rxProductInstructions: {
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    marginBottom: 20,
  },
  buttonSetContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonSet: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: DynamicAppStyles.colorSet[theme].grey6,
  },
  count: {
    padding: 10,
    marginTop: 2,
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  outOfStock: {
    color: 'red',
  },
  buttonContainer: {
    padding: 10,
    width: 50,
  },
  buttonText: {
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
  },
  price: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    fontFamily: DynamicAppStyles.fontFamily.bold,
    padding: 10,
    textAlign: 'center',
    color: DynamicAppStyles.colorSet[theme].mainTextColor,
    borderColor: DynamicAppStyles.colorSet[theme].grey3,
  },
  prescriptionPreview: {
    marginLeft: '30%',
    marginTop: 8,
    height: 180,
    width: '40%',
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    backgroundColor:
      DynamicAppStyles.colorSet[theme].mainThemeForegroundColor,
  },
  actionButtonText: {
    fontFamily: DynamicAppStyles.fontFamily.bold,
    color: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor,
  },
  discountHint: {
    marginTop: -10,
    color: DynamicAppStyles.colorSet[theme].mainSubtextColor,
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default styles;
