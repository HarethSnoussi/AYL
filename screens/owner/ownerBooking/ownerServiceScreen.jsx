import React,{useState,useEffect,useCallback} from 'react';
import { StyleSheet,View,ImageBackground,Platform,FlatList,ActivityIndicator,Text,Alert} from 'react-native';
import {HeaderButtons,Item} from "react-navigation-header-buttons";
import Colors from '../../../constants/Colors';
import {useDispatch,useSelector} from "react-redux";

import ServiceCard from '../../../components/ServiceCard';
import HeaderButton from "../../../components/HeaderButton";
import * as serviceActions from '../../../store/actions/serviceActions';

/*
INSERT INTO service(id,type_match,time_match,tarif,owner_id,stadiumNum) VALUES(2,'6x6','1h30',3700,'+213557115451',1)
INSERT INTO slot(id,day,debut,finish,service_id) VALUES(4,'Dim','10:00','23:00',2)
*/

const OwnerServiceScreen = props =>{

const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState();
const dispatch = useDispatch();
const ownerID= props.navigation.getParam('ownerID');
const services = useSelector(state => state.services.ownerServices); //Bring all OwnerServices from our serviceReducer

    const deleteService= id=>{
      Alert.alert(
        'Attention!',
        'Voulez-vous vraiment supprimer ce service?',
        [{text:'Oui', style:'destructive', onPress:async()=>{
          dispatch(serviceActions.deleteOwnerService(id));
          loadOwnerServices();  
        }},
         {text:'Non', style:'default'}]);  
    }

    const renderProductItem = itemData=>{
    return( 
        <ServiceCard 
        serviceNumber={itemData.item.id}
        typeMatch={itemData.item.type_match}
        durationMatch={itemData.item.time_match}
        price={itemData.item.tarif}
        onPressDelete={deleteService.bind(this,itemData.item.id)}
       />
    );
    };

    //Render ownerServices from our DB  function
    const loadOwnerServices = useCallback (async () => {
      setError(null);
      setIsLoading(true);
      try{
        await dispatch(serviceActions.setOwnerServices(ownerID));
      } catch(err){
        setError(err.message);
        console.log(err);
      }
      setIsLoading(false);
      },[dispatch,setIsLoading, setError]);

    //Render data (initially) from our DB useEffect
    useEffect(() => {
      loadOwnerServices();
   },[dispatch, loadOwnerServices]);

   //ReRender between navigations 
   useEffect(()=>{
    const willFocusSub= props.navigation.addListener('willFocus',loadOwnerServices);
    return ()=>{
      willFocusSub.remove();
    };
  },[loadOwnerServices]);

    if(isLoading){
        return <View style={styles.activityIndicatorContainer} >
                 <ImageBackground source={require('../../../assets/images/android.jpg')} style={styles.activityIndicatorBackContainer}>
                  <ActivityIndicator size='large' color={Colors.primary} />
                </ImageBackground>
               </View>
     }
 
     if(!isLoading && services.length === 0){
        return <View style={styles.activityIndicatorContainer}>
                <ImageBackground source={require('../../../assets/images/android.jpg')} style={styles.activityIndicatorBackContainer}>
                 <Text style={{fontFamily:'poppins',color:'white'}}>Aucun service trouvé. Peut-être vous commencez à en ajouter!</Text>
                </ImageBackground>
               </View>
     }

     if(error){
      return <View style={styles.activityIndicatorContainer}>
              <ImageBackground source={require('../../../assets/images/android.jpg')} style={styles.activityIndicatorBackContainer}>
                <Text style={{fontFamily:'poppins',color:'white'}}>Une erreur est survenue!</Text>
                <View style={styles.buttonWidth}>
                  <Button
                  theme={{colors: {primary:Colors.primary}}} 
                  mode="contained"
                  labelStyle={labelBtnStyle}
                  contentStyle={{width:'100%'}}
                  style={{borderColor:Colors.primary}}
                  dark={true}
                  >Réessayer
                  </Button>
                </View>
              </ImageBackground>
             </View>
    }
   
    return(
        <View style={styles.container}> 
            <ImageBackground source={require('../../../assets/images/android.jpg')} style={styles.stadiumImageBackground}>
               <FlatList data={services} keyExtractor={item=>item.id.toString()} renderItem={renderProductItem}  />
            </ImageBackground>
        </View>    
         
          
     );    
};

OwnerServiceScreen.navigationOptions = navData => {
    
    return  {
    
          headerRight : ()=>  (
                <HeaderButtons HeaderButtonComponent = {HeaderButton}> 
                  <Item title = "Edit" 
                    iconName = {Platform.OS === 'android' ? 'md-create' : 'ios-create'}  
                    onPress = {()=> navData.navigation.navigate("EditService")}
                    color={Platform.OS === 'android' ? 'white' : Colors.background}
                  />
                </HeaderButtons>),
                headerTitle:'Mes Services',
                headerTitleStyle:{
                    fontFamily:'poppins',
                    color:Platform.OS === 'android' ? 'white' : Colors.background
                  },
                  headerStyle:{
                      backgroundColor:Platform.OS === 'android' ? Colors.background : 'white'
                  },
                  headerBackTitle:" ",
                  headerTintColor:Platform.OS === 'android' ? 'white' : Colors.background
        };
  };
  

const styles= StyleSheet.create({
    container:{
      flex:1
    },
    stadiumImageBackground:{
        flex:1,
        resizeMode:'cover',
        justifyContent:'center',
        alignItems:'center'
    },
    activityIndicatorContainer:{
        flex:1
     },
     activityIndicatorBackContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
     },
     buttonWidth:{
      width:'45%',
      borderRadius:20,
      overflow:'hidden'
     },
     labelBtn:{
      fontSize:15,
      fontFamily:'poppins', 
      color: 'white',
      marginTop:10
     },
    labelBtnSmall:{
        fontSize:13,
        fontFamily:'poppins', 
        color: 'white',
        marginTop:10
    },
    labelBtnTall:{
        fontSize:16,
        fontFamily:'poppins', 
        color: 'white',
        marginTop:10
    },
    labelBtnBig:{
        fontSize:22,
        fontFamily:'poppins', 
        color: 'white',
        marginTop:10
    }
});

export default OwnerServiceScreen;