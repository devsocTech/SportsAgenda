import React,{Component} from 'react';
import {Text,View} from 'react-native';
import {Button} from 'react-native-paper'
import Home from '../components/Home';
import firebase from 'firebase';



export default class HomeScreen extends Component{

    constructor(props){
        super(props);

        this.state={
            visible: false,
            title:'Inicio',

            leagueSelect:'',
            nleagueSelect:'',

            teamName:'',
            teamPos:0,
            golesF:0,
            golesC:0,

            ligas:[],
            nLigas:[],
        }
    }

    componentDidMount() {
        this.homeTeam();
        this.obtenerLigas();
      }




    obtenerLigas=()=>{
        let user = firebase.auth().currentUser;
        var db=firebase.firestore();
        var use="kpniB4g7EPMDpRHAXpYVQZtPtzg2"
        var ligas=[];
        let contador=0;
        nombreLiga=[];
        db.collection("usuarios").doc(use).get().then((doc)=>{
            var data = doc.data();
            ligas = data.ligas;
            this.setState({ligas:ligas})
            console.log(ligas)

            for(let i=0;i<ligas.length;i++){
            db.collection("ligas").doc(ligas[i]).get().then((doc)=>{
                var data=doc.data();
                nombreLiga=data.Nombre;
                console.log(nombreLiga)
                this.setState({nLigas:nombreLiga})
            })}
        })
    }
    

