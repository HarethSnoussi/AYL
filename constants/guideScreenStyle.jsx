import {StyleSheet} from 'react-native'
import Colors from './Colors';

const styles = StyleSheet.create({

    container: {

      height:'100%',
      width:'100%',
      backgroundColor: 'white',
      alignItems: 'center',

    },

    guide: {

      width:'100%',
      height:'20%',
      backgroundColor: '#0008',
      justifyContent:'center',
      alignItems:'center',
      alignSelf:'flex-end'

    },

    text:{

      textAlign:'center',
      fontSize: 14,
      paddingHorizontal:10,
      color:Colors.blue,
      paddingBottom:20,
      fontFamily:'poppins'
    },
    textConditions:{
        textAlign:'center',
        fontSize: 13,
        paddingHorizontal:10,
        color:Colors.blue,
        fontFamily:'poppins',
        paddingTop:5
    },

    title:{

      textAlign:'center',
      fontSize:25,
      fontFamily:'poppins-bold',
      color:Colors.primary

    },
    titleToConnect:{

        textAlign:'center',
        fontSize:23,
        fontFamily:'poppins',
        color:'#fff'
  
      },
    labelButton:{
        color:'#FFF',
        fontFamily:'poppins',
        fontSize:18,
        textTransform:null,
        
        },
    buttonStyle:{
        width:'80%',
        borderRadius:20,
        height:50,
        alignSelf:'center',
        },
    labelButton2:{
        color:'#FFF',
        fontFamily:'poppins',
        fontSize:20,
        textTransform:null,
        
        },
    buttonStyle2:{
        borderColor:'transparent',
        width:'70%',
        marginHorizontal:10,
        marginVertical:10,
        height:40,
        alignSelf:'center',
        }

  });

  export default styles;
