import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Button from 'react-native-button';
import styles from './styles';
import DynamicAppStyles from '../../../DynamicAppStyles';
import {IMLocalized} from '../../../Core/localization/IMLocalization';
import {Appearance} from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

function MultiServiceHomeView() {
    return (
        <View style={styles.container}>
            <Button containerStyle={styles.serviceButtonContainer} style={styles.serviceButtonText}>Medicines</Button>
            <Button containerStyle={styles.serviceButtonContainer} style={styles.serviceButtonText}>Vaccines</Button>
            <Button containerStyle={styles.serviceButtonContainer} style={styles.serviceButtonText}>Home Care</Button>
        </View>
    )
}

export default MultiServiceHomeView;
