import React, { useState , useEffect,useRef } from 'react';
import { Animated ,StyleSheet, Text, View , Dimensions , Platform, ActivityIndicator ,ScrollView, ImageBackground,Image,TouchableOpacity ,UIManager,LayoutAnimation} from 'react-native';
import Colors from "../constants/Colors";
import {CheckBox   } from 'react-native-elements';

import { AntDesign } from '@expo/vector-icons'; 
import MyCheckBox from './MyCheckBox';



if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }


const ServiceTypeMenu = props =>{

    const [isChecked,setCheck]=useState(false);
    const [isOpen , setOpen] = useState(false);

// Animated Rotation Start 

const rotateAnim = useRef(new Animated.Value(0)).current;

// FAde Animation Start
const fadeAnim = useRef(new Animated.Value(0)).current;

const fadeIn = () => {
  // Will change fadeAnim value to 1 in 5 seconds
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 0,
    useNativeDriver: true
  }).start();
};

const fadeOut = () => {
  // Will change fadeAnim value to 0 in 5 seconds
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true
  }).start();
};

// FAde Animation End


//Rotation Animation
const openRotate = () => {
 
  Animated.timing(rotateAnim, {
    toValue: 1,
    duration: 700,
    useNativeDriver: true
  }).start();
};

const closeRotate = () => {
  
  Animated.timing(rotateAnim, {
    toValue: 0,
    duration: 700,
    useNativeDriver: true
  }).start();
};

const RotateData = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['180deg', '0deg'],
});

// ENd ANIMATION ROTATION

const tabHandler =  ()=>{
       
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear );
    setOpen((previous)=>!previous);
  }

useEffect(()=>{
    isOpen ?  openRotate() : closeRotate ();
    isOpen ? fadeIn() : fadeOut();
  
  },[isOpen]);
  



    return(
<TouchableOpacity onPress = {tabHandler}  style = {{ alignSelf : "center",width : "95%",marginBottom : 10,overflow :"hidden"}} >
        <View  style = {{flexDirection : "row",justifyContent :"space-between", padding : 15,flex : 1,backgroundColor :"#fff",overflow :"hidden"}}>
        <Text>{props.type}</Text>
        <Animated.View style = {{transform : [{rotate :RotateData }]}} > 
        <AntDesign name="upcircle" size={24} color= {Colors.primary} />
        </Animated.View>

</View>

      {  
        props.services.map((service,index)=>{

           return(
               <Animated.View key = {index} style = {{opacity : fadeAnim ,display :!isOpen ? "none" : "flex",backgroundColor : "#fff"}}>
        <MyCheckBox
          
          servicesHandler = {props.servicesHandler}
          value = {props.value}
          name = {service.name}
          duration = {service.duration}
          price = {service.price}
  />
  </Animated.View>
  )

        })

          
  }
      </TouchableOpacity>  
     );    
};


const styles= StyleSheet.create({

});

export default ServiceTypeMenu;