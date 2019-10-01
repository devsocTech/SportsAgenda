import React,{Component} from 'react';
import {View,StyleSheet} from 'react-native';
import { Appbar,DefaultTheme,Text,Portal,Dialog,Button,RadioButton} from 'react-native-paper';
import firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class Header extends Component{

  constructor(props){
    super(props);

    this.state={
        visible: false,

        ligasMaster:[],

        leagueSelect:'',
        nleagueSelect:'',
    }
}

componentDidMount=()=>{
}

showDialog = () => {
  this.setState({ visible: true })
}

hideDialog = () => {
  this.setState({ visible: false })
}

selectLeague=(value,key)=>{
  this.setState({leagueSelect:value},()=>{})
  var db= firebase.firestore();
        db.collection("ligas").doc(value).get().then((doc)=>{
            var data=doc.data();
            var nombreLiga=data.Nombre;
            this.setState({nleagueSelect:nombreLiga},()=>{})
        })
  this.props.selectLeagues(value,key,()=>{})
}

 render(){
  let array=this.props.ligasMaster

    return (
        <View style={{paddingTop:20,flexDirection:'row'}} theme={theme}>

          <View style={{flex:1}}>
          <Text theme={theme} style={{paddingHorizontal:20,fontSize:29,fontWeight:'bold',alignSelf:'flex-start'}}>{this.props.tit}</Text>
          </View>

          <View style={{justifyContent:'center'}}>
          <Text theme={theme} style={{fontWeight:'bold',alignSelf:'flex-end',paddingRight:20}}>Liga:</Text>
          <RNPickerSelect
            placeholder={{}}
            placeholderTextColor='black'
            onValueChange={(value,key) => {this.selectLeague(value,key)}}
            items={array}
            style={{...pickerSelectStyles}}
              useNativeAndroidPickerStyle={false}/>
          </View>

      </View>
    );
  }
}

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FAFAFA',
      accent: '#47C9C6',
      background: '#3B4B61',
      text:'black',
      placeholder: '#FAFAFA',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };

  const theme2 = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: '#47C9C6',
      accent: '#47C9C6',
      background: '#3B4B61',
      text:'black',
      placeholder: '#FAFAFA',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'white',
      paddingRight: 30, 
    },
    inputAndroid: {
      alignSelf:'flex-end',
      paddingRight:40,
      paddingTop:1,
      fontSize: 14,
      color: 'black',
    },
  });