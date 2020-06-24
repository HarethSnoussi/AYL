import React, { useState } from 'react';
import { Overlay } from 'react-native-elements';
import { Text, View, Button,StyleSheet,Alert,ActivityIndicator} from 'react-native'; 
import {Ionicons} from "@expo/vector-icons";
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import * as bookingsActions from "../store/actions/bookings";

const BookingDetail = (props)=>{

const [isLoading , setLoading] = useState (false);



const dispatch = useDispatch();
const createTwoButtonAlert = () =>
    Alert.alert(
      "Alerte",
      "Etes vous sur de vouloir annuler cette réservation",
      [
        {
          text: "Non",
          style: "cancel"
        },
        { text: "Oui", onPress: () => cancelBooking() }
      ],
      { cancelable: false }
    );
const cancelBooking =async ()=>{
        setLoading(true);
        await dispatch(bookingsActions.cancelBooking(props.date,props.playerId));
      
         props.overlayHandler();
        setLoading(false);
}; 

if (isLoading) {
        return (
          <View style= {styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          
          </View>
        );
      }

return(
<View >

<Overlay overlayStyle= {styles.overlay}  isVisible={props.isVisible} >

      <View>
      <View style={{alignSelf :"center"}}>
      <Text style={{fontFamily : "poppins-bold",color :"white",fontSize : 25}}>
      Réservation
      </Text>
      </View>
                <View style ={styles.icons}>
                        <TouchableOpacity style = {styles.icon}>
                        <Ionicons 
                        name="md-call" 
                        size={26} 
                        color="green" 

                        />
                        <Text style={styles.smallText}>
                        Appeler
                        </Text>

                        </TouchableOpacity>
                        <View style = {styles.icon}>
                        <Ionicons 
                        name="ios-close-circle-outline" 
                        size={26} 
                        color={Colors.primary}
                        onPress = {()=>createTwoButtonAlert()}

                        />
                         <Text style={styles.smallText}>
                        Annuler
                        </Text>
                        </View>
                        <View style = {styles.icon}>
                        <Ionicons 
                        name="ios-checkbox-outline" 
                        size={26} 
                        color={Colors.secondary}
                        onPress = {props.overlayHandler}
                        />
                         <Text style={styles.smallText}>
                        OK
                        </Text>
                        </View>
                        
                </View>

                <View style={styles.row}>

                        <View style={{}}>

                        <Ionicons 
                        name="md-time" 
                        size={24} 
                        color="white" 

                        />
                        </View>
                        <View style={{width:"85%"}}>
                                <Text style={styles.mainText}>
                                Date
                                </Text>
                                <Text style={styles.smallText}>
                                Thursday,March 21st,2019
                                </Text>
                                <Text style={styles.smallText}>10:00-11:00</Text>
                        </View>

                </View>

                <View style={styles.row}>

                        <View style={{}}>

                        <Ionicons 
                        name="ios-football" 
                        size={24} 
                        color="white" 

                        />
                        </View>
                        <View style={{width:"85%"}}>
                                <Text style={styles.mainText}>Service</Text>

                                <Text style={styles.smallText}>Temps : {props.time}</Text>
                                <Text style={styles.smallText}>Stade : 5x5</Text>
                        </View>

                </View>

                <View style={styles.row}>

                        <View style={{}}>

                        <Ionicons 
                        name="md-close-circle" 
                        size={24} 
                        color="white" 

                        />
                        </View>
                        <View style={{width:"85%"}}>
                                <Text style={styles.mainText}>Annulation</Text>

                                <Text style={styles.smallText}>L'annulation devrait se faire à maximum 1 heure avant le début de la partie</Text>
                                
                        </View>

                </View>

                 <View style={styles.row}>

                        <View style={{}}>

                        <Ionicons 
                        name="ios-card" 
                        size={24} 
                        color="white" 

                        />
                        </View>
                        <View style={{width:"85%"}}>
                                <Text style={styles.mainText}>Prix</Text>

                                <Text style={styles.smallText}>
                                Prix Total : 3500 DA
                                </Text>
                                <Text style={styles.smallText}>
                                Prix par joueur : 350 DA
                                </Text>
                                
                        </View>

                </View>





      </View>

        
</Overlay>

</View>

)


};


const styles = StyleSheet.create({
overlay : {
        backgroundColor :   "#323232",
        width:"90%"
},
icons :{
        flexDirection : "row",
        backgroundColor:"rgba(80, 80, 80,0.7)",
        justifyContent : "space-around",
        
        marginVertical : 10,
        alignItems : "center",
        borderRadius : 15

},
icon :{
alignItems : "center",
paddingVertical : 10

},
row :{
        flexDirection:"row",
        justifyContent:"space-around",
        backgroundColor:"rgba(80, 80, 80,0.7)",
        marginVertical : 2,
        paddingVertical : 5,
        
},
mainText :{
        color :"white",
        fontFamily : "poppins-bold",
},
smallText : {
color : "white",
fontFamily : "poppins",

},
  //////////////////////////////////////
  centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
   
      }
    



});

export default BookingDetail;