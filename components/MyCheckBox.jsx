import React, { useState } from 'react';
import {Platform, UIManager} from 'react-native';
import Colors from "../constants/Colors";
import {CheckBox   } from 'react-native-elements';


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
          title = {props.name +" "+props.price+" "+props.dzdText+" "+props.duration+" "+props.minText}
          onPress = {checkHandler}
          containerStyle = {{backgroundColor : "#fff",borderWidth :0}}
  />
  )



          
  

};



export default MyCheckBox;