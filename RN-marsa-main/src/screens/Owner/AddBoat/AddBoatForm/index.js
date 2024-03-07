import { View, Text, ScrollView, Alert, PermissionsAndroid, Platform, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Header from '../../../../component/Header'
import icons from '../../../../assets/icons/icons'
import { useNavigation } from '@react-navigation/native'
import styles from './style'
import TextHeader from '../../../../component/TextHeader'
import HorizontalLine from '../../../../component/HorizontalLine'
import DropDownPicker from 'react-native-dropdown-picker';
import colors from '../../../../assets/colors/colors'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Input from '../../../../component/Input'
import fontsSize from '../../../../assets/fontsSize/fontsSizes'
import Button from '../../../../component/Button'
import { BOAT_TYPE } from '../../../../constants/Navigators'
import { min } from 'moment'
import { showDanger } from '../../../../../utils/FlashMessage'

const AddBoatForm = () => {
  const navigation = useNavigation()
  const [imageData, setImageData] = useState([])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        {label: 'Boat', value: 'Boat'},
        {label: 'Jet-ski', value: 'Jet-ski'},
        {label: 'Yacht', value: 'Yacht'},
    ]);

    const [craftName, setCraftName] = useState('')
    const [gustCapacity, setGustCapacity] = useState('1')
    const [rent, setRent] = useState("")
    const [discription, setDiscription] = useState('')
    const [maxHourError, setMaxHourError] = useState(null);


    const [hours, setHours] = useState([
      { label: '1 hour', value: '1' },
      { label: '2 hours', value: '2' },
      { label: '3 hours', value: '3' },
      { label: '4 hours', value: '4' },
      { label: '5 hours', value: '5' },
      { label: '6 hours', value: '6' },
      { label: '7 hours', value: '7' },
      { label: '8 hours', value: '8' },
      { label: '9 hours', value: '9' },
      { label: '10 hours', value: '10' },
      { label: '11 hours', value: '11' },
      { label: '12 hours', value: '12' },
      // Add more options as needed
    ]);
    const [minHour, setMinHour] = useState(null);
    const [maxHour, setMaxHour] = useState(null);

    const [openMinHour, setOpenMinHour] = useState(false); // Add this state
    const [openMaxHour, setOpenMaxHour] = useState(false); // Add this state
  
  const handleMaxHourChange = (item) => {
    // const selectedMaxHour = parseInt(item.value, 10);
    const selectedMaxHour = item();
    if ((!minHour) || selectedMaxHour < minHour) {
      setMaxHourError(true);
      showDanger("Maximum hours must be greater than minimum hour")
      setMaxHour(null);
    } else {
      setMaxHourError(null); // Clear the error message if validation passes
      setMaxHour(selectedMaxHour);
    }
  };
  const handleMinHourChange = (minHour) => {
    // Update the "From" value
    setMinHour(minHour);

    // Automatically set "To" to zero when "From" is changed
    setMaxHour(null);
  };


    const showAlert = () => {
      Alert.alert(
        'Take a new photo or select one from your gallery.',
        '',
        [
          {
            text: 'Gallery',
            onPress: chooseFile,
          },
          {
            text: 'Camera',
            onPress: captureImage,
          },
          // {
          //   text: 'Cancel',
          //   onPress: () => console.log('Canceled'),
          //   style: 'cancel',
          // },
        ],
        { cancelable: false }
      );
    }
  
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera permission',
            },
          );
          // If CAMERA Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else return true;
    };
  
    const requestExternalWritePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'External Storage Write Permission',
              message: 'App needs write permission',
            },
          );
          // If WRITE_EXTERNAL_STORAGE Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          Alert.alert('Write permission err', err);
        }
        return false;
      } else return true;
    };
  
    const chooseFile = () => {
      let options = {
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
        selectionLimit:3
      };
      launchImageLibrary(options, response => {
        const res= response;
        // console.log("Response ====> ",response)
        if (response.didCancel) {
          Alert.alert('userCancelledCameraPicker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          Alert.alert('cameraNotAvailable');
          return;
        } else if (response.errorCode == 'permission') {
          Alert.alert('permissionNotSatisfied');
          return;
        } else if (response.errorCode == 'others') {
          Alert.alert(response.errorMessage);
          return;
        }
        // console.log('base64 -> ', response.assets[0].base64);
        console.log('uri -> ', response.assets);
        // setImageData(response.assets)
        checkArray(response.assets)

        
      });
    };
    const captureImage = async () => {
      let options = {
        maxWidth: 300,
        maxHeight: 550,
        quality: 1,
      };
      let isCameraPermitted = await requestCameraPermission();
      let isStoragePermitted = await requestExternalWritePermission();
      console.log(isCameraPermitted , isStoragePermitted);
      if (isCameraPermitted) {
        launchCamera(options, response => {
          console.log('Response = ', response);
          if (response.didCancel) {
            Alert.alert('userCancelledCameraPicker');
            return;
          } else if (response.errorCode == 'camera_unavailable') {
            Alert.alert('cameraNotAvailable');
            return;
          } else if (response.errorCode == 'permission') {
            Alert.alert('permissionNotSatisfied');
            return;
          } else if (response.errorCode == 'others') {
            Alert.alert('cameraIssue');
            return;
          }
          console.log('uri -> ', response.assets);
          // setImageData(response.assets)
          checkArray(response.assets)
          
        });
      }
      
    };
  const checkArray = value => {
    for (let i = 0; i < value.length; i++) {
      setImageData(prev => {
        return [...prev, value[i]];
      });
    }
  };
  const handleRemove = (index) => {
    const updatedImageData = [...imageData];
    updatedImageData.splice(index, 1);
    setImageData(updatedImageData);
  };
  const handleContinue = () => {
    if(
      !craftName ||
      !gustCapacity ||
      !rent ||
      !minHour  ||
      !maxHour  ||
      !value  ||
      imageData.length < 1 
    ){
      showDanger("All fields are mandatory")
    }
    else
    {
      navigation.navigate(BOAT_TYPE, {
        data: {
          craftName: craftName,
          gustCapacity: gustCapacity,
          rent: rent,
          discription: discription,
          minHour: minHour,
          maxHour: maxHour,
          craftType: value,
          craftImages: imageData
        }
      })
    }
  }
    return (
    <View style={styles.container}>
        <Header
            leftIcon={icons.backArrow}
            leftIconPress={() => {navigation.goBack()}}
            title={"Boat Resume"}
            rightText={"1/4"}
        />
        <HorizontalLine
          label={"1"}
          leftCircleColor={"#FFFFFF"}
          leftLineColor={"#FFFFFF"}
        />
        <TextHeader title={"Add Boat Image & More Information"} />


        <ScrollView 
        style={styles.innerContainer} 
        scrollEnabled={(openMinHour || openMaxHour) ? false : true }
        nestedScrollEnabled ={true}
        >
        <Text style={styles.mainLabel}>Watercraft types</Text>
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            zIndex={100}
            setValue={setValue}
            setItems={setItems}
            placeholder={'Watercraft types'}
            placeholderStyle={{color:colors.placeholder}}
            style={{ borderColor: colors.primaryColor, borderRadius: wp(1.1),}}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownContainerStyle={{
              position: 'relative',
              top: 0
            }}
        />
        <Input
          marginTop={hp(1)}
          label={"Craft name"}
          placeHolder={"Craft name"}
          value={craftName}
          onChangeText={(text) => {setCraftName(text)}}
        />

        <Input
          marginTop={hp(1)}
          label={"Gust Capacity"}
          placeHolder={"Gust capacity"}
          value={gustCapacity}
          onChangeText={(text) => {setGustCapacity(text)}}
        />
        <Input
          marginTop={hp(1)}
          label={"Rent per hour"}
          placeHolder={"Rent per hour"}
          value={rent}
          onChangeText={(text) => {setRent(text)}}
        />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', zIndex: 1000 }}>
        <View>
            <Text style={styles.mainLabel}>Min hours</Text>
            <DropDownPicker
              open={openMinHour}
              value={minHour}
              items={hours}
              setOpen={setOpenMinHour}
              setValue={handleMinHourChange}
              setItems={setHours}
              placeholder={'Min Hour'}
              placeholderStyle={{color:colors.placeholder}}
              style={{ borderColor: colors.primaryColor, borderRadius: wp(1.1), width:wp(45)}}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}

              dropDownContainerStyle={{
                position: 'relative',
                top: 0
              }}
           />
          </View>

          <View>
            <Text style={styles.mainLabel}>Max hours</Text>
              <DropDownPicker
                open={openMaxHour}
                value={maxHour}
                items={hours}
                setOpen={setOpenMaxHour}
                setValue={handleMaxHourChange}
                setItems={setHours}
                placeholder={'Max Hour'}
                placeholderStyle={{ color: colors.placeholder }}
                style={[
                  {
                    borderColor: colors.primaryColor,
                    borderRadius: wp(1.1),
                    width: wp(45),
                  },
                  maxHourError ? { borderColor: 'red' } : null,
                ]}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}

                dropDownContainerStyle={{
                  position: 'relative',
                  top: 0
                }}
              />
          </View>
        </View>

        <Input
          label={"Add description"}
          placeHolder={"Add description"}
          marginTop={hp(1)}
          value={discription}
          multiLine
          onChangeText={(text) => {setDiscription(text)}}
        />

        <Text style={styles.mainLabel}>Add boat images</Text>

        <TouchableOpacity 
          onPress={() => {showAlert()}}
          style={styles.addImageView}>
          <Image source={icons.plusIcon}style={{width:wp(6), height:wp(6)}} />
          <Text style={styles.addImageText}>Add Image</Text>
          <Text style={styles.addImageBottomText}>(png.jpg.pdf)</Text>
        </TouchableOpacity>
        {
          imageData?.length > 0 && (
            <View style={styles.imagesContainer}>
            {
              imageData?.map((item,index)=>{
                return(
                  <View style={styles.listImages} key={index.toString()}>
                    <Image 
                      source={{uri: item?.uri}}
                      style={styles.listImage}
                    />
                    <TouchableOpacity onPress={()=>handleRemove(index)} style={styles.crossContainer}>
                      <Image 
                        source={icons.cross}
                        style={styles.crossIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )
            })}
            </View>
            )
        }
        <Button
          label={"Continue"}
          marginTop={hp(2)}
          onPress={handleContinue}
        />

        </ScrollView>
    </View>
  )
}

export default AddBoatForm