import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import './loginpage.scss';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import { Link, Text } from 'office-ui-fabric-react';
import { position } from 'custom-electron-titlebar/lib/common/dom';
import axios from 'axios';
import myStore from './myStore';
const auth='' ;
class LoginPage extends Component {
    
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen:false,
            logging:false,
            error:{title:'Error',message:'Sai tên đăng nhập hoặc mật khẩu'}
         }
         this.handleLogin=this.handleLogin.bind(this)
    }
    handleLogin(event)
    {
        let username = event.target.username.value
        let password = event.target.password.value
        event.preventDefault()
        this.setState({logging:true})
        axios.post(this.props.url+'/api/user/Login',JSON.stringify({
            username:username,
            password:password
            }),{
            headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*"
            }
        }).then((Response)=>{
            console.log('ádad')
           if(!Response.data.Result)
           {
                this.setState({modalOpen:true,logging:false})
           }
           else{
                console.log(username, password)
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                var urlencoded = new URLSearchParams();
                urlencoded.append("username", username);
                urlencoded.append("password", password);
                urlencoded.append("grant_type", "password");
                urlencoded.append("scope", "data:read");
                var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
                };

                fetch(this.props.url+"/token", requestOptions)
                .then(response => response.json()).then(r=>myStore.setState(r.access_token))
                .catch(error => console.log('error', error));
                auth = 'bearer '+Object.values(myStore.state).join('')
               this.props.history.push('/')
           }
        }).catch((error)=>{
            console.log(error)
            this.setState({modalOpen:true,logging:false})

        })
        
               
    }
    render() { 
        return ( 
            <div className='logincontainer'>

                <div class="bgimage"></div>
                <DefaultButton onClick={(e)=>{e.preventDefault();window.history.back()}} style={{position:'absolute',left:'40px',top:'40px'}} >Quay về</DefaultButton>
                <Modal isOpen={this.state.modalOpen} >
                    <h3 style={{marginLeft:'20px'}} >{this.state.error.title}</h3>
                   <p style={{marginLeft:'20px'}}>{this.state.error.message}</p>
                   <div style={{width:'100%',display:'flex',position:'absolute',bottom:'20px'}}>
                   <PrimaryButton style={{marginLeft:'auto',marginRight:'auto'}} onClick={(e)=>  {e.preventDefault(); this.setState({modalOpen:false})}}>OK</PrimaryButton>
                   </div>                 
                </Modal>
                <h2>Coconut counting system</h2>
                <form onSubmit={this.handleLogin}>
                {this.state.logging?
                <div className='loginbox1' >
                    <Spinner className='loader'  size={SpinnerSize.large}  label='Đang đăng nhập' style={{marginTop:'20px',fontSize:'15px'}} >
                    
                    </Spinner>
                </div>
                    :
                <div className='loginbox'>
                <h3>Login</h3>
                   
                        
                        <TextField  style={{textAlign:'center'}} className='inputbox' name='username' placeholder='Tên đăng nhập'></TextField>
                    <TextField style={{textAlign:'center'}} className='inputbox' type='password' name='password' placeholder='Mật khẩu'></TextField>
                    <NavLink to='/register' style={{marginTop:'10px'}}>Tạo mới?</NavLink>
                    <PrimaryButton  style={{marginTop:'20px'}} type='submit'>Đăng nhập</PrimaryButton>
                </div>}
                </form>
                
            </div>

         );
    }
}
 
export default withRouter(LoginPage);