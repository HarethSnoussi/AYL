import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Alert,ScrollView, Dimensions,ImageBackground,Linking} from 'react-native';

import moment from 'moment';
import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { Ionicons ,MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import {cancelBooking} from "../../../store/actions/bookingsActions";
import { Rating, AirbnbRating } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ConfirmOverlay from '../../../components/ConfirmOverlay';

const screen = Dimensions.get("window");

const BookingDetail = props =>{

  const [overlayVisible,setOverlayVisible] = useState(false);

const services = props.navigation.getParam("services");
const start= props.navigation.getParam("start");
const bookingDate = props.navigation.getParam("bookingDate");
const now  = moment().format().substring(11,16) ;
const diffrence = parseInt(moment.duration(moment(start,"h:mm:ss a").diff(moment(now,"h:mm:ss a"))).asMinutes());
// const conditionAnnuler = ( (props.navigation.getParam("status") === "confirmée" && ((diffrence > 30 && moment(bookingDate).format("ll") === moment().format("ll")) || moment(bookingDate).format("ll") !== moment().format("ll"))) || props.navigation.getParam("status") === "en attente")  ;
// console.log(diffrence);

const conditionAnnuler = ( (props.navigation.getParam("status") === "confirmée" && ((diffrence >= 30 && moment().isSame(bookingDate, 'day')) || moment().isBefore(bookingDate, 'day'))) || props.navigation.getParam("status") === "en attente");

const conditionCall = props.navigation.getParam("status") === "confirmée" ;

/******************SEND A NOTIFICATION TO THE client WHEN A BOOKING IS Canceled ************************/
async function sendPushNotification() {
  const arr = await fetch(`http://173.212.234.137:3000/barber/barbertokens/${props.navigation.getParam("barberId")}`);
  const resData = await arr.json ();
  const allMessages = [];
  
  resData.map(e=>{
  
  allMessages.push(
    {
      to: e.expoToken,
      sound: 'default',
      title: 'Réservation Annulée',
      body: 'Un client a annulé une réservation !',
      data: { data: 'goes here'},
    }
  
  )
  
  })
  
  
  allMessages.map(async (e)=>{
     await fetch('https://exp.host/--/api/v2/push/send', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Accept-encoding': 'gzip, deflate',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(e),
     });
   
   
   })
     
   }
  
  /******************SEND A NOTIFICATION TO THE BARBER WHEN A BOOKING IS MADE ************************/



//Loading State
const [isLoading , setLoading] = useState (false);

//Fetched Barber Infos
const [barberInfos , setBarberInfos] = useState({
  "address": " ",
  "name": " ",
  "phone": " ",
  "region": " ",
  "surname": " ",
  "wilaya": " ",
});

const dispatch = useDispatch();

const overlayToggle = ()=>{

setOverlayVisible(previous => !previous);

}


//cancel booking

const cancelBookingHandler = async () =>{

//ALERT BEFORE CANCEL A BOOKING
// Works on both Android and iOS


      try {
        setLoading(true);
        await dispatch(cancelBooking(props.navigation.getParam("id")));
        await overlayToggle();
        await sendPushNotification();
        await props.navigation.navigate("Client");

        Alert.alert(
          "Réservation annulée",
          "Réservation annulée avec succés",
          [
            { text: "OK", onPress: () =>{} }
          ],
          { cancelable: false }
        );
    setLoading(false);
        
      } catch (error) {
        setLoading(true);
        Alert.alert(
          "Réservation non annulée",
          "Echec à l'annulation de la réservation ",
          [
            { text: "OK", onPress: () =>{} }
          ],
          { cancelable: false }
        );
 setLoading(false);
        throw error;
        
      }
  


//  dispatch(cancelBooking(props.navigation.getParam("cancelDate"),props.navigation.getParam("clientId")))

//  props.navigation.navigate(
//   "Client");
}




useEffect(()=>{

  const getBarber = async ()=>{
    try {
  setLoading(true);
    
      const arr = await fetch(`http://173.212.234.137:3000/barber/barberinfos/${props.navigation.getParam("barberId")}`);
      const resData = await arr.json ();
      setBarberInfos(...resData);
      setLoading(false);

      }
  
  catch (error) {
      console.log("There is an Error");
      throw error;
  }
  

  }

  getBarber();


},[])



if (isLoading) {
  return (
    <ImageBackground style= {styles.centered} source={require('../../../assets/images/support.png')}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    
    </ImageBackground>
  );
}

  return(
    <View style = {styles.container}>

<ConfirmOverlay cancel = {cancelBookingHandler} close = {overlayToggle} isVisible = {overlayVisible} url ={require("../../../assets/pictures/question.png")}  />

    <BookingCard
                            start = {start}
                            end = {props.navigation.getParam("end")}
                            bookingDate = {bookingDate}
                            status = {props.navigation.getParam("state")}
                            amount = {props.navigation.getParam("amount")}
                            day = {props.navigation.getParam("day")}
                            date = {props.navigation.getParam("date")}
                            status = {props.navigation.getParam("status")}
                            detail = {false}
    
     />
            <View style = {styles.actions}>

{
            conditionCall &&
            <TouchableOpacity style = {{alignItems : "center"}}  onPress = {()=>Linking.openURL(`tel:${barberInfos.phone}`)} >
            
               <MaterialIcons name="call" 
                            size={28} 
                            color={Colors.colorH1} 
                           
                    />
            <Text style = {styles.actionsText} >Appeler</Text>

          </TouchableOpacity>
          
          }


        {conditionAnnuler  &&
          <View style = {{alignItems : "center"}} >
          
          <Ionicons name="ios-close-circle-outline" 
                      size={28} 
                      color={Colors.colorF3} 
                      onPress = {overlayToggle}
               /> 
  
            <Text style = {styles.actionsText}>Annuler</Text>

          </View>}
       
            </View>

            <View style = {styles.barber}>
            <Text style = {styles.barberTitle}>Information Du Coiffeur </Text>
                <Text style = {styles.barberText}>Nom : {barberInfos.surname}</Text>
                <Text style = {styles.barberText} >Prénom : {barberInfos.name}</Text>
                <Text style = {styles.barberText} >Adresse : {barberInfos.address}</Text>
                <Text style = {styles.barberText} >Tel : {barberInfos.phone}</Text>
            </View>

            <View style = {styles.services}>

                <ScrollView>
            <Text style = {styles.servicesTitle}>Services </Text>
             
          {      
            services.map((service,index) => {

                return(   
               
               
                    <Text key = {index} style={styles.serviceText}>
                    {service.name +" / "+ 
                    service.serviceDuration +" Min / "+ 
                    service.price + " DA "
                    }
                    </Text>
                   
                    )


            })
         
         }
         
         
        

                </ScrollView>

            </View>


          
         

            </View>

   );   
};


