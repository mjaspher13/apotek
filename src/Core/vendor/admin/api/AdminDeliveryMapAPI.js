import {VENDOR_DELIVERIES} from '../../../../Configuration';
import {firebase} from '../../../firebase/config';

export class AdminDeliveryMapAPI {
  constructor(setMarkers) {
    this.updateMarkers = setMarkers;
    this.ref = firebase
      .firestore()
      .collection(VENDOR_DELIVERIES);
    this.data = [];

    this.subscribe();
  }

  subscribe() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
  }

  onCollectionUpdate = querySnapshot => {
    this.data.length = 0;
    querySnapshot.forEach(doc => {
      const singleOrder = doc.data();
      this.data.push({
        id: doc.id,
        data: singleOrder,
      });
    });
    this.updateMarkers(this.data);
  };

  unsubscribe = () => {
    this.unsubscribe();
  };
}
