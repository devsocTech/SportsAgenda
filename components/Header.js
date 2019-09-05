import React,{Component} from 'react';
import {View} from 'react-native';
import { Appbar,DefaultTheme,Text,Portal,Dialog,Button,RadioButton} from 'react-native-paper';
import firebase from 'firebase';

export default class Header extends Component{

  constructor(props){
    super(props);

    this.state={
        visible: false,

        leagueSelect:'',
        nleagueSelect:'',

        ligas:[],
        nLigas:[],
    }
}

componentDidMount=()=>{
  this.obtenerLigas();
}

obtenerLigas=()=>{
  let user = firebase.auth().currentUser;
  //console.log(user)
  var db=firebase.firestore();
  var ligas=[];
  nombreLiga=[];
  db.collection("usuarios").doc(user.uid).get().then((doc)=>{
      var data = doc.data();
      ligas = data.ligas;
      this.setState({ligas:ligas})
      //console.log(ligas)

      for(let i=0;i<ligas.length;i++){
      db.collection("ligas").doc(ligas[i]).get().then((doc)=>{
          var data=doc.data();
          nombreLiga.push(data.Nombre)
          this.setState({nLigas:nombreLiga})
          this.setState({leagueSelect:ligas[0]})
          this.setState({nleagueSelect:nombreLiga[0]})
      })}
  })
}

showDialog = () => {
  this.setState({ visible: true })
}

hideDialog = () => {
  this.setState({ visible: false })
}

selectLeague=(value)=>{
  this.setState({leagueSelect:value})
  var db=firebase.firestore();
  db.collection("ligas").doc(value).get().then((doc)=>{
      var data=doc.data();
      var nombreLiga=data.Nombre;
      this.setState({nleagueSelect:nombreLiga})
  })
}


 render(){
  let rows=[];
  let array=this.state.ligas;
  let ligas=this.state.nLigas;
    for (let i=0;i<array.length;i++){
        rows.push(<View style={{flexDirection:'row'}}>
        <RadioButton value={array[i]}/>
        <Text style={{alignSelf:'center'}}>{ligas[i]}</Text>
      </View>)
    }

    return (
      <View>
      <Appbar.Header style={{paddingTop:20}} theme={theme}>
        <Appbar.Content
        title={this.props.tit}
        titleStyle={{fontSize:29, fontWeight:'bold',alignSelf:'flex-start'}}/>

        <Appbar.Content
        subtitle={this.state.nleagueSelect}
        subtitleStyle={{alignSelf:'flex-end',paddingBottom:25,fontWeight:'bold'}}
        onPress={()=>this.showDialog()}>
        </Appbar.Content>

        <Appbar.Action icon="arrow-drop-down" onPress={()=>this.showDialog()}/>
      </Appbar.Header>

      <Portal>
            <Dialog
             visible={this.state.visible}
             onDismiss={()=>this.hideDialog()}
             theme={theme2}>
            <Dialog.Title>Seleccionar Liga</Dialog.Title>
            <Dialog.Content>

            <RadioButton.Group
              onValueChange={(value)=>this.selectLeague(value)}
              value={this.state.leagueSelect}
            >
        {rows}
      </RadioButton.Group>
              
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={this.hideDialog}>Aceptar</Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>

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
      text:'white',
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
      text:'white',
      placeholder: '#FAFAFA',
      surface: '#3B4B61',
      disabled: 'white'
    }
  };