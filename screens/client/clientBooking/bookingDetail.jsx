import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator, Alert,ScrollView, Dimensions,ImageBackground,Linking} from 'react-native';
import moment from 'moment';
import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { Ionicons ,MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {cancelBooking} from "../../../store/actions/bookingsActions";
import { Rating, AirbnbRating ,Avatar,Button} from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ConfirmOverlay from '../../../components/ConfirmOverlay';
import { LinearGradient } from 'expo-linear-gradient';

const screen = Dimensions.get("window");

const BookingDetail = props =>{
  const client= useSelector(state=>state.clients.client);
  const [overlayVisible,setOverlayVisible] = useState(false);

const services = props.navigation.getParam("services");
const start= props.navigation.getParam("start");
const bookingDate = props.navigation.getParam("bookingDate");
const now  = moment().format().substring(11,16) ;
const diffrence = parseInt(moment.duration(moment(start,"h:mm:ss a").diff(moment(now,"h:mm:ss a"))).asMinutes());

const gradient1 = props.navigation.getParam("status") === "en attente" ? "#fd6d57" : (props.navigation.getParam("status") === "confirmée" ||props.navigation.getParam("status") === "réalisée" ) ? "#11998e" : "#f14638";
const gradient2 = props.navigation.getParam("status") === "en attente" ? "#fd9054" : (props.navigation.getParam("status") === "confirmée" ||props.navigation.getParam("status") === "réalisée" ) ? Colors.colorH1 : "#F4686A";

const conditionAnnuler = ( (props.navigation.getParam("status") === "confirmée" && ((diffrence >= 30 && moment().isSame(bookingDate, 'day')) || moment().isBefore(bookingDate, 'day'))) || props.navigation.getParam("status") === "en attente");

const conditionCall = props.navigation.getParam("status") === "confirmée" ;

/******************SEND A NOTIFICATION TO THE client WHEN A BOOKING IS Canceled ************************/
async function sendPushNotification() {
  const arr = await fetch(`http://173.212.234.137:3000/barber/barbertokens/${props.navigation.getParam("barberId")}`);
  const resData = await arr.json ();
  const allMessages = [];
  
  resData.map(e=>{
  
    // <Text style = {styles.barberText}>Coiffeur  : {barberInfos.surname + " "+barberInfos.name}</Text>
                
    // <Text style = {styles.barberText} >Adresse : {barberInfos.address}</Text>


  allMessages.push(
    {
      to: e.expoToken,
      sound: 'default',
      title: 'Réservation Annulée',
      body: 'Un client a annulé sa réservation !',
      data: { 
        data: 'goes here',

      title: 'Réservation Annulée',
      body: 'Cette réservation a été  annulée !',
      start : start,
      end : props.navigation.getParam("end"),
      bookingDate : bookingDate,
      address : props.navigation.getParam("address"),
      name : client[0].name,
      surname : client[0].surname
    },
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
    <ImageBackground style= {styles.centered} source={{uri:'http://173.212.234.137/assets/tahfifa/support.png'}}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    
    </ImageBackground>
  );
}

  return(
    <View style = {styles.container}>

<ConfirmOverlay cancel = {cancelBookingHandler} close = {overlayToggle} isVisible = {overlayVisible}  />
<View style ={{justifyContent:"center",marginVertical : "5%"}}>
<Text style = {styles.barberTitle}>Ma Réservation </Text>
</View>
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

     {props.navigation.getParam("status") !== "expirée" &&  props.navigation.getParam("status") !== "réalisée" &&  props.navigation.getParam("status") !== "annulée" && 
            <View style = {styles.actions}>


            {
            conditionCall &&
            <TouchableOpacity style = {{alignItems : "center"}}  onPress = {()=>Linking.openURL(`tel:${barberInfos.phone}`)} >
            
               

<Button
buttonStyle = {{backgroundColor : "white"}}
  icon={
    <MaterialIcons name="call" 
                            size={screen.width/12.85} 
                            color={Colors.colorH1} 
                           
                    />
  }
  iconRight

/>
            <Text style = {styles.actionsText} >Appeler</Text>

          </TouchableOpacity>
          
          }


        {conditionAnnuler  &&
          <TouchableOpacity style = {{alignItems : "center"}} >
          
        
              <Button
                  buttonStyle = {{backgroundColor : "white"}}
                    icon={
                      <Ionicons name="ios-close-circle-outline" 
                                        size={screen.width/12.85} 
                                        color={Colors.colorF3} 
                                        onPress = {overlayToggle}
                                /> 
                    }
                    iconRight

            />
            <Text style = {styles.actionsText}>Annuler</Text>

          </TouchableOpacity>}
       
            </View>
          }
<View style = {styles.barber}>

<View style={styles.title}>
    <Text style={{fontFamily : "poppins-bold",color :Colors.blue,fontSize : screen.width /28,paddingBottom:screen.width/72}}>Détail de la réservation
    </Text>
    </View>


    <View style ={{height : "40%",width:"100%"}}>
<ScrollView>
{      
      services.map((service,index) => {

          return(   
         
         <View key = {index} style = {{alignSelf :"center" , flexDirection :"row",justifyContent :"space-between",width:"90%",height:screen.height*0.08}}>
       
        
              <Text  style={styles.serviceText}>
              {service.name +"  "}
              </Text>
            
              <Text  style={styles.serviceText}>
              {service.price + " DA " }
              </Text>
              
              </View>
              )


      })
   
   } 

</ScrollView>

</View>



<LinearGradient colors = { [gradient1, gradient2]} style ={{height:"20%",justifyContent:"center"}}> 
<View style ={{flexDirection :"row",width:"90%",justifyContent :"space-between",alignSelf:"center"}}>
<View>
<Text  style = {styles.priceText}  >Prix Total:</Text>
<Text style = {styles.timeText} >{props.navigation.getParam("duration")+" Min"}</Text>

</View>
<Text style = {styles.priceText} >{props.navigation.getParam("amount")+" DA"}</Text>


</View>



</LinearGradient>


{/* <View  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width : "80%",
    alignSelf :"center",
    marginTop: "5%"
  }}>

                </View> */}

                <View style = {{height : "30%",alignItems:"center",paddingTop : "2%"}}>
                <View style = {{width : "90%",marginBottom : "5%",}}>
                <Text style = {{color : Colors.textGrey,fontFamily : "poppins-bold",fontSize : screen.width /26}}>Coiffeur</Text>
                </View>
                <View style = {{alignSelf :"center" , flexDirection :"row",width:"90%",alignItems:"center"}}>
              
                <Avatar
          source = {{uri:`http://173.212.234.137/profileImages/barber/${barberInfos.image}`}}
          overlayContainerStyle = {{overflow:"hidden"}}
          size = "small"
          rounded
          
           />
           <View style = {{marginLeft : "10%"}}>
                <Text  style={styles.serviceText}>
                {barberInfos.surname + " "+barberInfos.name}
                </Text>
                </View>
                </View>

                </View>

</View>



 
                
  

            {/* <View style = {styles.services}>

                <ScrollView>
            

                </ScrollView>

            </View> */}


          
         

            </View>

   );   
};


    BookingDetail.navigationOptions = (navData) => {
      return {
         headerTransparent : true,
        headerTintColor:'#111',
        headerBackTitle : " ",
        title : "",
        // headerShown: false,
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
borderRadius : screen.width/24,
flexDirection : "row",
alignItems : "center",
justifyContent : "space-around",
backgroundColor : "#fff",
paddingTop : "1%"
},
barber : {
width : "90%",
backgroundColor  : "#fff" ,
alignSelf : "center" ,
borderRadius : screen.width/24,
marginVertical : "2%",
height : screen.height * 0.6 ,
// justifyContent : "space-between"

},
services : {
  height : screen.height * 0.3 ,
    backgroundColor : "#fff",
    borderRadius :  screen.width/24,
    width : "90%",
    alignSelf : "center",
},
title : {
  alignSelf : "center",
  paddingVertical :"3%",
},


//TExt Styling //
actionsText : {
    fontFamily : "poppins",
    fontSize : screen.width /30,
    color : Colors.blue
},
barberText : {
    fontFamily : "poppins",
    marginLeft : screen.width/72,
    fontSize : screen.width /28

},
barberTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    color : Colors.Blue,
    fontSize : screen.width /24
},
serviceText :{
    fontFamily : "poppins",
   
    fontSize : screen.width /28

},
servicesTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    marginBottom : screen.width/36 ,
    color : Colors.primary,
    fontSize : screen.width /28

},
priceText:{
  fontFamily : "poppins-bold",
  fontSize : screen.width / 20,
  color:"#fff",
 

},
timeText:{
  fontFamily : "poppins-bold",
  fontSize : screen.width / 30,
  color: "#fff",


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