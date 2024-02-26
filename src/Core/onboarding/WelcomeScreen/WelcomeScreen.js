import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-native-button';
import { ScrollView, Text, View, AppState, Platform, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { getChannel } from '../../chat/firebase/channel';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { updateUser } from '../../firebase/auth';

const WelcomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const currentUser = useRef({});

  useEffect(() => {
    registerOnNotificationOpenedApp();
    tryToLoginFirst();
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    currentUser.current = props.user;
  }, [props.user]);

  const handleAppStateChange = async (nextAppState) => {
    const userID = currentUser.current?.id || currentUser.current?.userID;

    if (nextAppState === 'active' && userID && Platform.OS === 'ios') {
      updateUser(userID, { badgeCount: 0 });
    }
  };

  const tryToLoginFirst = async () => {
    setIsLoading(true);
    authManager
      .retrievePersistedAuthUser(appConfig)
      .then((response) => {
        setIsLoading(false);
        if (response.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          props.navigation.navigate('MainStack', { user: user });
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const registerOnNotificationOpenedApp = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const {
        data: { channelID, type },
      } = remoteMessage;

      if (type === 'chat_message') {
        handleChatMessageType(channelID);
      }
    });
    messaging().onMessage((remoteMessage) => {
      if (remoteMessage && Platform.OS === 'ios') {
        const userID = currentUser.current?.id || currentUser.current?.userID;
        updateUser(userID, { badgeCount: 0 });
      }
    });
  };

  const handleChatMessageType = (channelID) => {
    getChannel(channelID).then((channel) => {
      if (channel) {
        props.navigation.navigate('PersonalChat', {
          channel,
          appStyles,
        });
      }
    });
  };

  if (isLoading == true) {
    return <TNActivityIndicator appStyles={appStyles} />;
  }

  return (
    <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}>
      <View style={styles.logo}>
        <FastImage style={styles.logoImage}
          source={appStyles.iconSet.logoText}
          resizeMode={FastImage.resizeMode.contain} />
      </View>
      <Text style={styles.title}>
        {appConfig.onboardingConfig.welcomeTitle}
      </Text>
      <Text style={styles.caption}>
        {appConfig.onboardingConfig.welcomeCaption}
      </Text>
      <TouchableOpacity
        style={styles.loginContainer}
        // containerStyle={styles.loginContainer}
        // style={styles.loginText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            : props.navigation.push('Login', { appStyles, appConfig });
        }}>
        <Text style={styles.loginText}>{IMLocalized('Log In')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupContainer}
        // containerStyle={styles.signupContainer}
        // style={styles.signupText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('Sms', {
                isSigningUp: true,
                appStyles,
                appConfig,
              })
            : props.navigation.push('Signup', { appStyles, appConfig });
        }}>
        <Text style={styles.signupText}>{IMLocalized('Sign Up')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.guestContainer}
        onPress={() => {
          props.navigation.navigate('HomeGuest', {
            isGuest: true,
            appStyles,
            appConfig,
          })
        }}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

WelcomeScreen.navigationOptions = {
  headerShown: false,
};

const mapStateToProps = ({ auth, chat }) => {
  return {
    user: auth.user,
    channels: chat.channels,
  };
};

export default connect(mapStateToProps, {
  setUserData,
})(WelcomeScreen);
