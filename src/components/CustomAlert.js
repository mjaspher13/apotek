import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import dynamicStyles from './customAlertStyle';

function CustomAlert (props) {
    const styles = dynamicStyles(props.theme);

    // Similar arguments to react-native Alert, but we accept objects in `body`.
    const { title, body, buttons, options } = props;
    const [ visible, setVisible ] = useState(true);
    let bodyComponent;
    if (typeof body === 'string') {
      bodyComponent = (<Text style={styles.defaultBodyStyle}>{body}</Text>)
    } else {
      bodyComponent = body;
    }
    const closeMyself = () => {
      setVisible(false)
      props.close()
    }

    return (
      <Modal
        onBackButtonPress={closeMyself}
        onBackdropPress={closeMyself}
        onModalHide={closeMyself}
        isVisible={visible}
        style={styles.container}
      >
        <View style={styles.modalView}>
          {title?.length > 0 ?
            <Text style={styles.titleStyle}>{title}</Text> :
            null
          }
          {bodyComponent}
          {buttons ?
            buttons :
            <Button onPress={closeMyself}
              containerStyle={styles.okContainer}
              style={styles.okText}
            >OK</Button>
          }
        </View>
      </Modal>
    )
}

export default CustomAlert;
