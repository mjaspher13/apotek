import { firebaseAuth, firebaseUser } from '../../firebase';
import { firebaseStorage } from '../../firebase/storage';
import { ErrorCode } from './ErrorCode';
import Geolocation from '@react-native-community/geolocation';
import * as Facebook from 'expo-facebook';
import * as Permissions from 'expo-permissions';
import {stripeDataManager} from '../../payment/api';
import appleAuth from '@invertase/react-native-apple-authentication';
const FACEBOOK_APP_ID = '333314608018944';

const defaultProfilePhotoURL =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

const createStripeCustomer = async (email, appConfig) => {
  if (!appConfig.API_TO_USE) {
    return false;
  }

  const stripeCustomer = await stripeDataManager.createStripeCustomer(
    email,
    appConfig,
  );

  if (stripeCustomer.success) {
    return stripeCustomer.data.customer.id;
  }

  return false;
};

const loginWithEmailAndPassword = (email, password, appConfig) => {
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithEmailAndPassword(email, password).then((response) => {
      if (!response.error) {
        handleSuccessfulLogin({...response.user}, false).then(async res => {
          // Login successful, push token stored, login credential persisted, so we log the user in.
          if (!response.user.stripeCustomer) {
            const stripeCustomer = await createStripeCustomer(
              response.user.email,
              appConfig,
            );

            if (stripeCustomer) {
              firebaseUser.updateUserData(response.user.id, {
                stripeCustomer,
              });
              response.user.stripeCustomer = stripeCustomer;
            }
          }
          resolve({user: res.user});
        });
      } else {
        resolve({ error: response.error });
      }
    });
  });
};

const onVerification = (phone) => {
  firebaseAuth.onVerificationChanged(phone);
};

const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
  const { photoURI } = userDetails;
  const { discountID } = userDetails;
  const accountCreationTask = (userData) => {
    return new Promise((resolve, _reject) => {
      firebaseAuth
        .register(userData, appConfig.appIdentifier)
        .then(async (response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user;
            const stripeCustomer = await createStripeCustomer(
              userDetails.email,
              appConfig,
            );
            if (stripeCustomer) {
              user.stripeCustomer = stripeCustomer;
              firebaseUser.updateUserData(user.id, {
                stripeCustomer,
              });
            }

            // Also upload the PWD image
            if (discountID.length) {
              const idResponse = await firebaseStorage.uploadImage(discountID);
              if (idResponse.error) {
                console.warn('Failed to upload Senior/PWD ID', idResponse.error);
              } else {
                user.discountID = idResponse.downloadURL;
                console.log('Response USER', response.user);
              }
            }

            if (photoURI) {
              firebaseStorage.uploadImage(photoURI).then((response) => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: defaultProfilePhotoURL,
                    },
                  });
                } else {
                  firebaseAuth
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then((_result) => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      });
                    });
                }
              });
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: defaultProfilePhotoURL,
                },
              });
            }
          }
        });
    });
  };

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: defaultProfilePhotoURL,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve({
            ...response,
            stripeCustomer: userData.stripeCustomer,
          });
        });
      }
    });
  });
};

const retrievePersistedAuthUser = () => {
  return new Promise((resolve) => {
    firebaseAuth.retrievePersistedAuthUser().then((user) => {
      if (user) {
        handleSuccessfulLogin(user, false).then((res) => {
          // Persisted login successful, push token stored, login credential persisted, so we log the user in.
          resolve({
            user: res.user,
            stripeCustomer: user.stripeCustomer,
          });
        });
      } else {
        resolve(null);
      }
    });
  });
};

const logout = (user) => {
  const userData = {
    ...user,
    isOnline: false,
  };
  firebaseAuth.updateUser(user.id || user.userID, userData);
  firebaseAuth.logout();
};

const loginOrSignUpWithApple = (appConfig) => {
  return new Promise(async (resolve, _reject) => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME,
        ],
      });

      const { identityToken, nonce } = appleAuthRequestResponse;

      await firebaseAuth
        .loginWithApple(identityToken, nonce, appConfig.appIdentifier)
        .then(async (response) => {
          console.log('User', JSON.stringify(response.user));
          if (response.user) {
            const newResponse = {
              user: { ...response.user },
              accountCreated: response.accountCreated,
            };
            if (!response.user.stripeCustomer) {
              const stripeCustomer = await createStripeCustomer(
                response.user.email,
                appConfig,
              );
              if (stripeCustomer) {
                firebaseUser.updateUserData(response.user.id, {
                  stripeCustomer,
                });
                response.user.stripeCustomer = stripeCustomer;
              }
            }
            handleSuccessfulLogin(
              newResponse.user,
              response.accountCreated,
            ).then((response) => {
              // resolve(response);
              resolve({
                ...response,
                stripeCustomer: response.user.stripeCustomer,
              });
            });
          } else {
            resolve({ error: ErrorCode.appleAuthFailed });
          }
        });
    } catch (error) {
      console.log(error);
      resolve({ error: ErrorCode.appleAuthFailed });
    }
  });
};

