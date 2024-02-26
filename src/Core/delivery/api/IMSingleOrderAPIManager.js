import {VENDOR_ORDERS} from '../../../Configuration';
import {firebase} from '../../firebase/config';

export class IMSingleOrderAPIManager {
  constructor(setMarkers, refId) {
    this.updateMarkers = setMarkers;
    this.ref = firebase.firestore().collection(VENDOR_ORDERS).doc(refId);
    this.data = [];

    this.subscribe();
  }

  subscribe() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
  }

  cancel() {
    this.ref
      .update({
        status: 'Order Cancelled',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Cancel success');
      })
      .catch(err => {
        console.warn('Failed to update status', err);
      });
  }

  receive() {
    this.ref
      .update({
        status: 'Order Received',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('Marked order as received');
      })
      .catch(err => {
        console.error('Failed to update status', err);
      });
  }

  onCollectionUpdate = doc => {
    this.data.length = 0;
    let singleOrder = doc.data();
    this.updateMarkers(singleOrder);
  };

  unsubscribe = () => {
    this.unsubscribe();
  };
}
