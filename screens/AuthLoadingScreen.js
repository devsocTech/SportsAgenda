import React,{Component} from 'react';
import AuthLoading from '../components/AuthLoading';
import firebase from 'firebase';

export default class AuthLoadingScreen extends Component{

    componentDidMount(){
        this.getUser();
    }

    getUser(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate('App');
            }else{
                this.props.navigation.navigate('Auth');
            }
        }
        )};
    
    render(){
        return(
        <AuthLoading>

        </AuthLoading>
        );
    }
}