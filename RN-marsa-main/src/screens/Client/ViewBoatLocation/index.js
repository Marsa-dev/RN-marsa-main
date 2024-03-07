import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import icons from '../../../assets/icons/icons';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

let mapRef = null;
const { width, height } = Dimensions.get("window");
let aspectRatio = width / height;
let ltDelta = 0.0712;
let lgDelta = ltDelta * aspectRatio;

const ViewBoatLocation = ({route}) => {
    const navigation = useNavigation()

    let data = route?.params?.data
  console.log("Check ",data);
    const [coords, setCoords] = useState({
      latitude: 31.4580019,
      longitude: 74.26721,
      });
    
  useEffect(() => {
    if (data.latitude && data.longitude) {
      setCoords({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      });
      mapRef.animateToRegion({
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0421,
      });
      
    }
  }, [data.latitude, data.longitude]); 
    
      return (
        <View style={styles.container}>
            <TouchableOpacity style={{ flex: 0.1, justifyContent: 'center', paddingHorizontal: wp(4), }}
                onPress={() => [
                  navigation.goBack()
                ]}>
                <Image source={icons.backArrow} style={{ width: wp(5), height: wp(5), resizeMode: 'contain' }} />
              </TouchableOpacity>
            <MapView
              style={styles.map}
              mapType={'standard'}
              ref={(ref) => (mapRef = ref)}
            region={{
                latitude: coords?.latitude,
                longitude: coords?.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={{
                  latitude: coords?.latitude,
                  longitude: coords?.longitude,
                }}>
                
              </Marker>
            </MapView>
        
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      map: {
        flex: 1,
      },
      loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    
export default ViewBoatLocation