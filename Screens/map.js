import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import MapboxGL from '@rnmapbox/maps';
import Feather from 'react-native-vector-icons/Feather';
import CheckboxTree, {ref} from 'react-native-checkbox-tree';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibnRkMTAxMDIwMDAiLCJhIjoiY2wweDV0NXc4MTdrdTNjbHoyaDN0MHh0dSJ9.FgCidedW7f6BHy2SLRbOcg',
);

const Maps = () => {
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiMap, setapiMap] = useState([]);
  const [gps, setGPS] = React.useState([105.843368696667, 20.9860569771816]);
  const [zoomLevel, setZoomLevel] = React.useState(13);
  const [selectionBottomSheet, setSelectionBottomSheet] = React.useState('');
  const [titleBottomSheet, setTitleBottomSheet] = React.useState('');

  getListMap = () => {
    const apiURL =
      'https://server.ekgis.vn/ekmapserver/rest/services/615/MapServer?token=1-48jPXQnD5Pjmfd11KpMk7a0xDLLcPsL1';
    fetch(apiURL)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson.layers);
      })
      .catch(error => {
        console.log('Error: ', error);
      });
  };

  // getListMap = () => {
  //   const apiURL ='https://server.ekgis.vn/ekmapserver/rest/services/615/MapServer?token=1-48jPXQnD5Pjmfd11KpMk7a0xDLLcPsL1';
  //   fetch(apiURL)
  //   .then((res) => res.json ())
  //   .then(async (resJson) => {
  //     await setIsLoading(false)
  //     await setdata(resJson.layers)
  //   }).catch((error) => {
  //     console.log('Error: ', error);
  //   })
  // }

  useEffect(() => {
    getListMap();
    return () => {};
  }, []);

  // const recursiveData = [
  //   {
  //     shopReportName: 'duongong1',
  //     shopCode: '00001',
  //     shopType: '2',
  //     shopId: 1,
  //     shopName: 'duongong1',
  //     childs: [
  //       {
  //         shopReportName: 'duongong2',
  //         shopCode: '00002',
  //         shopType: '3',
  //         shopId: 2,
  //         shopName: 'duongong2',
  //         childs: [
  //           {
  //             shopReportName: 'duongong3',
  //             shopCode: '00003',
  //             shopType: '4',
  //             shopId: 3,
  //             shopName: 'duongong3',
  //             childs: [
  //               {
  //                 shopReportName: 'duongong4',
  //                 shopCode: '00004',
  //                 shopType: '4',
  //                 shopId: 4,
  //                 shopName: 'duongong4',
  //               },
  //               {
  //                 shopReportName: 'duongong5',
  //                 shopCode: '00005',
  //                 shopType: '4',
  //                 shopId: 5,
  //                 shopName: 'duongong5',
  //                 childs: [
  //                   {
  //                     shopReportName: 'duongong6',
  //                     shopCode: '00006',
  //                     shopType: '4',
  //                     shopId: 7,
  //                     shopName: 'duongong6',
  //                     childs: [
  //                       {
  //                         shopReportName: 'duongong7',
  //                         shopCode: '00007',
  //                         shopType: '4',
  //                         shopId: 7,
  //                         shopName: 'duongong7',
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //               {
  //                 shopReportName: 'duongong8',
  //                 shopCode: '00008',
  //                 shopType: '4',
  //                 shopId: 8,
  //                 shopName: 'duongong8',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  const [styleURL, setStyleURL] = useState(
    'https://api.ekgis.vn/v2/mapstyles/water_bimson/style/water_bimson_vetinh.json?api_key=HiquCZqgKCAUE5pMY5MfKsMJCNqTRJVHPmSt5KCu',
  );

  const list_to_tree = list => {
    var map = {},
      node,
      roots = [],
      i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i;
      list[i].childs = [];
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentLayerId != -1) {
        list[map[node.parentLayerId]].childs.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  };

  const _map = React.useRef(null);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%', '79.2%'], []);

  const selectBottomSheet = async slbt => {
    if (slbt == 'LOPBANDO') {
      await setTitleBottomSheet('Lớp bản đồ');
      await setSelectionBottomSheet('LOPBANDO');
      await bottomSheetRef.current.snapToIndex(1);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor="#ffffff00"
        hidden={false}
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.containerMap}>
        <MapboxGL.MapView
          ref={_map}
          style={styles.map}
          styleURL={styleURL}
          compassViewMargins={{x: 15, y: 100}}
          logoEnabled={false}
          tintColor={'#fff'}></MapboxGL.MapView>

        <View style={styles.containerStyleBanDo}>
          <TouchableOpacity
            style={styles.btnStyleBanDo}
            onPress={() => selectBottomSheet('LOPBANDO')}>
            <Text>
              <Feather name="layers" size={20} color={'#000'} />
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        style={{elevation: 8}}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableContentPanningGesture={true}
        enablePanDownToClose={true}
        enableOverDrag={true}
        animateOnMount={true}>
        <View
          style={{
            paddingBottom: 20,
            paddingLeft: 15,
            borderBottomColor: '#44444450',
            borderBottomWidth: 0.8,
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontFamily: 'PoppinsVN-500',
            }}>
            {titleBottomSheet}
          </Text>
        </View>
        {selectionBottomSheet === 'LOPBANDO' && (
          // <BottomSheetScrollView
          //   contentContainerStyle={{
          //     backgroundColor: 'white',
          //   }}>
          //  isLoading?null:(

          <CheckboxTree
            ref={ref}
            data={list_to_tree(data)}
            textField="name"
            childField="childs"
            textStyle={{color: 'black'}}
            iconColor="black"
            iconSize={26}
            openIcon={<AntDesign name="arrowdown" size={26} />}
            closeIcon={<AntDesign name="arrowright" size={26} />}
            renderItem={({
              item,
              isSelect,
              isOpen,
              onOpen,
              onClose,
              onSelect,
            }) => (
              <View style={styles.wrapItem}>
                {isOpen ? (
                  <TouchableOpacity onPress={onClose}>
                    <AntDesign size={23} name="arrowright" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={onOpen}>
                    <AntDesign size={23} name="arrowdown" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onSelect}>
                  <Ionicons
                    size={23}
                    name={isSelect ? 'checkbox-outline' : 'square-outline'}
                  />
                </TouchableOpacity>
                <Text style={styles.name}>{item.name}</Text>
              </View>
            )}
            onSelect={ item => {
              for (let index = 0; index < item.length; index++) {
                 const layer = item[index];
                _map.current.setSourceVisibility(layer.tick=='tick', '615', layer.id)
              }  
              // item.map ( async hide => {
              //   await _map.current.setSourceVisibility(
              //     false,
              //     '615',
              //     JSON.stringify(hide.id),
              //   );
              // });
              
            }}
          />
          // </BottomSheetScrollView>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  containerMap: {
    height: '100%',
    width: '100%',
  },
  containerBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  btnStyle: {
    borderRadius: 5,
    margin: 15,
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: "#ccc",
    // borderWidth: 1,
    elevation: 8,
    // zIndex: 1,
  },
  textBtn: {
    fontSize: 30,
    color: '#000',
  },
  btnStyleBanDo: {
    borderRadius: 5,
    margin: 6,
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: "#ccc",
    // borderWidth: 1,
    elevation: 8,
  },
  containerStyleBanDo: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginBottom: 9,
    marginLeft: 9,
    zIndex: 0,
  },
  containerSearch: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 3,
    flexGrow: 1,
    flexShrink: 1,
  },
  inputSearch: {
    borderRadius: 50,
    margin: 15,
    marginTop: 25,
    // width: '100%',
    backgroundColor: '#fff',
    elevation: 8,
    paddingHorizontal: 15,
    paddingVertical: 6,
    zIndex: 3,
    borderColor: '#397af8',
    borderWidth: 1,
  },
  containerButton: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    position: 'absolute',
    left: 30,
    top: 70,
    width: '90%',
    zIndex: 5,
  },
  buttonInMap: {
    backgroundColor: 'white',
    width: '40%',
    height: 40,
    color: 'black',
    marginRight: 5,
  },
  wrapItem: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  text: {
    fontSize: 18,
  },
  iconItem: {
    marginHorizontal: 8,
  },
});

export default Maps;
