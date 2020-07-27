import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';

import Colors from '../constants/Colors';
import {Ionicons} from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';


const screen = Dimensions.get("window");



const BookingCard = props =>{
  const gradient1 = props.status === "confirmée" ? "#fd6d57" : "#f32f33";
  const gradient2 = props.status === "confirmée" ? "#fd9054" : "#e52d27";


    return(
      <View style = {styles.card} >
        <LinearGradient colors = { [gradient1, gradient2]} style = {styles.leftDate}>
              <Text style = {styles.dateText}>{props.day}</Text>
              <Text style = {styles.dateText} >{props.date}</Text>
          </LinearGradient>
          <View style = {styles.infos}>

             <Text style = {styles.status}>Status :
              <Text style = {{...styles.statusType,...{color : gradient2}}}> {props.status}</Text>
               </Text>
              <Text style = {styles.slotText} >Horraires : {props.start} - {props.end} </Text>
         
           

              <Text style = {{...styles.priceText ,...{color : gradient2,  textDecorationLine: props.status !="confirmée" ? 'line-through' : "none" ,
              }
              }}>
              Prix :{props.amount} DA
              </Text>
              {/* <Text style = {styles.slotText}>Fin : </Text> */}
              
           

          </View>

         
{/* 
          <View style = {styles.amount}>
          
          <Text style = {styles.priceText}>{props.amount}</Text>
          <Text style = {styles.priceText}>DA </Text>
              
     
          </View> */}

         { 
           props.detail === true ?
           <View style = {styles.detailButton}>

          <Ionicons name="ios-arrow-forward" 
          size={22} 
          color="#252525" 
          onPress = {()=>props.navigation.navigate("BookingDetail", 
          { 
                    day: props.day,
                      date : props.date,
                      status : props.status,
                      start : props.start,
                      end : props.end,
                      amount : props.amount,
                      services : props.services,
                      barberId : props.barberId,
                      clientId : props.clientId,
                      cancelDate : props.cancelDate
                     })} />
          </View>


          : 


          <View style = {styles.detailButton2}>
         

          </View>
}

      </View>
     );    
};


const styles= StyleSheet.create({

  card : {
    width : "90%",
    height : screen.height * 0.15,
    alignSelf : "center",
    borderRadius : 10,
    marginVertical : "2.5%",
    overflow : "hidden",
    flexDirection : "row",
    alignItems : "center",
    justifyContent : "space-between",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation : 2,
    backgroundColor : "#fff",
    
},
leftDate : {
      height : "90%",
      width : "15%",
      justifyContent : "space-around",
      alignItems : "center",
      borderRadius : 10,
      marginLeft : 5

},

infos : {
 
  justifyContent : "space-between",
  alignItems : "flex-start",
  height : "80%"
},
// infos :{
//     width : "30%" , 
//     borderTopRightRadius : 10,
//     borderBottomRightRadius : 10,
//     alignItems : "center",
// },
amount :{
  width : "10%" , 
  borderTopRightRadius : 10,
  borderBottomRightRadius : 10,
  alignItems : "center",


},
detailButton : {
width : "10%",
height : "100%",
borderLeftWidth : 0.5,
justifyContent : "center",
alignItems : "center",

},

detailButton2 : {
  width : "10%",
  height : "100%",


  alignItems : "center",
  
  
  },
//TEXT STYLING //
dateText :{
  color : "#fff",
  fontFamily : "poppins-bold"
},
priceText : {
  fontFamily : "poppins-bold",
  color :Colors.primary,
  fontSize : 16
},
slotText : {
fontFamily : "poppins",
color:"#252525"
},
servicesText : {
  fontFamily : "poppins",
  color:"#252525"
},
status :{
    
fontFamily : "poppins",
color:"#252525"
 
},
statusType : {
  // color : Colors.primary,
  fontFamily : "poppins-bold",

}

});

export default BookingCard;