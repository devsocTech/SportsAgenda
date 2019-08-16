import React,{Component} from 'react';
import {Text,View} from 'react-native';
import firebase from 'firebase';

import Table from '../components/Table'

export default class Tablecreen extends Component{
    constructor(props){

        super(props);

        this.state={
            team:[],
            title:'Tablas',
            leagueSelect:'Guti Team',
        }
    }
    

    componentDidMount() {
        this.llenarTabla();
        console.log( this.state.team);
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
          //this.setState({Nombre:nombreEquipo})
          //console.log(nombreEquipo);
          var PTS =dataEquipo.Puntos;
          //this.setState({Puntos:PTS})
          //console.log("Puntos: " + PTS);
          var J = dataEquipo.PartidosJugados;
          //this.setState({PJ:J})
          //console.log("Jugados: "  + J);
          var G = dataEquipo.PartidosGanados;
          //this.setState({PG:G})
          //console.log("Ganados: " + G);
          var P = dataEquipo.PartidosPerdidos;
          //this.setState({PP:P})
          //console.log("Perdidos: " + P);
          var E = dataEquipo.PartidosEmpatados;
          //this.setState({PE:E})
          //console.log("Empatados: " + E);
          var DG = (dataEquipo.GolesFavor) - (dataEquipo.GolesContra);
          //this.setState({DGol:DG})
          //console.log("Diferencia: " + DG);
          db.collection("ligas").doc(liga).collection("equipos").doc(doc.id).update({
            Posición: contador
          })
          arreglo.push({nombreEquipo, PTS, J, G, P, E, DG});
          contador++; 
          //console.log(arreglo);
          this.setState({team:arreglo }, () => {
            console.log(this.state.team, 'alv?');
          });
        })
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
            <Table 
            team={this.state.team}

            Title={this.state.title}
            showDialog={this.showDialog}
            hideDialog={this.hideDialog}
            visible={this.state.visible}

            selectLeague={this.selectLeague}
            leagueSelect={this.state.leagueSelect}/>
        );
    }
}