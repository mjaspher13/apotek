import {firebase} from '../Core/firebase/config';
import { SETTINGS } from '../Configuration'
import { updateSettings } from '../redux/settings';

// Based on adminDeliveries.js
export default class Settings {
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.ref = firebase
      .firestore()
      .collection(SETTINGS);
    this.data = [];

    return this.subscribe();
  }

  subscribe() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
    return this.unsubscribe;
  }

  onCollectionUpdate = querySnapshot => {
    this.data = {}; // Reset all held data
    querySnapshot.forEach(doc => {
      const setting = doc.data();
      this.data[setting.id] = setting;
    });
    this.unsubscribe(); // Test double call;
    this.updateSettings(this.data);
  };

  updateSettings(data) {
    this.dispatch(updateSettings(data));
  }
}