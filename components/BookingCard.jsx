import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';

import Colors from '../constants/Colors';
import {Ionicons} from "@expo/vector-icons";


const screen = Dimensions.get("window");



const BookingCard = props =>{

    return(
      
      <View style = {styles.card} >
 

      </View>
     );    
};


const styles= StyleSheet.create({

  card : {
    width : "90%",
    backgroundColor : "blue",
    height : screen.height * 0.2,
    alignSelf : "center",
    borderRadius : 25
    
}

});

export default BookingCard;