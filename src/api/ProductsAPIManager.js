import {firebase} from '../Core/firebase/config';
import AppConfig from '../VendorAppConfig';

export default class ProductsAPIManager {
  constructor(callback) {
    this.callback = callback;
    this.productsRef =
        firebase
        .firestore()
        .collection(AppConfig.tables.VENDOR_PRODUCTS)
        .where("popular", "==", "true");
    this.productsUnsubscribe = this.productsRef.onSnapshot(
      this.onProductsCollectionUpdate,
    );
  }

  unsubscribe() {
    this.productsUnsubscribe && this.productsUnsubscribe();
  }

  onProductsCollectionUpdate = querySnapshot => {
    const products = [];
    querySnapshot.forEach(doc => {
        products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    this.callback(products);
  };
}
