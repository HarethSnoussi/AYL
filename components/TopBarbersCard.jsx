import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image,ImageBackground} from 'react-native'; 
import {Button , Rating, AirbnbRating,Avatar} from "react-native-elements";

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
                   startingValue="3.6"
                   style={styles.rating }
                   ratingColor = "#FE9654"          
                          type='custom'
                        />
            <Button 
              buttonStyle ={{backgroundColor : "#fd6c57"}}
              title = "Detail" 
              
              />

        </View>
    
  </View>
    )



}


const styles= StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "#ffffff"
    },
    /////////////////////////////////////////////
    firstImage : {
      width : screen.width,
      height : screen.height * 0.4 ,
     overflow : "hidden",
     
  
    } ,
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
   topSalons : {
    width : "100%",
    height : screen.height * 0.4 ,
  
  },
  topBarbers : {
   
    width : "100%",
    height : screen.height * 0.5 ,
  
  },
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
        marginBottom : "5%"
  },
  barberPicture : {
  borderWidth :1
  
  },
  
  barberInfos : {
  height : "50%",
  justifyContent : "space-between",
  alignItems : 'center',
  overflow : "hidden"
  
  },
  rating : {
  
  },
   /////////////////////////////////////////////////
 info : {
        fontFamily : "poppins",
        color : "#9d9da1"
 },
 name : {
    fontFamily : "poppins-bold",
    color : "#000"
 }
  
  });

export default TopBarbersCard;