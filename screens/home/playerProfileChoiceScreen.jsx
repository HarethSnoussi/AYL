import React ,{useEffect,useCallback }  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions} from 'react-native';
import SmallCard  from '../../components/SmallCard';
import { useDispatch} from 'react-redux';
import * as playerActions from '../../store/actions/playerActions';

const screen = Dimensions.get("window");
const PlayerProfileChoiceScreen = props =>{

const playerID= props.navigation.getParam('playerID');  //get Player ID

const playerUID= props.navigation.getParam('playerUID');  //get Player UID firebase
const dispatch = useDispatch();
//get the player's data

  
let welcomeTextStyle = styles.welcomeText;

  if(screen.width < 350) {
    welcomeTextStyle = styles.welcomeTextSmall;
  }

  if (screen.height > 800) {
    welcomeTextStyle = styles.welcomeTextBig;
    
  }
//***************************************************************************

  /*
   *******Fetch One player DATA
  */
  const getPlayer=useCallback(async()=>{
    try{
      dispatch(playerActions.setPlayer(playerID));
      }catch(err){
        console.log(err);
      }
  },[dispatch]);

  useEffect(()=>{
   getPlayer();
  },[dispatch,getPlayer]);

  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getPlayer);
    return ()=>{
      willFocusSub.remove();
    };
  },[getPlayer]);


    return(
      <View style ={styles.container}>
        <ImageBackground source = {require("../../assets/images/test.jpg")}  style = {styles.backgroudnImage}>
         
         <View style = {styles.textContainer}>
            <Text style = {welcomeTextStyle}>MON PROFILE</Text>

         </View>

          <View style = {styles.rowsContainer}>
              <View style = {styles.rowOne}>
                  <SmallCard 
                  image ={require("../../assets/logo/files.png")} 
                  screen = "Informations personnelles"
                  onPress = {() =>props.navigation.navigate('PlayerProfileScreen')}
                  />
                  
                  <SmallCard
                  image ={require("../../assets/logo/closed.png")} 
                  screen = "Paramètres et confidentialité"
                  onPress = {() =>props.navigation.navigate('PlayerSettings',{playerUID:playerUID})}
                   />

              </View> 

            
            </View>

        </ImageBackground>


      </View>

     );    
};

PlayerProfileChoiceScreen.navigationOptions= ()=>{
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
      width : "90%",
      height : "50%",
    
      
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

export default PlayerProfileChoiceScreen;