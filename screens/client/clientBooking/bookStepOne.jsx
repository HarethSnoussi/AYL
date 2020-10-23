import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View , Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator ,ScrollView, FlatList, ImageBackground} from 'react-native';
import { Button ,ButtonGroup,CheckBox,Divider, Avatar,Rating} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';


import ServicePicker from '../../../components/ServicePicker';
import { getServices } from '../../../store/actions/servicesActions';
import { color } from 'react-native-reanimated';
import MyCheckBox from '../../../components/MyCheckBox';
import BarberInfos from '../../../components/BarberInfos';


// const barberServices = [{name : "coupe classique" , price : 350 , duration : 25},{name : "Barbe" , price : 150 , duration : 10},{name : "Keartine" , price : 1500 , duration : 55}];

const screen = Dimensions.get("window");
 
const BookStepOne = (props)=> {
const clientID =   props.navigation.getParam("clientID");
const barberServices =  useSelector(state => state.services.services);

const dispatch = useDispatch();

//Sum of Array elements
const sumArray = (accumulator, currentValue) => accumulator + currentValue;


const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
const [error, setError] = useState();

const [isLoading , setLoading] = useState (false);

//Array of ALL choosen Services by the customer
const [pickedServices , setServices] = useState ([]);

//ID OF the services
const [addedID , setID] = useState([]);

//number of Services 
const [servicesNumber , setServicesNumber] = useState(0);

//Type Added
const [addedTypes , setTypes] = useState([]);

//ALL prices Added
const [addedPrices , setPrices] = useState ([0]);

//All Added Times
const [addedTimes , setAddedTimes] = useState([0]);

//Total Amount State
const [totalAmount,setAmount] = useState(0);

//Total Time State
const [totalTime , setTime] = useState(0);

//Fetched DATA
const [data,setData] = useState([]);

//fetched Bookings 

const [bookings,setBookings] = useState([]);


const checkHandler = ()=>{

  setCheck(previous=>!previous)
}


useEffect(()=>{
 const getData = async ()=>{
    try {
        setError(false);
        setIsRefreshing(true);
        setLoading(true);

        const arr = await fetch(`http://173.212.234.137:3000/barber/hours/${props.navigation.getParam("barberId")}`);
        const resData = await arr.json ();
       
        setData([...resData]);
        setIsRefreshing(false);
        setLoading(false);
        }
    
    catch (error) {
        console.log("There is an Error");
        setError(true);
        throw error;
    }

    try {
        setError(false);
        setIsRefreshing(true);
        setLoading(true);
       
        const arr = await fetch(`http://173.212.234.137:3000/bookings/barberBookings/${props.navigation.getParam("barberId")}`);
         const resData = await arr.json ();
     
        setBookings([...resData]);
        setIsRefreshing(false);
        setLoading(false);

        }
    
    catch (error) {
        console.log("There is an Error");
        setError(true);
        throw error;

    }


 };
getData();
},[props.navigation.getParam("barberId")]);

/************************************************************************* */

const loadServices = useCallback(async()=>{
    try{
        setError(false);
        setIsRefreshing(true);
        setLoading(true);
        await dispatch(getServices(props.navigation.getParam("barberId")));
        setIsRefreshing(false);
        setLoading(false);

      }catch(err){
        console.log(err);
        setError(true);
        throw err ;
      }

},[dispatch,setError])

//GET THE SERVICES
useEffect(()=>{
    
    loadServices();

},[dispatch,loadServices,setError]);


/************************************************************************* */


const servicesHandler = (service,bool)=>{
  if(!bool)
   {
     setServices(previous => {
        return [...previous,  {...service }];
      });
      setAddedTimes(previous=>[...previous,service.duration]);
      setPrices(previous=>[...previous,service.price]);
      // setAmount(addedPrices.reduce(sumArray));
      // setTime(addedTimes.reduce(sumArray));
      setAmount(previous=>previous+service.price);
      setTime(previous=>previous+service.duration);
    
    }
    else {
      
      setServices(prev=>{
        return prev.filter((e) => {return(e.name !== service.name)});
      })
      setAmount(previous=>previous-service.price);
      setTime(previous=>previous-service.duration);
    }
}

if (error) {
    
    return (
      <View style={styles.centered}>
        <Text>Une erreur est survenue !</Text>
        <Button
          title="Rafraîchir"
           onPress = {loadServices}
           buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : 25,paddingHorizontal : "5%",marginVertical : "5%"}}
        />
      </View>
    );
  }

