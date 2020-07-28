import React,{useState,useEffect,useCallback,useReducer} from 'react';
import {StyleSheet,View,AsyncStorage,ScrollView,ImageBackground,TouchableOpacity,Text,Image,Alert,KeyboardAvoidingView,Dimensions,ActionSheetIOS,Picker} from 'react-native';
import CustomInput from '../../../components/Input';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
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
  //get the barber's data
  const client= useSelector(state=>state.clients.client);
  const [isInfo,setIsInfo]= useState(true);
  const [isLocalisation,setIsLocalisation]= useState(false);

  const info = ()=>{
    setIsInfo(true);
    setIsLocalisation(false);
  };
  const localisation = ()=>{
    setIsInfo(false);
    setIsLocalisation(true);
  };

  //States for complex information textInputs
 const [wilaya,setWilaya] = useState('Wilaya');
 const wilayas = ['Alger','Blida'];

 const dispatch = useDispatch();
 
 
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
        setHour(wilayasIOS[buttonIndex]);
       } 
     }
   );  
}
    
    
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
      name:'',
      surname:'',
      email:'',
      address:'',
      region:''
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

  const deleteAccount= async()=>{
    try{

       dispatch(clientActions.deleteClient(client[0].id));
       dispatch(authActions.deleteUser(clientUID)); 
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
      <View style={styles.container}>
      <View style={styles.firstCard}>
        <ImageBackground source={require('../../../assets/images/man1-1.jpg')} style={styles.backgroundFirstCard} resizeMode='cover'/>
     </View>
     <View style={styles.secondCard}>
          <View style={styles.secondCardContent}>
              <View style={styles.imageContainer}>
                  <Image source={require('../../../assets/images/man2.jpg')} style={styles.image} />
              </View>
              <View style={styles.detailsContainer}>
                <View style={{width:'30%'}}>
                  <TouchableOpacity style={styles.iconFormCircle1}>
                    <MaterialIcons title = "camera" name ='camera-enhance' color='#323446' size={23} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconFormCircle2}>
                    <MaterialIcons title = "delete" name ='delete-forever' color='#FE457C' size={27} />
                  </TouchableOpacity>
                </View>  
                <View style={{width:'70%'}}>
                  <Text style={styles.bnameText}>Merouane.S</Text>
                  <Text style={styles.age}>26 ans</Text>
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
        <KeyboardAvoidingView keyboardVerticalOffset={10}>
         
            <CustomInput
                id='name'
                rightIcon={<MaterialIcons title = "firstName" name ='person' color='#323446' size={23} />}
                placeholder='Nom'
                keyboardType="default"
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue=''
                initiallyValid={true}
                required
                placeholderTextColor='rgba(50,52,70,0.4)'
                inputStyle={{fontSize:15}}
                minLength={3}
                autoCapitalize='sentences'
                backgroundColor='#fff'
                textColor={Colors.blue}
                shadowColorView='black'
                shadowOpacityView={0.96}
                shadowOffsetView={{width: 0, height:2}}
                shadowRadiusView={10}
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
              initialValue=''
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              inputStyle={{fontSize:15}}
              minLength={3}
              autoCapitalize='sentences'
              backgroundColor='#fff'
              textColor={Colors.blue}
              shadowColorView='black'
              shadowOpacityView={0.96}
              shadowOffsetView={{width: 0, height:2}}
              shadowRadiusView={10}
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
                initialValue=''
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
                shadowOpacityView={0.96}
                shadowOffsetView={{width: 0, height:2}}
                shadowRadiusView={10}
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
              initialValue=''
              initiallyValid={true}
              required
              placeholderTextColor='rgba(50,52,70,0.4)'
              inputStyle={{fontSize:15}}
              minLength={12}
              autoCapitalize='sentences'
              shadowColorView='black'
              shadowOpacityView={0.96}
              shadowOffsetView={{width: 0, height:2}}
              shadowRadiusView={10}
              elevationView={3}
              widthView='90%'
              backgroundColor='#fff'
              textColor={Colors.blue}
            />
          <View style={styles.pickerContainer}>
            {Platform.OS === 'android' ? 
                      <Picker
                      selectedValue={wilaya}
                      onValueChange={itemValue => setWilaya(itemValue)}
                      style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}
                      >
                      {wilayas.map(el=> <Picker.Item label={el} value={el} key={el} />)}
                      </Picker> :
                      <Text onPress={onPress} style={{fontFamily:'poppins',fontSize:12,color:'#323446'}}>
                        {wilaya}
                      </Text>} 
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
            initialValue=''
            initiallyValid={true}
            required
            placeholderTextColor='rgba(50,52,70,0.4)'
            inputStyle={{fontSize:15}}
            shadowColorView='black'
            shadowOpacityView={0.96}
            shadowOffsetView={{width: 0, height:2}}
            shadowRadiusView={10}
            elevationView={3}
            widthView='90%'
            backgroundColor='#fff'
            textColor={Colors.blue}
          />
          
          </KeyboardAvoidingView>
     </ScrollView>):
     (<ScrollView style={{width:'100%'}} showsVerticalScrollIndicator={false}>
         <View style={styles.noticeContainer}>
             <Text style={styles.noticeTitle}>Remarque</Text>
             <Text style={styles.noticeContent}>Avertir notre équipe avant de supprimer votre compte!</Text>
             <Text style={styles.tahfifaSignature}>Equipe Tahfifa.</Text>
         </View>
         <View style={styles.buttonContainer}>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={logout}>
                    <View style={{paddingBottom:5}}>
                      <MaterialCommunityIcons title = "logout" name ='logout' color='#FD6C57' size={23} />
                    </View>
                    <View>
                      <Text style={styles.optionTitle}>Se déconnecter</Text>
                    </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={()=>props.navigation.navigate('PlayerSettings',{clientUID:clientUID})}>
                     <View style={{paddingBottom:5}}>
                       <Ionicons title = "options" name ='ios-options' color='#56A7FF' size={23} />
                     </View>
                     <View>
                       <Text style={styles.optionTitle}>Paramètres</Text>
                     </View>
                </TouchableOpacity>
              </View>
              <View style={styles.cartContainer}>
                <TouchableOpacity style={styles.cart} onPress={alertDelete}>
                       <View style={{paddingBottom:5}}>
                          <MaterialCommunityIcons title = "delete" name ='delete-forever' color='#FE457C' size={23} />
                        </View>
                        <View>
                          <Text style={styles.optionTitle}>Mon compte</Text>
                        </View>
                </TouchableOpacity>
              </View>
         </View>
       </ScrollView>)}
  </View>

     );    
};

