import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {Platform,AsyncStorage} from 'react-native';
import Colors from '../constants/Colors';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs"


import {Ionicons,  MaterialIcons} from "@expo/vector-icons";
import ClientHomeScreen from '../screens/home/clientHomeScreen';

import stadiumBookingScreen from "../screens/player/playerBooking/stadiumBookingScreen";

// import PlayerProfileScreen from "../screens/player/playerProfile/playerProfileScreen";
// import ForgotPasswordScreen from "../screens/forgotPasswordScreen";

import LoginScreen from '../screens/loginScreen';
import SignupScreen from '../screens/player/signupScreen';
import StartupScreen from '../screens/startupScreen';
import PlayerProfileScreen from '../screens/player/playerProfile/playerProfileScreen';
// import StartupScreen from "../screens/startupScreen";
import AllBarbersScreen from '../screens/player/playerBooking/allBarbersScreen';
import BookStepTwo from '../screens/player/playerBooking/bookStepTwo';
import BookStepOne from '../screens/player/playerBooking/bookStepOne';
import AllBookingsScreen from '../screens/player/playerBooking/allBookingsScreen';
import BookingDetail from '../screens/player/playerBooking/bookingDetail';
///////////////////////////////////////////////////////////////////

//Tab Navigator For Client Home
const homeConfig = {
  Accueil : {
          screen : ClientHomeScreen ,
          navigationOptions : {
            tabBarLabel : "Accueil" ,
            tabBarColor : "#fff",
            tabBarIcon : ({tintColor}) => {
              return( <Ionicons name = "ios-home" 
              size = {22} color ={tintColor}/>);
                },  
        },
       

          
  } ,
  Profile : {
          screen : PlayerProfileScreen,
          navigationOptions : {
            
            tabBarLabel : "Profile" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : ({tintColor}) => {
              return( <MaterialIcons name = "face" 
              size = {22} color ={tintColor}/>);
                }
              }} ,

   NearMe : {
          screen : AllBarbersScreen,
          navigationOptions : {
            tabBarLabel : "Coiffeurs" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : ({tintColor}) => {
          
              return( <MaterialIcons name = "location-on" 
              size = {22} color={tintColor}/>);
                }
        } ,

  } ,

  
  Réservations : {
    screen : AllBookingsScreen,
    navigationOptions : {
  
      tabBarLabel : "Réservations" ,
      tabBarColor : Colors.secondary ,
     
      tabBarIcon : ({tintColor}) => {
        return( <MaterialIcons name = "history" 
        size = {22} color={tintColor} />);
          },
          headerStyle:{
            backgroundColor: "red",
        },
        headerTransparent: false
  } ,

  }
};


//Home page with Bottom Navigation Tab

const clientHomeTabs = createMaterialBottomTabNavigator(homeConfig, 
      
{
  navigationOptions : {
    title :"",
    headerBackTitle : " " ,
    headerTintColor: Platform.OS === "android"? '#fff' : "rgba(53, 53, 53,1)" ,
    headerStyle:{
      backgroundColor: "transparent",
  },
  headerTransparent: true
  } ,
activeColor: '#fd6c57',
inactiveColor : "#9d9da1",
shifting : false ,
labeled  : true,
barStyle : {
 borderTopWidth : 0.5 ,
 backgroundColor : '#fff'

},



} ) ;



/*const gender=async()=>{
  const userData= await AsyncStorage.getItem('userData');
 
  if(!userData){
      return;
  }
  const transformedData = JSON.parse(userData); // transform string to Javascript Object or Array
  const {token,userID,expiryDate,gender} = transformedData;
  const expirationDate = new Date(expiryDate);
  
  if(!token || !userID || expirationDate <= new Date()){
   return;
  }
   
  if(gender==="Player"){
   return PlayerHomeScreen;
  }else if(gender==="Owner"){
   return OwnerHomeScreen;
  }
};*/
///////////////////////////////////////////////////////////////////

//Main Stack Navigator
const BarberNavigation = createStackNavigator({
   
   Client : {
     screen : clientHomeTabs
   }, 

   AllBarbers :  AllBarbersScreen ,
   StadiumBooking : stadiumBookingScreen ,
   BookStepTwo : BookStepTwo ,
   BookStepOne : BookStepOne ,

   BookingDetail : BookingDetail,

  PlayerProfileScreen: PlayerProfileScreen
},
);


const AuthNavigation = createStackNavigator({
Login: LoginScreen,
Signup: SignupScreen,
});

const MainNavigation = createSwitchNavigator({
  Startup:StartupScreen,
  Auth: AuthNavigation,
  Main: BarberNavigation
})


export default createAppContainer(MainNavigation);
