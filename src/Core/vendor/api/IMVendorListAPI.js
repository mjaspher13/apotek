import {firebase} from '../../firebase/config';

export default class IMVendorListAPI {
  constructor(callback, table) {
    this.callback = callback;
    this.vendorsRef = 
      firebase
        .firestore()
        .collection(table);

    this.vendorsUnsubscribe = this.vendorsRef.onSnapshot(
      this.onVendorsCollectionUpdate,
    );
  }

  unsubscribe() {
    this.vendorsUnsubscribe();
  }

  onVendorsCollectionUpdate = querySnapshot => {
    const vendors = [];
    querySnapshot.forEach(doc => {
      vendors.push({
        id: doc.id,
        ...doc.data()
      });
    });
    this.callback(vendors);
  };
}
