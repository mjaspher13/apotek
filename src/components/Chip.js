import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import dynamicStyles from './chipStyle';

function Chip({
    type,
    title,
    onPress,
    theme,
}) {
    const COLOR_SCHEME = theme;
    const styles = dynamicStyles(COLOR_SCHEME);

    if (type === 'outline') {
        return (
            <TouchableOpacity
                style={[styles.container, styles.outlineContainer]}
                onPress={onPress}
            >
                <Text style={styles.outlineText}>{title}</Text>
            </TouchableOpacity>
        )
    } else {
        return <TouchableOpacity
            style={[styles.container, styles.solidContainer]}
            onPress={onPress}
        >
            <Text style={styles.solidText}>{title}</Text>
        </TouchableOpacity>
    }
}

export default Chip;
