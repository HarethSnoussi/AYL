import React ,{useEffect, useState,useCallback,useRef}  from 'react';
import {View } from 'react-native';

import {Badge} from 'react-native-elements'

import {Foundation} from "@expo/vector-icons";
import { useSelector } from 'react-redux';

const NumConfirmed = props =>{

    const [confirmedBookings , setConfirmedBookings] = useState();
    const myClient = useSelector(state => state.clients.client) ;


  // const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  
  
          const count = async ()=>{
  
            try {
            
             
              const arr = await fetch(`http://173.212.234.137:3000/client/confirmedbookings/${myClient[0].id}`);
               const resData = await arr.json ();
      
               setConfirmedBookings( resData[0].Num);
              
      
              }
          
          catch (error) {
              console.log("There is an Error");
            
              throw error;
      
          }
          }

          if(myClient.length > 0)
         { count();}
  


      return (
        <View >
    
            <Foundation name = "calendar" 
            size = {22} color= {props.color} />
    
          {  
            confirmedBookings > 0 &&
              <Badge  status="success" 
    
    containerStyle={{position: 'absolute', top: -4, right: -4 }}
    
            />}
            </View>
               
     
    
         );    
    };

    export default NumConfirmed ;