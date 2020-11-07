import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image,ImageBackground,TouchableOpacity,Platform
} from 'react-native'; 
import {Button , Rating, AirbnbRating,Avatar} from "react-native-elements";
import {useSelector } from 'react-redux';
import Colors from '../constants/Colors';

const screen = Dimensions.get("window");

const TopBarbersCard = (props)=> {

  

    return(

        <View style = {styles.barberContainer}>
        <View  style = {styles.barberPictureContainer}>

         <ImageBackground resizeMode = "stretch" style = {{width : "100%" ,height : "100%" ,alignItems : "center" , justifyContent : "center"}} source = {{uri:'http://173.212.234.137/assets/tahfifa/test4.png'}}>  
           <Avatar source = {{uri:`http://173.212.234.137/profileImages/barber/${props.image}`}}
              containerStyle = {styles.barberPicture}
              rounded
              size= "large"
              />
              </ImageBackground>
        </View>
        <View style = {styles.barberInfos}>
            <Text style = {styles.name}>{props.surname + " "+props.name}</Text>
            <Text style = {styles.info}>{props.wilaya +" - "+props.region}</Text>
            <Rating 
              imageSize={screen.width/18} 
              readonly
              startingValue= {props.mark === null ? 2.5 : props.mark}
              value = {props.mark === null ? 2.5 : props.mark}
              style={styles.rating }
              ratingColor = "#FE9654"          
              type='custom'
              ratingBackgroundColor={'#323446'}
              tintColor='#fff' />

            <TouchableOpacity style={{alignItems : "center"}} onPress={props.navigateToBarberProfil}>
                  <Text style ={{color : "#fd6c57",fontFamily : "poppins-bold",letterSpacing : 1,fontSize : screen.width/30}}>Voir le profil </Text>
                </TouchableOpacity>
          
                    
            <Button 
              buttonStyle ={styles.button}
              title = "Réserver" 
              titleStyle = {{color :"#fff",fontSize : screen.width/30}}
              onPress = {props.navigate}
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
    borderRadius : screen.width/14.4,
    overflow : "hidden",
    marginHorizontal : screen.width * 0.03,
    borderWidth : 0.3,
   
  },
  barberPictureContainer : {
    width : "100%",
    height : "40%",
    overflow : "hidden",
    alignItems : "center",
    justifyContent : "center",
  },
  barberPicture : {
   borderWidth :1,
   width:screen.width/5.5,
   height:screen.width/5.5
  },
  barberInfos : {
    height : "60%",
    justifyContent : "space-around",
    overflow : "hidden"
  },
  rating : {
  
  },
   /////////////////////////////////////////////////
 info : {
    fontFamily : "poppins",
    color : "#9d9da1",
    alignSelf : "center",
    fontSize : screen.width/30
 },
 name : {
    fontFamily : "poppins-bold",
    color:Colors.blue,
    alignSelf : "center",
    fontSize : screen.width/24
 },
 button : {
   backgroundColor : "#fd6c57",
   alignSelf : "center",
   marginBottom:screen.width/72,
   paddingHorizontal:screen.width/14.4,
   borderRadius:screen.width/18
}
  
  });

export default TopBarbersCard;