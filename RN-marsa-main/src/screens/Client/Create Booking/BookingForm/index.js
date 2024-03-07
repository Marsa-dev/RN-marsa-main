import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker'
import moment, { min } from 'moment';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
//////////////////////////////////////////////
import styles from './style'
import Header from '../../../../component/Header'
import icons from '../../../../assets/icons/icons'
import Divider from '../../../../component/Divider';
import colors from '../../../../assets/colors/colors';
import Button from '../../../../component/Button';
import { bookingData, getListData } from '../../../../api/Httpservice';
import { CONTACT_DETAIL } from '../../../../constants/Navigators';
import { showDanger } from '../../../../../utils/FlashMessage';
import { useTranslation } from 'react-i18next';
import Input from '../../../../component/Input';

const BookingForm = ({route}) => {
    const data= route?.params?.data;
    const navigation =useNavigation()
    const {t} = useTranslation()
    const isFocused = useIsFocused()
    const [open, setOpen] = useState(false);
    const [openActivity, setOpenActivity] = useState(false);
    const [date, setDate] = useState(new Date())
    const [from, setFrom] = useState(() => {
        const now = new Date();
        now.setMinutes(0);
        now.setHours(now.getHours() + 1);
        return now;
    });
    const [to, setTo] = useState(new Date(from.getTime() + data?.minHour * 60 * 60 * 1000)); 
    const [openDate, setOpenDate] = useState(false)
    const [openFrom, setOpenFrom] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [value, setValue] = useState([]);
    const [value1, setValue1] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activitiesShow, setActivitiesShow] = useState([]);
    const [guests, setGuests] = useState(data?.guestCapicty);
    const [comments, setComments] = useState('');
    const [payment, setPayment] = useState(0);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [activitiesPayment, setActivitiesPayment] = useState(0);
    const maxGuest = data?.guestCapicty;
    const maxHour = data?.maxHour;
    const minTimeDifference = data?.minHour; // Minimum time difference in hours
    useEffect(()=>{
        if (isFocused) {
            getLocations()
            getActivities()
            calculatePayment();
        }
    },[isFocused])
    useEffect(() => {
        // Calculate payment whenever 'from' or 'to' changes
        calculatePayment();
    }, [from, to, payment]);
    useEffect(() => {
        calculateActivitiesPayment(selectedItems);
    }, [selectedItems]);
   

    // Handle the initial rounding of the "from" time
    const calculateActivitiesPayment = (selectedItems) => {
        // Calculate the total payment for selected activities based on their prices
        const selectedActivities = activities.filter((activity) => selectedItems.includes(activity._id));
        const totalActivitiesPayment = selectedActivities.reduce((total, activity) => {
            return total + parseFloat(activity.price);
        }, 0);

        setActivitiesPayment(totalActivitiesPayment);
    };
    const getLocations = async()=>{
        const res = await getListData('destination')
        const transformedData = res?.data?.map((item) => ({
            label: item.title, // Set the label property based on your data structure
            value: item._id, // Set the value property based on your data structure
        }));
        setItems(transformedData)
        // console.log('first', res)
    }
    const getActivities = async()=>{
        const res = await getListData('activity')
        setActivities(res?.data)
        // console.log('second', res)
    }
    const calculateTimeDifference = () => {
        const diffMilliseconds = to.getTime() - from.getTime();
        const diffMinutes = Math.ceil(diffMilliseconds / (60 * 1000)); // Calculate difference in minutes
        const diffHours = Math.ceil(diffMinutes / 60); // Calculate difference in hours
        const remainingMinutes = diffMinutes % 60; // Calculate remaining minutes

        return diffHours + remainingMinutes / 60; // Return time difference in hours with minutes as a fraction
    };
    const calculatePayment = () => {
        var timeDifference = calculateTimeDifference();
        const paymentAmount = timeDifference * data?.rentPerHour;
        let intMethod = parseInt(paymentAmount)
        setPayment(intMethod);
    };
    // console.log('date', date)

    const handleFromTimeSelect = (selectedTime) => {
        const currentTime = new Date();
        // console.log('selectedTime from', selectedTime)
        if (selectedTime < currentTime) {
            Alert.alert(t('warning'), t('futureWarning'));
            setOpenFrom(false);
            return;
        }
        setOpenFrom(false)
        setFrom(selectedTime);

        // Calculate minimum and maximum allowed 'to' times based on 'from'
        const minToTime = new Date(selectedTime.getTime() + minTimeDifference * 60 * 60 * 1000);
        const maxToTime = new Date(selectedTime.getTime() + maxHour * 60 * 60 * 1000);

        // If the current 'to' time is outside the allowed range, reset it
        if (to < minToTime || to > maxToTime) {
            setOpenFrom(false);
            setTo(minToTime);
        }

        // Calculate payment after updating 'from' and 'to'
        calculatePayment();
    };

    const handleToTimeSelect = (selectedTime) => {
        const currentTime = new Date();
        // console.log('selectedTime to', selectedTime)
        if (selectedTime < currentTime) {
            Alert.alert(t('warning'), t('futureWarning'));
            setOpenTo(false);
            return;
        }

        // Check if the selected 'to' time is within the allowed range
        const minToTime = new Date(from.getTime() + minTimeDifference * 60 * 60 * 1000);
        const maxToTime = new Date(from.getTime() + maxHour * 60 * 60 * 1000);

        if (selectedTime < minToTime || selectedTime > maxToTime) {
            Alert.alert(t('warning'), t('timeWarning'));
            setOpenTo(false);
            return;
        }

        setTo(selectedTime);
        setOpenTo(false);

        // Calculate payment after updating 'from' and 'to'
        calculatePayment();
    };
    const handleDecrement=() =>{
        if(guests <= 1){
            Alert.alert(t('warning'), t('lessThanOne'))
            return
        }
        else{
            setGuests(guests - 1)
        }
    }
    const handleIncreament= () => {
        if (guests > maxGuest - 1) {
            Alert.alert(t('warning'), t('maxLimit'))
            return
        }
        else {
            setGuests(guests + 1)
        }
    }
    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);

        // Update the date part of the 'from' and 'to' times to match the selected date
        const newFrom = new Date(from);
        newFrom.setFullYear(selectedDate.getFullYear());
        newFrom.setMonth(selectedDate.getMonth());
        newFrom.setDate(selectedDate.getDate());

        const newTo = new Date(to);
        newTo.setFullYear(selectedDate.getFullYear());
        newTo.setMonth(selectedDate.getMonth());
        newTo.setDate(selectedDate.getDate());

        setFrom(newFrom);
        setTo(newTo);
    };
    const handleSubmit = async()=>{
        // console.log('value', timeDifference)
        // console.log('activities', selectedItems)
        // console.log('boat id', data?._id)
        // console.log('stime', from.toLocaleString())
        // console.log('etime', to.toLocaleString())
        // console.log('guest', guests)
        // console.log('comment', comments)
        // console.log('T amount', activitiesPayment+payment)
        const assets = {
            "destination": value,
            "activites": selectedItems,
            "boatId": data?._id,
            "bookingStartTime": from,
            "bookingEndTime": to,
            "guestNo": guests,
            "comment": comments,
            "totalAmount": activitiesPayment+payment,
        }
        const res=await bookingData(assets, 'booking')
        if(res?.success){
            navigation.navigate(CONTACT_DETAIL,{
                bookingId: res?.data?._id
            })
        }
        else{
            showDanger(res?.message)
        }
    }
    return (
    <View style={styles.container}>
        <Header 
            title={t('bookkingDetails')}
            leftIcon={icons.backArrow}
            leftIconPress={()=>navigation.goBack()}
            />
        <View style={styles.innerContainer}>
            <ScrollView showsVerticalScrollIndicator={false} >
            <Text style={styles.mainLabel}>{t('addLocation')}</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={t('addLocation')}
                textStyle={styles.label}
                style={{ borderColor: colors.primaryColor, color:colors.primaryColor, borderRadius: wp(1.1),}}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                dropDownContainerStyle={{
                    position: 'relative',
                    top: 0
                }}
            />
            <Text style={[styles.mainLabel,{fontWeight:'500'}]}>{t('tripDate')}</Text>
            <Text style={styles.mainLabel}>{t('date')}</Text>
            
            <View style={styles.input}>
                <Text onPress={()=> setOpenDate(true)} style={styles.label}>
                    {moment(date).format('MM/DD/YYYY')}
                </Text>
            </View>
            <DatePicker
                modal
                mode='date'
                open={openDate}
                date={date}
                onConfirm={(date) => {
                    setOpenDate(false)
                    handleDateSelect(date)
                }}
                minimumDate={new Date()}
                onCancel={() => {
                    setOpenDate(false)
                }}
                // textColor={colors.primaryColor}
            />
            <Text style={[styles.mainLabel, { fontWeight: '500' }]}>Trip Time</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: hp(1) }}>
                <View style={{ flex: 0.49 }}>
                    <DatePicker
                        modal
                        mode='time'
                        open={openFrom}
                        date={from}
                        onConfirm={handleFromTimeSelect}
                        format="HH:mm"
                        minimumDate={new Date()}
                        onCancel={() => {
                            setOpenFrom(false);
                        }}
                        minuteInterval={30}
                    />
                    <Text style={styles.label}>{t('from')}</Text>
                    <TouchableOpacity style={styles.timeCon} onPress={() => setOpenFrom(true)}>
                        <Text style={styles.time}>{moment(from).format('HH:mm')}</Text>
                        <Image
                            source={icons.clock}
                            style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain', marginRight: wp(3) }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.49 }}>
                    <Text style={styles.label}>{t('to')}</Text>
                    <DatePicker
                        modal
                        mode='time'
                        open={openTo}
                        date={to}
                        onConfirm={handleToTimeSelect}
                        format="HH:mm"
                        minimumDate={new Date()}
                        onCancel={() => {
                            setOpenTo(false);
                        }}
                        minuteInterval={30}
                    />
                    <TouchableOpacity style={styles.timeCon} onPress={() => setOpenTo(true) }>
                        <Text style={styles.time}>{moment(to).format('HH:mm')}</Text>
                        <Image
                            source={icons.clock}
                            style={{ height: wp(3), width: wp(3.2), resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.timeDetailContainer}>
                <View style={styles.timeDetailField}>
                    <Text style={styles.label}>Hourly</Text>
                    <Text style={[styles.label,{color:colors.placeholder}]}>{maxHour} {t('hrsMax')}</Text>
                </View>
                <Divider/>
                <View style={styles.timeDetailField}>
                    <Text style={styles.label}>{data?.rentPerHour} {t('sar')} /{t('hr')}</Text>
                    <Text style={[styles.label, {color:colors.secondryColor}]}>{data?.minHour} {t('hrsMin')}</Text>
                </View>
            </View>
            <View style={styles.guests}>
                <Text style={styles.label}>{t('guestNo')}</Text>
                <View style={styles.guestOperator}>
                    <TouchableOpacity style={styles.operator} onPress={handleDecrement}>
                        <Text style={styles.label}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>{guests}</Text>
                    <TouchableOpacity style={styles.operator} onPress={handleIncreament}>
                        <Text style={styles.label}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={[styles.mainLabel, { fontWeight: '500' }]}>{t('activities')}</Text>
            <DropDownPicker
                open={openActivity}
                value={value1}
                items={activities?.map((item) => ({
                    label:  item?.price + t('sar') + ' ' + item?.activityName ,
                    value: item?._id,
                }))}
                setOpen={setOpenActivity}
                setValue={setValue1}
                setItems={setActivitiesShow}
                placeholder={t('selectActivities')}
                onChangeValue={(value) => setSelectedItems(value)}
                textStyle={styles.label}
                style={{borderColor:colors.primaryColor, borderRadius:wp(1.1), marginVertical:wp(1.5)}}
                multiple={true}
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                extendableBadgeContainer
                listMode="SCROLLVIEW"
                scrollViewProps={{
                    nestedScrollEnabled: true,
                }}
                dropDownContainerStyle={{
                    position: 'relative',
                    top: 0
                }}
            />
                    {/* <View>
                        <Text>Selected Items:</Text>
                        {selectedItems?.map((itemId) => {
                            const selectedActivity = activities.find((item) => item._id === itemId);
                            return (
                                <Text key={itemId}>
                                    {`$${selectedActivity.price} ${selectedActivity.activityName}`}
                                </Text>
                            );
                        })}
                    </View> */}
            <View>
                <Text style={styles.mainLabel}>{t('anythingElse')}</Text>
                {/* <Text style={[styles.label,{color:colors.secondryColor}]}>{t('exampleText')}</Text> */}
                <Input
                    placeHolder={t('comments')}
                    value={comments}
                    onChangeText={setComments}    
                    multiLine
                    // textAlignVertical='top'
                    // style={[styles.multilineInput, styles.label]}
                />
            </View> 
            <View style={styles.footer}>
                <View style={styles.footerItem}>
                    <Text style={[styles.label, styles.footerSubText]}>{t('subTotal')}</Text>
                    <Text style={[styles.label, styles.footerSubText]}>{payment}</Text>
                </View>
                <View style={styles.footerItem}>
                    <Text style={[styles.label,styles.footerActivityText]}>{t('activitiesFee')}</Text>
                    <Text style={[styles.label,styles.footerActivityText]}>{activitiesPayment}</Text>
                </View>
                <View style={styles.footerItem}>
                    <Text style={styles.mainLabel}>{t('totalPayment')}</Text>
                    <Text style={styles.mainLabel}>{activitiesPayment+payment}</Text>
                </View>
            </View>
            <Button
                label={t('next')}
                width={'100%'}
                borderRadius={wp(1.1)}
                marginBottom={hp(2)}
                onPress={handleSubmit}
            />  
        </ScrollView>       
        </View>
    </View>
)
}

export default BookingForm