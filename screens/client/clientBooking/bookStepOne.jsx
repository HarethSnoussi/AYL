import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Animated ,StyleSheet, Text, View , Dimensions , Platform, ActivityIndicator ,ScrollView, ImageBackground,Image,TouchableOpacity ,UIManager,LayoutAnimation,StatusBar} from 'react-native';
import { Button ,Divider} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import polylanar from "../../../lang/ar";
import polylanfr from "../../../lang/fr";

import Colors from "../../../constants/Colors";
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';


import { getServices } from '../../../store/actions/servicesActions';

import MyCheckBox from '../../../components/MyCheckBox';
import BarberInfos from '../../../components/BarberInfos';
import ServiceTypeMenu from '../../../components/ServiceTypeMenu';
// import Animated, { Easing ,useSharedValue, useAnimatedStyle, withSpring, withTiming ,} from 'react-native-reanimated';

// 


const screen = Dimensions.get("window");
 
const BookStepOne = (props)=> {

// Animated Layout


const [expanded, setExpanded] = useState(false);


// Animated LAyout END




const clientID =   props.navigation.getParam("clientID");
const client= useSelector(state=>state.clients.client);


const barberServices =  useSelector(state => state.services.services);

const dispatch = useDispatch();


const [isOpen , setOpen] = useState(false);

const [isRefreshing, setIsRefreshing] = useState(false);
  //Error Handler
const [error, setError] = useState();

const [isLoading , setLoading] = useState (false);

//Array of ALL choosen Services by the customer
const [pickedServices , setServices] = useState ([]);



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
       
        const arr = await fetch(`http://95.111.243.233:3000/barber/hours/${props.navigation.getParam("barberId")}`);
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
      
        const arr = await fetch(`http://95.111.243.233:3000/bookings/barberBookings/${props.navigation.getParam("barberId")}`);
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

const loadServices = useCallback(async ()=>{
  
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


if(error){
      
  return ( <ImageBackground  source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={{resizeMode:'cover',
  width:'100%', height:'100%',flex :1,justifyContent :"center"}}>
            <StatusBar hidden />
              <View style={{marginBottom:screen.width/36,alignSelf:'center'}}>
                <Text style={styles.noServicesText}>{polylanfr.WeakInternet}</Text>
              </View>
              <Button
                theme={{colors: {primary:'#fd6c57'}}} 
                title={polylanfr.Repeat}
                titleStyle={styles.labelButton}
                buttonStyle={styles.buttonStyle}
                ViewComponent={LinearGradient}
                onPress={loadServices}
                linearGradientProps={{
                    colors: ['#fd6d57', '#fd9054'],
                    start: {x: 0, y: 0} ,
                    end:{x: 1, y: 0}
                  }}/>
          </ImageBackground>);
};


if (isLoading) {
    
    return (
      <ImageBackground  source={{uri:'http://95.111.243.233/assets/tahfifabarber/support.png'}} style= {styles.centered}>
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
                  image={props.navigation.getParam("image")!==null?props.navigation.getParam("image"):'unknown.jpg'}
               />
                </View>

                <View style = {styles.bookingInfoContainer}>
                <View style = {{height : "80%"}}>

                <View style = {styles.addService}>
                    <View style= {{maxHeight : "100%"}}>
                    <Text style = {styles.myServices} >{client[0] && client[0].lang?polylanfr.MyServices:polylanar.MyServices}</Text>
               <ScrollView  refreshing={isRefreshing} showsVerticalScrollIndicator = {false} >
              


   
               { 
                
                      barberServices.map((type,index)=>{
                         
                          return(  
                          
                            <ServiceTypeMenu
                              key = {index}
                              type = {type.name}
                              servicesHandler = {servicesHandler}
                              value = {type.services[0]}
                              services = {type.services}
                              dzdText={client[0] && client[0].lang?polylanfr.DZ:polylanar.DZ}
                              minText={client[0] && client[0].lang?polylanfr.Minute:polylanar.Minute} 
                      />    
                      
                      )

                      })
        }
       

       

                </ScrollView>
             
                </View>
                    </View>
                    <Divider style={{ backgroundColor: 'black' ,width : "80%",alignSelf : "center",marginBottom : "5%"}} />
                    <View style = {styles.totalPrice}>
                        <Text style = {styles.totalText}>{client[0] && client[0].lang?polylanfr.TotalPrice:polylanar.TotalPrice}</Text>
                        <Text style = {styles.totalNumber} >{totalAmount} {client[0] && client[0].lang?polylanfr.DZ:polylanar.DZ}</Text>
                    </View>
                    <View style = {styles.totalTime}>
                        <Text style = {styles.totalText}>{client[0] && client[0].lang?polylanfr.TotalTime:polylanar.TotalTime}</Text>
                        <Text style = {styles.totalNumber} >{totalTime} {client[0] && client[0].lang?polylanfr.Minute:polylanar.Minute} </Text>
                    </View>
               
                    </View>
                   
               
                      <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }} 
                   title = {client[0] && client[0].lang?polylanfr.Continue:polylanar.Continue} 
                   titleStyle = {{fontFamily : "poppins-bold",fontSize : screen.width/28}}
                   buttonStyle = {{borderRadius : Platform.OS === "android" ? screen.width/6.5 : screen.width/18}} 
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
                      image:props.navigation.getParam("image"),
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
      headerTintColor: "#fff",
      
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
       backgroundColor : "#efefef",
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
        color : Colors.blue
        
    },
    totalText : {
    fontFamily : "poppins-bold",
    fontSize : screen.width/26,
    color : Colors.blue
  
    },
    totalNumber : {
        fontFamily : "poppins-bold",
        fontSize : screen.width/26,
        color : "#fd6c57"
    },
    myServices : {
      fontFamily : "poppins-bold",
      fontSize : screen.width/20,
      alignSelf : "center",
      marginVertical : screen.width/72,
      color : Colors.blue
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
    },
    buttonStyle:{
      borderColor:'#fd6c57',
      width:'40%',
      borderRadius:screen.width/18,
      height:screen.width/8,
      marginTop:screen.width/36,
      alignSelf :"center"
      
     },
     labelButton:{
      color:'#FFF',
      fontFamily:'poppins',
      fontSize:screen.width/22.5,
      textTransform:null,

     },
    });
  ///////////////////////////////////////////////////////////////////////////



export default BookStepOne;