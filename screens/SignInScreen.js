import React, {Component} from 'react';
import SignIn from '../components/SignIn';
import firebase from 'firebase';
import 'firebase/firestore';



export default class SignInScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            email: '',
            password:'',
        }
    }

    setEmail=(email)=>{
        this.setState({
            email:email
        })
    }

    setPassword=(password)=>{
        this.setState({
            password:password
        })
    }

    signIn=()=>{
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(console.log("Hubo un error al entrar tu cuenta")); //aqui remplazaremos el console.log por un error en pantalla
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: 'white'
    }

    render(){
        return(
            <SignIn setPassword={this.setPassword} 
                    setEmail={this.setEmail}
                    signIn={this.signIn}
                    Mail={this.state.email}
                    Pass={this.state.password}>
            </SignIn>
        )
    }
}