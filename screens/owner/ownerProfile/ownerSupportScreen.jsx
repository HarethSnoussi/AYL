import React from 'react';
import { StyleSheet,View,ImageBackground,Image,Text,Linking,Dimensions} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import Colors from '../../../constants/Colors';


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const OwnerSupportScreen = props =>{

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  let cardStyle= styles.card;
  let titleStyle = styles.title;
  let infoContainerStyle = styles.infoContainer;
  let infoStyle = styles.info;
  let iconStyle = styles.icon;

  if(screen.width < 350){
    cardStyle = styles.cardSmall;
    titleStyle = styles.titleSmall;
    infoStyle = styles.infoSmall;
    iconStyle = styles.iconSmall;
  }

  if(screen.height <= 800 && screen.height >=700){
    infoContainerStyle = styles.infoContainerTall;
    infoStyle = styles.infoTall;
    iconStyle = styles.iconTall;
  }

  if(screen.height > 800){
    cardStyle = styles.cardBig;
    titleStyle = styles.titleBig;
    infoContainerStyle = styles.infoContainerBig;
    infoStyle = styles.infoBig;
    iconStyle = styles.iconBig;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return(
    <View style={styles.container}>
        <View style={cardStyle}>
            <ImageBackground source={require('../../../assets/images/support.png')} style={styles.bigBackgroundImage} blurRadius={0}>
                
            </ImageBackground>
        </View>
        <View style={styles.titleContainer}>
                 <Text style={titleStyle}>Un Problème Téchnique ?</Text>
        </View>
        <View style={styles.card2}>
            <View style={infoContainerStyle}>
              <Image style={iconStyle} source={require('../../../assets/images/whatsapp.png')} />
              <Text  style={infoStyle}>06532458765</Text>
            </View>
            <View style={infoContainerStyle}>
              <Image style={iconStyle}  source={require('../../../assets/images/inbox.png')} />
              <Text style={infoStyle}>contact@partiyadz.com</Text>
            </View>
            <View style={infoContainerStyle}>
              <Image style={iconStyle}  source={require('../../../assets/images/domain.png')} />
              <Text style={infoStyle}>partiyadz.com</Text>
            </View>
        </View>
    </View>

     );    
};

OwnerSupportScreen.navigationOptions= navData => {
    
     return {
         headerRight : ()=>  
               (<HeaderButtons HeaderButtonComponent = {HeaderButton}> 
                 <Item title = "callSupport" 
                   iconName = {Platform.OS === 'android' ? 'md-call' : 'ios-call'}
                   color= {Platform.OS === 'android' ? 'white' : Colors.background}
                   onPress={()=>{
                     let phoneNumber = '';
     
                     if (Platform.OS === 'android') {
                       phoneNumber = 'tel:${06532458765}';
                     } else {
                       phoneNumber = 'telprompt:${06532458765}';
                     }
                 
                     Linking.openURL(phoneNumber);
                   }}
                 />
               </HeaderButtons>
               
             ),
             headerTitle:'Support',
             headerTitleStyle:{
               fontFamily:'poppins',
               color:Platform.OS === 'android' ? 'white' : Colors.background
             },
             headerStyle:{
                 backgroundColor:Platform.OS === 'android' ? Colors.background : 'white'
             },
             headerTintColor:Platform.OS === 'android' ? 'white' : Colors.background,
             headerBackTitle : " "
     
     };
 
  };


const styles= StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    justifyContent:'flex-start'
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   card:{
    margin:15,
    height:'55%',
   },
   cardSmall:{
    margin:15,
    height:'50%',
   },
   cardBig:{
    margin:15,
    height:'60%',
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   bigBackgroundImage:{
    flex:1,
    justifyContent:'flex-end'
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
   titleContainer:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:-35,
    marginHorizontal:5
   },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  title:{
    fontFamily:'poppins-bold',
    color:Colors.background,
    fontSize:24
  },
  titleSmall:{
    fontFamily:'poppins-bold',
    color:Colors.background,
    fontSize:21
  },
  titleBig:{
    fontFamily:'poppins-bold',
    color:Colors.background,
    fontSize:34
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  card2:{
    justifyContent:'center',
    alignItems:'center',
    paddingTop: 20
  },
 
  infoContainer:{
      flexDirection:'row',
      paddingVertical:5
  },
  infoContainerTall:{
    flexDirection:'row',
    paddingVertical:8
  },
  infoContainerBig:{
    flexDirection:'row',
    paddingVertical:10
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  info:{
      fontSize:15,
      fontFamily:'poppins',
      paddingLeft:10,
      color:Colors.background
  },
  infoSmall:{
    fontSize:13,
    fontFamily:'poppins',
    paddingLeft:10,
    color:Colors.background
  },
  infoTall:{
    fontSize:17,
    fontFamily:'poppins',
    paddingLeft:10,
    color:Colors.background
  },
  infoBig:{
    fontSize:18,
    fontFamily:'poppins',
    paddingLeft:10,
    color:Colors.background
  },
////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  icon:{
    height:24,
    width:24
  },
  iconSmall:{
    height:22,
    width:22
    },
  iconTall:{
    height:30,
    width:30
  },
  iconBig:{
    height:32,
    width:32
}
});

export default OwnerSupportScreen;