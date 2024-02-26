import React, {useState, useEffect} from 'react';
import {
  BackHandler,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  Image,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Button from 'react-native-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

import dynamicStyles from './styles';
import {useColorScheme} from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import {IMLocalized} from '../../localization/IMLocalization';
import {setUserData} from '../redux/auth';
import {connect} from 'react-redux';
import authManager from '../utils/authManager';
import {localizedErrorMessage} from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import moment from 'moment';

import {instance as analytics} from '../../firebase/analytics';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import {VENDOR_ID} from '../../../Configuration';
import {Platform} from 'react-native';
import {setWith} from 'lodash';
import imagePermissions from '../../helpers/imagePermissions';

const NEEDS_COMPANY_EMAIL = '3NTjZxbC3bVl9M7sEARJ';

const getPermissionAsync = imagePermissions.getPermissionAsync;

const SignupScreen = props => {
  const MOMENT_FORMAT = 'YYYY-MM-DD';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [birthday, setBirthday] = useState('');
  const [iosBirthday, setIosBirthday] = useState('');
  const [validationErrors, setValidationErrors] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [withDiscount, setWithDiscount] = useState(false);
  const [discountID, setDiscountID] = useState('');
  const [relation, setRelation] = useState('');

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [eyeIcon, setEyeIcon] = useState('eye-slash');

  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  function backButtonHandler() {
    props.navigation.pop();
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [backButtonHandler]);

  useEffect(() => {
    if (VENDOR_ID !== NEEDS_COMPANY_EMAIL) {
      // Don't set it to TRUE!
      // Just never set it to true esp. if it's not being shown anyway.
    }
  }, []);

  // Handlers
  const onRegister = async () => {
    setLoading(true);

    console.log('ON REGISTER', validationErrors);
    if (
      firstName.trim().length < 2 ||
      lastName.trim().length < 2 ||
      email.trim().length < 2 ||
      mobile.trim().length < 2 ||
      birthday.trim().length < 8 ||
      (VENDOR_ID === NEEDS_COMPANY_EMAIL && company.length < 2)
    ) {
      Alert.alert(
        'Fields Incomplete',
        'Please fill out all fields to continue.',
      );
      setLoading(false);
      return;
    } else if (password.trim().length < 6) {
      Alert.alert(
        'Insecure Password',
        'Please choose a stronger password with more than 8 characters. ' +
          'Capitals, small letters, numbers, and special characters in combination help your account stay secure.',
        [{text: IMLocalized('OK')}],
        {cancelable: false},
      );
      setLoading(false);
      return;
    } else if (validationErrors.reduce((sum, value) => sum || value, false)) {
      Alert.alert(
        'Invalid Fields',
        'Please check that all fields are valid.',
        [{text: IMLocalized('OK')}],
        {cancelable: false},
      );
      setLoading(false);
      return;
    }

    const userDetails = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      phone: mobile?.trim(),
      birthday: birthday?.trim(),
      password: password && password.trim(),
      photoURI: profilePictureURL,
      discountID: withDiscount ? discountID : '',
      discountRelation: relation,
      appIdentifier: appConfig.appIdentifier,
      company: company?.trim(),
    };

    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig)
      .then(response => {
        const user = response.user;
        if (user) {
          props.setUserData({
            user: response.user,
          });
          props.navigation.navigate('MainStack', {user: user, isGuest: false});
          analytics.logSignUp({method: 'email-password'});
        } else {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{text: IMLocalized('OK')}],
            {
              cancelable: false,
            },
          );
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('ERROR', err.message, err.stack);
        setLoading(false);
      });
  };

  const onBlur = (value, type, idx, goNext = false) => {
    let re = null;
    switch (type) {
      case 'name':
        re = /^[A-Za-z.\- ]+$/i;
        break;
      case 'email':
        re = /^[\w.\-]+@\w+(\.\w{2,4})+$/i;
        break;
      case 'number':
        re = /^\d{11}$/;
        break;
      case 'date':
        re = /^\d\d\/\d\d\/\d\d\d\d$/;
        break;
      case 'company':
        re = /^[\w.\- ]+$/i;
        break;
    }
    const match = re && value.match(re);
    const copy = [].concat(validationErrors);
    if (type === 'date') {
      const tmp = new Date(value);
      if (tmp < new Date()) {
        // false for future dates and also NaN (is neither > or < current date) in case the regex fails somehow
        copy[idx] = true;
      } else {
        copy[idx] = false;
      }
    } else if (match !== null) {
      // VALID
      copy[idx] = false;
    } else {
      // INvalid
      copy[idx] = true;
    }
    setValidationErrors(copy);
    setShowDatePicker(false);
    if (goNext) {
      nextField(idx);
    }
  };

  const onAddPicture = async () => {
    const options = imagePermissions.options;
    const allowed = await getPermissionAsync();
    if (!allowed) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.cancelled) {
      console.log('SELECTED IMAGE', result.uri);
      setDiscountID(result.uri);
    }
  };

  const secondRef = React.createRef();
  const emailRef = React.createRef();
  const mobileRef = React.createRef();
  const passwordRef = React.createRef();
  const nextField = currentField => {
    if (currentField === 0) {
      secondRef.current.focus();
    } else if (currentField === 1) {
      emailRef.current.focus();
    } else if (currentField === 2) {
      mobileRef.current.focus();
    } else if (currentField === 3) {
      passwordRef.current.focus();
    }
    // No focus for picker ref
  };
  const changePwdType = () => {
    setEyeIcon(showPassword ? 'eye-slash' : 'eye');
    setShowPassword(!showPassword);
  };
  const isValidBirthday = date => {
    const legalAge = 12 * 365 * 24 * 60 * 60 * 1000; // 12 years in milliseconds
    if (new Date() - date < legalAge) {
      Alert.alert('', "Aren't you a little young to be ordering goods? :(");
      return false;
    }
    return true;
  };
  const updateBirthday = date => {
    setBirthday(moment(date).format(MOMENT_FORMAT));
  };

  const renderSignupWithEmail = () => {
    return (
      <>
        <TextInput
          style={{
            ...styles.InputContainer,
            borderColor: validationErrors[0]
              ? 'red'
              : styles.InputContainer.borderColor,
          }}
          autoFocus={true}
          textContentType="givenName"
          returnKeyType="next"
          placeholder={IMLocalized('First Name')}
          placeholderTextColor="#aaaaaa"
          onBlur={() => {
            onBlur(firstName, 'name', 0, false);
          }}
          onSubmitEditing={() => {
            onBlur(firstName, 'name', 0, true);
          }}
          onChangeText={text => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
          autoCapitalize="words"
        />
        <TextInput
          style={{
            ...styles.InputContainer,
            borderColor: validationErrors[1]
              ? 'red'
              : styles.InputContainer.borderColor,
          }}
          ref={secondRef}
          textContentType="familyName"
          returnKeyType="next"
          placeholder={IMLocalized('Last Name')}
          placeholderTextColor="#aaaaaa"
          onBlur={() => {
            onBlur(lastName, 'name', 1, false);
          }}
          onSubmitEditing={() => {
            onBlur(lastName, 'name', 1, true);
          }}
          onChangeText={text => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
          autoCapitalize="words"
        />
        <TextInput
          style={{
            ...styles.InputContainer,
            borderColor: validationErrors[2]
              ? 'red'
              : styles.InputContainer.borderColor,
          }}
          keyboardType="email-address"
          returnKeyType="next"
          textContentType="emailAddress"
          ref={emailRef}
          placeholder={
            VENDOR_ID === NEEDS_COMPANY_EMAIL
              ? IMLocalized('Company E-mail')
              : IMLocalized('E-mail')
          }
          placeholderTextColor="#aaaaaa"
          onBlur={() => {
            onBlur(email, 'email', 2, false);
          }}
          onSubmitEditing={() => {
            onBlur(email, 'email', 2, true);
          }}
          onChangeText={text => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          keyboardType="number-pad"
          textContentType="telephoneNumber"
          returnKeyType="next"
          ref={mobileRef}
          style={{
            ...styles.InputContainer,
            borderColor: validationErrors[3]
              ? 'red'
              : styles.InputContainer.borderColor,
          }}
          placeholder={IMLocalized('Mobile Number')}
          placeholderTextColor="#aaaaaa"
          onBlur={() => {
            onBlur(mobile, 'number', 3, false);
          }}
          onSubmitEditing={() => {
            onBlur(mobile, 'number', 3, true);
          }}
          onChangeText={text => setMobile(text)}
          value={mobile}
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.InputContainer, styles.passwordInput]}
            textContentType="password"
            returnKeyType="next"
            ref={passwordRef}
            placeholder={IMLocalized('Password')}
            placeholderTextColor="#aaaaaa"
            secureTextEntry={!showPassword}
            onChangeText={text => setPassword(text)}
            value={password}
            enablesReturnKeyAutomatically={true}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          {Platform.OS === 'android' && (
            <Icon
              style={styles.passwordIcon}
              name={eyeIcon}
              size={25}
              color={appStyles.colorSet[colorScheme].grey6}
              onPress={changePwdType}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.InputContainer}
          onPress={() => {
            setShowDatePicker(!showDatePicker);
          }}>
          <Text
            style={styles.datePickerLabel}
            onPress={() => {
              setShowDatePicker(!showDatePicker);
            }}>
            Birthday
          </Text>
          {Platform.OS === 'ios' && parseFloat(Platform.Version) < 14 ? (
            <Modal
              visible={showDatePicker}
              transparent={true}
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <View style={styles.iosPickerModal}>
                <Button
                  style={{
                    marginTop: 12,
                    marginHorizontal: 28,
                    textAlign: 'right',
                  }}
                  onPress={() => {
                    if (isValidBirthday(iosBirthday)) {
                      updateBirthday(iosBirthday);
                      setShowDatePicker(false);
                    } else {
                      // Reset to last known valid (or current date, hmm)
                      setIosBirthday(birthday);
                    }
                  }}>
                  Done
                </Button>
                <DateTimePicker
                  testID="dateTimePicker"
                  maximumDate={new Date()}
                  onChange={(e, date) => {
                    console.log('DatePicker event', e.type, date);
                    if (date) {
                      // Similar to Android, we now have an explicit DONE button to set the official birthday
                      setIosBirthday(date);
                    } else {
                      setShowDatePicker(false);
                    }
                  }}
                  value={iosBirthday ? new Date(iosBirthday) : new Date()}
                  display="default"
                  style={styles.datePicker}
                />
              </View>
            </Modal>
          ) : (
            showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={birthday ? new Date(birthday) : new Date()}
                display="default"
                maximumDate={new Date()}
                style={styles.datePicker}
                onChange={(e, date) => {
                  console.log('DatePicker Event', e.type, date);
                  if (Platform.OS === 'android') {
                    // Good because there is an explicit OK/Cancel button
                    if (isValidBirthday(date)) {
                      updateBirthday(date);
                    }
                    setShowDatePicker(false);
                  } else if (date) {
                    // IOS >= 14 with Date
                    // The only issue is that it's annoying when the popup keeps triggering,
                    // but it's working properly at least.
                    if (isValidBirthday(date)) {
                      updateBirthday(date);
                    }
                  } else {
                    // Else, just hide the picker
                    setShowDatePicker(false);
                  }
                }}
              />
            )
          )}
          {!showDatePicker && (
            <Text
              style={{
                color: appStyles.colorSet.mainSubtextColor,
                paddingLeft: 20,
                paddingBottom: 8,
                paddingTop: 10,
              }}>
              {birthday}
            </Text>
          )}
        </TouchableOpacity>
        {VENDOR_ID === NEEDS_COMPANY_EMAIL && (
          <TextInput
            style={{
              ...styles.InputContainer,
              borderColor: validationErrors[4]
                ? 'red'
                : styles.InputContainer.borderColor,
            }}
            enablesReturnKeyAutomatically={true}
            placeholder={IMLocalized('Company Code')}
            placeholderTextColor="#aaaaaa"
            onEndEditing={() => {
              onBlur(company, 'company', 4);
            }}
            onBlur={() => {
              onBlur(company, 'company', 4);
            }}
            onChangeText={text => setCompany(text)}
            value={company}
            underlineColorAndroid="transparent"
          />
        )}

        <View style={styles.idToggleContainer}>
          <Switch value={withDiscount} onValueChange={setWithDiscount} />
          <Text style={styles.idUploadHint}>&nbsp;With Senior/PWD ID</Text>
        </View>
        {withDiscount && (
          <>
            <Text style={styles.idUploadHint}>
              If you are a senior citizen or PWD (or buying for such a person),
              you can upload a photo of the Senior/PWD ID. (This can be updated
              later in Account &gt; Edit Profile.)
            </Text>
            <Button
              containerStyle={styles.idUploadContainer}
              style={styles.idUploadAction}
              onPress={() => onAddPicture()}>
              {IMLocalized('Attach Senior/PWD ID')}
            </Button>
            {discountID.length > 0 && (
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={{uri: discountID}}
                style={styles.idPreview}
              />
            )}
            <TextInput
              style={styles.InputContainer}
              textContentType="none"
              returnKeyType="done"
              placeholder={IMLocalized('Relationship to ID owner')}
              placeholderTextColor="#aaaaaa"
              onChangeText={text => setRelation(text)}
              value={relation}
              underlineColorAndroid="transparent"
              autoCapitalize="words"
            />
          </>
        )}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {IMLocalized('Sign Up')}
        </Button>
      </>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <FastImage
            tintColor={appStyles.colorSet.mainThemeForegroundColor}
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }>
              {IMLocalized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </ScrollView>
  );
};

SignupScreen.navigationOptions = {
  headerShown: false,
};

export default connect(null, {
  setUserData,
})(SignupScreen);