PlayerProfileScreen.navigationOptions= navData => { 
  
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
  ),
  headerTintColor: '#fff',
  headerRight : () =>(
    <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
      <Item title = "save" 
        iconName ='md-checkmark'
        color='#fff'
        size={23} 
        style={{paddingRight:10}}   
      />
    </HeaderButtons>)
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
      shadowOpacity: 0.96,
      shadowOffset: {width: 0, height:2},
      shadowRadius: 10,
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
  pickerContainer:{
    width:'90%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:40,
    justifyContent:'center',
    paddingHorizontal:12,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    marginVertical:5,
    alignSelf:'center'
   },
   pickerContainerRegion:{
    width:'90%',
    borderWidth:1,
    borderRadius:20,
    backgroundColor:'#fff',
    borderColor:'#fff',
    height:40,
    justifyContent:'center',
    paddingHorizontal:12,
    shadowColor: 'black',
    shadowOpacity: 0.96,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 10,
    elevation: 3,
    overflow:'hidden',
    marginTop:5,
    marginBottom:20,
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
      shadowColor: 'black',
      shadowOpacity: 0.96,
      shadowOffset: {width: 0, height:2},
      shadowRadius: 10,
      elevation: 2,
      overflow:'hidden',
      borderRadius:10
    },
    cartContainer:{
      width:'33%',
      height:100,
      alignItems:'center',
      justifyContent:'center',
      
    }

});

export default PlayerProfileScreen;