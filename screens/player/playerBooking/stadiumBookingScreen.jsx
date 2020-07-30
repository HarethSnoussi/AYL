import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Text, View , Picker,ImageBackground, Dimensions , StatusBar, Platform,ActionSheetIOS, ActivityIndicator,ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { RadioButton , Button} from 'react-native-paper';
import moment from 'moment';
import Colors from "../../../constants/Colors";
import {Ionicons} from "@expo/vector-icons";

import { useDispatch, useSelector } from 'react-redux';
import * as offersActions from "../../../store/actions/offers";

import ConfirmBookingOverlay from "../../../components/ConfirmBookingOverlay";

const screen = Dimensions.get("window");


// 10 next Days and OWN TIME PICKER
let days = [];
let hours = [
{id : "1",time : "05:00"},
{id : "2",time : "05:30"},
{id : "3",time : "06:00"},
{id : "4",time : "06:30"},
{id : "5",time : "07:00"},
{id : "6",time : "07:30"},
{id : "7",time : "08:00"},
{id : "8",time : "08:30"},
{id : "9",time : "09:00"},
{id : "10",time : "09:30"},
{id : "11",time : "10:00"},
{id : "12",time : "10:30"},
{id : "13",time : "11:00"},
{id : "14",time : "11:30"},
{id : "15",time : "12:00"},
{id : "16",time : "12:30"},
{id : "17",time : "13:00"},
{id : "18",time : "13:30"},
{id : "19",time : "14:00"},
{id : "20",time : "14:30"},
{id : "21",time : "15:00"},
{id : "22",time : "15:30"},
{id : "23",time : "16:00"},
{id : "24",time : "16:30"},
{id : "25",time : "17:00"},
{id : "26",time : "17:30"},
{id : "27",time : "18:00"},
{id : "28",time : "18:30"},
{id : "29",time : "19:00"},
{id : "30",time : "19:30"},
{id : "31",time : "20:00"},
{id : "32",time : "20:30"},
{id : "33",time : "21:00"},
{id : "34",time : "21:30"},
{id : "35",time : "22:00"},
{id : "36",time : "22:30"},
{id : "37",time : "23:00"},
{id : "38",time : "23:30"},
{id : "39",time : "00:00"},
{id : "40",time : "00:30"},
{id : "41",time : "01:00"},
{id : "42",time : "01:30"},
{id : "43",time : "02:00"},
{id : "44",time : "02:30"},
{id : "45",time : "03:00"},
{id : "46",time : "03:30"},
];



for(let i=0 ; i<=10 ; i++){
    days.push(
      {
     id : i.toString() ,
     date : moment().add(i, 'days').format("YYYY-MM-DD"),
     get day() {
        return moment(this.date).format("ddd")

     }
    },
     
      );

}

const hoursNoId = hours.map(e=>e.time);

