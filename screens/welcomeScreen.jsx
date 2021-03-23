import  React ,  {Component} from 'react';
import { View, Text,Dimensions, ImageBackground,Image,StatusBar} from 'react-native';
import Carousel ,{ Pagination } from 'react-native-snap-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import {Button } from 'react-native-elements';
import styles from '../constants/guideScreenStyle';

//responsivity (Dimensions get method)
const screen = Dimensions.get('window');

export default class WelcomeScreen extends Component {

    constructor(props){
        super(props);
        this.state= {
            firstUse : [
                {
                    img: require('../assets/welcome3.png'),
                    title:'Réservez à tout moment',
                    resizeMode:'contain',
                    text: 'Coiffeurs disponibles 24/7 grâce à notre système de réservation très pratique.',
                    button:  <Button theme={{colors: {primary:'transparent'}}} title="Se connecter" onPress={() => this.props.navigation.navigate('Login')} titleStyle={styles.labelButton2} buttonStyle={styles.buttonStyle2}/>
                },
                {
                    img:require('../assets/welcome11.jpg'),
                    title:'Zone de confort',
                    text: "Profitez de coiffures et des soins esthétiques dans votre zone de confort.",
                    button:  <Button theme={{colors: {primary:'transparent'}}} title="Se connecter" onPress={() => this.props.navigation.navigate('Login')} titleStyle={styles.labelButton2} buttonStyle={styles.buttonStyle2}/>
                },
                
                {
                    img: require('../assets/welcome13.jpg'),
                    title:'Feedback',
                    text: 'Evaluer vos coiffeuses et esthéticiennes afin de construire une communauté de confiance.',
                    button:  <Button theme={{colors: {primary:'transparent'}}} title="Se connecter" onPress={() => this.props.navigation.navigate('Login')} titleStyle={styles.labelButton2} buttonStyle={styles.buttonStyle2}/>
                },
                {
                    img: require('../assets/welcome4.jpg'),
                    title:'Coiffeurs certifiés',
                    text: 'Trouvez les meilleurs services de coiffeurs talentueux près de chez vous.'
                    
                }
            ],
            activeTab : 0 ,

        }
    }

  


    _renderItem({item}){
        return(
            <View style={styles.carousel}>
                <ImageBackground
                 source = {item.img}
                 style={{
                     width:'100%',
                     height:'100%',
                     justifyContent:'flex-start',
                     backgroundColor:'white',
                     alignItems:'flex-end',
                 }}
                 imageStyle={{
                     borderBottomRightRadius:screen.width/1.8,
                     borderBottomLeftRadius:screen.width/1.8
                    }}
                >
                {item.button}
                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
           <View style={styles.container}>
               <StatusBar hidden />
               <View style={{height:'60%',width:'100%' }}>

              <Carousel
                    ref ={ ref => this.carousel = ref }
                    data ={ this.state.firstUse}
                    onSnapToItem={ i => this.setState({ activeTab : i }) }
                    sliderWidth={Dimensions.get('window').width}
                    sliderHeight={Dimensions.get('window').height}
                    itemWidth={Dimensions.get('window').width}
                    renderItem={ this._renderItem}
                    inactiveSlideOpacity={ 1 }
                    inactiveSlideScale={ 1 }
                    layout='tinder'
              />

              <Pagination
                    dotsLength={this.state.firstUse.length}
                    containerStyle={{ }}
                    dotStyle={{
                        width: screen.width/36,
                        height: screen.width/36,
                        borderRadius: screen.width/36,
                        marginHorizontal: screen.width/72,
                        backgroundColor: "#fd6c57"
                    }}
                    inactiveDotStyle={{
                        backgroundColor: "pink"
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                    activeDotIndex={ this.state.activeTab }
               />
                </View>

              <View style={{height:'40%',width:'100%',justifyContent:'space-between',paddingVertical:screen.width/14.4}}>
                <View>
                    <Text style={styles.title}>{this.state.firstUse[this.state.activeTab].title}</Text>
                    <Text style={styles.text}>{this.state.firstUse[this.state.activeTab].text}</Text>
                </View>
                <View>
                <Button
                    theme={{colors: {primary:'#fd6c57'}}} 
                    title={this.state.activeTab===3 ?"Se connecter": "Suivant"}
                    onPress={() => {if (this.state.activeTab===3){this.props.navigation.navigate('Login');}else {this.carousel.snapToNext();}}}
                    titleStyle={styles.labelButton}
                    buttonStyle={styles.buttonStyle}
                    ViewComponent={LinearGradient} 
                    linearGradientProps={{
                        colors: ['#fd6d57', '#fd9054'],
                        start: {x: 0, y: 0} ,
                        end:{x: 1, y: 0}
                        
                    }}
                  />
                  
                  <Text style={styles.textConditions}>Conditions d'utilisation</Text>
                  </View>
              </View>
           </View>
        );
    }
}

WelcomeScreen.navigationOptions= ()=>{
    return {
      headerTransparent : true ,
      headerStyle:{
          backgroundColor: 'white'
      },
      headerBackTitle : " ",
      headerLeft:()=>null,
      headerTitle: () => (
        <Image 
        resizeMode="cover"
        style={{
          width:150,
          height:40,
          resizeMode:'contain',
          alignSelf: 'center'}}
        
        />
      )};
  };