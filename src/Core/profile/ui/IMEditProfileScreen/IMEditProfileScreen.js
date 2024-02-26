import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {BackHandler, Alert, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import TextButton from 'react-native-button';
import {firebaseUser} from '../../../firebase';
import IMFormComponent from '../IMFormComponent/IMFormComponent';
import {setUserData} from '../../../onboarding/redux/auth';
import {IMLocalized} from '../../../localization/IMLocalization';

import {firebaseStorage} from '../../../firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import imagePermissions from '../../../helpers/imagePermissions';

const getPermissionAsync = imagePermissions.getPermissionAsync;

class IMEditProfileScreen extends Component {
  static navigationOptions = ({screenProps, navigation}) => {
    let appStyles = navigation.state.params.appStyles;
    let screenTitle = navigation.state.params.screenTitle;
    let currentTheme = appStyles.navThemeConstants[screenProps.theme];
    const {params = {}} = navigation.state;

    return {
      headerTitle: screenTitle,
      headerRight: () => (
        <TextButton style={{marginRight: 12}} onPress={params.onFormSubmit}>
          Done
        </TextButton>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    };
  };

  constructor(props) {
    super(props);
    this.appStyles = props.navigation.getParam('appStyles') || props.appStyles;
    this.form = props.navigation.getParam('form') || props.form;
    this.onComplete =
      props.navigation.getParam('onComplete') || props.onComplete;

    this.state = {
      form: props.form,
      alteredFormDict: {},
      loading: false,
    };
    this.didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onFormSubmit: this.onFormSubmit,
    });
    this.willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  isInvalid = (value, regex) => {
    const regexResult = regex.test(value);

    if (value.length > 0 && !regexResult) {
      return true;
    }
    if (value.length > 0 && regexResult) {
      return false;
    }
  };

  onFormSubmit = () => {
    var newUser = this.props.user;
    const form = this.form;
    const alteredFormDict = this.state.alteredFormDict;
    var allFieldsAreValid = true;

    form.sections.forEach(section => {
      section.fields.forEach(field => {
        const newValue = alteredFormDict[field.key]?.trim();
        if (newValue != null) {
          if (field.regex && this.isInvalid(newValue, field.regex)) {
            allFieldsAreValid = false;
          } else {
            newUser[field.key] = alteredFormDict[field.key]?.trim();
            if (field.key === 'discountID') {
              newUser.discountVerified = 'PENDING';
            }
          }
        }
      });
    });

    if (allFieldsAreValid) {
      firebaseUser.updateUserData(this.props.user.id, newUser);
      this.props.setUserData({user: newUser});
      this.props.navigation.goBack();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      alert(
        IMLocalized(
          'An error occurred while trying to update your account. Please make sure all fields are valid.',
        ),
      );
    }
  };

  onFormChange = alteredFormDict => {
    this.setState({alteredFormDict});
  };

  render() {
    return (
      <>
        <IMFormComponent
          form={this.form}
          initialValuesDict={this.props.user}
          onFormChange={this.onFormChange}
          navigation={this.props.navigation}
          appStyles={this.appStyles}
          onFormButtonPress={async (formField, callback1, callback2) => {
            if (formField.displayName === 'Upload New ID') {
              // TODO: Open or replace?
              const allowed = await getPermissionAsync();
              if (!allowed) {
                return;
              }

              const options = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                exif: false,
                quality: 0.8,
              };
              let result = await ImagePicker.launchImageLibraryAsync(options);
              if (!result.cancelled) {
                callback1(result.uri);
                this.setState({
                  loading: true,
                });
                firebaseStorage
                  .uploadImage(result.uri)
                  .then(response => {
                    this.setState({
                      loading: false,
                    });
                    callback2(response.downloadURL);
                  })
                  .catch(err => {
                    this.setState({
                      loading: false,
                    });
                    console.warn('Upload Error', err.message);
                    Alert.alert(
                      'Upload Failed',
                      'Failed to upload Senior/PWD ID. Please try again later.',
                    );
                  });
              } else {
                console.log('Image Picker: Cancelled?', result);
              }
            }
          }}
        />
        {this.state.loading && (
          <ActivityIndicator
            size="large"
            color={this.appStyles.colorSet.mainThemeForegroundColor}
            style={{
              position: 'absolute',
              backgroundColor: this.appStyles.colorSet.grey6,
              opacity: 0.6,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
      </>
    );
  }
}

IMEditProfileScreen.propTypes = {
  user: PropTypes.object,
  setUserData: PropTypes.func,
};

const mapStateToProps = ({auth}) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {setUserData})(IMEditProfileScreen);
