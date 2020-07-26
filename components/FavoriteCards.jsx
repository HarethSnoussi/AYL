import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image,ImageBackground} from 'react-native'; 
import {Button , Rating, AirbnbRating,Avatar} from "react-native-elements";
import {Ionicons} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const screen = Dimensions.get("window");

const FavoriteCard = (props)=> {
const [heartColor,setHeartColor] = useState("#9d9da1");
const [firstGrad,setFirstGrad] = useState("#fff");
const [secondGrad,setSecondGrad] = useState("#fff");


const heartColorHandler = ()=>{
if(heartColor === "#9d9da1")
  {setHeartColor("#fff");
  setFirstGrad("#fd6d57");
  setSecondGrad("#fd9054");
  }
  else{
  setHeartColor("#9d9da1");
  setFirstGrad("#fff");
  setSecondGrad("#fff");

}

}


//fd6d57 fd9054
    return(

        <View style = {styles.barberContainer}>
        <LinearGradient colors={[firstGrad, secondGrad]} style={{flex : 1,justifyContent : "flex-end"}}>
        <View style = {{height : "95%"}}>
        <View style = {{flexDirection : "row",justifyContent : "space-between" , marginLeft : "5%"}}>
        <Ionicons onPress = {()=>{heartColorHandler()}} name="ios-heart" size={24} color={heartColor} />
       


        </View>
        <View style = {{justifyContent :"center",alignItems : "center"}}>
        <Avatar source = {require("../assets/pictures/person1.jpg")}
              containerStyle = {styles.barberPicture}
              rounded
              size= "large"
              />

<Text style = {styles.name}>Snoussi El Hareth</Text>
            <Text style = {styles.info}>Blida - Bab Essebt</Text>
            
            <Rating imageSize={20} 
                    readonly
                   startingValue="3.6"
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
        </LinearGradient>
        {/* <View  style = {styles.barberPictureContainer}>

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
              buttonStyle ={styles.button}
              title = "Profile" 
             
              titleStyle = {{color :"#fff",fontSize : 13}}
              
              />

        </View> */}
    
  </View>
    )



}


const styles= StyleSheet.create({
   
  ////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////
  barberContainer : {
    height :screen.width * 0.6,
    width : screen.width * 0.5,
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

export default FavoriteCard;