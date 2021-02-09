import React from 'react';
import { StyleSheet, Text, View,Dimensions} from 'react-native';
import Colors from "../constants/Colors";
import {Avatar,Rating} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
const screen = Dimensions.get("window");
const BarberInfos = props =>{

  
    return( 
    
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}}  colors={['#fd6c57', '#fd9054']} style = {{height : "100%",width : "100%",justifyContent:"center",alignItems :"center"}} >
                <View style = {{width : "85%",height :"70%",borderRadius :screen.width/72,flexDirection : "row",padding :"5%",justifyContent:'space-between',alignItems :"center"}}>
                <View style = {{width: "30%"}}>

               <Avatar source = {{uri:`http://95.111.243.233/profileImages/barber/${props.image}`}}
                      containerStyle = {{borderWidth:1,borderRadius : screen.width/72,overflow:"hidden"}}
                      size= {screen.width/4}
                />

                </View>
                <View style={{justifyContent:"space-between",width:"60%",alignItems:"flex-start",height:"90%"}}>
                <Text style={styles.barberName}>{props.name+" "+props.surname}</Text>
                <Text style ={styles.barberAdress}>{props.region+"-"+props.wilaya}</Text>
                <View style={{flexDirection :"row",alignItems :"center"}}>
                <Text style ={styles.barberAdress}>{props.mark === null ? 2.5 : props.mark}</Text>
                <Rating 
                   imageSize={screen.width/22.5} 
                   readonly
                   startingValue= {props.mark === null ? 2.5 : props.mark}
                  //  ratingColor = "#FE9654"          
                   type='custom'
                    ratingBackgroundColor={'#fff'}
                    tintColor="#fd9054"
                    style={{marginLeft : screen.width/72}}
                        />
                  </View>
                </View>
                </View>
                </LinearGradient>


     );    
};


const styles= StyleSheet.create({


    firstImage : {
        height :"30%",
        alignItems :"center",
        justifyContent : "center",
        backgroundColor : Colors.primary
   },
//////////////////////////////////////////////////////////////////////////   
   bookingInfoContainer : {
       width : "100%",
       height : "75%",
       backgroundColor : "white",
       borderTopLeftRadius : screen.width/14.4,
       borderTopRightRadius : screen.width/14.4,
        position : "absolute",
        top : "25%",
        overflow : "hidden",
        justifyContent : "space-around",
        paddingVertical : "5%",
        // backgroundColor:"#F5F0EB"
      
   },
////////////////////////////////////////////////////////////////////////////
    totalPrice : {
        flexDirection : "row",
        justifyContent  : "space-between",
        marginBottom : "5%",
        width : "90%",
        alignSelf : "center",
       
        
    },
    totalTime : {

        flexDirection : "row",
        justifyContent  : "space-between",
       
        width : "90%",
        alignSelf : "center",
        // marginBottom : "20%"
     
        
    },
    totalText : {
    fontFamily : "poppins-bold",
    fontSize : screen.width/26,
  
    },
    totalNumber : {
        fontFamily : "poppins-bold",
        fontSize : screen.width/26,
        color : "#fd6c57"
    },
    myServices : {
      fontFamily : "poppins-bold",
      fontSize : screen.width/26,
      alignSelf : "center",
      marginVertical : screen.width/72
      },
    ////////////////////////////////////////////////////////////////////////////////
    addService : {
          height : '70%',
            width: "90%",
            alignSelf: "center",
            marginBottom : "5%"
        
    },
    oneService : {
            justifyContent :"space-between",
            flexDirection :"row",
    
            alignItems : "center"
    },
    info : {
      fontFamily : "poppins",
      color : "#9d9da1",

  fontSize : screen.width/30,
},
barberName :{
  fontFamily : "poppins-bold",
  fontSize : screen.width/24,
  color :"#fff"
},
barberAdress : {
  fontFamily : "poppins",
   color : "#fff",

  fontSize : screen.width/30,

},
   

});


export default BarberInfos;