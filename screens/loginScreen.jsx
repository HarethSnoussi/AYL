import React,{useReducer,useCallback,useState,useEffect} from 'react';
import { StyleSheet,Alert,View,ScrollView,ImageBackground,KeyboardAvoidingView,Text,Platform,Image,Dimensions,TouchableOpacity,ActivityIndicator,AsyncStorage} from 'react-native';
import {Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import Input from '../components/Input';
import {useSelector,useDispatch} from 'react-redux';
import * as playerActions from '../store/actions/playerActions';
import * as ownerActions from '../store/actions/ownerActions';
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
  
  /*
   *******Fetch All Players and Owners
  */
  const dispatch =useDispatch();
  useEffect(()=>{

 const getPlayers = async()=>{ 
  try{
     dispatch(playerActions.setPlayers());
     }catch(err){
       console.log(err);
     }
 };
 const getOwners = async()=>{ 
  try{
     dispatch(ownerActions.setOwners());
     }catch(err){
       console.log(err);
     }
 };
 getPlayers();
 getOwners();
},[dispatch])
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
   let titleContainerStyle= styles.titleContainer;
   let titleStyle = styles.title;
   let iconContainerStyle = styles.iconContainer;
   let signupContainerStyle = styles.signupContainer;
   let buttonLabelStyle = styles.buttonLabel;
   let accountTextContainerStyle = styles.accountTextContainer;
   let accountOrTextStyle = styles.accountOrText;
   let registerNowTextStyle = styles.registerNowText;
   let connectWidthTextStyle = styles.connectWidthText;
   let facebookIconStyle = styles.facebookIcon;

   if(screen.width < 350){
    titleContainerStyle= styles.titleContainerSmall;
    titleStyle = styles.titleSmall;
    iconContainerStyle = styles.iconContainerSmall;
    signupContainerStyle = styles.signupContainerSmall;
    buttonLabelStyle = styles.buttonLabelSmall;
    accountTextContainerStyle = styles.accountTextContainerSmall;
    accountOrTextStyle = styles.accountOrTextSmall;
    registerNowTextStyle = styles.registerNowTextSmall;
    connectWidthTextStyle = styles.connectWidthTextSmall;
    facebookIconStyle = styles.facebookIconSmall;
   }

   if(screen.height <= 800 && screen.height >=700){
    titleContainerStyle = styles.titleContainerBig;
    textInputStyle = styles.textInputTall;
    accountTextContainerStyle = styles.accountTextContainerTall;
    iconContainerStyle = styles.iconContainerTall;
   }

   if(screen.height > 800){
    titleContainerStyle= styles.titleContainerBig;
    titleStyle = styles.titleBig;
    iconContainerStyle = styles.iconContainerBig;
    signupContainerStyle = styles.signupContainerBig;
    textInputStyle = styles.textInputBig;
    buttonLabelStyle = styles.buttonLabelBig;
    accountTextContainerStyle = styles.accountTextContainerBig;
    accountOrTextStyle = styles.accountOrTextBig;
    registerNowTextStyle = styles.registerNowTextBig;
    connectWidthTextStyle = styles.connectWidthTextBig;
    facebookIconStyle = styles.facebookIconBig;
   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const players= useSelector(state=>state.players.players);
  const owners= useSelector(state=>state.owners.owners);
  console.log(owners);
  console.log(players);
  ////Input management
  const [isLogin,setIsLogin]= useState(false);//ActivityIndicator handling
  
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


const saveDataToStorage = (token,userID,expirationDate,gender,id) => {

  AsyncStorage.setItem('userData',
                        JSON.stringify({
                        token:token,
                        userID:userID,
                        expiryDate: expirationDate.toISOString(),
                        gender:gender,
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
        const result = await fetch(`http://192.168.1.39:3000/phone/${formState.inputValues.phone}`);
        const resData= await result.json();
        setIsLogin(false);
        const currentPlayer= players.find(item=>item.phone===formState.inputValues.phone && 
                                                item.password===hashedPassword);
        const currentOwner= owners.find(item=>item.phone===formState.inputValues.phone && 
          item.password===hashedPassword);
                                                
        if(resData.userRecord.phoneNumber === formState.inputValues.phone &&(currentPlayer || currentOwner)){

          if(currentPlayer){
            props.navigation.navigate('Player',{playerID:currentPlayer.id,playerUID:resData.userRecord.uid});
            saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentPlayer.type,currentPlayer.id);
            Alert.alert(`${currentPlayer.name} ${currentPlayer.surname}`,'Contents de vous revoir!',[{text:"Merci"}]); 
          }else{
            props.navigation.navigate('Owner',{ownerID:currentOwner.id,ownerUID:resData.userRecord.uid});
            saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentOwner.type,currentOwner.id);
            Alert.alert(`${currentOwner.fullname}`,'Contents de vous revoir!',[{text:"Merci"}]);
          }
          
          
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
      <View style={styles.container}>
      <ImageBackground source={require('../assets/images/player.jpg')} style={styles.bigBackgroundImage}>
       <KeyboardAvoidingView behavior='height'  keyboardVerticalOffset={10} style={styles.overlayBackground}>
           <ScrollView showsVerticalScrollIndicator={false}>
             <View style={titleContainerStyle}>
               <Text style={titleStyle}>Bienvenue à</Text>
             </View>
             <View style = {iconContainerStyle} >
              <Image style={{width:'100%', height:'100%'}} source = {require("../assets/images/5.png")}/>
             </View>
             <View style={signupContainerStyle}>
                <Input
                  id='phone'
                  label='Téléphone'
                  keyboardType="phone-pad"
                  placeholder='Exemple: +213658341876'
                  returnKeyType="next"
                  onInputChange={inputChangeHandler}
                  initialValue=''
                  initiallyValid={true}
                  phone
                  required
                  errorText='Veuillez entrer un numéro valide svp!'
                />
                <Input
                  id='password'
                  label='Mot de Passe'
                  keyboardType="default"
                  returnKeyType="next"
                  secureTextEntry
                  minLength={6}
                  autoCapitalize='none'
                  onInputChange={inputChangeHandler}
                  initialValue=''
                  initiallyValid={true}
                  required
                  errorText='Veuillez entrer minimum 6 caractères svp!'
                />
               <View style={styles.buttonsContainer}>
                 <View style={styles.buttonContainer}>
                   {!isLogin ? <Button
                   theme={{colors: {primary:'white'}}} 
                   mode={Platform.OS === 'android' ? "contained" : "outlined"}
                   labelStyle={buttonLabelStyle}
                   contentStyle={{width:'100%'}}
                   style={{borderRadius:20, backgroundColor:Colors.primary}}
                   icon='login'
                   dark={true}
                   onPress={login}
                   >Se connecter 
                   </Button>:<ActivityIndicator color={Colors.primary} />}
                 </View>
                 <View style={styles.facebookContainer}>
                   <TouchableOpacity style={accountTextContainerStyle} onPress={()=>props.navigation.navigate('ForgotPassword')}>
                    <Text style={accountOrTextStyle}>Mot de passe oublié ?</Text>
                   </TouchableOpacity>
                   <View style={styles.loginFacebookContainer}>
                     <TouchableOpacity onPress={()=>props.navigation.navigate('Role')}>
                       <Text style={registerNowTextStyle}>S'inscrire Maintenant</Text>
                     </TouchableOpacity>
                     <Text style={accountOrTextStyle}>Ou</Text>
                     <TouchableOpacity  onPress={()=>props.navigation.navigate('Client')}>
                       <Text style={connectWidthTextStyle}>Suivez-nous sur</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.facebookIconContainer}>
                      <Image style={facebookIconStyle} source = {require('../assets/images/facebook.png')} />
                      <Image style={facebookIconStyle} source = {require('../assets/images/instagram.png')} />
                      <Image style={facebookIconStyle} source = {require('../assets/images/linkedin.png')} /> 
                     </TouchableOpacity>     
                   </View>
                 </View>
               </View>
             </View>
           </ScrollView>
       </KeyboardAvoidingView> 
      </ImageBackground>
     </View>

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
    backgroundColor: '#fff'
   },
   bigBackgroundImage:{
    flex:1,
    resizeMode:'cover',
    width:'100%',
    height:'100%'
  },
  overlayBackground:{
    backgroundColor:"rgba(0, 0, 0, 0.7)", 
    flex:1,
    height:'100%',
    width:'100%'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  titleContainer:{
    alignItems:'center',
    marginTop:40
  },
  titleContainerSmall:{
    alignItems:'center',
    marginTop:30,
  },
  titleContainerTall:{
    alignItems:'center',
    marginTop:50,
  },
  titleContainerBig:{
    alignItems:'center',
    marginTop:60
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  title:{
    color:'white',
    fontFamily:'poppins',
    fontSize:42
  },
  titleSmall:{
    color:'white',
    fontFamily:'poppins',
    fontSize:34
  },
  titleBig:{
    color:'white',
    fontFamily:'poppins',
    fontSize:54
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  iconContainer :{  
    width : 100 , 
    height : 100 ,  
    alignSelf : "center"
   },
   iconContainerSmall:{
    width : 90 , 
    height : 90 ,  
    alignSelf : "center"
   },
   iconContainerTall:{
    width : 150 , 
    height : 150 ,  
    alignSelf : "center"
   },
   iconContainerBig:{
    width : 180 , 
    height : 180 ,  
    alignSelf : "center"
   },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  signupContainer:{
    padding:20
  },
  signupContainerSmall:{
    padding:10
  },
  signupContainerBig:{
    padding:40
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  inputsContainer:{
    marginBottom:30
  },
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  buttonsContainer:{
    alignItems:'center',
    marginHorizontal:10,
    marginTop:30
  },
  buttonsContainerSmall:{
    marginTop:20
  },
  buttonsContainerTall:{
    marginTop:40
  },
  buttonsContainerBig:{
    marginTop:50
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  buttonContainer:{
    paddingVertical:5
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  buttonLabel:{
    fontSize:16,
    fontFamily:'poppins', 
    color: 'white'
  },
  buttonLabelSmall:{
    fontSize:14,
    fontFamily:'poppins', 
    color: 'white'
  }, 
  buttonLabelBig:{
    fontSize:20,
    fontFamily:'poppins', 
    color: 'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookContainer:{
     alignItems:'center',
     justifyContent:'center'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  accountTextContainer:{
     marginVertical:10
  },
  accountTextContainerSmall:{
    marginVertical:7
  },
  accountTextContainerTall:{
    marginVertical:15
  },
  accountTextContainerBig:{
    marginVertical:20
 },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  accountOrText:{
    fontFamily:'poppins',
    fontSize:13,
    color:'#A8A8A8'
  },
  accountOrTextSmall:{
    fontFamily:'poppins',
    fontSize:12,
    color:'#A8A8A8'
  },
  accountOrTextBig:{
    fontFamily:'poppins',
    fontSize:19,
    color:'#A8A8A8'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  loginFacebookContainer:{
    alignItems:'center',
     justifyContent:'center',
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  registerNowText:{
    fontFamily:'poppins',
    fontSize:13,
    color:Colors.primary
  },
  registerNowTextSmall:{
    fontFamily:'poppins',
    fontSize:12,
    color:Colors.primary
  },
  registerNowTextBig:{
    fontFamily:'poppins',
    fontSize:17,
    color:Colors.primary
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  connectWidthText:{
    fontFamily:'poppins',
    fontSize:13,
    color:'white'
  },
  connectWidthTextSmall:{
    fontFamily:'poppins',
    fontSize:12,
    color:'white'
  },
  connectWidthTextBig:{
    fontFamily:'poppins',
    fontSize:17,
    color:'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookIconContainer:{
    paddingVertical:5,
    flexDirection:'row'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookIcon:{
    width:24,
    height:24,
    marginHorizontal:5
  },
  facebookIconSmall:{
    width:20,
    height:20,
    marginHorizontal:5
  },
  facebookIconBig:{
    width:32,
    height:32,
    marginHorizontal:5
  }
  
});

export default LoginScreen;