import {VENDOR} from '../../../../Configuration';
import {firebase} from '../../../firebase/config';

export default class AdminVendorAPIManager {
  constructor(setVendor) {
    this.updateVendor = setVendor;
    this.ref =
      firebase
        .firestore()
        .collection(VENDOR);
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
      const vendorData = doc.data();
      this.data.push({
        id: doc.id,
        data: vendorData,
      });
    });
    this.updateVendor(this.data);
  };

  addVendor(newVendor) {
    this.ref
      .add(newVendor)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  unsubscribe = () => {
    this.unsubscribe();
  };
}
