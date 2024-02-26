import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Text} from 'react-native';
import AdminVendorAPIManager from '../../api/AdminVendorAPIManager';
import AdminAddVendorModal from '../AdminAddVendor/AdminAddVendorModal';
import styles from './styles';
import Hamburger from '../../../../../components/Hamburger/Hamburger';
import { IMLocalized } from '../../../../localization/IMLocalization';

export default function AdminVendorListScreen() {
  const [data, setData] = useState([]);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const apiManager = new AdminVendorAPIManager(setData);
    return () => {
      apiManager.unsubscribe();
    };
  }, [1]);

  const renderVendors = item => {
    return (
      <View>
        <Text style={styles.mainText}>{item.data.name}</Text>
        <Text style={styles.subText}>{item.data.description}</Text>
        <View style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AdminAddVendorModal
        isVisible={isVisible}
        close={() => setVisible(false)}
      />
      <FlatList data={data} renderItem={({item}) => renderVendors(item)} />
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={styles.button}>Add new</Text>
      </TouchableOpacity>
    </View>
  );
}

AdminVendorListScreen.navigationOptions = ({navigation}) => ({
  headerTitle: IMLocalized('Restaurants'),
  headerRight: () => <Text>{''}</Text>,
  headerLeft: () => (
    <Hamburger
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  ),
});
