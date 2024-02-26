import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Alert, Platform} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-native-button';
import dynamicStyles from './styles';
import {IMLocalized} from '../../../localization/IMLocalization';
import { Picker } from '@react-native-picker/picker';

import {setShippingAddress} from '../../redux/checkout';
import {setUserData} from '../../../onboarding/redux/auth';
import {updateUserData} from '../../../firebase/user';
import {updateUserShippingAddress} from '../../api/address';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Appearance } from 'react-native-appearance';
import { config } from '../../../firebase/config';
import { logBeginCheckout, instance as analytics } from '../../../firebase/analytics';

import rawCities from '../../../../../assets/geography/cities.json';
import rawRegions from '../../../../../assets/geography/regions.json';

let cities, regions;
const NCR_ONLY = true;
if (NCR_ONLY) {
  cities = rawCities.filter(city => city.region === 'NCR');
  regions = rawRegions.filter(region => region.name === 'NCR');
} else {
  cities = rawCities;
  regions = rawRegions;
}
cities.sort((a, b) => a.name > b.name);
regions.sort((a, b) => a.name > b.name);

Geocoder.init(config.apiKey);
const RE_line1_2 = /^[A-Za-zÑñ0-9\-\.\s,]+$/;
const RE_city_country = /^[A-Za-zÑñ\s\.-]+$/;
const RE_mobile = /^09\d{9}$/

