import React, {Component} from 'react';
import SignIn from '../components/SignIn';
import firebase from 'firebase';
import 'firebase/firestore';
import SnackBars from '../components/SnackBars';
import {Text,View} from 'react-native';



export default class SignInScreen extends Component{
    constructor(props){
        super(props);

        this.state={
            email: '',
            password:'',

            visibleSnackBar: false,
            mensajeSnackBar: '',
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

    dismissSnackbar=()=>{
        this.setState({
            visibleSnackBar:false
        })
    }

    signIn=()=>{
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(()=> {
            this.setState({mensajeSnackBar: "Contraseña incorrecta, o esta cuenta no existe"})
            this.setState({visibleSnackBar: true});
        }) 
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: 'white'
    }

    render(){
        return(
            <View style={{flex:1}}>

            <SignIn setPassword={this.setPassword} 
                    setEmail={this.setEmail}
                    signIn={this.signIn}
                    Mail={this.state.email}
                    Pass={this.state.password}>
            </SignIn>

            <SnackBars
                    mensajeSnackBar= {this.state.mensajeSnackBar}
                    visibleSnackBar={this.state.visibleSnackBar}
                    dismissSnackbar = {this.dismissSnackbar}>   
            </SnackBars>

            </View>
        )
    }
}