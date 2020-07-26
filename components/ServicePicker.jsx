import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Picker, StyleSheet,Text } from "react-native";
import { Button } from "react-native-elements";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const ServicePicker = (props) =>{

const barberServices = props.barberServices ;
const pickerId = props.id ;

const pickedServices = props.pickedServices;
const addedTypes = props.addedTypes;
const [pickedValue , setPickedValue] = useState(props.service);

//////////////////////////////////////////////////



const pickedValueHandler =  (itemValue)=>{

if(itemValue != null )
{
    if(addedTypes.indexOf(itemValue.type) < 0)
            {
                setPickedValue(itemValue);
                props.updateService(itemValue,pickerId);
            }

}

};

const deleteService = ()=>{
props.deleteService(pickerId);

}


const dataList = barberServices.map((service , index) => 
{ 
return ({
    label: service.type+"/ "+ service.price + " dzd / " + service.time + " min ",
    value: service,
    key : index,
   disabled : true
  })}


  )
return(  

<View style = {{flexDirection : "row",justifyContent : "space-between",alignItems : "center"}} >
    <View style = {styles.oneService}>
    <View style={{  width: "90%", backgroundColor : "#f0f0f0", borderRadius : 10}}>


    <RNPickerSelect
            onValueChange={(itemValue) => pickedValueHandler(itemValue)}
            items={dataList}
            value = {pickedValue}
            placeholder={{
                    label: 'Selectionner Un Service ... ',
                    color : "#7f7d7c",
                    value : {type : " " , price : 0 , time : 0}
                }}
          
        />


    {/* <Picker
    selectedValue = {pickedValue}
    onValueChange={(itemValue) => pickedValueHandler(itemValue)}
     >
     <Picker.Item 
                    label={"choissisez un service ..."}
                    value = {{type : " " , price : 0 , time : 0}}
                        />
     {
         barberServices.map((service,num)=>{
                return(
                <Picker.Item 
                    key = {num}
                    label={service.type }
                    value = {service}
                        /> 
         )
         })
     }
</Picker> */}
</View>
</View>

{     
 
    <Button 
     type="outline" 
     buttonStyle = {{borderColor : "#fd6c57",borderWidth : 0}}  
     titleStyle = {{color : "#fd6c57"}}  
     onPress = {deleteService} 
     containerStyle = {{width : "10%"}}
     icon = {
        <Ionicons name="md-remove-circle-outline" size={24} color="#fd6c57" />
     }
         
     />  }    

</View>)

};

const styles= StyleSheet.create({
   
    container : {
             flex : 1 ,
    },
    firstImage : {
         height :"30%"
    },
 //////////////////////////////////////////////////////////////////////////   
    bookingInfoContainer : {
        width : "100%",
        height : "75%",
        backgroundColor : "white",
        borderTopLeftRadius : 25,
        borderTopRightRadius : 25,
         position : "absolute",
         top : "25%",
         overflow : "hidden",
        
    },
 ////////////////////////////////////////////////////////////////////////////
     chooseServiceText : {
        flexDirection : "row",
         justifyContent  : "space-between",
         marginTop : "5%",
         width : "90%",
         alignSelf : "center",
         height : "10%"
     },
     oneService : {
             flexDirection :"row",
             alignItems : "center",
             overflow : "hidden",
             marginVertical : 5 
     }
  
     });
   ///////////////////////////////////////////////////////////////////////////

export default ServicePicker;