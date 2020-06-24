import React from 'react';
import { StyleSheet, Text, View, ImageBackground,Image, Dimensions} from 'react-native';
import Card from "../components/Card";

const screen = Dimensions.get('window');

const ProfileChoiceScreen = props =>
{
  let titleStyle = styles.title;
  if (screen.width <= 360) {
    titleStyle = styles.titleSmall ;
    }

  if (screen.height > 800) {
      titleStyle = styles.titleBig;
    }

    return(
      <View style = {styles.container}>
        <ImageBackground 
        source={require('../assets/images/test.jpg')} style={styles.bigBackgroundImage} 
        blurRadius={0}
        fadeDuration = {0}
        >

          <View style = {styles.generalContainer}>

                <View style = {styles.textContainer}> 
                    <Text style = {titleStyle}>
                    Choisissez votre camps
                    </Text>
                </View>

                <View style = {styles.cardsContainer}>
                <Card 
                url = {require("../assets/logo/soccer-field.png")}
                role = "Propriétaire"
                fonctionA = "Louez votre Stade"
                fonctionB = "Louez votre Stade"
                onPress={() =>props.navigation.navigate('SignupOwner')}
                    />

                <Card 
                url = {require("../assets/logo/football-player.png")}
                role = "Joueur"
                fonctionA = "Réservez un créneau"
                fonctionB = "Trouvez un adversaire"
                onPress={() =>props.navigation.navigate('Signup')}
                 />


            </View>
</View>
         </ImageBackground>

      </View>

     );    
};

ProfileChoiceScreen.navigationOptions= ()=>{
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
            flex : 1 ,
        },
        textContainer : {
          justifyContent : "center",
          alignItems :"center",
          marginBottom : 20
    },
  /////////////////////////////////////////////////////////
        title : {
          fontSize : 22 , 
          fontFamily : "poppins-bold" , 
          letterSpacing : 2 , 
          color :"white"
        },
        titleSmall : {
          fontSize : 18 , 
          fontFamily : "poppins-bold" , 
          letterSpacing : 1 , 
          color :"white"
        },
        titleBig : {
          fontSize : 38, 
          fontFamily : "poppins-bold" , 
          letterSpacing : 2 , 
          color :"white",
          marginBottom : 15
        },

/////////////////////////////////////////////////////////////////
        bigBackgroundImage:{
            flex:1,
            justifyContent : "center"
          },
          generalContainer : {
                justifyContent : "center",
                alignItems : "center",
                 width : "100%",
                 height : "100%" ,
              
          },
          cardsContainer : {
            flexDirection : "row",
            justifyContent : "space-around",
            alignItems : "center",
            width : "100%",
            overflow : "hidden",
           
          }
          


});

export default ProfileChoiceScreen;