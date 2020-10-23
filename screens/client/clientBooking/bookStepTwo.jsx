import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , ImageBackground,Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator , FlatList, TouchableOpacity} from 'react-native';
import { Button ,Avatar,Rating} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';


import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";
import BarberInfos from '../../../components/BarberInfos';

 const now  = new Date();
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
    {id : "50",time : "17:15"},
    {id : "51",time : "17:30"},
    {id : "52",time : "17:45"},
    {id : "53",time : "18:00"},
    {id : "54",time : "18:15"},
    {id : "55",time : "18:30"},
    {id : "56",time : "18:45"},
    {id : "57",time : "19:00"},
    {id : "58",time : "19:15"},
    {id : "59",time : "19:30"},
    {id : "60",time : "19:45"},
    {id : "61",time : "20:00"},
    {id : "62",time : "20:15"},
    {id : "63",time : "20:30"},
    {id : "64",time : "20:45"},
    {id : "65",time : "21:00"},
    {id : "66",time : "21:15"},
    {id : "67",time : "21:30"},
    {id : "68",time : "21:45"},
    {id : "69",time : "22:00"},
    {id : "70",time : "22:15"},
    {id : "71",time : "22:30"},
    {id : "72",time : "22:45"},
    {id : "73",time : "23:00"},
    ];

