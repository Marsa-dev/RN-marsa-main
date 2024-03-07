import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../../component/Header'
import icons from '../../../../assets/icons/icons'
import { useNavigation } from '@react-navigation/native'
import styles from './style'
import TextHeader from '../../../../component/TextHeader'
import HorizontalLine from '../../../../component/HorizontalLine'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import Input from '../../../../component/Input'
import Button from '../../../../component/Button'
import { SCAN_LICENSE } from '../../../../constants/Navigators'
import { showDanger } from '../../../../../utils/FlashMessage'


const BoatExperience = ({route}) => {
    const {data , boatType} = route?.params
    console.log('first', data)
  console.log('secondry', boatType)
  // console.log('secondry', option)
    const navigation = useNavigation()
    const [experience, setExperience] = useState('')
    const [resume, setResume] = useState('')
    const handleContinue = ()=>{
      if(experience && resume){
        navigation.navigate(SCAN_LICENSE,{
          data:data,
          boatType:boatType,
          boatresume:{
            exp:experience,
            resume:resume
          }
        })
      }
      else{
        showDanger("All fields are mandatory")
      }
    }

    return (
    <View style={styles.container}>
        <Header
            leftIcon={icons.backArrow}
            leftIconPress={() => {navigation.goBack()}}
            title={"Boat Resume"}
            rightText={"3/4"}
        />
        <HorizontalLine
          label={"3"}
        />
         <TextHeader title={"Boating Experience"} />

         <View style={styles.bottomContainer}>
            <Input
              label={"Experience(years)"}
              placeHolder={"Experience"}
              marginTop={hp(2)}
              value={experience}
              onChangeText={(text) => {setExperience(text)}}
            />

            <Input
              label={"Boating resume"}
              multiLine
              placeHolder={"Write your about your boating experience"}
              marginTop={hp(2)}
              value={resume}
              onChangeText={(text) => {setResume(text)}}
            />
         </View>

         <View style={styles.bottomButtonContainer}>
            <Button
              label={"Continue"}
              onPress={handleContinue}
            />
          </View>

    </View>
  )
}

export default BoatExperience