BookingDetail.navigationOptions = (navData) => {
    return {
      headerTintColor:Colors.primary,
      headerBackTitle : " ",
      title : "Détail de la réservation"
    }
    
    };

const styles= StyleSheet.create({
container : {
  flex : 1 
},
actions : {
 width :"90%",
 height : screen.height * 0.1 ,
 alignSelf : "center",
borderRadius : 15,
flexDirection : "row",
alignItems : "center",
justifyContent : "space-around",
backgroundColor : "#fff"

},
barber : {
width : "90%",
backgroundColor  : "#fff" ,
alignSelf : "center" ,
borderRadius : 15,
marginVertical : "2%",
height : screen.height * 0.3 ,
justifyContent : "space-around"

},
services : {
  height : screen.height * 0.3 ,
    backgroundColor : "#fff",
    borderRadius :  15,
    width : "90%",
    alignSelf : "center",
},
review :
{ 
  height : screen.height * 0.2 , 
  backgroundColor :"#fff",
  marginVertical : "2%",
  width :"90%",
  alignSelf : "center",
  borderRadius : 15,

},


//TExt Styling //
actionsText : {
    fontFamily : "poppins",
    fontSize : screen.width /30
},
barberText : {
    fontFamily : "poppins",
    marginLeft : 5,
    fontSize : screen.width /28

},
barberTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    color : Colors.primary,
    fontSize : screen.width /28
},
serviceText :{
    fontFamily : "poppins",
    marginLeft : 5,
    marginBottom : 5,
    fontSize : screen.width /28

},
servicesTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    marginBottom : 10 ,
    color : Colors.primary,
    fontSize : screen.width /28

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


export default BookingDetail;