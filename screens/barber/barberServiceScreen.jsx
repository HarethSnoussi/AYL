import React from 'react';
import { StyleSheet,View,Image, ScrollView,ImageBackground,Text,TouchableOpacity,Dimensions,StatusBar} from 'react-native';
import Colors from '../../constants/Colors';
import ServiceCart from '../../components/ServiceCart';
import {Entypo} from "@expo/vector-icons";
import {useSelector } from 'react-redux';
import {  Rating  } from 'react-native-elements';
import polylanar from "../../lang/ar";
import polylanfr from "../../lang/fr";
 
const screen = Dimensions.get("window");

const BarberServiceScreen = props =>{
  
  

  const barber= useSelector(state=>state.barber.barber);
  const feedbacks=useSelector(state=>state.reviews.feedbacks);
  const client= useSelector(state=>state.clients.client);
  
  const isImage= {beard:{uri:'http://173.212.234.137/assets/tahfifa/barbe.jpg'},hair:{uri:'http://173.212.234.137/assets/tahfifa/hair.jpg'},supp:{uri:'http://173.212.234.137/assets/tahfifa/supplements.jpg'},womanHair:{uri:'http://173.212.234.137/assets/tahfifa/womanhair.jpg'},wedding:{uri:'http://173.212.234.137/assets/tahfifa/mariage.jpg'},care:{uri:'http://173.212.234.137/assets/tahfifa/soins.jpg'}};
    
     
    if(barber[0].services.length === 0){
      return (
        <View style={styles.container}> 
        <StatusBar hidden />
        <View style={styles.firstContainer}>
          <View style={styles.coverContainer}>
              <ImageBackground source={{uri:'http://173.212.234.137/assets/tahfifa/barberScreen.png'}} style={styles.cover} />
          </View>
          
          <View style={styles.infoContainer}>
             <View style={styles.imageContainer}>
             {barber[0] && barber[0].image!==null?<Image source={{uri:`http://173.212.234.137/profileImages/barber/${barber.image}`}} style={styles.icon} />:
                <Image source={{uri:'http://173.212.234.137/assets/tahfifa/unknown.jpeg'}} style={styles.icon} />}
             </View>
           
             <Text style={styles.bname}>{barber[0] && barber[0].b_name!==null?barber[0].b_name:client[0] && client[0].lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
             
             <Rating
                   type='custom'
                   startingValue={barber[0] && feedbacks.length===0 ? 2.5 : barber[0].mark}
                   imageSize={screen.width/18}
                   ratingBackgroundColor={'#323446'}
                   ratingColor='#fd6c57'
                   tintColor='#f9f9f9'
                 />
             <View style={styles.iconsMenuContainer}>
               <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                 <View style={styles.iconFormCircle}>
                 <Entypo title = "scissors" name ='scissors' color='#fff' size={screen.width/15.7} />
                 </View>
                 <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Services:polylanar.Services}</Text>
               </TouchableOpacity>
             </View>
          </View>
        </View>
        <View style={styles.noServicesContainer}>
            <View style={{marginBottom:screen.width/36,alignSelf:'center'}}>
              <Text style={styles.noServicesText}>{client[0] && client[0].lang?polylanfr.NoServices:polylanar.NoServices}</Text>
            </View>
            
        </View>
           
        </View>
      )
   }
   
   
    return(
        <View style={styles.container}> 
        <StatusBar hidden />
         <View style={styles.firstContainer}>
           <View style={styles.coverContainer}>
               <ImageBackground source={{uri:'http://173.212.234.137/assets/tahfifa/barberScreen.png'}} style={styles.cover} />
           </View>
           
           <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
              {barber[0] && barber[0].image!==null?<Image source={{uri:`http://173.212.234.137/profileImages/barber/${barber[0].image}`}} style={styles.icon} />:
                <Image source={{uri:'http://173.212.234.137/assets/tahfifa/unknown.jpeg'}} style={styles.icon} />}
              </View>
            
              <Text style={styles.bname}>{barber[0] && barber[0].b_name!==null?barber[0].b_name:client[0] && client[0].lang?polylanfr.BusinessName:polylanar.BusinessName}</Text>
             
                <Rating
                      type='custom'
                      startingValue={barber[0] && feedbacks.length===0 ? 2.5 : barber[0].mark}
                      imageSize={20}
                      ratingBackgroundColor={'#323446'}
                      ratingColor='#fd6c57'
                      tintColor='#f9f9f9'
                    />
              <View style={styles.iconsMenuContainer}>
              <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('EditService')}>
                 <View style={styles.iconFormCircle}>
                 <Entypo title = "scissors" name ='scissors' color='#fff' size={screen.width/15.7} />
                 </View>
                 <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Services:polylanar.Services}</Text>
               </TouchableOpacity>
              </View>
           </View>
         
         </View>
         <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
          {barber[0].services.map((service,index)=>
          <ServiceCart
            key={service.serviceId}
            number={index+1}
            source={service.typeOfService==='Cheveux'?isImage.hair: service.typeOfService==='Barbe'?isImage.beard: service.typeOfService==='Soins'?isImage.care:service.typeOfService==='Mariage'?isImage.wedding:service.typeOfService==='Suppléments'?isImage.supp:service.typeOfService==='Cheveux femme'?isImage.womanHair:undefined}
            name={service.name}
            type={service.typeOfService}
            minute={service.duration}
            price={service.price}
          />)}
         </ScrollView>
         
        </View>
          
     );    
};

BarberServiceScreen.navigationOptions = navData => {
  
    return  {
    
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
        ),
        headerTintColor: '#fff'
  };
  
}

const styles= StyleSheet.create({
    container:{
      flex:1,
      backgroundColor:'white',
      width:'100%',
      alignItems:'center'
    },
    
  firstContainer:{
    width:'100%',
    height:'40%',
    alignItems:'center',
    backgroundColor:'#f9f9f9'
  },
  coverContainer:{
    width:'100%',
    height:'30%',
    overflow:'hidden'
  },
  icon:{
    width:'100%',
    height:'100%',
  },
  cover:{
    width:'100%',
    resizeMode:'contain',
    height:'100%'
  },
  infoContainer:{
    width:'100%',
    height:'40%',
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
  iconFormCircle:{
    backgroundColor:'#FD6C57',
    width:screen.width/9,
    height:screen.width/9,
    borderRadius:screen.width/18,
    justifyContent:'center',
    alignItems:'center',
  },
  
  iconContainer:{
    marginHorizontal:screen.width/27.7,
    alignItems:'center'
  },
  iconText:{
    fontFamily:'poppins',
    color:'grey',
    paddingTop:screen.width/120,
    fontSize:screen.width/36
  },
  iconsMenuContainer:{
   alignItems:'center',
   marginTop:screen.width/36  
  },
  activityIndicatorContainer:{
   flex:1,
   resizeMode:'cover',
   width:'100%',
   height:'100%',
   justifyContent:'center',
   alignItems:'center' 
 },
 noServicesContainer:{
  width:'100%',
  height:'50%',
  justifyContent:'center'
  
},
noServicesText:{
  fontFamily:'poppins',
  fontSize:screen.width/25.7,
  color:Colors.blue
}
});

export default BarberServiceScreen;