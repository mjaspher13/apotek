import {firebase} from '../../firebase/config';

export class ReviewAPIManager {
  constructor(setData, id, tableName) {
    console.log('ReviewAPIManager constructor id:', id, tableName, setData)
    this.updateData = setData;
    this.tableName = tableName;
    this.entityID = id;
    this.ref = firebase
      .firestore()
      .collection(tableName)
      .where('entityID', '==', id);
    this.data = [];
    this.subscribe();
  }

  subscribe() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate, error => {
      console.log(error);
    });
  }

  addReview(rating, text, user) {
    firebase
      .firestore()
      .collection(this.tableName)
      .add({
        author: user,
        authorID: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        authorProfilePic: user.profilePictureURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        entityID: this.entityID,
        id: user.id,
        rating,
        text,
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
    this.updateData(this.data);
  };

  unsubscribe = () => {
    this.unsubscribe();
  };
}
