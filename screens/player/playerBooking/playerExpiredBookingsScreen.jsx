import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar ,Badge } from 'react-native-elements';
import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { useSelector,useDispatch } from 'react-redux';
import * as bookingsActions from "../../../store/actions/bookings";

const months = ['Nothing','Janvier', 'Février', 'Mars','Avril','Mai','Juin', 'Juillet', 'Août','Septembre','Octobre','Novembre', 'Décembre' ];

const PlayerExpiredBookingsScreen = props =>{




  const canceledBookings = useSelector(state =>state.bookings.playerBookings.filter(e=>e.status === "annulée")) ;
  return(
    <View style = {styles.container}>
            <ScrollView style = {styles.componentContainer}>
           {canceledBookings.map((e,index)=>{
             let month = "0";
             if(e.bookingDate.slice(5, 6)==="0"){
              month=e.bookingDate.slice(6, 7)
             } else{
               month =e.bookingDate.slice(5, 7)
             }
             return ( <BookingCard 
                      key={index}
                      status = "warning"
                      value = "Annulée"
                      stade = {e.ownerId}
                      time = {e.timeMatch}
                      stadium = {e.typeMatch}
                      hours = {e.start + "-" + e.end}
                      day = {e.bookingDate.slice(8,10)}
                      month = {months[month]}
                      year = {e.bookingDate.slice(0,4)}
                      date = {e.date}
                      playerId = {e.playerId}
                      
                  />)}
                       )}
              

            </ScrollView>
    </View>

   );   
};


const styles= StyleSheet.create({
container : {
  backgroundColor : "#323232",
  flex : 1 
},
titleContainer : {
  marginTop : "20%",
  alignSelf : "center",
  borderBottomColor : "white",
  borderBottomWidth : 0.5,
  marginBottom : 15

},
componentContainer : {
  
},
 //////////////////////////////////////
 centered: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

});


export default PlayerExpiredBookingsScreen;