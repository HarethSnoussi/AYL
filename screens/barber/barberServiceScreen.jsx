import React from 'react';
import { StyleSheet,View,Image, ScrollView,ImageBackground,Text,TouchableOpacity,Dimensions,StatusBar,Linking} from 'react-native';
import Colors from '../../constants/Colors';
import ServiceCart from '../../components/ServiceCart';
import {Entypo,MaterialCommunityIcons} from "@expo/vector-icons";
import {useSelector } from 'react-redux';
import {  Rating  } from 'react-native-elements';
import polylanar from "../../lang/ar";
import polylanfr from "../../lang/fr";
 
const screen = Dimensions.get("window");

const BarberServiceScreen = props =>{
  
  

  const barber= useSelector(state=>state.barber.barber);
  const feedbacks=useSelector(state=>state.reviews.feedbacks);
  const client= useSelector(state=>state.clients.client);
  
  const isImage= {beard:{uri:'http://95.111.243.233/assets/tahfifabarber/barbe.jpg'},hair:{uri:'http://95.111.243.233/assets/tahfifabarber/hair.jpg'},supp:{uri:'http://95.111.243.233/assets/tahfifabarber/supplements.jpg'},womanHair:{uri:'http://95.111.243.233/assets/tahfifabarber/womanhair.jpg'},wedding:{uri:'http://95.111.243.233/assets/tahfifabarber/mariage.jpg'},care:{uri:'http://95.111.243.233/assets/tahfifabarber/soins.jpg'},manCare:{uri:'http://95.111.243.233/assets/tahfifabarber/soinshomme.jpg'},makeup:{uri:'http://95.111.243.233/assets/tahfifabarber/makeup.jpg'},manucure:{uri:'http://95.111.243.233/assets/tahfifabarber/manucure.jpg'},pedicure:{uri:'http://95.111.243.233/assets/tahfifabarber/pedicure.jpg'},epilation:{uri:'http://95.111.243.233/assets/tahfifabarber/epilation.jpg'}};
    
  const instagramURL=barber[0] && barber[0].b_name?`https://www.instagram.com/${barber[0].b_name}/`:'https://www.instagram.com/';
  const instagramUrl= ()=>{
   Linking.openURL(instagramURL).catch((err) => {
     if(barber[0].b_name===null){
       Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.NoInstagram:polylanar.NoInstagram,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
     }
     if(err){
       Alert.alert(client[0] && client[0].lang?polylanfr.Oups:polylanar.Oups,client[0] && client[0].lang?polylanfr.WeakInternet:polylanar.WeakInternet,[{text:client[0] && client[0].lang?polylanfr.OK:polylanar.OK}]);
   } 
   });
  };
     
    if(barber[0].services.length === 0){
      return (
        <View style={styles.container}> 
        <StatusBar hidden />
        <View style={styles.firstContainer}>
          <View style={styles.coverContainer}>
              <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/barberScreen.png'}} style={styles.cover} />
          </View>
          
          <View style={styles.infoContainer}>
             <View style={styles.imageContainer}>
             {barber[0] && barber[0].image!==null?<Image source={{uri:`http://95.111.243.233/profileImages/barber/${barber.image}`}} style={styles.icon} />:barber[0] && barber[0].sex==='Homme'?
               <Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknown.jpg'}} style={styles.icon} />:<Image source={{uri:'http://95.111.243.233/assets/tahfifabarber/unknownfemale.jpg'}} style={styles.icon} />}
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
              <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('Accueil')}>
                  <View style={styles.iconFormCircle3}>
                  <MaterialCommunityIcons title = "accueil" name ='home' color='#fff' size={screen.width/15.7}/>
                  </View>
                  <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Home:polylanar.Home}</Text>
              </TouchableOpacity> 
               <TouchableOpacity style={styles.iconContainer} onPress={instagramUrl}>
                  <View style={styles.iconFormCircle2}>
                  <MaterialCommunityIcons title = "instagram" name ='instagram' color='#fff' size={screen.width/15.7}/>
                  </View>
                  <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Instagram:polylanar.Instagram}</Text>
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
               <ImageBackground source={{uri:'http://95.111.243.233/assets/tahfifa/barberScreen.png'}} style={styles.cover} />
           </View>
           
           <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
              {barber[0] && barber[0].image!==null?<Image source={{uri:`http://95.111.243.233/profileImages/barber/${barber[0].image}`}} style={styles.icon} />:
                <Image source={{uri:'http://95.111.243.233/assets/tahfifa/unknown.jpg'}} style={styles.icon} />}
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
              <TouchableOpacity style={styles.iconContainer} onPress={()=>props.navigation.navigate('Accueil')}>
                    <View style={styles.iconFormCircle3}>
                    <MaterialCommunityIcons title = "accueil" name ='home' color='#fff' size={screen.width/15.7}/>
                    </View>
                    <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Home:polylanar.Home}</Text>
                  </TouchableOpacity> 
                  
               <TouchableOpacity style={styles.iconContainer} onPress={instagramUrl}>
                    <View style={styles.iconFormCircle2}>
                    <MaterialCommunityIcons title = "instagram" name ='instagram' color='#fff' size={screen.width/15.7}/>
                    </View>
                    <Text style={styles.iconText}>{client[0] && client[0].lang?polylanfr.Instagram:polylanar.Instagram}</Text>
                </TouchableOpacity> 

              </View>
           </View>
         
         </View>
         <ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
          {barber[0].services.map((service,index)=>
          <ServiceCart
            key={service.serviceId}
            number={index+1}
            source={service.typeOfService==='Tahfifa'?isImage.hair: service.typeOfService==='Barbe'?isImage.beard: service.typeOfService==='Soins homme'?isImage.manCare:service.typeOfService==='Suppléments'?isImage.supp:service.typeOfService==='Mariage'?isImage.wedding:service.typeOfService==='Soins'?isImage.care:service.typeOfService==='Coiffure'?isImage.womanHair:service.typeOfService==='Maquillage'?isImage.makeup:service.typeOfService==='Manucure'?isImage.manucure:service.typeOfService==='Pédicure'?isImage.pedicure:service.typeOfService==='Epilation'?isImage.epilation:undefined}
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
    backgroundColor:'#56A7FF',
    justifyContent:'center',
    alignItems:'center'
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
   marginTop:screen.width/36  ,
   flexDirection:'row'
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