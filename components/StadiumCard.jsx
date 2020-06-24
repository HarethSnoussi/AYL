import React from 'react';
import { StyleSheet, Text, View,Image,Button, ImageBackground,Dimensions} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";


const screen = Dimensions.get("window");
const StadiumCard = props =>{
  let cardContainerStyle = styles.cardContainer;
  let titleStyle = styles.title;
  let adressStyle = styles.adress;

  if(screen.width > 500 ) {
    cardContainerStyle = styles.cardContainerBig;
    titleStyle = styles.titleBig;
    adressStyle = styles.adressBig;
  }
  

    return(
       
        <ImageBackground
        source = {require("../assets/images/cardback1.jpg")} 
        style = {cardContainerStyle}
        >

        <View style = {styles.imageContainer}>
            <Image source = {require("../assets/images/imagefive.jpg")} style = {styles.image}  />

        </View>
         
            <View style={styles.textContainer}>
            
            <View>
                <Text style = {titleStyle}>
                {props.name}
                </Text>

                <Text style = {adressStyle}>
                {props.adress}
                </Text>
             </View>
      
            <View style = {styles.buttonContainer}>
                    <Button 
                    title = "Choisir" 
                    color ={Colors.secondary}
                    onPress = {props.onPress}
                    
                    />

            </View>

          

        </View>

        <View style = {styles.info}>

        <Ionicons 
        name = "md-information-circle" 
        size = {25}
         color = {Colors.secondary} 
         onPress = {props.openOverlay}

         />
        </View>
      
    </ImageBackground>



     );    
};


const styles= StyleSheet.create({
 ///////////////////////////////////////////////////////////   
    cardContainer : {
        width : "100%" ,
        height : 120,
        flexDirection : "row",
        justifyContent : "space-around",
        overflow : "hidden",
        alignSelf : "center",
        marginBottom : 12,
        borderRadius : 10,
        borderWidth : 2,
        
    
    },
    cardContainerBig : {
        width : "100%" ,
        height : 180,
        flexDirection : "row",
        justifyContent : "space-around",
        overflow : "hidden",
        alignSelf : "center",
        marginBottom : 12,
        borderRadius : 10,
        borderWidth : 2,

    },
 ///////////////////////////////////////////////////////////
    imageContainer : {
            width : "25%",
            height : "85%",      
            alignSelf : "center",
            borderRadius :22,
            overflow : "hidden"

    },

    image : {
            height : "100%",
            width : "100%",
           

    },
    textContainer : {
            width : "55%",
            overflow : "hidden",
            justifyContent : "space-around",
            alignItems : "center"
    },
   /////////////////////////////////////////////////////////
    title : {
        alignSelf : "center",
        fontFamily : "poppins-bold",
        letterSpacing : 1,
        color : "black",
        
        
    },

    titleBig : {
        alignSelf : "center",
        fontFamily : "poppins-bold",
        letterSpacing : 1,
        color : "black",
        fontSize : 22
    },

/////////////////////////////////////////////////////////
    adress : {
           alignSelf : "center",
           fontSize : 12,
           color : "black"
    },
    adressBig : {
        alignSelf : "center",
        fontSize : 12,
        color : "black",
        fontSize : 20

    },
/////////////////////////////////////////////////////////
    info : {
        alignSelf : "flex-start"
    },
    buttonContainer : {
            width : "50%",
    }
   

});

export default StadiumCard;