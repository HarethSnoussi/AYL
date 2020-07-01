import React ,{useEffect}  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions} from 'react-native';
import SmallCard  from '../../components/SmallCard';
import { useDispatch,useSelector } from 'react-redux';
import * as offersActions from "../../store/actions/offers";
import * as bookingsActions from "../../store/actions/bookings";
import * as propertyActions from "../../store/actions/propertyActions";
import Colors from "../../constants/Colors.js";

const screen = Dimensions.get("window");
const ClientHomeScreen = props =>{

const playerID= props.navigation.getParam('playerID');  //get Player ID
const playerUID= props.navigation.getParam('playerUID'); 

const dispatch = useDispatch();
const allOffers = useSelector(state =>state.offers.offers);
const allBookings = useSelector(state =>state.bookings.playerBookings);
// console.log(allBookings);


useEffect(()=>{

//  dispatch(offersActions.fetchOffers());
//  dispatch(bookingsActions.fetchPlayerBookings("+213557115451"));
  dispatch(propertyActions.setPropertyStadiums());
  }
  ,[dispatch]);

dispatch(bookingsActions.fetchOwnerBookings("hareth"));
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

            <View style = {styles.firstImage}>
            <Image source = {require("../../assets/pictures/barber2.jpg")} style = {styles.image}  />
                

            </View>



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
      backgroundColor : "#212327"
  },
  firstImage : {
    width : screen.width,
    height :  screen.width / 1.7,
   overflow : "hidden",
   borderBottomLeftRadius: screen.width /4,
   borderBottomRightRadius: screen.width /4,
   position : "absolute",
 
  
  } ,
  image : {
    height : "100%",
    width : "100%",
    resizeMode: 'stretch',
   
},
 
/////////////////////////////////////////////////////////////

   

});

export default ClientHomeScreen;