const loginOrSignUpWithFacebook = (appConfig) => {
  Facebook.initializeAsync({
    appId: FACEBOOK_APP_ID
  });

  return new Promise(async (resolve, _reject) => {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        // permissions: ['public_profile'],
        permissions: ['email'],
      });

      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        // const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        firebaseAuth
          .loginWithFacebook(token, appConfig.appIdentifier)
          .then(async (response) => {
            if (response.user) {
              const newResponse = {
                user: { ...response.user },
                accountCreated: response.accountCreated,
              };
              if (!response.user.stripeCustomer) {
                const stripeCustomer = await createStripeCustomer(
                  response.user.email,
                  appConfig,
                );
                if (stripeCustomer) {
                  firebaseUser.updateUserData(response.user.id, {
                    stripeCustomer,
                  });
                  response.user.stripeCustomer = stripeCustomer;
                }
              }
              handleSuccessfulLogin(
                newResponse.user,
                response.accountCreated,
              ).then((response) => {
                // resolve(response);
                resolve({
                  ...response,
                  stripeCustomer: response.user.stripeCustomer,
                });
              });
            } else {
              resolve({ error: ErrorCode.fbAuthFailed });
            }
          });
      } else {
        console.log('CANCELLED', type)
        resolve({ error: ErrorCode.fbAuthCancelled });
      }
    } catch (error) {
      console.log('ERROR', error);
      resolve({ error: ErrorCode.fbAuthFailed });
    }
  });
};

const retrieveUserByPhone = (phone) => {
  return firebaseAuth.retrieveUserByPhone(phone);
};

const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  return firebaseAuth.sendSMSToPhoneNumber(phoneNumber, captchaVerifier);
};

const sendPasswordResetEmail = (email) => {
  return firebaseAuth.sendPasswordResetEmail(email);
}

const loginWithSMSCode = (smsCode, verificationID) => {
  return new Promise(function (resolve, _reject) {
    firebaseAuth.loginWithSMSCode(smsCode, verificationID).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // successful phone number login, we fetch the push token
        handleSuccessfulLogin(response.user, false).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const { photoURI } = userDetails;
  const accountCreationTask = (userData) => {
    return new Promise(function (resolve, _reject) {
      firebaseAuth
        .registerWithPhoneNumber(
          userData,
          smsCode,
          verificationID,
          appIdentifier,
        )
        .then((response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user;
            if (photoURI) {
              firebaseStorage.uploadImage(photoURI).then((response) => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: defaultProfilePhotoURL,
                    },
                  });
                } else {
                  firebaseAuth
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then((_res) => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      });
                    });
                }
              });
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: defaultProfilePhotoURL,
                },
              });
            }
          }
        });
    });
  };

  return new Promise(function (resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: defaultProfilePhotoURL,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const handleSuccessfulLogin = (user, accountCreated) => {
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  fetchAndStoreExtraInfoUponLogin(user, accountCreated);

  Facebook.getPermissionsAsync().then(gotten => {
    if (gotten.status === 'granted') {
      Facebook.setAdvertiserTrackingEnabledAsync(true);
    } else {
      Facebook.requestPermissionsAsync().then(result => {
        console.log('Requested permission', result);
      });
    }
  });

  return new Promise((resolve) => {
    resolve({ user: { ...user } });
  });
};

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  firebaseAuth.fetchAndStorePushTokenIfPossible(user);

  getCurrentLocation(Geolocation).then(async (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    var locationData = {};
    if (location) {
      locationData = {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      };
      if (accountCreated) {
        locationData = {
          ...locationData,
          signUpLocation: {
            latitude: latitude,
            longitude: longitude,
          },
        };
      }
    }

    const userData = {
      ...locationData,
      isOnline: true,
    };

    firebaseAuth.updateUser(user.id || user.userID, userData);
  });
};

const getCurrentLocation = (geolocation) => {
  return new Promise(async (resolve) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } });
      return;
    }

    geolocation.getCurrentPosition(
      (location) => {
        resolve(location);
      },
      (error) => {
        console.log('Location error', error);
      },
      // { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );

    // setRegion(location.coords);
    // onLocationChange(location.coords);

    // geolocation.getCurrentPosition(
    //     resolve,
    //     () => resolve({ coords: { latitude: "", longitude: "" } }),
    //     { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    // );
  });
};

const authManager = {
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  logout,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithApple,
  loginOrSignUpWithFacebook,
  sendSMSToPhoneNumber,
  sendPasswordResetEmail,
  loginWithSMSCode,
  registerWithPhoneNumber,
  retrieveUserByPhone,
  onVerification,
};

export default authManager;
