import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Colors from "../constants/Colors";
import {CheckBox  } from 'react-native-elements';






const MyCheckBox = props =>{

    const [isChecked,setCheck]=useState(false);

const checkHandler = ()=>{
  
      setCheck(prev=>!prev);
   
 
            props.servicesHandler(props.value,isChecked);
        
};

    return(
        <CheckBox
          value={props.value}
          // onValueChange={setSelection}
          checked = {isChecked}
          checkedColor= {Colors.primary}
          title = {props.name +" "+props.price+" DA "+props.duration+" Min"}
          onPress = {checkHandler}
          
  />
        
     );    
};


const styles= StyleSheet.create({

});

export default MyCheckBox;