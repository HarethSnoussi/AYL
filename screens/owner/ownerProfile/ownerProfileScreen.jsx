import React,{useState,useEffect,useCallback,useReducer} from 'react';
import { StyleSheet,View,ScrollView,ImageBackground,TouchableHighlight,Text,Image,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker,AsyncStorage,Alert,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-paper';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import Colors from '../../../constants/Colors';
import {Ionicons} from "@expo/vector-icons";
import {useDispatch,useSelector} from "react-redux";
import * as authActions from '../../../store/actions/authActions';
import * as ownerActions from '../../../store/actions/ownerActions';
import * as propertyActions from '../../../store/actions/propertyActions';
import Input from '../../../components/Input';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

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

const OwnerProfileScreen = props =>{
   
  //get the owner's data and his property data
  const ownerProperty= useSelector(state=>state.owners.ownerProperties);
  console.log(ownerProperty);
  //use Dispatch to dispatch our action
  const dispatch= useDispatch();
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */ 
    let textInputStyle = styles.textInput;
    let textInputContainerStyle = styles.textInputContainer;
    let cardStyle = styles.card;
    let circlesContainerStyle = styles.circlesContainer;
    let card2Style = styles.card2;
    let labelBtnStyle = styles.labelBtn;

    if(screen.width < 350){
        circlesContainerStyle = styles.circlesContainerSmall;
    }

    if(screen.height > 800){
        textInputStyle = styles.textInputBig;
        textInputContainerStyle = styles.textInputContainerBig;
        cardStyle = styles.cardBig;
        circlesContainerStyle = styles.circlesContainerBig;
        card2Style = styles.card2Big;
        labelBtnStyle =styles.labelBtnBig;
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //State for update loading 
    const [isLoading,setIsLoading]=useState(false);

    //State for property's wilaya textInput
    const [complexCity,setComplexCity] = useState(ownerProperty[0]?ownerProperty[0].wilaya:'');
    const citiesA = ["Alger","Blida","Oran"];    

    //picker only iOS for property's wilaya
    const onPress = () =>{
    const cities = ["Annuler", "Alger","Blida","Oran"];    
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: cities,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else {
         setComplexCity(cities[buttonIndex]);
        } 
      }
    );
    
}

    //state for image
    const [pickedImage,setPickedImage]= useState();

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
           allowsEditing:true,
           aspect:[60,60],
           quality:0.7
       });
       
       setPickedImage(image.uri);
    };


    //logout handler
    const logout = ()=>{
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
  const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      fullname:ownerProperty[0]?ownerProperty[0].fullname:'',
      email:ownerProperty[0]?ownerProperty[0].email:'',
      address:ownerProperty[0]?ownerProperty[0].address:'',
      propertyName:ownerProperty[0]?ownerProperty[0].name:'',
      propertyAddress:ownerProperty[0]?ownerProperty[0].addressP:'',
      propertyRegion:ownerProperty[0]?ownerProperty[0].region:''
    },
    inputValidities:{
      fullname:true,
      email:true,
      address:true,
      propertyName:true,
      propertyAddress:true,
      propertyRegion:true
    },
    formIsValid:true});
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
  disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  
  },[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update owner's data and his property Data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid){
    try{
        setIsLoading(true);
        dispatch(ownerActions.updateOwner(ownerProperty[0].owner_id,formState.inputValues.fullname,
                                          formState.inputValues.email,formState.inputValues.address));
        dispatch(propertyActions.updateProperty(formState.inputValues.propertyName,formState.inputValues.propertyName,
                                                formState.inputValues.propertyAddress,formState.inputValues.propertyRegion,
                                                complexCity,ownerProperty[0].owner_id));
        setIsLoading(false);                        
        Alert.alert('Félicitation!','Vos données ont été changées avec succès!',[{text:"OK"}]);
  
    }catch(err){
      console.log(err);
      Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
    }
    
    }else{
      Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
    }
  
  },[dispatch,ownerProperty[0].owner_id,formState]);

   useEffect(()=>{
     props.navigation.setParams({load:isLoading});
     props.navigation.setParams({save:saveHandler});
   },[saveHandler,isLoading]);

    return(
    <View style={styles.container}>
     <ImageBackground source = {require("../../../assets/images/android.jpg")}  style={styles.backgroundImage}>
     <KeyboardAvoidingView behavior='height'  style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardContainer}>
                    <View style={cardStyle}>
                        {!pickedImage ? (<Text style={styles.pickedImageText}>Capture de votre stade!</Text>)
                        : (<Image style={styles.image} source={{uri:pickedImage}} />)}
                    </View>
                    <View style={circlesContainerStyle}>
                        <TouchableHighlight style={styles.circleOne} onPress={takeImageHandler}>
                            <Ionicons title = "add" 
                            name = {Platform.OS === 'android' ? 'md-camera' : 'ios-camera'}
                            color='white' size={24} />
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.circleTwo} onPress={()=>setPickedImage(false)}>
                            <Ionicons title = "delete" 
                            name = {Platform.OS === 'android' ? 'md-remove' : 'ios-remove'}
                            color='white' size={24} />
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.circleThree} onPress={()=>props.navigation.navigate('OwnerGalery')}>
                            <Ionicons title = "addMore" 
                            name = {Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                            color='white' size={24} />
                        </TouchableHighlight>
                    </View>
                </View> 
                <View style={styles.card2Container}>
                    <View style={card2Style}>
                        <View style={styles.textInputsContainer}>  
                        <View style={textInputContainerStyle}>
                            <Input
                                id="fullname"
                                mode='flat'
                                label='Nom et Prénom *'
                                placeholder='Tapez votre nom et prénom'
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='sentences'
                                onInputChange={inputChangeHandler}
                                initialValue={ownerProperty[0]?ownerProperty[0].fullname:''}
                                initiallyValid={true}
                                required
                                errorText='Veuillez entrer votre nom et prénom svp!'
                                minLength={3}
                              />
                            </View>
                            <View style={textInputContainerStyle}>
                              <Input
                                id='email'
                                label='Email'
                                mode='flat'
                                placeholder='Exemple: owner@gmail.com'
                                keyboardType="default"
                                returnKeyType="next"
                                onInputChange={inputChangeHandler}
                                initialValue={ownerProperty[0]?ownerProperty[0].email:''}
                                initiallyValid={true}
                                email
                                errorText='Veuillez entrer un email valide svp!'
                                minLength={6}
                                />
                            </View>
                            <View style={textInputContainerStyle}>
                              <Input
                                  id="address"
                                  mode='flat'
                                  label='Adresse *'
                                  placeholder='Tapez votre propre adresse personnelle'
                                  keyboardType="default"
                                  returnKeyType="next"
                                  autoCapitalize='sentences'
                                  onInputChange={inputChangeHandler}
                                  initialValue={ownerProperty[0]?ownerProperty[0].address:''}
                                  initiallyValid={true}
                                  required
                                  errorText='Veuillez entrer votre adresse exacte svp!'
                                  minLength={12}
                              />
                            </View>
                            <View style={textInputContainerStyle}>
                                <Input
                                  id="propertyName"
                                  mode='flat'
                                  label='Nom du complexe *'
                                  placeholder='Tapez le nom du votre complexe'
                                  keyboardType="default"
                                  returnKeyType="next"
                                  autoCapitalize='sentences'
                                  onInputChange={inputChangeHandler}
                                  initialValue={ownerProperty[0]?ownerProperty[0].name:''}
                                  initiallyValid={true}
                                  required
                                  errorText='Veuillez entrer le nom de votre complexe svp!'
                                  minLength={3}
                                  maxLength={16}
                               />
                            </View>
                            <View style={textInputContainerStyle}>
                              <Input
                                id="propertyAddress"
                                mode='flat'
                                label='Adresse du complexe *'
                                placeholder="Tapez l'adresse du votre complexe"
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='sentences'
                                onInputChange={inputChangeHandler}
                                initialValue={ownerProperty[0]?ownerProperty[0].addressP:''}
                                initiallyValid={true}
                                required
                                errorText='Veuillez entrer une adresse exacte svp!'
                                minLength={12}
                              />
                            </View>
                            <View style={textInputContainerStyle}>
                              <Input
                                id="propertyRegion"
                                mode='flat'
                                label='Région du complexe *'
                                placeholder="Tapez la région du votre complexe"
                                keyboardType="default"
                                returnKeyType="next"
                                autoCapitalize='sentences'
                                onInputChange={inputChangeHandler}
                                initialValue={ownerProperty[0]?ownerProperty[0].region:''}
                                initiallyValid={true}
                                required
                                errorText='Veuillez entrer la région du complexe svp!'
                                minLength={3}
                              />
                            </View>
                            <View  style={styles.pickerContainer}>
                              {Platform.OS === 'android' ? 
                              <View>
                              <Text style={{fontFamily:'poppins',fontSize:11,color:'white',paddingLeft:10,marginBottom:-10}}>Wilaya *</Text>  
                              <Picker
                                selectedValue={ownerProperty[0].wilaya}
                                onValueChange={prevValue => setComplexCity(prevValue)}
                                style={textInputStyle}
                              >
                              {citiesA.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                              </Picker>
                              </View> :
                              <View>
                              <Text style={{fontFamily:'poppins',fontSize:11,color:'white',paddingLeft:10,marginBottom:-10}}>Wilaya *</Text>
                              <Text onPress={onPress}style={textInputStyle}>
                                  {ownerProperty[0].wilaya}
                              </Text>
                              </View>}
                            </View>
                        </View> 
                    </View>
                </View>  
        </ScrollView>
        <View style={{width:'100%'}}>
            <Button
                theme={{colors: {primary:Colors.primary}}} 
                mode="contained"
                labelStyle={labelBtnStyle}
                contentStyle={{width:'100%'}}
                style={{borderColor:Colors.primary}}
                icon='exit-to-app'
                dark={true}
                onPress={logout}
                >Se déconnecter 
            </Button>
        </View>
        </KeyboardAvoidingView>
     </ImageBackground>
    </View>

     );    
};


