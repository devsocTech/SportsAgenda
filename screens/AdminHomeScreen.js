import React,{Component} from 'react';
import {View} from 'react-native';
import HomeAdmin from '../components/HomeAdmin';
import Header from '../components/Header';
import firebase from 'firebase';
import SnackBars from '../components/SnackBars';



export default class HomeScreen extends Component{
    

    constructor(props){
        super(props);

        this.state={
            title: 'Inicio',

            visibleAgregarLiga:false,
            visibleProgramarPartido:false,
            visibleCrearEquipo: false,

            leagueSelect:'',
            nleagueSelect:'',
            keyTeam:0,

            ligas:[],
            nLigas:[],
            ligasMaster:[],
            equipo:'',
            equipos:[],

            mensajeSnackBar: '',
            visibleSnackBar: false,

            costoliga:0,

            codigoLiga:'',
            nombreEquipo:'',

            cobranza: 0,
            jornadas: 0,
            equipoLider: '',
            codigoliga:'',
            nombreUser:'',

            codigoEquipo1: '',
            codigoEquipo2:'',
            dateParti:'',
            nombreLiga:'',
            sepuedeabrir:true,

            refreshing:false
        }
    }

    componentDidMount=()=>{
        this.obtenerLigas()
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        this.setState({dateParti:date},()=>{}) 
    }

    adminhomeTeam=()=>{
        var db = firebase.firestore();
        var user = firebase.auth().currentUser;
        var liga = this.state.leagueSelect;
        var contador = 0;
        var contador2 = 0;
        db.collection("usuarios").doc(user.uid).get().then((doc)=>{
            var data = doc.data();
            var nombreUser = data.nombre
            this.setState({nombreUser: nombreUser}, ()=>{});
        })
        db.collection("ligas").doc(liga).get().then((doc)=>{
            var data = doc.data();
            var cobranza = data.CobranzaPendiente;
            var codigoliga = data.Codigo;
            this.setState({codigoliga:codigoliga}, ()=>{})
            this.setState({cobranza:cobranza}, ()=>{})
        })
        db.collection("ligas").doc(liga).collection("equipos").orderBy("PartidosJugados", "desc").get().then(querySnapshot => {
            querySnapshot.forEach((doc)=> {
                var dataEquipo = doc.data();
                var PartidosJugados = dataEquipo.PartidosJugados;
                if(contador == 0){
                    this.setState({jornadas:PartidosJugados}, ()=>{})
                }
                else{

                }
                contador++;
            })
        })
        db.collection("ligas").doc(liga).collection("equipos").orderBy("Puntos", "desc").get().then(querySnapshot => {
            querySnapshot.forEach((doc)=> {
                var dataEquipo = doc.data();
                var equipoLider = dataEquipo.Nombre;
                if(contador2 == 0){
                    this.setState({equipoLider:equipoLider}, ()=>{})
                }
                else{
                    
                }
                contador2++;
            })
        })
        
    }

    handleRefresh=()=>{
        this.setState({nombreEquipos:[]})
        this.setState({nombreUser: ""});
        this.setState({codigoliga:""})
        this.setState({cobranza:0})
        this.setState({jornadas:0})
        this.setState({equipoLider:"Sin equipos"})


        if(this.state.leagueSelect!=""){
            this.adminhomeTeam();
            this.obtenerEquipos();
        }
    }

    handleRefresh2=()=>{
        this.setState({refreshing:true})
        this.obtenerLigas(()=>{})
        this.setState({refreshing:false})
    }

