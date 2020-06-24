import React,{useState,useCallback,useReducer} from 'react';
import { StyleSheet,View,KeyboardAvoidingView,Text,Dimensions,ImageBackground,TouchableOpacity, ActivityIndicator,Alert,AsyncStorage} from 'react-native';
import {Button} from 'react-native-paper';
import Colors from '../../../constants/Colors';
import {useDispatch,useSelector} from "react-redux";
import * as ownerActions from '../../../store/actions/ownerActions';
import * as authActions from '../../../store/actions/authActions';
import Input from '../../../components/Input';
import * as Crypto from 'expo-crypto';

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

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const OwnerSettingsScreen = props =>{
   
  //get the owner's data and his property data
  const ownerProperty= useSelector(state=>state.owners.ownerProperties);
  const ownerUID= props.navigation.getParam('ownerUID');//get owner uid firebase
  
  //use Dispatch to dispatch our action
  const dispatch= useDispatch();
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */ 
  let labelBtnStyle = styles.labelBtn;

  if(screen.width < 350){
      
  }

  if(screen.height > 800){
      labelBtnStyle =styles.labelBtnBig;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //State for update loading 
    const [isLoading,setIsLoading]= useState(false);
    const [isLoadingPassword,setIsLoadingPassword]=useState(false);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////Input Management
  const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      phone:ownerProperty[0]?ownerProperty[0].phone:'',
      password:''
    },
    inputValidities:{
     phone:true,
     password:false
    },
    formIsValid:false});
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
  disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  
  },[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update owner's phone after pressing in edit text
  const editPhone=async()=>{
    if(formState.inputValidities.phone){
        try{
            if(formState.inputValues.phone === ownerProperty[0].phone){
              Alert.alert('Erreur!','Votre nouveau numéro de téléphone doit être différent d\'ancien numéro de téléphone.',[{text:"Réessayer"}]);
              return;
            }
            setIsLoading(true);
            dispatch(ownerActions.updateOwnerPhone(formState.inputValues.phone,formState.inputValues.phone,
                                                   ownerProperty[0].owner_id));
            dispatch(authActions.updateUserPhoneFRB(formState.inputValues.phone,ownerUID));                                       
            setIsLoading(false);
            dispatch(authActions.logout());
            AsyncStorage.clear();
            props.navigation.navigate('Auth');                        
            Alert.alert('Félicitation!','Votre numéro de téléphone a été changé avec succès. Veuillez-vous connecter à nouveau svp!',[{text:"OK"}]);
      
        }catch(err){
          console.log(err);
          Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
        }
        
        }else{
          Alert.alert('Erreur!','Veuillez bien remplir ce champ svp!',[{text:"OK"}]);
        }

  };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update owner's password after pressing in edit text
  const editPassword=async()=>{
    if(formState.inputValidities.password){
        try{
            
            const hashedPassword = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA512,
              formState.inputValues.password
            );
            if(hashedPassword === ownerProperty[0].password){
              Alert.alert('Erreur!','Votre nouveau mot de passe doit être différent d\'ancien mot de passe.',[{text:"Réessayer"}]);
              return;
            }
            setIsLoadingPassword(true);
            dispatch(ownerActions.updateOwnerPassword(ownerProperty[0].owner_id,hashedPassword));                                   
            setIsLoadingPassword(false);
            dispatch(authActions.logout());
            AsyncStorage.clear();
            props.navigation.navigate('Auth');                        
            Alert.alert('Félicitation!','Votre mot de passe a été changé avec succès. Veuillez-vous connecter à nouveau svp.',[{text:"OK"}]);
      
        }catch(err){
          console.log(err);
          Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
        }
        
        }else{
          Alert.alert('Erreur!','Veuillez bien remplir ce champ svp!',[{text:"OK"}]);
        }

  }; 

  const deleteAccount= async()=>{
    try{

       dispatch(ownerActions.deleteOwner(ownerProperty[0].owner_id));
       dispatch(authActions.deleteUser(ownerUID)); 
       dispatch(authActions.logout());
       AsyncStorage.clear();
       props.navigation.navigate('Auth');
    }catch(err){
     console.log(err);
     Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
    }
 };

 const alertDelete = ()=>{
    Alert.alert(
     'Attention!',
     'Voulez-vous vraiment supprimer votre compte?',
     [{text:'Oui', style:'destructive', onPress:deleteAccount},
      {text:'Non', style:'cancel'}]);
      return;
 };

    return(
    <KeyboardAvoidingView behavior='height' style={styles.safeArea}>
      <View style={styles.container}>
          <ImageBackground source = {require("../../../assets/images/android.jpg")}  style={styles.backgroundImage}>

              <View style={styles.card}>
                <View style={styles.firstRow}>
                    <Input
                      id='phone'
                      label='Téléphone'
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      onInputChange={inputChangeHandler}
                      initialValue={ownerProperty[0]?ownerProperty[0].phone:''}
                      initiallyValid={true}
                      phone
                      required
                      errorText='Veuillez entrer un numéro valide svp!'
                      />
                      <TouchableOpacity style={styles.editTextContainer} onPress={editPhone}>
                          {!isLoading ?<Text style={styles.editText}>Modifier</Text>:
                          <ActivityIndicator color='#456383' />}
                      </TouchableOpacity>
                </View>
                <View style={styles.firstRow}>
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
                      />
                      <TouchableOpacity style={styles.editTextContainer} onPress={editPassword}>
                        {!isLoadingPassword ?<Text style={styles.editText}>Modifier</Text>:
                          <ActivityIndicator color='#456383' />}
                      </TouchableOpacity>  
                </View>
              </View>
              <View style={styles.card2}>
                  <Button
                      theme={{colors: {primary:Colors.primary}}} 
                      mode="contained"
                      labelStyle={labelBtnStyle}
                      contentStyle={{width:'100%'}}
                      style={{borderColor:Colors.primary}}
                      icon='delete'
                      dark={true}
                      onPress={alertDelete}
                      >Supprimer mon compte
                  </Button>
              </View>
            
          </ImageBackground>
      </View>
    </KeyboardAvoidingView>
     );    
};


OwnerSettingsScreen.navigationOptions = () => {
  
    return {
       
        headerTitle:'Paramètres',
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
  safeArea:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    flex:1
  },
   container:{
    flex:1,
    width:'100%'
   },
   backgroundImage : {
    flex : 1,
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    backgroundColor:Colors.background,
    width:'90%',
    height:'65%',
    borderRadius:10,
    justifyContent:'space-between',
    alignItems:'center'
},
firstRow:{
    width:'90%',
    height:'50%',
    justifyContent:'space-around'
},
editTextContainer:{
    borderBottomColor:'#456383',
    borderBottomWidth:1,
    alignSelf:'center'
},
editText:{
    fontFamily:'poppins',
    color:'white',
    fontSize:20,
    color:'#456383'
},
card2:{
  width:'80%',
  height:'15%',
  justifyContent:'flex-end'
},
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
labelBtn:{
    fontSize:15,
    fontFamily:'poppins', 
    color: 'white'
   },
   labelBtnBig:{
    fontSize:20,
    fontFamily:'poppins', 
    color: 'white'
   },
});

export default OwnerSettingsScreen;