import { StyleSheet } from 'react-native';

export const AppStyles = {
  color: {
    main: '#5ea23a',
    text: '#555555',
    white: 'white',
    facebook: '#4267b2',
    grey: 'grey',
    placeholder: '#a0a0a0',
  },
  fontSize: {
    title: 30,
    content: 20,
    normal: 16,
  },
  buttonWidth: {
    main: '70%',
  },
  textInputWidth: {
    main: '80%',
  },
  fontName: {
    main: 'FallingSky',
    bold: 'FallingSkyBd',
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
};

export const ButtonStyle = StyleSheet.create({
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.main,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 35,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  signupContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    borderWidth: 1,
    borderColor: AppStyles.color.text,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  headerButtonContainer: {
    padding: 10,
  },
  headerButtonImage: {
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 6,
  },
});

export const TextStyle = StyleSheet.create({
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.main,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 25,
    paddingRight: 25,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
});

export const TextInputStyle = StyleSheet.create({
  placeholder: {
    color: 'red',
  },
  container: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 25,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
});

export const AppIcon = {
  style: {
    tintColor: AppStyles.color.tint,
    width: 25,
    height: 25,
  },
  images: {
    accountDetail: require('../assets/icons/account-detail.png'),
    settings: require('../assets/icons/settings.png'),
    contactUs: require('../assets/icons/contact-us.png'),
    delivery: require('../assets/icons/delivery.png'),
    favoriteRestaurant: require('../assets/icons/love.png'),
  },
};

export const FoodListItemStyle = StyleSheet.create({
  title: {
    fontSize: 18,
    color: AppStyles.color.text,
  },
  subtitleView: {
    paddingTop: 5,
  },
  description: {
    color: AppStyles.color.text,
    paddingLeft: 10,
  },
  price: {
    fontSize: 16,
    color: AppStyles.color.text,
    marginTop: 10,
    paddingLeft: 10,
  },
  rightIcon: {
    width: 100,
    height: 100,
  },
});

export const CategoryListItemStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: 200,
    height: 200,
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontWeight: 'bold',
    color: AppStyles.color.text,
    fontFamily: AppStyles.fontName.bold,
  },
  image: {
    height: 200,
    width: '50%',
    flex: 1,
  },
});
