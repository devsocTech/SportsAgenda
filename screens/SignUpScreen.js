import React, {Component} from 'react';
import SignUp from '../components/SignUp';
import firebase from 'firebase';
import 'firebase/firestore';
import SnackBars from '../components/SnackBars';
import {Text,View} from 'react-native';



export default class SignUpScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            name:'',
            lastname:'',
            email: '',
            password1:'',
            password2:'',
            admin: false,

            visibleSnackBar: false,
            mensajeSnackBar: '',
        }
    }

    setName=(name)=>{
        this.setState({
            name:name
        })
    }

    setLastName=(lastname)=>{
        this.setState({
            lastname:lastname
        })
    }   

    setEmail=(email)=>{
        this.setState({
            email:email
        })
    }

    setPassword1=(password1)=>{
        this.setState({
            password1:password1
        })
    }

    setPassword2=(password2)=>{
        this.setState({
            password2:password2
        })
    }

    setAdmin=(admin)=>{
        this.setState({
            admin:admin
        })
    }

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }

    createUser=()=>{
        var db = firebase.firestore();
        if(this.state.password1 != this.state.password2){
            this.setState({mensajeSnackBar: "Los passwords no coinciden"});
            this.setState({visibleSnackBar: true});
        }
        else if (this.state.name == '' || this.state.lastname == '' || this.state.Mail == '' || this.state.password1 == '' || this.state.password2 == ''){
            this.setState({mensajeSnackBar: "Porfavor llena todos los campos"})
            this.setState({visibleSnackBar: true});
        }
        else{
            passwordFinal = this.state.password2
            firebase.auth().createUserWithEmailAndPassword(this.state.email, passwordFinal)
            .then(cred => {
                return db.collection('usuarios').doc(cred.user.uid).set({
                    nombre: this.state.name,
                    apellido: this.state.lastname,
                    adminLigas: this.state.admin,
                });
            }).catch(()=> {
                this.setState({mensajeSnackBar: "Esta cuenta ya existe, o hubo un error al crearla"})
                this.setState({visibleSnackBar: true});
            }) 
        }
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: 'white'
    }

    render(){
        return(
            <View style={{flex:1}}>
            <SignUp setName={this.setName}
                    setLastName={this.setLastName}
                    setPassword1={this.setPassword1} 
                    setPassword2={this.setPassword2}
                    setEmail={this.setEmail}
                    createUser={this.createUser}
                    Admin={this.state.admin}
                    setAdmin={this.setAdmin}

                    Nombre = {this.state.name}
                    Apellido = {this.state.lastname}
                    Mail = {this.state.email}
                    Pass = {this.state.password1}
                    Pass2 = {this.state.password2}>
            </SignUp>
            <SnackBars
                    mensajeSnackBar= {this.state.mensajeSnackBar}
                    visibleSnackBar={this.state.visibleSnackBar}
                    dismissSnackbar = {this.dismissSnackbar}>   
            </SnackBars>

            </View>

        )
    }
}