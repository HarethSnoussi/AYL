import React,{useState,useEffect,useCallback,useReducer} from 'react';
import {StyleSheet,View,AsyncStorage,Linking,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker,ActivityIndicator,TouchableWithoutFeedback,Keyboard,Platform} from 'react-native';
import CustomInput from '../../../components/Input';
import Colors from '../../../constants/Colors';
import {Ionicons,MaterialIcons,MaterialCommunityIcons} from "@expo/vector-icons";
import {useDispatch,useSelector} from "react-redux";
import * as authActions from '../../../store/actions/authActions';
import * as clientActions from '../../../store/actions/clientActions';


import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const screen = Dimensions.get("window");


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

const PlayerProfileScreen = props =>{

  
  const clientUID= props.navigation.dangerouslyGetParent().getParam('clientUID');
  const clientID= props.navigation.dangerouslyGetParent().getParam('clientID');
  //get the client's data
  const client= useSelector(state=>state.clients.client);
  const [isInfo,setIsInfo]= useState(true);
  const [isLocalisation,setIsLocalisation]= useState(false);

  const URL = "https://tahfifaapp.com";
  const URLAbout = "https://tahfifaapp.com/qui-sommes-nous/";
  const url= ()=>{
    Linking.openURL(URL).catch((err) => {
      if(err){
        Alert.alert('Oups!','Votre débit internet est trop faible',[{text:'OK'}]);
    } 
    });
   };
   const url2= ()=>{
    Linking.openURL(URLAbout).catch((err) => {
      if(err){
        Alert.alert('Oups!','Votre débit internet est trop faible',[{text:'OK'}]);
    } 
    });
   };

  const info = ()=>{
    setIsInfo(true);
    setIsLocalisation(false);
  };
  const localisation = ()=>{
    setIsInfo(false);
    setIsLocalisation(true);
  };

  //States for complex information textInputs
 const [wilaya,setWilaya] = useState(client[0]?client[0].wilaya:undefined);
 const wilayas = ['Wilaya','Alger','Blida'];
 const [isLoading,setIsLoading]=useState(false);
 const dispatch = useDispatch();
 
 
 //picker only iOS function 
 const onPress = () =>{
   const wilayasIOS = ['Wilaya','Alger','Blida'];    
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///ImagePicker

//state for image
const [pickedImage,setPickedImage]= useState(client[0]?client[0].image : undefined);


const verifyPermissions= async ()=>{
  const result= await Permissions.askAsync(Permissions.CAMERA,Permissions.CAMERA_ROLL);
  if(result.status !== 'granted'){
      Alert.alert('Permissions insuffisantes!',
      'Vous devez accorder les autorisations de la caméra pour utiliser cette application.',
      [{text:"D'accord"}]);
      return false;
  }
  return true;
};

const takeImageHandler = async ()=>{
 const hasPermissions = await verifyPermissions();
 if(!hasPermissions){
     return;
 }
 const image = await ImagePicker.launchCameraAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.All,
     allowsEditing:true,
     aspect:[60,60],
     quality:0.7
 });
  
  setPickedImage(image.uri);
  
};



