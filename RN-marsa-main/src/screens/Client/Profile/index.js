import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import styles from './style'
import { useNavigation } from '@react-navigation/native';
import Header from '../../../component/Header';
import TextWithIcon from '../../../component/TextWithIcon';
import icons from '../../../assets/icons/icons';
import ProfileInfo from '../../../component/ProfileInfo';
import Button from '../../../component/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HOME, LOGIN_SCREEN, PROFILE_INFO_SCREEN, SPLASH_SCREEN, TERM_AND_PRIVACY_POLICY_SCREEN, WISHLIST } from '../../../constants/Navigators';
import { showDanger } from '../../../../utils/FlashMessage';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

import { useTranslation } from 'react-i18next';
import colors from '../../../assets/colors/colors';
import { getUser, setLanguage } from '../../../redux/action/Action';
import SplashScreen from '../../SplashScreen';
import { deleteAccount } from '../../../api/Httpservice';

const Profile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const lang = useSelector(state => state.data.language)
  const {t , i18n} = useTranslation()
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(lang);
  const [items, setItems] = useState([
    { label: 'English', value: 'en',  },
    { label: 'العربية', value: 'ar' },
  ]);
  const handleLangChange = async (itemValue) => {
    // setSelectedLanguage(itemValue)
    setValue(itemValue)
    console.log('itemValue', itemValue())
    i18n.changeLanguage(itemValue())
    await AsyncStorage.setItem('selectedLang', itemValue())
    dispatch(setLanguage(itemValue()))
  };
  const user = useSelector(state=> state.data.user)
  const role = useSelector(state=> state.data.role)
  const logOut = async () => {
    console.log('user', user)
    try {      
      await AsyncStorage.clear()
      dispatch(getUser(null))
      navigation.reset({
        index: 0, // Index of the screen to navigate to
        routes: [{ name: HOME }] // Name of the screen to navigate to
      });
    } catch (error) {
      showDanger("Error")
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
  const profilePress = () => {
    if (user) {
      navigation.navigate(PROFILE_INFO_SCREEN)
    }
    else {
      showLoginAlert()
    }
  };
  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccount'),
      t('deleteAccountAlert'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('ok'),
          onPress: () => {
            // Handle deletion logic here
            deleteUser()
          },
        },
      ],
      { cancelable: false }
    );
  }
  const deleteUser = async() => {
    const res = await deleteAccount('', 'user/disableAccount')
    if (res?.success === true) {
      await AsyncStorage.clear()
      dispatch(getUser(null))
      navigation.reset({
        index: 0, // Index of the screen to navigate to
        routes: [{ name: HOME }] // Name of the screen to navigate to
      });
    }
    else {
      showDanger(res?.message)
    }
  }
  return (
    <View style={styles.container}>
      <Header title={t('account')} />
      <View style={styles.profileInfo}>
        <ProfileInfo choosImage={true} name={ user? user?.fullName : ""} icon={user?.profilePic} />
      </View>

      <View style={styles.optionsView}>
      {
          role === "owner" &&
            <View style={styles.boxMainView}>
              <View style={styles.boxView}>
                <Text style={styles.textTitle}>{t('totalBookings')}</Text>
                <Text style={styles.textNum}>{user?.bookingCount}</Text>
              </View>
              <View style={styles.boxView}>
                <Text style={styles.textTitle}>{t('years')}</Text>
                <Text style={styles.textNum}>2.5</Text>
              </View>
            </View>

        }

        <TextWithIcon 
          title={t('profile')} 
          rightIcon={icons.forwardIcon} 
          onPress={profilePress}
        />
        {
          role != "owner" &&
            <TextWithIcon 
              title={t('wishlist')} 
              rightIcon={icons.forwardIcon} 
              onPress={() => { navigation.navigate(WISHLIST) }}
            />
        }
        <TextWithIcon 
          title={t('terms')} 
          rightIcon={icons.forwardIcon} 
          onPress={() =>{navigation.navigate(TERM_AND_PRIVACY_POLICY_SCREEN)}}
        />
        {
          user ? 
            <TextWithIcon
              title={t('deleteAccount')}
              rightIcon={icons.forwardIcon}
              onPress={handleDeleteAccount}
            />
            :
            null
        }
      <View style={{  height:hp(5),flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <Text style={styles.title}>{t('languages')}</Text>
        <View style={{ width: wp(30) , flex:0.4,alignItems:'flex-end'}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={handleLangChange}
            setItems={setItems}
            // textStyle={styles.label}
            style={{ borderColor: colors.primaryColor, color: colors.primaryColor, borderRadius: wp(1.1), }}
            listMode="SCROLLVIEW"
              containerStyle={{ width: wp(30) }}
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />
        </View>
      </View>
      </View>
        <View style={styles.buttonView}>
          <Button label={ user ? t('logout') : t('login')} onPress={() => {user ? logOut() : navigation.navigate(LOGIN_SCREEN) }} />
        </View>
    </View>
  )
}

export default Profile