import { firebase } from './config';

import {
  VENDOR_ORDERS,
} from '../../Configuration';
export const usersRef = firebase.firestore().collection('users');

export const getUserData = async (userId) => {
  try {
    const user = await usersRef.doc(userId).get();
    const hasPastOrder = await firebase.firestore()
      .collection(VENDOR_ORDERS)
      .where(['userId', '==', userId])
      .limit(1).get();
    console.log('USER HAS PAST ORDER?', hasPastOrder.data());

    return { data: { ...user.data(), id: user.id }, success: true };
  } catch (error) {
    console.log(error);
    return {
      error: 'Oops! an error occurred. Please try again',
      success: false,
    };
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    const userRef = usersRef.doc(userId);

    await userRef.update({
      ...userData,
    });

    return { success: true };
  } catch (error) {
    return { error, success: false };
  }
};

export const subscribeUsers = (userId, callback) => {
  return usersRef.onSnapshot((querySnapshot) => {
    const data = [];
    const completeData = [];
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      data.push({ ...user, id: doc.id });
      completeData.push({ ...user, id: doc.id });
    });
    return callback(data, completeData);
  });
};

export const subscribeCurrentUser = (userId, callback) => {
  console.log('Subscribe current user:', userId)
  const ref = usersRef
    .where('id', '==', userId)
    .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        callback(docs[0].data());
      }
    });
  return ref;
};
