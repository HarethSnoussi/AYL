import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TouchableOpacity, StatusBar,TouchableWithoutFeedback} from 'react-native';
import Colors from "../constants/Colors";
import { Button ,Overlay} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
const screen = Dimensions.get("window");

const ConfirmOverlay = props =>{


        return (
            <TouchableWithoutFeedback   onPress = {props.close}>
        <Overlay 
       onBackdropPress = {props.close}
        isVisible={props.isVisible}
        overlayStyle = {{width :"80%",height :"50%",backgroundColor:"#fff",borderRadius:screen.width/24,overflow:"hidden",marginBottom:"40%",elevation:2,padding:0}}
        
        
        >
    <View style = {{width:"100%",height:"100%",justifyContent:"space-between"}}>
                        <View style =  {{height :"60%",marginTop :screen.width/24,justifyContent:"space-around"}}>
                                    <View style = {{height:"40%",justifyContent:"center",alignItems:"center"}}>
                                    <Image
                                            style={{height:"100%",width:"100%",resizeMode:"contain"}}
                                            source={{uri:'http://173.212.234.137/assets/tahfifa/false.png'}}
                                        />
                                    </View>

                                    <View style = {{justifyContent:"center",alignItems:"center",height :"30%"}}>
                                        <Text style = {{fontSize : screen.width / 24,fontFamily :"poppins-bold",color:Colors.blue}} >Annuler</Text>
                                        <Text style = {{fontSize : screen.width / 30,fontFamily :"poppins-bold",color:Colors.textGrey}}>Voulez-vous vraiment annuler</Text>
                                        <Text style = {{fontSize : screen.width / 30,fontFamily :"poppins-bold",color:Colors.textGrey}}>cette réservation?</Text>

                                    </View>
                    </View>


                    <View style = {{height:"30%",flexDirection:"row",justifyContent:"space-around",alignItems:"center",alignSelf:"center",width:"100%",}}>

                    <Button  
                // title ={props.buttonTitle} 
                title = "Oui"
                buttonStyle = {{backgroundColor : Colors.primary,paddingHorizontal : "5%",alignSelf:"center",width:"80%",borderRadius :screen.width/24}}
                titleStyle = {{color :"#fff",fontSize :screen.width/30}}
                onPress = {props.cancel}
                />

            <Button  
                // title ={props.buttonTitle} 
                title = "Non"
                buttonStyle = {{backgroundColor : "#fff",paddingHorizontal : "5%",alignSelf:"center",width:"80%",borderRadius :screen.width/24,elevation:2}}
                titleStyle = {{color :Colors.primary,fontSize :screen.width/30}}
                onPress = {props.close}
                />
                    </View>
                    </View>
          </Overlay>
          </TouchableWithoutFeedback>
          
          );
    
    };
    
    
    const styles= StyleSheet.create({
    
      overlayStyle:{
        width : "100%",
        height :"100%",
        // borderRadius : 20,
        backgroundColor : "rgba(255, 255, 255,0.2)",
        justifyContent:"center",
        alignItems :"center"

        
    
      },
      title : {
        alignSelf : "center"
      },
    
      textsContainer: {
        height : "75%",
        justifyContent : "space-around",
       overflow : "hidden",
    
       },
      text :{
        // marginBottom : 3,
        fontFamily : "poppins",
     fontSize : screen.width / 30
    
      },
      priceText:{
        fontFamily : "poppins-bold",
        fontSize : screen.width / 18,
        color: Colors.blue,
       
    
      },
      timeText:{
        fontFamily : "poppins-bold",
        fontSize : screen.width / 30,
        color: "#9d9da1",
      
    
      },
    
    
      confirm:{
        alignItems :"center",
        justifyContent : "space-around",
       
        },
        iconsContainer:{
        flexDirection : "row" ,
       
        width : "40%",
        justifyContent : "space-between",
        marginTop : screen.width/72
        },
    
        centered: {
          flex:1,
          alignItems:'center',
          justifyContent:'center',
          width:'100%',
          height:'100%',
          resizeMode:'cover'
        }
    
    });


export default ConfirmOverlay ;