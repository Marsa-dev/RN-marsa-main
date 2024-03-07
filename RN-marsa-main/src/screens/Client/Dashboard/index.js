import { View, Text, Image, Alert, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import styles from './style'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper'
import DashboardHeader from '../../../component/DashboardHeader';
import SearchBar from '../../../component/SearchBar';
import colors from '../../../assets/colors/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import FloatButton from '../../../component/FloatButton';
import icons from '../../../assets/icons/icons';
import BoatCard from '../../../component/BoatCard';
import { BOAT_DETAIL_SCREEN, PROFILE_INFO_SCREEN, LOGIN_SCREEN } from '../../../constants/Navigators';
import { useSelector } from 'react-redux';
import Config from '../../../../utils/config';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
const Dashboard = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const {t} = useTranslation()
  const user = useSelector(state=> state.data.user)
  const lang = useSelector(state=> state.data.language)
  const [search, setSearch] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const slider = useSelector(state=>state.data.slider)
  const boats = useSelector(state=>state.data.boats)
  useEffect(()=>{
    if(isFocused){
      setSearch(null)
    }
  },[isFocused])
  const handleSearchQueryChange = (query) => {
    setSearch(query);
    filterData(query);
  };
  const filterData = (query) => {
    const filteredItems = boats?.filter((item) => {
      // Customize the conditions for filtering based on your requirements
      return item.craftName.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredData(filteredItems);
  };
  const boatsData = search ? filteredData : boats
  const showLoginAlert = ()=> {
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
  const profilePress= () => {
    if(user){
      navigation.navigate(PROFILE_INFO_SCREEN)
    }
    else
    {
      showLoginAlert()
    }
  };
  return (
    <View style={styles.container}>
      <DashboardHeader 
        title={`${t('hi')}  ${user ? user?.fullName : ''}`}
        subTitle = {t('headerText')}
        image={icons.profileImage}
        onPress={profilePress}
        // icon
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBar
          value={search}
          onChangeText={handleSearchQueryChange}
        />
        <View style={styles.swiperContainer}>
          <Swiper 
            // activeDotColor={colors.primaryColor}
            // dotColor={colors.white}
            showsPagination={false}
          >
            {slider?.map((item, index) => {
              return (
                <FastImage
                  source={{
                    uri: Config.BASE_URL + item?.images[0],
                    priority: FastImage.priority.normal,
                  }}
                  key={index}
                  style={{
                    flex: 1,
                  }}>
                  <Text
                    style={styles.sliderTitle}>
                    {item?.craftName}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={styles.sliderDescription}>
                    {`${item?.loa} ${t('feet')}/ ${item?.guestCapicty} ${t('guest')}`}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={styles.sliderDescription}>
                    {`${item?.rentPerHour} ${t('sar')}  ${t('perhour')}`}
                  </Text>

                  <FloatButton
                    text={t('bookNow')}
                    bottom={hp(2.1)}
                    left={wp(4)}
                    borderRadius={wp(2)}
                    buttonColor={colors.primaryColor}
                    onPress={() => navigation.navigate(BOAT_DETAIL_SCREEN, {
                      data: item
                    })
                    }
                  />
                  {
                    user?.wishlist?.find((wish) => wish === item?._id) ?
                      <View style={[styles.sliderHeartButton,(lang ==='ar') ? { bottom : hp(2.5)} : {top: wp(2.5)}]}>
                        <Image
                          source={icons.redHeart}
                          style={styles.sliderHeartImage}
                        />
                      </View>
                      :
                      <View style={[styles.sliderHeartButton,(lang ==='ar') ? { bottom : hp(2.5)} : {top: wp(2.5)}]}>
                        <Image
                          source={icons.heart}
                          style={styles.sliderHeartImage}
                        />
                      </View>
                  }
                </FastImage>
              );
            })}
          </Swiper>
        </View>
        <View style={styles.cardHeading}>
          <Text style={styles.headingTitle}>{t('popularBoats')}</Text>
          <TouchableOpacity>
            <Text style={styles.headingLink}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
          {
            boatsData?.map((item, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(BOAT_DETAIL_SCREEN, {
                  data: item
                })}
                key={index.toString()}
                style={styles.card}>
                <BoatCard 
                  image={item?.images[1]}
                  title={item?.craftName}
                  price={item?.rentPerHour + t('sar')}
                  vendor
                  iconPress={()=> Alert.alert('Favourite icon press')}
                  favourite={user?.wishlist?.find((wish)=> wish === item?._id)}
                />
              </TouchableOpacity>
            ))

          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Dashboard