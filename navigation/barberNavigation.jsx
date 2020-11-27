import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {Platform} from 'react-native';
import Colors from '../constants/Colors';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs"


import {Ionicons,  MaterialIcons,Foundation} from "@expo/vector-icons";
import ClientHomeScreen from '../screens/home/clientHomeScreen';



// import PlayerProfileScreen from "../screens/player/playerProfile/playerProfileScreen";
// import ForgotPasswordScreen from "../screens/forgotPasswordScreen";
import EditPasswordScreen from '../screens/editPasswordScreen';
import WelcomeScreen from '../screens/welcomeScreen';
import LoginScreen from '../screens/loginScreen';
import SignupScreen from '../screens/client/signupScreen';
import StartupScreen from '../screens/startupScreen';
import PlayerProfileScreen from '../screens/client/playerProfile/playerProfileScreen';
import PlayerSettingsScreen from '../screens/client/playerProfile/playerSettingsScreen';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';
// import StartupScreen from "../screens/startupScreen";
import AllBarbersScreen from '../screens/client/clientBooking/allBarbersScreen';
import BookStepTwo from '../screens/client/clientBooking/bookStepTwo';
import BookStepOne from '../screens/client/clientBooking/bookStepOne';
import BookStepThree from '../screens/client/clientBooking/bookStepThree';
import BarberHomeScreen from '../screens/barber/barberHomeScreen';
import AllBookingsScreen from '../screens/client/clientBooking/allBookingsScreen';
import BarberHistory from '../screens/client/history/barbersHistory';
import BarberServiceScreen from '../screens/barber/barberServiceScreen';

import BookingDetail from '../screens/client/clientBooking/bookingDetail';
import { GET_BARBERS } from '../store/actions/listActions';
import { useSelector } from 'react-redux';
import { getClientBookings } from '../store/actions/bookingsActions';
import NumConfirmed from '../components/NumConfirmed';
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
          screen : BarberHistory,
          navigationOptions : {
            tabBarLabel : "Historique" ,
            tabBarColor : Colors.secondary ,
            tabBarIcon : ({tintColor}) => {
          
              return( <MaterialIcons name = "history" 
              size = {22} color={tintColor}/>);
                }
        } ,

  } ,

  
  Réservations : {
    screen : AllBookingsScreen,
    navigationOptions : {
  
      tabBarLabel : "Réservations" ,
      tabBarColor : Colors.secondary ,
      
      tabBarIcon :  ({tintColor}) =>  {
      
        return( <NumConfirmed color = {tintColor} />);
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




///////////////////////////////////////////////////////////////////

//Main Stack Navigator
const BarberNavigation = createStackNavigator({
   Client : {
     screen : clientHomeTabs
   }, 
   AllBarbers :  AllBarbersScreen ,
   AllBookingsScreen : AllBookingsScreen ,
   BookStepTwo : BookStepTwo ,
   BookStepOne : BookStepOne ,
   BookStepThree : BookStepThree ,
   BookingDetail : BookingDetail,
   PlayerProfile: PlayerProfileScreen,
   PlayerSettings:PlayerSettingsScreen,
   Barber:BarberHomeScreen,
   BarberService:BarberServiceScreen
},
);


const AuthNavigation = createStackNavigator({
Welcome:WelcomeScreen,
Login: LoginScreen,
Signup: SignupScreen,
ForgotPassword: ForgotPasswordScreen,
EditPassword:EditPasswordScreen
});

const MainNavigation = createSwitchNavigator({
  Startup:StartupScreen,
  Auth: AuthNavigation,
  Main: BarberNavigation
})


export default createAppContainer(MainNavigation);
