import React from 'react';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import PropTypes from 'prop-types';
import AppIntroSlider from 'react-native-app-intro-slider';
import deviceStorage from '../utils/AuthDeviceStorage';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';

const WalkthroughScreen = (props) => {
  const { navigation } = props;
  const appConfig =
    navigation.state.params.appConfig || navigation.getParam('appConfig');
  const appStyles =
    navigation.state.params.appStyles || navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const slides = appConfig.onboardingConfig.walkthroughScreens.map(
    (screenSpec, index) => {
      return {
        key: screenSpec.title, // Changed from `index`
        text: screenSpec.description,
        title: screenSpec.title,
        image: screenSpec.icon,
      };
    },
  );

  const _onDone = () => {
    deviceStorage.setShouldShowOnboardingFlow('false');
    navigation.navigate('Welcome');
  };

  const _renderItem = ({ item, dimensions, index: idx }) => (
    <View style={[styles.container, dimensions]}>
      <FastImage
        style={{
          ...styles.image,
          width: idx === 0 ? 250 : styles.image.width,
          tintColor: idx === 0 ? undefined : styles.image.tintColor
        }}
        tintColor={idx === 0 ? undefined : styles.image.tintColor}
        source={item.image}
        size={100}
        color="#FFF"
      />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  const _renderNextButton = () => {
    return <Text style={styles.button}>{IMLocalized('Next')}</Text>;
  };

  const _renderSkipButton = () => {
    return <Text style={styles.button}>{IMLocalized('Skip')}</Text>;
  };

  const _renderDoneButton = () => {
    return <Text style={styles.button}>{IMLocalized('Done')}</Text>;
  };

  return (
    <View style={styles.container}>
      <AppIntroSlider
        slides={slides}
        onDone={_onDone}
        renderItem={_renderItem}
        activeDotStyle={{ backgroundColor: 'rgba(255, 69, 0, 255)' }}
        //Handler for the done On last slide
        showSkipButton={true}
        onSkip={_onDone}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
      />
    </View>
  );
};

WalkthroughScreen.propTypes = {
  navigation: PropTypes.object,
};

WalkthroughScreen.navigationOptions = {
  header: null,
};

export default WalkthroughScreen;
