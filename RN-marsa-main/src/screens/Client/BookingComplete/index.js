import { View, Text, Image, Alert, StyleSheet, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from './style'
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import images from '../../../assets/images/images';

import DashboardHeader from '../../../component/DashboardHeader';
import colors from '../../../assets/colors/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import icons from '../../../assets/icons/icons';
import Divider from '../../../component/Divider';
import Button from '../../../component/Button';
import Header from '../../../component/Header';
import fontsSize from '../../../assets/fontsSize/fontsSizes';
import fonts from '../../../assets/fonts/fonts';
import { HOME } from '../../../constants/Navigators';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Config from '../../../../utils/config';
const BookingComplete = ({route}) => {
  const data = route?.params?.data
  const navigation = useNavigation();
  const [image, setImage] = useState(Config.BASE_URL+data?.boatId?.images[0])
  const {t} = useTranslation()
  location='Bayada'

  useEffect(()=>{
    console.log(Config.BASE_URL+data?.boatId?.images[0]);
    console.log('first', JSON.stringify(data.boatId.images[0]))

  },[])
  return (
    <View style={styles.container}>
      <Header 
        title={t('bookingCompleted')}
        // leftIcon={icons.backArrow}
        // leftIconPress={()=> navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <Text style={{
          color:colors.primaryColor,
          fontSize:fontsSize.px_18,
          fontFamily:fonts.semiBold,
          alignSelf:'center',
          textAlign:'center',
          width:wp(60),
          marginBottom:hp(2)
        }}>{t('paidTrip')}</Text>
        <View style={styles.swiperContainer}>
          <View style={styles.con1}>
            {image &&
<Image surce={Config.BASE_URL+data?.boatId?.images[0]} resizeMode='cover' style={styles.image} />
            }
          </View>
          <View style={styles.con2}>
            <Text numberOfLines={1} style={styles.title}>{data?.boatId?.craftName}</Text>
            <View style={styles.locationIcon}>
              <Image
                source={icons.location}
                style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain',marginRight:wp(3) }}
              />
              <Text numberOfLines={1} style={styles.location}>{data?.destination?.title}</Text>
            </View>
              <Text numberOfLines={1} style={styles.normal}>{t('guestNo')} {data?.guestNo}</Text>
              <Text numberOfLines={1} style={styles.normal}>{t('duration')}: {data?.hours} {t('hours')}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:hp(1)}}>
          <View style={{flex:0.49}}>
            <Text style={styles.normal}>{t('from')}</Text>
            <View style={styles.timeCon}>
              <Text style={styles.time}>{moment(data?.bookingStartTime).format('HH:mm A')}</Text>
              <Image
                source={icons.clock}
                style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain', marginRight: wp(3) }}
              />
            </View>
          </View>
          <View style={{flex:0.49}}>
            <Text style={styles.normal}>{t('to')}</Text>
            <View style={styles.timeCon}>
              <Text style={styles.time}>{moment(data?.bookingEndTime).format('HH:mm A')}</Text>
              <Image
                source={icons.clock}
                style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain'}}
              />
            </View>
          </View>
        </View>
        <Text style={[styles.normal, {fontWeight:'500',marginVertical:wp(2.5)}]}>{t('activities')}</Text>
        {
          data?.activites?.length > 0 ?
           data?.activites.map((item, index)=>{
            return(
              <View key={index} style={styles.locationIcon}>
                <Image
                  source={icons.checkBox}
                  style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain', marginRight: wp(3) }}
                />
                <Text numberOfLines={1} style={styles.location}>{item?.activityName}</Text>
              </View>
  
            )
          })
          :
          <Text style={styles.normal}>{t('noActivities')}</Text>
        }
     
        <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:wp(3.5)}}>
          <Text style={styles.price}>{t('totalPayment')}</Text>
          <Text style={styles.price}>{data?.totalAmount} {t('sar')}</Text>
        </View>
      </View>
      <Button 
        label={t('done')}  
        onPress={() => {navigation.navigate(HOME)}}
      />
    </View>
  )
}

export default BookingComplete