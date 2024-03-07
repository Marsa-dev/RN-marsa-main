import { View, Text, Image, Alert, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from './style'
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import icons from '../../../assets/icons/icons';
import Button from '../../../component/Button';
import Header from '../../../component/Header';
import Config from '../../../../utils/config';
import colors from '../../../assets/colors/colors';
import { VIEW_BOAT_LOCATION } from '../../../constants/Navigators';
import { useTranslation } from 'react-i18next';
const BookingDetailScreen = ({route}) => {
  console.log(route.params.data);
  const {data , duration} = route?.params
  const navigation = useNavigation();
  const {t} = useTranslation()
  return (
    <View style={styles.container}>
      <Header 
        title={t('bookkingDetails')}
        leftIcon={icons.backArrow}
        leftIconPress={()=> navigation.goBack()}
      />
      <View style={styles.innerContainer}>
        <View style={styles.swiperContainer}>
          <View style={styles.con1}>
            <Image source={{uri: Config.BASE_URL + data?.boatId?.images[0]}} resizeMode='cover' style={styles.image} />
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
              <Text numberOfLines={1} style={styles.normal}>{t('guestNo')}: {data?.guestNo}</Text>
              <Text numberOfLines={1} style={styles.normal}>{t('duration')}: {duration}</Text>
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
        {
          data?.activites?.length > 1 ?
          <>
            <Text style={[styles.normal, {fontWeight:'500',marginVertical:wp(2.5)}]}>{t('activities')}</Text>
            {
                data?.activites?.map((item,index)=> {
                  return(
                    <View style={styles.locationIcon} key={index.toString()}>
                      <Image
                        source={icons.checkBox}
                        style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain', marginRight: wp(3) }}
                      />
                      <Text numberOfLines={1} style={styles.location}>{item?.activityName}</Text>
                    </View>
                  )
                })
            }
          </>
          :
          null
        }
        <View style={{flexDirection:'row', justifyContent:'space-between', marginVertical:wp(3.5)}}>
          <Text style={styles.price}>{t('payment')}</Text>
          <Text style={styles.price}>{data?.totalAmount} {t('sar')}</Text>
        </View>
          {
          data?.status === 'pending' ? 
              <Button 
                label={t('requestPending')}  
                width={'90%'}
                disabled
              />
            :
            data?.status === 'accepted'
            ?
              <Button
                label={t('accepted')}
                width={'90%'}
                backgroundColor={colors.green}
                disabled
            />
            :
              data?.status === 'completed'
            ?
              <Button
                label={t('completed')}
                width={'90%'}
                disabled
            />
            :
                data?.status === 'rejected'
            ?
              <Button
                label={t('rejected')}
                width={'90%'}
                backgroundColor={colors.red}
                disabled
            />
            :
              <Button
                label={t('paid')}
                width={'90%'}
                disabled
            />
            
          }
          {
            data?.status === 'accepted'?
            <TouchableOpacity onPress={()=> {navigation.navigate(VIEW_BOAT_LOCATION, {data: data})}}>
              <Text style={styles.linkText}>{t('viewBoatLocation')}</Text>                      
            </TouchableOpacity>
            :
            null
          }
      </View>
    </View>
  )
}

export default BookingDetailScreen