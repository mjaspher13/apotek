import {firebase} from '../../../firebase/config';
import {VENDOR_ORDERS} from '../../../../Configuration';

export class AdminOrderAPIManager {
  constructor(updateOrder = console.log) {
    const authorID = 'WKpTfDzvg8WxGgliOFRMG9uiGWF2';
    this.ref = firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .where('authorID', '==', authorID)
      .orderBy('createdAt', 'desc');
    this.updateOrder = updateOrder;

    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
  }

  onDelete = orderID => {
    firebase
      .firestore()
      .collection('restaurant_orders')
      .doc(orderID)
      .delete()
      .then(result => console.warn('Deleted:', result));
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const {foods} = doc.data();
      data.push({
        id: doc.id,
        list: foods,
      });
    });
    this.updateOrder(data);
  };
}
