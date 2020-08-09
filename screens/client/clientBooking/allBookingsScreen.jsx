import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Dimensions, ScrollView } from 'react-native';

import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";

import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import BookingCard from '../../../components/BookingCard';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getClientBookings, expiredbookings } from '../../../store/actions/bookingsActions';


const screen = Dimensions.get("window");
moment.locale("fr");  
LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'fr';

  ///////////////////////////////////////////////////////////////////////
const AllBookingsScreen = (props) => {
const allBookings = useSelector(state => state.bookings.bookings);
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  

//Selected Date State
const [selectedDate , setSelectedDate] = useState(moment(moment().format("YYYY-MM-DD")).format());

//Selected Date French Text 
const [selectedDateText , setSelectedDateText] = useState(moment().format('LL'));

const [dayBookings , setDayBookings] = useState([]);

//calendar selected Date object
 const [selectedDay , setSelectedDay] = useState(moment().format('ddd')) ;

 const [isLoading , setLoading] = useState(false);

const dispatch = useDispatch();

const days = allBookings.map(e=>e.bookingDate);
let mark = {};

days.forEach(day => {

 if ( moment().format("ll") === moment(day).format("ll") || moment() <= moment(day)) {
    mark[day] = { 
        selected: true, 
        marked: true , 
        selectedColor: Colors.colorF5,
        textColor: Colors.primary,
        color : Colors.colorH1 ,
    };

 } else {

    mark[day] = { 
        selected: true, 
        marked: false , 
        selectedColor:Colors.orange,
        text: {
            color: 'black',
            fontWeight: 'bold'
          }
    };

 }
   

});

/**************************************************************************************** */
//get ALL CLIENT BOOKINGS
// const getAllClientBookings = useCallback(async ()=>{

//     try{
//         await dispatch(getClientBookings("+213553633809"));

//       }catch(err){
//           console.log(err);
//         throw err ;
//       }
  
  
//   },[dispatch]);
  


// //Dispatch and get the bookings 
// useEffect(()=>{
//             setLoading(true);
//             getAllClientBookings();
//             setLoading(false);
 
// },[getAllClientBookings])




/*************************************************************** */
// //Cancel EXPIRED BOOKINGS
const expired = useCallback(async ()=>{

  try{
      setLoading(true);

 
      await dispatch(expiredbookings(clientID));
      await dispatch(getClientBookings(clientID));
     setLoading(false);

    }catch(err){
        console.log(err);
      throw err ;
    }


},[dispatch,allBookings]);


useEffect(()=>{
  expired();
},[])


useEffect(()=>{
const willFocusSub= props.navigation.addListener(
  'willFocus',
  () => {

    expired();
   
  }
);
return ()=>{
  willFocusSub.remove();
};
},[expired]);



/**************************************************************************************** */


const selectedDateHandler = (date) => {
// console.log(allBookings[days.indexOf(date.dateString)])
const dayBooks = allBookings.filter(bookings => bookings.bookingDate === date.dateString );

setSelectedDateText(moment(date.dateString).format('LL'));
setDayBookings ([...dayBooks]);

setSelectedDay(moment(date.dateString).format('ddd'));
setSelectedDate(moment(date.dateString).format());
 

};

/**************************************************************************************** */
//TODAYS BOOKINGs




useEffect(()=>{
 
  const todaysBookings= async ()=>{
      setLoading(true);
      const dayBooks = await allBookings.filter(bookings => moment(bookings.bookingDate).format() === selectedDate);
      await setDayBookings([...dayBooks]);
      setLoading(false);
  }

  // if((selectedDateText ===moment (new Date()).format("ll")  ))
  todaysBookings();
  
},[allBookings,selectedDate])


/***************************************************************************************************************************************************************************** */

//IF IS LOADING
if (isLoading) {
    return (
      <View style= {styles.centered}>
        <ActivityIndicator size="large" color= {Colors.primary} />

      </View>
    );
}



    return(
        <View style = {styles.container}>

      

        <View  >

            <Calendar
            style = {{borderBottomLeftRadius : 25,borderBottomRightRadius : 25,overflow : "hidden",paddingVertical : "2%" , marginBottom : 15}}
           theme={{
            // selectedDayTextColor: Colors.primary,

            calendarBackground: Colors.secondary,
            textSectionTitleColor: '#fff',
            textSectionTitleDisabledColor: '#fff',
            todayTextColor: '#2d4150',
            dayTextColor: '#fff',
            textDisabledColor: '#252525',
            dotColor: '#fff',
            selectedDotColor: '#ffffff',
            arrowColor: '#fff',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: '#fff',
            indicatorColor: '#fff',
            textDayFontFamily: 'poppins',
            textMonthFontFamily: 'poppins',
            textDayHeaderFontFamily: 'poppins',
            }}
           
             markedDates = {mark}
             onDayPress={(date)=>selectedDateHandler(date)}
             />

        </View>
            <View style = {{width  : "90%",alignSelf : "center"}}>
            <Text style = {{fontSize : 17 , fontFamily : "poppins-bold"}}>{selectedDateText}</Text>

            </View>
                <ScrollView style = {styles.cardsContainer}>

                {

                    dayBookings.map((booking , index)=>{
                      
                      
                        return(
                        <BookingCard
                            key = {index}
                            start = {booking.start}
                            end = {booking.end}
                            bookingDate = {booking.bookingDate}
                            status = {booking.status}
                            amount = {booking.amount}
                            day = {selectedDay}
                            date = {moment(booking.bookingDate).date()}
                            navigation = {props.navigation}
                            services = {booking.services}
                            detail= {true}
                            barberId = {booking.barberId}
                            clientId = {booking.clientId}
                            cancelDate = {booking.date}
                            id = {booking.id}
                         /> 

                    )})
                    
                 

                }
                     
                
                       
                       


                </ScrollView>

    </View>


    )


};




const styles= StyleSheet.create({
    container : {
      flex : 1 , 
      backgroundColor : "#f2f2f2",
      overflow : "hidden",

    },
    cardsContainer: { 
             width : "100%",  
 
         
   },
   //////////////////////////////////////////////////////
   centered: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center'
     }
   
  });


export default AllBookingsScreen;