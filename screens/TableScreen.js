import React,{Component} from 'react';
import {Text,View} from 'react-native';
import firebase from 'firebase';

import Table from '../components/Table'
import Header from '../components/Header'

export default class Tablecreen extends Component{
    constructor(props){

        super(props);

        this.state={
            team:[],
            title:'Tablas',
            leagueSelect:'Guti Team',
        }
    }
    

    componentDidMount=()=>{
        this.llenarTabla();
      }

      llenarTabla=()=>{
        var db = firebase.firestore();
        //aqui voy a guardar la selección de la liga
        var liga = "JxcDmZqYMj60CawzNF5l";
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
            this.setState({team:arreglo}, () => {
            });
          })
          console.log(this.state.team, 'teamState');
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });  
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
            <Header tit={this.state.title}></Header>
            <Table 
            team={this.state.team}

            Title={this.state.title}
            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}/>

          </View>
            
        );
    }
}