import React from 'react';
import { StyleSheet, Text, View,Dimensions,ImageBackground } from 'react-native';
import Colors from "../constants/Colors";
import polylanar from "../lang/ar";
import polylanfr from "../lang/fr";
import {useSelector } from 'react-redux';

//responsivity (Dimensions get method)
const height = Dimensions.get('window').height;
const screen= Dimensions.get('window');


const ServiceCart = props =>{
    
  const client= useSelector(state=>state.clients.client[0]);

    return(
        <View style={styles.serviceContainer}>
          <View style={styles.backgroundContainer}>
            <ImageBackground style={styles.background} resizeMode='cover' source={props.source}>
                    <View style={styles.firstRow}>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{client && client.lang?polylanfr.Service+' '+props.number:polylanar.Service+' '+props.number}</Text>
                        </View>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{client && client.lang?props.minute+' '+polylanfr.Minute:props.minute+' '+polylanar.Minute}</Text>
                        </View>
                    </View>
                    <View style={styles.secondRow}>
                          <Text style={styles.textType}>{props.type}</Text>
                          <Text style={styles.textPrice}>{props.price+' دج'}</Text>
                    </View>
            </ImageBackground>
          </View>
         
          <View style={styles.iconsContainer}>
               <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                   <Text style={styles.serviceName}>{props.name}</Text>
               </View>
             
           </View>
       </View>
     );    
};


const styles= StyleSheet.create({

  serviceContainer:{
    overflow:Platform.OS==='ios'?'visible':'hidden',
    shadowOpacity:0.5,
    shadowOffset:{width:0,height:2},
    shadowRadius:screen.width/180,
    shadowColor:"#000",
    borderRadius:screen.width/36,
    elevation:5,
    alignSelf:'center',
    width:'90%',
    marginVertical:screen.width/36,
    height:height*0.25
  },
  backgroundContainer:{
    width:'100%',
    height:'70%',
    backgroundColor:'#f9f9f9'
  },
  background:{
    width:'100%',
    height:'100%',
    justifyContent:'space-between'
  },
  firstRow:{
    width:'90%',
    alignSelf:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:screen.width/72
  },
  serviceNumberContainer:{
    backgroundColor:'rgba(0,0,0,0.5)',
    paddingVertical:screen.width/120,
    paddingHorizontal:screen.width/36,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:screen.width/18
  },
  number:{
    fontSize:screen.width/40,
    fontFamily:'poppins',
    color:'#fff'
  },
  secondRow:{
    backgroundColor:'#fff',
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignSelf:'center',
    alignItems:'center',
    borderTopRightRadius:screen.width/18,
    borderTopLeftRadius:screen.width/18,
    paddingHorizontal:screen.width/18
  },
  textType:{
    fontSize:screen.width/30,
    color:Colors.primary,
    fontFamily:'poppins-bold'
  },
  textPrice:{
    fontSize:screen.width/20,
    color:Colors.primary,
    fontFamily:'poppins-bold'
  },
  serviceName:{
    color:Colors.blue,
    fontFamily:'poppins-bold',
    fontSize:screen.width/30,
    alignSelf:'center'
  },
  iconsContainer:{
    width:'100%',
    height:'30%',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:Platform.OS==='android'?'#fff':'#f9f9f9',
    paddingVertical:screen.width/36,
    borderTopColor:'#f0F0F0',
    borderTopWidth:1,
  },
  
 
});

export default ServiceCart;