const hoursTime = hours.map(hour=>hour.time);
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepTwo = (props)=> {
const clientID =   props.navigation.getParam("clientID");

const services = props.navigation.getParam("services").filter(service => service.id !== 0);
const totalTime = props.navigation.getParam("duration");
const workingTime = props.navigation.getParam("workingTime");
const allBookings = props.navigation.getParam("bookings");
let duration = Math.ceil(totalTime/15)  ; 

if(duration === 1 ) {
    duration = 0;
}


//overlay State
const [overlayState , setOverlayState]=useState(false);


      const [isLoading , setLoading] = useState (false);


      const [isRefreshing, setIsRefreshing] = useState(false);
      //Error Handler
    const [error, setError] = useState();
    


//Make the DatePcikerVisible
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//Picked DateText 
const [pickedDateText,setPickedDateText] = useState (moment().format('LL'));

//Picked DateText 
const [pickedDate,setPickedDate] = useState (new Date());

//Set Button Color to Selected Button
const [selectedButtonIndex , setButtonIndex] = useState();

//Available slots State
const [availableSlots , setAvailableSlots] = useState([]);

//picked Hour
const [pickedSlot,setPickedSlot] = useState(0);

//Fetched DATA
const [data,setData] = useState([]);

//fetched Bookings 

const [bookings,setBookings] = useState([]);


//Selected date
const pickedDateHandler = (date) => {
 
   setDatePickerVisibility(false);
    setPickedDateText(moment(date).format('LL'));
   
    setPickedDate(date);
   
  };


      //Overlay Handelr
      const overlayHandler = ()=>{
     
        setOverlayState((previous) => !previous);
  
      }
  

  //Color Changing Button
 const buttonColorHandler = (a)=>{
    
    setButtonIndex (a);
    setPickedSlot(availableSlots[a].time);
 }


//fetch Worktime of the Barber

//GET WORKING TIME

const getData = async ()=>{

    try {
        setError(false);
        setIsRefreshing(true);
        setLoading(true);
       
        const arr = await fetch(`http://173.212.234.137:3000/bookings/barberBookings/${props.navigation.getParam("barber")}`);
         const resData = await arr.json ();
     
        setBookings([...resData]);
        setIsRefreshing(false);
        setLoading(false);

        }
    
    catch (error) {
        console.log("There is an Error");
        setError(true);
        throw error;

    }


 };

useEffect(()=>{
  
   getData();
   },[setBookings]);


   useEffect(()=>{
    const willFocusSub= props.navigation.addListener(
      'willFocus',
      () => {
      
        getData();
    }
       
     
    );
    return ()=>{
      willFocusSub.remove();
    };
    },[bookings]);



 //Managing the Bookings (Removing the exsiting Bookings)
 useEffect(()=>{
const manager = async ()=>{
//  setLoading(true);

setPickedSlot(0);
setButtonIndex(-1);
//Display only Working Time
let todaysSlots = [];
const workingDays =  workingTime.filter(e=>e.start !== null || e.end !== null)
    ;
const days = workingDays.map(e=>e.day.toUpperCase
    ());
 
const day = moment(pickedDate).format('ddd').substring(0,3).toUpperCase
();
const nowHour = (new Date().getHours()+2).toString()+":00" ;


// const end = moment.utc("2020-05-01T"+nowHour).add(60,"m").format("HH:mm"); 
//  console.log(end)

if(days.length >0)
{
    if(days.indexOf(day) >= 0)
{

    todaysSlots = hours.slice(hoursTime.indexOf(workingDays[days.indexOf(day)].start) , hoursTime.indexOf(workingDays[days.indexOf(day)].end) );
    // setAvailableSlots([...todaysSlots]);
  
    // if(pickedDate.toDateString() === new Date().toDateString()){
    //     todaysSlots = hours.slice(hoursTime.indexOf(nowHour), hoursTime.indexOf(workingTime[days.indexOf(day)].end) );  

    // }



}  

const todaysSlotsTime = todaysSlots.map(e=>e.time);

//Filter the selected Date Bookings
const filteredBookings = bookings.filter(booking=>moment(booking.bookingDate).format("ll") === moment(pickedDate).format("ll"));


let bookingHours = [];
let slots = todaysSlots ;
//Map throught all the existing Bookings and remove them
if(filteredBookings.length > 0)
{
filteredBookings.map(booking=>{
    let bookingDuration = Math.ceil(booking.bookingDuration/15)  ; 
    if(bookingDuration === 1 ) {
        bookingDuration = 0;
    }
if(todaysSlotsTime.indexOf(booking.start) === 0)
{
    bookingHours = todaysSlotsTime.slice(0,todaysSlotsTime.indexOf(booking.start)+bookingDuration+2);
   
} 

else if (todaysSlotsTime.indexOf(booking.start) === 1) {
    bookingHours = todaysSlotsTime.slice(todaysSlotsTime.indexOf(booking.start)-1,todaysSlotsTime.indexOf(booking.start)+bookingDuration+2);
 
}
else 
{
    bookingHours = todaysSlotsTime.slice(Math.max(0,todaysSlotsTime.indexOf(booking.start)-(1+duration)),todaysSlotsTime.indexOf(booking.start)+bookingDuration+2) ;
}

 slots = slots.filter(hour => {
     return (bookingHours.indexOf(hour.time) < 0)}
     )

   


});

if(pickedDate.toDateString() === new Date().toDateString()){
let unAvailableHours = [];

unAvailableHours = todaysSlotsTime.slice(0, todaysSlotsTime.indexOf(nowHour) );  
    slots = slots.filter(hour => {
        return (unAvailableHours.indexOf(hour.time) < 0)}
        )
     
}
await setAvailableSlots([...slots]);
// setLoading(false);

}
else{
    if(pickedDate.toDateString() === new Date().toDateString() && days.indexOf(day) >= 0){

        todaysSlots = hours.slice(hoursTime.indexOf(nowHour), hoursTime.indexOf(workingDays[days.indexOf(day)].end) );  

    }
    setAvailableSlots([...todaysSlots]);
//     if(todaysSlots.length > 0 ){
//     setPickedSlot(todaysSlots[0].time);
// }

// setLoading(false);

}}
}

manager();

 },[pickedDate,bookings]);

//  console.log((new Date().getHours()+1).toString()+":00");
// console.log(moment(new Date()).format('ll'));
// console.log(moment("2020-07-25").format('ll'));

// console.log(moment(pickedDate).format('dddd').substring(0, 3) );

if (error) {
    
    return (
      <View style={styles.centered}>
        <Text>Une erreur est survenue !</Text>
        <Button
          title="Rafraîchir"
           onPress = {loadServices}
           buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : 25,paddingHorizontal : "5%",marginVertical : "5%"}}
        />
      </View>
    );
  }


 if (isLoading) {
    
    return (
      <ImageBackground style= {styles.centered} source={require('../../../assets/images/support.png')}>
        <ActivityIndicator size="large" color= {Colors.primary} />
      
      </ImageBackground>
    );
}

