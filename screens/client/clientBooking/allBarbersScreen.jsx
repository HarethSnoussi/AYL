import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground, Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import BarberCard from '../../../components/BarberCard';
import { SearchBar } from 'react-native-elements';
import { Ionicons,Feather } from '@expo/vector-icons';

import Colors from "../../../constants/Colors";

import { useSelector, useDispatch } from 'react-redux';
import { Button , Rating} from 'react-native-elements';
import { getBarbers } from '../../../store/actions/listActions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotifOverlay from '../../../components/NotifOverlay';

const screen = Dimensions.get("window");


const AllBarbersScreen = props =>{
const width = screen.width ;

const clientID =   props.navigation.getParam("clientID");

const allBarbers = props.navigation.getParam("type") === "coiffeurs" ? useSelector(state => state.lists.barbers) : useSelector(state => state.lists.saloons) ;

const regions = allBarbers.map(e=>e.region);

  const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
  const [error, setError] = useState();
  const [isLoading,setLoading] = useState(false);

  const [searchState,setSearchState] = useState("");

  const [foundBarbers,setFoundBarbers] = useState([]);
  const [foundRegions,setFoundRegions] = useState([]);


  // const confirmedBookings = useSelector(state =>state.bookings.confirmedBookings);

 
const dispatch = useDispatch();
  

useEffect(()=>{

const a= regions.filter((e)=>{

  const itemData = e ? e.toUpperCase() : ''.toUpperCase();
  
  const textData = searchState.toUpperCase();
  
  return itemData.startsWith(textData);

})
const resultBarbers = allBarbers.filter(e=>e.region.toUpperCase() === searchState.toUpperCase());

setFoundBarbers([...resultBarbers]);

searchState === "" ? setFoundRegions([]): setFoundRegions(a);

},[searchState,setFoundBarbers]);


//on Press on search result 

const searchResult = async (s)=>{

setSearchState(s);


}





const searchedResult = searchState === "" ? allBarbers :  foundBarbers ;





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
    <ImageBackground style= {styles.centered} source={{uri:'http://173.212.234.137/assets/tahfifa/support.png'}}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    </ImageBackground>
  );
}

    return(
     
      <View style = {styles.container}>
     
      
  <View style = {{flexDirection :"row",alignItems : "center",width : "95%",justifyContent :"space-around",marginVertical : "2%",alignSelf : "center",height:"10%"}}>


  <TouchableOpacity onPress = {()=>{props.navigation.goBack()}}  style={{height : "100%",alignSelf : "center",justifyContent : "center"}}>
  <Ionicons name="md-arrow-back" 
            size={screen.width/18} color="black" 
            onPress = {()=>{props.navigation.goBack()}} 
            style={{alignSelf : "center"}}
  
   />
  
  </TouchableOpacity>


        <SearchBar
                placeholder="Région"
                containerStyle = {styles.searchBar}
                onChangeText = {(text)=>setSearchState(text)}
                inputContainerStyle = {{
                        borderRadius : screen.width/14.4
                }}
                lightTheme = {true}
                searchIcon = {{color : "#fd6c57", size : screen.width/14.4}}
                value={searchState}
                onClear={text => setSearchState('')}
              />
   </View>


{      
  searchedResult.length !== 0 &&
  <View style = {{width :"90%" , alignSelf : "center",marginVertical : screen.width/72,flexDirection : "row",justifyContent : "space-between"}}>
      
         <View>
        
          <Text style = {{fontFamily : "poppins-bold",fontSize : width/24}}>Tous les {props.navigation.getParam("type")} </Text>
          <Text style = {{fontFamily : "poppins",color:"#9d9da1",fontSize : width/30}}>{searchedResult.length} Résultats </Text>
          </View>
          {/* <FontAwesome5  name="filter" size={24} color="#333"  /> */}
      </View>
      
      }


            <ScrollView    showsVerticalScrollIndicator  = {false} style = {{borderWidth : searchedResult.length !== 0 ?  0.3 : 0}}>
          <View style = {{   width : "90%" , 
                 alignSelf : "center",
                
     
      }}>
{
  searchState !== "" && foundBarbers.length === 0 &&foundRegions.map((e,index)=>{
return(
  
  <TouchableOpacity  onPress={()=>{searchResult(e)}} key ={index} style={styles.searchedRegion} >
  <Feather name="arrow-up-right" size={screen.width/19.2} color="black" style = {{marginRight : "5%"}} />
    <Text style = {{fontFamily : "poppins",fontSize : width/26}} >{e}</Text>
   
    </TouchableOpacity>

 
)


  })
 

}

</View>
          {
            searchedResult.map((barber,index)=> {
              
              return (
                
              
              <BarberCard 
              key = {index}
              navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID,name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya,overCpt :props.navigation.getParam("overCpt")})}
              navigateToBarberProfil={()=>props.navigation.navigate("Barber",{barberID : barber.id})}
              name = {barber.name}
              surname = {barber.surname}
              region = {barber.region}
              mark = {barber.mark}
              wilaya = {barber.wilaya}
              image={barber.image!==null?barber.image:'unknown.jpeg'}
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
      borderRadius : screen.width/18 , 
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
    searchedRegion : 
{
  paddingVertical : screen.width/26,
        borderBottomWidth:0.6,
        flexDirection :"row"
      },
    
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
  borderRadius : screen.width/14.4
  

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
borderRadius : screen.width/14.4,


},
rating :{
backgroundColor : "red",
alignSelf : "flex-start",
marginRight : screen.width/51.4

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