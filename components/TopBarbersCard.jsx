import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image,ImageBackground} from 'react-native'; 
import {Button , Rating, AirbnbRating,Avatar} from "react-native-elements";
import {Ionicons} from '@expo/vector-icons';

const screen = Dimensions.get("window");

const TopBarbersCard = (props)=> {


    return(

        <View style = {styles.barberContainer}>
        <View  style = {styles.barberPictureContainer}>

         <ImageBackground resizeMode = "stretch" style = {{width : "100%" ,height : "100%" ,alignItems : "center" , justifyContent : "center"}} source = {require("../assets/pictures/test4.png")}>  
            <Avatar source = {require("../assets/pictures/person1.jpg")}
              containerStyle = {styles.barberPicture}
              rounded
              size= "large"
              />
              </ImageBackground>
        </View>
        <View style = {styles.barberInfos}>
            <Text style = {styles.name}>Snoussi El Hareth</Text>
            <Text style = {styles.info}>Blida - Bab Essebt</Text>
            <Text style = {styles.info}>05525252</Text>
            <Rating imageSize={20} 
                    readonly
                   startingValue= {3.65}
                   style={styles.rating }
                   ratingColor = "#FE9654"          
                          type='custom'
                        />
                    
            <Button 
              buttonStyle ={styles.button}
              title = "Profile" 
              titleStyle = {{color :"#fff",fontSize : 13}}
             
              />

        </View>
    
  </View>
    )



}


const styles= StyleSheet.create({
   
  ////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////
  barberContainer : {
    height : "90%",
    width : screen.width * 0.6,
    alignSelf : "center",
    borderRadius : 25,
    overflow : "hidden",
    marginHorizontal : screen.width * 0.03,
    borderWidth : 0.3 ,
   
   
  },
  barberPictureContainer : {
        width : "100%",
        height : "40%",
        overflow : "hidden",
        alignItems : "center",
        justifyContent : "center",
        
  },
  barberPicture : {
  borderWidth :1
  
  },
  
  barberInfos : {
  height : "60%",
  justifyContent : "space-around",
 
  overflow : "hidden",
  
  
  },
  rating : {
  
  },
   /////////////////////////////////////////////////
 info : {
        fontFamily : "poppins",
        color : "#9d9da1",
    alignSelf : "center"

 },
 name : {
    fontFamily : "poppins-bold",
    color : "#000",
    alignSelf : "center"
 },
 button : {
   backgroundColor : "#fd6c57",
   alignSelf : "center",
  
}
  
  });

export default TopBarbersCard;