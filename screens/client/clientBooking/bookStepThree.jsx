import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , Picker,Image, Dimensions , ActivityIndicator,TextInput, KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard} from 'react-native';
import { Button ,Avatar,Rating} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";
import BarberInfos from '../../../components/BarberInfos';
import SentOverlay from '../../../components/SentOverlay';


 
const screen = Dimensions.get("window");
moment.locale("fr");   

/////////////////////////////////////////////////////////////////////////
const BookStepThree = (props)=> {
// OVerlay after booking Sent
const [sentVisible,setSentVisible] = useState(false);

const [pickedWilaya , setPickedWilaya] = useState();
const [pickedRegion , setRegion] = useState("");
const [pickedAddress,setAddress] = useState("");
//overlay State
const [overlayState , setOverlayState]=useState(false);
const [stepThreeCpt,setStepThree] = useState(props.navigation.getParam("overCpt"));
const [keyboardState,setKeyboardState]= useState (false);
const pickedWilayaHandler =  (itemValue)=>{

setPickedWilaya(itemValue);
    };



  //Overlay Handelr
  const overlayHandler = ()=>{
     
    setOverlayState((previous) => !previous);

  }

 //Overlay Handelr
 const sentOverlayHandler = ()=>{
     
 setSentVisible((previous) => !previous);

}

const goBack = ()=>{
  props.navigation.goBack();

};

const stepThreeHandler = ()=>{

setStepThree(previous => previous+1);

};

// KEYBOARD

useEffect(() => {
  Keyboard.addListener("keyboardDidShow", keyboardDidShow);
  Keyboard.addListener("keyboardDidHide", keyboardDidHide);

  // cleanup function
  return () => {
    Keyboard.removeListener("keyboardDidShow", keyboardDidShow);
    Keyboard.removeListener("keyboardDidHide", keyboardDidHide);
  };
}, []);

const keyboardDidShow = () => {
  setKeyboardState(true);
};

const keyboardDidHide = () => {
  setKeyboardState(false);
};





return (
  <TouchableWithoutFeedback onPress = {()=>{Keyboard.dismiss()}}>
        <View style= {styles.container}>  
        <SentOverlay 
        isVisible = {sentVisible} 
        sentOverlayHandler = {sentOverlayHandler}
        goBack = {goBack}
          buttonColor = "#F26052"
          title = "Echec !"
          body = "Echec lors de l'envoie de la réservation"
          buttonTitle = "Fermer"
          overlayType ="echec"
          
         />
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
        navigate = {()=>props.navigation.navigate("Client",{stepThreeCpt:stepThreeCpt})}
        wilaya = {pickedWilaya}
        address = {pickedAddress.replace(/(\r\n|\n|\r)/gm, "")}
        region = {pickedRegion}
        sentOverlayHandler = {sentOverlayHandler}
        
       />   
    }

                <View style = {styles.firstImage}>
                {/* <SentOverlay 
          isVisible = {sentVisible} 
          sentOverlayHandler = {sentOverlayHandler}
          
          /> */}
              
                {/* <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   /> */}
                <BarberInfos 
                  name = {props.navigation.getParam("name")}
                  surname = {props.navigation.getParam("surname")}
                  wilaya = {props.navigation.getParam("wilaya")}
                  region = {props.navigation.getParam("region")}
                  mark = {props.navigation.getParam("mark")}
               />
                </View>

                <View style = {{  width : "100%",
                    height : "75%",
                    backgroundColor : "#fff",
                    borderTopLeftRadius : keyboardState ? 0 :screen.width/14.4,
                    borderTopRightRadius : keyboardState ? 0 : screen.width/14.4,
                    position : "absolute",
                    top : keyboardState ? 0:"25%",
                    overflow : "hidden",}}>
                <KeyboardAvoidingView  keyboardVerticalOffset={10}>
               
                    <View style = {styles.title}>
                        <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/26,color:Colors.blue}}>
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
                            { label: 'Alger', value: 'Alger'},
                            { label: 'Blida', value: 'Blida' },
                            { label: 'Oran', value: 'Oran' },
                        ]}
                        value = {pickedWilaya}
                        placeholder={{
                                label: 'Votre Wilaya ',
                                color : "#7f7d7c",
                                value : null
                            }}
                            style = {{inputAndroid: {
                                          fontSize: screen.width/22.5,
                                          paddingHorizontal: screen.width/36,
                                          paddingVertical: screen.width/45,
                                          borderWidth: 0.5,
                                          borderColor: 'purple',
                                          borderRadius: screen.width/45,
                                          color: 'black',
                                          
                                        }}}
                    
                    />
 
                    </View>

                    
                    <View style = {styles.region}>
                    {/* <Text style = {styles.label} >Région *</Text> */}
                    <TextInput
                        style = {styles.regionInput}
                        multiline = {false}
                         numberOfLines={2}
                        onChangeText={text => setRegion(text)}
                        placeholder = "Région"
                        value={pickedRegion}
                        />

                    </View>
                 
                    <View style = {styles.address}>
                    {/* <View style = {{height :"20%"}}>
                    <Text style = {styles.label}>Adresse *</Text>
</View> */}
                    <TextInput
                      style = {{...styles.addressInput,...{borderColor : pickedAddress === "" ? Colors.primary : "grey"}}}

                    onChangeText={text => setAddress(text)}

                    value={pickedAddress}
                    multiline = {true}
                    numberOfLines={4}
                   
                    placeholder = "Adresse de la réservation"
                        />
                       
                    </View>
                   
                    
                    </View>

                    <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center" }} 
                   title = "Réserver" 
                   titleStyle = {{fontFamily : "poppins-bold",fontSize : screen.width/26}}
                   buttonStyle = {{borderRadius : Platform.OS === "android" ? screen.width/6.5 : screen.width/18}} 
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
                     </TouchableWithoutFeedback>

)

}

