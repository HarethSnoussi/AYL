import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View , Picker,Image, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator ,ScrollView, FlatList, ImageBackground} from 'react-native';
import { Button ,ButtonGroup} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

import moment from 'moment';
import Colors from "../../../constants/Colors";
import { FontAwesome } from '@expo/vector-icons'; 
import 'moment/locale/fr';
import { useDispatch, useSelector } from 'react-redux';


import ServicePicker from '../../../components/ServicePicker';
import { getServices } from '../../../store/actions/servicesActions';


// const barberServices = [{name : "coupe classique" , price : 350 , duration : 25},{name : "Barbe" , price : 150 , duration : 10},{name : "Keartine" , price : 1500 , duration : 55}];

const screen = Dimensions.get("window");
 
const BookStepOne = (props)=> {
const clientID =   props.navigation.getParam("clientID");
const barberServices =  useSelector(state => state.services.services);

const dispatch = useDispatch();

//Sum of Array elements
const sumArray = (accumulator, currentValue) => accumulator + currentValue;

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
const [addedPrices , setPrices] = useState ([]);

//All Added Times
const [addedTimes , setAddedTimes] = useState([]);

//Total Amount State
const [totalAmount,setAmount] = useState(0);

//Total Time State
const [totalTime , setTime] = useState(0);

//Fetched DATA
const [data,setData] = useState([]);

//fetched Bookings 

const [bookings,setBookings] = useState([]);

useEffect(()=>{
 const getData = async ()=>{
    try {
        setLoading(true);

        const arr = await fetch(`http://173.212.234.137:3000/barber/hours/${props.navigation.getParam("barberId")}`);
        const resData = await arr.json ();
       
        setData([...resData]);
        setLoading(false);
        }
    
    catch (error) {
        console.log("There is an Error");
        throw error;
    }

    try {
        setLoading(true);
       
        const arr = await fetch(`http://173.212.234.137:3000/bookings/barberBookings/${props.navigation.getParam("barberId")}`);
         const resData = await arr.json ();
     
        setBookings([...resData]);
        setLoading(false);

        }
    
    catch (error) {
        console.log("There is an Error");
        throw error;

    }


 };
getData();
},[props.navigation.getParam("barberId")]);

/************************************************************************* */

const loadProducts = useCallback(async()=>{
    try{
        setLoading(true);
        await dispatch(getServices(props.navigation.getParam("barberId")));
        setLoading(false);

      }catch(err){
          console.log(err);
        throw err ;
      }

},[dispatch])

//GET THE SERVICES
useEffect(()=>{
    
    loadProducts();

},[dispatch,loadProducts]);


/************************************************************************* */



//ADD AND UPDATE SERVICES
const setServicesHandler= (service,id)=>{
   setServices(previous => {
        return [...previous,  {...service }];
      });
    //   setServicesNumber(old=>old+1);
    //   setID(previous=>{return([...previous,id])});
      setTypes(previous=>[...previous,service.name]);
      setPrices(previous=>[...previous,service.price]);
      setAddedTimes(previous=>[...previous,service.duration]);
}

const updateService =  (service,id) =>{

    setServices(
        prev =>{
        prev[id].id = service.id;
        prev[id].name = service.name;
        prev[id].price = service.price;
        prev[id].duration = service.duration;

        return [...prev];
    });
    setTypes(prev =>{
        prev[id] = service.name;
        return [...prev];
       
    });

    setPrices(prev =>{
        prev[id] = service.price;
        setAmount(addedPrices.reduce(sumArray));
        return [...prev];
    });

    setAddedTimes(prev =>{
        prev[id] = service.duration;
        setTime(addedTimes.reduce(sumArray));
        return [...prev];
    });

}


//DELETE SERVICES
const deleteService = async (id)=>{
    setLoading(true);
const removeService = await (() => {
 setServices(prev=>{
        return prev.filter((service,index) => { return(index !== id)});
})

// setServicesNumber(old=>old-1);

// setID(prev=>{
//     return prev.filter(service =>{return (prev.indexOf(service) != id)})
// })

 setTypes(prev =>{
    return prev.filter((service , index ) =>{return (index !== id)})
});

 setPrices(prev =>{
    setAmount(prev => prev - addedPrices[id]);
    return prev.filter((service ,index) =>{return (index !== id)})
});

 setAddedTimes(prev =>{
    setTime(prev => prev - addedTimes[id]);
    return prev.filter((service,index) =>{return (index !== id)})
});
})
removeService();
setLoading(false);
 
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

                <Image source = {require("../../../assets/pictures/barber2.jpg")} style = {{height : "100%",width : "100%"}}   />

                </View>

                <View style = {styles.bookingInfoContainer}>
                <View style = {{height : "80%"}}>
                    <View style = {styles.totalPrice}>
                        <Text style = {styles.totalText}>Prix Total : </Text>
                        <Text style = {styles.totalNumber} >{totalAmount} DZD</Text>
                    </View>
                    <View style = {styles.totalTime}>
                        <Text style = {styles.totalText}>Temps Total : </Text>
                        <Text style = {styles.totalNumber} >{totalTime} MIN </Text>
                    </View>


                    <View style = {styles.addService}>
                    <View style= {{maxHeight : "100%"}}>
               <ScrollView >
                {
                pickedServices.map((service,index)=>{
                  
                    return ( 
                        <ServicePicker 
                        key = {index}
                        id = {index}
                        updateService = {updateService} 
                        barberServices = {barberServices} 
                        addedTypes = {addedTypes}
                        deleteService = {deleteService}
                        service = {service}
                        />   
                            )

                })
                
                }
                </ScrollView>
                  {
                        pickedServices.length < barberServices.length &&
                      
                        <Button 
                        onPress = {()=>setServicesHandler({id : 0 ,name : " " , price : 0 , duration : 0})} title = "Ajouter un Service"
                        containerStyle = {{width : "40%",alignSelf : "center",marginVertical : "5%" , }}
                        titleStyle  = {{fontSize : screen.width/30,fontFamily : "poppins",color : "#fff"}}
                        type="outline" 
                        buttonStyle = {{backgroundColor : "#fd6c57",borderColor :"#fd6c57"}}
                        />
                  }
                </View>
                  
                  
                    </View>

                    
                    </View>
                   
               
                      <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center"  }} 
                   title = "Continuer" 
                   titleStyle = {{fontFamily : "poppins-bold",fontSize : screen.width/28}}
                   buttonStyle = {{borderRadius : 55}} 
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
                      clientID
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
      title : "Réserver Un Service" ,
      headerBackTitle : " ",
      headerTintColor: "#fff" 
    }

}


const styles= StyleSheet.create({
   
   container : {
            flex : 1 ,
   },
   firstImage : {
        height :"30%"
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
        justifyContent : "space-around"
      
   },
////////////////////////////////////////////////////////////////////////////
    totalPrice : {
        flexDirection : "row",
        justifyContent  : "space-between",
        marginVertical : "5%",
        width : "90%",
        alignSelf : "center",
        
    },
    totalTime : {
        
        flexDirection : "row",
        justifyContent  : "space-between",
       
        width : "90%",
        alignSelf : "center",
     
        
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
    ////////////////////////////////////////////////////////////////////////////////
    addService : {
            height : "80%",
            width: "90%",
            alignSelf: "center",
        
    },
    oneService : {
            justifyContent :"space-between",
            flexDirection :"row",
    
            alignItems : "center"
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