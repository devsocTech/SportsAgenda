import React,{Component} from 'react';
import {Text,View} from 'react-native';
import firebase from 'firebase';
import {DataTable,Avatar,DefaultTheme} from 'react-native-paper'

import Table from '../components/Table'
import Header from '../components/Header'

export default class Tablecreen extends Component{
    constructor(props){

        super(props);

        this.state={
            team:[],
            title:'Tablas',

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],

            rows:[],
        }
    }
    

    componentDidMount=()=>{
        this.obtenerLigas();
    }

    selectLeagues=(value,key)=>{
      this.setState({leagueSelect:value},()=>{})
      var equipo=this.state.equipos[key]
      this.setState({equipo:equipo},()=>{this.handleRefresh()})
      
    }

    handleRefresh=()=>{
      this.llenarTabla()
  }

    obtenerLigas=()=>{
      var user = firebase.auth().currentUser;
      var db=firebase.firestore();
      var ligas=[];
      var ligasMaster=[];
      var nombreLiga=[];
      var equipos=[];
      db.collection("usuarios").doc(user.uid).get().then((doc)=>{
          var data = doc.data();
          ligas = data.ligas;
          equipos=data.Equipos;
          for(let i=0;i<ligas.length;i++){
          db.collection("ligas").doc(ligas[i]).get().then((doc)=>{
              var data=doc.data();
              nombreLiga.push(data.Nombre)
              ligasMaster.push({value:ligas[i],label:nombreLiga[i],color:'black',key:i})
              this.setState({ligasMaster:ligasMaster},()=>{})
              this.setState({equipos:equipos},()=>{})
              this.setState({leagueSelect:ligas[0]},()=>{})
              this.setState({nleagueSelect:nombreLiga[0]},()=>{})
              this.setState({equipo:equipos[0]},()=>{})
          })
      }})
    }

    llenarTabla=()=>{
        var db = firebase.firestore();
        var liga = this.state.leagueSelect;
        var contador = 1;
        var arreglo = [];
        db.collection("ligas").doc(liga).collection("equipos").orderBy("Puntos", "desc").get().then(querySnapshot => {
          querySnapshot.forEach((doc)=> {
            var dataEquipo = doc.data();
            var nombreEquipo = dataEquipo.Nombre;
            var PTS =dataEquipo.Puntos;
            var J = dataEquipo.PartidosJugados;
            var G = dataEquipo.PartidosGanados;
            var P = dataEquipo.PartidosPerdidos;
            var E = dataEquipo.PartidosEmpatados;
            var DG = (dataEquipo.GolesFavor) - (dataEquipo.GolesContra);
            db.collection("ligas").doc(liga).collection("equipos").doc(doc.id).update({
              Posición: contador
            })
            arreglo.push({nombreEquipo, PTS, J, G, P, E, DG});
            contador++; 
            this.setState({team:arreglo }, () => { this.llenarTablaGrafica()});
          })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    }

    llenarTablaGrafica=()=>{
      var rows=[];
      var array = this.state.team;
      for (let i=0;i<array.length;i++){
          rows.push(
          <DataTable.Row theme={theme}>
             <DataTable.Cell style={{flex:6}}>{array[i].nombreEquipo}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].PTS}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].J}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].G}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].P}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].E}</DataTable.Cell>
             <DataTable.Cell style={{flex:1}}numeric>{array[i].DG}</DataTable.Cell>
         </DataTable.Row>)
     }
     this.setState({rows:rows},()=>{})
      
    }

    showDialog = () => {
        this.setState({ visible: true })
    }

    hideDialog = () => {
        this.setState({ visible: false })
    }

    selectLeague=(leagueSelect)=>{
        this.setState({leagueSelect:leagueSelect})
    }

    render(){
        return(
          <View style={{flex:1}}>
              <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>
            <Table 
            team={this.state.team}

            Title={this.state.title}
            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}
            rows={this.state.rows}/>

          </View>
            
        );
    }
}

const theme = {
  ...DefaultTheme,
  roundness: 100,
  colors: {
    ...DefaultTheme.colors,
    primary: '#47C9C6',
    accent: 'red',
    background: 'transparent',
    text:'#1E1E1E',
    placeholder: 'white',
    surface: '#EEEEEE',
    disabled: 'white'
  }
};