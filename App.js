import React, {useEffect, useState} from 'react';

import {AppRegistry, LogBox, Linking, Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {setI18nConfig} from './src/Core/localization/IMLocalization';
import {AppNavigator} from './src/navigations/AppNavigation';
import {NavigationActions} from 'react-navigation';
import DynamicAppStyles from './src/DynamicAppStyles';
import {AppearanceProvider, Appearance} from 'react-native-appearance';
import reduxStore from './src/redux/store';
import SettingsAPI from './src/firebase/settings';
import {AppLink} from 'react-native-fbsdk';

const App = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    LogBox.ignoreLogs(['Require cycle']);
    setI18nConfig();
    Appearance.addChangeListener(({colorScheme}) => {
      setColorScheme(colorScheme);
    });
  }, []);

  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      const currentUser = reduxStore.getState()?.auth.user;
      if (currentUser.id) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'View',
              onPress: () => {
                const action = NavigationActions.navigate({
                  routeName: 'OrderTrackingScreen',
                  params: {
                    item: {
                      id: remoteMessage.data.orderId,
                      status: remoteMessage.data.status,
                      author: {},
                      address: {},
                      products: [],
                    },
                    appStyles: DynamicAppStyles,
                  },
                });
                reduxStore.dispatch(action);
              },
              style: 'default',
            },
          ],
          {
            cancelable: true,
          },
        );
      }
    });
  }, []);

  useEffect(() => {
    // Constructor returns the unsubscribe fn
    const settingsFetcher = new SettingsAPI(reduxStore.dispatch);
    // Not calling unsubscribe because it calls that after the first snapshot.
    // i.e., need to restart app to see updated settings.
  }, []); // Run once on startup (?)

  const viewProductFromLink = productCode => {
    const action = NavigationActions.navigate({
      routeName: 'Search',
      params: {
        item: productCode,
      },
    });
    reduxStore.dispatch(action);
  };
  const getRelevantDeepLinkPart = str => {
    if (!str) {
      return null;
    }
    try {
      const split1 = str.split('://'); // Discard scheme
      const split2 = split1[1].split('?'); // Discard query parameters if any
      return split2[0];
    } catch (err) {
      console.warn('Failed to get relevant part of Deep Link', err.message);
      return null;
    }
  };
  useEffect(() => {
    AppLink.fetchDeferredAppLink().then(test => {
      const relevant = getRelevantDeepLinkPart(test);
      if (relevant !== null) {
        const productCode = relevant.match(/products\/(\w+)/);
        if (productCode !== null) {
          viewProductFromLink(productCode[1]); // The 0th match is the entire string
        }
      }
    });
    // Handle deeplinks on startup
    Linking.getInitialURL().then(url => {
      const relevant = getRelevantDeepLinkPart(url);
      if (relevant !== null) {
        const productCode = relevant.match(/products\/(\w+)/);
        if (productCode !== null) {
          viewProductFromLink(productCode[1]); // The 0th match is the entire string
        }
      }
    });
    Linking.addEventListener('url', e => {
      const relevant = getRelevantDeepLinkPart(e.url);
      if (relevant !== null) {
        const productCode = relevant.match(/products\/(\w+)/);
        if (productCode !== null) {
          viewProductFromLink(productCode[1]); // The 0th match is the entire string
        }
      }
    });
  }, []);

  return (
    <Provider store={reduxStore}>
      <AppearanceProvider>
        <AppNavigator
          screenProps={{theme: colorScheme}}
          enableURLHandling={false}
        />
      </AppearanceProvider>
    </Provider>
  );
};

App.propTypes = {};

App.defaultProps = {};

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent('App', () => HeadlessCheck);

export default App;
