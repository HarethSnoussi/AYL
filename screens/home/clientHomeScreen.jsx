import React ,{useEffect, useState,useCallback,useRef,Component }  from 'react';
import { StyleSheet, Text, View, ImageBackground , Image ,Dimensions , StatusBar,ActivityIndicator,ScrollView, FlatList, TouchableOpacity,Alert,AppState, LogBox } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Notifications as Notifications2 } from 'expo';
import moment from 'moment';
import {Button ,Overlay} from 'react-native-elements';
import { useDispatch,useSelector } from 'react-redux';
import * as clientActions from '../../store/actions/clientActions';
import Colors from "../../constants/Colors.js";

import TopSalonsCard from '../../components/TopSalonsCard';
import TopBarbersCard from '../../components/TopBarbersCard.jsx';

import { getServices } from '../../store/actions/servicesActions.js';
import { getBarbers} from '../../store/actions/listActions';
import { getClientBookings, sendNotification } from '../../store/actions/bookingsActions.js';

import { expiredbookings } from '../../store/actions/bookingsActions.js';
import { getReviews } from '../../store/actions/reviewsActions';
import { addtoken ,currentToken,getTokens } from '../../store/actions/tokenActions';
import SentOverlay from '../../components/SentOverlay';
import NotifOverlay from '../../components/NotifOverlay';

const screen = Dimensions.get("window");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
LogBox.ignoreAllLogs();

const ClientHomeScreen = props =>{

  // OVerlay after booking Sent

const [sentVisible,setSentVisible] = useState(false);


const allBookings = useSelector(state => state.bookings.bookings);
  //Get ALL Barbers AND SAloons from the store to display three of them
  const allBarbers = useSelector(state => state.lists.barbers) ;
  const allSaloons = useSelector(state => state.lists.saloons) ;
//get Client ID
const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');  
const stepThreeCpt = props.navigation.dangerouslyGetParent().getParam('stepThreeCpt');  

const client= useSelector(state=>state.clients.client);
const tokens = useSelector(state=>state.tokens.clientTokens);



// await dispatch(addtoken({expoToken:"HI",clientId:"557115451"}));
const [isLoading , setLoading] = useState(false);
const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
const [error, setError] = useState();
const dispatch = useDispatch ();

/************************************************************************************************** */
//Notifications 
const [expoPushToken, setExpoPushToken] = useState('');
// const [notification, setNotification] = useState(false);
const [notificationData,setNotificationData]= useState([]);
const [notificationsList,setNotificationsList] = useState([]);

const notificationListener = useRef();
const [visible, setVisible] = useState(false);
const responseListener = useRef();





   /*
   *******Fetch One barber DATA
  */
 const getClient=useCallback(async()=>{
  try{
    setLoading(true);
    await dispatch(getTokens(clientID));
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
    setError(false);
    setIsRefreshing(true);
    setLoading(true);
    await  dispatch(getBarbers());
    await dispatch(getReviews(clientID));
    await dispatch(getClientBookings(clientID));
    await dispatch(expiredbookings(clientID,tokens));
    setIsRefreshing(false);
    setLoading(false);
  
    // await dispatch(expiredbookings("+213553633809"));
    }
    catch(err){
      setError(true);

      throw err ;
    }

},[dispatch,setError]);


useEffect (()=>{
getAllBarbers();

},[dispatch,getAllBarbers]);

useEffect(()=>{
  const willFocusSub= props.navigation.addListener(
    'willFocus',
    () => {
  
      getAllBarbers();
     
    }
  );
  return ()=>{
    willFocusSub.remove();
  };
  },[getAllBarbers]);



/********************************************************************** */

/************NOTIFICATION ***********************************/

useEffect(() => {

  if(client.length !== 0 )
  {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
  }
  




}, [client,tokens]);

useEffect(()=>{

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)


  notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
    // setNotification(notification);

    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    setNotificationData(notificationsList);
  });

  responseListener.current = Notifications.addNotificationResponseReceivedListener(async (notification) => {
 
    const notificationsList = await Notifications.getPresentedNotificationsAsync() ;
    Notifications.dismissAllNotificationsAsync();
    notificationsList.push(notification.notification);
    setNotificationData(notificationsList);
  });



return () => {
  Notifications.removeNotificationSubscription(notificationListener);
  Notifications.removeNotificationSubscription(responseListener);
};



},[])






 //Overlay Handelr
 const sentOverlayHandler = ()=>{
     
  setSentVisible((previous) => !previous);
 
 }


// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'This is a message from Tahfifa ',
    body: 'And here is the body!',
    data: { data: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  
    let finalStatus = existingStatus;
   
    if (existingStatus !== 'granted') {
      console.log(' push notification!');
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
     
      console.log('Failed to get push token for push notification!');
      return;
    }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      let  tokenIndex;
     
      if(tokens.length>0){
       tokenIndex = await tokens.findIndex(
        t => t.clientId === clientID && t.expoToken === token
      );
    
    }

        if(tokenIndex < 0 || tokens.length ===0 ) {
         
            await dispatch(addtoken({expoToken:token , clientId : clientID}))
        }

  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // console.log(token);
  dispatch(currentToken({token}))
  return token;
}



const notificationDataHandler = (list,sender) =>{

   setNotificationData(previous=>previous.filter(e=>e.request.identifier !== list))
   
    toggleOverlay();
    Notifications.dismissNotificationAsync(list);
  

  }
 


/************NOTIFICATION END ***********************************/
/**************OVERLAYS************************** */
useEffect(()=>{

  if(stepThreeCpt != undefined){

        setSentVisible(true);

  }


},[stepThreeCpt]);

const toggleOverlay = () => {

  setVisible(!visible);
  
};
const now = new Date();

/************************************************************************************************** */
/********************************************************************** */
if (error ) {
  return (
    <View style={styles.centered}>
     <View style = {{height : "50%",justifyContent:"center",alignItems:"center",width:"50%"}}>
                     <Image
                        style={{height:"100%",width:"100%",resizeMode:"contain"}}
                        source={require("../../assets/pictures/assest.png")}
                    />
                
            </View> 
      <Text>Une erreur est survenue !</Text>
      <Button
        title="Rafraîchir"
         onPress = {getAllBarbers}
         buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : 25,paddingHorizontal : "5%",marginVertical : "5%"}}
      />
    </View>
  );
}



if (isLoading || allBarbers.length <= 0 ) {

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
   
      <ScrollView  >

            <ImageBackground source = {require("../../assets/pictures/barber4.png")} style = {styles.firstImage}  resizeMode ="stretch" imageStyle ={styles.image} >

        
            <View style = {styles.firstTitle}>  
            <Text style = {styles.titleText}>Retrouvez Votre Coiffeur</Text>
    

<View>
{ notificationData.length >0 && notificationData.map((item,index)=>{

  const e = Platform.OS === "ios" ? item.request.content.data.body : item.request.content.data ;
  return(

  <NotifOverlay 
      key={index}
      close={()=>notificationDataHandler(item.request.identifier,"self")} 
      isVisible = {true} 
      start={e.start}
      end = {e.end}
      address = {e.address}
      bookingDate = {e.bookingDate}
      body = {e.body}
      type = {e.type}
      name = {e.name}
      surname = {e.surname}
      />


)})
  
}
 
    </View>
<View>
<SentOverlay   
          isVisible = {sentVisible} 
          sentOverlayHandler = {sentOverlayHandler}
          url ={require("../../assets/pictures/sentGreen.png")}
          title = "Merci !"
          body = "Votre réservation a été envoyée avec succès"
          buttonTitle = "Fermer"
          overlayType  ="success"
          />
</View>
          
          
            </View>
       
            </ImageBackground>


          <View style = {styles.textTopBarbers}>
                <Text style = {styles.bestText}>
                
                Meilleurs Coiffeurs
                
                </Text>
                <TouchableOpacity  
                onPress={() =>props.navigation.navigate("AllBarbers",{type : "coiffeurs",clientID,overCpt : allBookings.length})} >
                <Text style = {styles.showAll}>
                Tout Afficher
                </Text>
                </TouchableOpacity>
              </View>
              { 
           allBarbers.length > 0 ?
          <ScrollView refreshing={isRefreshing} style ={styles.topBarbers} horizontal showsHorizontalScrollIndicator  = {false} >


           
         {allBarbers.slice(0,3).map((barber , index)=> {
         
         return(
            <TopBarbersCard 
            key = {index} 
             name = {barber.name}
             surname = {barber.surname}
             phone = {barber.phone}
             region = {barber.region}
             wilaya = {barber.wilaya}
             mark = {barber.mark}
             navigateToBarberProfil={()=>props.navigation.navigate("Barber",{barberID : barber.id})}
             navigate = {()=>props.navigation.navigate("BookStepOne",{barberId : barber.id,clientID,name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya,overCpt : allBookings.length})}
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
      backgroundColor : "#fff"
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