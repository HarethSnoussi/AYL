import React from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";
import * as bookingsActions from "../../../store/actions/bookings"; 
import {Calendar, CalendarList, Agenda,LocaleConfig} from 'react-native-calendars';
import BookingCard from '../../../components/BookingCard';


const screen = Dimensions.get("window");

LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
    today: 'Aujourd\'hui'
  };
  LocaleConfig.defaultLocale = 'fr';
const allBookingsScreen = (props) => {

const allBookings = [
        {id:1 ,date_booking : '2020-07-24', start : "09:00",end : "10:00",duration : 60 , status : "confirmée", clientId : "+213557115451",barberId : "+213550461010"},
    
        {id:2 , date_booking : '2020-07-25' , start : "11:00",end : "11:30",duration : 30 , status : "confirmée", clientId : "+213553633809",barberId : "+213550461010"}
    ];

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

    return(
        <View style = {styles.container}>

      

        <View  >

            <Calendar
            style = {{borderBottomLeftRadius : 25,borderBottomRightRadius : 25,overflow : "hidden",paddingVertical : "5%"}}
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
             onDayPress={(day) => {console.log(allBookings[days.indexOf(day.dateString)])}}
             />

        </View>

                <ScrollView style = {styles.cardsContainer}>
                       <BookingCard /> 

                </ScrollView>

    </View>


    )


};




const styles= StyleSheet.create({
    container : {
      flex : 1 , 
      backgroundColor : "#fff",
      overflow : "hidden",

    },
    cardsContainer: { 
             width : "100%",
           backgroundColor : "red",
       
         
   },
   
  });




export default allBookingsScreen;
