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
            nombreEquipos:[]
        }
    }

    componentDidMount=()=> {
        this.homeTeam();
        this.obtenerEquipos();
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

    setCodigoEquipo=(codigoEquipo)=>{
        this.setState({
            codigoEquipo:codigoEquipo
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
        console.log(this.state.nombreEquipos)
        this.setState({ visibleProgramarPartido: true })
    }

    hideDialogProgramarPartido = () => {
        this.setState({ visibleProgramarPartido: false })
    }

    obtenerEquipos=()=>{
        var db=firebase.firestore();
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        arreglo=[];
        db.collection("ligas").doc(liga).collection("equipos").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                var data = doc.data();
                var nombreEquipo= data.Nombre;
                arreglo.push({nombreEquipo});
                this.setState({nombreEquipos:arreglo});
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
    
      
    
       aceptarDialogProgramaPartido=()=>{
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 1
        var equipoV = "8dH1kNRdRMucwiNpUlH6";
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 2
        var equipoF = "h8zh3uZ9WtzFTTtcPscV";
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        //aqui voy a guardar le selección de la fecha y hora que hayan elegido
        var date = new Date("August 24, 2019 21:30:00");
        var refNuevoPartido = db.collection("ligas").doc(liga).collection("partidos").doc();
        refNuevoPartido.set({
            fechaPartido: firebase.firestore.Timestamp.fromDate(date),
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

     
    
       registraPartido(){
        var db = firebase.firestore();
        //aqui voy a guardar la selección del partido que hayan elegido en el dialog box (del input que ellos pongan)
        var selecciónPartido = "vHwKGgLt3vcMMhvqar0O";
        //aqui voy a guardar los goles a favor del equipoF (del input que ellos pongan)
        var golesequipoFN = 3;
        //aqui voy a guardar los goles a favor del equipoV (del input que ellos pongan)
        var golesequipoVN = 1;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        var ganadorO = "";
        var ganadorN = "";
        
        db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).get().then((doc)=>{
            var dataParti = doc.data();
            var compl = dataParti.completado
            
            if(compl == true){
                var golesequipoFO = dataParti.golesequipoF
                var golesequipoVO = dataParti.golesequipoV
                if(golesequipoFO>golesequipoVO){
                    ganadorO = "F"
                }
                else if(golesequipoFO<golesequipoVO){
                    ganadorO = "V"
                }
                else{
                    ganadorO = "E"
                }
                
                var golesequipoFN = this.state.golesequipoFN;
                var golesequipoVN = this.state.golesequipoVN;
                if(golesequipoFN>golesequipoVN){
                    ganadorN = "F"
                }
                else if(golesequipoFN<golesequipoVN){
                    ganadorN = "V"
                }
                else{
                    ganadorN = "E"
                }

                if(ganadorO == ganadorN){
                    db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                        golesequipoF: golesequipoFN,
                        golesequipoV: golesequipoVN,  
                    })
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                        GolesContra: firebase.firestore.FieldValue.decrement(golesequipoVO),
                        GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoFO),
                        GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                        GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                    })
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                        GolesContra: firebase.firestore.FieldValue.decrement(golesequipoFO),
                        GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoVO),
                        GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                        GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                    })
                }
                else{
                    db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                        golesequipoF: golesequipoFN,
                        golesequipoV: golesequipoVN,  
                    })
                    if(ganadorN == "F" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.decrement(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.decrement(3),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.decrement(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                    else if(ganadorN == "V" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.decrement(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.decrement(3),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.decrement(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                    }
                    else if(ganadorN == "E" && ganadorO == "F"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosGanados: firebase.firestore.FieldValue.decrement(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.decrement(2),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.decrement(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                    }
                    else if(ganadorN == "E" && ganadorO == "V"){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosGanados: firebase.firestore.FieldValue.decrement(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.decrement(2),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosPerdidos: firebase.firestore.FieldValue.decrement(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.decrement(golesequipoVO),
                            GolesFavor: firebase.firestore.FieldValue.decrement(golesequipoFO),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                }

            }
            else if(compl == false){
                db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
                    completado: true,
                    golesequipoF: golesequipoFN,
                    golesequipoV: golesequipoVN
                })
                db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).get().then(function(doc) {
                    var data = doc.data();
                    var equipoF = data.equipoF;
                    var equipoV = data.equipoV;
            
                    if(golesequipoFN>golesequipoVN){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                    }
                    else if(golesequipoVN>golesequipoFN){
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosGanados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(3),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                    else{
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoFN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoVN)
                        })
                        db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                            PartidosJugados: firebase.firestore.FieldValue.increment(1),
                            PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                            Puntos: firebase.firestore.FieldValue.increment(1),
                            GolesContra: firebase.firestore.FieldValue.increment(golesequipoVN),
                            GolesFavor: firebase.firestore.FieldValue.increment(golesequipoFN)
                        })
                    }
                }) 
            }
            else{
                console.log("Hubo un error");
            }
        })  
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

            nombreEquipos = {this.state.nombreEquipos}
            ></Home>
            </View>
        );
    }
}