const StadiumBookingScreen =  props =>{


  useEffect(()=>{
    const ownerId = props.navigation.getParam("ownerId") ;
    const getOffers = async()=>{ 
     
      setLoading(true);
       await dispatch(offersActions.fetchOffers(ownerId));
     
       setLoading(false);
       
    }
    getOffers();
    }
    
    ,[dispatch]);


  const myFlat = useRef(null);
////////////////////////////////////////////////////////////////
const dispatch =  useDispatch();
const [isLoading , setLoading] = useState (false);
const allOffers =  useSelector(state =>state.offers.offers);
const ownerBookings = useSelector(state => state.bookings.ownerBookings);






//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



//GET ALL STadiums that exist and avoid duplicated elements
let allStadiums=[] ;
let stadiumsType =  allOffers.map((item,index) => {
    return item.stadiumsType;

});

stadiumsType.forEach(element => {
  
      if(allStadiums.indexOf(element) === -1)
        {allStadiums.push(element);}
}

);

/////////////////////////////////////////////////////
//GET ALL matchTime types that exist in our dummy Data and match to the match type without duplicates
let allTimes = [];
let timesFilteredToShow=[];
let timesFiltered = allOffers.filter(element=>

              element.stadiumsType );

timesFiltered.forEach(e=>{
 
  if(timesFilteredToShow.indexOf(e.matchTimeType)<0){
  
    timesFilteredToShow.push(e.matchTimeType)
  
  }}
  
  );



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//Responsivity //
let iconSize = 22 ;
let nameTextStyle = styles.nameText;
let typeStyle = styles.typeStyle;
let timeTextStyle = styles.timeText;
let calendarCardStyle = styles.calendarCard ;
let calendarDayStyle = styles.calendarDay;
let calendarDateStyle = styles.calendarDate;
let matchTypeStyle = styles.matchType;
let matchTimeStyle = styles.matchTime;
let partyTimeStyle = styles.partyTime ;
let priceTextStyle = styles.priceText;
let priceButtonStyle =  styles.priceButton;
let tempsDuMatchStyle = styles.tempsDuMatch ;
//Big Screen Design 
if(screen.height > 800) {
    iconSize = 30 ;
    nameTextStyle = styles.nameTextBig;
    typeStyle = styles.typeStyleBig;
    timeTextStyle = styles.timeTextBig;
    calendarCardStyle = styles.calendarCardBig;
    calendarDayStyle = styles.calendarDayBig;
    calendarDateStyle = styles.calendarDateBig;
    matchTypeStyle = styles.matchTypeBig;
    matchTimeStyle = styles.matchTimeBig;
    partyTimeStyle = styles.partyTimeBig ;
    priceTextStyle = styles.priceTextBig;
    priceButtonStyle = styles.priceButtonBig;
    tempsDuMatchStyle = styles.tempsDuMatchBig ;
}

if(screen.width <= 360) {
  
  iconSize = 14 ;
  nameTextStyle = styles.nameTextSmall;
  matchTypeStyle = styles.matchTypeSmall;
  typeStyle = styles.typeStyleSmall;
  matchTimeStyle = styles.matchTimeSmall;
  timeTextStyle = styles.timeTextSmall;
  calendarCardStyle = styles.calendarCardSmall;
  calendarDayStyle = styles.calendarDaySmall;
  calendarDateStyle = styles.calendarDateSmall;
  partyTimeStyle = styles.partyTimeSmall ;
  priceButtonStyle = styles.priceButtonSmall;
  priceTextStyle = styles.priceTextSmall;
  tempsDuMatchStyle = styles.tempsDuMatchSmall ;
}
/////////////////////////////////////////////////////////////////
    const [overlayState , setOverlayState]=useState(false);
    const [selectedOffer , setSelectedOffer] = useState(false);
    const [priceState , setPrice] = useState(0);
    const [customOffer , setCustomOffer] = useState();

    
    //Match Type State 5x5 6x6 7x7 ....
    const [matchTypeState , setMatchType] = useState();
    //Match Time State 1h 1h30 2h 
    const [matchTimeState , setMatchTime] = useState();
    
useEffect(()=>{
  setMatchType(allStadiums[0]);
  setMatchTime(timesFilteredToShow[0]);
}, [allStadiums[0],timesFilteredToShow[0]]);
    //Selected Date State with the full date and the day 
    const [selectedDateState , setSelectedDate] = useState({
        id : "0",
        day :"0",
        date : "0"

    });

    
    //Selected Playing Hour 
    const [selectedId , setSelectedId] = useState(1);

    //Selected Playing Hour 
    const [selectedHour , setSelectedHour] = useState("0");

    //Created day's hours 
    const [hoursState , setHoursState] = useState ([]);

    //Create day's hours without ID 
     const [hoursStateTime , setHoursTime] = useState([]);

    //Custom radio buttons for time
    const [buttonState , setButtonState] = useState({
              id : 0 ,
              color : ""
    });

    //Overlay Handelr
    const overlayHandler = ()=>{
     
      setOverlayState((previous) => !previous);

    }


    //Selected Match type handler (Set the match type)
    const matchTypeHandler = (itemValue, itemIndex) => {
        setMatchType(itemValue);
        if(myFlat.current !=null ){
          myFlat.current.scrollToIndex({animated: true, index :0})
          setButtonState({
            id : 0 ,
            color : ""
  });
          // setSelectedOffer(false);
          setPrice(0);
          setSelectedHour("0");

        }
        
    };

    //Selected Match time type handler (set the match time)
    const matchTimeHandler = (itemValue)=>{
        setMatchTime (itemValue);

        if(myFlat.current !=null ){
          myFlat.current.scrollToIndex({animated: true, index :0})
          setButtonState({
            id : 0 ,
            color : ""
  });
          // setSelectedOffer(false);
          setPrice(0);
          setSelectedHour("0");

        }
      

    };
  

    

    //Selected Date (set the selected date)
    const selectedDateHandler = (v)=> {
    
        setSelectedDate(v);

       if(myFlat.current !=null ){

        myFlat.current.scrollToIndex({animated: true, index :0})
        setButtonState({
          id : 0 ,
          color : ""
          });
        // setSelectedOffer(false);
        setPrice(0);
        setSelectedHour("0");

          }
  

    };

    //Selected time to play the game 
    const buttonsHandler = (e)=> {
     
      setButtonState({
        id : e ,
       color : Colors.secondary });
     
    };


    const setHoursStateHandler = (slots)=>{

        setHoursState(previous => [...previous,...slots]);
    };

   const  setHoursTimeStateHandler = (slots)=>{

      setHoursTime(previous => [...previous,...slots]);
  };

 //////////////////////////////////////////////////////////
    
  //PUT THE SLOTS AND THE OFFERS THAT WE ALREADY CALCULATED
   const [aTest,setATest]=useState([]);

   const aTestHandler= (v)=>{
  //   let myArray = aTest.map(e=>e.day);
  //   let types = aTest.map(e=>e.type);
  //   let times = aTest.map(e=>e.time);
    
  //   console.log(v.time);
  //    if(v.day !=0 && myArray.indexOf(v.day)===-1 && v.slots.length !=0 && times.indexOf(v.time)===-1 && types.indexOf(v.type)===-1  )
  //  {
  //   console.log("gg");
    setATest(previous=>[...previous,v])
    
  // }


    
   };
////////////////////////////////////////////////////
   const countElement = (array,element) =>{
     let count = 0 ;
        array.forEach(e=>{
          if(e === element) {
              count ++ ;
          
          }


        })
return count ;
   };


    //////////////////////////////////////////////////////////
    //GET ONLY THE GAME TIMES THAT MATCHES WITH THE SELECTED TYPE AND TIME AND REMOVE THE EXISTING BOOKINGS
/******************************************************** */
      useEffect(()=> {

      setHoursState([]);
      let hoursDay = [];
      let  existingBookings = [];
      let a= [] ;
      let b = [];
      let customOffers = [];
      let existingOffer = [];
    
      if(selectedDateState.day !=0) {
      

       customOffers = allOffers.filter(element => element.stadiumsType === `${matchTypeState}` && element.matchTimeType ===`${matchTimeState}` && element.offerDays.indexOf(selectedDateState.day) > -1);

       //////////////////////////////////////////
     //let  existingOfferDays = aTest.map(e=>e.day);

     existingOffer = aTest.filter(element => element.type === `${matchTypeState}` && element.time ===`${matchTimeState}` && element.day === selectedDateState.date);
     if(customOffers.length >0 )
       {
        
       const customOffersHours = customOffers.map(element =>element.horraires);
       customOffersHours.forEach(e=>e.forEach(element=>a.push(element)));
       
   
       b = a.filter(e=>e.day === selectedDateState.day);
       setCustomOffer(b);
       b.map(e=>hoursDay.push(e.horraires));
      //  console.log(customOffers[0].stadmiumNumber);
      
     
      existingBookings = ownerBookings.filter(element => 
       element.bookingDate === selectedDateState.date && element.typeMatch === matchTypeState && element.status === "confirmée");
       //get The stars so we won't overBook
     
      
    }

      } 
      // else{
      
      //   const timeChange = allOffers.find(element => element.stadiumsType === `${matchTypeState}`);

      //   //setMatchTime(timeChange.matchTimeType);
      // }
let allStarts = existingBookings.map(e=>e.start); 
if(existingOffer.length === 0) {


if(hoursDay.length != 0) {

  
  let availableSlots = []
  let availableSlotsTimes = []
  let z = [];
  hoursDay.forEach(daysHours => {


if(matchTimeState === "1h"){ 
  
  availableSlots = hours.slice(hoursNoId.indexOf(daysHours[0] ),hoursNoId.indexOf(daysHours[1])-1);
 
}

else if (matchTimeState === "1h30"){
   availableSlots = hours.slice(hoursNoId.indexOf(daysHours[0] ),hoursNoId.indexOf(daysHours[1])-2);

  }


availableSlotsTimes =availableSlots.map(element=>element.time);
let uncutedSlotsTimes = hours.map(element=>element.time);
//All start and end of the selected days
let startEnd = existingBookings.map(element=>{
return {start : element.start , end : element.end , time :element.timeMatch,index : hoursNoId.indexOf(element.end)}
}
  
) ;



let allTies=[];
//Remove the existing bookings from our available slots 
startEnd.forEach(element=>
{ 
let filt = startEnd.filter(startend=> startend.start === element.start) ;

availableSlotsTimes = availableSlots.map(element=>element.time);


// if(filt.length===customOffers[0].stadmiumNumber ) {
//   let endIndexes = filt.map(e=>e.index);

//   if(element.index === Math.min.apply(null,endIndexes)){
    let test = [];

    if(matchTimeState ==="1h"){
    
     test = hoursNoId.slice(hoursNoId.indexOf(element.start)-1,hoursNoId.indexOf(element.end));
     
    }
    else if (matchTimeState ==="1h30"){
    
      test = hoursNoId.slice(hoursNoId.indexOf(element.start)-2,hoursNoId.indexOf(element.end));
    }

    test.forEach(slot => {
      allTies.push(slot);
      if(countElement(allTies,slot)=== customOffers[0].stadmiumNumber) {


    
      if(availableSlotsTimes.indexOf(slot)>=0 ){
   
      availableSlots.splice(availableSlotsTimes.indexOf(slot),1);
   

        availableSlotsTimes.splice(availableSlotsTimes.indexOf(slot),1);}
      
      }
    });


   
//   }
// }

} );
z = [...z,...availableSlots];

setHoursStateHandler(availableSlots);
setHoursTimeStateHandler(availableSlotsTimes);

});

aTestHandler({time : matchTimeState, type : matchTypeState ,day : selectedDateState.date,slots :z});

//  setSelectedOffer(true);
  
} 

//if there is no slots for the selected day
else {
  // setSelectedOffer(false);
  setHoursState([]);

}
}

else {


  // let choosen = aTest.filter(e=>e.day === selectedDateState.day);

 
  setHoursStateHandler(existingOffer[0].slots);
  // setSelectedOffer(true);
}


 },[matchTypeState,matchTimeState,selectedDateState]);
/******************************************************** */
/******************************************************** */


//CALL THIS ONLY WHEN THE HOUR HAS CHANGED
 useMemo(()=>{ 

   if(selectedHour != "0"){
      
    let availableSlots = [];
    
    customOffer.forEach(e=>{
      
       availableSlots = hoursNoId.slice(hoursNoId.indexOf(e.horraires[0] ),hoursNoId.indexOf(e.horraires[1])+1);
     
      if(availableSlots.indexOf(selectedHour) != -1) {
         
        setPrice(e.price);
        setSelectedId(e.serviceId);
       
      }
      


    });

}

 },[selectedHour]);

//Selected Days  slots to display 
const mylist = (itemData)=>{
 
  return(
  <View style = {styles.buttonContainer}>
              
             
  <Button
  contentStyle={styles.timeButton}
  labelStyle = {{color : "black" }}
  style={{borderColor:Colors.secondary , 
  borderWidth : 0.5 , 
  backgroundColor : buttonState.id ===itemData.item.time ? buttonState.color : "white",
  borderRadius : 20,
  marginHorizontal : 5,
  marginVertical : 5
  }} 
  
  onPress ={()=>{
    setSelectedHour(itemData.item.time);
    buttonsHandler(itemData.item.time);

    }}
  >
    <Text 
    style = {partyTimeStyle}>
    {itemData.item.time }
    </Text> 
      </Button>
</View>
  )
}

/******************************************************** */

 const openSheet = ()=> {
  
  ActionSheetIOS.showActionSheetWithOptions(
    { 
      options: allStadiums,
      destructiveButtonIndex: -1,
      cancelButtonIndex:-1,
    },
    
    buttonIndex => {
     matchTypeHandler(allStadiums[buttonIndex],buttonIndex);
    
    }
  );

 };
 if (isLoading) {
 
  return (
    <View style= {styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    
    </View>
  );
} else if (allOffers.length === 0) {
  return(
      <View style={styles.centered} >
      <Text>Aucune Offre pour le moment !</Text>
    
    </View>
  )
}


    return(
      
      <ImageBackground source = {require ("../../../assets/images/android.jpg")} 
      style ={styles.container} 
      blurRadius = {0.5}>
     { overlayState && <ConfirmBookingOverlay
        isVisible = {overlayState}
        overlayHandler = {overlayHandler}
        matchTime = {matchTimeState}
        matchType = {matchTypeState}
        dateMatch = {selectedDateState.date}
        hourMatch = {selectedHour}
        serviceId = {selectedId}
        navigate = {()=>props.navigation.navigate("Player")}
        ownerId = {allOffers[0].ownerId}
        tarif = {priceState}
       />   
    }
     <ScrollView style = {styles.componentsContainer}>
      
                  <View style = {styles.stadiumCard}>
                  <Ionicons name="md-football" size={iconSize} color={Colors.secondary} />
                      <Text style ={nameTextStyle}>
                      FootFive Blida
                      </Text>
                      <Ionicons name="md-football" size={iconSize} color={Colors.secondary} />
                  </View>

                          {/* Match Type Part : Start */}
                  <View style = {matchTypeStyle}>

                    <View style = {styles.typeTextContainer}>
                          <Text style = {typeStyle}>
                          Type du Match :  
                          </Text>
                    </View>

                     { Platform.OS === "android" ? <Picker 
                      style = {styles.picker}
                      onValueChange = {matchTypeHandler}
                      selectedValue = {matchTypeState}
                      
                      >
                   
                      {allStadiums.map ( (item,index) => 
                      <Picker.Item 
                      key = {index} 
                      label={item} 
                      value={item} 
                     
                      />)}

                      </Picker> :
                      <TouchableOpacity style = {styles.touchableIos} onPress = {openSheet}>
                        <Text style = {{
                          fontSize : 18,
                          fontFamily : "poppins-bold"
                          }
                          }>
                        {matchTypeState}
                        </Text>

                      </TouchableOpacity>
                    }

                  </View>
                    {/* Match Type Part : End */}

                      {/* Match Time Part : Start */}
                  <View style = {matchTimeStyle}>
                 
                 <View style = {styles.timeTextContainer}>
                  
                   <Text style = {tempsDuMatchStyle}>Temps du Match : </Text>
                 
                 </View> 

                  <View style = {styles.radioButtons}>
                      <RadioButton.Group
                        value = {matchTimeState}
                        onValueChange = {matchTimeHandler}
                      >

                {/* RadioButtons Elements : Start */}
                      {timesFilteredToShow.map(
                        (element,index)=>
                        {
                           return (
                             <View 
                             style = {{
                               marginHorizontal : 5 ,
                              
                               }} 
                             key ={index}>

                          <Text style = {timeTextStyle}>
                          {element}
                           </Text>
                          <RadioButton.Android
                          value={element} 
                           color = {Colors.secondary}
                          
                          />
                        </View>
                        )

                          })}
                        {/* RadioButtons Elements : End */}
                      </RadioButton.Group>
                  </View>
                  </View>
                  {/* Match Time Part : End */}


                   <View  style = {styles.customCalendar}>
                        <View style = {styles.dateText}>
                        
                        <Text style = {tempsDuMatchStyle}>
                        Date du match :</Text>
                        
                  </View>  
                    <RadioButton.Group
                        value = {selectedDateState}
                        onValueChange = {selectedDateHandler}
                      >
                        {/* RadioButtons Elements : Start */}
                      
                        <FlatList
                        
                            data = {days}
                            horizontal ={ true}
                            renderItem = {(itemData)=>{
                      
                            return (    
                          
                          <View style = {calendarCardStyle}>
                           <Text 
                           style ={calendarDayStyle} >
                              {itemData.item.day}
                            </Text>
                            <View style = {{height:30,justifyContent : "center"}}>
                              <RadioButton.Android  
                              value={itemData.item} 
                              color = {Colors.secondary}
                              
                              /></View>

                              <Text style ={calendarDateStyle} >
                              {itemData.item.date}
                              </Text>

                            </View>
                        )
                            }
                            }
                      
                         /> 

                            {/* RadioButtons Elements : End */}
                      </RadioButton.Group>

                    </View>

               <View style = {{marginTop : 20}}>
            {hoursState.length === 0 ?
            <View>
            <Text style = {styles.noTimeText}>
            Aucun créneau disponible 
            </Text>
            </View> 
            
            
            :   
                <FlatList
                horizontal
                data = {hoursState}
                extraData = {selectedDateState.date}
                style = {styles.hoursList}
                ref = {myFlat}
                renderItem = {mylist}
                
                 />
                 }
                
               </View>
 

        { priceState != 0 &&
        <View style= {styles.priceContainer}>

              <View style = {styles.priceTextContainer}>
              <Text style = {priceTextStyle}>
              {priceState + " DA"}
              </Text>

              </View>

              <View style = {styles.priceButtonContainer}>
                <Button 
                style = {priceButtonStyle} 
                mode = "contained" 
                color = {Colors.secondary}
                onPress = {()=>overlayHandler()}
                >
               <Text style = {styles.bookButtonText}>Reserver</Text>
                </Button>
              </View>
              
              </View>} 
            
              </ScrollView>
      
          </ImageBackground>
      
       


     );    
};

StadiumBookingScreen.navigationOptions = ()=> {
      return {
        headerTransparent : true,
        title : "" ,
        headerBackTitle : " ",
        headerTintColor: "rgba(53, 53, 53,1)" 
      }

}


const styles= StyleSheet.create({
      container : {
          flex : 1 ,
          justifyContent : "flex-end",
          alignItems : "center",
          backgroundColor : Colors.background

      },
      componentsContainer : {
          height : "97%",
          width : "100%",
          backgroundColor :  "rgba(255, 255, 255, 0.85)",
          marginBottom : screen.height < 500 ? 0 : 10,
          marginTop :screen.height < 500 ? 0 :  5,
      },
//////////////////////////////////////////////////////////     
      stadiumCard : {
          backgroundColor : "rgba(255, 255, 255, 0.85)",
          width : "70%",
          height : "8%",
          alignSelf : "center",
          borderRadius : 15,
          alignItems : "center",
          justifyContent : "space-around",
          marginTop : screen.height >700 ? 45 :  25,
          flexDirection : "row"
      },
      
///////////////////////////////////////////////////////////      
      nameText :{
          fontSize : 20,
          fontFamily : "poppins-bold"
      },
      nameTextBig : {
        fontSize : 26,
        fontFamily : "poppins-bold"
      },
      nameTextSmall : {
        fontSize : 14,
        fontFamily : "poppins-bold"
      },
///////////////////////////////////////////////////////////      
      matchType : {
          width : "100%",
          height : 80 , 
          marginTop : 10,
          flexDirection : "row",
          alignItems : "center"
      },
      matchTypeBig : {
        width : "100%",
        height : 80 , 
        marginVertical : 20,
        flexDirection : "row",
        alignItems : "center"
    },
    matchTypeSmall : {
      width : "100%",
      height : 80 , 
      flexDirection : "row",
      alignItems : "center"
  },

///////////////////////////////////////////////////////////       
      picker : {
        backgroundColor : "white",
        width : 50,
        marginLeft : 25,
        
      },
   
     typeTextContainer : {   
       justifyContent : "center",
       marginLeft : 10
     },
/////////////////////////////////////////////////////////////
touchableIos : {
  
  marginLeft : 10,
  borderWidth : 1,
  borderColor : Colors.background,
  width : 75,
  padding : 5,
  alignItems : "center",
  borderRadius : 10
},
  ////////////////////////////////////////////////////
tempsDuMatch : { 
  fontFamily : "poppins-bold",
  fontSize : 15,
  color : Colors.background
},
tempsDuMatchBig : {
  fontFamily : "poppins-bold",
  fontSize : 22,
  color : Colors.background

},

tempsDuMatchSmall : {
  fontFamily : "poppins-bold",
      fontSize : 11,
      color : Colors.background
},
///////////////////////////////////////////////////////////     
     typeStyle : {
        fontFamily : "poppins-bold",
        fontSize : 15,
        color : Colors.background
     },
     typeStyleBig : {
      fontFamily : "poppins-bold",
      fontSize : 22,
      color : Colors.background

     },
     typeStyleSmall : {
      fontFamily : "poppins-bold",
      fontSize : 11,
      color : Colors.background

     },
 /////////////////////////////////////////////////////////  
     matchTime : {
        width : "100%",
        height : 120,
        justifyContent : "center",
     },
     matchTimeBig : {
      width : "100%",
        height : 120,
        justifyContent : "center",
      marginVertical : 15
   },
   matchTimeSmall : {
    width : "100%",
      height : 100,
      justifyContent : "center",
      
    
 },
//////////////////////////////////////////////////////////////////
     timeTextContainer : {
        marginLeft :10 ,
        
     },
   
///////////////////////////////////////////////////////////     
     timeText : {
      fontFamily : "poppins-bold",
        fontSize : 15,
        color : Colors.background,
        alignSelf : "center",
       
     },
     timeTextBig : {
      fontFamily : "poppins-bold",
        fontSize : 22,
        color : Colors.background,
        alignSelf : "center"
     },
     timeTextSmall : {
      fontFamily : "poppins-bold",
        fontSize : 11,
        color : Colors.background,
        alignSelf : "center"
     },
///////////////////////////////////////////////////////////     
     radioButtons : {
       flexDirection : "row",
       width : "40%",
       marginTop : 10,
       marginLeft : 5,
       
     } ,
     dateText : {
      marginVertical : 10,
      marginLeft : 10,
     },
//////////////////////////////////////////////////////////
     calendarCard : {
        width : 100,
        height : 100,
        backgroundColor : "white",
        alignItems : "center",
        marginHorizontal : 6,
        borderRadius : 12,
        justifyContent : "center",
        
     },

     calendarCardBig : {
      width : 140,
      height : 140,
      backgroundColor : "white",
      alignItems : "center",
      marginHorizontal : 6,
      borderRadius : 12,
      justifyContent : "center"
     },
     calendarCardSmall : {
      width : 70,
      height : 70,
      backgroundColor : "white",
      alignItems : "center",
      marginHorizontal : 6,
      borderRadius : 12,
      justifyContent : "center"
     },
//////////////////////////////////////////////////////////
     calendarDay : {
      fontFamily : "poppins-bold",
      fontSize : 17
    },
     calendarDayBig : {
        fontFamily : "poppins",
        fontSize : 24
     },
     calendarDaySmall : {
      fontFamily : "poppins",
      fontSize : 10
   },
////////////////////////////////////////////////////////////
     calendarDate : {
       fontFamily : "poppins-bold", 
       fontSize : 14
      },
      calendarDateBig : {
        fontFamily : "poppins", 
        fontSize : 18
       },
       calendarDateSmall : {
        fontFamily : "poppins", 
        fontSize : 8
       },
////////////////////////////////////////////////////////////
    hoursList : {
        
     
     },
     buttonContainer :{
        
        
     },
     timeButton : {
     
        
     },
     
 ///////////////////////////////////////////////////////
 partyTime: {
   fontSize : 12 
  },
  partyTimeBig : {
    fontSize : 18 
  },
  partyTimeSmall : {
    fontSize : 8
  },
 /////////////////////////////////////// ////////////////
     priceContainer : {
        marginTop :screen.width <350 ? 2 : 25,
        alignItems : "center"
     },
     priceButtonContainer : {
        overflow : "hidden",
        marginBottom : 15 ,
        
     },
   ////////////////////////////////////////////////////////  
     priceButton : {
      borderRadius : 15 ,
      justifyContent : "center"
     },
     priceButtonBig : {
      borderRadius : 50 ,
      justifyContent : "center",
      width : 200 ,
      height : 50
     },
     priceButtonSmall : {
      borderRadius : 50 ,
      justifyContent : "center",
     
      
     },
  ////////////////////////////////////////////////////////   
     priceText :{
       fontSize : 28 , 
       fontFamily : "poppins-bold" , 
       color : "black"
      },

       priceTextBig : {
        fontSize : 34, 
        fontFamily : "poppins-bold" , 
        color : "black",
        padding : 5

       },
       priceTextSmall: {
        fontSize : 16, 
        fontFamily : "poppins-bold" , 
        color : "black",
        
       },
////////////////////////////////////////////////////
bookButtonText : {
  fontSize : screen.width < 350 ? 10 : 14
} ,

noTimeText : {
  fontSize : screen.width < 350 ? 14 : 20 , 
  color : "black", 
  alignSelf : "center",
  fontFamily : "poppins"},
  //////////////////////////////////////
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }



});

export default StadiumBookingScreen;