import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , Picker,Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator,TextInput, KeyboardAvoidingView} from 'react-native';
import { Button ,ButtonGroup} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";


 
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepThree = (props)=> {

const [pickedWilaya , setPickedWilaya] = useState();
const [pickedRegion , setRegion] = useState("");
const [pickedAddress,setAddress] = useState("");
//overlay State
const [overlayState , setOverlayState]=useState(false);


const pickedWilayaHandler =  (itemValue)=>{

setPickedWilaya(itemValue);
    };



  //Overlay Handelr
  const overlayHandler = ()=>{
     
    setOverlayState((previous) => !previous);

  }

return (
  

        <View style= {styles.container}>
                 

{ overlayState && <ConfirmBookingOverlay
        isVisible = {overlayState}
        overlayHandler = {overlayHandler}
        bookingDate = {props.navigation.getParam("bookingDate")}
        start = {props.navigation.getParam("start")}
        barberId = {props.navigation.getParam("barberId")}
        clientId = {props.navigation.getParam("clientID")}
        amount = {props.navigation.getParam("amount")}
        duration = {props.navigation.getParam("duration")}
        services = {props.navigation.getParam("services")}
        navigate = {()=>props.navigation.navigate("Client")}
        wilaya = {pickedWilaya}
        address = {pickedAddress}
        region = {pickedRegion}

       />   
    }

                <View style = {styles.firstImage}>

                <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   />

                </View>

                <View style = {styles.bookingInfoContainer}>
                <KeyboardAvoidingView keyboardVerticalOffset={10}>
               
                    <View style = {styles.title}>
                        <Text style = {{fontFamily : "poppins-bold",fontSize : 16}}>
                        Adresse de la réservation
                        </Text>

                    </View>

                <View style = {styles.inputsContainer}>
                

                    <View 
                    style = {{...styles.wilaya,...{borderColor : pickedWilaya === null ? Colors.primary : "grey"}}}
                    
                    >
                            
                    <RNPickerSelect
                        onValueChange={(itemValue) => pickedWilayaHandler(itemValue)}
                        items={[
                            { label: 'Alger', value: 'Alger' },
                            { label: 'Blida', value: 'Blida' },
                            { label: 'Oran', value: 'Oran' },
                        ]}
                        value = {pickedWilaya}
                        placeholder={{
                                label: 'Votre Wilaya ',
                                color : "#7f7d7c",
                                value : null
                            }}
                    />

                    </View>

                    
                    <View style = {styles.region}>
                    <Text style = {styles.label} >Région *</Text>
                    <TextInput
                        style = {styles.regionInput}
                        multiline = {true}
                         numberOfLines={2}
                        onChangeText={text => setRegion(text)}

                        value={pickedRegion}
                        />

                    </View>
                    <View style = {styles.address}>
                    <Text style = {styles.label}>Adresse *</Text>

                    <TextInput
                      style = {{...styles.addressInput,...{borderColor : pickedAddress === "" ? Colors.primary : "grey"}}}

                    onChangeText={text => setAddress(text)}

                    value={pickedAddress}
                    multiline = {true}
                    numberOfLines={4}
                        />
                       
                    </View>
          
                    
                    </View>

                    <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center" }} 
                   title = "Réserver" 
                   titleStyle = {{fontFamily : "poppins-bold"}}
                   buttonStyle = {{borderRadius : 55}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                onPress = {()=> pickedWilaya!== null && pickedRegion !== "" && pickedAddress !== ""&& overlayHandler()}
                
                   />
        </KeyboardAvoidingView>

            </View>
 
                     </View>

)

}

BookStepThree.navigationOptions = ()=> {
    return {
      headerTransparent : true,
      title : "Réserver Un Service" ,
      headerBackTitle : " ",
      headerTintColor: "#fff" 
    }

}


const styles= StyleSheet.create({
   
   container : {
            flex : 1 ,
   },
   firstImage : {
        height :"30%"
   },
  /********************************************************************** */ 
 
   bookingInfoContainer : {
       width : "100%",
       height : "75%",
       backgroundColor : "#fff",
       borderTopLeftRadius : 25,
       borderTopRightRadius : 25,
        position : "absolute",
        top : "25%",
        overflow : "hidden",
        
   },
  /********************************************************************** */ 
   title : {
    alignSelf : "center",
    marginTop : "2%"
   },
   inputsContainer:{
   height : "60%",
   width : "100%" ,
   alignSelf : 'center',
   justifyContent :"space-around",
   alignItems : "center",
   marginVertical : "5%"
},
  /********************************************************************** */ 
    wilaya : {  
    width: "80%", 
    backgroundColor : "#f0f0f0",
    borderRadius : 10,
    // marginLeft : "2%",
    // overflow :"hidden",
    paddingLeft : "2%",
    // borderWidth: 1,
    elevation : 2 ,
        },
     
        region : {
        // height : "30%",
        // marginLeft : "2%",
        // overflow :"hidden",
        justifyContent : "space-around",
        // paddingLeft : "2%",
        width : "80%",
        // backgroundColor : "red"

        },

        address : {
        // height : "30%",
        width : "80%",
        //  marginLeft : "2%",
        // overflow :"hidden",
        justifyContent : "space-around",
        paddingLeft : "2%",
        },
  /********************************************************************** */
  regionInput :{ 
    // borderColor: 'gray', borderWidth: 1,
    elevation : 2 ,
    paddingLeft : 5 ,
    backgroundColor :"white",
    borderRadius : 10,
    // height :"70%",
    backgroundColor : "#f0f0f0",
    width : "100%"
    
    },
  addressInput :{ 
    // borderColor: 'gray', borderWidth: 1,
    backgroundColor :"white",
    borderRadius : 10,
    // height :"60%",
    backgroundColor : "#f0f0f0",
    textAlignVertical: 'top',
    paddingLeft : 5,
    paddingTop : 5,
    width : "100%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,


},

label : {
fontFamily : "poppins"


},
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
 
    });
    /********************************************************************** */ 




export default BookStepThree;