import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image} from 'react-native'; 
import {Button , Rating, AirbnbRating} from "react-native-elements";
import {Ionicons} from '@expo/vector-icons';
const screen = Dimensions.get("window");

const TopSalonsCard = (props)=> {


    return(

<View style = {styles.topBarbersCard} >
                      <View style = {styles.cardImage}>
                       <Image source = {require("../assets/pictures/barber7.png")} style = {styles.image}  />
                      </View>

                      <View style= {styles.cardBody}> 
                      <View style = {styles.cardBodyTitle}>
                        <Text style = {styles.salonName}>Tahfifa Saloon</Text>
                        <View style = {{flexDirection :"row",alignItems :"center" , }}>
                       
                        <Rating
                          type='star'
                          ratingCount={1}
                          imageSize={15}
                          startingValue = {1}
                          style = {styles.rating}
                          ratingColor = "#FE9654"          
                          type='custom'
                          readonly = {true}
                            />
                             <Text style = {{color : "#9E9E9E"}}>3.6</Text>
                            </View>
                      </View>

                      <View style = {styles.cardBodyInfo}>
                      <Text style = {styles.address}>27 Rue Didouche Rue d'alger Blida</Text>

                      </View>

                    
                        <Button 
                        buttonStyle ={styles.button}
                        title = "Detail" 
                        containerStyle = {styles.cardBodyButton}
                        />
                 

                      </View>

              </View>


    )



}


const styles= StyleSheet.create({
  image : {
    height : "100%",
    width : "100%",
   resizeMode : "cover"
},
  ////////////////////////////////////////////////////////
   textTopBarbers : {
     flexDirection : "row",
     justifyContent : "space-between",
      marginTop : 25,
      marginHorizontal : 20
   },
   topBarbers : {
    width : "100%",
    height : screen.height * 0.4 ,
  
  },
   topBarbersCard : {
     width : screen.width * 0.75 ,
      height : "80%",
      alignSelf : "center",
      borderRadius : 30,
      borderWidth : 0.3 ,
      overflow : "hidden",
      margin : screen.width * 0.03,
      backgroundColor : "white"
   },
   cardImage : {
    overflow : "hidden",
    height : "50%"
   },
   cardBody : {
     flex : 1 ,
    justifyContent : "space-between",
  
   },
   cardBodyTitle : {
      flexDirection : "row",
      justifyContent : "space-between",
      marginHorizontal : "5%",
      marginTop :"2%",
      overflow : "hidden",
      
      height : "33%",
      alignItems : "center"

    
   },
   cardBodyInfo : {
    marginHorizontal : "5%"
   }, 
   cardBodyButton : {
      alignItems :"flex-end",
      overflow : "hidden",
       
   },
   button : {
       backgroundColor : "#fd6c57",
       borderTopLeftRadius : 18,
       width : "30%"
   },

   rating : {
      paddingRight : 7

   },
//////////////////////////////////////////////////
   salonName : {
     fontSize : 16,
     fontFamily : "poppins-bold",
    

   },
   address : {
      fontFamily : "poppins",
    color : "#9d9da1"

   }
  
     
  
  });

export default TopSalonsCard;