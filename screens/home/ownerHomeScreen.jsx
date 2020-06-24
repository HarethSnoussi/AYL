import React from 'react';
import { StyleSheet, Text, View, ImageBackground , Image,Dimensions} from 'react-native';
import SmallCard  from '../../components/SmallCard';

const screen = Dimensions.get("window");
const OwnerHomeScreen = props =>{
  
  const ownerID= props.navigation.getParam('ownerID');
  const ownerUID= props.navigation.getParam('ownerUID'); 

//***************************************************************************
//Responsivity
  let welcomeTextStyle = styles.welcomeText;

  if(screen.width < 350) {
    welcomeTextStyle = styles.welcomeTextSmall;
  }

  if (screen.height > 800) {
    welcomeTextStyle = styles.welcomeTextBig;
    
  }
//***************************************************************************
    return(
      <View style ={styles.container}>
        <ImageBackground source = {require("../../assets/images/profileBack5.jpg")}  style = {styles.backgroudnImage}>
         
         <View style = {styles.textContainer}>
            <Text style = {welcomeTextStyle}>BIENVENUE</Text>

         </View>

          <View style = {styles.rowsContainer}>
              <View style = {styles.rowOne}>
                  <SmallCard 
                  image ={require("../../assets/logo/user.png")} 
                  screen = "Profile"
                  onPress = {() =>props.navigation.navigate('OwnerProfileChoice',{ownerID:ownerID,ownerUID:ownerUID})}
                  />
                  
                  <SmallCard
                  image ={require("../../assets/logo/book.png")} 
                  screen = "Services"
                  onPress={()=> props.navigation.navigate('OwnerService',{ownerID:ownerID})}
                   />

              </View> 

              <View style = {styles.rowTwo}>
                  
                  <SmallCard
                    image ={require("../../assets/logo/calendar.png")} 
                    screen = "Réservations"
                    onPress={()=> props.navigation.navigate('OwnerBookings')}
                     />

                  <SmallCard
                    image ={require("../../assets/logo/football2.png")} 
                    screen = "Support"
                    onPress={()=>props.navigation.navigate('OwnerSupport')}
                   />

              </View>
       
            </View>

        </ImageBackground>


      </View>

     );    
};

OwnerHomeScreen.navigationOptions= ()=>{
  

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
  },
  backgroudnImage : {
    flex : 1 ,
    justifyContent : "center"
  },
  image : {
        width : "100%",
        height : "100%"
  },
  imageContainer : {
      width : 100,
      height : 100,
      alignSelf : "center",
      marginVertical : 30
  },
  rowsContainer : {
      alignItems :"center",
      justifyContent : "space-around" 
  },
  rowOne : {
      flexDirection : "row",
      width : "80%",
      height : "30%",
    
      
  },
  rowTwo : {
    flexDirection : "row",
    width : "80%",
    height : "30%",
    marginBottom : 30
},

    textContainer : {
            alignSelf : "center",

    },
   /////////////////////////////////////////////////////////////
   welcomeText : {
    fontFamily : "poppins-bold",
    fontSize : 40,
    color : "white",
    letterSpacing : 5,

},
welcomeTextSmall : {
  fontFamily : "poppins-bold",
  fontSize : 24,
  color : "white",
  letterSpacing : 4,

},
welcomeTextBig : {
  fontFamily : "poppins-bold",
  fontSize : 50,
  color : "white",
  letterSpacing : 5,
}
/////////////////////////////////////////////////////////////

   

});

export default OwnerHomeScreen;