OwnerProfileScreen.navigationOptions = navData => {
    const saveFunction=navData.navigation.getParam('save');
    const load=navData.navigation.getParam('load');
    
    return {
        headerRight : ()=>  (load ? <ActivityIndicator color={Colors.secondary} />:
        <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
          <Item title = "save" 
            iconName = {Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            color={Platform.OS === 'android' ? 'white' : Colors.background}
            onPress={saveFunction}
          />
        </HeaderButtons>
      ),
        headerTitle:'Mon Profile',
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
   container:{
    flex:1,
    backgroundColor:'white'
   },
   backgroundImage : {
    flex : 1
  },
   cardContainer:{
    flexDirection:'row',
    width:'90%'
   },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   card:{
    height:200,
    width:'70%',
    marginTop:50,
    marginHorizontal:20,
    backgroundColor:Colors.background,
    borderRadius:10,
    shadowColor: 'black',
    shadowOpacity: 0.86,
    shadowOffset: {width:0, height:2},
    shadowRadius:8,
    elevation:5,
    justifyContent:'center',
   },
   cardBig:{
    height:300,
    width:'70%',
    marginTop:50,
    marginHorizontal:40,
    backgroundColor:Colors.background,
    borderRadius:10,
    shadowColor: 'black',
    shadowOpacity: 0.86,
    shadowOffset: {width:0, height:2},
    shadowRadius:8,
    elevation:5,
    justifyContent:'center',
   },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   pickedImageText:{
    fontFamily:'poppins',
    color:'white',
    alignSelf:'center'
   },
   image:{
    width:'100%',
    height:'100%'
   },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   circlesContainer:{
     width:'20%',
     marginBottom:20,
     marginTop:50,
     height:200,
     justifyContent:'center',
     marginHorizontal:20
   },
   circlesContainerSmall:{
    width:'20%',
    marginBottom:20,
    marginTop:50,
    height:200,
    justifyContent:'center',
    marginHorizontal:10
  },
   circlesContainerBig:{
    width:'20%',
    marginBottom:20,
    marginTop:50,
    height:300,
    justifyContent:'center',
    marginHorizontal:35
  },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   circleOne:{
     height:50,
     width:50,
     borderRadius:50/2,
     backgroundColor:'#171d23',
     marginVertical:7,
     justifyContent:'center',
     alignItems:'center'
   },
   circleTwo:{
    height:50,
    width:50,
    borderRadius:50/2,
    backgroundColor:'#456383',
    marginVertical:7,
    justifyContent:'center',
    alignItems:'center'
   },
   circleThree:{
    height:50,
    width:50,
    borderRadius:50/2,
    backgroundColor:'#171d23',
    marginVertical:7,
    justifyContent:'center',
    alignItems:'center'
   },
   card2Container:{
     alignItems:'center',
     marginBottom:50
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   card2:{
    height:600,
    width:'90%',
    backgroundColor:Colors.background,
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:20
   },
   card2Big:{
    height:750,
    width:'90%',
    backgroundColor:Colors.background,
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:20
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   textInputsContainer:{
      height:'100%'
   },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   textInputContainer:{
    paddingVertical:5
   },
   textInputContainerBig:{
    paddingVertical:15
   },
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   textInput:{
     backgroundColor:'transparent',
     fontFamily:'poppins',
     fontSize:16,
     color:'white'
   },
   textInputBig:{
    backgroundColor:'transparent',
    fontSize:20,
    color:'white',
    fontFamily:'poppins'
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
   pickerContainer:{
    borderBottomWidth:1,
    borderRadius:5,
    borderBottomColor:'white',
    paddingLeft:Platform.OS === 'android' ? 5 : 15,
    marginTop:12
   }
  
});

export default OwnerProfileScreen;