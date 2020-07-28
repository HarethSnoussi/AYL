import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , Picker,Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator} from 'react-native';
import { Button ,ButtonGroup} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';
import * as offersActions from "../../../store/actions/offers";

import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";

 

const hoursTime = hours.map(hour=>hour.time);
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepThree = (props)=> {




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
                   

                   
                     </View>


            </View>

)


}

BookStepTwo.navigationOptions = ()=> {
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
//////////////////////////////////////////////////////////////////////////   
   bookingInfoContainer : {
       width : "100%",
       height : "75%",
       backgroundColor : "white",
       borderTopLeftRadius : 25,
       borderTopRightRadius : 25,
        position : "absolute",
        top : "25%",
        overflow : "hidden",
        
        justifyContent : "space-around"
   },
 //////////////////////////////////////////////////////////////////////////
 selectDate : {
    alignSelf : "center",
    width : "90%",
    height  :"20%",
    marginTop : "5%",
    justifyContent : "space-between",
 
 },
 datePicker : {
    width : "100%",
    backgroundColor :"#f0f0f0",
    height : "70%",
    borderRadius : screen.width *0.8 /2,
    alignItems : "center",
    justifyContent : "space-between",
    flexDirection : "row",
    paddingHorizontal : "5%",
    
 },
 selectSlot : {
    height : "50%",
    width : "90%",
    alignSelf : "center",
    overflow : "hidden",
    justifyContent : "space-between",

 
},
//////////////////////////////////////////////////////
centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
 
    });
  ///////////////////////////////////////////////////////////////////////////



export default BookStepThree;