BookStepThree.navigationOptions = ()=> {
    return {
      headerTransparent : true,
      title : "" ,
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
       borderTopLeftRadius : screen.width/14.4,
       borderTopRightRadius : screen.width/14.4,
        position : "absolute",
        top : "25%",
        overflow : "hidden",
        
   },
  /********************************************************************** */ 
   title : {
    alignSelf : "center",
    marginTop : "3%"
   },
   inputsContainer:{
   height : "60%",
   width : "100%" ,
   alignSelf : 'center',
   justifyContent :"space-around",
   alignItems : "center",
   marginTop : "15%"
},
  /********************************************************************** */ 
    wilaya : {  
    width: "80%", 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: screen.width/180,
      elevation: 2,
      backgroundColor : "#f0f0f0",
      borderRadius : screen.width/36,
      paddingLeft : "2%",
      elevation : 2 ,
      height : "15%",
      justifyContent :"center",
      paddingLeft : screen.width/24,
   },
     
    region : {
      height : "30%",
      justifyContent : "space-around",
      width : "80%",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: screen.width/180,
      elevation: 2,
      overflow:'visible'
    },

    address : {
      height : "50%",
      width : "80%",
      justifyContent : "space-around",
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: screen.width/180,
      elevation: 2,
      overflow:'visible'
    },
  /********************************************************************** */
  regionInput :{ 
    paddingLeft : screen.width/24,
    backgroundColor :"white",
    borderRadius : screen.width/36,
    height :"60%",
    backgroundColor : "#f0f0f0",
    width : "100%",
    
    
    },
  addressInput :{ 
    // borderColor: 'gray', borderWidth: 1,
    backgroundColor :"white",
    borderRadius : screen.width/36,
    height :"80%",
    backgroundColor : "#f0f0f0",
    textAlignVertical: 'top',
    paddingLeft : screen.width/24,
    paddingTop : screen.width/24,
    width : "100%",

},

label : {
fontFamily : "poppins",
fontSize : screen.width /30
},
barberName :{
  fontFamily : "poppins-bold",
  fontSize : screen.width/24,
  color :"#fff"
},
barberAdress : {
  fontFamily : "poppins",
   color : "#fff",

  fontSize : screen.width/30,

},

/**************************************************** */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
 
    });
    /********************************************************************** */ 




export default BookStepThree;