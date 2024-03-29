import React from 'react';
import { TouchableHighlight, Image, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import styles from './styles';
import appStyles from '../../DynamicAppStyles';

export default class MenuButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.btnClickContain}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <View style={styles.btnContainer}>
          <FastImage source={this.props.source}
            style={{ ...styles.btnIcon,
              tintColor: appStyles.colorSet.mainThemeForegroundColor
            }}
            tintColor={appStyles.colorSet.mainThemeForegroundColor} />
          <Text style={{
            ...styles.btnText,
            color: this.props.comingSoon ? 'gray' : styles.btnText.color
          }}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

MenuButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
