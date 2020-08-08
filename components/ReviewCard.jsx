import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,Dimensions,TextInput, KeyboardAvoidingView,ActivityIndicator} from 'react-native';
import { Button , Rating, Overlay, AirbnbRating,Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import {Ionicons} from "@expo/vector-icons";
import { EvilIcons } from '@expo/vector-icons';
import Colors from "../constants/Colors";
import { useDispatch } from 'react-redux';
import { addreview, updateReview } from '../store/actions/reviewsActions';



const screen = Dimensions.get("window");
const ReviewCard = props =>{
  let cardContainerStyle = styles.cardContainer;
  let titleStyle = styles.title;
  let adressStyle = styles.adress;

  if(screen.width > 500 ) {
    cardContainerStyle = styles.cardContainerBig;
    titleStyle = styles.titleBig;
    adressStyle = styles.adressBig;
  }
  const [visible, setVisible] = useState(false);
  const [mark , setMark] =useState(0);
  const [comment,setComment] = useState("");

const dispatch = useDispatch();

const toggleOverlay = async ()=>{

const barberReview = await props.allReviews.filter(review=>review.clientId === props.clientId && review.barberId === props.barberId) ;
if(barberReview.length > 0){
  setComment(barberReview[0].comment);
  setMark(barberReview[0].mark);
}

setVisible (previous => !previous);

}


const ratingMark  = (mark)=>{

setMark(mark);

} ;

const closeOverlay = () =>{

setVisible(false);
setComment("");
setMark(0);

}



const submitReview = async ()=>{
const barberReview = await props.allReviews.filter(review=>review.clientId === props.clientId && review.barberId === props.barberId) ;

if(barberReview.length ===0){
  await dispatch (addreview({clientId : props.clientId,barberId : props.barberId , comment :comment,mark : mark }))
  setVisible (previous => !previous);
  


}else {

  await dispatch (updateReview({clientId : props.clientId,barberId : props.barberId , comment :comment,mark : mark }))
  setVisible (previous => !previous);

}


};

    return(
       
        <View style = {styles.cardContainer}>
      


      <Overlay isVisible={visible} onBackdropPress={closeOverlay} overlayStyle = {styles.overlayContainer}>
     
      <View style = {{flex : 1}}>
   
     <View style = {styles.overlayText}>
            <Text style ={{fontFamily : "poppins-bold",fontSize :16,color : "#525252"}}> Ecrire un commentaire</Text>

     </View>
     <KeyboardAvoidingView behavior = "padding" style = {{height : "65%"}}   keyboardVerticalOffset={5}>
     <View style = {styles.ratingContainer} >
    <View>
     <Rating
      onFinishRating={mark =>ratingMark(mark)}
      style={{marginRight : "5%"}}
      fractions = {1}
      ratingColor = "#FED500"          
      type='custom'
      imageSize = {screen.width * 0.08}
      startingValue = {mark}
      
      />
      </View>
    <View style = {{paddingTop : 5}}>
     <Text style = {{fontFamily : "poppins-bold",fontSize:18,color : "#FED500"}}>{mark}/5</Text>
     </View>

     </View>


     <View style = {styles.commentContainer}>
      
     <TextInput
        placeholder='Votre Commentaire ...'
        autoCorrect = {false}
        multiline = {true}
        numberOfLines = {5}
        maxLength = {150}
        style ={{ textAlignVertical: 'top'}}
        onChangeText={text => setComment(text)}
        value = {comment}
        returnKeyType="send"
        textBreakStrategy = "balanced"
        />

     </View>
     </KeyboardAvoidingView>
     <Button 
                   containerStyle = {{ height : "15%",width : "80%",alignSelf:"center" ,justifyContent : "center" }} 
                   title = "Confirmer" 
                   titleStyle = {{fontFamily : "poppins-bold"}}
                   buttonStyle = {{borderRadius : 55}} 
                   ViewComponent={LinearGradient} 
                   linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                    }}
                 onPress ={submitReview}
            
                   />

     </View>
    
      </Overlay>

        <View style = {styles.cardImage}>
        <Image source = {require("../assets/pictures/barber7.png")} style = {styles.image}  />

        </View>

        <View style = {styles.cardText}>

        <View>
              <View style= {styles.name}>
                <Text style = {{fontFamily : "poppins-bold"}} >{props.name + " " + props.surname}</Text>
                <View style = {{flexDirection : "row"}}>
             
                <EvilIcons name="pencil" size={24} color="#9d9da1" onPress = {toggleOverlay} />
                <Text style = {{fontFamily : "poppins", color : "#9d9da1"}}>Avis</Text>
                </View>
              </View>
              <Text style = {{fontFamily : "poppins", color : "#9d9da1"}} >
              {props.region + "-" + props.wilaya}
              </Text>
       </View>

              <View style= {styles.extra}>
              <View  style= {styles.extraHours}>
              <View style = {{flexDirection : "row"}}>
            
              <Rating
                type='star'
                ratingCount={1}
                imageSize={15}
                startingValue = {1}
                style = {styles.rating}
                ratingColor = "#FE9654"          
                type='custom'
                readonly = {true}
               
                  />
                    <Text>3.2</Text>
                  </View>
              <Text style ={{color : "#fd6c57",fontFamily : "poppins-bold",letterSpacing : 1}}>Voir le profil </Text>
               
                </View>
               
                <Button  
                title ="Réserver" 
                buttonStyle = {{backgroundColor : "#fd6c57",borderRadius : 25,paddingHorizontal : "5%"}}
                titleStyle = {{color :"#fff",fontSize : 13}}
                onPress = {props.navigate}
                />
              
              </View>

          
          </View>

    </View>


     );    
};


