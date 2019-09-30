import React,{Component} from 'react';
import {Text,View} from 'react-native';
import Home from '../components/Home';
import firebase from 'firebase';
import Header from '../components/Header'



export default class HomeScreen extends Header{


    constructor(props){
        super(props);

        this.state={
            visibleAgregarLiga: false,
            visibleUnirteLiga: false,
            visibleCrearEquipo: false,
            visibleUnirteEquipo: false,
            visibleProgramarPartido: false,
            teamName:'',
            teamPos:0,
            golesF:0,
            golesC:0,

            title:'Inicio',

            ligas:[],
            nLigas:[],
            nEquipos:[],
            nombreLiga: '',
            codigoLiga: '',

            nombreEquipo: "",
            codigoEquipo: "",
            nombreEquipos:[],

            codigoEquipo1:"",
            codigoEquipo2:"",

            dateParti:""
        }
    }

    componentDidMount=()=> {
        this.homeTeam();
        this.obtenerEquipos();
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.setState({dateParti:date})
      }

    setNombreLiga=(nombreLiga)=>{
        this.setState({
            nombreLiga:nombreLiga
        })
    }

    setCodigoLiga=(codigoLiga)=>{
        this.setState({
            codigoLiga:codigoLiga
        })
    }

    setNombreEquipo=(nombreEquipo)=>{
        this.setState({
            nombreEquipo:nombreEquipo
        })
    }


    setCodigoEquipo=(codigoEquipo)=>{
        this.setState({
            codigoEquipo:codigoEquipo
        })
    }

    setselecEquipo1=(codigoEquipo1)=>{
        this.setState({
            codigoEquipo1:codigoEquipo1
        })
    }

    setselecEquipo2=(codigoEquipo2)=>{
        this.setState({
            codigoEquipo2:codigoEquipo2
        })
    }

    setdateParti=(dateParti)=>{
        this.setState({
            dateParti:dateParti
        })
    }

    showDialogAgregarLiga = () => {
        this.setState({ visibleAgregarLiga: true })
    }

    hideDialogAgregarLiga = () => {
        this.setState({ visibleAgregarLiga: false })
    }

    showDialogUnirteLiga = () => {
        this.setState({ visibleUnirteLiga: true })
    }

    hideDialogUnirteLiga = () => {
        this.setState({ visibleUnirteLiga: false })
    }

    showDialogCrearEquipo = () => {
        this.setState({ visibleCrearEquipo: true })
    }

    hideDialogCrearEquipo = () => {
        this.setState({ visibleCrearEquipo: false })
    }

    showDialogUnirteEquipo = () => {
        this.setState({ visibleUnirteEquipo: true })
    }

    hideDialogUnirteEquipo = () => {
        this.setState({ visibleUnirteEquipo: false })
    }

    showDialogProgramarPartido = () => {
        this.setState({ visibleProgramarPartido: true })
    }

    hideDialogProgramarPartido = () => {
        this.setState({ visibleProgramarPartido: false })
    }

