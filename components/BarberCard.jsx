import React from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TouchableOpacity} from 'react-native';
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
       
        <TouchableOpacity  onPress={props.navigateToBarberProfil} style = {styles.cardContainer}>
        <View style = {styles.cardImage}>
       <Image source={{uri:`http://95.111.243.233/profileImages/barber/${props.image}`}} style={styles.image} />
              

        </View>

        <View style = {styles.cardText}>

        <View>
              <View style= {styles.name}>
                <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/26,color:Colors.blue}} >{props.name + " " + props.surname}</Text>
                {/* <View style = {{flexDirection : "row"}}>
             
                <EvilIcons name="location" size={24} color="#9d9da1" />
                <Text style = {{fontFamily : "poppins", color : "#9d9da1"}}>3.5 km</Text>
                </View> */}

                <View style = {{flexDirection : "row"}}>
             <Text style={{fontFamily : "poppins",fontSize : screen.width/30}}>{props.mark === null ? 2.5 : props.mark}</Text>
            <Rating
              type='star'
              ratingCount={1}
              imageSize={screen.width/24}
              startingValue = {1}
              style = {styles.rating}
              ratingColor = "#FE9654"          
              type='custom'
              readonly = {true}
              tintColor='#fff'
                />
                 
                </View>


                
              </View>
              <Text style = {{fontFamily : "poppins", color : "#9d9da1",fontSize : screen.width/28}} >
              {props.region + "-" + props.wilaya}
              </Text>
       </View>

              <View style= {styles.extra}>
              <View  style= {styles.extraHours}>
            
             
              
               
                </View>
               
                <Button  
                title ="Réserver" 
                buttonStyle = {{borderRadius : screen.width/65,paddingHorizontal : "5%"}}
                titleStyle = {{color :"#fff",fontSize :screen.width/30}}
                onPress = {props.navigate}
                containerStyle = {{width : "40%"}}
                linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                />
              
              </View>

          
          </View>

    </TouchableOpacity>


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
      borderRadius : screen.width/18 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginBottom : screen.width/24 ,
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
  width : "100%",
  
  height : screen.height * 0.178,
  flexDirection : "row",
  justifyContent : "space-around",
  borderBottomWidth : 0.4,
  overflow : "hidden",
  alignSelf : "flex-end",
  marginBottom : screen.width/180,
  
    
},
cardImage : {
    width : "28%",
    height : "80%",
    alignSelf : "center",
    overflow : "hidden",
  
    
},
image : {
  height : "100%",
  width : "100%",
   borderRadius : screen.width/14.4,
  

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
borderRadius : screen.width/14.4,


},
rating :{
backgroundColor : "red",
alignSelf : "flex-start",
marginHorizontal : screen.width/51.4

}

    
   

});


export default BarberCard;