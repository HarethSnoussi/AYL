import React, { useState , useEffect,useRef } from 'react';
import { Animated ,StyleSheet, Text, View , Dimensions , Platform, ActivityIndicator ,ScrollView, ImageBackground,Image,TouchableOpacity ,UIManager,LayoutAnimation} from 'react-native';
import Colors from "../constants/Colors";
import {CheckBox   } from 'react-native-elements';

import { AntDesign } from '@expo/vector-icons'; 



if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }


const MyCheckBox = props =>{

const [isChecked,setCheck]=useState(false);

const checkHandler = ()=>{
  
    setCheck(prev=>!prev);
   
    props.servicesHandler(props.value,isChecked);
        
};



    return(

        <CheckBox
          value={props.value}
          checked = {isChecked}
          checkedColor= {Colors.primary}
          title = {props.name +" "+props.price+" DA "+props.duration+" Min"}
          onPress = {checkHandler}
          containerStyle = {{backgroundColor : "#fff",borderWidth :0}}
  />
  )



          
  

};


const styles= StyleSheet.create({

});

export default MyCheckBox;