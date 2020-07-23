import React, { useState } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";
import * as bookingsActions from "../../../store/actions/bookings"; 
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import BookingCard from '../../../components/BookingCard';
import moment from 'moment';


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
const AllBookingsScreen = (props) => {

const allBookings = [
        {id:1 ,date_booking : '2020-07-24', start : "09:00",end: "10:00",duration : 60 , status : "confirmée", clientId : "+213557115451",barberId : "+213550461010" , price : 800 },
        {id:2,date_booking : '2020-07-24', start : "07:00",end: "08:00",duration : 80 , status : "annulée", clientId : "+213557115451",barberId : "+213550461010" , price : 500},
        {id:3 , date_booking : '2020-07-25' , start : "11:00",end : "11:30",duration : 30 , status : "confirmée", clientId : "+213553633809",barberId : "+213550461010" , price : 1000}
    ];

//Selected Date State
const [selectedDate , setSelectedDate] = useState(new Date());

//Selected Date French Text 
const [selectedDateText , setSelectedDateText] = useState(moment().format('LL'));

const [dayBookings , setDayBookings] = useState([]);

//calendar selected Date object
 const [selectedDay , setSelectedDay] = useState(moment().format('ddd')) ;

const days = allBookings.map(e=>e.date_booking);
let mark = {};

days.forEach(day => {
    
    mark[day] = {
        selected: true, 
        marked: true , 
        selectedColor:"#fff",
        color: Colors.primary
    };

});



const selectedDateHandler = (date) => {

    // console.log(allBookings[days.indexOf(date.dateString)])
const dayBooks = allBookings.filter(bookings => bookings.date_booking === date.dateString );

setSelectedDateText(moment(date.dateString).format('LL'));

setDayBookings ([...dayBooks]);

setSelectedDay(moment(date.dateString).format('ddd'));

};


    return(
        <View style = {styles.container}>

      

        <View  >

            <Calendar
            style = {{borderBottomLeftRadius : 25,borderBottomRightRadius : 25,overflow : "hidden",paddingVertical : "2%" , marginBottom : 15}}
           theme={{
        
            calendarBackground: Colors.secondary,
            textSectionTitleColor: '#fff',
            textSectionTitleDisabledColor: '#fff',
            selectedDayTextColor: Colors.primary,
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
                    dayBookings.map(booking=>{

                        
                        return(
                        <BookingCard
                            key = {booking.id}
                            start = {booking.start}
                            end = {booking.end}
                            bookingDate = {booking.date_booking}
                            status = {booking.status}
                            price = {booking.price}
                            day = {selectedDay}
                            date = {moment(booking.date_booking).date()}
                            navigation = {props.navigation}
                            status = {booking.status}
                            detail= {true}
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
   
  });


export default AllBookingsScreen;
