import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { connect } from 'react-redux';
import { instance as analytics } from '../../firebase/analytics';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import { Platform } from 'react-native';

const LoginScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);
  const [ eyeIcon, setEyeIcon ] = useState("eye-slash");

  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');

  function backButtonHandler() {
    props.navigation.pop();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backButtonHandler);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backButtonHandler);
    };
  }, [backButtonHandler]);

  const onPressLogin = () => {
    setLoading(true);
    authManager
      .loginWithEmailAndPassword(
        email && email.trim(),
        password && password.trim(),
        appConfig,
      )
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          analytics.logLogin({ method: 'email-password' });
          props.navigation.navigate('MainStack', { user: user, isGuest: false });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  const onFBButtonPress = () => {
    setLoading(true);
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;
        analytics.logLogin({ method: 'facebook' });
        props.setUserData({
          user: response.user,
        });
        props.navigation.navigate('MainStack', { user: user, isGuest: false });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
      setLoading(false);
    });
  };

  const onAppleButtonPress = async () => {
    authManager.loginOrSignUpWithApple(appConfig).then((response) => {
      if (response.user) {
        const user = response.user;

        props.setUserData({ user });
        analytics.logLogin({ method: 'apple' });
        props.navigation.navigate('MainStack', { user: user, isGuest: false });
      } else {
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{ text: IMLocalized('OK') }],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  const onForgotPassword = async () => {
    props.navigation.push('Sms', {
      isResetPassword: true,
      appStyles,
      appConfig,
    });
  };

  const changePwdType = () => {
    setEyeIcon(showPassword ? 'eye-slash' : 'eye')
    setShowPassword(!showPassword);
  };

  const passwordRef = React.createRef();

  return (
    <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity
          style={{ alignSelf: 'flex-start' }}
          onPress={() => props.navigation.goBack()}>
          <FastImage
            tintColor={appStyles.colorSet.mainThemeForegroundColor}
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
        <TextInput
          style={styles.InputContainer}
          textContentType="emailAddress"
          returnKeyType="next"
          keyboardType="email-address"
          autoFocus={true}
          placeholder={IMLocalized('E-mail')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.InputContainer,
              styles.passwordInput
            ]}
            ref={passwordRef}
            textContentType="password"
            placeholderTextColor="#aaaaaa"
            secureTextEntry={!showPassword}
            placeholder={IMLocalized('Password')}
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {Platform.OS === 'android' && <Icon
            style={styles.passwordIcon}
            name={eyeIcon}
            size={25}
            color={appStyles.colorSet[colorScheme].grey6}
            onPress={changePwdType} /> }
        </View>
        <View style={styles.forgotPasswordContainer}>
          <Button
            style={styles.forgotPasswordText}
            onPress={() => onForgotPassword()}>
            {IMLocalized('Forgot password?')}
          </Button>
        </View>
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onPressLogin()}>
          {IMLocalized('Log In')}
        </Button>
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => onFBButtonPress()}>
          {IMLocalized('Login With Facebook')}
        </Button>
        {appleAuth.isSupported && (
          <AppleButton
            cornerRadius={appStyles.sizeSet.radius}
            style={styles.appleButtonContainer}
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => onAppleButtonPress()}
          />
        )}
        {appConfig.isSMSAuthEnabled && (
          <Button
            containerStyle={styles.phoneNumberContainer}
            onPress={() =>
              props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            }>
            {IMLocalized('Login with phone number')}
          </Button>
        )}

        <TouchableOpacity>
          <Text style={styles.redirectSigninPrompt}>No account?</Text>
          <Button
            containerStyle={styles.redirectSigninButton}
            onPress={() => {
              props.navigation.navigate('Signup', {
                appStyles,
                appConfig
              })
            }}>Create one now.</Button>
        </TouchableOpacity>
        {loading && <TNActivityIndicator appStyles={appStyles} />}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

LoginScreen.navigationOptions = {
  headerShown: false,
}

export default connect(null, {
  setUserData,
})(LoginScreen);