return (
            <View style= {styles.container}>

{ overlayState && <ConfirmBookingOverlay
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
    }
                <View style = {styles.firstImage}>

                {/* <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   /> */}
                <BarberInfos 
                  name = {props.navigation.getParam("name")}
                  surname = {props.navigation.getParam("surname")}
                  wilaya = {props.navigation.getParam("wilaya")}
                  region = {props.navigation.getParam("region")}
                  mark = {props.navigation.getParam("mark")}
               />
                

                </View>

                <View style = {styles.bookingInfoContainer}>
                    <View style = {styles.selectDate}>
                       <Text style = {{fontSize : screen.width/26,fontFamily : "poppins-bold"}}>Selectionner une date</Text>
                       <TouchableOpacity style = {styles.datePicker}
                       onPress = {()=>setDatePickerVisibility(true)}
                       >
                        <Text 
                        style = {{fontSize : screen.width/26,fontFamily : "poppins"}} >{pickedDateText}
                        </Text>

                        <FontAwesome  name="calendar" size={24} color="black" />
                        
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={pickedDateHandler}
                            onCancel={()=>setDatePickerVisibility(false)}
                            minimumDate={now}
                            display = "spinner"
                            date = {pickedDate}
                            maximumDate = {new Date(now.getFullYear(), now.getMonth()+1, now.getDate())}
                        />
                       
                        
                    </TouchableOpacity>


                </View>
                { 
                    availableSlots.length > 0 ?

                <View style = {styles.selectSlot}>
                <Text style = {{fontSize : screen.width/26,fontFamily : "poppins-bold"}}>Selectionner un créneau</Text>
                     
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
                   :
                   <View style ={{alignSelf : "center", height : "50%",justifyContent : "center"}}>
                   <Text style ={{fontFamily : "poppins-bold",fontSize : screen.width/26,color : Colors.primary}}>
                   Aucun creneau disponible ce jour la !
                   </Text>
                   </View>
                   
                    }
                
                   {
                    availableSlots.length > 0 ?
                     <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }} 
                   title = "Réserver" 
                   titleStyle = {{fontFamily : "poppins-bold"}}
                   buttonStyle = {{borderRadius : Platform.OS === "android" ? 55 : 20}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                // onPress = {()=> pickedSlot!== 0 && overlayHandler()}
                onPress = {()=> pickedSlot!== 0 && props.navigation.navigate(
                    "BookStepThree",
                    {
                            bookingDate : pickedDate,
                            start : pickedSlot,
                            barberId : props.navigation.getParam("barber"),
                            clientId : "+213553633809",
                            amount : props.navigation.getParam("amount"),
                            duration : totalTime,
                            services : services,
                            clientID,
                            name:props.navigation.getParam("name"),
                            surname:props.navigation.getParam("surname"),
                            mark:props.navigation.getParam("mark"),
                            region:props.navigation.getParam("region"),
                            wilaya:props.navigation.getParam("wilaya"),
                            overCpt :props.navigation.getParam("overCpt")
                            }
                    
                    )
                   
                    
                    }
         
                   />
                   :
                   <View style = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }}>


                   </View>
                   
                   
                    }
                   
                   
                   
            </View>
            </View>

)


}

BookStepTwo.navigationOptions = ()=> {
    return {
      headerTransparent : true,
      title : "" ,
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
barberName :{
    fontFamily : "poppins-bold",
    fontSize : screen.width/24,
    color :"#fff"
  },
  barberAdress : {
    fontFamily : "poppins",
     color : "#fff",
  
    fontSize : screen.width/30,
  
  },
//////////////////////////////////////////////////////
centered: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    resizeMode:'cover'
  }
 
    });
  ///////////////////////////////////////////////////////////////////////////



export default BookStepTwo;