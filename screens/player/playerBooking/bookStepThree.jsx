import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , Picker,Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator} from 'react-native';
import { Button ,ButtonGroup} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";

 
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepThree = (props)=> {

const [pickedWilaya , setPickedWilaya] = useState();

const pickedWilayaHandler =  (itemValue)=>{

setPickedWilaya(itemValue);

   
    };



return (
            <View style= {styles.container}>

{/* { overlayState && <ConfirmBookingOverlay
        isVisible = {overlayState}
        overlayHandler = {overlayHandler}
        bookingDate = {pickedDate}
        start = {pickedSlot}
        barberId = {props.navigation.getParam("barber")}
        clientId = "+213553633809"
        amount = {props.navigation.getParam("amount")}
        duration = {totalTime}
        services = {services}
        navigate = {()=>props.navigation.navigate("Client")}
       />   
    } */}
                <View style = {styles.firstImage}>

                <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   />

                </View>

                <View style = {styles.bookingInfoContainer}>
                    <View style = {styles.title}>
                        <Text>Adresse de la réservation</Text>

                    </View>

                <View style = {{height : "70%",backgroundColor : "blue",width : "95%" ,alignSelf : 'center'}}>
                    <View style = {styles.wilaya}>
                
    
        
        <RNPickerSelect
            onValueChange={(itemValue) => pickedValueHandler(itemValue)}
            items={[
                { label: 'Alger', value: 'alger' },
                { label: 'Blida', value: 'blida' },
                { label: 'Oran', value: 'oran' },
            ]}
            value = {pickedWilaya}
            placeholder={{
                    label: 'Wilaya ',
                    color : "#7f7d7c",
                    value : null
                }}
          
        />

            </View>

                    </View>
                    <View style = {styles.region}>


                    </View>
                    <View style = {styles.address}>


                    </View>
                    </View>


                     </View>

)

}

BookStepThree.navigationOptions = ()=> {
    return {
      headerTransparent : true,
      title : "Réserver Un Service" ,
      headerBackTitle : " ",
      headerTintColor: "#fff" 
    }

}


const styles= StyleSheet.create({
   
   container : {
            flex : 1 ,
   },
   firstImage : {
        height :"30%"
   },
  /********************************************************************** */ 
 
   bookingInfoContainer : {
       width : "100%",
       height : "75%",
       backgroundColor : "red",
       borderTopLeftRadius : 25,
       borderTopRightRadius : 25,
        position : "absolute",
        top : "25%",
        overflow : "hidden",
   },
  /********************************************************************** */ 
   title : {
        alignSelf : "center"

   },
  /********************************************************************** */ 
 wilaya : {  width: "70%", 
 backgroundColor : "#f0f0f0", 
 borderRadius : 10
},


  /********************************************************************** */ 
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
 
    });
    /********************************************************************** */ 




export default BookStepThree;