const styles= StyleSheet.create({
    container : {
            flex: 1 ,
            justifyContent : "flex-end",
          backgroundColor : "#fff"

    },

    searchBar :{
      width : "80%" , 
      alignSelf : "center",
      borderRadius : 20 , 
      backgroundColor : "rgba(52, 52, 52, 0)" ,
      marginBottom : 15 ,
      borderTopWidth : 0 , 
      borderBottomWidth : 0 
      },
      firstImage : {
        width : screen.width,
        height : screen.height * 0.20 ,
        overflow : "hidden",
      } ,
    
///////////////////////////////////////////////////////
cardContainer : {
  width : "97%",
  backgroundColor : "#fff",
  height : screen.height * 0.18,
  flexDirection : "row",
  justifyContent : "space-around",
  borderBottomWidth : 0.3,
  overflow : "hidden",
  alignSelf : "flex-end",
    
},
cardImage : {
    width : "30%",
    height : "80%",
    alignSelf : "center",
    overflow : "hidden",
  
    
},
image : {
  height : "100%",
  width : "100%",
   borderRadius : 25,
   resizeMode : "cover"
  

},
cardText : {

    width : "60%",
    height : "100%",
    alignSelf : "center",
    justifyContent : "space-around",
    overflow : "hidden",
 

},
name : {
    flexDirection : "row",
    justifyContent : "space-between",
    

},
extra : {
  flexDirection : "row",
  justifyContent : "space-between",


},
extraHours : {

 

},
extraButton : {
overflow : "hidden",
borderRadius : 25,


},
rating :{
backgroundColor : "red",
alignSelf : "flex-start",
marginRight : 7

},

/***********************************************************************/
 //Overlay Style
 
overlayContainer : {
    height:"70%",
    width : "90%",
    borderRadius : 25,
   
    justifyContent : "space-around",
    overflow : "hidden"
},
overlayText : {
    height : "15%",
    width : "90%",
    alignItems : "center",
    alignSelf : "center",
    justifyContent : "center",
    borderBottomWidth : 0.3
},
ratingContainer : {
  height : "20%",

  justifyContent : "center",
  flexDirection : "row",
  alignItems : "center",
  

},
commentContainer:{
 backgroundColor : "#f9f9f9",
 borderRadius : 15,
 height : "60%",
 justifyContent : "flex-start",
 shadowColor: '#000',
 shadowOffset: { width: 0, height: 2 },
 shadowOpacity: 0.5,
 shadowRadius: 2,
 elevation: 2,
 padding : "5%",
 width : "95%",
 alignSelf : "center",
 marginTop : "3%"



}
   

});


export default ReviewCard;