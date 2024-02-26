import React from 'react';
import { View } from "react-native";
import { TNEmptyStateView } from '../../Core/truly-native';
import DynamicAppStyles from '../../DynamicAppStyles'
import dynamicStyles from './styles';

function ComingSoonScreen (props) {
    const styles = dynamicStyles(props.screenProps.theme)
    const emptyStateConfig = {
      title: 'Coming Soon!',
      description: 'We\'ll roll out this feature soon, hang tight!'
    };
    return (
        <View style={styles.emptyViewContainer}>
            <TNEmptyStateView
              emptyStateConfig={emptyStateConfig}
              appStyles={DynamicAppStyles}
            />
        </View>
    )
}

export default ComingSoonScreen;
