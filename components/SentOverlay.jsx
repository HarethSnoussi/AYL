import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TouchableOpacity} from 'react-native';
import Colors from "../constants/Colors";
import { Button ,Overlay} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
const screen = Dimensions.get("window");
const SentOverlay = props =>{

    const url = props.overlayType === "success" ? require("../assets/pictures/true.png") : require("../assets/pictures/false.png");

const colors =  props.overlayType ==="echec" ? ['#fd6d57', '#fd9054'] : ['#0DA598', '#11998e']  ;;

    return( 
    <Overlay onBackdropPress = {props.sentOverlayHandler}  isVisible = {props.isVisible} overlayStyle = {styles.overlayStyle}>
    <View style = {styles.container}>
            <View style = {{height : "30%",justifyContent:"center",alignItems:"center",marginTop :"5%"}}>
                     <Image
                        style={{height:"100%",width:"100%",resizeMode:"contain"}}
                        source={url}
                    />
                
            </View>    

            <View style = {{height:"60%", justifyContent :"space-around",width :"95%",alignSelf:"center",}}>
            <View style = {{alignItems :"center"}}>
                <Text style = {{fontSize : screen.width / 14,fontFamily :"poppins-bold",color:Colors.blue}}>{props.title}</Text>
                 <Text style = {{fontSize : screen.width / 32,fontFamily :"poppins-bold",color:Colors.textGrey}}>{props.body}</Text>
            </View>
           

            <Button  
                title ={props.buttonTitle} 
                buttonStyle = {{borderRadius : 25,paddingHorizontal : "5%",width:"80%",alignSelf:"center"}}
                titleStyle = {{color :"#fff",fontSize :screen.width/30}}
                onPress = { props.overlayType === "success" ? props.sentOverlayHandler : props.goBack}
                ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: colors,
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />

            </View>  
            </View>
        </Overlay>

     );    
};


const styles= StyleSheet.create({

    overlayStyle:{
        height:"50%",
        marginBottom:"40%",
        borderRadius :25,
        padding:0,
        
        justifyContent :"center"

},
container : {
height:"100%",

borderRadius : 25

}

});


export default SentOverlay;