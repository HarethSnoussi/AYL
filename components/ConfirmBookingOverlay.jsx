import React, { useState } from 'react';
import { Overlay,  Button, } from 'react-native-elements';
import { Text, View,StyleSheet, Dimensions,Alert ,ActivityIndicator} from 'react-native';

import {Ionicons} from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import {addBooking} from "../store/actions/bookingsActions";
import moment from 'moment';
import Colors from '../constants/Colors';


const screen = Dimensions.get("window");

const ConfimBookingOverlay = (props)=>{

const dispatch = useDispatch(); 
// amount , date,date_booking, start,end,status,client_id,barber_id


const end = moment.utc("2020-05-01T"+props.start).add(props.duration,"m").format("HH:mm");  

const [isLoading,setLoading]=useState(false);
const address = props.address + "-" + props.region+"-"+props.wilaya
const servicesId = props.services.map(e=>e.id);


const sendConfirmation = async ()=>{
const date = new Date();
  let booking = {
    amount : props.amount ,
    address : props.address,
    barberId : props.barberId,
    bookingDate : props.bookingDate ,
    clientId : props.clientId,
    date : date,
    duration : props.duration,
    end : end,
    region : props.region,
    services : props.services,
    start : props.start ,
    status : "en attente",
    wilaya : props.wilaya
}
try {

setLoading(true);


 await dispatch(addBooking(booking));
 props.overlayHandler();
 await props.navigate();
 setLoading(false);
 Alert.alert(
  "Réservation envoyée",
  "Réservation envoyée avec succés",
  [
    { text: "OK", onPress: () =>{} }
  ],
  { cancelable: false }
);
  
} catch (error) {
  setLoading(true);
  Alert.alert(
    "Réservation non envoyée",
    "Echec lors de l'envoie de la réservation",
    [
      { text: "OK", onPress: () =>{} }
    ],
    { cancelable: false }
  );
  setLoading(false);
  throw error;
}


};

const services = props.services.map(e=>e.name);

if (isLoading) {
    
  return (
    <Overlay 
    isVisible={props.isVisible}
    overlayStyle = {styles.overlayStyle}
    >
    <View style= {styles.centered} >
      <ActivityIndicator size="large" color= {Colors.primary} />
    
    </View>
    </Overlay>
  );
}


    return (
    <Overlay 
    onBackdropPress = {props.overlayHandler}
    isVisible={props.isVisible}
    overlayStyle = {styles.overlayStyle}
    >
    <View style = {{flex : 1 , justifyContent : "space-around" }} >

<View style = {styles.textsContainer}>
    <View style={styles.title}>
    <Text style={{fontFamily : "poppins-bold",color :Colors.primary,fontSize : screen.width /28}}>Votre réservation :
    </Text>
    </View>
    <View style = {{justifyContent : "space-around" , height :"90%" }}> 
    
   
        <Text style = {styles.text}>Temps : {props.duration} Min </Text>



        <Text style = {styles.text} >Services : {
          services.map(service=>{
            return service + " " 
          })
          
          } 
          
          
          </Text>


        <Text style = {styles.text} >Date : {moment(props.bookingDate).format('LL')}</Text>
        <Text style = {styles.text} >Horraire  : { props.start + " - " + end }</Text>
        <Text style = {styles.text} >Prix  : { props.amount} DA</Text>
        <Text style = {styles.text}>Adresse : {props.address}  </Text>
        <Text style = {styles.text}>Wilaya : {props.wilaya+"-"+props.region}  </Text>


</View>

</View>

{/* <View style = {styles.confirm}> */}

    {/* <View><Text>Confirmer ? </Text></View> */}
    {/* <View style={styles.iconsContainer} > */}
        <View style={{width:"80%",alignSelf : "center"}} >

            <Button
              onPress={()=>sendConfirmation()}
             buttonStyle = {{backgroundColor:Colors.colorF2,borderRadius :5,}}
                    // icon={
                    //   <Ionicons 
                    //           name = "md-checkmark" 
                    //           size = {28}
                    //           onPress={()=>sendConfirmation()}
                    //           color = "#fff"
                    //           />
                    // }
                    title="Confirmer"
/>
      {/* </View> */}


      {/* <View >
      <Button
      containerStyle = {{}}
      buttonStyle = {{backgroundColor:Colors.colorF5,borderRadius :5}}
  icon={
    <Ionicons 
      name="md-close-circle-outline" 
      size={28} 
      color = "#fff"    
       onPress={props.overlayHandler} />
  }
  title=""
/>
      

      </View> */}
</View>
  {/* </View> */}


    


  </View>
      </Overlay>
      
      );

};


const styles= StyleSheet.create({

  overlayStyle:{
    width : "80%",
    height :"60%",
    borderRadius : 20,
    // backgroundColor : "rgba(255, 255, 249,1)",
    

  },
  title : {
    alignSelf : "center"
  },

  textsContainer: {
    height : "65%",
    justifyContent : "space-around",
   overflow : "hidden",
 
   },
  text :{
    // marginBottom : 3,
    fontFamily : "poppins",
 fontSize : screen.width / 30

  },
  confirm:{
    alignItems :"center",
    justifyContent : "space-around",
   
    },
    iconsContainer:{
    flexDirection : "row" ,
   
    width : "40%",
    justifyContent : "space-between",
    marginTop : 5
    },

    centered: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      height:'100%',
      resizeMode:'cover'
    }

});
export default ConfimBookingOverlay;