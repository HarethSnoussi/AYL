import React ,{useEffect}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar ,Avatar,Rating, AirbnbRating } from 'react-native-elements';

import { SwitchActions } from 'react-navigation';
import { useDispatch,useSelector } from 'react-redux';

import Colors from "../../constants/Colors.js";
import TopSalonsCard from '../../components/TopSalonsCard';
import TopBarbersCard from '../../components/TopBarbersCard.jsx';

const screen = Dimensions.get("window");
const ClientHomeScreen = props =>{
  console.disableYellowBox = true;
const playerID= props.navigation.getParam('playerID');  //get Player ID
const playerUID= props.navigation.getParam('playerUID'); 


//***************************************************************************

    return(

      <View style ={styles.container}>
      <StatusBar hidden />
      
      <ScrollView >
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
            <Text style = {styles.titleText}>Trouver Votre Coiffeur</Text>
            </View>
       
            </ImageBackground>




          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Salons
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "Tous les salons"})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                
                </Text>
                </TouchableOpacity>
              </View>

          <ScrollView style ={styles.topSalons} horizontal showsHorizontalScrollIndicator  = {false}>

              <TopSalonsCard />

             <TopSalonsCard />
             <TopSalonsCard />


          </ScrollView>

          
        


          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Coiffeurs
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "Tous les coiffeurs "})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                
                </Text>
                </TouchableOpacity>
              </View>
          <ScrollView  style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false}>
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />

          </ScrollView>
         
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
  fontSize : 18,
  fontFamily : "poppins-bold"

},
showAll : {
  fontFamily : "poppins",
  color : "#9d9da1"

},
titleText : {
    fontFamily :"poppins-bold",
    fontSize : 20,
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
  marginTop : 15,

  }
   

});

export default ClientHomeScreen;