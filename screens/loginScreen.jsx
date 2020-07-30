import React,{useReducer,useCallback,useState} from 'react';
import { StyleSheet,Alert,View,ScrollView,StatusBar,ImageBackground,KeyboardAvoidingView,Text,Platform,Image,Dimensions,TouchableOpacity,ActivityIndicator,AsyncStorage} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {MaterialIcons} from "@expo/vector-icons";
import {Button } from 'react-native-elements';
import CustomInput from '../components/Input';
import Colors from '../constants/Colors';
import * as Crypto from 'expo-crypto'; 


//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

//UseReducer Input Management//////////////////////////////////////////////////////////////////////////////////
const Form_Input_Update = 'Form_Input_Update';
const formReducer=(state,action) =>{
    if(action.type === Form_Input_Update){
        const updatedValues = {
          ...state.inputValues,
          [action.inputID]:action.value
        };
        const updatedValidities = {
          ...state.inputValidities,
          [action.inputID]:action.isValid
        };
        let formIsValidUpdated = true;
        for(const key in updatedValidities){
          formIsValidUpdated = formIsValidUpdated && updatedValidities[key];
        }
        return{
          inputValues:updatedValues,
          inputValidities:updatedValidities,
          formIsValid:formIsValidUpdated
        };
    }
   
     return state;
    
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const LoginScreen = props =>{
  
  
  ////Input management
  const [isLogin,setIsLogin]= useState(false);//ActivityIndicator handling
  const prefix='+213';
  
  const[formState,disaptchFormState] = useReducer(formReducer,
             {inputValues:{
               phone: '',
               password:''
             },
              inputValidities:{
                phone:false,
                password:false
              },
              formIsValid:false});

  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{

    disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  },[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const saveDataToStorage = (token,userID,expirationDate,id) => {

  AsyncStorage.setItem('userData',
                        JSON.stringify({
                        token:token,
                        userID:userID,
                        expiryDate: expirationDate.toISOString(),
                        id:id
                       }) 
                       );

};

  //Press Login Button handling ==> LOGIN
  const login = async ()=>{

    if(formState.formIsValid){
      try{
        const hashedPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA512,
          formState.inputValues.password
        );
        
        setIsLogin(true);
        const result = await fetch(`http://192.168.1.34:3000/phone/${prefix+formState.inputValues.phone}`);
        const resData= await result.json();
        const clientsData= await fetch('http://192.168.1.34:3000/client');
        const clients= await clientsData.json();
        setIsLogin(false);
        const currentClient= clients.find(item=>item.phone===prefix+formState.inputValues.phone && 
                                                item.password===hashedPassword);
                                               
        if(resData.userRecord.phoneNumber === prefix+formState.inputValues.phone && currentClient){
            props.navigation.navigate('Client',{clientID:currentClient.id,clientUID:resData.userRecord.uid});
            saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentClient.id);
            Alert.alert(`${currentClient.name} ${currentClient.surname}`,'Contents de vous revoir!',[{text:"Merci"}]);
          
        }else{
          Alert.alert('Erreur!','Numéro de téléphone ou mot de passe invalide.',[{text:"OK"}]);
        }

      }catch(error){
        console.log(error);
        Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
        setIsLogin(false);
       
      }
    }else{
      Alert.alert('Erreur!','Numéro de téléphone ou mot de passe invalide.',[{text:"OK"}]);
    } 

  };

             

           

    return(
      <ImageBackground source={require('../assets/images/chico.jpg')} style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={10}>
      <StatusBar hidden />
          <View style={styles.firstContainer}>
             <Image source={require('../assets/images/icon.png')} style={styles.icon}/>
             <Text style={styles.slogan}>Réservez votre coiffure à l'heure et à l'endroit qui vous arrangent</Text>
          </View>
          <View style={styles.secondContainer}>
                 <CustomInput
                    id='phone'
                    rightIcon={<MaterialIcons title = "phone" name ='phone' color='#323446' size={23} />}
                    leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:5,marginRight:5}}><Image source={require('../assets/images/algeriaFlag.png')} style={{width:24,height:28,marginRight:5,marginLeft:-15}}/><Text style={styles.phoneNumber}>+213</Text></View>}
                    placeholder='555555555'
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    phone
                    required
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    inputStyle={{fontSize:15}}
                    backgroundColor='#d3d3d3'
                    textColor={Colors.blue}
                    widthView='100%'
                  />
                  <CustomInput
                    id='password'
                    rightIcon={<MaterialIcons title="lock" name ='remove-red-eye' color='#323446' size={23} />}
                    placeholder='Mot de Passe'
                    keyboardType="default"
                    returnKeyType="next"
                    secureTextEntry
                    minLength={6}
                    autoCapitalize='none'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    required
                    placeholderTextColor='rgba(50,52,70,0.4)'
                    inputStyle={{fontSize:15}}
                    backgroundColor='#d3d3d3'
                    textColor={Colors.blue}
                    widthView='100%'
                  />
                  {!isLogin?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title="Se connecter"
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    onPress={login}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />:<ActivityIndicator color={Colors.primary} style={{marginTop:5}}/>}
                  <TouchableOpacity onPress={()=>props.navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
                </TouchableOpacity>
              <View style={styles.loginContainer}>
                <Text style={styles.doYouHaveAnAccount}>Vous n'avez pas un compte? </Text>
                <TouchableOpacity onPress={()=>props.navigation.navigate('Signup')}>
                  <Text style={styles.loginText}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
          </View>
        
          
      </KeyboardAvoidingView>
    </ImageBackground>

     );    
};

LoginScreen.navigationOptions= ()=>{
  return {
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
    )};
};

const styles= StyleSheet.create({
  container:{
    flex: 1,
    resizeMode:'contain',
    width:'100%',
    
   },
  firstContainer:{
    width:'70%',
    height:'50%',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  icon:{
    width:80,
    height:80
  },
  slogan:{
    fontSize:15,
    fontFamily:'poppins-bold',
    color:'#FFF',
    paddingTop:15
  },
  secondContainer:{
    width:'85%',
    height:'50%',
    alignSelf:'center',
    justifyContent:'center'
  },
  labelButton:{
   color:'#FFF',
   fontFamily:'poppins',
   fontSize:16,
   textTransform:null,
  },
  buttonStyle:{
   borderColor:'#fd6c57',
   width:'100%',
   borderRadius:20,
   height:45,
   alignSelf:'center',
   marginTop:10
  },
   loginContainer:{
    flexDirection:'row',
    paddingTop:20,
    alignSelf:'center'
  },
  doYouHaveAnAccount:{
    fontSize:14,
    fontFamily:'poppins',
    color:'#fff'
  },
  loginText:{
    fontSize:14,
    fontFamily:'poppins-bold',
    color:'#fd6c57'
  },
  forgotPassword:{
    fontSize:14,
    fontFamily:'poppins',
    color:'#fff',
    alignSelf:'center',
    paddingTop:10
  }
  
});

export default LoginScreen;