import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground} from 'react-native';

import StadiumCard from '../../../components/StadiumCard';
import { SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from "../../../constants/Colors";
import InfoOverlay from '../../../components/InfoOverlay';
import { useSelector } from 'react-redux';


const StadiumChoiceScreen = props =>{

  const allProperties = useSelector(state => state.properties.propertyStadiums);
 
  const [overlayState , setOverlay] = useState (false);
  const [searchState,setSearchState] = useState("");
  const [stadiumIndex , setStadiumIndex] = useState(0);
  // const confirmedBookings = useSelector(state =>state.bookings.confirmedBookings);

  // console.log(confirmedBookings);
  const openOverlay = (index)=> {

    setOverlay(true);
    
    setStadiumIndex(index);
  }

  const closeOverlay = (index)=> {

    setOverlay(false);
    
  
  }
  const updateSearch = (v) => {
    setSearchState(v);

  };


const searchedProperty = allProperties.filter(e=>e.wilaya.toUpperCase() === searchState.toUpperCase());

let shownProperties = null ;

searchState === "" ? shownProperties =allProperties : shownProperties =searchedProperty ; 




    return(
     
      <ImageBackground
      source = {require("../../../assets/images/android.jpg")}
       style = {styles.container}
     blurRadius = {0}
       >
      
     
        <View style = {styles.componentsContainer}>
        <SearchBar
        placeholder="Ville"
        containerStyle = {styles.searchBar}
        inputContainerStyle = {{
                borderRadius : 25
        }}
        lightTheme = {true}
        searchIcon = {{color : Colors.secondary, size : 25}}
        value={searchState}
        onChangeText={updateSearch}
      />
            <ScrollView>


              { 
                shownProperties.map((property,index)=>{
               
            return(
              <View  key = {index}>
              <StadiumCard
                 
                  name = {property.name}
                  adress = {property.address}
                  onPress = {()=>props.navigation.navigate("StadiumBooking",
                    {
                    ownerId : property.owner_id
                    })
                
                }
                  openOverlay = {()=>openOverlay(index)}
              
                  
                 />
                 { overlayState && 
                   <InfoOverlay 
                    isVisible = {overlayState}
                    closeOverlay = {closeOverlay}
                    name = {shownProperties[stadiumIndex].name}
                    address = {shownProperties[stadiumIndex].address}
                    wilaya = {shownProperties[stadiumIndex].wilaya}
                    shower = {shownProperties[stadiumIndex].showers === 1 ? "Oui" : "Non"} 
                    types = {shownProperties[stadiumIndex].allTypes}
                    /> 
      }
                </View>
                 
                 )

                })
                 
                 
                 }
                
               
                
                </ScrollView>

        </View>
          
      </ImageBackground>

     );    
};


StadiumChoiceScreen.navigationOptions = (navData) => {
return {
  headerTransparent : true,
  headerTintColor:'white',
  headerBackTitle : " ",
  title : ""
}

};

const styles= StyleSheet.create({
    container : {
            flex: 1 ,
            justifyContent : "flex-end",
            backgroundColor : "#323232",

    },

    componentsContainer : {
        width : "95%",
        height : "93%",
        alignSelf : "center"
    },
    searchBar :{
      width : "80%" , 
      alignSelf : "center",
      borderRadius : 20 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginBottom : 15 ,
      borderTopWidth : 0 , 
      borderBottomWidth : 0 
      }
    
   

});

export default StadiumChoiceScreen;