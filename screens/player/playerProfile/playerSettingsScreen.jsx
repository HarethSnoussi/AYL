import React,{useState,useReducer,useCallback} from 'react';
import {StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActivityIndicator} from 'react-native';
import {MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {Button} from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import ar from '../../../lang/ar';
import fr from '../../../lang/fr';
import Colors from '../../../constants/Colors';
import {useSelector,useDispatch} from 'react-redux';
import CustomInput from '../../../components/Input';
import * as clientActions from '../../../store/actions/clientActions';
import * as authActions from '../../../store/actions/authActions';
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


const PlayerSettingsScreen = props =>{

  //get the client's data
  const client= useSelector(state=>state.clients.client);
  console.log(client);
  //use Dispatch to dispatch our action
  const dispatch= useDispatch();
  const clientUID= props.navigation.getParam('clientUID');
  console.log(clientUID);
  const [isPhone,setIsPhone]= useState(true);
  const [isPassword,setIsPassword]= useState(false);
  const [isLang,setIsLang]= useState(false);
  const [isArabic,setIsArabic]= useState(false);
  

  const phone = ()=>{
    setIsPhone(true);
    setIsPassword(false);
    setIsLang(false);
  };
  const password = ()=>{
    setIsPhone(false);
    setIsPassword(true);
    setIsLang(false);
  };
  const lang= ()=>{
    setIsLang(true);
    setIsPhone(false);
    setIsPassword(false);
  };
  
  const arabic= ()=>{
    setIsArabic(prevValue=>!prevValue);
  };

  //State for update loading 
  const [isLoading,setIsLoading]= useState(false);
  const [isLoadingPassword,setIsLoadingPassword]=useState(false);
  const prefix='+213';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////Input Management
const[formState,disaptchFormState] = useReducer(formReducer,
  {inputValues:{
    phone:client[0]?client[0].phone:'',
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
//Update client's phone after pressing in edit text
const editPhone=async()=>{
  if(formState.inputValidities.phone){
      try{
          if(prefix+formState.inputValues.phone === client[0].phone){
            Alert.alert('Erreur!','Votre nouveau numéro de téléphone doit être différent d\'ancien numéro de téléphone.',[{text:"Réessayer"}]);
            return;
          }
          setIsLoading(true);
          dispatch(clientActions.updateClientPhone(formState.inputValues.phone,prefix+formState.inputValues.phone,
                                                 client[0].id));
          dispatch(authActions.updateUserPhoneFRB(prefix+formState.inputValues.phone,clientUID));                                       
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
//Update client's password after pressing in edit text
const editPassword=async()=>{
  if(formState.inputValidities.password){
      try{
          
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA512,
            formState.inputValues.password
          );
          if(hashedPassword === client[0].password){
            Alert.alert('Erreur!','Votre nouveau mot de passe doit être différent d\'ancien mot de passe.',[{text:"Réessayer"}]);
            return;
          }
          setIsLoadingPassword(true);
          dispatch(clientActions.updateClientPassword(client[0].id,hashedPassword));                                   
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
  

    return(
      <View style={styles.container}>
         <View style={styles.firstCard}>
          <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
         </View>
         <View style={styles.menuContainer}>
              <TouchableOpacity onPress={phone} style={{padding:5,width:'30%',backgroundColor:isPhone?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isPhone?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                  {!isArabic?fr.Phone:ar.Phone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={password} style={{borderRightWidth:1,borderRightColor:'#fd6c57',borderLeftWidth:1,borderLeftColor:'#fd6c57',padding:5,width:'40%',backgroundColor:isPassword?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isPassword?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {!isArabic?fr.Password:ar.Password}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={lang} style={{padding:5,width:'30%',backgroundColor:isLang?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:isLang?'#fff':'#fd6c57',fontFamily:'poppins'}}>
                    {!isArabic?fr.Languages:ar.Languages}
                  </Text>
              </TouchableOpacity>
        </View>
        {isPhone?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
              <CustomInput
              id='phone'
              rightIcon={<MaterialIcons title="phone" name ='phone' color='#323446' size={23} />}
              leftIcon={<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',borderRightWidth:1,borderRightColor:Colors.blue,paddingRight:5,marginRight:5}}><Image source={require('../../../assets/images/algeriaFlag.png')} style={{width:24,height:28,marginRight:5}}></Image><Text style={styles.phoneNumber}>+213</Text></View>}
              placeholder='555555555'
              keyboardType="phone-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].id:''}
              initiallyValid={true}
              phone
              required
              inputStyle={{fontSize:15}}
              placeholderTextColor='rgba(50,52,70,0.4)'
              backgroundColor='#fff'
              textColor={Colors.blue}
              widthView='80%'
              shadowColorView='black'
              shadowOpacityView={0.96}
              shadowOffsetView={{width: 0, height:2}}
              shadowRadiusView={10}
              elevationView={3}
              />
              <View style={styles.buttonContainer}>
              {!isLoading ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?fr.Register:ar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={editPhone}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isPassword?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
                <CustomInput
                id='password'
                rightIcon={<MaterialIcons title="lock" name ='remove-red-eye' color='#323446' size={23} />}
                placeholder={!isArabic?fr.NewPassword:ar.NewPassword}
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
                backgroundColor='#fff'
                textColor={Colors.blue}
                widthView='80%'
                shadowColorView='black'
                shadowOpacityView={0.96}
                shadowOffsetView={{width: 0, height:2}}
                shadowRadiusView={10}
                elevationView={3}
              />
              <View style={styles.buttonContainer}>
              {!isLoadingPassword ?<Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?fr.Register:ar.Register}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    onPress={editPassword}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                />:
                <ActivityIndicator color={Colors.primary} />}
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        {isLang?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView keyboardVerticalOffset={10}>
            <View style={styles.langContainer}>
              {!isArabic?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>Français</Text>
                <Image source={require('../../../assets/images/france.png')} style={{width:24,height:24}}/>
              </View>):undefined}
              {isArabic?(<View style={styles.langRow}>
                <Text style={{fontFamily:'poppins',fontSize:13,color:'#323446'}}>العربية</Text>
                <Image source={require('../../../assets/images/algeria.png')} style={{width:24,height:24}}/>
              </View>):undefined}
            </View>
            <View style={styles.buttonContainer}>
               <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={!isArabic?fr.Change:ar.Change}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient}
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                    onPress={arabic}
                />
           </View>
           </KeyboardAvoidingView>
        </ScrollView>):undefined}
        
      </View>

     );    
};

PlayerSettingsScreen.navigationOptions= navData => {
    
     return {
      title:'Paramètres',
      headerTransparent : true ,
      headerBackTitle : " ",
      headerTintColor: '#fff',
      headerTitleStyle:{
        fontFamily:'poppins-bold',
        marginTop:5
      },
      
     
     };
 
  };


const styles= StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    width:'100%',
    alignItems:'center'
   },
   firstCard:{
    width:'95%',
    height:'40%',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 5,
    backgroundColor:'red'
   },
   backgroundFirstCard:{
     width:'100%',
     height:'100%',
     alignItems:'center',
   },
  menuContainer:{
    marginTop:25,
    width:'90%',
    backgroundColor:'#f9f9f9',
    borderRadius:5,
    borderColor:'#fd6c57',
    borderWidth:1,
    flexDirection:'row',
    alignSelf:'center',
    overflow:'hidden'
  },
  langContainer:{
    width:'80%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    marginVertical:5,
    alignSelf:'center',
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    
  },
  langRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
    paddingVertical:10,
    paddingHorizontal:15,
    alignItems:'center'
  },
  scrollView:{
    width:'100%',
    marginTop:80
  },
  buttonContainer:{
    width:'90%',
    alignSelf:'center',
    marginVertical:20
  },
 labelButton:{
  color:'#FFF',
  fontFamily:'poppins',
  fontSize:16,
  textTransform:null,
 },
 buttonStyle:{
  borderColor:'#fd6c57',
  width:'50%',
  borderRadius:20,
  height:40,
  alignSelf:'center'
 }
});

export default PlayerSettingsScreen;