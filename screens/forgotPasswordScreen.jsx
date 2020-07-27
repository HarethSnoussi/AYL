import React,{useReducer,useCallback,useState,useEffect} from 'react';
import { StyleSheet,Alert,View,ImageBackground,KeyboardAvoidingView,Text,TextInput,Platform,Image,Dimensions,ActivityIndicator,ScrollView,AsyncStorage} from 'react-native';
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


const ForgotPasswordScreen = props=>{

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
},[dispatch]);

  const players= useSelector(state=>state.players.players);
  const owners= useSelector(state=>state.owners.owners);
  // console.log('ForgotPassword screen',players);
  // console.log('ForgotPassword screen',owners);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
   *******Responsivity
  */
  let buttonLabelStyle = styles.buttonLabel;
  let iconContainerStyle = styles.iconContainer;

  if(screen.width < 350){
    buttonLabelStyle = styles.buttonLabelSmall;
    iconContainerStyle = styles.iconContainerSmall;
   }

   if(screen.height <= 800 && screen.height >=700){
    iconContainerStyle = styles.iconContainerTall;
   }

   if(screen.height > 800){
    buttonLabelStyle = styles.buttonLabelBig;
    iconContainerStyle = styles.iconContainerBig;
   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
   *********************** Input Management
   */
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
 //Press verifyNumber Button handling ==> Verification
 const [isVerified,setIsVerified]= useState(false);
 const [isLogin,setIsLogin]= useState(false);

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
 

 const verifyNumber = async ()=>{

  if(formState.inputValidities.phone && formState.inputValues.phone){
    try{
      
      setIsLogin(true);
      const result = await fetch(`http://192.168.1.37:3000/phone/${formState.inputValues.phone}`);
      const resData= await result.json();
      setIsLogin(false);
      
                                              
      if(resData.userRecord.phoneNumber === formState.inputValues.phone){
          setIsVerified(true);
      }else{
        setIsVerified(false);
        Alert.alert('Erreur!','Ce numéro de téléphone n\'existe pas. Veuillez créer un nouveau compte svp!',[{text:"OK"}]);
      }
     
    }catch(error){
      console.log(error);
      Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
      setIsLogin(false);
    }
  }else{
    Alert.alert('Erreur!','Numéro de téléphone invalide.',[{text:"OK"}]);
  } 

};

   const login = async()=>{

    if(formState.formIsValid && formState.inputValues.password){
     try{
        const hashedPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA512,
          formState.inputValues.password
        );

        const currentPlayerObject= players.find(item=> item.phone===formState.inputValues.phone && item.password===hashedPassword);
        const currentOwnerObject= owners.find(item=>item.phone===formState.inputValues.phone && item.password===hashedPassword);
        if(currentPlayerObject){
          Alert.alert('Erreur!','Votre nouveau mot de passe doit être différent d\'ancien mot de passe.',[{text:"Réessayer"}]);
          return;
        }else if(currentOwnerObject){
          Alert.alert('Erreur!','Votre nouveau mot de passe doit être différent d\'ancien mot de passe.',[{text:"Réessayer"}]);
          return;
        }
        setIsLogin(true);
        const result = await fetch(`http://192.168.1.37:3000/phone/${formState.inputValues.phone}`);
        const resData= await result.json();
        setIsLogin(false);
  
        const currentPlayer= players.find(item=>item.phone===formState.inputValues.phone);
        const currentOwner= owners.find(item=>item.phone===formState.inputValues.phone);

        
        if(currentPlayer){
            
            dispatch(playerActions.updatePlayerPassword(formState.inputValues.phone,hashedPassword));
            Alert.alert(`${currentPlayer.name} ${currentPlayer.surname}`,'Contents de vous revoir!',[{text:"Merci"}]);
            props.navigation.navigate('Player',{playerID:currentPlayer.id,playerUID:resData.userRecord.uid});
            saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentPlayer.type,currentplayer.id);
        }else if(currentOwner){
          dispatch(ownerActions.updateOwnerPassword(formState.inputValues.phone,hashedPassword));
          Alert.alert(`${currentOwner.fullname}`,'Contents de vous revoir!',[{text:"Merci"}]);
          props.navigation.navigate('Owner',{ownerID:currentOwner.id,ownerUID:resData.userRecord.uid});
          saveDataToStorage(resData.token,resData.userRecord.uid,new Date(resData.expirationDate),currentOwner.type,currentOwner.id);
        }
        
        
      
     }catch(err){
        console.log(error);
        Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
        setIsLogin(false);
     }

    }else{
      Alert.alert('Erreur!','Veuillez rentrer votre nouveau mot de passe s\'il vous plait!',[{text:"OK"}]);
    }
    
   };

    return(

    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/player.jpg')} style={styles.bigBackgroundImage}>
        <KeyboardAvoidingView behavior='height'  keyboardVerticalOffset={10} style={styles.overlayBackground}>
          <ScrollView style={{width:'100%',height:'100%'}} contentContainerStyle={{alignItems:'center',justifyContent:'flex-end'}}>
            <View style={styles.firstContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Récupération du compte</Text>
              </View>
              <View style={iconContainerStyle}>
                <Image style={styles.image} source = {require("../assets/images/5.png")}/>
              </View> 
            </View>

           <View style={styles.secondContainer}>
              <View style={styles.inputContainer}>
                <Input
                    id='phone'
                    label='Téléphone'
                    placeholder='Exemple: +213658341876'
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    phone
                    required
                    errorText='Veuillez entrer un numéro de téléphone valide svp!'
                    editable={!isVerified}
                  />
                  <Input
                  id='password'
                  label='Nouveau mot de passe'
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
                  editable={isVerified}
                />
              </View>
              <View style={styles.buttonContainer}>
                {!isVerified ?
                <Button
                  theme={{colors: {primary:'white'}}} 
                  mode={Platform.OS === 'android' ? "contained" : "outlined"}
                  labelStyle={buttonLabelStyle}
                  contentStyle={{width:'100%'}}
                  style={styles.button}
                  icon='check'
                  dark={true}
                  onPress={verifyNumber}
                  >
                    Vérifier
                </Button>:
                <Button
                theme={{colors: {primary:'white'}}} 
                mode={Platform.OS === 'android' ? "contained" : "outlined"}
                labelStyle={buttonLabelStyle}
                contentStyle={{width:'100%'}}
                style={styles.button2}
                icon='login'
                dark={true}
                onPress={login}
                >
                  Se connecter
              </Button> }
              </View>
              {isLogin && <ActivityIndicator  size='small' color={Colors.primary} />}
            </View>
               
            <View style={styles.thirdContainer}>
                <Text style={{color:!isVerified ?Colors.secondary:'#A8A8A8',fontFamily:'poppins',fontSize:14}}>1- Vérifier votre numéro de téléphone.</Text>
                <Text style={{color:isVerified?Colors.secondary:'white',fontFamily:'poppins',fontSize:14}}>2- Réinitialiser votre mot de passe.</Text>
            </View>
            </ScrollView>
        </KeyboardAvoidingView> 
      </ImageBackground>
    </View>
    );

};

ForgotPasswordScreen.navigationOptions= ()=>{
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
  }

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
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
},
firstContainer:{
    height:'30%',
    width:'90%',
    paddingBottom:70
},
titleContainer:{
    height:'15%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    marginBottom:10
},
title:{
  color:'white',
  fontFamily:'poppins-bold',
  fontSize:24
},
image:{
  width:'100%',
  height:'100%'
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
  secondContainer:{
    height:'40%',
    width:'90%',
    justifyContent:'center'
  },
  inputContainer:{
    height:'80%',
    paddingHorizontal:20,
    justifyContent:'center',
    paddingBottom:30
  },
  buttonContainer:{
    height:'20%',
    alignItems:'center',
    justifyContent:'center'
  },
  thirdContainer:{
    height:'20%',
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:30
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
button:{
  borderRadius:20,
  backgroundColor:Colors.primary
},
button2:{
  borderRadius:20,
  backgroundColor:Colors.secondary
}

 });

export default ForgotPasswordScreen;