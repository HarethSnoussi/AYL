import React from "react";
import {HeaderButton} from "react-navigation-header-buttons";
import {Ionicons} from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { Dimensions } from "react-native";

const screen = Dimensions.get('window');
const CustomHeaderButton = props =>{

     return <HeaderButton 
     {...props} 
     IconComponent = {Ionicons}
     iconSize={screen.width/11.25}
     
     />

};


export default CustomHeaderButton;

