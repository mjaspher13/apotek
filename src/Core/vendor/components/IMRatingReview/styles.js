import {StyleSheet} from 'react-native';
const styles = appStyles =>
  StyleSheet.create({
    rating: {
      fontSize: 13,
      color: appStyles.colorSet.light.mainTextColor,
    },
    image: {
      height: 20,
      width: 20,
    },
    container: {
      paddingVertical: 6,
      flexDirection: 'row',
      color: appStyles.colorSet.light.grey,
    },
  });

export default styles;