const takeLibraryHandler = async ()=>{
  const hasPermissions = await verifyPermissions();
  if(!hasPermissions){
      return;
  }
 
  const library = await ImagePicker.launchImageLibraryAsync({
   mediaTypes: ImagePicker.MediaTypeOptions.All,
   allowsEditing:true,
   aspect:[60,60],
   quality:0.7
 });
  
  
  if(library){
   setPickedImage(library.uri);
  }
  
  
 };

    
    
    // logout handler
    const logout = ()=>{
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
    };
    const alertLogout = ()=>{
      Alert.alert(
       'Attention!',
       'Voulez-vous vraiment vous déconnecter?',
       [{text:'Oui', style:'destructive', onPress:logout},
        {text:'Non', style:'cancel'}]);
        return;
   };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
  const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      name:client[0]?client[0].name:'',
      surname:client[0]?client[0].surname:'',
      email:client[0]?client[0].email:'',
      address:client[0]?client[0].address:'',
      region:client[0]?client[0].region:''
    },
    inputValidities:{
      name:true,
      surname:true,
      email:true,
      address:true,
      region:true
    },
    formIsValid:true});
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
  disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  
  },[disaptchFormState]);

  

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update client's data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid && wilaya!=='Wilaya'){
      
    try{
        setIsLoading(true);
         await dispatch(clientActions.updateClient(clientID,formState.inputValues.name,formState.inputValues.surname,
                                          formState.inputValues.email,formState.inputValues.address,
                                          pickedImage,wilaya,formState.inputValues.region));
        setIsLoading(false);                        
        Alert.alert('Félicitation!','Vos données ont été changées avec succès!',[{text:"OK"}]);
  
    }catch(err){
      console.log(err);
      Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
    }
    
    }else{
      Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
    }
  
  },[dispatch,clientID,formState,pickedImage,wilaya]);

   

    return(
      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={styles.container}>
      <View style={styles.firstCard}>
        <ImageBackground source={client[0].sex==='Femme'?require( '../../../assets/images/woman5.jpg'):require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'>
          <View style={{width:'100%',height:'20%',alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity style={styles.iconFormCircle2} onPress={saveHandler}>
                {!isLoading?<Ionicons title = "check" name ='md-checkmark' color='#fff' size={32} onPress={saveHandler}  />:
                 <ActivityIndicator color={Colors.primary}/>}
            </TouchableOpacity>
          </View>
        </ImageBackground>
     </View>
     <View style={styles.secondCard}>
          <View style={styles.secondCardContent}>
              <View style={styles.imageContainer}>
              {!pickedImage && client[0].sex==='Homme' ? <Image source={require('../../../assets/images/man2.jpg')} style={styles.image} />:
                !pickedImage && client[0].sex==='Femme' ? <Image source={require('../../../assets/images/angelina.png')} style={styles.image} />
                : (<Image style={styles.image} source={{uri:pickedImage}} />)}
              </View>
              <View style={styles.detailsContainer}>
                <View style={{width:'30%'}}>
                  <TouchableOpacity style={styles.iconFormCircle1} onPress={takeImageHandler}>
                    <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={23} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconFormCircleGalery} onPress={takeLibraryHandler}>
                    <MaterialIcons title = "library" name ='photo-library' color='#FE457C' size={23} />
                  </TouchableOpacity>
                </View>  
                <View style={{width:'70%'}}>
                  <Text style={styles.bnameText}>{client[0].surname!==null?client[0].surname: 'Votre prénom'}</Text>
                  <Text style={styles.age}>{client[0].wilaya!==null?client[0].wilaya: 'Votre wilaya'}</Text>
                </View>
              </View>
          </View>
        </View>
        <View style={styles.menuContainer}>
             <TouchableOpacity onPress={info} style={{padding:5,width:'50%',backgroundColor:isInfo?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:isInfo?'#fff':'#fd6c57',fontFamily:'poppins'}}>Informations</Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={localisation} style={{padding:5,width:'50%',backgroundColor:isLocalisation?'#fd6c57':'#fff',alignItems:'center',justifyContent:'center'}}>
                 <Text style={{color:isLocalisation?'#fff':'#fd6c57',fontFamily:'poppins'}}>Mon Compte</Text>
             </TouchableOpacity>
        </View>
     {isInfo?(<ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView keyboardVerticalOffset={10} behavior={Platform.OS === "ios" ? "padding" : null}>
         
            <CustomInput
                id='name'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                placeholder='Nom'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={client[0]?client[0].name:''}
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={3}
                autoCapitalize='sentences'
                backgroundColor='#fff'
                textColor={Colors.blue}
                shadowColorView='black'
                shadowOpacityView={0.5}
                shadowOffsetView={{width: 0, height:1}}
              
                elevationView={3}
                widthView='90%'
              />
           
            <CustomInput
              id='surname'
              rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
              placeholder='Prénom'
              keyboardType="default"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].surname:''}
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              inputStyle={{fontSize:15}}
              minLength={3}
              autoCapitalize='sentences'
              backgroundColor='#fff'
              textColor={Colors.blue}
              shadowColorView='black'
              shadowOpacityView={0.5}
              shadowOffsetView={{width: 0, height:1}}
              elevationView={3}
              widthView='90%'
            />
          
            <CustomInput
                id='email'
                rightIcon={<MaterialIcons title = "email" name ='email' color='#323446' size={23} />}
                placeholder='Email'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={client[0]?client[0].email:''}
                initiallyValid={true}
                email
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={6}
                backgroundColor='#fff'
                textColor={Colors.blue}
                autoCapitalize='sentences'
                shadowColorView='black'
                shadowOpacityView={0.5}
                shadowOffsetView={{width: 0, height:1}}
                elevationView={3}
                widthView='90%'
              />
            <CustomInput
              id='address'
              rightIcon={<MaterialIcons title = "address" name ='map' color='#323446' size={23} />}
              placeholder='Adresse'
              keyboardType="default"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              initialValue={client[0]?client[0].address:''}
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              inputStyle={{fontSize:15}}
              minLength={12}
              autoCapitalize='sentences'
              shadowColorView='black'
              shadowOpacityView={0.5}
              shadowOffsetView={{width: 0, height:1}}
              elevationView={3}
              widthView='90%'
              backgroundColor='#fff'
              textColor={Colors.blue}
            />
          <View style={{ width:'90%',borderWidth:1,paddingHorizontal:12,borderRadius:25,backgroundColor:'#fff',borderColor:wilaya!=='wilaya'?'#fff':Colors.primary,marginVertical:5,height:45,justifyContent:'center',shadowColor: 'black',shadowOpacity: 0.5,
                          shadowOffset: {width: 0, height:1},elevation: 3,overflow:Platform.OS==='ios'?'visible':'hidden',alignSelf:'center'}}>
            {Platform.OS === 'android' ? 
                      <Picker
                      selectedValue={wilaya}
                      onValueChange={itemValue => setWilaya(itemValue)}
                      style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                      >
                      {wilayas.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                      </Picker> :
                      <TouchableOpacity onPress={onPress} style={{ width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:8,paddingRight:12}}>
                      <Text  style={{fontFamily:'poppins',fontSize:15,color:'#323446',fontWeight:'500'}}>
                        {wilaya}
                      </Text>
                      <Ionicons name="ios-arrow-down" size={24} color="#323446" onPress={onPress} />
                      </TouchableOpacity>} 
          </View>
          <CustomInput
            id='region'
            rightIcon={<MaterialIcons title="region" name ='home' color='#323446' size={23} />}
            placeholder='Région'
            keyboardType="default"
            returnKeyType="next"
            minLength={3}
            autoCapitalize='sentences'
            onInputChange={inputChangeHandler}
            initialValue={client[0]?client[0].region:''}
            initiallyValid={true}
            required
            placeholderTextColor='rgba(50,52,70,0.4)'
            inputStyle={{fontSize:15}}
            shadowColorView='black'
            shadowOpacityView={0.5}
            shadowOffsetView={{width: 0, height:1}}
            elevationView={3}
            widthView='90%'
            backgroundColor='#fff'
            textColor={Colors.blue}
          />
          
          </KeyboardAvoidingView>
     </ScrollView>):
     (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
         <View style={styles.noticeContainer}>
             <Text style={styles.noticeTitle}>Saviez-vous?</Text>
             <Text style={styles.noticeContent}>Visitez-nous sur le lien suivant pour plus d'informations: <Text onPress={url} style={{color:Colors.primary}}>tahfifaapp.com</Text></Text>
             <Text style={styles.tahfifaSignature} onPress={url2}>Equipe TAHFIFA.</Text>
         </View>
         <View style={styles.buttonContainer}>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={alertLogout}>
                    <View style={{paddingBottom:5}}>
                      <MaterialCommunityIcons title = "logout" name ='logout' color='#FD6C57' size={23} />
                    </View>
                    <View>
                      <Text style={styles.optionTitle}>Se déconnecter</Text>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('PlayerSettings',{clientUID:clientUID,clientID:clientID})}>
                     <View style={{paddingBottom:5}}>
                       <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={23} />
                     </View>
                     <View>
                       <Text style={styles.optionTitle}>Paramètres</Text>
                     </View>
                </TouchableOpacity>
              </View>
         </View>
       </ScrollView>)}
  </View>
  </TouchableWithoutFeedback>

     );    
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
     shadowOpacity: 0.5,
     shadowOffset: {width: 0, height:1},
     elevation: 5,
     backgroundColor:'red'
    },
    backgroundFirstCard:{
      width:'100%',
      height:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      borderTopLeftRadius:30,
      borderTopRightRadius:30, 
      overflow:'visible'
    },
    secondCard:{
      height:80,
      width:'90%',
      backgroundColor:'white',
      borderRadius:10,
      marginTop:-50, 
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowOffset: {width: 0, height:1},
      elevation: 5,
    },
    secondCardContent:{
      justifyContent:'space-around',
      flexDirection:'row'
    },
    imageContainer:{
      width:80,
      height:110
    },
    image:{
      width:'100%',
      height:'100%',
      borderRadius:10,
      marginTop:-60
    },
    detailsContainer:{
      marginTop:5,
      width:'60%',
      flexDirection:'row',
      justifyContent:'space-between',
      marginLeft:-15
    },
    bnameText:{
      fontFamily:'poppins-bold',
      color:'#323446',
      fontSize:18
    },
    secondFirstCard:{
      width:'95%',
      height:'20%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'flex-end'
    },
    iconFormCircle1:{
      width:40,
      height:30,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center'
    },
    iconFormCircle2:{
      width:50,
      height:50,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'flex-end'
    },
    iconFormCircleGalery:{
      width:40,
      height:30,
      borderRadius:20,
      justifyContent:'center',
      alignItems:'center',
    },
    age:{
      fontFamily:'poppins',
      color:'grey',
      fontSize:11,
      marginTop:-5
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
    scrollView:{
      width:'100%',
      marginVertical:20
    },
    bnameAgeContainer:{
      flexDirection:'row',
      width:'90%',
      alignSelf:'center'
    },
   noticeContainer:{
     width:'90%',
     alignSelf:'center',
     marginBottom:15,
     marginTop:30
    },
    noticeTitle:{
      fontFamily:'poppins-bold',
      fontSize:13,
      color:'#323446'
    },
    optionTitle:{
      fontFamily:'poppins-bold',
      fontSize:11,
      color:'#323446'
    },
    noticeContent:{
      fontFamily:'poppins',
      fontSize:12,
      color:'#323446'
    },
    tahfifaSignature:{
      fontFamily:'poppins',
      fontSize:12,
      color:'#fd6c57',
      paddingTop:5
    },
    buttonContainer:{
      width:'90%',
      alignSelf:'center',
      marginVertical:5,
      flexDirection:'row'
    },
    cart:{
      width:'90%',
      height:'95%',
      alignItems:'center',
      justifyContent:'center',
      elevation: 2,
      overflow:'hidden',
      borderRadius:10
    },
    cartContainer:{
      width:'50%',
      height:100,
      alignItems:'center',
      justifyContent:'center',
      borderWidth:Platform.OS==='ios'? 1:null,
      borderRadius:Platform.OS==='ios'? 40:null,
      marginHorizontal:Platform.OS==='ios'? 3:null,
      borderColor:Platform.OS==='ios'? Colors.blue:undefined,
      borderStyle:Platform.OS==='ios'? 'dashed':undefined
      
    }

});

export default PlayerProfileScreen;