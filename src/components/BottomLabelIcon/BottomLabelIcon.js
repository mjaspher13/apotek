import React from 'react'
import { View, TouchableOpacity, Text, Image } from 'react-native';
import PropTypes from "prop-types";
import FastImage from 'react-native-fast-image';
import { useColorScheme } from 'react-native-appearance';

import DynamicAppStyles from '../../DynamicAppStyles';
import styles from './styles';

/**
 * Include any fontSize in the `labelStyle` prop, and the `width`,
 * `height` and other image properties in `imageStyle` prop.
 * @param {*} props 
 */
function BottomLabelIcon(props) {
    const COLOR_SCHEME = useColorScheme();

    let containerStyle = {
        ...styles.container,
        ...props.style,
    }
    let labelStyle = {
        ...styles.label,
        ...props.labelStyle,
    }
    let imageStyle = {
        ...styles.image,
        ...props.imageStyle,
    }
    if (!props.color) {
        props.color = DynamicAppStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor;
    }
    labelStyle.color = props.color;

    const width = imageStyle.width || containerStyle.width || styles.image.width;
    const padding = 10;
    return (
        <TouchableOpacity style={containerStyle}
                onPress={props.onPress}
                underlayColor="rgba(128, 128, 128, 0.1)">
            <View style={styles.tabContainer}>
                { props.isAvatar ?
                <View style={{
                    width: width + padding,
                    height: width + padding,
                    borderRadius: (width + padding) / 2,
                    backgroundColor: props.color,
                }}>
                    <FastImage style={{ ...imageStyle,
                            resizeMode: "cover",
                            margin: 4,
                            tintColor: props.color ? 'white' : undefined,
                        }}
                        tintColor={props.color ? 'white' : undefined}
                        source={props.imageSource} /> 
                </View>
                :
                <FastImage
                    style={{
                        ...imageStyle,
                        tintColor: props.color ? props.color : undefined
                    }}
                    source={props.imageSource}
                    tintColor={props.color ? props.color : undefined} />
                }
                <Text style={labelStyle}>{props.label}</Text>
            </View>
        </TouchableOpacity>
    )
}

BottomLabelIcon.propTypes = {
    color: PropTypes.string.isRequired,  // A CSS color or hex code. Defaults to `mainThemeForegroundColor`
    imageSource: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
        PropTypes.string,
    ]),
    label: PropTypes.string.isRequired,
    labelStyle: PropTypes.object,
    style: PropTypes.object,
    imageStyle: PropTypes.object,
    onPress: PropTypes.func,
    isAvatar: PropTypes.bool,
}

export default BottomLabelIcon;
