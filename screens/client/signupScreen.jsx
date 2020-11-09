import React,{useState,useCallback,useRef,useReducer} from 'react';
import { StyleSheet,View,ScrollView,KeyboardAvoidingView,Text,Image,TouchableWithoutFeedback,Keyboard,StatusBar,TextInput,TouchableOpacity,Picker,ActionSheetIOS,Alert,ActivityIndicator,AsyncStorage,Platform,Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Colors from '../../constants/Colors';
import {MaterialIcons,MaterialCommunityIcons,Ionicons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import Firebaseconfig from '../../helpers/Firebaseconfig';
import * as clientActions from '../../store/actions/clientActions';
import {useDispatch} from 'react-redux';
import * as Crypto from 'expo-crypto'; 
import CustomInput from '../../components/Input';


const screen = Dimensions.get("window");
console.log(screen);
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

const SignupScreen = props =>{
  
    //States for recaptcha and auth handling
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState('');
    const [verifyInProgress, setVerifyInProgress] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmError, setConfirmError] = useState(false);
    const [confirmInProgress, setConfirmInProgress] = useState(false);
    const dispatch = useDispatch();
    const prefix='+213';

   //States for complex information textInputs
   const [wilaya,setWilaya] = useState(undefined);
   const wilayas = ['Wilaya','Alger','Blida'];
   const [sex,setSex] = useState(undefined);
   const sexTypes= ['Sexe','Homme','Femme'];
   const [isEye,setIsEye]=useState(false);

   const eye=()=>{//eye icon for password
    setIsEye(prevValue=>!prevValue);
  };
   
   //picker only iOS function 
   const onPress = () =>{
     const wilayasIOS = ['Alger','Blida'];    
     ActionSheetIOS.showActionSheetWithOptions(
       {
         options: wilayasIOS,
         cancelButtonIndex: -1
       },
       buttonIndex => {
         if (buttonIndex === -1) {
           // cancel action
         } else {
          setWilaya(wilayasIOS[buttonIndex]);
         } 
       }
     );  
 }


 //picker only iOS function 
 const onPressSex = () =>{
  const sexIOS = ['Homme','Femme'];    
  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: sexIOS,
      cancelButtonIndex: -1
    },
    buttonIndex => {
      if (buttonIndex === -1) {
        // cancel action
      } else {
       setSex(sexIOS[buttonIndex]);
      } 
    }
  );  
}

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///Input management

