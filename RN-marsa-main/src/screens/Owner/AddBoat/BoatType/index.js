import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../../component/Header'
import icons from '../../../../assets/icons/icons'
import { useNavigation } from '@react-navigation/native'
import styles from './style'
import TextHeader from '../../../../component/TextHeader'
import HorizontalLine from '../../../../component/HorizontalLine'
import Button from '../../../../component/Button'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import colors from '../../../../assets/colors/colors'
import Input from '../../../../component/Input'
import { BOAT_EXPERIENCE } from '../../../../constants/Navigators'
import { showDanger } from '../../../../../utils/FlashMessage'

const BoatType = ({route}) => {
  const data = route?.params?.data
  const navigation = useNavigation()
  const [powerBoatLoa, setPowerBoatLoa] = useState('')
  const [sailBoatLoa, setSailBoatLoa] = useState('')

  const [powerBoatOptions, setPowerBoatOptions] = useState([
    {
      id: 1,
      title: 'Outboard',
      selected:false
    },
    {
      id: 2,
      title: 'Inboard/Ourboard',
      selected:false
    },
    {
      id: 3,
      title: 'Inboard single propeller / screw',
      selected:false
    },
    {
      id: 4,
      title: 'Inboard two propeller / screw',
      selected:false
    },
    {
      id: 5,
      title: 'Inboard single propeller / screw with bow thrustor',
      selected:false
    },
    {
      id: 6,
      title: 'Inboard two propeller / screw with bow thrustor',
      selected:false
    },
    {
      id: 7,
      title: 'Sport fishing',
      selected:false
    },
    {
      id: 8,
      title: 'Sport fishing with outriggers',
      selected:false
    },
  ])

  const [sailBoatOptions, setSailBoatOptions] = useState([
    {
      id: 1,
      title: 'Racing',
      selected:false
    },
    {
      id: 2,
      title: 'Day sailing',
      selected:false
    },
    {
      id: 3,
      title: 'Cruising',
      selected:false
    },
    {
      id: 4,
      title: 'Passage making',
      selected:false
    },
    {
      id: 5,
      title: 'Delivery',
      selected:false
    }
  ])

  const [selectedButton, setSelectedButton] = useState(0)
  const [buttons, setButtons] = useState([
    {
      id: 0,
      title: "Power Boat"
    },
    {
      id: 1,
      title: "SailBoat"
    }
  ])

  const renderPowerBoatOptions = ({item, index}) => {
    return (
      <TouchableOpacity 
      onPress={() => {
        const updatedOptions = [...powerBoatOptions]; // Create a copy of the options array
        updatedOptions[index].selected = !updatedOptions[index].selected; // Toggle the selected property
        setPowerBoatOptions(updatedOptions); // Update the state
      }}
      style={{flexDirection:'row', paddingVertical:hp(1)}}
      >
        <Image source={item.selected ? icons.checkBox : icons.emptyCheckBox} style={{width:wp(4), height:wp(4)}} />
        <Text style={{color:colors.primaryColor, marginLeft:wp(2)}}>{item.title}</Text>
      </TouchableOpacity>
    )
  }
  
  const renderSailBoatOptions = ({item, index}) => {
    return (
      <TouchableOpacity 
      onPress={() => {
        const updatedOptions = [...sailBoatOptions]; // Create a copy of the options array
        updatedOptions[index].selected = !updatedOptions[index].selected; // Toggle the selected property
        setSailBoatOptions(updatedOptions); // Update the state
      }}
      style={{flexDirection:'row', paddingVertical:hp(1)}}
      >
        <Image source={item.selected ? icons.checkBox : icons.emptyCheckBox} style={{width:wp(4), height:wp(4)}} />
        <Text style={{color:colors.primaryColor, marginLeft:wp(2)}}>{item.title}</Text>
      </TouchableOpacity>
    )
  }
  const handleContinue = () => {
    const power = powerBoatOptions?.filter((item)=> item?.selected === true).map((item)=> item?.title)
    const sail = sailBoatOptions?.filter((item)=> item?.selected === true).map((item)=> item?.title)
    if(selectedButton === 0)
    {
      if(powerBoatLoa && power.length > 0){
        navigation.navigate(BOAT_EXPERIENCE,{
          data:data,
          boatType:{
            loa: powerBoatLoa,
            option: power,
            boatType:'power'
          }
        }) 
      }
      else{
        showDanger("All fields are mandatory")
      }
    }
    else
    {
      if (sailBoatLoa && sail.length > 0) {
        navigation.navigate(BOAT_EXPERIENCE,{
          data:data,
          boatType: {
            loa: sailBoatLoa,
            option: sail,
            boatType:'sail'
          }
        })
      }
      else{
        showDanger("All fields are mandatory")
      }
    }
  }
  return (
    <View style={styles.container}>
      <Header
        leftIcon={icons.backArrow}
        leftIconPress={() => { navigation.goBack() }}
        title={"Boat Resume"}
        rightText={"2/4"}
      />
      <HorizontalLine
        label={"2"}
      />
      <TextHeader title={"Boating Experience"} />

      <View style={{ width: wp(100), justifyContent: 'center' }}>
        <FlatList
          horizontal
          data={buttons}
          contentContainerStyle={{ justifyContent: 'space-between', width: wp(100), paddingHorizontal: wp(4) }}
          renderItem={(item, index) => {
            return (
              <Button
                width={wp(45)}
                borderRadius={wp(15)}
                label={item.item.title}
                borderWidth={2}
                borderColor={colors.primaryColor}
                textColor={selectedButton === item.item.id ? colors.white : colors.primaryColor}
                backgroundColor={selectedButton === item.item.id ? colors.primaryColor : colors.white}
                textSize={wp(4)}
                height={hp(5)}
                onPress={() => { setSelectedButton(item.item.id) }}
              />
            )
          }}
        />
      </View>

      <View style={{ marginTop: hp(2), }}>
        {selectedButton === 0 &&
          <View style={{paddingHorizontal:wp(4)}}>
            <Input
              label={"Power Boat LOA"}
              placeHolder={"56ft"}
              value={powerBoatLoa}
              onChangeText={(text) => { setPowerBoatLoa(text) }}
            />

            <Text style={{ color: colors.primaryColor, paddingVertical:hp(1) }}>Type of Power</Text>
            <FlatList
              data={powerBoatOptions}
              renderItem={renderPowerBoatOptions}
              keyExtractor={(item) => item.id}
            />
          </View>
        }

        {selectedButton === 1 &&
        <View style={{paddingHorizontal:wp(4)}}>
          <Input
            label={"Sailboat LOA"}
            placeHolder={"56ft"}
            value={sailBoatLoa}
            onChangeText={(text) => { setSailBoatLoa(text) }}
          />

            <Text style={{ color: colors.primaryColor, paddingVertical:hp(1) }}>Type of Sailing</Text>
            
            <FlatList
              data={sailBoatOptions}
              renderItem={renderSailBoatOptions}
              keyExtractor={(item) => item.id}
            />
        </View>
        }
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

export default BoatType