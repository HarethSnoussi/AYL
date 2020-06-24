import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import { Button } from 'react-native-paper';
import Colors from "../constants/Colors";

const screen = Dimensions.get('window'); 
const Card = props =>{

let roleStyle = styles.role;
let fonctionsStyle = styles.fonctions;
let buttonLabelStyle = styles.buttonLabel;
let imageContainerStyle = styles.imageContainer;
let containerStyle = styles.container;

if (screen.width < 350) {
    roleStyle = styles.roleSmall ;
    fonctionsStyle = styles.fonctionsSmall;
    buttonLabelStyle = styles.buttonLabelSmall;
    imageContainerStyle = styles.imageContainerSmall;
}

if (screen.height > 800 || screen.width >500 ) {
    containerStyle = styles.containerBig;
    roleStyle = styles.roleBig ;
    fonctionsStyle = styles.fonctionsBig;
    imageContainerStyle = styles.imageContainerBig;
}

    return(
      <View style = {containerStyle}>  

          <View style = {imageContainerStyle}>
              <Image style = {styles.image} source ={props.url} />
            
          </View>

          <View style = {styles.textContainer}>
                <Text style ={roleStyle}>{props.role}</Text>
                
       
           <Text style = {fonctionsStyle}>
               {props.fonctionA}
               </Text>
              

          </View>

          <View style={styles.buttonContainer}>
              <Button 
                  theme={{colors: {primary:Colors.primary}}} 
                  mode={Platform.OS === 'android' ? "contained" : "outlined"}
                  labelStyle={buttonLabelStyle}
                  contentStyle={{width:'100%'}}

                  style={{borderColor:'white' , 
                  borderWidth : 0.5 , 
                  backgroundColor :  "rgba(198, 34, 37, 0.6)",
                  borderRadius : 25
                  
                  }}
                 onPress = {props.onPress}
                  
                >
                  Choisir
                </Button>
            </View>

      </View>

     );    
};


const styles= StyleSheet.create({
    container :{
        borderWidth : 2 ,
        borderColor : "white",
        backgroundColor :  "rgba(52, 52, 52, 0.6)",
        width : screen.width *0.45,
        justifyContent : "space-around"
    },
    containerBig : {
        borderWidth : 2 ,
        borderColor : "white",
        backgroundColor :  "rgba(52, 52, 52, 0.6)",
        width : screen.width *0.45,
        height :450 ,
        justifyContent : "space-around"
    },
/////////////////////////////////////////////////////////////////
    imageContainer : {
        height : 95 ,
        width : 95,
        alignSelf : "center",
        marginTop : 20
    },

    imageContainerSmall : {
        height : 75 ,
        width : 75,
        alignSelf : "center",
        marginTop : 20
    },
    imageContainerBig : {
        height : 138 ,
        width : 138,
        alignSelf : "center",
        marginTop : 20
    },
/////////////////////////////////////////////////////////////////
    image :{
        height : "100%",
        width : "100%"
    },
    textContainer :{
        alignItems : "center",
        marginTop : 25 ,
        marginBottom : 30,
       
    },
///////////////////////////////////////////////////////////////
    role : {
        fontFamily : "poppins-bold",
        color : "white",
        fontSize : 20,
        letterSpacing : 1
    },
    roleSmall : {
        fontFamily : "poppins-bold",
        color : "white",
        fontSize : 15,
        letterSpacing : 1

    },
    roleBig : {
        fontFamily : "poppins-bold",
        color : "white",
        fontSize : 30,
        letterSpacing : 2,
    },
///////////////////////////////////////////////////////////////
    fonctions:{
        fontFamily : "poppins",
        color : "white",
        fontSize : 14
    }, 
    fonctionsSmall : {
        fontFamily : "poppins",
        color : "white",
        fontSize : 11
    },
    fonctionsBig: {
        fontFamily : "poppins",
        color : "white",
        fontSize : 22
    },
///////////////////////////////////////////////////////////////
    buttonContainer:{
      padding: 20,
      alignItems:'center',
      width:'100%',
      
    } ,
///////////////////////////////////////////////////////////////
    buttonLabel : {
        fontSize:16,
        fontFamily:'poppins', 
        color:'white' 
    },
    buttonLabelSmall : {
        fontSize:13,
        fontFamily:'poppins', 
        color:'white'   

    }

   

});

export default Card;