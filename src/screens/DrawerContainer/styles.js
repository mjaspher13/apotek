import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  content: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flex: 0,
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'left',
  }
});

export default styles;
