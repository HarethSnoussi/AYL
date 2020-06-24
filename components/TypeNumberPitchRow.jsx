import React from 'react';
import { StyleSheet,View, Picker,Platform,Text,TouchableOpacity} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Colors from "../constants/Colors";



const TypeNumberPitchRow = props =>{


    return(
      <View style={styles.tableRow}>
        <CheckBox
            {...props}
            title={props.title}
            checked={props.checked}
            checkedColor={Colors.primary}
            onPress={props.onPress}
        />
        {Platform.OS==='android' ? 
        <Picker
            {...props}
            selectedValue={props.selectedValue}
            onValueChange={props.onValueChange}
            style={styles.picker}
        >
        {props.array.map(el=> <Picker.Item label={el} value={el} key={el} />)}
        </Picker>:
        (<TouchableOpacity onPress={props.onPressStadiumNumberIOS} style={styles.picker}>
          <Text>
                {props.selectedValue}
          </Text>
        </TouchableOpacity>)} 
      </View>

     );    
};


const styles= StyleSheet.create({
 tableRow:{
   borderBottomColor:'white',
   borderBottomWidth:1,
   justifyContent:'space-between',
   alignItems:'center',
   flexDirection:'row',
   marginHorizontal:10
  },
  picker:{
    backgroundColor : "white",
    width : 35,
    height:25,
    marginRight:10
  }
});

export default TypeNumberPitchRow;