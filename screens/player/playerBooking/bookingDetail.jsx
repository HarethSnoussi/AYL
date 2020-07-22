import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,ActivityIndicator} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from "../../../constants/Colors";
import BookingCard from '../../../components/BookingCard';
import { Ionicons ,MaterialIcons } from '@expo/vector-icons';

const BookingDetail = props =>{


  return(
    <View style = {styles.container}>
    <BookingCard
                             start = {props.navigation.getParam("start")}
                            end = {props.navigation.getParam("end")}
                            bookingDate = {props.navigation.getParam("date")}
                            status = {props.navigation.getParam("state")}
                            price = {props.navigation.getParam("price")}
                            day = {props.navigation.getParam("day")}
                            date = {props.navigation.getParam("date")}
                            status = {props.navigation.getParam("status")}
                            detail = {false}
    
     />
            <View style = {styles.actions}>



            <View style = {{alignItems : "center"}}>
            
               <MaterialIcons name="call" 
                            size={28} 
                            color={Colors.colorH1} 

                    />
            <Text style = {styles.actionsText} >Appeler</Text>

          </View>


        
          <View style = {{alignItems : "center"}} >
          
          <Ionicons name="ios-close-circle-outline" 
                      size={28} 
                      color={Colors.colorF3} 
               /> 
  
            <Text style = {styles.actionsText}>Annuler</Text>

          </View>
       
            </View>

            <View style = {styles.barber}>
            <Text style = {styles.barberTitle}>Information Du Coiffeur </Text>
                <Text style = {styles.barberText}>Nom : Snoussi</Text>
                <Text style = {styles.barberText} >Prénom : El Hareth</Text>
                <Text style = {styles.barberText} >Adresse : 25 rue d'alger Blida Algerie</Text>
                <Text style = {styles.barberText} >Tel : 025252525</Text>
            </View>

            <View style = {styles.services}>
                <ScrollView>
                <Text style = {styles.servicesTitle}>Services </Text>
                    <Text style={styles.serviceText}>Coupe de Cheveux  60 Min   350 DA</Text>
                    <Text style={styles.serviceText} >Barbe 10 Min 200 DA </Text>
                    <Text style={styles.serviceText} >Kératine  120 Min 3000 DA </Text>


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
height : "10%" ,
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
height : "30%",
justifyContent : "space-around"

},
services : {
    height : "35%",
    backgroundColor : "#fff",
    borderRadius :  15,
    width : "90%",
    alignSelf : "center"
},
//TExt Styling //
actionsText : {
    fontFamily : "poppins"
},
barberText : {
    fontFamily : "poppins",
    marginLeft : 5

},
barberTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    color : Colors.primary
},
serviceText :{
    fontFamily : "poppins",
    marginLeft : 5,
    marginBottom : 5

},
servicesTitle : {
    alignSelf : "center",
    fontFamily : "poppins-bold",
    marginBottom : 10 ,
    color : Colors.primary

}
});


export default BookingDetail;