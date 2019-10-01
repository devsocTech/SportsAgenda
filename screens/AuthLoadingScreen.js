import React,{Component} from 'react';
import AuthLoading from '../components/AuthLoading';
import firebase from 'firebase';

export default class AuthLoadingScreen extends Component{

    constructor(props){
        super(props)

        this.state={
        }
    }

    componentDidMount=()=>{
        this.getUser()
    }

    getUser=()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                var db = firebase.firestore();
                var user = firebase.auth().currentUser;
                var userId = user.uid;
                db.collection("usuarios").doc(userId).get().then((doc)=>{
                    var dataUser = doc.data();
                    var admin = dataUser.adminLigas;

                if(admin)
                    this.props.navigation.navigate('Admin');
                else if((!admin))
                    this.props.navigation.navigate('App');   
                })
            }else
                this.props.navigation.navigate('Auth');
        }
        )};
    
    render(){
        return(
        <AuthLoading>

        </AuthLoading>
        );
    }
}