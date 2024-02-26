import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import {ReviewAPIManager} from '../../api/ReviewAPIManager';
import FastImage from 'react-native-fast-image';
import {Appearance} from 'react-native-appearance';
import {Rating} from 'react-native-ratings';
import moment from 'moment';
import IMAddReviewModal from '../../components/IMAddReviewModal/IMAddReviewModal';
import {connect} from 'react-redux';
import dynamicStyles from './styles';

const COLOR_SCHEME = Appearance.getColorScheme();

function IMVendorReview({navigation, user}) {
  const [reviews, setReviews] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const id = navigation.getParam('entityID', '');
  const appConfig = navigation.state.params.appConfig;
  const apiManager = new ReviewAPIManager(
    setReviews,
    id,
    appConfig.tables.VENDOR_REVIEWS,
  );
  const appStyles = navigation.state.params.appStyles;
  const styles = dynamicStyles(appStyles);

  useEffect(() => {
    navigation.setParams({showModal});
    return () => {
      apiManager.unsubscribe();
    };
  }, [1]);

  function showModal() {
    setVisible(true);
  }

  const renderSingleReviews = ({item}) => {
    const date = moment.unix(item.data.createdAt.seconds);
    return (
      <View>
        <IMAddReviewModal
          appStyles={appStyles}
          isVisible={isVisible}
          close={() => setVisible(false)}
          submitReview={(rating, review) =>
            apiManager.addReview(rating, review, user)
          }
        />
        <View style={[styles.horizontalPane, styles.pad]}>
          <View style={styles.horizontalPane}>
            <FastImage
              source={{uri: item.data.authorProfilePic}}
              style={styles.profilePic}
            />
            <View>
              <Text style={styles.authorName}>{item.data.authorName}</Text>
              <Text style={styles.authorName}>
                {date.format('MMMM Do YYYY')}
              </Text>
            </View>
          </View>

          <Rating
            ratingColor={
              appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor
            }
            type={'custom'}
            startingValue={item.data.rating}
            readonly
            style={styles.starBox}
            imageSize={15}
            ratingCount={5}
          />
        </View>
        <Text style={styles.reviewText}>{item.data.text}</Text>
      </View>
    );
  };
  return (
    <FlatList
      data={reviews}
      renderItem={renderSingleReviews}
      style={styles.container}
      keyExtractor={item => item.id}
    />
  );
}

IMVendorReview.navigationOptions = ({navigation, screenProps}) => {
  const appStyles = navigation.state.params.appStyles;
  const showModal = navigation.state.params.showModal;
  const styles = dynamicStyles(appStyles);
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => showModal()}>
        <FastImage
          tintColor={
            appStyles.navThemeConstants[screenProps.theme].activeTintColor
          }
          style={styles.headerRightContainer}
          source={appStyles.iconSet.create}
        />
      </TouchableOpacity>
    ),
  };
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(IMVendorReview);