    selectLeagues=(value,key)=>{
        try{
            this.setState({leagueSelect:value},()=>{}) 
        } catch(error){
            this.setState({mensajeSnackBar: "Hubo un error al obtener tus ligas2"})
            this.setState({visibleSnackBar: true});
        }
        try {
        var equipo=this.state.equipos[key]
        this.setState({equipo:equipo},()=>{this.handleRefresh()})   
        } catch (error) {
            this.setState({mensajeSnackBar: "Tu liga todavía no tiene equipos"})
            this.setState({visibleSnackBar: true});
        }    
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
                // this.setState({leagueSelect:ligas[0]},()=>{})
                // this.setState({nleagueSelect:nombreLiga[0]},()=>{})
                // if(equipos!=null){
                // this.setState({equipo:equipos[0]},()=>{})
                // }
            }).catch((error)=> {
                this.setState({mensajeSnackBar: "Hubo un error al acceder a la base de datos"})
                this.setState({visibleSnackBar: true});
            });
        }})
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Todavía no tienes ligas"})
            this.setState({visibleSnackBar: true});
        });
    }

    showDialogAgregarLiga = () => {
        this.setState({ visibleAgregarLiga: true })
    }

    hideDialogAgregarLiga = () => {
        this.setState({ visibleAgregarLiga: false })
    }

    showDialogProgramarPartido = () => {
        if(this.state.nombreEquipos.length < 2 || this.state.sepuedeabrir == false){
            this.setState({mensajeSnackBar: "Primero necesitas 2 equipos en tu liga"})
            this.setState({visibleSnackBar: true});
        }
        else{
        this.setState({ visibleProgramarPartido: true })
        }
    }

    hideDialogProgramarPartido = () => {
        this.setState({ visibleProgramarPartido: false })
    }

    aceptarDialogAgregarLiga = () => {
        if(this.state.nombreLiga != '' && this.state.cost != 0){
        var db = firebase.firestore();
        let user = firebase.auth().currentUser;
        var cost = parseInt(this.state.costoliga)
        var refNuevaLiga = db.collection("ligas").doc();
        refNuevaLiga.set({
            Nombre: this.state.nombreLiga,
            Costo: cost,
            CobranzaPendiente: 0
        })
        .then(function() {
            var ligaID= (refNuevaLiga.id);
            db.collection("usuarios").doc(user.uid).update({
            ligas: firebase.firestore.FieldValue.arrayUnion(ligaID),
            Equipos: firebase.firestore.FieldValue.arrayUnion('Equipo Admin')
            })
        })
        .then(function() {
            var ligaID= (refNuevaLiga.id);
            var inicialesLiga = ligaID.substr(0, 2);
            var codigo = (inicialesLiga + (Math.floor(1000 + Math.random() * 9000)));
            db.collection("ligas").doc(ligaID).update({
            Codigo: codigo,
            })
        
        }).then(()=> {
            this.setState({mensajeSnackBar: "Se creo tu liga exitosamente"},()=>{this.obtenerLigas()})
            this.setState({visibleSnackBar: true});
        }) 
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al crear una liga"})
            this.setState({visibleSnackBar: true});
        });
        this.setState({nombreLiga: ''});
        this.hideDialogAgregarLiga()
        this.obtenerLigas();
    }else{
        this.setState({mensajeSnackBar: "Porfavor llena todos los campos"})
        this.setState({visibleSnackBar: true});
    }
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

    setNombreLiga = (nombreLiga) =>{
        this.setState({
            nombreLiga:nombreLiga
        })
    }

    setcostoliga = (costoliga) =>{
        this.setState({
            costoliga:costoliga
        })
    }

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }

    obtenerEquipos=()=>{
        var db=firebase.firestore();
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = this.state.leagueSelect;
        var masterArreglo=[];
        db.collection("ligas").doc(liga).collection("equipos").get().then(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                if (doc.exists) {
                    var data = doc.data();
                    var nombreEquipo= data.Nombre;
                    var codigoEquipo= doc.id;
                    masterArreglo.push({label:nombreEquipo, value:codigoEquipo});
                    this.setState({nombreEquipos:masterArreglo},()=>(console.log("")));
                } else {
                    this.setState({sepuedeabrir: false})
                }    
            })
        })
        .catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al cargar los equipos"})
            this.setState({visibleSnackBar: true});
        });
    }

    aceptarDialogProgramarPartido=()=>{
        if(this.state.codigoEquipo1 != '' && this.state.codigoEquipo1 != null && this.state.codigoEquipo2 != '' && this.state.codigoEquipo2 != null){
        var db = firebase.firestore();
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 1
        var equipoV = this.state.codigoEquipo2;
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 2
        var equipoF = this.state.codigoEquipo1;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = this.state.leagueSelect;
        //var date = Date.parse(this.state.dateparti)
        var primerapartedate =((this.state.dateParti.substring(0, 10)));
        var segundapartedate = (this.state.dateParti.substring(11,16));
        var date = primerapartedate.concat("T",segundapartedate,":00Z")
        var refNuevoPartido = db.collection("ligas").doc(liga).collection("partidos").doc();
        refNuevoPartido.set({
            fechaPartido: firebase.firestore.Timestamp.fromDate(new Date(date )),
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
        }).then(()=> {
            var success = "Se programó tu partido"
            this.setState({mensajeSnackBar: success})
            this.setState({visibleSnackBar: true});
        }).catch((error)=> {
            this.setState({mensajeSnackBar: "Hubo un error al programar tu partido"})
            this.setState({visibleSnackBar: true});
        });
        this.setState({visibleProgramarPartido: false});
    }else{
        this.setState({mensajeSnackBar: "Porfavor selecciona dos equipos sin repetirse"})
        this.setState({visibleSnackBar: true});
    }
    }

    setNombreEquipo=(nombreEquipo)=>{
        this.setState({
            nombreEquipo:nombreEquipo
        })
    }

    showDialogCrearEquipo = () => {
        this.setState({ visibleCrearEquipo: true })
    }

    hideDialogCrearEquipo = () => {
        this.setState({nombreEquipo: ''})
        this.setState({codigoEquipo: ''})
        this.setState({ visibleCrearEquipo: false })
    }

    
    aceptarDialogCrearEquipo = () => {
        var db = firebase.firestore();
        var user = firebase.auth().currentUser;
        var liga = this.state.leagueSelect;

        if(this.state.nombreEquipo !='' && this.state.leagueSelect != ''){

            var nomEq = this.state.nombreEquipo;

            db.collection("ligas").doc(liga).get().then((doc2)=>{
                var data = doc2.data();
                var costo = data.Costo;
            
                var refNuevoEquipo = db.collection("ligas").doc(liga).collection("equipos").doc();
                refNuevoEquipo.set({
                    Liga: liga,
                    Capitan: '',
                    Nombre: nomEq,
                    GolesFavor: 0,
                    GolesContra: 0,
                    PartidosJugados: 0,
                    PartidosGanados: 0,
                    PartidosPerdidos: 0,
                    PartidosEmpatados: 0,
                    Puntos: 0,
                    Pagos: costo,
                    Partidos: []
                }) 
                db.collection("ligas").doc(liga).update({
                Equipos: firebase.firestore.FieldValue.arrayUnion(refNuevoEquipo.id),
                CobranzaPendiente: firebase.firestore.FieldValue.increment(costo),
                })
                .then(()=> {
                    var equipoID= (refNuevoEquipo.id);
                    var inicialesEquipo = equipoID.substr(0, 2);
                    var codigo = (inicialesEquipo + (Math.floor(1000 + Math.random() * 9000)));
                    db.collection("codigosEquipos").add({
                    Codigo: codigo,
                    Liga: liga,
                    Equipo: refNuevoEquipo.id
                    })
                    db.collection("ligas").doc(liga).collection("equipos").doc(refNuevoEquipo.id).update({
                        Codigo: codigo,
                    })
                }).then(()=> {
                    var succcess = "Has agregado el equipo" 
                    this.setState({mensajeSnackBar: succcess})
                    this.setState({visibleSnackBar: true},()=>{this.handleRefresh()});
                    //this.obtenerLigas()
                }).catch((error)=> {
                    this.setState({mensajeSnackBar: "Hubo un error al crear el equipo"})
                    this.setState({visibleSnackBar: true});
                })
            
            })
                                    
                this.hideDialogCrearEquipo();
                this.setState({codigoLiga:''})
        }
            
        else{
            this.setState({mensajeSnackBar: "Porfavor llena todos los campos primero"})
            this.setState({visibleSnackBar: true});
        }
    }
        
    




    render(){
        return(
            <View style={{flex:1}}>
              <Header ligasMaster={this.state.ligasMaster} leagueSelect={this.state.leagueSelect} nleagueSelect={this.state.nleagueSelect} selectLeagues={this.selectLeagues} tit={this.state.title}></Header>
                <HomeAdmin
                programaPartido={this.aceptarDialogProgramarPartido}
                agregarLiga={this.aceptarDialogAgregarLiga}

                showDialogAgregarLiga={this.showDialogAgregarLiga}
                hideDialogAgregarLiga={this.hideDialogAgregarLiga}

                showDialogProgramarPartido={this.showDialogProgramarPartido}
                hideDialogProgramarPartido={this.hideDialogProgramarPartido}

                visibleAgregarLiga={this.state.visibleAgregarLiga}
                visibleProgramarPartido={this.state.visibleProgramarPartido}
                visibleCrearEquipo = {this.state.visibleCrearEquipo}
                
                setselecEquipo1={this.setselecEquipo1}
                setselecEquipo2={this.setselecEquipo2}
                setdateParti={this.setdateParti}
                setNombreLiga={this.setNombreLiga}
                setcostoliga = {this.setcostoliga}
                setNombreEquipo = {this.setNombreEquipo}

                nombreEquipo = {this.state.nombreEquipo}
                nombreEquipos = {this.state.nombreEquipos}

                showDialogCrearEquipo={this.showDialogCrearEquipo}
                aceptarDialogCrearEquipo={this.aceptarDialogCrearEquipo}
                hideDialogCrearEquipo = {this.hideDialogCrearEquipo}

                costoliga = {this.state.costoliga}
                nombreLiga = {this.state.nombreLiga}

                aceptarDialogAgregarLiga = {this.aceptarDialogAgregarLiga}
                aceptarDialogProgramarPartido = {this.aceptarDialogProgramarPartido}
                aceptarDialogCrearEquipo = {this.aceptarDialogCrearEquipo}
                
                cobranza={this.state.cobranza}
                equipoLider={this.state.equipoLider}
                jornada={this.state.jornadas}
                codigoliga={this.state.codigoliga}
                nombreUser = {this.state.nombreUser}

                handleRefresh={this.handleRefresh}
                handleRefresh2={this.handleRefresh2}

                refreshing={this.state.refreshing}

                >
                    

                
                </HomeAdmin>
                
                <SnackBars
                  mensajeSnackBar= {this.state.mensajeSnackBar}
                  visibleSnackBar={this.state.visibleSnackBar}
                  dismissSnackbar = {this.dismissSnackbar}
                > </SnackBars>
              
            </View>
        );
    }
}