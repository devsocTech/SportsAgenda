import React from 'react';
import {View} from 'react-native';
import Home from '../components/Home';
import firebase from 'firebase';
import Header from '../components/Header';
import SnackBars from '../components/SnackBars';


export default class HomeScreen extends Header{


    constructor(props){
        super(props);

        this.state={
            teamName:'',
            teamPos:0,
            golesF:0,
            golesC:0,

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            title:'Inicio',

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],

            codigoEquipo:'',

            visibleSnackBar: false,
            mensajeSnackBar: '',

            visibleUnirteEquipo: false,

            refreshing:false

        }
    }

    componentDidMount=()=>{
        this.obtenerLigas()
    }

    selectLeagues=(value,key)=>{
        try {
        this.setState({leagueSelect:value},()=>{})
        var equipo=this.state.equipos[key]
        this.setState({equipo:equipo},()=>{this.handleRefresh()})
            
        } catch (error) {
            this.setState({mensajeSnackBar: "Todavía no tienes equipo"})
            this.setState({visibleSnackBar: true});
        }    
    }

    handleRefresh=()=>{
        this.setState({refreshing:true});
        if(this.state.leagueSelect!="" && this.state.equipo!=""){
            this.homeTeam()
        }
        this.setState({refreshing:false});
    }

    handleRefresh2=()=>{
        this.setState({refreshing:true});
        this.obtenerLigas()
        this.setState({refreshing:false});
    }

    obtenerLigas=()=>{
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
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
                this.setState({mensajeSnackBar: "Todavía no te has unido a una liga"})
                this.setState({visibleSnackBar: true});
            });
        }}).catch((error)=> {
            this.setState({mensajeSnackBar: "Todavía no te has unido a una liga"})
            this.setState({visibleSnackBar: true});
        });
    }
    
    homeTeam=()=>{
        var db = firebase.firestore();
        var liga = this.state.leagueSelect;
        var equipo = this.state.equipo
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=> {
        var dataEquipo = doc.data();
        var nombreEquipo = dataEquipo.Nombre;
        this.setState({teamName:nombreEquipo },()=>{})
        var posicionEquipo = dataEquipo.Posición;
        this.setState({teamPos:posicionEquipo},()=>{})
        var GF = dataEquipo.GolesFavor
        var GC = dataEquipo.GolesContra
        this.setState({golesF:GF},()=>{})
        this.setState({golesC:GC},()=>{})
        }).catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cargar los datos de tu equipo"})
            this.setState({visibleSnackBar: true});
        });
    }

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }



    aceptarDialogUnirteEquipo = () => {
        if(this.state.codigoEquipo != ''){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var codigo = this.state.codigoEquipo;
        //aqui guardare la seleccion de la liga
        //var liga = this.state.leagueSelect
        db.collection("usuarios").doc(user.uid).get().then((doc)=>{
            var data = doc.data()
            var nombreUser = data.nombre
        db.collection("codigosEquipos").where("Codigo", "==", codigo).get().then((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {
                var data = doc.data();
                var codiEquipo = data.Equipo; 
                var ligaEquipo = data.Liga; 

                db.collection("usuarios").doc(user.uid).update({
                    Equipos: firebase.firestore.FieldValue.arrayUnion(codiEquipo)
                }).then(()=> {   
                    db.collection("usuarios").doc(user.uid).update({
                    ligas: firebase.firestore.FieldValue.arrayUnion(ligaEquipo)
                    })
                }).then(()=> {   
                    db.collection("ligas").doc(ligaEquipo).collection("equipos").doc(codiEquipo).collection("jugadores").add({
                        jugador: nombreUser,
                        capitan: true,
                        goles: 0,
                        pago: 0
                    })
                }).then(()=> { 
                    var succcess = "Te has unido a un equipo y su liga"
                    this.setState({mensajeSnackBar: succcess})
                    this.setState({visibleSnackBar: true},()=>{this.obtenerLigas()});
                }).catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al unirte al equipo"})
                    this.setState({visibleSnackBar: true});
                });
            })
        })
        })
        this.hideDialogUnirteEquipo();
    }else{
        this.setState({mensajeSnackBar: "Porfavor llena todos los campos    "})
        this.setState({visibleSnackBar: true});
    }
    }

    setCodigoEquipo=(codigoEquipo)=>{
        this.setState({
            codigoEquipo:codigoEquipo
        })
    }

    setCodigoLiga=(codigoLiga)=>{
        this.setState({
            codigoLiga:codigoLiga
        })
    }

    

    showDialogUnirteEquipo = () => {
        this.setState({ visibleUnirteEquipo: true })
    }

    hideDialogUnirteEquipo = () => {
        this.setState({ visibleUnirteEquipo: false })
    }
    
    render(){
        return(
            <View style={{flex:1}}>
                <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>
            <Home
            visible={this.state.visible}
            title={this.state.title}
            leagueSelect={this.state.leagueSelect}
            nleagueSelect={this.state.nleagueSelect}
            
            hideDialog={this.hideDialog}
            selectLeague={this.selectLeague}
            showDialog={this.showDialog}
            
            teamName={this.state.teamName}
            teamPos={this.state.teamPos}
            golesF={this.state.golesF}
            golesC={this.state.golesC}

            nombreEquipo = {this.state.nombreEquipo}
            codigoLiga = {this.state.codigoLiga}
            
            ligas={this.state.ligas}
            nLigas={this.state.nLigas}

            agregarLiga={this.agregarLiga}
            unirteLiga={this.unirteLiga}
            crearEquipo={this.crearEquipo}
            agregarJugador={this.agregarJugador}
            unirteEquipo={this.unirteEquipo}
            programaPartido={this.programaPartido}
            registraPartido={this.registraPartido}

            visibleUnirteLiga={this.state.visibleUnirteLiga}
            visibleUnirteEquipo={this.state.visibleUnirteEquipo}
            

            showDialogUnirteEquipo={this.showDialogUnirteEquipo}
            aceptarDialogUnirteEquipo={this.aceptarDialogUnirteEquipo}
            hideDialogUnirteEquipo={this.hideDialogUnirteEquipo}

            setNombreLiga = {this.setNombreLiga}
            setCodigoLiga = {this.setCodigoLiga}
            setNombreEquipo = {this.setNombreEquipo}
            setCodigoEquipo = {this.setCodigoEquipo}
            setdateParti = {this.setdateParti}
            refreshing={this.state.refreshing}
            handleRefresh={this.handleRefresh}
            handleRefresh2={this.handleRefresh2}

            ></Home>
            <SnackBars
                mensajeSnackBar= {this.state.mensajeSnackBar}
                visibleSnackBar={this.state.visibleSnackBar}
                dismissSnackbar = {this.dismissSnackbar}
            ></SnackBars>

            </View>
        );
    }
}