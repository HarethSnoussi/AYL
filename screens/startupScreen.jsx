import React,{useEffect} from 'react';
import { StyleSheet, View, ImageBackground, ActivityIndicator,AsyncStorage} from 'react-native';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/authActions';
import {useDispatch} from 'react-redux';


const StartupScreen = props =>{

    const dispatch = useDispatch();
    useEffect(()=>{
       const tryLogin=async()=>{
           const userData= await AsyncStorage.getItem('userData');
          
           if(!userData){
               props.navigation.navigate('Auth');
               return;
           }
           
           const transformedData = JSON.parse(userData); // transform string to Javascript Object or Array
           const {token,userID,expiryDate,id} = transformedData;
           const expirationDate = new Date(expiryDate);
           //AsyncStorage.clear();
           
           dispatch(authActions.authenticate(token,userID,expirationDate));
            props.navigation.navigate('Client',{clientID:id,clientUID:userID});
            
       }
       tryLogin();
    },[dispatch]);

    return(
      <View style = {styles.container}>
        <ImageBackground 
        source={{uri:'http://173.212.234.137/assets/tahfifa/support.png'}} 
        style={styles.bigBackgroundImage}
        >
            <ActivityIndicator size='large' color={Colors.primary} />
         </ImageBackground>

      </View>

     );    
};



const styles= StyleSheet.create({
container : {
    flex : 1 ,
},
bigBackgroundImage:{
flex:1,
resizeMode:'cover',
justifyContent:'center',
alignItems:'center'
}

});

export default StartupScreen;