import React, {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import Modal from 'react-native-modal';
import {Rating} from 'react-native-elements';
import Button from 'react-native-button';
import {Appearance} from 'react-native-appearance';
import dynamicStyles from './styles';

const COLOR_SCHEME = Appearance.getColorScheme();

export default function AddReviewModal({
  submitReview,
  appStyles,
  close,
  isVisible,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const styles = dynamicStyles(appStyles);

  const onFinishRating = newRating => {
    setRating(newRating);
  };

  const onTypeReview = text => {
    setReview(text);
  };

  const onSubmit = () => {
    submitReview(rating, review);
    close();
  };
  return (
    <Modal
      onSwipeComplete={close}
      swipeDirection="down"
      style={styles.modal}
      isVisible={isVisible}
      backdropColor={'grey'}>
      <View style={styles.container}>
        <Text style={styles.reviewText}>Add Review</Text>
        <Rating
          ratingColor={
            appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor
          }
          type={'custom'}
          ratingCount={5}
          fractions={0}
          imageSize={30}
          startingValue={2}
          onFinishRating={onFinishRating}
        />
        <TextInput onChangeText={onTypeReview} style={styles.input} />
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={onSubmit}>
          Add Review
        </Button>
      </View>
    </Modal>
  );
}