if (isLoading) {
    
    return (
      <ImageBackground style= {styles.centered} source={require('../../../assets/images/support.png')}>
        <ActivityIndicator size="large" color= {Colors.primary} />
      
      </ImageBackground>
    );
}

return (
            <View style= {styles.container}>
                <View style = {styles.firstImage}>

                {/* <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   /> */}
               <BarberInfos 
                  name = {props.navigation.getParam("name")}
                  surname = {props.navigation.getParam("surname")}
                  wilaya = {props.navigation.getParam("wilaya")}
                  region = {props.navigation.getParam("region")}
                  mark = {props.navigation.getParam("mark")}
               />
                </View>

                <View style = {styles.bookingInfoContainer}>
                <View style = {{height : "80%"}}>

                <View style = {styles.addService}>
                    <View style= {{maxHeight : "100%"}}>
                    <Text style = {styles.myServices} >Mes Services</Text>
               <ScrollView  refreshing={isRefreshing} >
               
               { 
                
                      barberServices.map((service,index)=>{

                          return(  
                          
                            <MyCheckBox
                              key = {index}
                              name = {service.name}
                              price = {service.price}
                              duration = {service.duration}
                              setCheck = {checkHandler}
                              servicesHandler = {servicesHandler}
                              value = {service}
                              
                      />    
                      
                      )

                      })

        }

                </ScrollView>
             
                </View>
                    </View>
                    <Divider style={{ backgroundColor: 'black' ,width : "80%",alignSelf : "center",marginBottom : "5%"}} />
                    <View style = {styles.totalPrice}>
                        <Text style = {styles.totalText}>Prix Total : </Text>
                        <Text style = {styles.totalNumber} >{totalAmount} DZD</Text>
                    </View>
                    <View style = {styles.totalTime}>
                        <Text style = {styles.totalText}>Temps Total : </Text>
                        <Text style = {styles.totalNumber} >{totalTime} MIN </Text>
                    </View>
               
                    </View>
                   
               
                      <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }} 
                   title = "Continuer" 
                   titleStyle = {{fontFamily : "poppins-bold",fontSize : screen.width/28}}
                   buttonStyle = {{borderRadius : Platform.OS === "android" ? 55 : 20}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                onPress = { ()=> totalTime >0 && props.navigation.navigate(
                    "BookStepTwo", 
                    { duration: totalTime,
                      amount : totalAmount,
                      services : pickedServices,
                      barber : props.navigation.getParam("barberId"),
                      workingTime : data,
                      bookings : bookings,
                      clientID,
                      name:props.navigation.getParam("name"),
                      surname:props.navigation.getParam("surname"),
                      mark:props.navigation.getParam("mark"),
                      region:props.navigation.getParam("region"),
                      wilaya:props.navigation.getParam("wilaya"),
                      overCpt :props.navigation.getParam("overCpt")
                     })
                     }
                   /> 
                    

                </View>
                

            </View>



)


}

BookStepOne.navigationOptions = ()=> {
    return {
      headerTransparent : true,
      title : "" ,
      headerBackTitle : " ",
      headerTintColor: "#fff" 
    }

}


const styles= StyleSheet.create({
   
   container : {
            flex : 1 ,
   },
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
       borderTopLeftRadius : 25,
       borderTopRightRadius : 25,
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
      marginVertical : 5
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
    //////////////////////////////////////////////////////
    centered: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:'100%',
        resizeMode:'cover'
      }
    });
  ///////////////////////////////////////////////////////////////////////////



export default BookStepOne;