import React ,{useEffect, useState,useCallback}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar,ActivityIndicator,ScrollView, FlatList, TouchableOpacity } from 'react-native';

import {Button } from 'react-native-elements';

import { SwitchActions } from 'react-navigation';
import { useDispatch,useSelector } from 'react-redux';

import * as clientActions from '../../store/actions/clientActions';
import Colors from "../../constants/Colors.js";
import TopSalonsCard from '../../components/TopSalonsCard';
import TopBarbersCard from '../../components/TopBarbersCard.jsx';
import { getServices } from '../../store/actions/servicesActions.js';
import { getBarbers} from '../../store/actions/listActions';
import { getClientBookings } from '../../store/actions/bookingsActions.js';


import { expiredbookings } from '../../store/actions/bookingsActions.js';
import { getReviews } from '../../store/actions/reviewsActions';
const screen = Dimensions.get("window");


const ClientHomeScreen = props =>{
  console.disableYellowBox = true;


  //Get ALL Barbers AND SAloons from the store to display three of them
  const allBarbers = useSelector(state => state.lists.barbers) ;
  const allSaloons = useSelector(state => state.lists.saloons) ;
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  



const [isLoading , setLoading] = useState(false);
const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
  const [error, setError] = useState();
const dispatch = useDispatch ();

/********************************************************************** */
   /*
   *******Fetch One barber DATA
  */
 const getClient=useCallback(async()=>{
  try{
    setLoading(true);

    await dispatch(clientActions.setClient(clientID));
  setLoading(false);

    }catch(err){
      console.log(err);
    }
},[dispatch]);

  useEffect(()=>{

  getClient();

  },[getClient]);


  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getClient);
    return ()=>{
      willFocusSub.remove();
    };
  },[getClient]);

/********************************************************************** */
const getAllBarbers = useCallback(async ()=>{
  try{
    setError(null);
    setIsRefreshing(true);
    setLoading(true);
    await  dispatch(getBarbers());
    await dispatch(getReviews(clientID));
    await dispatch(getClientBookings(clientID));
    setIsRefreshing(false);
    setLoading(false);
  
    // await dispatch(expiredbookings("+213553633809"));
    }
    catch(err){
      setError(err.message);

      throw err ;
    }

  

},[dispatch,setError]);


useEffect (()=>{
getAllBarbers();

},[dispatch,getAllBarbers]);



/********************************************************************** */

if (error) {
  return (
    <View style={styles.centered}>
      <Text>Une erreur est survenue !</Text>
      <Button
        title="Try again"
         onPress = {getAllBarbers}
        color={Colors.primary}
      />
    </View>
  );
}



if (isLoading || allBarbers.length < 0 ) {

  return (

    <ImageBackground style= {styles.centered} source={require('../../assets/images/support.png')}>

      <ActivityIndicator size="large" color= {Colors.primary} />

    </ImageBackground>

  );
}
//***************************************************************************

    return(

      <View style ={styles.container}>
   
      <StatusBar hidden />
      <ScrollView  refreshing={isRefreshing}>
            <ImageBackground source = {require("../../assets/pictures/barber4.png")} style = {styles.firstImage}  resizeMode ="stretch" imageStyle ={styles.image} >
{/*            
           <SearchBar placeholder=" Recherche salon , coiffeur"
        containerStyle = {styles.searchBar}
        inputContainerStyle = {{
                borderRadius : 25,
                backgroundColor :"white"
        }}
        lightTheme = {true} /> */}
            <View style = {styles.firstTitle}>  
            <Text style = {styles.titleText}>Cherchez Votre Coiffeur</Text>
            </View>
       
            </ImageBackground>


          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Coiffeurs
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "coiffeurs",clientID})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                
                </Text>
                </TouchableOpacity>
              </View>
              { 
           allBarbers.length > 0 ?
          <ScrollView style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false}>


           
         {allBarbers.slice(0,3).map((barber , index)=> {
         return(
            <TopBarbersCard 
            key = {index} 
             name = {barber.name}
             surname = {barber.surname}
             phone = {barber.phone}
             region = {barber.region}
             wilaya = {barber.wilaya}
             navigateToBarberProfil={()=>props.navigation.navigate("Barber",{barberID : barber.id})}
            />

           )})
            }

          </ScrollView>
           
           :

           <View style = {styles.unAvailable}>  
           
           <Text>
              Aucun Coiffeur Disponible !

           </Text>
           
           </View>
          
        
        }
         
</ScrollView>
</View>
   
     );    
};

ClientHomeScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
    headerStyle:{
        backgroundColor: 'white'
    },
    headerBackTitle : " ",
    headerTitle: () => (
      <Image 
      resizeMode="cover"
      style={{
        width:150,
        height:40,
        resizeMode:'contain',
        alignSelf: 'center'}}
      
      />
    )};
}


const styles= StyleSheet.create({
  container : {
      flex : 1,
      backgroundColor : "#ffffff"
  },
  /////////////////////////////////////////////
  firstImage : {
    width : screen.width,
    height : screen.height * 0.35 ,
    overflow : "hidden",
   
  } ,
  image : {
    height : "100%",
    width : "100%",
   
   
},

unAvailable : {
  height : "5%",
  width : "90%",
  alignSelf : "center",
  justifyContent : "center"

},
////////////////////////////////////////////////////////
 textTopBarbers : {
   flexDirection : "row",
   justifyContent : "space-between",
    marginTop : 15,
    marginHorizontal : 15,
   
    alignItems :"center"
 },
 topSalons : {
  width : "100%",
  height : screen.height * 0.4 ,

},
topBarbers : {
 
  width : "100%",
  height : screen.height * 0.5 ,
 
},
bestText :{
  fontSize : screen.width/24,
  fontFamily : "poppins-bold",
  color:Colors.blue
},
showAll : {
  fontFamily : "poppins",
  color : "#9d9da1",
  fontSize :screen.width/30

},
titleText : {
    fontFamily :"poppins-bold",
    fontSize :screen.width/24,
    color : "#FFF"

},
///////////////////////////////////////////////////

 /////////////////////////////////////////////////
 searchBar :{
  width : "80%" , 
  alignSelf : "center",
  borderRadius : 20 , 
  backgroundColor : "rgba(52, 52, 52, 0)" ,
  marginTop : 15,
  borderTopWidth : 0 , 
  borderBottomWidth : 0 
  },

  firstTitle : {
    width : "80%" , 
    alignSelf : "center",
    alignItems : "center",
  borderRadius : 15,
  marginTop : 35,
  justifyContent : "center",
 

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

export default ClientHomeScreen;