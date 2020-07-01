import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {Platform,AsyncStorage} from 'react-native';
import Colors from '../constants/Colors';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs"

import LoginScreen from '../screens/loginScreen';
import ProfileChoiceScreen from '../screens/profileChoiceScreen';
import SignupScreen from '../screens/player/signupScreen';
import SignupOwnerScreen from '../screens/owner/signupOwnerScreen';
import OwnerServiceScreen from '../screens/owner/ownerBooking/ownerServiceScreen';
import EditServiceScreen from '../screens/owner/ownerBooking/editServiceScreen';
import OwnerBookingsScreen from '../screens/owner/ownerBooking/ownerBookingsScreen';
import OwnerBookingsDetailScreen from '../screens/owner/ownerBooking/ownerBookingsDetailScreen';
import OwnerSupportScreen from '../screens/owner/ownerProfile/ownerSupportScreen';
import OwnerProfileScreen from '../screens/owner/ownerProfile/ownerProfileScreen';
import OwnerGaleryScreen from '../screens/owner/ownerProfile/ownerGaleryScreen';
import OwnerProfileChoiceScreen from '../screens/home/ownerProfileChoiceScreen';
import OwnerSettingsScreen from '../screens/owner/ownerProfile/ownerSettingsScreen';

import PlayerBookingsScreen from "../screens/player/playerBooking/playerBookingsScreen";


import {Ionicons,  MaterialIcons} from "@expo/vector-icons";
import ClientHomeScreen from '../screens/home/clientHomeScreen';
import OwnerHomeScreen from '../screens/home/ownerHomeScreen';
import stadiumChoiceScreen from "../screens/player/playerBooking/stadiumChoiceScreen";
import stadiumBookingScreen from "../screens/player/playerBooking/stadiumBookingScreen";
import PlayerExpiredBookingsScreen from '../screens/player/playerBooking/playerExpiredBookingsScreen';
import PlayerProfileScreen from "../screens/player/playerProfile/playerProfileScreen";
import ForgotPasswordScreen from "../screens/forgotPasswordScreen";
import PlayerProfileChoiceScreen from '../screens/home/playerProfileChoiceScreen';
import PlayerSettingsScreen from '../screens/player/playerProfile/playerSettingsScreen';
import StartupScreen from "../screens/startupScreen";
import StadiumChoiceScreen from '../screens/player/playerBooking/stadiumChoiceScreen';


///////////////////////////////////////////////////////////////////
//Tab Navigator For Player Bookings Screen
const tabConfig = {
  Réservations : {
          screen : PlayerBookingsScreen ,
          navigationOptions : {
            tabBarLabel : "Mes Réservations" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : () => {
              return( <Ionicons name = "ios-calendar" 
              size = {22} color ="white"/>);
                },
        
        }
          
  } ,
  Expirés : {
          screen : PlayerExpiredBookingsScreen,
          navigationOptions : {
            
            tabBarLabel : "Expirées" ,
            tabBarColor : "rgba(198, 34, 37, 1)" ,
            tabBarIcon : () => {
              return( <MaterialIcons name = "history" 
              size = {22} color ="white"/>);
                }
        } 

  } 


}



const PlayerBookingsTab = createMaterialBottomTabNavigator(tabConfig, 
      
{
  navigationOptions : {
    title :"Mes Réservations",
    headerBackTitle : " " ,
    headerTintColor: Platform.OS === "android"? '#fff' : "rgba(53, 53, 53,1)" ,
    headerStyle:{
      backgroundColor:Platform.OS === "android" ?  "rgba(53, 53, 53,0.95)" : "white"
  },
  } ,
activeColor: '#f0edf6',
shifting : true ,
labeled  : true

} ) ;


//Tab Navigator For Client Home
const homeConfig = {
  Accueil : {
          screen : ClientHomeScreen ,
          navigationOptions : {
            tabBarLabel : "Accueil" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : () => {
              return( <Ionicons name = "ios-home" 
              size = {22} color ="white"/>);
                },  
        },
       

          
  } ,
  Profile : {
          screen : PlayerProfileChoiceScreen,
          navigationOptions : {
            
            tabBarLabel : "Profile" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : () => {
              return( <MaterialIcons name = "face" 
              size = {22} color ="white"/>);
                }
              }} ,

   NearMe : {
          screen : StadiumChoiceScreen,
          navigationOptions : {
            
            tabBarLabel : "Expirées" ,
            tabBarColor : Colors.secondary ,

            tabBarIcon : () => {
              return( <MaterialIcons name = "location-on" 
              size = {22} color ="white"/>);
                }
        } ,

  } ,

  
  Réservations : {
    screen : PlayerBookingsTab,
    navigationOptions : {
      
      tabBarLabel : "Expirées" ,
      tabBarColor : Colors.secondary ,

      tabBarIcon : () => {
        return( <MaterialIcons name = "history" 
        size = {22} color ="white"/>);
          },
       
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
activeColor: '#f0edf6',
shifting : true ,
labeled  : true,


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
const FootNavigation = createStackNavigator({
   
   Client : {
     screen : clientHomeTabs
   }, 
   Owner : OwnerHomeScreen,
   Stadiums :  stadiumChoiceScreen ,
   StadiumBooking : stadiumBookingScreen ,
   OwnerService : OwnerServiceScreen,
   EditService: EditServiceScreen,
   OwnerBookings: OwnerBookingsScreen,
   OwnerBookingsDetail: OwnerBookingsDetailScreen,
   OwnerSupport: OwnerSupportScreen,
   OwnerProfile: OwnerProfileScreen,
   PlayerBookings :{ 
     screen : PlayerBookingsTab 
    
    },
   OwnerSupport: OwnerSupportScreen,
   PlayerProfileScreen: PlayerProfileScreen,
   OwnerGalery: OwnerGaleryScreen,
   OwnerProfileChoice: OwnerProfileChoiceScreen,
   PlayerProfileChoice: PlayerProfileChoiceScreen,
   OwnerSettings:OwnerSettingsScreen,
   PlayerSettings:PlayerSettingsScreen
},
);


 const AuthNavigation = createStackNavigator({
  Login: LoginScreen,
  Role : ProfileChoiceScreen,
  Signup: SignupScreen,
  SignupOwner:SignupOwnerScreen,
  ForgotPassword:ForgotPasswordScreen
 });

const MainNavigation = createSwitchNavigator({
  Startup:StartupScreen,
  Auth: AuthNavigation,
  Main: FootNavigation
})


export default createAppContainer(MainNavigation);
