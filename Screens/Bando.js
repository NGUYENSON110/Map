import React, {Component, useState, useRef, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
MapboxGL.setAccessToken('<YOUR_ACCESSTOKEN>');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  

  // hooks
  const sheetRef = useRef < BottomSheet > null;

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // callbacks
  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);
  }, []);
  const handleSnapPress = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={
            'https://api.ekgis.vn/v2/mapstyles/water_bimson/style/water_bimson_vetinh.json?api_key=HiquCZqgKCAUE5pMY5MfKsMJCNqTRJVHPmSt5KCu'
          }
        />
      </View>
      <View>
        <TouchableOpacity style={styles.TouchBtn}
          onPress={()=> handleSheetChange}
        >
          <Text>
            <Fontawesome name="crosshairs" size={20} color="red" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: windowHeight,
    width: windowWidth,
    flex: 1,
  },
  map: {
    flex: 1,
  },
  TouchBtn: {
    borderRadius: 5,
    margin: 6,
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    position: 'relative',
    marginTop: -150,
  },
});
