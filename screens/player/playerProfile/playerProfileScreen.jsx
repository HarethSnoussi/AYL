import React,{useState,useEffect,useCallback,useReducer} from 'react';
import { StyleSheet,View,ScrollView,ImageBackground,TouchableHighlight,Text,Image,Alert ,Dimensions,AsyncStorage,ActivityIndicator} from 'react-native';
import {Button} from 'react-native-paper';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import Colors from '../../../constants/Colors';
import {Ionicons} from "@expo/vector-icons";
import {useDispatch,useSelector} from "react-redux";
import * as authActions from '../../../store/actions/authActions';
import * as playerActions from '../../../store/actions/playerActions';
import Input from '../../../components/Input'

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

  //get the player's data
  const playerData= useSelector(state=>state.players.player);
  
  //use Dispatch to dispatch our action
  const dispatch= useDispatch();

////////////////////////////////////////////////////////////////////////////////////////////////////////
//Responsivity  
let cardStyle = styles.card;
let circleOneStyle = styles.circleOne ;
let circlesContainerStyle = styles.circlesContainer;
let circleTwoStyle = styles.circleTwo;
let textInputStyle = styles.textInput;
let card2Style = styles.card2;
let labelBtnStyle = styles.labelBtn;

  if (screen.height > 800) {
    cardStyle = styles.cardBig;
    circleOneStyle = styles.circleOneBig ;
    circlesContainerStyle = styles.circlesContainerBig;
    circleTwoStyle = styles.circleTwoBig;
    textInputStyle = styles.textInputBig;
    card2Style = styles.card2Big;
    labelBtnStyle =styles.labelBtnBig;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////

    //State for update loading 
    const [isLoading,setIsLoading]=useState(false);

    //state for image
    const [pickedImage,setPickedImage]= useState(playerData[0]?playerData[0].image : '');

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
       console.log(image);
       setPickedImage(image.uri);
    };

    useEffect(()=>{
      console.log(pickedImage);
    },[pickedImage])
    
    
    // logout handler
    const logout = ()=>{
      dispatch(authActions.logout());
      AsyncStorage.clear();
      props.navigation.navigate('Auth');
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////Input Management
  const[formState,disaptchFormState] = useReducer(formReducer,
    {inputValues:{
      name:playerData[0]?playerData[0].name:'',
      surname:playerData[0]?playerData[0].surname:'',
      email:playerData[0]?playerData[0].email:'',
      address:playerData[0]?playerData[0].address:''
    },
    inputValidities:{
      name:true,
      surname:true,
      email:true,
      address:true,
    },
    formIsValid:true});
  
  const inputChangeHandler = useCallback((inputIdentifier, inputValue,inputValidity) =>{
  disaptchFormState({type:Form_Input_Update,value:inputValue,isValid:inputValidity,inputID:inputIdentifier});
  
  },[disaptchFormState]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Update player's data Management after pressing in Check icon
  const saveHandler = useCallback(async()=>{
    if(formState.formIsValid){
    try{
        setIsLoading(true);
        dispatch(playerActions.updatePlayer(playerData[0].id,formState.inputValues.name,formState.inputValues.surname,
                                          formState.inputValues.email,formState.inputValues.address,pickedImage));
        setIsLoading(false);                        
        Alert.alert('Félicitation!','Vos données ont été changées avec succès!',[{text:"OK"}]);
  
    }catch(err){
      console.log(err);
      Alert.alert('Oups!','Une erreur est survenue!',[{text:"OK"}]);
    }
    
    }else{
      Alert.alert('Erreur!','Veuillez remplir le(s) champ(s) manquants svp!',[{text:"OK"}]);
    }
  
  },[dispatch,playerData[0].id,formState]);

   useEffect(()=>{
     props.navigation.setParams({load:isLoading});
     props.navigation.setParams({save:saveHandler});
     
   },[saveHandler,isLoading]);

    return(
    <View style={styles.container}>
     <ImageBackground source = {require("../../../assets/images/android.jpg")}  
     style={styles.backgroudnImage}
    
     >

     <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
            <View style={cardStyle}>
                {!pickedImage ? (<Text style={styles.pickedImageText}>Votre Image !</Text>)
                : (<Image style={styles.image} source={{uri:pickedImage}} />)}
            </View>
         
            <View style={circlesContainerStyle}>
                <TouchableHighlight style={circleOneStyle} onPress={takeImageHandler}>
                  <Ionicons title = "add" 
                   name = {Platform.OS === 'android' ? 'md-camera' : 'ios-camera'}
                   color='white' size={24} />
                </TouchableHighlight>
                <TouchableHighlight 
                style={circleTwoStyle}
                onPress={()=>setPickedImage(null)}
                >
                <Ionicons title = "delete" 
                   name = {Platform.OS === 'android' ? 'md-remove' : 'ios-remove'}
                   color='white' size={24} />
                </TouchableHighlight>
            </View>
           
        </View> 
       
        <View style={styles.card2Container}>
            <View style={card2Style}>
                <View style={styles.textInputsContainer}>  
                   <View style={styles.textInputContainer}>
                        <Input
                          id="name"
                          mode='flat'
                          label='Nom *'
                          placeholder='Tapez votre nom'
                          keyboardType="default"
                          returnKeyType="next"
                          autoCapitalize='sentences'
                          onInputChange={inputChangeHandler}
                          initialValue={playerData[0]?playerData[0].name:''}
                          initiallyValid={true}
                          required
                          errorText='Veuillez entrer votre nom svp!'
                          minLength={3}
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                       <Input
                          id="surname"
                          mode='flat'
                          label='Prénom *'
                          placeholder='Tapez votre prénom'
                          keyboardType="default"
                          returnKeyType="next"
                          autoCapitalize='sentences'
                          onInputChange={inputChangeHandler}
                          initialValue={playerData[0]?playerData[0].surname:''}
                          initiallyValid={true}
                          required
                          errorText='Veuillez entrer votre nom svp!'
                          minLength={3}
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Input
                          id='email'
                          label='Email'
                          mode='flat'
                          placeholder='Exemple: player@gmail.com'
                          keyboardType="default"
                          returnKeyType="next"
                          onInputChange={inputChangeHandler}
                          initialValue={playerData[0]?playerData[0].email:''}
                          initiallyValid={true}
                          email
                          errorText='Veuillez entrer un email valide svp!'
                          minLength={6}
                        />
                    </View>
                    <View style={styles.textInputContainer}>
                        <Input
                          id="address"
                          mode='flat'
                          label='Adresse'
                          placeholder='Tapez votre propre adresse'
                          keyboardType="default"
                          returnKeyType="next"
                          autoCapitalize='sentences'
                          onInputChange={inputChangeHandler}
                          initialValue={playerData[0]?playerData[0].address:''}
                          initiallyValid={true}
                          errorText='Veuillez entrer votre adresse exacte svp!'
                          minLength={12}
                        />
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
     </ImageBackground>
    </View>

     );    
};

PlayerProfileScreen.navigationOptions= navData => {
  const saveFunction=navData.navigation.getParam('save');
  const load=navData.navigation.getParam('load');
     return {
       title : "Mon Profile" , 
       headerTitleStyle:{
           fontFamily:'poppins',
           color:Platform.OS === 'android' ? 'white' : Colors.background
      },
      headerStyle:{
          backgroundColor:Platform.OS === 'android' ? Colors.background : 'white'
      },
      headerBackTitle:" ",
      headerTintColor:Platform.OS === 'android' ? 'white' :Colors.background,
      headerRight : ()=> (load ? <ActivityIndicator color={Colors.secondary} />:
      <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
        <Item title = "save" 
          iconName = {Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
          color={Platform.OS === 'android' ? 'white' : Colors.background}
          onPress={saveFunction}
        />
      </HeaderButtons>)
     
     };
 
  };

const styles= StyleSheet.create({
   container:{
    flex:1,
    backgroundColor:'white',
    justifyContent:'flex-start'
   },
   backgroudnImage : {
    flex : 1 
  },
   cardContainer:{
       marginTop:"5%",
       alignItems : "center",
       justifyContent : "center",

       
   },
////////////////////////////////////////////////////////////////
   card:{
    backgroundColor:'#263341',
    shadowColor: 'black',
    shadowOpacity: 0.86,
    shadowOffset: {width:0, height:2},
    shadowRadius:8,
    elevation:5,
    justifyContent:'center',
    borderRadius : 65,
    height : 130 ,
    width : 130,
    borderWidth : 3,
    borderColor : Colors.grey,
    marginBottom : 9,
    overflow : "hidden"
   },
   cardBig : {
    backgroundColor:'#263341',
    shadowColor: 'black',
    shadowOpacity: 0.86,
    shadowOffset: {width:0, height:2},
    shadowRadius:8,
    elevation:5,
    justifyContent:'center',
    borderRadius : 250/2,
    height :250 ,
    width : 250,
    borderWidth : 3,
    borderColor : Colors.grey,
    marginBottom : 9,
    overflow : "hidden"

   },
////////////////////////////////////////////////////////////////
   pickedImageText:{
    fontFamily:'poppins',
    color:'white',
    alignSelf:'center',
    fontSize : 13 
   },
   image:{
    width:'100%',
    height:'100%'
   },
   //////////////////////////////////////////////////////
   circlesContainer:{
     justifyContent:'center',
     flexDirection : "row",
     width : 90,
     justifyContent : "space-between",
     marginBottom : 10
    
   },
   circlesContainerBig:{
    justifyContent:'center',
    flexDirection : "row",
    width : 200,
    justifyContent : "space-around",
   marginBottom : 10
  },

/////////////////////////////////////////////////////////
   circleOne:{
     height:40,
     width:40,
     borderRadius:50/2,
     backgroundColor:'#171d23',
     justifyContent:'center',
     alignItems:'center'
   },
   circleOneBig:{
    height:80,
    width:80,
    borderRadius :80/2,
    backgroundColor:'#171d23',
    justifyContent:'center',
    alignItems:'center'
  },

/////////////////////////////////////////////////////////

   circleTwo:{
    height:40,
    width:40,
    borderRadius:50/2,
    backgroundColor:'#456383',
    justifyContent:'center',
    alignItems:'center'
   },

   circleTwoBig:{
    height:80,
    width:80,
    borderRadius:80/2,
    backgroundColor:'#456383',
    justifyContent:'center',
    alignItems:'center'
   },
  /////////////////////////////////////////////////////////
   card2Container:{
     alignItems:'center',
     marginBottom:50
   },
 ////////////////////////////////////////////////////////////
   card2:{
    height:350,
    width:'90%',
    backgroundColor:'rgba(38, 51, 65,0.9)',
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:20
   },
   card2Big:{
    height:400,
    width:'90%',
    backgroundColor:'rgba(38, 51, 65,0.9)',
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:20
   },
 ////////////////////////////////////////////////////////////

   textInputsContainer:{
      height:'100%'
   },
   textInputContainer:{
    paddingVertical:5,
    
   },
/////////////////////////////////////////////////////////
textInputBig : {
  backgroundColor:'transparent',
  fontSize : 25,
 height : 65

}, 
textInput : {
  backgroundColor:'transparent'

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

export default PlayerProfileScreen;