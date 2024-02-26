import {VENDOR_ORDERS} from '../../Configuration';
import {firebase} from '../../Core/firebase/config';

export class VendorOrderAPIManager {
  constructor(callback = console.log) {
    this.callback = callback;
  }

  subscribe = viewer => {
    console.log(
      'VendorOrderAPIManager subscribe:',
      Object.keys(viewer),
      viewer.vendorID,
    );
    // The current user (viewer) is the admin of a vendor, so they can manage all the orders placed for that vendor
    this.ref = firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .where('vendorID', 'in', viewer.vendorID)
      .orderBy('createdAt', 'desc');

    this.unsubscribeSnapshot = this.ref.onSnapshot(
      this.onCollectionUpdate,
      error => {
        console.log(error);
      },
    );
  };

  unsubscribe = () => {
    this.unsubscribeSnapshot && this.unsubscribeSnapshot();
  };

  accept = async order => {
    return firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({status: 'Order Accepted'});
  };

  reject = async order => {
    return firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({status: 'Order Rejected'});
  };

  onDelete = orderID => {
    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(orderID)
      .delete()
      .then(result => console.warn(result));
  };

  onCollectionUpdate = querySnapshot => {
    const orders = [];
    querySnapshot.forEach(doc => {
      const order = doc.data();
      orders.push({
        id: doc.id,
        ...order,
      });
    });
    this.callback && this.callback(orders);
  };
}
