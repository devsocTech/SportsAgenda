import React,{Component} from 'react';
import {Text,View} from 'react-native';
import MyTeam from '../components/MyTeam';
import Header from '../components/Header'

export default class MyTeamScreen extends Component{
    constructor(props){
        super(props);

        this.state={

            visibleAgregarJugador:false,

            title:'Equipo',
            Nombre: '',
            Puntos:0,
            PJ:0,
            PG:0,
            PE:0,
            PP:0,
            GC:0,
            GF:0,
            DG:0,
            nombreJugador: "",
            leagueSelect:'Guti Team',
        }
    }

    setNombreJugador=(nombreJugador)=>{
        this.setState({
            nombreJugador:nombreJugador
        })
    }

    showDialogAgregarJugador = () => {
        this.setState({ visibleAgregarJugador: true })
    }

    hideDialogAgregarJugador = () => {
        this.setState({ visibleAgregarJugador: false })
    }

    selectLeague=(leagueSelect)=>{
        this.setState({leagueSelect:leagueSelect})
    }



    aceptarDialogAgregarJugador = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        //aqui va a estar la selección de su equipo
        var equipo = "h8zh3uZ9WtzFTTtcPscV";
        //aqui va a estar el nombre del jugador que hayan introducido
        var nombre = this.state.nombreJugador;
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).collection("Jugadores").add({
            Nombre : nombre
        })
        this.setState({visibleAgregarJugador: false});
    }
    
   



    render(){
        return(
            <View style={{flex:1}}>

            <Header tit={this.state.title}></Header>
                <MyTeam 

                Nombre={this.state.Nombre}
                Puntos={this.state.Puntos}
                PJ={this.state.PJ}
                PG={this.state.PG}
                PE={this.state.PE}
                PP={this.state.PP}
                DG={this.state.DG}
                Title={this.state.title}

                showDialogAgregarJugador={this.showDialogAgregarJugador}
                hideDialogAgregarJugador={this.hideDialogAgregarJugador}
                visibleAgregarJugador={this.state.visibleAgregarJugador}
                aceptarDialogAgregarJugador = {this.aceptarDialogAgregarJugador}

                nombreJugador = {this.state.nombreJugador}
                setNombreJugador = {this.setNombreJugador}

                selectLeague={this.selectLeague}
                leagueSelect={this.state.leagueSelect}/>

            </View>
        );
    }
}