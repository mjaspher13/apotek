import {firebase} from '../../Core/firebase/config';
import AppConfig from '../../VendorAppConfig';

export class OrdersAPIManager {
  constructor(callback = console.log) {
    this.callback = callback;
  }

  subscribe = (driverID) => {
    if (!driverID) {
      return
    }
    this.ref = firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.ORDERS)
      .where('driverID', '==', driverID)
      .orderBy('createdAt', 'desc');

    this.unsubscribeSnapshot = this.ref.onSnapshot(this.onDataUpdate, error => {
      console.log(error);
      alert(error)
    });
  }

  unsubscribe = () => {
    this.unsubscribeSnapshot && this.unsubscribeSnapshot()
  }

  onDataUpdate = querySnapshot => {
    this.callback && this.callback(querySnapshot.docs.map(doc => doc.data()));
  };
}