const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    name:'',
    surname:'',
    phone: '',
    password:'',
    region:''
  },
   inputValidities:{
     name:false,
     surname:false,
     phone:false,
     password:false,
     region:false
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

const signupHandler = async () => {

const phoneProvider = new firebase.auth.PhoneAuthProvider();

if(formState.formIsValid && wilaya!==wilayas[0] &&  sex!==sexTypes[0] && wilaya!==undefined && sex!==undefined){
  try {

    setVerifyInProgress(true);
    const result = await fetch(`http://173.212.234.137:3000/phone/${prefix+formState.inputValues.phone}`);
    const resData= await result.json();

    setVerifyInProgress(false);

    //Check if User Exists
    if(resData.userRecord.phoneNumber === prefix+formState.inputValues.phone){
      Alert.alert('Erreur!','Ce Numéro de Téléphone existe déjà!',[{text:"OK"}]);
    }else{
      //if User is new (doesnt Exist), Recaptcha starts
      setVerifyInProgress(true);
      setVerificationId('');
      const verificationId = await phoneProvider.verifyPhoneNumber(
        prefix+formState.inputValues.phone,
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

    dispatch(clientActions.createClient(formState.inputValues.phone, prefix+formState.inputValues.phone,
      hashedPassword,sex,formState.inputValues.name,formState.inputValues.surname,wilaya,formState.inputValues.region));
      
    props.navigation.navigate('Client',{clientID:formState.inputValues.phone,clientUID:user.uid}); 
    Alert.alert(`${formState.inputValues.name} ${formState.inputValues.surname}`,'Bienvenue à Tahfifa :-)',[{text:"Merci"}]);
    saveDataToStorage(tokenResult.token,user.uid,expirationDate,formState.inputValues.phone);                                  


} catch (err) {
      setConfirmError(err);
      Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
      console.log(err);
      setConfirmInProgress(false);
}

};

   return(
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}> 
       <View stlye={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={10} behavior={Platform.OS === "ios" ? "padding" : null}>
          <StatusBar hidden />
          <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={Firebaseconfig}
                title='Prouvez que vous êtes humain!'
                cancelLabel='Fermer'
              />
            <View style={styles.firstContainer}>
               <Text style={styles.title}>Créez Votre Compte</Text>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={styles.secondContainer}>
             
                 <CustomInput 
                     id='name'
                     rightIcon={<MaterialIcons title="name" name ='person' color={Colors.lightGrey} size={screen.width/15.7} />}
                     placeholder='Nom'
                     keyboardType="default"
                     returnKeyType="next"
                     minLength={3}
                     autoCapitalize='sentences'
                     onInputChange={inputChangeHandler}
                     initialValue=''
                     initiallyValid={true}
                     required
                     placeholderTextColor={Colors.lightGrey}
                     backgroundColor={Colors.blue}
                     textColor={Colors.lightGrey}
                     editable={!verificationId}
                     widthView='100%'
                     />
                 
                 <CustomInput 
                    id='surname'
                    rightIcon={<MaterialIcons title="surname" name ='person' color={Colors.lightGrey} size={screen.width/15.7} />}
                    placeholder='Prénom'
                    keyboardType="default"
                    returnKeyType="next"
                    minLength={3}
                    autoCapitalize='sentences'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    required
                    placeholderTextColor={Colors.lightGrey}
                    backgroundColor={Colors.blue}
                    textColor={Colors.lightGrey}
                    editable={!verificationId}
                    widthView='100%'
                     />
                 
              
                 <CustomInput 
                     id='phone'
                     rightIcon={<MaterialIcons title = "phone" name ='phone' color={Colors.lightGrey} size={screen.width/15.7} />}
                     leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.lightGrey,paddingRight:screen.width/72,marginRight:screen.width/72}}><Image source={{uri:'http://173.212.234.137/assets/tahfifa/algeriaFlag.png'}} style={{width:screen.width/15,height:screen.width/12.7,marginRight:screen.width/72,marginLeft:-(screen.width/24)}}/><Text style={styles.phoneNumber}>+213</Text></View>}
                     placeholder='555555555'
                     keyboardType="phone-pad"
                     returnKeyType="next"
                     onInputChange={inputChangeHandler}
                     initialValue=''
                     initiallyValid={true}
                     phone
                     required
                     placeholderTextColor={Colors.lightGrey}
                     inputStyle={{fontSize:screen.width/24}}
                     backgroundColor={Colors.blue}
                     textColor={Colors.lightGrey}
                     widthView='100%'
                     />

                   <CustomInput
                    id='password'
                    rightIcon={<MaterialCommunityIcons title="lock" onPress={eye} name ={!isEye?'eye':'eye-off'} color={Colors.lightGrey} size={screen.width/15.7} />}
                    placeholder='Mot de Passe'
                    keyboardType="default"
                    returnKeyType="next"
                    secureTextEntry={!isEye?true:false}
                    minLength={6}
                    autoCapitalize='none'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    required
                    placeholderTextColor={Colors.lightGrey}
                    inputStyle={{fontSize:screen.width/24}}
                    backgroundColor={Colors.blue}
                    textColor={Colors.lightGrey}
                    widthView='100%'
                  />
                 
              
               <View style={{ width:'100%',borderWidth:1,borderRadius:screen.width/14.4,backgroundColor:Colors.blue,borderColor:sex!==sexTypes[0]?Colors.blue:Colors.primary,marginVertical:screen.width/120,height:screen.width/8,justifyContent:'center'}}>
                 {Platform.OS === 'android' ? 
                     <Picker
                     selectedValue={sex}
                     onValueChange={itemValue => setSex(itemValue)}
                     style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#d3d3d3',marginHorizontal:screen.width/25.7}}
                     >
                     {sexTypes.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                     </Picker> :
                     <TouchableOpacity onPress={onPressSex} style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/18.95,paddingRight:screen.width/14.4}}>
                     <Text  style={{fontFamily:'poppins',color:Colors.lightGrey,fontSize:screen.width/24,fontWeight:'500'}}>
                       {sex?sex:sexTypes[0]}
                     </Text>
                     <Ionicons name="ios-arrow-down" size={screen.width/15} color={Colors.lightGrey} onPress={onPressSex} />
                     </TouchableOpacity>}
                 </View>
                 <View style={{ width:'100%',borderWidth:1,borderRadius:screen.width/14.4,backgroundColor:Colors.blue,borderColor:wilaya!==wilayas[0]?Colors.blue:Colors.primary,marginVertical:screen.width/120,height:screen.width/8,justifyContent:'center'}}>
                 {Platform.OS === 'android' ? 
                             <Picker
                             selectedValue={wilaya}
                             onValueChange={itemValue => setWilaya(itemValue)}
                             style={{fontFamily:'poppins',fontSize:screen.width/30,color:'#d3d3d3',marginHorizontal:screen.width/25.7}}
                             >
                             {wilayas.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                             </Picker> :
                              <TouchableOpacity onPress={onPress}  style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:screen.width/18.95,paddingRight:screen.width/14.4}}>
                             <Text style={{fontFamily:'poppins',color:Colors.lightGrey,fontSize:screen.width/24,fontWeight:'500'}}>
                               {wilaya?wilaya:wilayas[0]}
                             </Text>
                             <Ionicons name="ios-arrow-down" size={screen.width/15} color={Colors.lightGrey} onPress={onPress} />
                             </TouchableOpacity>}
               </View>
               <CustomInput 
                    id='region'
                    rightIcon={<MaterialIcons title="region" name ='home' color={Colors.lightGrey} size={23} />}
                    placeholder='Région'
                    keyboardType="default"
                    returnKeyType="next"
                    minLength={3}
                    autoCapitalize='sentences'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    initiallyValid={true}
                    required
                    placeholderTextColor={Colors.lightGrey}
                    backgroundColor={Colors.blue}
                    textColor={Colors.lightGrey}
                    editable={!verificationId}
                    widthView='100%'
                     />
            </View>
            <View style={styles.thirdContainer}>
            {!verificationId ? (<View><Button
                   theme={{colors: {primary:'#fd6c57'}}} 
                   title="S'inscrire"
                   titleStyle={styles.labelButton}
                   buttonStyle={styles.buttonStyle}
                   onPress={signupHandler}
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                       colors: ['#fd6d57', '#fd9054'],
                       start: {x: 0, y: 0} ,
                       end:{x: 1, y: 0}
                       
                   }}
                 />
                  {verifyInProgress && <ActivityIndicator color={Colors.primary} style={styles.loader} />}
            <View style={styles.loginContainer}>
               <Text style={styles.doYouHaveAnAccount}>Avez-vous déjà un compte? </Text>
               <TouchableOpacity onPress={()=>props.navigation.navigate('Login')}>
                 <Text style={styles.loginText}>Se connecter</Text>
               </TouchableOpacity>
             </View>
                 </View>):
                 (<View>
                  <View style={{width:'100%',borderWidth:1, borderRadius:screen.width/14.4,backgroundColor:'#d3d3d3',borderColor:confirmError?Colors.primary:'#d3d3d3',marginVertical:screen.width/120,height:screen.width/8,alignItems:'center',justifyContent:'center'}}>
                    <TextInput
                            placeholder='Entrez les 6 chiffres'
                            keyboardType='number-pad'
                            autoCapitalize='none'
                            returnKeyType="next"
                            onChangeText={verificationCode=>setVerificationCode(verificationCode)}
                            placeholderTextColor='rgba(50,52,70,0.4)'
                            style={{color:'#323446'}}
                          />
                </View>
                <Button
                  theme={{colors: {primary:'#fd6c57'}}} 
                  title="Confirmer"
                  titleStyle={styles.labelButton}
                  buttonStyle={styles.confirmedButtonStyle}
                  onPress={sendCode}
                  ViewComponent={LinearGradient} 
                  linearGradientProps={{
                      colors: ['#fd6d57', '#fd9054'],
                      start: {x: 0, y: 0} ,
                      end:{x: 1, y: 0}
                      
                  }}
                />
                {confirmError && (<Text style={styles.confirmErrorText}>Erreur: code erroné!</Text>)}
                  {confirmInProgress ? <ActivityIndicator color={Colors.primary} style={styles.loader} />:<Text style={styles.smsText}>Un code de 6 chiffres a été envoyé sur votre SMS</Text>}
                </View>)}
             
            </View>
            </ScrollView>
         </KeyboardAvoidingView>
       </View>
       </TouchableWithoutFeedback>

    );    
};


