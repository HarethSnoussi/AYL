import React, { useState } from 'react';
import { Overlay,  Button, Avatar} from 'react-native-elements';
import {Image, Text, View,StyleSheet, Dimensions,Alert ,ActivityIndicator, ImageBackground,ScrollView} from 'react-native';

import {Ionicons} from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import {addBooking} from "../store/actions/bookingsActions";
import moment from 'moment';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SentOverlay from './SentOverlay';
import { LinearGradient } from 'expo-linear-gradient';




const screen = Dimensions.get("window");

const ConfimBookingOverlay = (props)=>{

const dispatch = useDispatch(); 
// amount , date,date_booking, start,end,status,client_id,barber_id


const end = moment.utc("2020-05-01T"+props.start).add(props.duration,"m").format("HH:mm");  

const [isLoading,setLoading]=useState(false);
const address = props.address + "-" + props.region+"-"+props.wilaya
const servicesId = props.services.map(e=>e.id);
const [sentVisible,setSentVisible] = useState(false);

/******************SEND A NOTIFICATION TO THE BARBER WHEN A BOOKING IS MADE ************************/
async function sendPushNotification() {
const arr = await fetch(`http://173.212.234.137:3000/barber/barbertokens/${props.barberId}`);
const resData = await arr.json ();
const allMessages = [];

resData.map(e=>{

allMessages.push(
  {
    to: e.expoToken,
    sound: 'default',
    title: 'Réservation Recu',
    body: 'Vous avez recu une réservation !',
    data: { data: 'goes here' ,client:props.clientId,title: 'Réservation Recu',
    body: 'Vous avez recu une réservation !',},
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
const sendConfirmation = async ()=>{
const date = new Date();
  let booking = {
    amount : props.amount ,
    address : props.address,
    barberId : props.barberId,
    bookingDate : moment(props.bookingDate).format() ,
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
 /*********************************************** */
await sendPushNotification();
 /************************************************ */
 props.overlayHandler();
 await props.navigate();
 setLoading(false);

//  Alert.alert(
//   "Réservation envoyée",
//   "Réservation envoyée avec succés",
//   [
//     { text: "OK", onPress: () =>{} }
//   ],
//   { cancelable: false }
// );
  
} catch (error) {
  setLoading(true);
  await  props.overlayHandler();
  await props.sentOverlayHandler();
  // Alert.alert(
  //   "Réservation non envoyée",
  //   "Echec lors de l'envoie de la réservation",
  //   [
  //     { text: "OK", onPress: () =>{} }
  //   ],
  //   { cancelable: false }
  // );
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
<View >

    <TouchableOpacity style={{alignItems:"flex-end",width:"95%"}}>
    
    <Ionicons 
      name="md-close" 
      size={22} 
      color = {Colors.primary}
       onPress={props.overlayHandler} />
    
    </TouchableOpacity>
    <View style = {{height:"90%" , justifyContent : "space-around",marginTop:"5%" }} >

<View style = {styles.textsContainer}>
<View style={styles.title}>
    <Text style={{fontFamily : "poppins-bold",color :Colors.primary,fontSize : screen.width /24}}>Informations
    </Text>
    </View>
  
<View style ={{height:"70%"}}>
<ScrollView>
{props.services.map((service,index)=>{

return(
  <View key ={index} style ={{flexDirection :"row",width:"85%",alignSelf:"center",justifyContent:"space-around",alignItems:"center",height:screen.height*0.1,marginVertical:"2%",borderBottomWidth : 0.3}}>
          <Avatar
          source = {{uri:'http://173.212.234.137/assets/tahfifa/icon.png'}}
          overlayContainerStyle = {{backgroundColor:"transparent",overflow:"hidden"}}
          size = "small"
           />
           <View style = {{flexDirection :"row",justifyContent:"space-between",width:"75%",alignItems:"center"}}>
          
           <View>
          <Text  style = {{fontFamily : "poppins-bold",fontSize : screen.width/30,color:Colors.blue}} >{service.name}</Text>
          <Text  style = {{fontFamily : "poppins", color : "#9d9da1",fontSize : screen.width/32}} >{service.duration} min</Text>
          </View>

          <View>
            <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/30,color:Colors.blue}} >{service.price} DA</Text>

          </View>
          </View>

      </View>



)



})} 


</ScrollView>
</View>
<View style ={{height:"20%"}}> 
<View style ={{flexDirection :"row",width:"90%",justifyContent :"space-between",alignSelf:"center",borderTopWidth :0.3}}>
<View>
<Text  style = {styles.priceText}  >Prix Total:</Text>
<Text style = {styles.timeText} >{ props.duration} Min</Text>
</View>
<Text style = {styles.priceText} >{ props.amount} DA</Text>


</View>



</View>
</View>

{/* <View style = {styles.confirm}> */}

    {/* <View><Text>Confirmer ? </Text></View> */}
    {/* <View style={styles.iconsContainer} > */}
        <View style={{width:"100%"}} >
       
      


            <Button
             ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
              onPress={()=>sendConfirmation()}
             buttonStyle = {{borderRadius :25,marginVertical:"2%",alignItems :"center",justifyContent:"space-between",paddingHorizontal:20}}
             containerStyle = {{width:"90%",alignSelf:"center"}}
             iconRight = {true}
                    icon={
                      <Ionicons 
                              name = "md-checkmark" 
                              size = {28}
                              onPress={()=>sendConfirmation()}
                              color = "#fff"
                              />
                    }
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
  </View>
      </Overlay>
      
      );

};


const styles= StyleSheet.create({

  overlayStyle:{
    width : "95%",
    height :"90%",
    borderRadius : 20,
    
    // backgroundColor : "rgba(255, 255, 249,1)",
    

  },
  title : {
    alignSelf : "center",
    marginBottom :"1%"
  },

  textsContainer: {
    height : "75%",
    justifyContent : "space-around",
   overflow : "hidden",
 

   },
  text :{
    // marginBottom : 3,
    fontFamily : "poppins",
 fontSize : screen.width / 30

  },
  priceText:{
    fontFamily : "poppins-bold",
    fontSize : screen.width / 18,
    color: Colors.blue,
    paddingTop:5

  },
  timeText:{
    fontFamily : "poppins-bold",
    fontSize : screen.width / 30,
    color: "#9d9da1",
  

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

