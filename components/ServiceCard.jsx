import React from 'react';
import { StyleSheet,View,Text,Dimensions,Platform} from 'react-native';
import {Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import {Ionicons} from '@expo/vector-icons';


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const ServiceCard = props =>{

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  let containerStyle = styles.container;
  let titleStyle = styles.title;
  let typeMatchStyle = styles.typeMatch;
  let editStyle = styles.edit;
  let size = 25;
  let algerianDinarStyle = styles.algerianDinar;
  let labelBtnStyle = styles.labelBtn;
  
  if(screen.width < 350){
    containerStyle = styles.containerSmall;
    titleStyle = styles.titleSmall;
    typeMatchStyle = styles.typeMatchSmall;
    editStyle = styles.editSmall;
    size = 22;
    algerianDinarStyle = styles.algerianDinarSmall;
    labelBtnStyle = styles.labelBtnSmall;
}

if(screen.height <= 800 && screen.height >=700){
    containerStyle = styles.containerTall;
    titleStyle = styles.titleTall;
    typeMatchStyle = styles.typeMatchTall;
    editStyle = styles.editTall;
    size = 30;
    algerianDinarStyle = styles.algerianDinarTall;
    labelBtnStyle = styles.labelBtnTall;
}

if(screen.height > 800){
   containerStyle = styles.containerBig;
   titleStyle = styles.titleBig;
   typeMatchStyle = styles.typeMatchBig;
   editStyle = styles.editBig;
   size = 36;
   algerianDinarStyle = styles.algerianDinarBig;
   labelBtnStyle = styles.labelBtnBig;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return(
     
    <View style={containerStyle}>
       
        <View style={styles.titleContainer}>
         <Text style={titleStyle}>SERVICE {props.serviceNumber}</Text>
        </View>
        
        <View style={styles.infoContainer}>
            <View style={styles.infoMatchContainerLeft}>
                <View style={styles.typeTimeMatchContainer}>
                    <Ionicons name='ios-person' size={size} color={Colors.primary}/>
                    <Text style={typeMatchStyle}> {props.typeMatch} </Text>
                    <Ionicons name='ios-person' size={size} color={Colors.primary}/>
                </View>
                <View style={styles.typeTimeMatchContainer}>
                    <Ionicons name={Platform.OS === 'android' ? 'md-hourglass' : 'ios-hourglass'} size={size} color={Colors.primary}/>
                    <Text style={typeMatchStyle}> {props.durationMatch}</Text>
                </View>
            </View>
            <View style={styles.infoMatchDateContainerRight}>
                <View style={styles.typeTimeMatchContainer}> 
                    <Ionicons name={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'} size={size} color={Colors.primary}/>
                    <Text style={editStyle}> Afficher </Text>
                </View>
                <View style={styles.typeTimeMatchContainer}>
                    <Ionicons name={Platform.OS === 'android' ? 'md-time' : 'ios-time'} size={size} color={Colors.primary}/>
                    <Text style={editStyle}> Afficher </Text>
                </View>
            </View>
        </View>

        <View style={styles.tarifContainer}>
            <Text style={titleStyle}>{props.price} <Text style={algerianDinarStyle}>DA/Equipe</Text></Text>
        </View>

        <View style={styles.buttonsContainer}>
           <View style={styles.buttonWidth}>
                <Button
                theme={{colors: {primary:Colors.secondary}}} 
                mode="contained"
                labelStyle={labelBtnStyle}
                contentStyle={{width:'100%'}}
                style={{borderColor:Colors.secondary}}
                dark={true}
                >Modifier
                </Button>
            </View>
            <View style={styles.buttonWidth}>
                <Button
                theme={{colors: {primary:Colors.primary}}} 
                mode="contained"
                labelStyle={labelBtnStyle}
                contentStyle={{width:'100%'}}
                style={{borderColor:Colors.primary}}
                dark={true}
                onPress={props.onPressDelete}
                >Supprimer
                </Button>
            </View>
        </View>

        
    </View>
    );    
};


const styles= StyleSheet.create({
   
 container:{
    borderRadius:10,
    margin:20,
    height:300,
    backgroundColor:"rgba(1,2,3,0.6)"
 },
 containerSmall:{
    borderRadius:10,
    margin:20,
    height:280,
    backgroundColor:"rgba(1,2,3,0.6)"
 },
 containerTall:{
    borderRadius:10,
    margin:20,
    height:350,
    backgroundColor:"rgba(1,2,3,0.6)"
 },
 containerBig:{
    borderRadius:10,
    margin:20,
    height:500,
    backgroundColor:"rgba(1,2,3,0.6)"
 },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 titleContainer:{
    width:'100%',
    height:'25%',
    alignItems:'center',
    justifyContent:'center'
 },
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 title:{
     fontFamily:'poppins-bold',
     fontSize:30,
     color:Colors.primary
 },
 titleSmall:{
    fontFamily:'poppins-bold',
    fontSize:26,
    color:Colors.primary
},
titleTall:{
    fontFamily:'poppins-bold',
    fontSize:32,
    color:Colors.primary
},
titleBig:{
    fontFamily:'poppins-bold',
    fontSize:40,
    color:Colors.primary
},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 infoContainer:{
    width:'100%',
    height:'35%',
    justifyContent: 'space-between',
    flexDirection:'row'
 },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 typeMatch:{
    fontSize:18,
    fontFamily:'poppins',
    color:'white',
 },
 typeMatchSmall:{
    fontSize:15,
    fontFamily:'poppins',
    color:'white',
 },
 typeMatchTall:{
    fontSize:22,
    fontFamily:'poppins',
    color:'white',
 },
 typeMatchBig:{
    fontSize:26,
    fontFamily:'poppins',
    color:'white',
 },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 edit:{
    fontSize:18,
    fontFamily:'poppins',
    color:'white',
    borderBottomColor:'white',
    borderBottomWidth:1
 },
 editSmall:{
    fontSize:16,
    fontFamily:'poppins',
    color:'white',
    borderBottomColor:'white',
    borderBottomWidth:1
 },
 editTall:{
    fontSize:18,
    fontFamily:'poppins',
    color:'white',
    borderBottomColor:'white',
    borderBottomWidth:1
 },
 editBig:{
    fontSize:26,
    fontFamily:'poppins',
    color:'white',
    borderBottomColor:'white',
    borderBottomWidth:1,
    alignSelf:'center'
 },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 infoMatchContainerLeft:{
     width:'50%',
     padding:5,
     alignItems:'center'
 },
 infoMatchDateContainerRight:{
     width:'50%',
     padding:5,
     alignItems:'center'
 },
 typeTimeMatchContainer:{
    flexDirection:'row',
    paddingVertical:10
 },
 tarifContainer:{
     paddingVertical:10,
     alignItems:'center',
     justifyContent:'center',
     width:'100%',
     height:'20%'
 },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 algerianDinar:{
     fontSize:14,
     fontFamily:'poppins',
     color:'white'
 },
 algerianDinarSmall:{
    fontSize:13,
    fontFamily:'poppins',
    color:'white'
},
algerianDinarTall:{
    fontSize:16,
    fontFamily:'poppins',
    color:'white'
},
algerianDinarBig:{
    fontSize:20,
    fontFamily:'poppins',
    color:'white'
},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 buttonsContainer:{
    justifyContent: 'space-around',
    alignItems: 'center',
    height:'20%',
    paddingHorizontal: 20,
    flexDirection:'row'
 },
 buttonWidth:{
    width:'45%',
    borderRadius:20,
    overflow:'hidden'
 },
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 labelBtn:{
    fontSize:15,
    fontFamily:'poppins', 
    color: 'white'
   },
 labelBtnSmall:{
    fontSize:13,
    fontFamily:'poppins', 
    color: 'white'
},
 labelBtnTall:{
    fontSize:16,
    fontFamily:'poppins', 
    color: 'white'
},
 labelBtnBig:{
    fontSize:22,
    fontFamily:'poppins', 
    color: 'white'
}
});

export default ServiceCard;