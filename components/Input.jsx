import React, {useReducer,useEffect} from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import Colors from "../constants/Colors";

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

const INPUT_UPDATE = 'INPUT_UPDATE';
const INPUT_BLUR = 'INPUT_BLUR';
const inputReducer = (state,action)=>{
     switch(action.type){
         case INPUT_UPDATE:
             return{
                 ...state,
                 value:action.value,
                 isValid:action.isValid
             };

        case INPUT_BLUR:
            return{
                ...state,
                touched:true
            };

         default:
             return state;
     }
};

const Input = props =>{

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*Responsivity */
    let textInputStyle = styles.textInput;

    if(screen.height <= 800 && screen.height >=700){
        inputsContainerStyle = styles.inputsContainerTall;
        textInputStyle = styles.textInputTall;
       }
    
       if(screen.height > 800){
        inputsContainerStyle = styles.inputsContainerBig;   
        textInputStyle = styles.textInputBig;
       }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [inputState,dispatchInputState] = useReducer(inputReducer,
        {
            value:props.initialValue ? props.initialValue : '',
            isValid:props.initiallyValid,
            touched:false
        });

    //forward the value and the information whether it's valid or not to the parent
    const {onInputChange,id} = props;
    useEffect(()=>{
        if(inputState.touched){
        onInputChange(id,inputState.value,inputState.isValid);
        }
    },[inputState,onInputChange,id]);

        const inputChangeHandler= text=>{
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const phoneRegex = /(^(\+213)[5-7]{1}[0-9]{8}$)/;
            let isValid = true;
            if (props.required && text.trim().length === 0) {
            isValid = false;
            }
            if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
            }
            if(props.phone && !phoneRegex.test(text)){
            isValid = false;
            }
            if (props.min != null && +text < props.min) {
            isValid = false;
            }
            if (props.max != null && +text > props.max) {
            isValid = false;
            }
            if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
            }
            if (props.maxLength != null && text.length > props.maxLength) {
                isValid = false;
            }

            dispatchInputState({type:INPUT_UPDATE,value:text,isValid:isValid})
        }

        const lostFocusHandler = ()=>{

            dispatchInputState({type:INPUT_BLUR});
        }

    return(
        <View>
            <TextInput
                {...props}
                label={props.label}
                value={inputState.value}
                onChangeText={inputChangeHandler}
                onBlur={lostFocusHandler}
                theme={{colors: {primary:inputState.isValid ? Colors.secondary: Colors.primary,text:'white',placeholder:'white'}}}
                style={textInputStyle}
                underlineColor='white'
            />
            {!inputState.isValid && <Text style={{color:Colors.primary}}>{props.errorText}</Text>}
        </View>
     );    
};


const styles= StyleSheet.create({

    textInput:{
        backgroundColor:'transparent'
    },
    textInputTall:{
        backgroundColor:'transparent',
        paddingVertical:18
    },
    textInputBig:{
        backgroundColor:'transparent',
        fontSize:20,
        paddingVertical:20
    },


});

export default Input;