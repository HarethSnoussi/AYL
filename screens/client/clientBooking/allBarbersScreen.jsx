import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground, Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import BarberCard from '../../../components/BarberCard';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../../constants/Colors";

import { useSelector, useDispatch } from 'react-redux';
import { Button , Rating} from 'react-native-elements';
import { getBarbers } from '../../../store/actions/listActions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screen = Dimensions.get("window");
const AllBarbersScreen = props =>{
const width = screen.width ;

const clientID =   props.navigation.getParam("clientID");

const allBarbers = props.navigation.getParam("type") === "coiffeurs" ? useSelector(state => state.lists.barbers) : useSelector(state => state.lists.saloons) ;

  const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
  const [error, setError] = useState();
  const [isLoading,setLoading] = useState(false);
  const [overlayState , setOverlay] = useState (false);
  const [searchState,setSearchState] = useState("");
  const [stadiumIndex , setStadiumIndex] = useState(0);
  const [wilayas,setWilayas] = useState([]);
  // const confirmedBookings = useSelector(state =>state.bookings.confirmedBookings);

 
const dispatch = useDispatch();
  

const SearchFilterFunction = (text)=> {
  setSearchState(text);
 
 
  //passing the inserted text in textinput
  // const newData = this.arrayholder.filter(function(item) {
  //   //applying filter for the inserted text in search bar
  //   const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
  //   const textData = text.toUpperCase();
  //   return itemData.indexOf(textData) > -1; }
  };


useEffect(()=>{
const a= allBarbers.filter((e)=>{

    const itemData = e.region ? e.region.toUpperCase() : ''.toUpperCase();
    const textData = searchState.toUpperCase();
    return itemData.startsWith(textData);

})


 setWilayas(a);

},[searchState]);

// const barbersByWilayas = allBarbers.filter(e=>e.wilaya.toUpperCase() === searchState.toUpperCase());


const searchedResult = searchState === "" ? allBarbers :  wilayas ;

//GEt ALL BARBERS 

// useEffect(()=>{

// const fetchBarbers = async ()=>{
// setLoading(true);
// await dispatch(getBarbers());
// setLoading(false);

// }
//  fetchBarbers();


// },[dispatch]);



if (error) {
  return (
    <View style={styles.centered}>
      <Text>Une erreur est survenue !</Text>
      <Button
        title="Rafraîchir"
         onPress = {getAllBarbers}
        color={Colors.primary}
      />
    </View>
  );
}


if (isLoading) {
    
  return (
    <ImageBackground style= {styles.centered} source={require('../../../assets/images/support.png')}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    </ImageBackground>
  );
}

    return(
     
      <View style = {styles.container}>
      
      
  <View style = {{flexDirection :"row",alignItems : "center",width : "95%",justifyContent :"space-around",marginVertical : "2%",alignSelf : "center",height:"10%"}}>


  <TouchableOpacity onPress = {()=>{props.navigation.goBack()}}  style={{height : "100%",alignSelf : "center",justifyContent : "center"}}>
  <Ionicons name="md-arrow-back" 
            size={20} color="black" 
            onPress = {()=>{props.navigation.goBack()}} 
            style={{alignSelf : "center"}}
  
   />
  
  </TouchableOpacity>


        <SearchBar
                placeholder="Région"
                containerStyle = {styles.searchBar}
                onChangeText = {(text)=>setSearchState(text)}
                inputContainerStyle = {{
                        borderRadius : 25
                }}
                lightTheme = {true}
                searchIcon = {{color : "#fd6c57", size : 25}}
                value={searchState}
                onClear={text => setSearchState('')}
              />
   </View>
      <View style = {{width :"90%" , alignSelf : "center",marginVertical : 5,flexDirection : "row",justifyContent : "space-between"}}>
      
         <View>
        
          <Text style = {{fontFamily : "poppins-bold",fontSize : width/24}}>Tous les {props.navigation.getParam("type")} </Text>
          <Text style = {{fontFamily : "poppins",color:"#9d9da1",fontSize : width/30}}>{searchedResult.length} Résultats </Text>
          </View>
          {/* <FontAwesome5  name="filter" size={24} color="#333"  /> */}
      </View>
            <ScrollView   showsVerticalScrollIndicator  = {false} style = {{borderWidth : 0.3}}>
          

          {
            searchedResult.map((barber,index)=> {

              return (
              <BarberCard 
              key = {index}
              navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID,name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya})}
              navigateToBarberProfil={()=>props.navigation.navigate("Barber",{barberID : barber.id})}
              name = {barber.name}
              surname = {barber.surname}
              region = {barber.region}
              mark = {barber.mark}
              wilaya = {barber.wilaya}
              
              />
              
              )
                 

            })


                 
                 }
                
                </ScrollView>

        </View>
           
 

     );    
};


AllBarbersScreen.navigationOptions = (navData) => {
return {
  // headerTransparent : true,
  headerTintColor:'#111',
  headerBackTitle : " ",
  title : "",
  headerShown: false,
}

};

const styles= StyleSheet.create({
    container : {
            flex: 1 ,
          backgroundColor : "#fff",
    },

    searchBar :{
      width : "90%" , 
      alignSelf : "center",
      borderRadius : 20 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      // marginTop : "2%",
      borderTopWidth : 0 , 
      borderBottomWidth : 0 ,
      alignSelf : "center"
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

},
centered: {
  flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:'100%',
   height:'100%',
   resizeMode:'cover'
}

    
   

});

export default AllBarbersScreen;