import React,{Component} from 'react';
import {Text,View} from 'react-native';
import MyTeam from '../components/MyTeam';
import Header from '../components/Header'
import SnackBars from '../components/SnackBars';
import firebase from 'firebase'

export default class Tablecreen extends Component{
    constructor(props){
        super(props);

        this.state={
            title:'Mi Equipo',
            nombreJugador: "",
            visibleAgregarJugador:false,
            visibleSnackBar: false,
            mensajeSnackBar: '',
            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],

        }
    }

    componentDidMount=()=>{
        this.obtenerLigas();
    }

    handleRefresh=()=>{
    }

    selectLeagues=(value,key)=>{
        this.setState({leagueSelect:value},()=>{})
        var equipo=this.state.equipos[key]
        this.setState({equipo:equipo},()=>{this.handleRefresh();})
        
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
                //console.log(nombreLiga)
                //console.log(this.state.nleagueSelect)
                ligasMaster.push({value:ligas[i],label:nombreLiga[i],color:'black',key:i})
                this.setState({ligasMaster:ligasMaster},()=>{})
                this.setState({equipos:equipos},()=>{})
                this.setState({leagueSelect:ligas[0]},()=>{})
                this.setState({nleagueSelect:nombreLiga[0]},()=>{})
                this.setState({equipo:equipos[0]},()=>{})
            }).catch((error)=> {
                this.setState({mensajeSnackBar: "Hubo un error al unirte al obtener tus ligas"})
                this.setState({visibleSnackBar: true});
            })
        }}).catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al unirte al obtener tus ligas"})
            this.setState({visibleSnackBar: true});
        })
    }

    
    aceptarDialogAgregarJugador = () => {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
        var liga = this.state.leagueSelect;
        var equipo = this.state.equipo;
        var nombre = this.state.nombreJugador;
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=>{
            var dataEquipo = doc.data();
            var Capitan = dataEquipo.Capitan;
            if(Capitan == user.uid){
                db.collection("ligas").doc(liga).collection("equipos").doc(equipo).collection("Jugadores").add({
                    Nombre : nombre
                }).then(()=> {
                    var succcess = "Se ha agregado un jugador"
                    this.setState({mensajeSnackBar: succcess})
                    this.setState({visibleSnackBar: true});
                }).catch(()=> {
                    this.setState({mensajeSnackBar: "Hubo un error al agregar un jugador"})
                    this.setState({visibleSnackBar: true});
                })
    
            }
            else{
                this.setState({mensajeSnackBar: "No eres capitan del equipo"})
                this.setState({visibleSnackBar: true});
            }
        })
        
        this.setState({visibleAgregarJugador: false});
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

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }


    render(){
        return(
            <View style={{flex:1}}>

                <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>              
                <MyTeam Nombre={this.state.Nombre}
           
            Title={this.state.title}
            showDialogAgregarJugador={this.showDialogAgregarJugador}
            hideDialogAgregarJugador={this.hideDialogAgregarJugador}
            visibleAgregarJugador={this.state.visibleAgregarJugador}
            setNombreJugador={this.setNombreJugador}
            aceptarDialogAgregarJugador = {this.aceptarDialogAgregarJugador}/>
            
            <SnackBars
               mensajeSnackBar= {this.state.mensajeSnackBar}
               visibleSnackBar={this.state.visibleSnackBar}
               dismissSnackbar = {this.dismissSnackbar}
            ></SnackBars>

            </View>
        );
    }
}