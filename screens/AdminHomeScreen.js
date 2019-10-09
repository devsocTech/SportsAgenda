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

            cobranza: 0,
            jornadas: 0,
            equipoLider: '',

            codigoEquipo1: '',
            codigoEquipo2:'',
            dateParti:'',
            nombreLiga:'',
            sepuedeabrir:true
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
        var liga = this.state.leagueSelect;
        var contador = 0;
        var contador2 = 0;
        db.collection("ligas").doc(liga).get().then((doc)=>{
            var data = doc.data();
            var cobranza = data.CobranzaPendiente;
            this.setState({cobranza:cobranza}, ()=>{})
        })
        db.collection("ligas").doc(liga).collection("equipos").orderBy("PartidosJugados", "desc").get().then(querySnapshot => {
            querySnapshot.forEach((doc)=> {
                var dataEquipo = doc.data();
                var PartidosJugados = dataEquipo.PartidosJugados;
                if(contador = 0){
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
                if(contador2 = 0){
                    this.setState({equipoLider:equipoLider}, ()=>{})
                }
                else{
                    
                }
                contador2++;
            })
        })
        
    }

    handleRefresh=()=>{ 
        this.obtenerEquipos();
        
    }

    selectLeagues=(value,key)=>{
        this.obtenerLigas()
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
                this.setState({leagueSelect:ligas[0]},()=>{})
                this.setState({nleagueSelect:nombreLiga[0]},()=>{})
                if(equipos!=null){
                this.setState({equipo:equipos[0]},()=>{})
                }
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
        if(this.state.nombreEquipos==null || this.state.sepuedeabrir == false){
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
            for(ciclo = 0; ciclo<8; ciclo++){
            var codigo = (inicialesLiga + (Math.floor(1000 + Math.random() * 9000)));
            db.collection("codigosLigas").add({
            liga: ligaID,
            Codigo: codigo,
            Valido: true
            })
        }
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
                    this.setState({nombreEquipos:masterArreglo},()=>(console.log("Hola")));
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
       
        var db = firebase.firestore();
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 1
        var equipoV = this.state.codigoEquipo2;
        //aqui voy a guardar la selección que hayan elegido en el dialog box de equipo 2
        var equipoF = this.state.codigoEquipo1;
        //aqui voy a guardar la selección de la liga que hayan elegido en el dialoglistview
        var liga = this.state.leagueSelect;
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
        }).then(()=> {
            var success = "Se programó tu partido"
            this.setState({mensajeSnackBar: success})
            this.setState({visibleSnackBar: true});
        })
        .catch((error)=> {
            console.log(error);
            this.setState({mensajeSnackBar: "Hubo un error al programar el partido"})
            this.setState({visibleSnackBar: true});
        });

        this.setState({visibleProgramarPartido: false});
        
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
                
                setselecEquipo1={this.setselecEquipo1}
                setselecEquipo2={this.setselecEquipo2}
                setdateParti={this.setdateParti}
                setNombreLiga={this.setNombreLiga}
                setcostoliga = {this.setcostoliga}

                nombreEquipos = {this.state.nombreEquipos}

                costoliga = {this.state.costoliga}
                nombreLiga = {this.state.nombreLiga}

                aceptarDialogAgregarLiga = {this.aceptarDialogAgregarLiga}
                aceptarDialogProgramarPartido = {this.aceptarDialogProgramarPartido}>

                
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