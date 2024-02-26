import React from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import styles from './styles';
import DynamicAppStyles from '../../DynamicAppStyles';

export default class Hamburger extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <FastImage
          style={{
            ...styles.headerButtonImage,
            tintColor: this.props.style?.tintColor || styles.headerButtonImage.tintColor
          }}
          tintColor={this.props.style?.tintColor || styles.headerButtonImage.tintColor}
          source={DynamicAppStyles.iconSet.menuHamburger}
        />
      </TouchableOpacity>
    );
  }
}

Hamburger.propTypes = {
  onPress: PropTypes.func,
};
