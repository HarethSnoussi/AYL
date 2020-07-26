import React, {useState} from 'react';
import {createStore,combineReducers,applyMiddleware} from 'redux';
import ReduxThunk from "redux-thunk";

import {Provider} from 'react-redux';
import {enableScreens} from 'react-native-screens';
import BarberNavigation from './navigation/barberNavigation';


import {AppLoading} from 'expo';
import * as Font from 'expo-font';

import offersReducer from "./store/reducers/offers";
import bookingsReducer from "./store/reducers/bookings";
import authReducer from './store/reducers/auth';
import playersReducer from './store/reducers/player';

import propertiesReducer from './store/reducers/property'; 
import servicesReducer from './store/reducers/service'; 

enableScreens();

//Create the store and the combine reducers
const rootReducer = combineReducers({
offers : offersReducer,
auth: authReducer,
players:playersReducer,
owners:ownersReducer,
bookings : bookingsReducer,
properties:propertiesReducer,
services:servicesReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


const fetchFonts = () =>{
  return Font.loadAsync({
     'poppins': require('./assets/fonts/Poppins-Regular.ttf'),
     'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf')
  });
}



export default function App() {
   
   const [fontLoaded, setFontLoaded] = useState(false); 

   if(!fontLoaded){
     return(
       <AppLoading 
        startAsync={fetchFonts}
        onFinish={()=> setFontLoaded(true)}
       />
     )
   }

  return (
       <Provider store={store}><BarberNavigation /></Provider>
  );
}

