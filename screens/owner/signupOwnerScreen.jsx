import React,{useState,useReducer,useCallback,useRef} from 'react';
import { StyleSheet,View,ImageBackground,KeyboardAvoidingView,Text,Image,Dimensions,Picker,ActionSheetIOS,ActivityIndicator,TextInput,Alert,AsyncStorage} from 'react-native';
import {RadioButton} from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import {Button} from 'react-native-paper';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Colors from '../../constants/Colors';
import Firebaseconfig from '../../helpers/Firebaseconfig';
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import Input from '../../components/Input';
import TypeNumberPitchRow from '../../components/TypeNumberPitchRow';
import {useDispatch} from 'react-redux';
import * as ownerActions from '../../store/actions/ownerActions';
import * as propertyActions from '../../store/actions/propertyActions';
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

const SignupOwnerScreen = props =>{

  const dispatch = useDispatch();

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState('');
  const [verifyInProgress, setVerifyInProgress] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [confirmInProgress, setConfirmInProgress] = useState(false);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
  let inputsContainerStyle = styles.inputsContainer;
  let previousNextBtnStyle = styles.previousNextBtn;
  let finishBtnStyle = styles.finishBtn;
  let textInputStyle = styles.textInput;
  let pickerContainerStyle = styles.pickerContainer;
  let step3ContainerStyle = styles.step3Container;
  let textStyle = styles.text;
  let checkBoxLabelStyle = styles.checkBoxLabel;
  let rowContainerStyle = styles.rowContainer;
  let rowsStyle = styles.rowStyle;
  let labelSignupStyle= styles.labelSignup;

  if(screen.width < 350){
    pickerContainerStyle = styles.pickerContainer;
    previousNextBtnStyle = styles.previousNextBtnSmall;
    finishBtnStyle = styles.finishBtnSmall;
    inputsContainerStyle = styles.inputsContainerSmall;
    step3ContainerStyle = styles.step3ContainerSmall;
    rowContainerStyle = styles.rowContainerSmall;
    labelSignupStyle = styles.labelSignupSmall;
   }

   if(screen.height <= 800 && screen.height >=700){
    inputsContainerStyle = styles.inputsContainerBig;
    textInputStyle = styles.textInputTall;
    pickerContainerStyle = styles.pickerContainerTall;
    step3ContainerStyle = styles.step3ContainerBig;
    textStyle = styles.textTall;
    checkBoxLabelStyle = styles.checkBoxLabelTall;
    rowContainerStyle = styles.rowContainerTall;
    rowsStyle = styles.rowStyleTall;
   }

   if(screen.height > 800){
    inputsContainerStyle = styles.inputsContainerBig;
    previousNextBtnStyle = styles.previousNextBtnBig;
    finishBtnStyle = styles.finishBtnBig;
    textInputStyle = styles.textInputBig;
    pickerContainerStyle = styles.pickerContainerBig;
    step3ContainerStyle = styles.step3ContainerBig;
    textStyle = styles.textBig;
    checkBoxLabelStyle = styles.checkBoxLabelBig;
    rowContainerStyle = styles.rowContainerBig;
    rowsStyle = styles.rowStyleBig;
    labelSignupStyle = styles.labelSignupBig;
   }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //states for checkboxes and radiobutton
    const [isCheckedShower, setIsCheckedShower] = useState(false);
    const [isCheckedBall, setIsCheckedBall] = useState(true);
    const [isCheckedCloackroom, setIsCheckedcloackroom] = useState(false);
    const [isCheckedBib, setIsCheckedBib] = useState(false);
    const [isCheckedCover, setIsCheckedCover] = useState("Non Couvert");
    const [isCheckedRef, setIsCheckedRef] = useState("Sans");
    const [isChecked5x5, setIsChecked5x5] = useState(true);
    const [stadiumNum5x5, setStadiumNum5x5] = useState('0');
    const [isChecked6x6, setIsChecked6x6] = useState(false);
    const [stadiumNum6x6, setStadiumNum6x6] = useState('0');
    const [isChecked7x7, setIsChecked7x7] = useState(false);
    const [stadiumNum7x7, setStadiumNum7x7] = useState('0');
    const [isChecked8x8, setIsChecked8x8] = useState(false);
    const [stadiumNum8x8, setStadiumNum8x8] = useState('0');
    const [isChecked9x9, setIsChecked9x9] = useState(false);
    const [stadiumNum9x9, setStadiumNum9x9] = useState('0');
    const [isChecked10x10, setIsChecked10x10] = useState(false);
    const [stadiumNum10x10, setStadiumNum10x10] = useState('0');
    const [isChecked11x11, setIsChecked11x11] = useState(false);
    const [stadiumNum11x11, setStadiumNum11x11] = useState('0');

    let type5x5;
    let type6x6;
    let type7x7;
    let type8x8;
    let type9x9;
    let type10x10;
    let type11x11;


    
    //States for complex information textInputs
    const [complexCity,setComplexCity] = useState("Alger");
    const citiesA = ["Alger","Blida","Oran"];
    
    //stadium Number Array
    const stadiumNumber = ['0','1','2','3','4','5','6','7','8','9','10'];

    //picker only iOS function 
    const onPress = () =>{
      const cities = ["Alger","Blida","Oran"];    
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: cities,
          cancelButtonIndex: -1
        },
        buttonIndex => {
          if (buttonIndex === -1) {
            // cancel action
          } else {
           setComplexCity(cities[buttonIndex]);
          } 
        }
      );  
  }
  //picker only iOS function for staduim Number 
  /*const onPressStadiumNumberIOS = () =>{
    const stadiumNumber = ['0','1','2','3','4','5','6','7','8','9','10'];  
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: stadiumNumber,
        cancelButtonIndex: -1
      },
      buttonIndex => {
        if (buttonIndex === -1) {
          // cancel action
        } else {
        setComplexCity(stadiumNumber[buttonIndex]);
        } 
      }
    );  
  }*/

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
    const[formState,disaptchFormState] = useReducer(formReducer,
      {inputValues:{
        fullname:'',
        phone:'',
        password: '',
        address:'',
        propertyName:'',
        propertyAddress:'',
        propertyRegion:''
      },
      inputValidities:{
        fullname:false,
        phone:false,
        password:false,
        address:false,
        propertyName:false,
        propertyAddress:false,
        propertyRegion:false
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
        //When click in Confirm Button in the last step to check Errors
        const isNotChecked = !formState.inputValidities.fullname || !formState.inputValidities.phone || !formState.inputValidities.password || !formState.inputValidities.address;
        if(isNotChecked){
        Alert.alert('Erreur!','Veuillez remplir les champs manquants s\'il vous plait!',[{text:"OK"}]);
        }

        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        if(formState.formIsValid){
          try {
            setVerifyInProgress(true);
            const result = await fetch(`http://192.168.1.39:3000/phone/${formState.inputValues.phone}`);
            const resData= await result.json();
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

          }catch(err){
            Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
            setVerifyInProgress(false);
            console.log(err);
          }

        }else{
          Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
       }

      };

      const sendCode = async () => {

        if(isChecked5x5){ type5x5 = '5x5';}else{type5x5='';}
        if(isChecked6x6){ type6x6 = '6x6';}else{type6x6='';}
        if(isChecked7x7){ type7x7 = '7x7';}else{type7x7='';}
        if(isChecked8x8){ type8x8 = '8x8';}else{type8x8='';}
        if(isChecked9x9){ type9x9 = '9x9';}else{type9x9='';}
        if(isChecked10x10){ type10x10 = '10x10';}else{type10x10='';}
        if(isChecked11x11){ type11x11 = '11x11';}else{type11x11='';}

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
          
          
          dispatch(ownerActions.createOwner(formState.inputValues.phone,formState.inputValues.phone,
                                            hashedPassword,formState.inputValues.fullname,formState.inputValues.address));
          if(formState.inputValues.phone){
            dispatch(propertyActions.createProperty(formState.inputValues.propertyName,formState.inputValues.propertyName,
              formState.inputValues.propertyAddress,
              formState.inputValues.propertyRegion,complexCity,isCheckedBall,
              isCheckedShower,isCheckedBib,isCheckedCloackroom,isCheckedCover,
              isCheckedRef,formState.inputValues.phone));
          }
          
          if(formState.inputValues.propertyName){
          dispatch(propertyActions.createPropertyStadiums(stadiumNum5x5,stadiumNum6x6,stadiumNum7x7,
          stadiumNum8x8,stadiumNum9x9,stadiumNum10x10,stadiumNum11x11,type5x5,type6x6,type7x7,type8x8,
          type9x9,type10x10,type11x11,formState.inputValues.propertyName));
          } 

          props.navigation.navigate('Owner',{ownerID:formState.inputValues.phone,ownerUID:user.uid}); 
          Alert.alert(`${formState.inputValues.fullname}`,'Bienvenue à FootBooking :-)',[{text:"Merci"}]);
          saveDataToStorage(tokenResult.token,user.uid,expirationDate,"Owner",formState.inputValues.phone); 
        } catch (err) {
              setConfirmError(err);
              Alert.alert('Oups!','Une erreur est survenue.',[{text:"OK"}]);
              console.log(err);
              setConfirmInProgress(false);
        }
       
      };
       
      //When click in Next Button in the first step
      const nextStep1 = ()=>{
        const isNotValid = !formState.inputValidities.propertyName || !formState.inputValidities.propertyAddress || 
        !formState.inputValidities.propertyRegion;

        if(isNotValid){
        Alert.alert('Erreur!','Veuillez remplir les champs manquants s\'il vous plait!',[{text:"OK"}]);
        }
      }; 

      //When click in Next Button in the first step
      const nextStep2 = ()=>{
        const isNotChecked = !isCheckedShower && !isCheckedCloackroom && !isCheckedBib && !isCheckedBall;
        if(isNotChecked){
        Alert.alert('Erreur!','Veuillez remplir le champ matériels logistiques s\'il vous plait!',[{text:"OK"}]);
        }
      }; 

      //When click in Next Button in the first step
      const nextStep3 = ()=>{
        const isNotChecked = !isChecked5x5 && !isChecked6x6 && !isChecked7x7 && !isChecked7x7 && !isChecked8x8 && !isChecked9x9 && !isChecked11x11;
        const stadiumNumberNull = stadiumNum5x5 ==='0' && stadiumNum6x6 ==='0' && stadiumNum7x7 ==='0' && stadiumNum8x8 ==='0' &&  stadiumNum9x9 ==='0' && stadiumNum10x10==='0' && stadiumNum11x11 ==='0';

        if(isNotChecked && stadiumNumberNull){
        Alert.alert('Erreur!','Vous n\'avez séléctionné aucune option!',[{text:"OK"}]);
        }else if(stadiumNumberNull){
          Alert.alert('Erreur!','Veuillez remplir le nombre de stade(s) pour chaque(s) type(s) de match séléctionné s\'il vous plait!',[{text:"OK"}]);
        }else if(isNotChecked){
          Alert.alert('Erreur!','Veuillez choisir le(s) type(s) de match s\'il vous plait!',[{text:"OK"}]);
        }
      }; 

      //When click in Previous Button in the last step 
      const backStep4 = ()=>{
        setVerificationId('');
      };

    return(
      <View style={styles.container}>
       <ImageBackground source={require('../../assets/images/player.jpg')} style={styles.bigBackgroundImage}>
        <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={10} style={styles.overlayBackground}>
                
                <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={Firebaseconfig}
                />
                
                <ProgressSteps
                 activeStepIconBorderColor={Colors.primary}
                 completedProgressBarColor={Colors.primary}
                 completedStepIconColor={Colors.primary} 
                 activeStepNumColor='white'
                 completedStepNumColor='white' 
                 activeLabelColor={Colors.primary}
                 labelFontFamily='poppins'
                 >
                    <ProgressStep 
                        label="Propriété"
                        previousBtnTextStyle={previousNextBtnStyle} 
                        nextBtnTextStyle={previousNextBtnStyle}
                        nextBtnText='Suivant'
                        onNext={nextStep1}
                        errors={!formState.inputValidities.propertyName || !formState.inputValidities.propertyAddress || !formState.inputValidities.propertyRegion  ? true : false}
                    >
                     <View style={inputsContainerStyle}>
                        <Input
                            id="propertyName"
                            mode='flat'
                            label='Nom du complexe *'
                            placeholder='Tapez le nom du votre complexe'
                            keyboardType="default"
                            returnKeyType="next"
                            autoCapitalize='sentences'
                            onInputChange={inputChangeHandler}
                            initialValue=''
                            initiallyValid={true}
                            required
                            errorText='Veuillez entrer le nom de votre complexe svp!'
                            editable={!verificationId}
                            minLength={3}
                            maxLength={16}
                        />
                        <Input
                            id="propertyAddress"
                            mode='flat'
                            label='Adresse du complexe *'
                            placeholder="Tapez l'adresse du votre complexe"
                            keyboardType="default"
                            returnKeyType="next"
                            autoCapitalize='sentences'
                            onInputChange={inputChangeHandler}
                            initialValue=''
                            initiallyValid={true}
                            required
                            errorText='Veuillez entrer une adresse exacte svp!'
                            editable={!verificationId}
                            minLength={12}
                        />
                        <Input
                            id="propertyRegion"
                            mode='flat'
                            label='Région du complexe *'
                            placeholder="Tapez la région du votre complexe"
                            keyboardType="default"
                            returnKeyType="next"
                            autoCapitalize='sentences'
                            onInputChange={inputChangeHandler}
                            initialValue=''
                            initiallyValid={true}
                            required
                            errorText='Veuillez entrer la région du complexe svp!'
                            editable={!verificationId}
                            minLength={3}
                        />
                        <View style={pickerContainerStyle}>
                              {Platform.OS === 'android' ? 
                              <Picker
                              selectedValue={complexCity}
                              onValueChange={itemValue => setComplexCity(itemValue)}
                              style={textInputStyle}
                              >
                              {citiesA.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker> :
                              <Text onPress={onPress} style={textInputStyle}>
                                {complexCity}
                              </Text>}
                        </View>
                     </View>
                    </ProgressStep>
                    <ProgressStep 
                        label="Logistiques"
                        previousBtnTextStyle={previousNextBtnStyle} 
                        nextBtnTextStyle={previousNextBtnStyle}
                        nextBtnText='Suivant'
                        previousBtnText='Précédent'
                        //onPrevious={back}  
                        onNext={nextStep2}
                        errors={!isCheckedShower && !isCheckedCloackroom && !isCheckedBib && !isCheckedBall ? true : false}
                    >
                        <View style={step3ContainerStyle}>
                            <View style={rowContainerStyle}>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle}>Matériels logistiques *</Text>
                                </View>
                                <View style={rowsStyle}>
                                    <CheckBox
                                        title='Douches'
                                        containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                        checked={isCheckedShower ? true : false}
                                        checkedColor={Colors.primary}
                                        onPress={()=>setIsCheckedShower(isChecked => !isChecked)}
                                        fontFamily='poppins'
                                        textStyle={checkBoxLabelStyle}
                                    />
                                    <CheckBox
                                        title='Vestiaire'
                                        containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                        checked={isCheckedCloackroom ? true : false}
                                        checkedColor={Colors.primary}
                                        onPress={()=>setIsCheckedcloackroom(isChecked => !isChecked)}
                                        fontFamily='poppins'
                                        textStyle={checkBoxLabelStyle}
                                    />
                                </View>
                                <View style={rowsStyle}>
                                    <CheckBox
                                        title='Ballons'
                                        containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                        checked={isCheckedBall ? true : false}
                                        checkedColor={Colors.primary}
                                        onPress={()=>setIsCheckedBall(isChecked => !isChecked)}
                                        fontFamily='poppins'
                                        textStyle={checkBoxLabelStyle}
                                    />
                                    <CheckBox
                                        title='Dossards'
                                        containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                        checked={isCheckedBib ? true : false}
                                        checkedColor={Colors.primary}
                                        onPress={()=>setIsCheckedBib(isChecked => !isChecked)}
                                        fontFamily='poppins'
                                        textStyle={checkBoxLabelStyle}
                                    />
                                </View>
                            </View>
                            <View style={rowContainerStyle}>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle}>Plafond *</Text>
                                </View>
                                <View style={rowsStyle}>
                                <RadioButton.Group
                                  value = {isCheckedCover}
                                  onValueChange = {prevValue=>setIsCheckedCover(prevValue)}
                                >
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                      <Text style={checkBoxLabelStyle}>Couvert</Text>
                                      <RadioButton.Android uncheckedColor='grey' color={Colors.primary} value="Couvert"/>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                      <Text style={checkBoxLabelStyle}>Non Couvert</Text>
                                      <RadioButton.Android uncheckedColor='grey' color={Colors.primary} value="Non Couvert"/>
                                    </View>  
                              </RadioButton.Group>
                                </View>
                            </View>
                            <View style={rowContainerStyle}>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle}>Arbitrage *</Text>
                                </View>
                                <View style={rowsStyle}>
                                <RadioButton.Group
                                  value = {isCheckedRef}
                                  onValueChange = {prevValue=>setIsCheckedRef(prevValue)}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                      <Text style={checkBoxLabelStyle}>Sans</Text>
                                      <RadioButton.Android uncheckedColor='grey' color={Colors.primary} value="Sans"/>
                                    </View>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                      <Text style={checkBoxLabelStyle}>Avec</Text>
                                      <RadioButton.Android uncheckedColor='grey' color={Colors.primary} value="Avec"/>
                                    </View>  
                              </RadioButton.Group>
                                </View>
                            </View>
                        </View>
                    </ProgressStep>
                    <ProgressStep 
                        label="Stades"
                        previousBtnTextStyle={previousNextBtnStyle} 
                        nextBtnTextStyle={previousNextBtnStyle}
                        nextBtnText='Suivant'
                        previousBtnText='Précédent'
                        //onPrevious={back}  
                        onNext={nextStep3}
                        errors={(!isChecked5x5 && !isChecked6x6 && !isChecked7x7 && !isChecked7x7 && !isChecked8x8 && !isChecked9x9 && !isChecked11x11) ||  (stadiumNum5x5 ===stadiumNumber[0] && stadiumNum6x6 ===stadiumNumber[0] && stadiumNum7x7 ===stadiumNumber[0] && stadiumNum8x8 ===stadiumNumber[0] &&  stadiumNum9x9 ===stadiumNumber[0] && stadiumNum10x10===stadiumNumber[0] && stadiumNum11x11 ===stadiumNumber[0]) ?true:false}
                    >
                        <View style={step3ContainerStyle}>
                            <View style={rowContainerStyle}>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle}>Gestion des Stades *</Text>
                                </View>
                                <View style={styles.tableHeaderContainer}>
                                   <Text style={styles.titleHeader}>Types de Match</Text>
                                   <Text style={styles.titleHeader}>Nombres de Stade</Text>
                                </View>
                                <TypeNumberPitchRow
                                   title="5x5"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked5x5 ? true : false}
                                   onPress={()=>setIsChecked5x5(isChecked => !isChecked)}
                                   selectedValue={stadiumNum5x5}
                                   onValueChange={itemValue => setStadiumNum5x5(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="6x6"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked6x6 ? true : false}
                                   onPress={()=>setIsChecked6x6(isChecked => !isChecked)}
                                   selectedValue={stadiumNum6x6}
                                   onValueChange={itemValue => setStadiumNum6x6(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="7x7"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked7x7 ? true : false}
                                   onPress={()=>setIsChecked7x7(isChecked => !isChecked)}
                                   selectedValue={stadiumNum7x7}
                                   onValueChange={itemValue => setStadiumNum7x7(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="8x8"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked8x8 ? true : false}
                                   onPress={()=>setIsChecked8x8(isChecked => !isChecked)}
                                   selectedValue={stadiumNum8x8}
                                   onValueChange={itemValue => setStadiumNum8x8(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="9x9"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked9x9 ? true : false}
                                   onPress={()=>setIsChecked9x9(isChecked => !isChecked)}
                                   selectedValue={stadiumNum9x9}
                                   onValueChange={itemValue => setStadiumNum9x9(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="10x10"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked10x10 ? true : false}
                                   onPress={()=>setIsChecked10x10(isChecked => !isChecked)}
                                   selectedValue={stadiumNum10x10}
                                   onValueChange={itemValue => setStadiumNum10x10(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                                <TypeNumberPitchRow
                                   title="11x11"
                                   containerStyle={{backgroundColor:'transparent',borderWidth:0}}
                                   fontFamily='poppins'
                                   textStyle={checkBoxLabelStyle}
                                   checked={isChecked11x11 ? true : false}
                                   onPress={()=>setIsChecked11x11(isChecked => !isChecked)}
                                   selectedValue={stadiumNum11x11}
                                   onValueChange={itemValue => setStadiumNum11x11(itemValue)}
                                   array={stadiumNumber}
                                   //onPressStadiumNumberIOS={onPressStadiumNumberIOS}
                                />
                            </View>
                        </View>
                    </ProgressStep>
                    <ProgressStep 
                      label="Propriétaire" 
                      previousBtnTextStyle={previousNextBtnStyle} 
                      nextBtnTextStyle={finishBtnStyle}
                      finishBtnText={!verificationId ? "Confirmer" : ""}
                      previousBtnText="Précédent"
                      onPrevious={backStep4}
                      onSubmit={signupHandler}
                      errors={!formState.inputValidities.fullname || !formState.inputValidities.phone || !formState.inputValidities.password || !formState.inputValidities.address ? true : false}
                      >
                        <View style={inputsContainerStyle}>
                            <Input
                                id="fullname"
                                mode='flat'
                                label='Nom et Prénom *'
                                placeholder='Tapez votre nom et prénom'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='sentences'
                                onInputChange={inputChangeHandler}
                                initialValue=''
                                initiallyValid={true}
                                required
                                errorText='Veuillez entrer votre nom et prénom svp!'
                                editable={!verificationId}
                                minLength={3}
                            />
                            <Input
                                id="address"
                                mode='flat'
                                label='Adresse *'
                                placeholder='Tapez votre propre adresse personnelle'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='sentences'
                                onInputChange={inputChangeHandler}
                                initialValue=''
                                initiallyValid={true}
                                required
                                errorText='Veuillez entrer votre adresse exacte svp!'
                                editable={!verificationId}
                                minLength={12}
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
                            {verifyInProgress && <ActivityIndicator style={styles.loader} color={Colors.primary} />}
                            {verificationId ? (
                            <View style={{marginTop:20,alignItems:'center',justifyContent:'center'}}>
                              <TextInput
                              placeholder='Entrer les 6 chiffres'
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
                              onPress={sendCode}>
                                Confirmer
                            </Button>
                            {confirmError && (<Text style={styles.confirmErrorText}>Erreur: code erroné!</Text>)}
                            {confirmInProgress ? <ActivityIndicator style={styles.loader} />:<Text style={styles.smsText}>Un code de 6 chiffres a été envoyé sur votre SMS</Text>}
                          </View>): undefined}
                        </View>
                        
                    </ProgressStep>
                    
                </ProgressSteps>
            
        </KeyboardAvoidingView> 
       </ImageBackground>
      </View>

     );    
};

SignupOwnerScreen.navigationOptions= ()=>{
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
       headerBackTitle : " "
    };
  }


const styles= StyleSheet.create({
   container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
   },
   bigBackgroundImage:{
    flex:1,
    resizeMode:'cover',
    width:'100%',
  },
  overlayBackground:{
    backgroundColor:"rgba(0, 0, 0, 0.7)", 
    flex:1,
    justifyContent:'center',
    width:'100%',
    paddingHorizontal:10
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 previousNextBtn:{
   color:Colors.primary,
   fontFamily:'poppins'
 },
 previousNextBtnSmall:{
  color:Colors.primary,
  fontFamily:'poppins',
  fontSize:15
},
 previousNextBtnBig:{
    color:Colors.primary,
    fontFamily:'poppins',
    fontSize:24
 },
 finishBtn:{
    color:Colors.secondary,
    fontFamily:'poppins'
 },
 finishBtnSmall:{
  color:Colors.secondary,
  fontFamily:'poppins',
  fontSize:15
},
 finishBtnBig:{
    color:Colors.secondary,
    fontFamily:'poppins',
    fontSize:24
 },
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  inputsContainer:{
    padding:10,
    marginTop:30
  },
  inputsContainerSmall:{
    padding:10,
    marginTop:15
  },
  inputsContainerBig:{
    padding:30,
    marginTop:50
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  textInput:{
    backgroundColor:'transparent',
    fontFamily:'poppins',
    fontSize:16,
    color:'white'
  },
  textInputTall:{
    backgroundColor:'transparent',
    fontSize:18,
    paddingVertical:15,
    fontFamily:'poppins',
    color:'white'
  },
  textInputBig:{
    backgroundColor:'transparent',
    fontSize:20,
    paddingVertical:25,
    fontFamily:'poppins',
    color:'white'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  textContainer:{
    alignItems:'center',
    justifyContent:'center'
  },
  rowContainer:{
    marginVertical:5
  },
  rowContainerSmall:{
    marginVertical:3
  },
  rowContainerTall:{
    marginVertical:15
  },
  rowContainerBig:{
    marginVertical:25
  },

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   rowStyle:{
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-around'
  },
  rowStyleTall:{
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:20
  },
  rowStyleBig:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
    width:'100%',
    marginVertical:25
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  text:{
    color:'white',
    fontFamily:'poppins'
  },
  textTall:{
    color:'white',
    fontFamily:'poppins',
    fontSize:20
  },
  textBig:{
    color:'white',
    fontFamily:'poppins',
    fontSize:24
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  checkBoxLabel:{
    color:'grey',
    fontFamily:'poppins'
  },
  checkBoxLabelTall:{
    color:'grey',
    fontFamily:'poppins',
    fontSize:18
  },
  checkBoxLabelBig:{
    color:'grey',
    fontSize:20,
    fontFamily:'poppins'
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  step3Container:{
    marginTop:30
  },
  step3ContainerSmall:{
    marginTop:20
  },
  step3ContainerBig:{
    marginTop:50
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  pickerContainer:{
    borderBottomWidth:1,
    borderBottomColor:'white',
    padding:Platform.OS === 'android' ? 5 : 15,
    marginTop:12
  },
  pickerContainerTall:{
    borderBottomWidth:1,
    borderBottomColor:'white',
    paddingVertical:Platform.OS === 'android' ? 15 : 25,
    paddingHorizontal:Platform.OS === 'android' ? 10 : 20
  },
  pickerContainerBig:{
    borderBottomWidth:1,
    borderBottomColor:'white',
    paddingVertical:Platform.OS === 'android' ? 25 : 35,
    paddingHorizontal:Platform.OS === 'android' ? 10 : 20
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  tableHeaderContainer:{
    borderBottomColor:'white',
    borderBottomWidth:1,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    paddingVertical:5,
    marginTop:40,
    marginHorizontal:10
  },
  titleHeader:{
    color:'white',
    fontFamily:'poppins',
    fontSize:13
  },
  loader: {
    marginTop: 10,
  },
  confirmErrorText:{
    color:Colors.primary,
    fontSize:13,
    alignSelf:'center',
    marginTop:20
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
     color:'white',
     width:'50%',
     alignSelf:'center'
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
});

export default SignupOwnerScreen;