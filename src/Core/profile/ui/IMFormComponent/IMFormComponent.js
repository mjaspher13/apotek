import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../localization/IMLocalization';

const noop = () => {};

function IMFormComponent(props) {
  const {
    form,
    initialValuesDict,
    onFormChange,
    onFormButtonPress,
    appStyles,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [alteredFormDict, setAlteredFormDict] = useState({});

  const onFormFieldValueChange = (formField, value) => {
    var newFieldsDict = alteredFormDict;
    newFieldsDict[formField.key] = value;
    setAlteredFormDict(newFieldsDict);
    onFormChange(newFieldsDict);
  };

  const renderSwitchField = (switchField) => {
    return (
      <View key={switchField.displayName}
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer]}>
        <Text style={styles.text}>{switchField.displayName}</Text>
        <Switch
          value={computeValue(switchField)}
          onValueChange={(value) => onFormFieldValueChange(switchField, value)}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>
    );
  };

  const renderTextField = (formTextField, index, totalLen, parentId) => {
    const textRef = React.createRef();
    const computed = computeValue(formTextField) || '';
    return (
      <View key={formTextField.displayName}>
        <TouchableOpacity
          onPress={() => {
            if (!textRef.current.isFocused()) {
              textRef.current.focus();
            }
          }}
          style={[
            styles.settingsTypeContainer,
            styles.appSettingsTypeContainer,
          ]}>
          <Text style={styles.text}>{formTextField.displayName}</Text>
          <TextInput
            ref={textRef}
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            style={[styles.text, { textAlign: 'right' }]}
            editable={
              formTextField.displayName === 'Birthday' ?
                !computed.length || computed.match(formTextField.regex) == null : // Editable ONLY IF INVALID
                formTextField.editable
            }
            onChangeText={(text) => {
              onFormFieldValueChange(formTextField, text);
            }}
            placeholderTextColor={styles.placeholderTextColor.color}
            placeholder={formTextField.placeholder}
            value={computed}
          />
        </TouchableOpacity>
        {index < totalLen - 1 && <View style={styles.divider} />}
      </View>
    );
  };

  // For displaying 
  const renderImageField = (imageField, index, totalLen, parentId) => {
    const uri = computeValue(imageField);
    if (uri === undefined || uri.length === 0) {
      return (
        <View key={imageField.displayName}
          style={[
            styles.imageContainer
          ]}
        >
          <Text style={styles.emptyImage}>No image</Text>
          {index < totalLen - 1 && <View style={styles.divider} />}
        </View>
      )
    }

    return (
      <View key={imageField.displayName}
        style={[
          styles.imageContainer
        ]}>
        <FastImage
          source={{ uri }}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.image}
        />
        {index < totalLen - 1 && <View style={styles.divider} />}
      </View>
    )
  };

  const renderBooleanField = (booleanField, index, totalLen, parentId) => {
    const value = computeValue(booleanField);

    return (
      <>
      <View key={booleanField.displayName}
        style={[
          styles.settingsTypeContainer,
          styles.appSettingsTypeContainer,
        ]}
      >
        <Text style={styles.text}>{booleanField.displayName}</Text>

        <View style={{ textAlign: 'right', flexDirection: 'row' }}>
          <Text style={[styles.text, { textAlign: 'right', flex: 0 }]}>
            {value ? booleanField.trueText : booleanField.falseText}&nbsp;
          </Text>
          <Icon
            style={{ textAlign: 'right', flex: 0 }}
            name={value ? booleanField.trueImage : booleanField.falseImage}
            color={value ? 'green' : '#CCCC00'} size={20} />
        </View>
        
      </View>
      {index < totalLen - 1 && <View key={booleanField.displayName + index}  style={styles.divider} />}
      </>
    );
  }

  const renderEnumField = (enumField, index, totalLen, parentId) => {
    let value = computeValue(enumField);
    if (!enumField[value]) {
      value = enumField.defaultValue;
    }

    return (
      <>
        <View key={enumField.displayName}
          style={[
            styles.settingsTypeContainer,
            styles.appSettingsTypeContainer,
          ]}
        >
          <Text style={styles.text}>{enumField.displayName}</Text>

          <View style={{ textAlign: 'right', flexDirection: 'row' }}>
            <Text style={[styles.text, { textAlign: 'right', flex: 0 }]}>
              {enumField[value].text}&nbsp;
            </Text>
            <Icon
              style={{ textAlign: 'right', flex: 0 }}
              name={enumField[value].image}
              color={enumField[value].imageColor} size={20} />
          </View>
        </View>
        {index < totalLen - 1 && <View key={enumField.displayName + index}  style={styles.divider} />}
      </>
    );
  }

  const onPwdUpload = (url) => {
    onFormFieldValueChange({
      key: 'discountID'
    }, url);
  }
  const renderButtonField = (buttonField, parentId) => {
    return (
      <TouchableOpacity key={buttonField.displayName}
        onPress={() => {
          if (parentId === 'SENIOR/PWD ID') {
            // First callback is for select image (noop), second is for upload
            onFormButtonPress(buttonField, noop, onPwdUpload);
          } else {
            onFormButtonPress(buttonField, noop, noop);
          }
        }}
        style={[styles.settingsTypeContainer, styles.appSettingsSaveContainer]}>
        <Text style={styles.settingsType}>{buttonField.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const onSelectFieldPress = (selectField, ref) => {
    ref.current.show();
  };

  const onActionSheetValueSelected = (selectField, selectedIndex) => {
    if (selectedIndex < selectField.options.length) {
      const newValue = selectField.options[selectedIndex];
      onFormFieldValueChange(selectField, newValue);
    }
  };

  const renderSelectField = (selectField, parentId) => {
    const actionSheetRef = React.createRef();
    return (
      <TouchableOpacity key={selectField.displayName}
        onPress={() => onSelectFieldPress(selectField, actionSheetRef)}
        style={[styles.settingsTypeContainer, styles.appSettingsTypeContainer]}>
        <Text style={styles.text}>{selectField.displayName}</Text>
        <Text style={styles.text}>{computeValue(selectField)}</Text>
        <ActionSheet
          ref={actionSheetRef}
          title={selectField.displayName}
          options={[...selectField.displayOptions, IMLocalized('Cancel')]}
          cancelButtonIndex={selectField.displayOptions.length}
          onPress={(selectedIndex) =>
            onActionSheetValueSelected(selectField, selectedIndex)
          }
        />
      </TouchableOpacity>
    );
  };

  const renderField = (formField, index, totalLen, parentId) => {
    const type = formField.type;
    if (type == 'text') {
      return renderTextField(formField, index, totalLen, parentId);
    }
    if (type == 'switch') {
      return renderSwitchField(formField, parentId);
    }
    if (type == 'button') {
      return renderButtonField(formField, parentId);
    }
    if (type == 'select') {
      return renderSelectField(formField, parentId);
    }
    if (type === 'image') {
      return renderImageField(formField, index, totalLen, parentId);
    }
    if (type === 'boolean') {
      return renderBooleanField(formField, index, totalLen, parentId);
    }
    if (type === 'enum') {
      return renderEnumField(formField, index, totalLen, parentId);
    }
    return null;
  };

  const renderSection = (section) => {
    return (
      <View key={section.title}>
        <View style={styles.settingsTitleContainer}>
          <Text style={styles.settingsTitle}>{section.title}</Text>
        </View>
        <View style={styles.contentContainer}>
          {section.fields.map((field, index) =>
            renderField(field, index, section.fields.length, section.title),
          )}
        </View>
      </View>
    );
  };

  const displayValue = (field, value) => {
    if (!field.displayOptions || !field.options) {
      return value;
    }
    for (var i = 0; i < field.options.length; ++i) {
      if (i < field.displayOptions.length && field.options[i] == value) {
        return field.displayOptions[i];
      }
    }
    return value;
  };

  const computeValue = (field) => {
    if (alteredFormDict[field.key] != null) {
      return displayValue(field, alteredFormDict[field.key]);
    }
    if (initialValuesDict[field.key] != null) {
      return displayValue(field, initialValuesDict[field.key]);
    }
    return displayValue(field, field.value);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <KeyboardAwareScrollView>
        {form.sections.map(renderSection)}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

IMFormComponent.propTypes = {
  onFormChange: PropTypes.func,
};

export default IMFormComponent;
