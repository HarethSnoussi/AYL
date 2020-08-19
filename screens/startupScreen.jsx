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
           

           await dispatch(authActions.refreshTokenStepOne(token));
           //AsyncStorage.clear();
           const userTokenData= await AsyncStorage.getItem('userTokenData');
           if(!userTokenData){
            props.navigation.navigate('Auth');
            return;
           }
   
           const transformedTokenData= JSON.parse(userTokenData);
           const {refreshToken,expiresIn}= transformedTokenData;
           

           const expirationTime = expirationDate.getTime() - new Date().getTime();
           const newExpirationTime= expirationTime + parseInt(expiresIn);
            
            props.navigation.navigate('Client',{clientID:id,clientUID:userID});
            dispatch(authActions.authenticate(refreshToken,userID,newExpirationTime));
       }
       tryLogin();
    },[dispatch]);

    return(
      <View style = {styles.container}>
        <ImageBackground 
        source={require('../assets/images/support.png')} 
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