    obtenerEquipos=()=>{
        var db=firebase.firestore();
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        var masterArreglo=[];
        db.collection("ligas").doc(liga).collection("equipos").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                var data = doc.data();
                var nombreEquipo= data.Nombre;
                var codigoEquipo= doc.id;
                masterArreglo.push({label:nombreEquipo, value:codigoEquipo});
                this.setState({nombreEquipos:masterArreglo});
            })
        })
      }

      esAdmin=()=>{
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var userId = user.uid;
        db.collection("usuarios").doc(userId).get().then((doc)=>{
            var dataUser = doc.data();
            var admin = dataUser.adminLigas;
        })
    }


    aceptarDialogAgregarLiga = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var refNuevaLiga = db.collection("ligas").doc();
        refNuevaLiga.set({
            Nombre: this.state.nombreLiga
        })
        .then(function() {
            var ligaID= (refNuevaLiga.id);
            db.collection("usuarios").doc(user.uid).update({
            ligas: firebase.firestore.FieldValue.arrayUnion(ligaID)
            })
        })
        .then(function() {
            var ligaID= (refNuevaLiga.id);
            var inicialesLiga = ligaID.substr(0, 2);
            for(ciclo = 0; ciclo<8; ciclo++){
            var codigo = (inicialesLiga + (Math.floor(1000 + Math.random() * 9000)));
            db.collection("codigosLigas").add({
            liga: ligaID,
            Codigo: codigo,
            Valido: true
            })
        }
        })     
        .catch(function(error) {
            console.error("Error creating the codes: ", error);
        });  
        
        this.hideDialogAgregarLiga();
    }


    //"Jx8490"
    aceptarDialogUnirteLiga = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var codigo = this.state.codigoLiga;
        db.collection("codigosLigas").where("Codigo", "==", codigo).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                var liga = data.liga;
                if(data.Valido == true){
                    db.collection("usuarios").doc(user.uid).update({
                        ligas: firebase.firestore.FieldValue.arrayUnion(liga)
                    })
                    db.collection("codigosLigas").doc(doc.id).update({
                        Valido : false
                    })
                    db.collection("ligas").doc(liga).collection("equipos").where("Capitan", "==", user.uid)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(docE) {
                            db.collection("ligas").doc(ligas).collection("equipos").doc(docE.id).update({
                                Ligas: firebase.firestore.FieldValue.arrayUnion(liga)
                            })
                            db.collection("ligas").doc(liga).update({
                                Equipos: firebase.firestore.FieldValue.arrayUnion(docE.id)
                            })
                        });
                    })
                }
                else{
                    console.log("Este codigo no es valido");
                }
            })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        this.hideDialogUnirteLiga();
    }
    
    aceptarDialogCrearEquipo = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var userId = user.uid;
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        var refNuevoEquipo = db.collection("ligas").doc(liga).collection("equipos").doc();
        refNuevoEquipo.set({
            Capitan: userId,
            Jugadores: [],
            Nombre: this.state.nombreEquipo,
            GolesFavor: 0,
            GolesContra: 0,
            PartidosJugados: 0,
            PartidosGanados: 0,
            PartidosPerdidos: 0,
            PartidosEmpatados: 0,
            Puntos: 0,
        })
        .then(function() {
            var equipoID= (refNuevoEquipo.id);
            db.collection("usuarios").doc(user.uid).update({
            Equipos: firebase.firestore.FieldValue.arrayUnion(equipoID),
            CapitanEquipo: true
            })
        })
        .then(function() {
            var equipoID= (refNuevoEquipo.id);
            var inicialesEquipo = equipoID.substr(0, 2);
            var codigo = (inicialesEquipo + (Math.floor(1000 + Math.random() * 9000)));
            db.collection("codigosEquipos").add({
            equipo: equipoID,
            Codigo: codigo,
            Valido: true
            })
        }); 
        this.hideDialogCrearEquipo();
    }

    homeTeam=()=>{
        var db = firebase.firestore();
        var liga = "JxcDmZqYMj60CawzNF5l";
        var equipo = "h8zh3uZ9WtzFTTtcPscV";
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=> {
        var dataEquipo = doc.data();
        var nombreEquipo = dataEquipo.Nombre;
        this.setState({teamName:nombreEquipo })
        var posicionEquipo = dataEquipo.Posición;
        this.setState({teamPos:posicionEquipo})
        var GF = dataEquipo.GolesFavor
        var GC = dataEquipo.GolesContra
        this.setState({golesF:GF})
        this.setState({golesC:GC})
        })
        console.log
        }

    
       aceptarDialogUnirteEquipo = () => {
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var codigo = this.state.codigoEquipo;
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        db.collection("codigosEquipos").where("Codigo", "==", codigo).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var data = doc.data();
                db.collection("usuarios").doc(user.uid).update({
                    Equipos: firebase.firestore.FieldValue.arrayUnion(data.equipo)
                })
                db.collection("ligas").doc(liga).collection("equipos").doc(data.equipo).get().then(function(doc2) {
                    var infoEquipo = doc2.data();
                    var ligasEquipo = infoEquipo.Ligas;
                    for(x = 0; x<ligasEquipo.length;x++){
                        var liga = ligasEquipo[x];
                        db.collection("usuarios").doc(user.uid).update({
                        ligas: firebase.firestore.FieldValue.arrayUnion(liga)
                        })
                    }
                })
            })
        })
        this.hideDialogUnirteEquipo();
       }
    
      
    
       aceptarDialogProgramarPartido=()=>{
        var db = firebase.firestore();
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 1
        var equipoV = this.state.codigoEquipo2;
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 2
        var equipoF = this.state.codigoEquipo1;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        var refNuevoPartido = db.collection("ligas").doc(liga).collection("partidos").doc();
        refNuevoPartido.set({
            fechaPartido: firebase.firestore.Timestamp.fromDate(new Date(this.state.dateParti)),
            equipoV : equipoV,
            golesequipoV : 0,
            equipoF : equipoF,
            golesequipoF : 0,
            completado : false
        }).then(function() {
            var partidoId= (refNuevoPartido.id);
            db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                Partidos: firebase.firestore.FieldValue.arrayUnion(partidoId)
                })
            db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                Partidos: firebase.firestore.FieldValue.arrayUnion(partidoId)
                })
        })

        this.setState({visibleProgramarPartido: false});
       }


     
    

    render(){

        return(
            <View style={{flex:1}}>
                <Header tit={this.state.title}></Header>
            <Home
            visibleAgregarLiga={this.state.visibleAgregarLiga}
            visibleUnirteLiga={this.state.visibleUnirteLiga}
            visibleCrearEquipo={this.state.visibleCrearEquipo}
            visibleUnirteEquipo={this.state.visibleUnirteEquipo}
            visibleProgramarPartido={this.state.visibleProgramarPartido}

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
            
            ligas={this.state.ligas}
            nLigas={this.state.nLigas}

            showDialogAgregarLiga={this.showDialogAgregarLiga}
            aceptarDialogAgregarLiga={this.aceptarDialogAgregarLiga}
            hideDialogAgregarLiga = {this.hideDialogAgregarLiga}

            showDialogUnirteLiga={this.showDialogUnirteLiga}
            aceptarDialogUnirteLiga={this.aceptarDialogAgregarLiga}
            hideDialogUnirteLiga = {this.hideDialogUnirteLiga}

            showDialogCrearEquipo={this.showDialogCrearEquipo}
            aceptarDialogCrearEquipo={this.aceptarDialogCrearEquipo}
            hideDialogCrearEquipo={this.hideDialogCrearEquipo}

            showDialogUnirteEquipo={this.showDialogUnirteEquipo}
            aceptarDialogUnirteEquipo={this.aceptarDialogUnirteEquipo}
            hideDialogUnirteEquipo={this.hideDialogUnirteEquipo}

            showDialogProgramarPartido={this.showDialogProgramarPartido}
            aceptarDialogProgramarPartido={this.aceptarDialogProgramarPartido}
            hideDialogProgramarPartido = {this.hideDialogProgramarPartido}


            unirteLiga={this.unirteLiga}
            crearEquipo={this.crearEquipo}
            agregarJugador={this.agregarJugador}
            unirteEquipo={this.unirteEquipo}
            programaPartido={this.programaPartido}
            registraPartido={this.registraPartido}

            setNombreLiga = {this.setNombreLiga}
            setCodigoLiga = {this.setCodigoLiga}
            setNombreEquipo = {this.setNombreEquipo}
            setCodigoEquipo = {this.setCodigoEquipo}
            setdateParti = {this.setdateParti}

            dateParti = {this.state.dateParti}

            setselecEquipo1 = {this.setselecEquipo1}
            setselecEquipo2 = {this.setselecEquipo2}

            nombreEquipos = {this.state.nombreEquipos}
            ></Home>
            </View>
        );
    }
}