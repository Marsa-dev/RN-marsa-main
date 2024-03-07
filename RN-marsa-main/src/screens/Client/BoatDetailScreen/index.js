import { View, Text, Image, Alert, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from './style'
import { useIsFocused, useNavigation } from '@react-navigation/native';
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
import Config from '../../../../utils/config';
import { getListData, toggleFavourite } from '../../../api/Httpservice';
import { BOOKING_FORM, LOGIN_SCREEN } from '../../../constants/Navigators';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../redux/action/Action';
import { showSuccess } from '../../../../utils/FlashMessage';
import CustomLoader from '../../../component/CustomLoader';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
const BoatDetailScreen = ({route}) => {
  const data = route?.params?.data
  const navigation = useNavigation();
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const isFocus= useIsFocused()
  const [search, setSearch] = useState('')
  const [vendor, setVendor] = useState('')
  const [loading, setLoading] = useState(true)
  const user = useSelector(state=> state.data.user)
  const label =t('description')
  const favourite = user?.wishlist?.find((wish)=> wish === data?._id)
  useEffect(()=>{
    if(isFocus){
      getVendor()
    }
  },[isFocus])
  const getVendor = async ()=>{
    // console.log('first', data?.vendorId)
    const res= await getListData(`boat/owner/${data?.vendorId}`)
      // console.log('vendor', res)
      if(res?.success){
        setLoading(false)
        setVendor(res?.data)
      }
      else{
        setLoading(false)
      }
  }
  const showLoginAlert = () => {
    Alert.alert(
      t('loginAlert'),
      t('loginMessage'),
      [
        {
          text: t('cancel'),
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('login'),
          onPress: () => navigation.navigate(LOGIN_SCREEN),
        },
      ],
      { cancelable: false }
    );
  }
  const handleFavPress = async ()=>{
    if(user){
      setLoading(true)
  
      const newData = {
        id: data?._id
      }
      const res = await toggleFavourite(newData, `user/wishList`)
      if(res?.success){
        setLoading(false)
        dispatch(getUser(res?.data))
        showSuccess(res?.message)
      }
      else{
        setLoading(false)
        console.log('Error', res?.message)
      }
    }
    else
    {
      showLoginAlert()
    }
  }
  const bookingPress = ()=> {
    if (user){
      navigation.navigate(BOOKING_FORM, {
        data: data
      })
    }
    else
    {
      showLoginAlert()
    }
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.swiperContainer}>
          <Swiper 
            activeDotColor={colors.primaryColor}
            dotColor={colors.white}
          >
            {data?.images?.map((item, index) => {
              return (
                <FastImage
                  source={{
                    uri: `${Config.BASE_URL}${item}`,
                    priority: FastImage.priority.normal,
                  }}
                  key={index}
                  resizeMode={FastImage.resizeMode.stretch}
                  style={{
                    flex: 1,
                  }}>
                  <TouchableOpacity style={styles.sliderHeartButton} onPress={handleFavPress}>
                    {
                      favourite ?
                        <Image
                          source={icons.redHeart}
                          style={styles.sliderHeartImage}
                        />
                        :
                        <Image
                          source={icons.heart}
                          style={styles.sliderHeartImage}
                        />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sliderBackButton} onPress={() => navigation.goBack()}>
                    <Image
                      source={icons.backArrow}
                      style={styles.sliderHeartImage}
                      tintColor={colors.secondryColor}
                    />
                  </TouchableOpacity>
                </FastImage>
              );
            })}
          </Swiper>
        </View>
        <View style={{paddingHorizontal:wp(4), paddingTop:wp(2)}}>
          <Text style={styles.title}>{data?.craftName}</Text>
          <Text style={styles.detail}>{`${data?.loa} ${t('feet')}/${data?.guestCapicty} ${t('guest')}`}</Text>
          <Text style={styles.price}>{`${data?.rentPerHour} ${t('sar')} ${t('perhour')}`}</Text>
          <Text style={styles.label}>{label}:</Text>
          <Text style={styles.description}>{data?.description}</Text>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentCardNormalText}>{t('startingFrom')}</Text>
            <Text style={styles.paymentCardBigText}>{data?.rentPerHour * data?.minHour} {t('sar')}</Text>
            <View style={{flexDirection:'row', width:wp(50) , justifyContent:'space-between'}}>
              <Text style={styles.paymentCardNormalText}>{t('hourly')}</Text>
              <Text style={styles.paymentCardNormalText}>{data?.maxHour} {t('hrsMax')}</Text>
            </View>
            <Divider marginBottom={wp(1.1)}/>
            <View style={{ flexDirection: 'row', width: wp(50), justifyContent: 'space-between' }}>
              <Text style={styles.paymentCardNormalText}>{data?.rentPerHour} {t('sar')} /{t('hr')}</Text>
              <Text style={styles.paymentCardNormalText}>{data?.minHour} {t('hrMint')}</Text>
            </View>
          </View>
          {
            vendor &&
            <>
              <Text style={styles.label}>{t('owner')}:</Text>
              <View style={styles.container}>
                <View style={styles.leftContainer}>
                  {
                    vendor?.profilePic ?
                      (
                        <FastImage
                          source={{
                            uri: `${Config.BASE_URL}${vendor?.profilePic}`,
                            priority: FastImage.priority.normal,
                          }}
                          style={styles.image}
                        />
                      ) : (
                        <Image
                          source={icons.profileImage}
                          style={styles.icon}
                        />
                      )
                  }
                  <View style={styles.textView}>
                    <Text style={styles.heading}>{vendor?.fullName}</Text>
                    <Text style={styles.subHeading}>{vendor?.bookingCount} {t('totalBookings')}</Text>
                  </View>
                  {/* <Text>Hello</Text> */}
                </View>
                <View style={styles.rightContainer}>
                </View>
              </View>
            </>
          }
            <Button 
              label={t('bookNow')}
              marginTop={wp(12)}
              onPress={bookingPress}
            />
          </View>
      </ScrollView>
      <CustomLoader isVisible={loading} />
    </View>
  )
}

export default BoatDetailScreen