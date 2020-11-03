import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions,Image} from 'react-native'; 
import {Button , Rating} from "react-native-elements";
const screen = Dimensions.get("window");

const TopSalonsCard = (props)=> {


    return(

<View style = {styles.topBarbersCard} >
                      <View style = {styles.cardImage}>
                       <Image source = {{uri:'http://173.212.234.137/assets/tahfifa/barber7.png'}} style = {styles.image}  />
                      </View>

                      <View style= {styles.cardBody}> 
                      <View style = {styles.cardBodyTitle}>
                        <Text style = {styles.salonName}>Tahfifa Saloon</Text>
                        <View style = {{flexDirection :"row",alignItems :"center" , }}>
                       
                        <Rating
                          type='star'
                          ratingCount={1}
                          imageSize={screen.width/24}
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
   textTopBarbers : {
     flexDirection : "row",
     justifyContent : "space-between",
      marginTop : screen.width/14.4,
      marginHorizontal : screen.width/18
   },
   topBarbers : {
    width : "100%",
    height : screen.height * 0.4 
  },
   topBarbersCard : {
      width : screen.width * 0.75 ,
      height : "80%",
      alignSelf : "center",
      borderRadius : screen.width/12,
      overflow : "hidden",
      margin : screen.width * 0.03,
      backgroundColor : "white",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: screen.width/180,
      elevation: 2,
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
      height : "30%",
      alignItems : "center"
   },
  cardBodyInfo : {
      marginHorizontal : "5%",
      height : "30%"
   }, 
   cardBodyButton : {
      alignItems :"flex-end",
      overflow : "hidden",
   },
   button : {
       backgroundColor : "#fd6c57",
       borderTopLeftRadius : screen.width/20,
       width : "30%"
   },
   rating : {
      paddingRight : 7
   },
   salonName : {
     fontSize : screen.width/22.5,
     fontFamily : "poppins-bold",
   },
   address : {
    fontFamily : "poppins",
    color : "#9d9da1",
   }
  
     
  
  });

export default TopSalonsCard;