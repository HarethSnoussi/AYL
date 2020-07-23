import React from 'react';
import { Overlay } from 'react-native-elements';
import { Text, View, Button,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Ionicons} from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import {addBooking} from "../store/actions/bookings";
import moment from 'moment';

const ConfimBookingOverlay = (props)=>{

const dispatch = useDispatch(); 
// date,date_booking, start,end,status,client_id,barber_id


const end = moment.utc("2020-05-01T"+props.hourMatch).add(props.duration,"m").format("HH:mm");  






const sendConfirmation = async ()=>{
 

const date = new Date();
  let booking = {
    bookingDate : props.dateMatch ,
    date : date,
    end : end,
    ownerId : props.ownerId,
    playerId : "+213557115451",
    serviceId : props.serviceId,
    start : props.start ,
    status : "confirmée",
    amount : props.amount ,
    timeMatch : props.matchTime,
    services : props.services,
    
    
   
}
 props.overlayHandler();
 dispatch( addBooking(booking));
 props.navigate();

};


    return (
    <Overlay 
    isVisible={props.isVisible}
    overlayStyle = {styles.overlayStyle}
    >
    <View >

<View style = {styles.textsContainer}>
    <View style={styles.title}>
    <Text style={{fontFamily : "poppins-bold"}}>Votre réservation :
    </Text>
    </View>
    <View>
   
        <Text style = {styles.text}>Temps: {props.matchTime}</Text>
        <Text style = {styles.text} >Type: {props.matchType}</Text>
        <Text style = {styles.text} >Date: {props.dateMatch}</Text>
        <Text style = {styles.text} >Heure: {props.hourMatch}</Text>
        <Text style = {styles.text} >Fin: {end}</Text>
</View>

</View>
<View style = {styles.confirm}>

    <View><Text>Confirmer ? </Text></View>
    <View style={styles.iconsContainer} >
        <View >

            <Ionicons 
            name = "md-checkbox" 
            size = {28}
            onPress={()=>sendConfirmation()}
            color = "green"
            />
      </View>


      <View >
          <Ionicons 
          name = "ios-close-circle" 
          size = {28}
          color ="red"
         
          onPress={props.overlayHandler}
          />
      </View>
</View>
  </View>


    


  </View>
      </Overlay>
      
      );

};


const styles= StyleSheet.create({
 textsContainer: {
   height : "65%",
   justifyContent : "space-around",
 
  },
  overlayStyle:{
    width : "80%",
    height :"40%",
    borderRadius : 20,
    backgroundColor : "rgba(255, 255, 249,1)"
  },
  title : {
    alignSelf : "center"
  },
  text :{
    marginBottom : 3,
    fontFamily : "poppins"
  },
  confirm:{
    alignItems :"center",
    justifyContent : "space-around",
   
    height : "35%"
    },
    iconsContainer:{
    flexDirection : "row" ,
   
    width : "20%",
    justifyContent : "space-between"
    }

});
export default ConfimBookingOverlay;