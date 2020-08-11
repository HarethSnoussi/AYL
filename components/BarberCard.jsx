import React from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions} from 'react-native';
import { Button , Rating} from 'react-native-elements';

import {Ionicons} from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';
import Colors from "../constants/Colors";


const screen = Dimensions.get("window");
const BarberCard = props =>{
  let cardContainerStyle = styles.cardContainer;
  let titleStyle = styles.title;
  let adressStyle = styles.adress;

  // if(screen.width > 500 ) {
  //   cardContainerStyle = styles.cardContainerBig;
  //   titleStyle = styles.titleBig;
  //   adressStyle = styles.adressBig;
  // }
  

    return(
       
        <View style = {styles.cardContainer}>
        <View style = {styles.cardImage}>
        <Image source = {require("../assets/pictures/barber7.png")} style = {styles.image}  />

        </View>

        <View style = {styles.cardText}>

        <View>
              <View style= {styles.name}>
                <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/26}} >{props.name + " " + props.surname}</Text>
                {/* <View style = {{flexDirection : "row"}}>
             
                <EvilIcons name="location" size={24} color="#9d9da1" />
                <Text style = {{fontFamily : "poppins", color : "#9d9da1"}}>3.5 km</Text>
                </View> */}
              </View>
              <Text style = {{fontFamily : "poppins", color : "#9d9da1",fontSize : screen.width/28}} >
              {props.region + "-" + props.wilaya}
              </Text>
       </View>

              <View style= {styles.extra}>
              <View  style= {styles.extraHours}>
              <View style = {{flexDirection : "row"}}>
            
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
                    <Text style={{fontFamily : "poppins",fontSize : screen.width/30}}>3.2</Text>
                  </View>
              <Text style ={{color : "#fd6c57",fontFamily : "poppins-bold",letterSpacing : 1,fontSize : screen.width/30}}>Voir le profil </Text>
               
                </View>
               
                <Button  
                title ="Réserver" 
                buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : 25,paddingHorizontal : "5%"}}
                titleStyle = {{color :"#fff",fontSize :screen.width/30}}
                onPress = {props.navigate}
                />
              
              </View>

          
          </View>

    </View>


     );    
};


const styles= StyleSheet.create({
    container : {
            flex: 1 ,
            justifyContent : "flex-end",
          backgroundColor : "#fff"

    },

    searchBar :{
      width : "80%" , 
      alignSelf : "center",
      borderRadius : 20 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginBottom : 15 ,
      borderTopWidth : 0 , 
      borderBottomWidth : 0 
      },
      firstImage : {
        width : screen.width,
        height : screen.height * 0.20 ,
        overflow : "hidden",
      } ,
    
///////////////////////////////////////////////////////
cardContainer : {
  width : "97%",
  backgroundColor : "#fff",
  height : screen.height * 0.18,
  flexDirection : "row",
  justifyContent : "space-around",
  borderBottomWidth : 0.4,
  overflow : "hidden",
  alignSelf : "flex-end",
    
},
cardImage : {
    width : "30%",
    height : "80%",
    alignSelf : "center",
    overflow : "hidden",
  
    
},
image : {
  height : "100%",
  width : "100%",
   borderRadius : 25,
   resizeMode : "cover"
  

},
cardText : {

    width : "60%",
    height : "100%",
    alignSelf : "center",
    justifyContent : "space-around",
    overflow : "hidden",
 

},
name : {
    flexDirection : "row",
    justifyContent : "space-between",
    

},
extra : {
  flexDirection : "row",
  justifyContent : "space-between",


},
extraHours : {

 

},
extraButton : {
overflow : "hidden",
borderRadius : 25,


},
rating :{
backgroundColor : "red",
alignSelf : "flex-start",
marginRight : 7

}

    
   

});


export default BarberCard;