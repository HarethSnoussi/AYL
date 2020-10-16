import React from 'react';
import { StyleSheet, Text, View,Dimensions,ImageBackground,TouchableOpacity } from 'react-native';
import Colors from "../constants/Colors";
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";

//responsivity (Dimensions get method)
const height = Dimensions.get('window').height;



const ServiceCart = props =>{
    

    return(
        <View style={styles.serviceContainer}>
          <View style={styles.backgroundContainer}>
            <ImageBackground style={styles.background} resizeMode='cover' source={props.source}>
                    <View style={styles.firstRow}>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{'Service '+props.number}</Text>
                        </View>
                        <View style={styles.serviceNumberContainer}>
                          <Text style={styles.number}>{props.minute+' min'}</Text>
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
    shadowRadius:2,
    shadowColor:"#000",
    borderRadius:10,
    elevation:5,
    alignSelf:'center',
    width:'90%',
    marginVertical:10,
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
    paddingTop:5
  },
  serviceNumberContainer:{
    backgroundColor:'rgba(0,0,0,0.5)',
    paddingVertical:3,
    paddingHorizontal:10,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20
  },
  number:{
    fontSize:9,
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
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    paddingHorizontal:20
  },
  textType:{
    fontSize:12,
    color:Colors.primary,
    fontFamily:'poppins-bold'
  },
  textPrice:{
    fontSize:18,
    color:Colors.primary,
    fontFamily:'poppins-bold'
  },
  serviceName:{
    color:Colors.blue,
    fontFamily:'poppins-bold',
    fontSize:12,
    alignSelf:'center'
  },
  iconsContainer:{
    width:'100%',
    height:'30%',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:Platform.OS==='android'?'#fff':'#f9f9f9',
    paddingVertical:10,
    borderTopColor:'#f0F0F0',
    borderTopWidth:1,
  },
  
 
});

export default ServiceCart;