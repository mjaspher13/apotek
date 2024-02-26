import React from 'react';
import { Paper, View } from 'react-native';
import PropTypes from "prop-types";
import FastImage from 'react-native-fast-image';
import BottomLabelIcon from '../BottomLabelIcon/BottomLabelIcon';
import DynamicAppStyles from '../../DynamicAppStyles';
import VendorAppConfig from '../../SingleVendorAppConfig';

import styles from './styles';
/**
 * Returns a static four-button bottom view that should be fixed to the bottom of the screen.
 * For parent views that will contain this (Home, etc?), add a {height} margin.
 */
function FakeTabs(props) {
    function onFakeMenuPress(b) {
        props.navigation.navigate(b.navigationTarget, b.navigationOptions);
    }

    return (
        <View style={styles.container}>
            {props.buttons.map((b, i) => (
                <BottomLabelIcon
                    key={i}
                    color="#FFF"
                    imageStyle={styles.tabImage}
                    style={styles.tabContainer}
                    label={b.label}
                    labelStyle={styles.label}
                    imageSource={b.icon}
                    onPress={() => onFakeMenuPress(b)}
                />
            ))}
        </View>
    );
}

FakeTabs.propTypes = {
    buttons: PropTypes.arrayOf(
            PropTypes.shape({
            label: PropTypes.string.isRequired,
            icon: PropTypes.oneOfType([ PropTypes.string, PropTypes.number]).isRequired,
            navigationTarget: PropTypes.string.isRequired,
            navigationOptions: PropTypes.object,
        })
    ),
    navigation: PropTypes.any
}
export default React.memo(FakeTabs);
