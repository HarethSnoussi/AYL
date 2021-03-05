import React,{useState,useEffect,useCallback} from 'react';
import { StyleSheet, Text, View, ImageBackground , Image,Dimensions,TouchableOpacity,ScrollView,StatusBar,Alert,ActivityIndicator,Linking} from 'react-native';
import {MaterialCommunityIcons,Entypo,MaterialIcons} from "@expo/vector-icons";
import {  Rating  } from 'react-native-elements';
import Colors from "../../constants/Colors";
import { useDispatch,useSelector } from 'react-redux';
import * as barberActions from '../../store/actions/barberActions';
import * as reviewsActions from '../../store/actions/reviewsActions';
import * as portfolioActions from '../../store/actions/portfolioActions';
import Feedback from '../../components/Feedback';
import polylanar from "../../lang/ar";
import polylanfr from "../../lang/fr";


const height = Dimensions.get('window').height;
const screen = Dimensions.get('window');

const BarberHomeScreen = props =>{

  const barberID= props.navigation.getParam('barberId');  //get Barber ID
  
  const [error, setError] = useState();
  const [isLoading,setIsLoading]= useState(false);//ActivityIndicator handling
  const dispatch= useDispatch();

   /*
   *******Fetch One barber DATA
  */
 const getBarber=useCallback(async()=>{
  try{
    setError(false);
    setIsLoading(true);
   
    await dispatch(barberActions.setBarber(barberID));
    await dispatch(reviewsActions.setFeedbacks(barberID));
    await dispatch(portfolioActions.setPortfolio(barberID));
    setIsLoading(false);
    }catch(err){
      console.log(err);
      setError(err);
      if(err){
        Alert.alert('Oups!','Une erreur est survenue',[{text:'OK'}]);
    } 
    }
},[dispatch]);

  useEffect(()=>{
  getBarber();
  
  },[dispatch,getBarber]);

  useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',getBarber);
    return ()=>{
      willFocusSub.remove();
    };
  },[getBarber]);

   const barber=useSelector(state=>state.barber.barber[0]);
   const barberPortfolio=useSelector(state=>state.portfolio.portfolio);
   const client= useSelector(state=>state.clients.client[0]);
   const feedbacks=useSelector(state=>state.reviews.feedbacks);

   const instagramURL=barber && barber.b_name?`https://www.instagram.com/${barber.b_name}/`:'https://www.instagram.com/';
   const instagramUrl= ()=>{
    Linking.openURL(instagramURL).catch((err) => {
      if(barber.b_name===null){
        Alert.alert(client && client.lang?polylanfr.Oups:polylanar.Oups,client && client.lang?polylanfr.NoInstagram:polylanar.NoInstagram,[{text:client && client.lang?polylanfr.OK:polylanar.OK}]);
      }
      if(err){
        Alert.alert(client && client.lang?polylanfr.Oups:polylanar.Oups,client && client.lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client && client.lang?polylanfr.OK:polylanar.OK}]);
    } 
    });
   };
  
  
  const [isAbout,setIsAbout]= useState(true);
  const [isPortfolio,setIsPortfolio]= useState(false);
  const [isFeedback,setIsFeedback]= useState(false);

    const about = ()=>{
      setIsAbout(true);
      setIsPortfolio(false);
      setIsFeedback(false);
    };

    const portfolio =()=>{
      setIsAbout(false);
      setIsPortfolio(true);
      setIsFeedback(false);
    };

    const feedback=()=>{
      setIsAbout(false);
      setIsPortfolio(false); 
      setIsFeedback(true);
    };

    const minServicesPrice=prices=>{
      let arrayPrices=[];
      if(prices.lentgh ===0){
        return;
      }
      prices.forEach(e=>{
        arrayPrices.push(e.price);
      });
  
      return Math.min(...arrayPrices);
     
    };
   


    if(isLoading || barber === undefined ){
      return ( <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/support.png'}} style={styles.coverTwo}>
                  <StatusBar hidden/>
                  <ActivityIndicator size='large' color={Colors.primary} />
              </ImageBackground>)
    };
  
    return(
      <View style ={styles.container}>
        <StatusBar hidden/>
         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/barberScreen.png'}} style={styles.cover} />
           </View>
           <View style={styles.infoContainer}>
               <View style={styles.imageContainer}>
               {barber && barber.image!==null?<Image source={{uri:`http://95.111.243.233/profileImages/barber/${barber.image}`}} style={styles.modelImage} />:barber && barber.sex==='Homme'?
               <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.modelImage} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.modelImage} />}
               </View>
               <Text style={styles.bname}>{barber && barber.b_name!==null?barber.b_name:client && client.lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
               <Text style={styles.jobAge}>{barber && (barber.name!==null || barber.surname!==null || barber.age!==null)?`${barber.name} ${barber.surname}, ${barber.age} ${client && client.lang?polylanfr.Yo:polylanar.Yo}`:client && client.lang?polylanfr.personalInforamtion:polylanar.personalInforamtion}</Text>
               <View style={{flexDirection:'row'}}>
                <Rating
                      type='custom'
                      startingValue={barber && feedbacks.length===0 ? 2.5 : barber.mark}
                      imageSize={screen.width/18}
                      ratingBackgroundColor={'#323446'}
                      ratingColor='#fd6c57'
                      tintColor='#f9f9f9'
                      readonly = {true}
                    />
                 <Text style={styles.commentsNumber}>{feedbacks.length!==0 ? ` (${feedbacks.length} ${client && client.lang?polylanfr.Comments:polylanar.Comments})`:client && client.lang?polylanfr.NoComments:polylanar.NoComments}</Text>   
                </View>
                <View style={styles.iconsContainer}>
                 <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('Accueil')}>
                    <View style={styles.iconFormCircle}>
                    <MaterialCommunityIcons title = "accueil" name ='home' color='#fff' size={screen.width/15.7}/>
                    </View>
                    <Text style={styles.iconText}>{client && client.lang?polylanfr.Home:polylanar.Home}</Text>
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.iconContainer}  onPress={()=>props.navigation.navigate('BarberService',{barberID:barberID})}>
                    <View style={styles.iconFormCircle1}>
                       <Entypo title = "scissors" name ='scissors' color='#fff' size={screen.width/15.7} />
                    </View>
                    <Text style={styles.iconText}>{client && client.lang?polylanfr.Services:polylanar.Services}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconContainer} onPress = {()=>props.navigation.navigate("BookStepOne",{barberId :barberID,clientID: props.navigation.getParam("clientID"),name:barber.name,surname:barber.surname,mark:barber.mark,region:barber.region,wilaya:barber.wilaya,image:barber.image,overCpt :  props.navigation.getParam("overCpt")})}>
                    <View style={styles.iconFormCircle3}>
                      <MaterialCommunityIcons title = "calendar-account" name ='calendar-account' color='#fff' size={screen.width/15.7} />
                    </View>
                    <Text style={styles.iconText}>{client && client.lang?polylanfr.Book:polylanar.Book}</Text>
                  </TouchableOpacity>   
                  <TouchableOpacity style={styles.iconContainer} onPress={instagramUrl}>
                    <View style={styles.iconFormCircle2}>
                    <MaterialCommunityIcons title = "instagram" name ='instagram' color='#fff' size={screen.width/15.7}/>
                    </View>
                    <Text style={styles.iconText}>{client && client.lang?polylanfr.Instagram:polylanar.Instagram}</Text>
                  </TouchableOpacity>    
                </View>
                
           </View>
           <View style={styles.menu}>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isAbout ?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={about}>
               <Text style={styles.itemText}>{client && client.lang?polylanfr.About:polylanar.About}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isPortfolio?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={portfolio}>
               <Text style={styles.itemText}>{client && client.lang?polylanfr.Portfolio:polylanar.Portfolio}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{borderBottomWidth:2,borderBottomColor:isFeedback?'#fd6c57':'#f9f9f9',paddingBottom:screen.width/120}} onPress={feedback}>
                <Text style={styles.itemText}>{client && client.lang?polylanfr.Feedback:polylanar.Feedback}</Text>
              </TouchableOpacity>  
           </View>
          
         </View>
        { isAbout ?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
            <View style={styles.firstRow}>
                <View>
                  <Text style={styles.title}>{client && client.lang?polylanfr.Fullname:polylanar.Fullname}</Text>
                  <Text style={styles.detail}>{barber && (barber.name!==null || barber.surname!==null)?`${barber.name} ${barber.surname}`:'Votre nom complet'}</Text>
                </View>
                <View>
                  <Text style={styles.title}>{client && client.lang?polylanfr.StartFrom:polylanar.StartFrom}</Text> 
                  <Text style={styles.price}>{barber && barber.services.length!==0 ? minServicesPrice(barber.services)+' دج':'0 دج'}</Text>
                </View>  
            </View>
            
            <View style={styles.secondRow}>
                <View>
                  <Text style={styles.title}>{client && client.lang?polylanfr.Available:polylanar.Available}</Text>
                </View>
                <ScrollView horizontal={true}   showsHorizontalScrollIndicator={false}>
                  <View style={styles.daysContainer}>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Saturday:polylanar.Saturday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Sam'].isworking===1?`${barber.workingTimes['Sam'].debut} - ${barber.workingTimes['Sam'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Sunday:polylanar.Sunday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Dim'].isworking===1?`${barber.workingTimes['Dim'].debut} - ${barber.workingTimes['Dim'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Monday:polylanar.Monday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Lun'].isworking===1?`${barber.workingTimes['Lun'].debut} - ${barber.workingTimes['Lun'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text> 
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Tuesday:polylanar.Tuesday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mar'].isworking===1?`${barber.workingTimes['Mar'].debut} - ${barber.workingTimes['Mar'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Wednesday:polylanar.Wednesday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Mer'].isworking===1?`${barber.workingTimes['Mer'].debut} - ${barber.workingTimes['Mer'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Thursday:polylanar.Thursday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Jeu'].isworking===1?`${barber.workingTimes['Jeu'].debut} - ${barber.workingTimes['Jeu'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                      <Text style={styles.dayText}>{client && client.lang?polylanfr.Friday:polylanar.Friday}</Text>
                      <Text style={styles.detail}>{barber && barber.workingTimes['Ven'].isworking===1?`${barber.workingTimes['Ven'].debut} - ${barber.workingTimes['Ven'].finish}` : client && client.lang?polylanfr.NoAvailable:polylanar.NoAvailable}</Text>  
                    </View>
                  </View>
                </ScrollView>
            </View>
            
            <View style={styles.thirdRow}>
                <View style={styles.leftColumn}>
                  <Text style={styles.title}>{client && client.lang?polylanfr.TheAddress:polylanar.TheAddress}</Text>
                  <Text style={styles.detail}>{barber && barber.address!==null?barber.address:client && client.lang?polylanfr.YourPersonalAddress:polylanar.YourPersonalAddress}</Text>
                  <View style={styles.cityContainer}>
                    <MaterialCommunityIcons title="city" name ='city' color='#fd6c57' size={screen.width/18} />
                    <Text style={styles.cityText}>{barber && (barber.wilaya!==null || barber.region!==null)?`${barber.region}, ${barber.wilaya}`:client && client.lang?polylanfr.Location:polylanar.Location}</Text>
                  </View>
                  
                </View>
                <View  style={styles.rightColumn}>
                    <Image source={{uri:'http://95.111.243.233/assets/tahfifa/localisation.jpg'}} style={styles.mapImage} />
                </View>
            </View>
            
            <View style={styles.forthRow}>
                <View style={styles.forthRowElementsContainer}>
                  <Text style={styles.title}>{client && client.lang?polylanfr.Models:polylanar.Models}</Text>
                  <TouchableOpacity onPress={()=>{setIsAbout(false); setIsPortfolio(true);}}>
                  <Text style={styles.detail}>{client && client.lang?polylanfr.DisplayAll:polylanar.DisplayAll}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.photosContainer} contentContainerStyle={{justifyContent:'space-around'}}>
                {barberPortfolio.slice(0,4).map(picture=>

                  (<View 
                    key={picture.id}
                    style={styles.modelImageContainer}>
                    <Image source={{uri:picture.model===null?`http://95.111.243.233/uploads/emptyimage.jpg` :`http://95.111.243.233/uploads/${picture.model}`}} style={styles.modelImage} />
                  </View>)
                  )}
                </ScrollView>
            </View>

         
         </ScrollView>):undefined}

        {isPortfolio?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
        <View style={{flexDirection:'row',width:'90%',marginVertical:screen.width/36}}>
               {barberPortfolio.slice(0,3).map(picture=>(<View 
                    key={picture.id}
                    style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={{uri:picture.model===null?`http://95.111.243.233/uploads/emptyimage.jpg` :`http://95.111.243.233/uploads/${picture.model}`}} style={styles.modelImage} />
                  </View>)
                 )}
                 
               </View>

               <View style={{flexDirection:'row',width:'90%',marginVertical:10}}>
               {barberPortfolio.slice(3,6).map(picture=>(<View 
                    key={picture.id}
                    style={{width:'33.3%',alignItems:'center'}}>
                    <Image source={{uri:picture.model===null?`http://95.111.243.233/uploads/emptyimage.jpg` :`http://95.111.243.233/uploads/${picture.model}`}} style={styles.modelImage} />
                  </View>))}
               </View>

         </ScrollView>):undefined}

         {isFeedback?(<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems:'center'}}>
         {feedbacks.length ===0 ?
          (<View style={styles.noFeedbacksContainer}>
            <Text style={styles.noFeedbacksText}>{client && client.lang?polylanfr.NoFeedback:polylanar.NoFeedback}</Text>
          </View>):
          (<View>
           {feedbacks.map(feed=>  <Feedback
               key={feed.id}
               mark={feed.mark}
               name={feed.name}
               surname={feed.surname}
               comment={feed.comment}
               image={feed.image!==null?feed.image:'unknown.jpg'}
               date={new Date(feed.date).getDate() +'/'+(new Date(feed.date).getMonth()+1)}
               feedbacks={feedbacks}
              />)}
              </View>)}
         </ScrollView>):undefined}

      </View>

     );    
};

BarberHomeScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
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
    ),
    headerTintColor: '#fff'
  };
}

const styles= StyleSheet.create({
  container : {
      flex : 1,
      backgroundColor:'white',
      width:'100%',
      alignItems:'center'
  },
  firstContainer:{
    width:'100%',
    height:'50%',
    alignItems:'center',
    backgroundColor:'#f9f9f9'
  },
  coverContainer:{
    width:'100%',
    height:'25%',
    overflow:'hidden'
  },
  icon:{
    width:'100%',
    height:'100%',
  },
  cover:{
    width:'100%',
    resizeMode:'cover',
    height:'100%'
  },
  infoContainer:{
    width:'100%',
    height:'55%',
    alignItems:'center'
  },
  imageContainer:{
    width:screen.width/4,
    height:screen.width/4,
    borderRadius:screen.width/7.2,
    marginTop:-(screen.width/6.5),
    overflow:'hidden'
  },
  bname:{
    fontFamily:'poppins-bold',
    fontSize:screen.width/21.2,
    color:'#323446',
    paddingTop:screen.width/120
  },
  jobAge:{
    fontFamily:'poppins',
    color:'#fd6c57',
    paddingBottom:screen.width/120,
    fontSize:screen.width/32.7
  },
  commentsNumber:{
    fontFamily:'poppins',
    color:'#323446',
    paddingBottom:screen.width/120,
    fontSize:screen.width/36,
    marginTop:screen.width/72
  },
  iconsContainer:{
    flexDirection:'row',
    paddingTop:screen.width/36
  },
  iconContainer:{
    marginHorizontal:screen.width/27.7,
    alignItems:'center'
  },
  iconFormCircle:{
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    backgroundColor:'#56A7FF',
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle1:{
    backgroundColor:'#FD6C57',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle2:{
    backgroundColor:'#FE457C',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center'
  },
  iconFormCircle3:{
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    backgroundColor:'#BA55D3',
    justifyContent:'center',
    alignItems:'center'
  },
  iconText:{
    fontFamily:'poppins',
    color:'grey',
    paddingTop:screen.width/120,
    fontSize:screen.width/36
  },
  menu:{
    width:'90%',
    height:'20%',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'flex-end'
  },
  itemContainer:{
    borderBottomWidth:2,
    borderBottomColor:'#fd6c57',
    paddingBottom:screen.width/120
  },
  itemText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:screen.width/30
  },
  firstRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:screen.width/24,
    width:'90%',
    alignSelf:'center'
  },
  title:{
    fontFamily:'poppins-bold',
    color:'#323446',
    fontSize:screen.width/27.7,
    alignSelf:'flex-start'
  },
  detail:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:screen.width/30
  },
  price:{
    fontFamily:'poppins',
    color:'#fd6c57',
    fontSize:screen.width/30
  },
  secondRow:{
    marginTop:screen.width/24,
    width:'90%',
    alignSelf:'center'
  },
  daysContainer:{
    flexDirection:'row',
    justifyContent:'space-around'
  },
  dayContainer:{
    alignItems:'center',
    marginHorizontal:screen.width/36
  },
  dayText:{
    fontFamily:'poppins',
    color:'grey',
    fontSize:screen.width/27.7
  },
  thirdRow:{
    flexDirection:'row',
    marginTop:screen.width/24,
    width:'90%',
    alignSelf:'center'
  },
  leftColumn:{
    width:'60%'
  },
  cityContainer:{
    flexDirection:'row',
    alignItems:'center',
    paddingTop:screen.width/72
  },
  cityText:{
    fontFamily:'poppins',
    color:'#fd6c57',
    fontSize:screen.width/30,
    marginTop:screen.width/72
  },
  rightColumn:{
    width:'40%',
    alignItems:'flex-end'
  },
  mapImage:{
    width:screen.width/4,
    height:screen.width/4
  },
  forthRow:{
    marginTop:screen.width/24
  },
  forthRowElementsContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'90%',
    alignSelf:'center'
  },
  photosContainer:{
    flexDirection:'row',
    paddingHorizontal:screen.width/24,
    paddingBottom:screen.width/24
  },
  modelImageContainer:{
    borderRadius:screen.width/18,
    overflow:'hidden',
    marginRight:screen.width/51.4
  },
  modelImage:{
    width:screen.width/4,
    height:screen.width/4
  },
 coverTwo:{
   flex:1,
   alignItems:'center',
   justifyContent:'center',
   width:'100%',
   height:'100%',
   resizeMode:'cover'
 },
 noFeedbacksContainer:{
  width:'100%',
  justifyContent:'center',
  alignItems:'center',
  marginTop:height*0.2,
},
noFeedbacksText:{
  fontFamily:'poppins',
  fontSize:screen.width/27.7,
  color:Colors.blue
},  
});

export default BarberHomeScreen;

