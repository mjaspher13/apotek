import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles';
import ReservationItem from '../../components/ReservationItem/ReservationItem';
import {firebase} from '../../Core/firebase/config';
import { IMLocalized } from '../../Core/localization/IMLocalization';

class ReservationHistoryScreen extends Component {
  static navigationOptions = () => ({
    title: IMLocalized('Reservation History')
  });

  constructor(props) {
    super(props);
    this.state = {
      reservations: [],
    };
    this.reservations = this.props.navigation.getParam('reservations');
    this.reservationRef = 
      firebase
        .firestore()
        .collection('reservations');
  }

  componentDidMount() {
    this.unsubscribeReservations = this.reservationRef
      .orderBy('createdAt', 'desc')
      .where('authorID', '==', this.props.user.id)
      .onSnapshot(this.onReservationUpdate);
  }

  componentWillUnmount() {
    this.unsubscribeReservations();
  }

  onReservationUpdate = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });

    this.setState({
      reservations: data,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.reservations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ReservationItem constructorObject={item} />
          )}
          style={{ width: '95%' }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

ReservationHistoryScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

export default connect(mapStateToProps)(ReservationHistoryScreen);
