import {decode, encode} from 'base-64';
import './timerConfig';
global.addEventListener = x => x;
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBGaMzxxiWzhs20b9Om2WD6Vi-I4njrOSU',
  authDomain: 'apotek-mjaspher.firebaseapp.com',
  databaseURL: 'https://apotek-mjaspher.firebaseio.com',
  projectId: 'apotek-mjaspher',
  storageBucket: 'apotek-mjaspher.appspot.com',
  messagingSenderId: '667922180882',
  appId: '1:667922180882:web:4bd4862f6f8e5f37d721cb',
  measurementId: 'G-VK0CQ24GFF',
};

const config = firebaseConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export {config, firebase};
