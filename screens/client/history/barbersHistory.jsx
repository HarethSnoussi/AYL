import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground, Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import ReviewCard from '../../../components/ReviewCard';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../../constants/Colors";

import { useSelector, useDispatch } from 'react-redux';
import { Button , Rating} from 'react-native-elements';
import { getBarbers } from '../../../store/actions/listActions';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getReviews } from '../../../store/actions/reviewsActions';

const screen = Dimensions.get("window");
const BarbersHistory = props =>{


  const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  


const allBarbers = useSelector(state => state.lists.barbers) ;
const allReviews = useSelector(state=>state.reviews.reviews);

  const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
  const [error, setError] = useState();
  const [isLoading,setLoading] = useState(false);
  const [overlayState , setOverlay] = useState (false);
  const [searchState,setSearchState] = useState("");
  
  const [wilayas,setWilayas] = useState([]);
  const [barbersIds,setBarbersIds] = useState([]);
  const [barbersList,setBarberList] = useState([]);
  // const confirmedBookings = useSelector(state =>state.bookings.confirmedBookings);

  
const dispatch = useDispatch();
  

useEffect(()=>{
  
  const a= barbersList.filter((e)=>{

    const itemData = e.name ? e.name.toUpperCase() : ''.toUpperCase();
    const textData = searchState.toUpperCase();
    return itemData.startsWith(textData);

})
 setWilayas(a);

},[searchState]);

// const barbersByWilayas = allBarbers.filter(e=>e.wilaya.toUpperCase() === searchState.toUpperCase());


const searchedResult = searchState === "" ? barbersList :  wilayas ;
const getHistory = useCallback(async ()=>{
  try {
    setError(false);
    setIsRefreshing(true);
    setLoading(true);
    
    const arr = await fetch(`http://173.212.234.137:3000/client/barbers/${clientID}`);
    const resData = await arr.json ();
   
    setBarbersIds([...resData]);
    await dispatch(getReviews(clientID));
    setIsRefreshing(false);
    setLoading(false);
    }

catch (error) {
    setError(true);
    console.log("There is an Error");
    throw error;
}

},[setError]);


useEffect (()=>{
  getHistory();

},[getHistory]);

useEffect(()=>{
  const willFocusSub= props.navigation.addListener(
    'willFocus',
    () => {
  
      getHistory();
     
    }
  );
  return ()=>{
    willFocusSub.remove();
  };
  },[getHistory]);



useEffect(()=>{

  const barbers = [];
  barbersIds.forEach(e=>{
   
    allBarbers.forEach(element => {
  
         if(element.id === e.barberId){
            barbers.push(element);
          
         }
  
  
    });
  
  });
  
  setBarberList([...barbers]);

},[barbersIds])

if (error) {
  return (
    <View style={styles.centered}>
      <Text>Une erreur est survenue !</Text>
      <Button
        title="Try again"
         onPress = {getAllBarbers}
         buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : screen.width/14.4,paddingHorizontal : "5%",marginVertical : "5%"}}
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
     
      
  <View style = {{flexDirection :"row",alignItems : "center",width : "95%",justifyContent :"space-around",marginVertical : "2%",alignSelf : "center",}}>
 
  {/* <Ionicons name="md-arrow-back" size={24} color="black" onPress = {()=>{props.navigation.goBack()}} style={{alignSelf : "center"}} /> */}
        <SearchBar
                placeholder="Nom du coiffeur"
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
      <View style = {{width :"90%" , alignSelf : "center",marginVertical : screen.width/72,flexDirection : "row",justifyContent : "space-between"}}>
      
         <View>
          <Text style = {{fontFamily : "poppins-bold",fontSize : screen.width/24}}>
          Historique des coiffeurs
          </Text>
          <Text style = {{fontFamily : "poppins",color:"#9d9da1",fontSize : screen.width/30}}>
          {searchedResult.length} Résultats 
          </Text>
          </View>
        
      </View>
            <ScrollView refreshing={isRefreshing} 
            showsVerticalScrollIndicator  = {false}
             style = {{borderWidth : 0.3}}
             >
          {
            searchedResult.map((barber,index)=> {
              
              return (
              <ReviewCard 
              key = {index}
              navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID,name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya})}
              name = {barber.name}
              surname = {barber.surname}
              region = {barber.region}
              mark = {barber.mark}
              wilaya = {barber.wilaya}
              barberId = {barber.id}
              allReviews = {allReviews}
              clientId = {clientID}
               profile = {()=>props.navigation.navigate("Barber",{barberID : barber.id})}
               image={barber.image!==null?barber.image:'unknown.jpeg'}
              />
              
              )
                 

            })


                 
                 }

                 
                
                </ScrollView>

        </View>
           
 

     );    
};


BarbersHistory.navigationOptions = (navData) => {
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
      alignSelf : "center",
      marginTop : "2%"
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

export default BarbersHistory;