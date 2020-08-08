import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground, Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import ReviewCard from '../../../components/ReviewCard';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from "../../../constants/Colors";
import InfoOverlay from '../../../components/InfoOverlay';
import { useSelector, useDispatch } from 'react-redux';
import { Button , Rating} from 'react-native-elements';
import { getBarbers } from '../../../store/actions/listActions';

const screen = Dimensions.get("window");
const BarbersHistory = props =>{


  const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  


const allBarbers = useSelector(state => state.lists.barbers) ;
const allReviews = useSelector(state=>state.reviews.reviews);


  const [isLoading,setLoading] = useState(false);
  const [overlayState , setOverlay] = useState (false);
  const [searchState,setSearchState] = useState("");
  const [stadiumIndex , setStadiumIndex] = useState(0);
  const [wilayas,setWilayas] = useState([]);
  const [barbersIds,setBarbersIds] = useState([]);
  const [barbersList,setBarberList] = useState([]);
  // const confirmedBookings = useSelector(state =>state.bookings.confirmedBookings);

  
const dispatch = useDispatch();
  

useEffect(()=>{
 setWilayas(allBarbers.filter(e=>e.region.toUpperCase() === searchState.toUpperCase()));

},[searchState]);

// const barbersByWilayas = allBarbers.filter(e=>e.wilaya.toUpperCase() === searchState.toUpperCase());


const searchedResult = searchState === "" ? allBarbers :  wilayas ;

useEffect(()=>{ 
  const getHistory = async ()=>{
  
    try {
        setLoading(true);

        const arr = await fetch(`http://192.168.1.6:3000/client/barbers/${clientID}`);
        const resData = await arr.json ();
        setBarbersIds([...resData]);
        setLoading(false);
        }
    
    catch (error) {
        console.log("There is an Error");
    }

}; 
  getHistory();

},[]);



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


if (isLoading) {
    
  return (
    <View style= {styles.centered}>
      <ActivityIndicator size="large" color= {Colors.primary} />
    </View>
  );
}
    return(
     
      <View style = {styles.container}>
      
      
  <View style = {{flexDirection :"row",alignItems : "center",width : "95%",justifyContent :"space-around",marginVertical : "2%",alignSelf : "center",}}>
 
  <Ionicons name="md-arrow-back" size={24} color="black" onPress = {()=>{props.navigation.goBack()}} style={{alignSelf : "center"}} />
        <SearchBar
                placeholder="Nom du coiffeur"
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
        
          <Text style = {{fontFamily : "poppins-bold",fontSize : 18}}>Historique des coiffeurs</Text>
          <Text style = {{fontFamily : "poppins",color:"#9d9da1"}}>{barbersList.length} Résultats </Text>
          </View>
        
      </View>
            <ScrollView   showsVerticalScrollIndicator  = {false} style = {{borderWidth : 0.3}}>
          

          {
            barbersList.map((barber,index)=> {
              
              return (
              <ReviewCard 
              key = {index}
              navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID})}
              name = {barber.name}
              surname = {barber.surname}
              region = {barber.region}
              mark = {barber.mark}
              wilaya = {barber.wilaya}
              barberId = {barber.id}
              allReviews = {allReviews}
              clientId = {clientID}
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
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

});

export default BarbersHistory;