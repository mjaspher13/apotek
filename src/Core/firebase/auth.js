import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {ErrorCode} from '../onboarding/utils/ErrorCode';
import {firebase} from './config';
import {firebase as RNFBAuth} from '@react-native-firebase/auth';
import {VENDOR_ORDERS} from '../../Configuration';

const usersRef = firebase.firestore().collection('users');
const ordersRef = firebase.firestore().collection(VENDOR_ORDERS);

const handleUserFromAuthStateChanged = (user, resolve) => {
  if (user) {
    usersRef
      .doc(user.uid)
      .get()
      .then(document => {
        const userData = document.data();

        return ordersRef
          .where('authorID', '==', user.uid)
          .limit(1)
          .get()
          .then(notASnapshot => {
            resolve({
              ...userData,
              id: user.uid,
              userID: user.uid,
              hasPastOrder: notASnapshot.size > 0,
              showFDF: notASnapshot.size === 0,
            });
          });
      })
      .catch(error => {
        resolve(null);
      });
  } else {
    resolve(null);
  }
};

export const tryAlternatePersistedAuthUserRetriever = resolve => {
  RNFBAuth.auth().onAuthStateChanged(user => {
    if (user) {
      return handleUserFromAuthStateChanged(user, resolve);
    } else {
      resolve(null);
    }
  });
};

export const retrievePersistedAuthUser = () => {
  return new Promise(resolve => {
    return firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return handleUserFromAuthStateChanged(user, resolve);
      } else {
        return tryAlternatePersistedAuthUserRetriever(resolve);
      }
    });
  });
};

export const sendPasswordResetEmail = email => {
  return firebase.auth().sendPasswordResetEmail(email);
};

const signInWithCredential = (AuthManager, credential, appIdentifier) => {
  return new Promise((resolve, _reject) => {
    AuthManager.auth()
      .signInWithCredential(credential)
      .then(response => {
        const isNewUser = response.additionalUserInfo.isNewUser;
        let {
          first_name,
          last_name,
          email: credemail,
          display_name,
        } = response.additionalUserInfo.profile;
        const {uid, email, phoneNumber, photoURL} = response.user;
        if (display_name && !first_name) {
          const split = display_name.split(' ');
          if (split.length > 1) {
            first_name = split.slice(0, split.length);
            last_name[split.length - 1];
          } else {
            first_name = split[0];
          }
        }

        if (isNewUser) {
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();
          const userData = {
            id: uid,
            email: credemail || email || '',
            firstName: first_name || '',
            lastName: last_name || '',
            phone: phoneNumber || '',
            profilePictureURL: photoURL || '',
            userID: uid,
            appIdentifier,
            discountVerified: 'NONE',
            created_at: timestamp,
            createdAt: timestamp,
          };
          usersRef
            .doc(uid)
            .set(userData)
            .then(() => {
              resolve({
                user: {...userData, id: uid, userID: uid},
                accountCreated: true,
              });
            });
        }

        return ordersRef
          .where('authorID', '==', uid)
          .limit(1)
          .get()
          .then(notASnapshot => {
            console.log(
              'CREDENTIAL SIGNIN: Has past orders?',
              notASnapshot.size,
            );
            return usersRef
              .doc(uid)
              .get()
              .then(document => {
                const userData = document.data();
                userData.hasPastOrder = notASnapshot.size > 0;
                userData.showFDF = notASnapshot.size === 0;

                // Update with Facebook (and Apple? TODO - TEST!) email which we previously didn't store
                // since the code was looking at `response.user` (for Firebase) instead of response.additionalInfo.profile
                if (!userData.email && credemail) {
                  userData.email = credemail;
                  usersRef
                    .doc(uid)
                    .update({
                      email: credemail,
                    })
                    .catch();
                  // Don't wait for it, just let it update
                }
                // As for the name, if we didn't get it initially... TODO?
                if (!userData.firstName && !userData.lastName && first_name) {
                  // first_name and last_name were updated above
                  if (last_name) {
                    userData.lastName = last_name;
                  }
                  // Either way, first_name will have a value now
                  usersRef
                    .doc(uid)
                    .update({
                      firstName: first_name,
                      lastName: last_name,
                    })
                    .catch();
                }

                resolve({
                  user: {...userData, id: uid, userID: uid},
                  accountCreated: false,
                });
              });
          })
          .catch(error => {
            if (error.code === '') {
              resolve({error: ErrorCode.badEmailFormat});
            } else {
              resolve({error: ErrorCode.serverError});
            }
          });
      })
      .catch(err => {
        console.warn('Past order check error:', err.message);
        resolve({error: ErrorCode.serverError});
      });
  });
};

