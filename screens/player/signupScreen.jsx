import React,{useReducer,useCallback,useRef,useState} from 'react';
import { StyleSheet,View,ScrollView,ImageBackground,KeyboardAvoidingView,Text,Platform,Image,Dimensions,TextInput, ActivityIndicator,Alert,TouchableOpacity,AsyncStorage} from 'react-native';
import {Button} from 'react-native-paper';
import Colors from '../../constants/Colors';
import Firebaseconfig from '../../helpers/Firebaseconfig';
import Input from '../../components/Input';
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import * as playerActions from '../../store/actions/playerActions';
import {useDispatch} from 'react-redux';
import * as Crypto from 'expo-crypto'; 

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

//Firebase config
try {
  if (Firebaseconfig.apiKey) {
    firebase.initializeApp(Firebaseconfig);
  }
} catch (err) {
  // ignore app already initialized error on snack
}


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

const SignupScreen = props =>{

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState('');
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const dispatch = useDispatch();
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  let titleContainerStyle= styles.titleContainer;
  let titleStyle = styles.title;
  let signupContainerStyle = styles.signupContainer;
  let inputsContainerStyle = styles.inputsContainer;
  let labelSignupStyle= styles.labelSignup;
  let facebookContainerStyle = styles.facebookContainer;
  let facebookTextStyle = styles.facebookText;
  let facebookIconStyle = styles.facebookIcon;
  let termsConditionsTextStyle = styles.termsConditionsText;

  if(screen.width < 350){
    titleContainerStyle= styles.titleContainerSmall;
    titleStyle = styles.titleSmall;
    signupContainerStyle = styles.signupContainerSmall;
    inputsContainerStyle = styles.inputsContainerSmall;
    labelSignupStyle = styles.labelSignupSmall;
    facebookContainerStyle = styles.facebookContainerSmall;
    facebookTextStyle = styles.facebookTextSmall;
    facebookIconStyle = styles.facebookIconSmall;
    termsConditionsTextStyle = styles.termsConditionsTextSmall;
   
   }

   if(screen.height <= 800 && screen.height >=700){
    titleContainerStyle = styles.titleContainerBig;
    inputsContainerStyle = styles.inputsContainerTall;
    facebookContainerStyle = styles.facebookContainerTall;
   }

   if(screen.height > 800){

    titleContainerStyle= styles.titleContainerBig;
    titleStyle = styles.titleBig;
    signupContainerStyle = styles.signupContainerBig;
    inputsContainerStyle = styles.inputsContainerBig;
    labelSignupStyle = styles.labelSignupBig;
    facebookContainerStyle = styles.facebookContainerBig;
    facebookTextStyle = styles.facebookTextBig;
    facebookIconStyle = styles.facebookIconBig;
    termsConditionsTextStyle = styles.termsConditionsTextBig;
   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
    const[formState,disaptchFormState] = useReducer(formReducer,
      {inputValues:{
        name:'',
        surname:'',
        phone: '',
        password:''
      },
      inputValidities:{
        name:false,
        surname:false,
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

     const signupHandler = async () => {

      const phoneProvider = new firebase.auth.PhoneAuthProvider();
     
      if(formState.formIsValid){
        try {

          setVerifyInProgress(true);
          const result = await fetch(`http://192.168.1.37:3000/phone/${formState.inputValues.phone}`);
          const resData= await result.json();
          console.log(resData);
          setVerifyInProgress(false);

          //Check if User Exists
          if(resData.userRecord.phoneNumber === formState.inputValues.phone){
            Alert.alert('Erreur!','Ce Numéro de Téléphone existe déjà!',[{text:"OK"}]);
          }else{
            //if User is new (doesnt Exist), Recaptcha starts
            setVerifyInProgress(true);
            setVerificationId('');
            const verificationId = await phoneProvider.verifyPhoneNumber(
              formState.inputValues.phone,
              // @ts-ignore
              recaptchaVerifier.current
            );
            
            setVerifyInProgress(false);
            setVerificationId(verificationId);
          }

        }catch (err) {
          console.log(err); 
          Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
          setVerifyInProgress(false);
        }
      }else{
         Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
      }
     
    };

    const sendCode = async () => {
      try {
        setConfirmError(undefined);
        setConfirmInProgress(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
        
         await firebase.auth().signInWithCredential(credential);

          //Retrieve user data
          const user = firebase.auth().currentUser;
          const tokenResult = await user.getIdTokenResult();
          const expirationDate= new Date(Date.parse(tokenResult.expirationTime));

          setConfirmInProgress(false);
          setVerificationId("");
          setVerificationCode("");

          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            formState.inputValues.password
          );

          dispatch(playerActions.createPlayer(formState.inputValues.phone,formState.inputValues.phone,
            hashedPassword,formState.inputValues.name,
            formState.inputValues.surname));
            
          props.navigation.navigate('Player',{playerID:formState.inputValues.phone,playerUID:user.uid}); 
          Alert.alert(`${formState.inputValues.name} ${formState.inputValues.surname}`,'Bienvenue à FootBooking :-)',[{text:"Merci"}]);
          saveDataToStorage(tokenResult.token,user.uid,expirationDate,"Player",formState.inputValues.phone);                                  
   

      } catch (err) {
            setConfirmError(err);
            Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
            console.log(err);
            setConfirmInProgress(false);
      }
      
    };

   

    return(
      <View style={styles.container}>
       <ImageBackground source={require('../../assets/images/player.jpg')} style={styles.bigBackgroundImage}>
        <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={10} style={styles.overlayBackground}>
            <ScrollView>
            
              <View style={titleContainerStyle}>
              <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={Firebaseconfig}
              />
                <Text style={titleStyle}>Inscrivez-Vous</Text>
              </View>
              <View style={signupContainerStyle}>
                <View style={inputsContainerStyle}>
                     <Input
                        id='name'
                        label='Nom'
                        placeholder='Votre nom'
                        mode='flat'
                        keyboardType="default"
                        returnKeyType="next"
                        autoCapitalize='sentences'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                        initiallyValid={true}
                        required
                        errorText='Veuillez entrer votre nom svp!'
                        editable={!verificationId}
                        minLength={3}
                    />
                    <Input
                      id='surname'
                      label='Prénom'
                      placeholder='Votre prénom'
                      mode='flat'
                      keyboardType="default"
                      returnKeyType="next"
                      autoCapitalize='sentences'
                      onInputChange={inputChangeHandler}
                      initialValue=''
                      initiallyValid={true}
                      required
                      errorText='Veuillez entrer votre prénom svp!'
                      editable={!verificationId}
                      minLength={3}
                    />
                    <Input
                      id='phone'
                      label='Téléphone *'
                      mode='flat'
                      placeholder='Exemple: +213658341876'
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue=''
                      initiallyValid={true}
                      phone
                      required
                      errorText='Veuillez entrer un numéro valide svp!'
                      editable={!verificationId}
                  />
                  <Input
                    id='password'
                    label='Mot de Passe *'
                    mode='flat'
                    placeholder='Exemple: 96foot*/'
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
                    editable={!verificationId}
                  />
                </View>
                <View style={styles.buttonsContainer}>
                  <View style={styles.buttonContainer}>
                    {!verificationId ? (<View>
                    <Button
                      theme={{colors: {primary:"white"}}} 
                      mode={Platform.OS === 'android' ? "contained" : "outlined"}
                      labelStyle={labelSignupStyle}
                      contentStyle={{width:'100%'}}
                      style={{borderRadius:20,backgroundColor:Colors.primary}}
                      icon='open-in-app'
                      dark={true}
                      onPress={signupHandler}
                    >S'inscrire
                    </Button>
                    {verifyInProgress && <ActivityIndicator color={Colors.primary} style={styles.loader} />}
                    </View>):
                    (<View>
                      <TextInput
                       placeholder='Taper vos 6 chiffres'
                       onChangeText={verificationCode=>setVerificationCode(verificationCode)}
                       style={styles.textInputSendCode}
                       keyboardType='number-pad'
                       autoCapitalize='none'
                       returnKeyType="next"
                      />
                      <Button
                        theme={{colors: {primary:"white"}}} 
                        mode={Platform.OS === 'android' ? "contained" : "outlined"}
                        labelStyle={labelSignupStyle}
                        contentStyle={{width:'100%'}}
                        style={{borderRadius:20,backgroundColor:Colors.primary}}
                        icon='check'
                        dark={true}
                        onPress={sendCode}
                    >Confirmer
                    </Button>
                    {confirmError && (<Text style={styles.confirmErrorText}>Erreur: code erroné!</Text>)}
                    {confirmInProgress ? <ActivityIndicator color={Colors.primary} style={styles.loader} />:<Text style={styles.smsText}>Un code de 6 chiffres a été envoyé sur votre SMS</Text>}
                    </View>)}
                  </View>
                 
                  <TouchableOpacity style={styles.termsConditionsContainer}>
                     <Text style={termsConditionsTextStyle}>Lisez les termes et conditions avant s'inscrire</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>props.navigation.navigate('Role')} style={styles.backButton}>
                     <MaterialCommunityIcons title = "Back" 
                            name = 'arrow-left-drop-circle-outline'
                            color={Colors.primary} size={32} />
                  </TouchableOpacity>

                </View>

              </View>
            </ScrollView>
        </KeyboardAvoidingView> 
       </ImageBackground>
      </View>

     );    
};

SignupScreen.navigationOptions= ()=>{
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
    backgroundColor: '#fff',
    
   },
   bigBackgroundImage:{
    flex:1,
    resizeMode:'cover',
    width:'100%'
    
  },
  overlayBackground:{
    backgroundColor:"rgba(0, 0, 0, 0.7)", 
    flex:1,
    justifyContent:'center'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  titleContainer:{
    alignItems:'center',
    marginTop:50,
    backgroundColor:'white',
    alignSelf:'center',
    padding:10,
    borderRadius:20
  },
  titleContainerSmall:{
    alignItems:'center',
    marginTop:35,
    backgroundColor:'white',
    alignSelf:'center',
    padding:10,
    borderRadius:20
  },
  titleContainerTall:{
    alignItems:'center',
    marginTop:60,
    backgroundColor:'white',
    alignSelf:'center',
    padding:10,
    borderRadius:20
  },
  titleContainerBig:{
    alignItems:'center',
    marginTop:70,
    backgroundColor:'white',
    alignSelf:'center',
    padding:20,
    borderRadius:20
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  title:{
    color:Colors.primary,
    fontFamily:'poppins-bold',
    fontSize:26
  },
  titleSmall:{
    color:Colors.primary,
    fontFamily:'poppins-bold',
    fontSize:20
  },
  titleBig:{
    color:Colors.primary,
    fontFamily:'poppins-bold',
    fontSize:46
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  signupContainer:{
    paddingHorizontal:20,
    marginVertical:10
  },
  signupContainerSmall:{
    paddingHorizontal:15,
    marginVertical:5
  },
  signupContainerBig:{
    paddingHorizontal:40,
    marginVertical:20
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  inputsContainer:{
    marginBottom:30
  },
  inputsContainerSmall:{
    marginBottom:20
  },
  inputsContainerTall:{
    marginBottom:40
  },
  inputsContainerBig:{
    marginBottom:50
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  buttonsContainer:{
    marginHorizontal:40
  },
  buttonContainer:{
    paddingVertical:5
  },
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  labelSignup:{
    fontSize:16,
    fontFamily:'poppins', 
    color:'white'
  },
  labelSignupSmall:{
    fontSize:13,
    fontFamily:'poppins', 
    color: 'white'
  },
  labelSignupBig:{
    fontSize:20,
    fontFamily:'poppins', 
    color: 'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  labelLogin:{
    fontSize:16,
    fontFamily:'poppins', 
    color: 'white'
  },
  labelLoginSmall:{
    fontSize:13,
    fontFamily:'poppins', 
    color: 'white'
  },
  labelLoginBig:{
    fontSize:20,
    fontFamily:'poppins', 
    color: 'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookContainer:{
     flexDirection:'row',
     alignItems:'center',
     justifyContent:'center',
     marginVertical:10
  },
  facebookContainerSmall:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginVertical:7
 },
 facebookContainerTall:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center',
  marginVertical:15
},
 facebookContainerBig:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center',
  marginVertical:20
},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookTextContainer:{
     marginHorizontal:8
  },
  facebookText:{
    fontFamily:'poppins',
    fontSize:14,
    color:'white'
  },
  facebookTextSmall:{
    fontFamily:'poppins',
    fontSize:13,
    color:'white'
  },
  facebookTextBig:{
    fontFamily:'poppins',
    fontSize:19,
    color:'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  facebookIcon:{
    width:24,
    height:24
  },
  facebookIconSmall:{
    width:20,
    height:20
  },
  facebookIconBig:{
    width:32,
    height:32
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  termsConditionsContainer:{
    borderBottomColor:'white',
    borderBottomWidth:1,
    alignItems:'center',
    alignSelf:'center',
    marginTop:15
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  termsConditionsText:{
    fontFamily:'poppins',
    fontSize:10,
    color:'white'
  },
  termsConditionsTextSmall:{
    fontFamily:'poppins',
    fontSize:9,
    color:'white'
  },
  termsConditionsTextBig:{
    fontFamily:'poppins',
    fontSize:13,
    color:'white'
  },
  loader: {
    marginTop: 10,
  },
  confirmErrorText:{
    color:Colors.primary,
    fontSize:13,
    alignSelf:'center'
  },
  smsText:{
    color:'green',
    fontSize:11,
    paddingTop:5,
    alignSelf:'center'
  },
   textInputSendCode:{
     borderBottomWidth:1,
     borderBottomColor:'white',
     marginBottom:10,
     color:'white'
    },
    backButton:{
      alignSelf:'center',
      marginTop:10
    }
});

export default SignupScreen;