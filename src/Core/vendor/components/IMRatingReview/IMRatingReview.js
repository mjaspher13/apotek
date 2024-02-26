import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import dynamicStyles from './styles';
import PropTypes from 'prop-types';
import {Appearance} from 'react-native-appearance';
import FastImage from 'react-native-fast-image';

const COLOR_SCHEME = Appearance.getColorScheme();
export default function Rating({rating, number, onPressReview, appStyles}) {
  const styles = dynamicStyles(appStyles);
  if (rating === 0) {
    return <View style={styles.container} />;
  }

  return (
    <TouchableOpacity onPress={onPressReview}>
      <View style={styles.container}>
        <Text style={styles.rating}>{rating.toFixed(2)}</Text>
        <FastImage
          tintColor={appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor}
          style={styles.image}
          source={require('../../../../../assets/images/gold_star.png')}
        />
        <Text style={styles.rating}>({number})</Text>
      </View>
    </TouchableOpacity>
  );
}

Rating.propTypes = {
  rating: PropTypes.number.isRequired,
  number: PropTypes.number.isRequired,
};
