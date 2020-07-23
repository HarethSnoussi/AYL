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

 
const hours = [
    {id : "1",time : "05:00"},
    {id : "2",time : "05:15"},
    {id : "3",time : "05:30"},
    {id : "4",time : "05:45"},
    {id : "5",time : "06:00"},
    {id : "6",time : "06:15"},
    {id : "7",time : "06:30"},
    {id : "8",time : "06:45"},
    {id : "9",time : "07:00"},
    {id : "10",time : "07:15"},
    {id : "11",time : "07:30"},
    {id : "12",time : "07:45"},
    {id : "13",time : "08:00"},
    {id : "14",time : "08:15"},
    {id : "15",time : "08:30"},
    {id : "16",time : "08:45"},
    {id : "17",time : "09:00"},
    {id : "18",time : "09:15"},
    {id : "19",time : "09:30"},
    {id : "20",time : "09:45"},
    {id : "21",time : "10:00"},
    {id : "22",time : "10:15"},
    {id : "23",time : "10:30"},
    {id : "24",time : "10:45"},
    {id : "25",time : "11:00"},
    {id : "26",time : "11:15"},
    {id : "27",time : "11:30"},
    {id : "28",time : "11:45"},
    {id : "29",time : "12:00"},
    {id : "30",time : "12:15"},
    {id : "31",time : "12:30"},
    {id : "32",time : "12:45"},
    {id : "33",time : "13:00"},
    {id : "34",time : "13:15"},
    {id : "35",time : "13:30"},
    {id : "36",time : "13:45"},
    {id : "37",time : "14:00"},
    {id : "38",time : "14:15"},
    {id : "39",time : "14:30"},
    {id : "40",time : "14:45"},
    {id : "41",time : "15:00"},
    {id : "42",time : "15:15"},
    {id : "43",time : "15:30"},
    {id : "44",time : "15:45"},
    {id : "45",time : "16:00"},
    {id : "46",time : "16:15"},
    {id : "47",time : "16:30"},
    {id : "48",time : "16:45"},
    {id : "49",time : "17:00"},

    ];

const hoursTime = hours.map(hour=>hour.time);
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepTwo = (props)=> {
const totalTime = props.navigation.getParam("duration");
let duration = Math.ceil(totalTime/15)  ; 
if(duration === 1 ) {
    duration = 0;
}

const allBookings = [
    // {id:1 ,date_booking : new Date(), start : "09:00",end : "10:00",duration : 60 , status : "confirmée", clientId : "+213557115451",barberId : "+213550461010"},

    // {id:2 , date_booking : new Date() , start : "11:00",end : "11:30",duration : 30 , status : "confirmée", clientId : "+213553633809",barberId : "+213550461010"}
];

//overlay State
const [overlayState , setOverlayState]=useState(false);

    //Overlay Handelr
    const overlayHandler = ()=>{
     
        setOverlayState((previous) => !previous);
  
      }
  

//Make the DatePcikerVisible
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//Picked DateText 
const [pickedDateText,setPickedDateText] = useState (moment().format('LL'));

//Picked DateText 
const [pickedDate,setPickedDate] = useState (new Date());

//Set Button Color to Selected Button
const [selectedButtonIndex , setButtonIndex] = useState(0);

//Available slots State
const [availableSlots , setAvailableSlots] = useState(hours);

//picked Hour
const [pickedSlot,setPickedSlot] = useState(hours[0].time);

//Selected date
const pickedDateHandler = (date) => {
   setDatePickerVisibility(false);
    setPickedDateText(moment(date).format('LL'));
    setPickedDate(date);
   
  };

  //Color Changing Button
 const buttonColorHandler = (a)=>{
    
    setButtonIndex (a);
    setPickedSlot(hours[a].time);
 }
 //Managing the Bookings (Removing the exsiting Bookings)
 useEffect(()=>{
//Filter the selected Date Bookings

const filteredBookings = allBookings.filter(booking=>booking.date_booking.toDateString() === pickedDate.toDateString());


let bookingHours = [];
let slots = hours ;
//Map throught all the existing Bookings and remove them
if(filteredBookings.length > 0)
{
filteredBookings.map(booking=>{
if(hoursTime.indexOf(booking.start) === 0)
{
    bookingHours = hoursTime.slice(0,hoursTime.indexOf(booking.end)+2);
} 

else if (hoursTime.indexOf(booking.start) === 1) {
    bookingHours = hoursTime.slice(hoursTime.indexOf(booking.start)-1,hoursTime.indexOf(booking.end)+2);
}
else 
{
    bookingHours = hoursTime.slice(Math.max(0,hoursTime.indexOf(booking.start)-(2+duration)),hoursTime.indexOf(booking.end)+2) ;
}

 slots = slots.filter(hour => {
     return (bookingHours.indexOf(hour.time) < 0)}
     )

});


setAvailableSlots([...slots]);

}
else{
    setAvailableSlots(hours);
}


 },[pickedDate]);


return (
            <View style= {styles.container}>
{/* 
{ overlayState && <ConfirmBookingOverlay
        isVisible = {overlayState}
        overlayHandler = {overlayHandler}

        matchType = "5x5"
        dateMatch = {selectedDateState.date}
        start = {pickedSlot}
        serviceId = {selectedId}
        navigate = {()=>props.navigation.navigate("Client")}
        ownerId = {props.navigation.getParam("owner")}
        amount = {props.navigation.getParam("amount")}
        duration = {totalTime}
        services = {props.navigation.getParam("services")}
       />   
    } */}
                <View style = {styles.firstImage}>

                <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   />

                </View>

                <View style = {styles.bookingInfoContainer}>
                    <View style = {styles.selectDate}>
                       <Text style = {{fontSize : 16,fontFamily : "poppins-bold"}}>Selectionner une date</Text>
                       <TouchableOpacity style = {styles.datePicker}
                       onPress = {()=>setDatePickerVisibility(true)}
                       >
                        <Text 
                        style = {{fontSize : 16,fontFamily : "poppins"}} >{pickedDateText}
                        </Text>

                        <FontAwesome  name="calendar" size={24} color="black" />
                        
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={pickedDateHandler}
                            onCancel={()=>setDatePickerVisibility(false)}
                            minimumDate={new Date()}
                            display = "spinner"
                            date = {pickedDate}
                        />
                       
                        
                    </TouchableOpacity>


                </View>

                <View style = {styles.selectSlot}>
                <Text style = {{fontSize : 16,fontFamily : "poppins-bold"}}>Selectionner un créneau</Text>
                  <FlatList
                    data={availableSlots}
                    numColumns = {4}
                    renderItem={({item,index})=>{
                        return(
                            <Button 
                            key = {index}
                            title = {item.time}
                            containerStyle ={{width : "20%",margin : "2.5%",}}
                            titleStyle = {{fontFamily : "poppins",color : index ===selectedButtonIndex ?  "#fff": "#000",fontSize : 13}}
                            type="outline"
                            buttonStyle = {{backgroundColor :index ===selectedButtonIndex ?  "#fd6c57": "#fff",borderColor : "#000"}}
                            onPress = {()=>buttonColorHandler(index)}
                             />
                         )
                                     }
                                     }
                   />
                        </View>
                   <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }} 
                   title = "Réserver" 
                   titleStyle = {{fontFamily : "poppins-bold"}}
                   buttonStyle = {{borderRadius : 55}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                onPress = {()=>props.navigation.navigate("Client")}
                   /> 
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

 
}
 
    });
  ///////////////////////////////////////////////////////////////////////////



export default BookStepTwo;