function IMAddAddressModal(props) {
  const COLOR_SCHEME = Appearance.getColorScheme();
  const appStyles = props.navigation.getParam('appStyles', {});
  const appConfig = props.navigation.getParam('appConfig', {});

  const settings = useSelector(state => state.settings);
  const cartItems = useSelector(state => state.cart.cartItems);
  const currentUser = useSelector((state) => state.auth.user);
  const reduxShippingAddress = useSelector((state) => state.checkout.shippingAddress);
  const dispatch = useDispatch();

  const styles = dynamicStyles(appStyles, props.screenProps.theme);

  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(cities[0].name);
  const [country, setCountry] = useState(regions[0].name);
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [validationErrors, setValidationErrors] = useState([false, false ,false, false, false, false]);
  const [ cityPickerVisible, setCityPickerVisible ] = useState(Platform.OS === 'android');
  const [ regionPickerVisible, setRegionPickerVisible ] = useState(Platform.OS === 'android');

  useEffect(() => {
    var savedAddress = (reduxShippingAddress && reduxShippingAddress.postalCode && reduxShippingAddress) || currentUser.shippingAddress;
    if (savedAddress) {
      setCity(savedAddress.city);
      setCountry(savedAddress.country);
      setLine1(savedAddress.line1);
      setLine2(savedAddress.line2);
      setPostalCode(savedAddress.postalCode)
    }

    // When we get here, the user is beginning to checkout. Log this event!
    logBeginCheckout(cartItems, currentUser);
  }, [1]);

  const allFieldsCompleted = () => {
    let valid = true;
    let invalids = [...validationErrors];
    if (line1 === '') {
      valid = false;
      invalids[0] = true;
    } else if (!line1.match(RE_line1_2)) {
      invalids[0] = true;
    } else {
      invalids[0] = false;
    }
    if (line2 === '') {
      // Line 2 is optional, so allow it to be empty
      // valid = false;
      invalids[1] = false;
    } else if (!line2.match(RE_line1_2)) {
      invalids[1] = true;
    } else {
      invalids[1] = false;
    }
    if (city === '') {
      valid = false;
      invalids[2] = true;
    } else if (!city.match(RE_city_country)) {
      invalids[2] = true;
    } else {
      invalids[2] = false;
    }
    if (country === '') {
      valid = false;
      invalids[4] = true;
    } else if (!country.match(RE_city_country)) {
      invalids[4] = true;
    } else {
      invalids[4] = false;
    }
    
    if (postalCode === '') {
      valid = false;
      invalids[3] = true;
    } else {
      invalids[3] = false;
    }
    if (phone === '') {
      valid = false;
      invalids[5] = true;
    } else if (phone.match(RE_mobile) === null) {
      valid = false;
      invalids[5] = true;
    } else {
      invalids[5] = false;
    }
    setValidationErrors(invalids);

    console.log('Address fields:' + line1 + " | " + line2 + " | " + city + " | " + country + " | " + postalCode + ' | ', phone);
    return valid;
  };

  const onSaveAddressPress = async () => {
    if (!allFieldsCompleted()) {
      Alert.alert(
        IMLocalized('Incomplete Address'),
        IMLocalized('Please fill out all the required fields. We need your shipping address to deliver the order.')
      );
      return;
    }

    try {
      // For a given address, we calculate what the precise coordinate, using Google Geocoding API
      const json = await Geocoder.from(`${line1} ${line2} ${city} ${country} ${postalCode}`)
      var location = json.results[0].geometry.location;

      if (phone !== currentUser.phone) {
        try {
          await updateUserData(currentUser.id, {
            phone: phone,
          });
        } catch (err) {
          console.warn('Failed to attach phone number to profile');
        }
      }
      var shippingAddress = {
        city,
        country,
        line1,
        line2,
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`,
        postalCode,
        location: {
          latitude: location.lat,
          longitude: location.lng,
        }
      };
  
      if (currentUser.phone) {
        shippingAddress.phone = currentUser.phone;
      }
      if (currentUser.email) {
        shippingAddress.email = currentUser.email;
      }

      //if (!currentUser.shippingAddress) { // Uncomment this if you don't want to override the customer's address after every order
        // If the user did not have an address, we save this one to database, to be used for future orders
        storeUserShippingAddress(shippingAddress);
      //}
      dispatch(setShippingAddress(shippingAddress));

      analytics.logAddShippingInfo();
      props.navigation.navigate('Cards', {appConfig, appStyles});
    } catch(error) {
      alert(error.message)
      console.log('Save address error', error);
    }

  };

  const storeUserShippingAddress = address => {
    updateUserShippingAddress(currentUser.id, address);
    // Optimistically update local user object in redux with the new address
    dispatch(setUserData({ user: { ...currentUser, shippingAddress: address, phone } }));
  };

  const secondRef = React.createRef();
  const cityRef = React.createRef();
  const zipRef = React.createRef();
  const nextField = (currentField) => {
    console.log('Next field', currentField);
    if (currentField === 0) {
      secondRef.current.focus();
    } else if (currentField === 1) {
      // cityRef.current.focus(); // Note: Doesn't work for picker
    } else if (currentField === 2) {
      zipRef.current.focus();
    }
  }

  const pickerCity = <Picker
      ref={cityRef}
      style={styles.picker}
      selectedValue={city}
      mode="dropdown"
      onValueChange={(value) => {
        console.log('CITY PICKER CHANGE', value);
        // No need for onBlur since we are only showing valid values
        setCity(value);
        setCityPickerVisible(Platform.OS === 'android' || false);
        // nextField(2); // Disabling because it was annoying
      }}
    >
      {cities.map(cityData => {
        return <Picker.Item key={cityData.name} label={cityData.name} value={cityData.name} />
      })}
    </Picker>;
  const pickerRegion = <Picker
      style={styles.picker}
      selectedValue={country}
      mode="dropdown"
      onValueChange={(value) => {
        console.log('REGION PICKER CHANGE', value);
        // No need for onBlur since we are only showing valid values
        setCountry(value);
        setRegionPickerVisible(Platform.OS === 'android' || false);
      }}
    >
      {regions.map(regionData => {
        return <Picker.Item key={regionData.name} label={regionData.name} value={regionData.name} />
      })}
    </Picker>;

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('Line 1')}</Text>
          <TextInput
            placeholder={'Street Address'}
            textContentType="streetAddressLine1"
            returnKeyType="next"
            autoFocus={true}
            style={{
              ...styles.textInput,
              borderColor: validationErrors[0] ? 'red' : styles.textInput.borderColor
            }}
            value={line1}
            onChangeText={text => setLine1(text)}
            onSubmitEditing={() => {
              if (line1.length) {
                const ve = [...validationErrors];
                ve[0] = false;
                if (!line1.match(RE_line1_2)) {
                  ve[0] = true;
                }
                setValidationErrors(ve)
              }
              nextField(0);
            }}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('Line 2')}</Text>
          <TextInput
            ref={secondRef}
            textContentType="streetAddressLine2"
            returnKeyType="next"
            placeholder={'(Optional)'}
            style={{
              ...styles.textInput,
              borderColor: validationErrors[1] ? 'red' : styles.textInput.borderColor
            }}
            value={line2}
            onChangeText={text => setLine2(text)}
            onSubmitEditing={() => {
              if (line2.length) {
                const ve = [...validationErrors];
                ve[1] = false;
                if (!line2.match(RE_line1_2)) {
                  ve[1] = true;
                }
                setValidationErrors(ve)
              }

              nextField(1);
            }}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('City')}</Text>

          <TouchableOpacity style={styles.pickerContainer} onPress={() => {
            setCityPickerVisible(true);
          }}>
            {
              Platform.OS === 'android' ?
                pickerCity :
                <>
                  <Modal
                    isVisible={cityPickerVisible}
                    onBackdropPress={() => {
                      setCityPickerVisible(false)
                    }}
                    onBackButtonPress={() => {
                      setCityPickerVisible(false)
                      console.log('Picker?', pickerCity);
                    }}
                  >
                    {pickerCity}
                  </Modal>
                  <Text style={styles.iosPickerSelected}>{city}</Text>
                </>
            }
          </TouchableOpacity>
          {/* <TextInput
            placeholder={'Pasig'}
            style={{
              ...styles.textInput,
              borderColor: validationErrors[2] ? 'red' : styles.textInput.borderColor
            }}
            value={city}
            onChangeText={text => setCity(text)}
            onBlur={() => {
              if (city.length) {
                const ve = [...validationErrors];
                ve[2] = false;
                if (!city.match(RE_city_country)) {
                  ve[2] = true;
                }
                setValidationErrors(ve)
              }
            }}
            autoCapitalize="words"
          /> */}
        </View>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('Zipcode')}</Text>
          <TextInput
            keyboardType="number-pad"
            returnKeyType="next"
            ref={zipRef}
            placeholder={IMLocalized('0000')}
            style={{
              ...styles.textInput,
              borderColor: validationErrors[3] ? 'red' : styles.textInput.borderColor
            }}
            value={postalCode}
            onChangeText={text => setPostalCode(text)}
            onSubmitEditing={() => {
              if (postalCode.length) {
                const ve = [...validationErrors];
                ve[3] = false;
                setValidationErrors(ve)
              }
            }}
          />
        </View>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('Region')}</Text>
          <TouchableOpacity style={[
            styles.pickerContainer,
            {
              borderColor: validationErrors[4] ? 'red' : styles.pickerContainer.borderColor
            }
          ]} onPress={() => {
            setRegionPickerVisible(true);
          }}>
            {
              Platform.OS === 'android' ?
                pickerRegion :
                <>
                  <Modal
                    isVisible={regionPickerVisible}
                    onBackButtonPress={() => { setRegionPickerVisible(false) }}
                    onBackdropPress={() => { setRegionPickerVisible(false) }}
                  >
                    {pickerRegion}
                  </Modal>
                  <Text style={styles.iosPickerSelected}>{country}</Text>
                </>
            }
          </TouchableOpacity>
          {/* <TextInput
            textContentType="addressState"
            placeholder={'Region'}
            style={{
              ...styles.textInput,
              borderColor: validationErrors[4] ? 'red' : styles.textInput.borderColor
            }}
            value={country}
            // onChangeText={text => setCountry(text)} // Make it uneditable by not updating  the state value
            onBlur={() => {
              if (country.length) {
                const ve = [...validationErrors];
                ve[4] = false;
                if (!country.match(RE_city_country)) {
                  ve[4] = true;
                }
                setValidationErrors(ve)
              }
            }}
            autoCapitalize="words"
          /> */
          }
        </View>
        <View style={styles.horizontalPane}>
          <Text style={styles.textInputLabel}>{IMLocalized('Contact Number')}</Text>
          <TextInput
            keyboardType="number-pad"
            placeholder={'09151234567'}
            textContentType="telephoneNumber"
            returnKeyType="done"
            style={{
              ...styles.textInput,
              borderColor: validationErrors[5] ? 'red' : styles.textInput.borderColor
            }}
            value={phone}
            onChangeText={text => setPhone(text)}
            onBlur={() => {
              if (phone.length) {
                const ve = [...validationErrors];
                ve[5] = false;
                if (!phone.match(RE_mobile)) {
                  ve[5] = true;
                }
                setValidationErrors(ve)
              }
            }}
          />
        </View>
        <Button
          containerStyle={styles.actionButtonContainer}
          onPress={onSaveAddressPress}
          style={styles.actionButtonText}>
          {IMLocalized('SAVE ADDRESS')}
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

IMAddAddressModal.navigationOptions = {
  headerRight: () => <View />,
  headerTitle: IMLocalized('Delivery Address')
};

export default IMAddAddressModal;