    homeTeam=()=>{
        var db = firebase.firestore();
        var liga = "JxcDmZqYMj60CawzNF5l";
        var equipo = "WsC2LmWUDTXZwomGtjBt";
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=> {
        var dataEquipo = doc.data();
        var nombreEquipo = dataEquipo.Nombre;
        this.setState({teamName:nombreEquipo })
        var posicionEquipo = dataEquipo.Posición;
        this.setState({teamPos:posicionEquipo})

        db.collection("ligas").doc(liga).get().then((doc)=> {
          var dataLiga = doc.data();
          var nombreLiga = dataLiga.Nombre;
          this.setState({leagueSelect:nombreLiga})
          })
        var GF = dataEquipo.GolesFavor
        var GC = dataEquipo.GolesContra
        this.setState({golesF:GF})
        this.setState({golesC:GC})
        })
        }

    showDialog = () => {
        this.setState({ visible: true })
    }

    hideDialog = () => {
        this.setState({ visible: false })
    }

    selectLeague=(leagueSelect)=>{
        this.setState({leagueSelect:leagueSelect})
        var db=firebase.firestore();
        db.collection("ligas").doc(this.leagueSelect).get().then((doc)=>{
            var data=doc.data();
            var nombreLiga=data.Nombre;
            this.setState({nleagueSelect:nombreLiga})
        })


    }

    
    agregarLiga(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var refNuevaLiga = db.collection("ligas").doc();
        refNuevaLiga.set({
            DiasDeJuego: ["Lunes", "Martes"],
            HorasDeJuego: ["8:30","10:30"],
            Equipos: ["Probando", "Probando2"],
            Nombre: "Ultima Liga de Prueba"
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
       }
    
    
       unirteLiga(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var codigo = "Jx8490";
        var sliga = "JxcDmZqYMj60CawzNF5l";
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
                    db.collection("ligas").doc(sliga).collection("equipos").where("Capitan", "==", user.uid)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(docE) {
                            db.collection("ligas").doc(sligas).collection("equipos").doc(docE.id).update({
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
       }
    
       crearEquipo(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var userId = user.uid;
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        var refNuevoEquipo = db.collection("ligas").doc(liga).collection("equipos").doc();
        refNuevoEquipo.set({
            Capitan: userId,
            Jugadores: ["ELENA OJO ALVVV","Es madreada no te cagues", "ok perdon por forzarla"],
            Nombre: "Equipo Guti",
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
       }
    
       unirteEquipo(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var codigo = "h72767";
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
       }
    
      
    
       programaPartido(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 1
        var equipoV = "WsC2LmWUDTXZwomGtjBt";
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 2
        var equipoF = "h8zh3uZ9WtzFTTtcPscV";
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        //aqui voy a guardar le selección de la fecha y hora que hayan elegido
        var date = new Date("August 22, 2019 21:30:00");
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
        
       }
    
       registraPartido(){
        var db = firebase.firestore();
        //aqui voy a guardar la selección del partido que hayan elegido en el dialog box (del input que ellos pongan)
        var selecciónPartido = "Nb1GmTK4zMCHKT6aLkLM";
        //aqui voy a guardar los goles a favor del equipoF (del input que ellos pongan)
        var golesequipoF = 3;
        //aqui voy a guardar los goles a favor del equipoV (del input que ellos pongan)
        var golesequipoV = 2;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).update({
            completado: true,
            golesequipoF: golesequipoF,
            golesequipoV: golesequipoV
        })
        db.collection("ligas").doc(liga).collection("partidos").doc(selecciónPartido).get().then(function(doc) {
            var data = doc.data();
            var equipoF = data.equipoF;
            var equipoV = data.equipoV;
    
            if(golesequipoF>golesequipoV){
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosGanados: firebase.firestore.FieldValue.increment(1),
                    Puntos: firebase.firestore.FieldValue.increment(3),
                    GolesContra: golesequipoV,
                    GolesFavor: golesequipoF
                })
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                    GolesContra: golesequipoF,
                    GolesFavor: golesequipoV
                })
            }
            else if(golesequipoV>golesequipoF){
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosGanados: firebase.firestore.FieldValue.increment(1),
                    Puntos: firebase.firestore.FieldValue.increment(3),
                    GolesContra: golesequipoF,
                    GolesFavor: golesequipoV
                })
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosPerdidos: firebase.firestore.FieldValue.increment(1),
                    GolesContra: golesequipoV,
                    GolesFavor: golesequipoF
                })
            }
            else{
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                    Puntos: firebase.firestore.FieldValue.increment(1),
                    GolesContra: golesequipoF,
                    GolesFavor: golesequipoV
                })
                db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).update({
                    PartidosJugados: firebase.firestore.FieldValue.increment(1),
                    PartidosEmpatados: firebase.firestore.FieldValue.increment(1),
                    Puntos: firebase.firestore.FieldValue.increment(1),
                    GolesContra: golesequipoV,
                    GolesFavor: golesequipoF
                })
            }
        })
       }
    
       agregarJugador(){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = "JxcDmZqYMj60CawzNF5l";
        //aqui va a estar la selección de su equipo
        var equipo = "h8zh3uZ9WtzFTTtcPscV";
        //aqui va a estar el nombre del jugador que hayan introducido
        var nombre = "Elena Vela OJOOO ALVV QUE GUTI ME VA A VERGUEAR"
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).collection("Jugadores").add({
            Nombre : nombre
        })
       }

    llenarpartidosEquipo(){
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        //aqui guardare el equipo del usuario
        var equipo = "h8zh3uZ9WtzFTTtcPscV"
        db.collection("ligas").doc(liga).collection("equipos").doc(equipo).get().then((doc)=>{
            var infoEquipo = doc.data();
            var partidosEquipo = infoEquipo.Partidos;
            for(let i = 0; i<partidosEquipo.length;i++){
                db.collection("ligas").doc(liga).collection("partidos").doc(partidosEquipo[i]).get().then((doc)=>{
                    var datapartido = doc.data();
                    var equipoF = datapartido.equipoF;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoF = dataEquipo.Nombre;
                    })
                    var equipoV = datapartido.equipoV;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoV = dataEquipo.Nombre;
                    })
                    var golesequipoF = datapartido.golesequipoF;
                    var golesequipoV = datapartido.golesequipoV;
                    var fechaPartido = datapartido.fechaPartido;
                })
            }
        })
    }

    llenarpartidosFinalizados(){
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", true).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                var datapartido = doc.data();
                var equipoF = datapartido.equipoF;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoF = dataEquipo.Nombre;
                    })
                    var equipoV = datapartido.equipoV;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoV = dataEquipo.Nombre;
                    })
                var golesequipoF = datapartido.golesequipoF;
                var golesequipoV = datapartido.golesequipoV;
                var fechaPartido = datapartido.fechaPartido;
            })  
        })
    }

    llenarpartidosProximos(){
        var db = firebase.firestore()
        //aqui guardare la seleccion de la liga
        var liga = "JxcDmZqYMj60CawzNF5l"
        db.collection("ligas").doc(liga).collection("partidos").where("completado", "==", false).orderBy("fechaPartido").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                var datapartido = doc.data();
                var equipoF = datapartido.equipoF;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoF).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoF = dataEquipo.Nombre;
                    })
                    var equipoV = datapartido.equipoV;
                    db.collection("ligas").doc(liga).collection("equipos").doc(equipoV).get().then((doc)=>{
                        var dataEquipo = doc.data();
                        var nombreEquipoV = dataEquipo.Nombre;
                    })
                var golesequipoF = datapartido.golesequipoF;
                var golesequipoV = datapartido.golesequipoV;
                var fechaPartido = datapartido.fechaPartido;
            })  
        })
    }
    

    render(){
        return(
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
            
            ligas={this.state.ligas}
            nLigas={this.state.nLigas}

            agregarLiga={this.agregarLiga}
            unirteLiga={this.unirteLiga}
            crearEquipo={this.crearEquipo}
            agregarJugador={this.agregarJugador}
            unirteEquipo={this.unirteEquipo}
            programaPartido={this.programaPartido}
            registraPartido={this.registraPartido}
            llenarpartidosEquipo={this.llenarpartidosEquipo}
            ></Home>
        );
    }
}