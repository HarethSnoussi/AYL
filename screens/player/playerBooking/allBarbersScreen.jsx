import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground, Dimensions} from 'react-native';
import BarberCard from '../../../components/BarberCard';
import { SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../../constants/Colors";
import InfoOverlay from '../../../components/InfoOverlay';
import { useSelector } from 'react-redux';
import { Button , Rating} from 'react-native-elements';

const screen = Dimensions.get("window");
const AllBarbersScreen = props =>{

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
     
      <View style = {styles.container}>
      
      
        <SearchBar
        placeholder="Ville"
        containerStyle = {styles.searchBar}
        inputContainerStyle = {{
                borderRadius : 25
        }}
        lightTheme = {true}
        searchIcon = {{color : "#fd6c57", size : 25}}
        value={searchState}
        onChangeText={updateSearch}
      />
     
      <View style = {{width :"90%" , alignSelf : "center",marginVertical : 5,flexDirection : "row",justifyContent : "space-between"}}>
      
         <View>
        
          <Text style = {{fontFamily : "poppins-bold",fontSize : 18}}>{props.navigation.getParam("type")} </Text>
          <Text style = {{fontFamily : "poppins",color:"#9d9da1"}}>355 Résultats </Text>
          </View>
          <FontAwesome5 name="filter" size={24} color="#333" />
      </View>
            <ScrollView   showsVerticalScrollIndicator  = {false} style = {{borderWidth : 0.3}}>
          
                  <BarberCard navigate = {()=>props.navigation.navigate("BookStepOne")}/>
                  <BarberCard />
                  <BarberCard />
                  <BarberCard />
                  <BarberCard />
             
                
                </ScrollView>

        </View>
           
 

     );    
};


AllBarbersScreen.navigationOptions = (navData) => {
return {
  headerTransparent : true,
  headerTintColor:'#111',
  headerBackTitle : " ",
  title : ""
}

};

const styles= StyleSheet.create({
    container : {
            flex: 1 ,
          backgroundColor : "#fff",
    },

    searchBar :{
      width : "80%" , 
      alignSelf : "center",
      borderRadius : 20 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginTop : "1%",
      borderTopWidth : 0 , 
      borderBottomWidth : 0 ,
      
      },
      firstImage : {
        width : screen.width,
        height : screen.height * 0.3 ,
        overflow : "hidden",
      } ,
    
///////////////////////////////////////////////////////
cardContainer : {
  width : "97%",
  backgroundColor : "#fff",
  height : screen.height * 0.20,
  flexDirection : "row",
  justifyContent : "space-around",
  borderBottomWidth : 1,
  overflow : "hidden",
  alignSelf : "flex-end"

},
cardImage : {
    width : "30%",
    height : "90%",
    alignSelf : "center",
    overflow : "hidden",
    
    
},
image : {
  height : "100%",
  width : "100%",
  resizeMode : "cover",
  borderRadius : 25
  

},
cardText : {

    width : "60%",
    height : "100%",
    alignSelf : "center",
    justifyContent : "space-around",
    overflow : "hidden",
 

},
name : {
    flexDirection : "row",
    justifyContent : "space-between",


},
extra : {
  flexDirection : "row",
  justifyContent : "space-between",


},
extraHours : {

 

},
extraButton : {
overflow : "hidden",
borderRadius : 25,


},
rating :{
backgroundColor : "red",
alignSelf : "flex-start",
marginRight : 7

}

    
   

});

export default AllBarbersScreen;