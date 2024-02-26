import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      width: '95%',
      width: Platform.OS === 'ios' ? '110%' : '95%',
      alignSelf: 'center',
      marginRight: 40,
      // marginBottom: 4,
    },
    cancelButtonText: {
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 16,
      marginBottom: 5,
    },
    searchInput: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
    },
  });
};

export default dynamicStyles;
