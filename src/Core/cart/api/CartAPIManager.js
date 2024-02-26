import {firebase} from '../../../Core/firebase/config';
import {createPayment} from '../../../api/paynamics/index';

export default class CartAPIManager {
  constructor() {
    this.ref = firebase.firestore().collection('restaurant_orders');
    this.paymentRef = firebase.firestore().collection('payments');

    this.unsubPayments = null;
  }

  async getPendingPayments(customerID) {
    this.unsubPayment = this.unsubPayment
      ? this.unsubPayment
      : this.paymentsRef.filter('').onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            const d = doc.data();
          });
        });
  }

  async chargeCustomer({
    customer,
    currency,
    amount,
    source,
    appConfig,
    onPaymentUpdate,
  }) {
    return createPayment(
      {
        source: source.key,
        author: customer,
        amount,
      },
      appConfig,
    ).then(r => {
      this.paymentRef.doc(r.reference).set({
        id: r.reference,
        amount,
        customerID: customer.id,
        customer: customer.firstName + ' ' + customer.lastName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        redirect_url: r.redirect_url,
        reference: r.reference,
        status: 'PENDING',
      });
      const unsub = this.paymentRef.doc(r.reference).onSnapshot(snap => {
        const doc = snap.data();
        if (doc && doc.status !== 'PENDING') {
          onPaymentUpdate(doc);
          unsub();
        }
      });
      return r;
    });
  }

  async placeOrder(
    cartItems,
    user,
    shippingAddress,
    vendor,
    prescriptions,
    paymentReference,
    delivery_fee,
    callback,
  ) {
    const products = [];
    cartItems.forEach(item => {
      const {
        name,
        price,
        quantity,
        classification,
        categoryID,
        discounted,
        tags,
      } = item;
      products.push({
        id: item.id,
        name,
        quantity,
        tags,
        discounted,
        categoryID,
        photo: item.photo || '',
        price,
        classification,
      });
    });

    const order = {
      authorID: user.id,
      author: user,
      products,
      prescriptions,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      vendorID: cartItems[cartItems.length - 1].vendorID || vendor?.id,
      vendor: vendor,
      status: 'Order Placed',
      deliveryFee: delivery_fee,
      address: shippingAddress,
      payment: paymentReference.reference,
      paymentMethod: paymentReference.method,
      paymentStatus: paymentReference.reference === 'COD' ? 'COD' : 'SUCCESS',
    };

    try {
      const response = await this.ref.add(order);
      const finalOrder = {...order, id: response.id};
      this.ref.doc(response.id).update(finalOrder);

      callback && callback(finalOrder);
      return finalOrder;
    } catch (err) {}
  }
}
