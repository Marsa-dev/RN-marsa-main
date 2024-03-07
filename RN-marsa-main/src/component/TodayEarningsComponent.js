import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp,
widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LeftRightText from './LeftRightText'


const TodayEarningsComponent = ({
    tripFee,
    serviceFee,
    totalPrice
}) => {
  return (
    <View style={styles.container}>
      {/* <LeftRightText 
       
        leftText={"Trip Fares"} 
        rightText={tripFee} 
      />
      <LeftRightText 
        
        leftText={"Service Fee(-)"} 
        rightText={serviceFee} 
      /> */}
      <LeftRightText 
        leftText={"Total Earning"} 
        rightText={totalPrice} 
      />

    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        // height: hp(12),
        justifyContent:'space-between',
        alignSelf:'center',
        borderRadius:wp(1),
        borderWidth:2,
        marginBottom:hp(1),
        paddingVertical:hp(1),
        paddingHorizontal:wp(1)
    }
})

export default TodayEarningsComponent