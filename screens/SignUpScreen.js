import React, {Component} from 'react';
import SignUp from '../components/SignUp';
import firebase from 'firebase';
import 'firebase/firestore';


export default class SignUpScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            name:'',
            lastname:'',
            email: '',
            password1:'',
            password2:'',
            admin: false
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

    createUser=()=>{
        var db = firebase.firestore();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password1)
        .then(cred => {
            return db.collection('usuarios').doc(cred.user.uid).set({
                nombre: this.state.name,
                apellido: this.state.lastname,
                adminLigas: false,
            });
        }).catch(console.log("Hubo un error al crear tu cuenta")); //aqui remplazaremos el console.log por un error en pantalla
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: 'white'
    }

    render(){
        return(
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
        )
    }
}