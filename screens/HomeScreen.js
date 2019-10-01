import React from 'react';
import {View} from 'react-native';
import Home from '../components/Home';
import firebase from 'firebase';
import Header from '../components/Header'


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

            visibleUnirteLiga: false,
            visibleUnirteEquipo: false,

        }
    }

    componentDidMount=()=>{
        this.obtenerLigas()
    }

    selectLeagues=(value,key)=>{
        this.setState({leagueSelect:value},()=>{})
        var equipo=this.state.equipos[key]
        this.setState({equipo:equipo},()=>{this.homeTeam();})
        
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
            })
        }})
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
        })
    }

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
        var liga = this.state.leagueSelect
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
            aceptarDialogUnirteLiga={this.aceptarDialogAgregarLiga}
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
            </View>
        );
    }
}