import {StyleSheet,Dimensions} from 'react-native'
import Colors from './Colors';

const screen= Dimensions.get('window');

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
      fontSize: screen.width/25.7,
      paddingHorizontal:screen.width/36,
      color:Colors.blue,
      paddingBottom:screen.width/18,
      fontFamily:'poppins'
    },
    textConditions:{
        textAlign:'center',
        fontSize: screen.width/27.7,
        paddingHorizontal:screen.width/36,
        color:Colors.blue,
        fontFamily:'poppins',
        paddingTop:screen.width/72
    },

    title:{

      textAlign:'center',
      fontSize:screen.width/14.4,
      fontFamily:'poppins-bold',
      color:Colors.primary

    },
    titleToConnect:{

        textAlign:'center',
        fontSize:screen.width/15.7,
        fontFamily:'poppins',
        color:'#fff'
  
      },
    labelButton:{
        color:'#FFF',
        fontFamily:'poppins',
        fontSize:screen.width/20,
        textTransform:null,
        
        },
    buttonStyle:{
        width:'80%',
        borderRadius:screen.width/18,
        height:screen.width/7.2,
        alignSelf:'center'
        },
    labelButton2:{
        color:'#FFF',
        fontFamily:'poppins',
        fontSize:screen.width/16.4,
        textTransform:null,
        
        },
    buttonStyle2:{
        borderColor:'transparent',
        width:'70%',
        marginHorizontal:screen.width/36,
        marginVertical:screen.width/36,
        height:screen.width/7.2,
        alignSelf:'center',
        }

  });

  export default styles;
