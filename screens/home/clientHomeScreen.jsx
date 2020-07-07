import React ,{useEffect}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar } from 'react-native';
import { Button } from 'react-native-elements';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { SearchBar ,Avatar,Rating, AirbnbRating } from 'react-native-elements';

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
            <ImageBackground source = {require("../../assets/pictures/barber4.png")} style = {styles.firstImage}>
           
           <SearchBar placeholder=" Recherche salon , coiffeur"
        containerStyle = {styles.searchBar}
        inputContainerStyle = {{
                borderRadius : 25,
                backgroundColor :"white"
        }}
        lightTheme = {true} />
            </ImageBackground>

        


          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Coiffeurs
                
                </Text>
                <Text style = {styles.showAll}>Tout Afficher
                
                </Text>
              </View>
          <ScrollView style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false}>
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />
          <TopBarbersCard />

          </ScrollView>



          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Salons
                
                </Text>
                <Text style = {styles.showAll}>Tout Afficher
                
                </Text>
              </View>

          <ScrollView style ={styles.topSalons} horizontal showsHorizontalScrollIndicator  = {false}>

              <TopSalonsCard />

             <TopSalonsCard />


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
    height : screen.height * 0.4 ,
   overflow : "hidden",
   

  } ,
  image : {
    height : "100%",
    width : "100%",
   resizeMode : "cover"
},
////////////////////////////////////////////////////////
 textTopBarbers : {
   flexDirection : "row",
   justifyContent : "space-between",
    marginTop : 25,
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
///////////////////////////////////////////////////
barberContainer : {
  height : "90%",
  width : screen.width * 0.6,
  alignSelf : "center",
  borderRadius : 25,
  overflow : "hidden",
  marginHorizontal : screen.width * 0.03,
  borderWidth : 0.3 ,

 
},
barberPictureContainer : {
      width : "100%",
      height : "40%",
      overflow : "hidden",
      alignItems : "center",
      justifyContent : "center",
      marginBottom : "5%"
},
barberPicture : {
borderWidth :1

},

barberInfos : {
height : "50%",
justifyContent : "space-between",
alignItems : 'center',
overflow : "hidden"

},
rating : {

},
 /////////////////////////////////////////////////
 searchBar :{
  width : "80%" , 
  alignSelf : "center",
  borderRadius : 20 , 
  backgroundColor : "rgba(52, 52, 52, 0)" ,
  marginTop : 15,
  borderTopWidth : 0 , 
  borderBottomWidth : 0 
  }
   

});

export default ClientHomeScreen;