export const register = (userDetails, appIdentifier) => {
  const {
    email,
    firstName,
    lastName,
    password,
    phone,
    company,
    birthday,
    profilePictureURL,
    location,
    discountID,
    discountRelation,
    signUpLocation,
  } = userDetails;
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(response => {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const uid = response.user.uid;

      const data = {
        id: uid,
        userID: uid, // legacy reasons
        email,
        firstName,
        lastName,
        phone: phone || '',
        company,
        birthday,
        profilePictureURL,
        discountID: discountID || '',
        discountVerified: discountID.length ? 'PENDING' : 'NONE',
        discountRelation: discountRelation || '',
        location: location || '',
        signUpLocation: signUpLocation || '',
        appIdentifier,
        createdAt: timestamp,
        created_at: timestamp,
      };
      return usersRef
        .doc(uid)
        .set(data)
        .then(() => ({
          user: data,
          showFDF: true,
        }))
        .catch(error => {
          alert(error);
          return {error: ErrorCode.serverError};
        });
    })
    .catch(error => {
      var errorCode = ErrorCode.serverError;
      if (error.code === 'auth/email-already-in-use') {
        errorCode = ErrorCode.emailInUse;
      } else if (error.code === 'auth/invalid-email') {
        errorCode = ErrorCode.badEmailFormat;
      }
      return {error: errorCode};
    });
};

export const loginWithEmailAndPassword = async (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => {
      const uid = response.user.uid;

      const userData = {
        email,
        id: uid,
      };
      return usersRef
        .doc(uid)
        .get()
        .then(function (firestoreDocument) {
          if (!firestoreDocument.exists) {
            return {errorCode: ErrorCode.noUser};
          }
          const user = firestoreDocument.data();

          return ordersRef
            .where('authorID', '==', uid)
            .limit(1)
            .get()
            .then(notASnapshot => {
              const newUserData = {
                ...userData,
                ...user,
                hasPastOrder: notASnapshot.size > 0,
                showFDF: notASnapshot.size === 0,
              };
              return {user: newUserData};
            });
        })
        .catch(function (_error) {
          return {error: ErrorCode.serverError};
        });
    })
    .catch(error => {
      var errorCode = ErrorCode.serverError;
      switch (error.code) {
        case 'auth/wrong-password':
          errorCode = ErrorCode.invalidPassword;
          break;
        case 'auth/network-request-failed':
          errorCode = ErrorCode.serverError;
          break;
        case 'auth/user-not-found':
          errorCode = ErrorCode.noUser;
          break;
        case 'auth/invalid-email':
          errorCode = ErrorCode.badEmailFormat;
          break;
        default:
          errorCode = ErrorCode.serverError;
      }
      return {error: errorCode};
    });
};

export const loginWithApple = (identityToken, nonce, appIdentifier) => {
  const appleCredential = RNFBAuth.auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  return new Promise((resolve, _reject) => {
    signInWithCredential(RNFBAuth, appleCredential, appIdentifier).then(
      response => {
        resolve(response);
      },
    );
  });
};

export const loginWithFacebook = (accessToken, appIdentifier) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);

  return new Promise((resolve, _reject) => {
    signInWithCredential(firebase, credential, appIdentifier)
      .then(response => {
        resolve(response);
      })
      .catch(_reject);
  });
};