SignupScreen.navigationOptions= ()=>{
  return {
    headerTransparent : true ,
    headerStyle:{
        backgroundColor: 'white'
    },
    headerTitle: () => (
      <Image 
      resizeMode="cover"
      style={{
        width:150,
        height:40,
        resizeMode:'contain',
        alignSelf: 'center'}}
      
      />
    ),
     headerBackTitle : " ",
     headerTintColor: '#fd6c57'
  };
  
}

const styles= StyleSheet.create({
  container:{
    flex: 1,
    justifyContent:'center',
    width:'100%',
    backgroundColor:'#fff'
   },
  firstContainer:{
    height:'15%',
    width:'90%',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  title:{
    fontFamily:'poppins-bold',
    color:'#fd6c57',
    fontSize:screen.width/15
  },
  secondContainer:{
   
    width:'90%',
    alignSelf:'center',
    paddingTop:screen.width/14.4,
  },
  labelButton:{
    color:'#FFF',
    fontFamily:'poppins',
    fontSize:screen.width/22.5,
    textTransform:null,
   },
   thirdContainer:{
    
     width:'90%',
     alignSelf:'center',
     justifyContent:'center',
     marginTop:screen.width/36
    },
   buttonStyle:{
    borderColor:'#fd6c57',
    width:'100%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    alignSelf:'center',
    marginTop:screen.width/36
   },
   confirmedButtonStyle:{
    borderColor:'#fd6c57',
    width:'100%',
    borderRadius:screen.width/18,
    height:screen.width/8,
    alignSelf:'center',
    marginTop:screen.width/120
   },
    loginContainer:{
     flexDirection:'row',
     paddingTop:screen.width/72,
     alignSelf:'center'
   },
   doYouHaveAnAccount:{
     fontSize:screen.width/24,
     fontFamily:'poppins',
     color:'#323446'
   },
   loginText:{
     fontSize:screen.width/24,
     fontFamily:'poppins-bold',
     color:'#fd6c57'
   },
   phoneNumber:{
    fontSize:screen.width/24,
    color:Colors.lightGrey,
  },
  loader: {
    marginTop: screen.width/72,
  },
  confirmErrorText:{
    color:Colors.primary,
    fontSize:screen.width/27.7,
    alignSelf:'center'
  },
  smsText:{
    color:'green',
    fontSize:screen.width/32.7,
    paddingTop:screen.width/72,
    alignSelf:'center'
  }
  
});

export default SignupScreen;