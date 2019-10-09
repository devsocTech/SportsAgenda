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

            codigoLiga:'',
            nombreEquipo:'',
            codigoEquipo:'',

            visibleSnackBar: false,
            mensajeSnackBar: '',

            visibleUnirteLiga: false,
            visibleUnirteEquipo: false,

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
        this.homeTeam()
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

    aceptarDialogUnirteLiga = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        db.collection("usuarios").doc(user.uid).get().then((doc)=>{
            var data = doc.data()
            var nombreUser = data.nombre

        if(this.state.codigoLiga !='' && this.state.nombreEquipo !=''){
            
            var codigo = this.state.codigoLiga;
            var nomEq = this.state.nombreEquipo;
            db.collection("codigosLigas").where("Codigo", "==", codigo).get()
            .then((querySnapshot)=> {
                querySnapshot.forEach((doc)=> {
                    var data = doc.data();
                    var liga = data.liga;
                    db.collection("ligas").doc(liga).get().then((doc2)=>{
                        var data2 = doc2.data() 
                        var costoLiga = data2.Costo;

                    if(data.Valido == true){
                        var refNuevoEquipo = db.collection("ligas").doc(liga).collection("equipos").doc();
                        refNuevoEquipo.set({
                            Liga: liga,
                            Capitan: user.uid,
                            Nombre: nomEq,
                            GolesFavor: 0,
                            GolesContra: 0,
                            PartidosJugados: 0,
                            PartidosGanados: 0,
                            PartidosPerdidos: 0,
                            PartidosEmpatados: 0,
                            Puntos: 0,
                            Pagos: costoLiga,
                            Partidos: []
                        })
                        
                        db.collection("usuarios").doc(user.uid).update({
                            ligas: firebase.firestore.FieldValue.arrayUnion(liga),
                        })
                        db.collection("ligas").doc(liga).collection("equipos").where("Capitan", "==", user.uid)
                        .get()
                        .then((querySnapshot)=> {
                            querySnapshot.forEach((docE)=> {
                                db.collection("ligas").doc(liga).collection("equipos").doc(docE.id).collection("jugadores").add({
                                    jugador: nombreUser,
                                    capitan: true,
                                    goles: 0,
                                    pago: 0
                                })
                                db.collection("ligas").doc(liga).update({
                                Equipos: firebase.firestore.FieldValue.arrayUnion(docE.id),
                                CobranzaPendiente: firebase.firestore.FieldValue.increment(costoLiga),
                                })
                                .then(()=> {
                                    var equipoID= (refNuevoEquipo.id);
                                    db.collection("usuarios").doc(user.uid).update({
                                    Equipos: firebase.firestore.FieldValue.arrayUnion(equipoID),
                                    CapitanEquipo: true
                                    })
                                })
                                .then(()=> {
                                    var equipoID= (refNuevoEquipo.id);
                                    var inicialesEquipo = equipoID.substr(0, 2);
                                    var codigo = (inicialesEquipo + (Math.floor(1000 + Math.random() * 9000)));
                                    db.collection("codigosEquipos").add({
                                    equipo: equipoID,
                                    Codigo: codigo,
                                    Valido: true,
                                    Liga: liga
                                    })
                                }).then(()=> {
                                    var succcess = "Te has unido a la liga y creado tu equipo"
                                    this.setState({mensajeSnackBar: succcess})
                                    this.setState({visibleSnackBar: true},()=>{this.obtenerLigas()});
                                    //this.obtenerLigas()
                                }).catch((error)=> {
                                    this.setState({mensajeSnackBar: "Hubo un error al unirte a la liga"})
                                    this.setState({visibleSnackBar: true});
                                })
                            });
                        })
                        
                    }else{
                        this.setState({mensajeSnackBar: "Este codigo no es válido"})
                    }
                }) 
            })
            })          
            this.hideDialogUnirteLiga();
        }
            
        else{
            this.setState({mensajeSnackBar: "Porfavor llena todos los campos primero"})
            this.setState({visibleSnackBar: true});
        }
    })
    }

    setNombreEquipo=(nombreEquipo)=>{
        this.setState({
            nombreEquipo:nombreEquipo
        })
    }

    aceptarDialogUnirteEquipo = () => {
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
                var codiEquipo = data.equipo; 
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
                        capitan: false,
                        goles: 0,
                        pago: 0
                    })
                }).then(()=> { 
                    var succcess = "Te has unido a un equipo y su liga"
                    this.setState({mensajeSnackBar: succcess})
                    this.setState({visibleSnackBar: true});
                }).catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al unirte al equipo"})
                    this.setState({visibleSnackBar: true});
                });
            })
        })
        })
        this.hideDialogUnirteEquipo();
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

    showDialogUnirteLiga = () => {
        this.setState({ visibleUnirteLiga: true })
    }

    hideDialogUnirteLiga = () => {
        this.setState({nombreEquipo: ''})
        this.setState({codigoEquipo: ''})
        this.setState({ visibleUnirteLiga: false })
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

            showDialogUnirteLiga={this.showDialogUnirteLiga}
            aceptarDialogUnirteLiga={this.aceptarDialogUnirteLiga}
            hideDialogUnirteLiga = {this.hideDialogUnirteLiga}

            showDialogUnirteEquipo={this.showDialogUnirteEquipo}
            aceptarDialogUnirteEquipo={this.aceptarDialogUnirteEquipo}
            hideDialogUnirteEquipo={this.hideDialogUnirteEquipo}

            setNombreLiga = {this.setNombreLiga}
            setCodigoLiga = {this.setCodigoLiga}
            setNombreEquipo = {this.setNombreEquipo}
            setCodigoEquipo = {this.setCodigoEquipo}
            setdateParti = {this.setdateParti}
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