export const logout = () => {
  firebase.auth().signOut();
  RNFBAuth.auth().signOut();
};

export const onVerificationChanged = phone => {
  auth()
    .verifyPhoneNumber(phone)
    .on(
      'state_changed',
      phoneAuthSnapshot => {
        console.log('State: ', phoneAuthSnapshot.state);
      },
      error => {
        console.error('onVerificationChanged Error', error);
      },
      phoneAuthSnapshot => {
        console.log(phoneAuthSnapshot);
      },
    );
};

export const retrieveUserByPhone = phone => {
  return new Promise(resolve => {
    usersRef.where('phone', '==', phone).onSnapshot(querySnapshot => {
      if (querySnapshot.docs.length <= 0) {
        resolve({error: true});
      } else {
        resolve({success: true});
      }
    });
  });
};

export const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, captchaVerifier)
      .then(function (confirmationResult) {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        resolve({confirmationResult});
      })
      .catch(function (error) {
        console.log('Send SMS to Phone Error', error);
        resolve({error: ErrorCode.smsNotSent});
      });
  });
};

export const loginWithSMSCode = (smsCode, verificationID) => {
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  );
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        const {user} = result;
        usersRef
          .doc(user.uid)
          .get()
          .then(function (firestoreDocument) {
            if (!firestoreDocument.exists) {
              resolve({errorCode: ErrorCode.noUser});
              return;
            }
            const userData = firestoreDocument.data();
            resolve({user: userData});
          })
          .catch(function (_error) {
            resolve({error: ErrorCode.serverError});
          });
      })
      .catch(_error => {
        resolve({error: ErrorCode.invalidSMSCode});
      });
  });
};

export const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  const {
    firstName,
    lastName,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  } = userDetails;
  const credential = firebase.auth.PhoneAuthProvider.credential(
    verificationID,
    smsCode,
  );
  return new Promise(function (resolve, _reject) {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(response => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const uid = response.user.uid;
        const data = {
          id: uid,
          userID: uid, // legacy reasons
          firstName,
          lastName,
          phone,
          profilePictureURL,
          location: location || '',
          signUpLocation: signUpLocation || '',
          appIdentifier,
          created_at: timestamp,
          createdAt: timestamp,
        };
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            resolve({user: data});
          });
      })
      .catch(error => {
        console.log('Register with Phone error', error);
        var errorCode = ErrorCode.serverError;
        if (error.code === 'auth/email-already-in-use') {
          errorCode = ErrorCode.emailInUse;
        }
        resolve({error: errorCode});
      });
  });
};

export const updateProfilePhoto = (userID, profilePictureURL) => {
  return new Promise((resolve, _reject) => {
    usersRef
      .doc(userID)
      .update({profilePictureURL: profilePictureURL})
      .then(() => {
        resolve({success: true});
      })
      .catch(error => {
        console.log('Update profile photo error', error);
        resolve({error: error});
      });
  });
};

export const fetchAndStorePushTokenIfPossible = async user => {
  try {
    const settings = await messaging().requestPermission();
    if (settings) {
      const token = await messaging().getToken();
      updateUser(user.id || user.userID, {
        ...user,
        pushToken: token,
        pushKitToken: '',
      });
    }
  } catch (error) {
    console.log('Fetch/store push token error', error);
  }
};

export const updateUser = async (userID, newData) => {
  const dataWithOnlineStatus = {
    ...newData,
    lastOnlineTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await usersRef.doc(userID).set({...dataWithOnlineStatus}, {merge: true});
  const doc = await usersRef.doc(userID).get();
  return doc.data();
};

export const getUserByID = async userID => {
  try {
    const document = await usersRef.doc(userID).get();
    if (document) {
      return document.data();
    }
    return null;
  } catch (error) {
    console.log('Get user error', error);
    return null;
  }
};
