import {firebase} from '../../Core/firebase/config';
import {VENDOR_ORDERS} from '../../Configuration';
import AppConfig from '../../VendorAppConfig';

import { ORDER_STATUSES } from '../../Configuration';

export class DriverAPIManager {
  constructor(callback = console.log, orderUpdatesCallback = console.log) {
    this.callback = callback;
    this.orderUpdatesCallback = orderUpdatesCallback
  }

  subscribeToDriverDataUpdates = (driver) => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    // We're listening to the incoming requests for orders
    this.ref = firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
      .doc(driver.id)

    this.unsubscribeSnapshot = this.ref.onSnapshot(this.onDriverUserDataUpdate, error => {
      console.log(error);
    });
  }

  subscribeToOrder = (orderID) => {
    if (!orderID || orderID.length == 0) {
      return
    }

    this.unsubscribeOrder = firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(orderID)
      .onSnapshot(this.onOrderDataUpdate, error => {
        console.log(error);
      });
  }

  goOnline = async (driver) => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }

    this.ref = firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
      .doc(driver.id)
      .update({isActive: true})
  }

  goOffline = async (driver) => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    this.ref = firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
      .doc(driver.id)
      .update({isActive: false})
  }

  unsubscribe = () => {
    this.unsubscribeSnapshot && this.unsubscribeSnapshot()
    this.unsubscribeOrder && this.unsubscribeOrder()
  }

  accept = async (order, driver) => {
    if (!driver || !driver.id || driver.id.length == 0) {
      return
    }
    if (!order || !order.id || order.id.length == 0) {
      return
    }
    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({
        status: ORDER_STATUSES.DriverAccepted,
        driver,
        driverID: driver.id,
      });
  
    firebase
        .firestore()
        .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
        .doc(driver.id)
        .update({
          orderRequestData: null,
          inProgressOrderID: order.id
        })
  }

  reject = async (order, driver) => {
    var rejectedByDrivers = (order.rejectedByDrivers ? order.rejectedByDrivers : [])
    rejectedByDrivers.push(driver.id)
        
    firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
      .doc(driver.id)
      .update({orderRequestData: null})

    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({ status: ORDER_STATUSES.DriverRejected, rejectedByDrivers });
  }

  onDelete = orderID => {
    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(orderID)
      .delete()
      .then(result => console.warn(result));
  };

  markAsPickedUp = async (order) => {
    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({status: ORDER_STATUSES.InTransit })
  }

  markAsCompleted = async (order, driver) => {
    firebase
      .firestore()
      .collection(VENDOR_ORDERS)
      .doc(order.id)
      .update({
        status: ORDER_STATUSES.Completed,
        proof: order.proof,
      })

    firebase
      .firestore()
      .collection(AppConfig.FIREBASE_COLLECTIONS.USERS)
      .doc(driver.id)
      .update({inProgressOrderID: null, orderRequestData: null})
  }

  onDriverUserDataUpdate = querySnapshot => {
    const data = querySnapshot.data()
    this.callback && this.callback(data);
  };

  onOrderDataUpdate = querySnapshot => {
    console.log('Update Order', data);
    const data = querySnapshot.data()
    this.orderUpdatesCallback && this.orderUpdatesCallback(data);
  }
}
