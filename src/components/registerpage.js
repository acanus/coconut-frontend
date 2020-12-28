import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import './registerpage.scss';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import { Link, Text } from 'office-ui-fabric-react';
import myStore from './myStore'
import axios from 'axios';
const auth = 'bearer '+Object.values(myStore.state).join('')

class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            modalOpen:false,
            modalMessage:'Tài khoản đã tồn tại'
         }
         this.handleSubmit= this.handleSubmit.bind(this)
    }
    config = {
        headers: {
        'Content-Type':'application/json',
        "Access-Control-Allow-Origin": "*"
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const formdata= new FormData();
        formdata.set('data','data')
        if(this.infoname.value ==="")
        {
            this.setState({ 
                modalOpen:true,
                modalMessage:'Vui lòng nhập tên đăng nhập'
             })
        }
        else if(this.infofullname.value ==="")
        {
            this.setState({ 
                modalOpen:true,
                modalMessage:'Vui lòng nhập họ và tên'
             })
        }
        else if (this.info1.value === "")
        {
            this.setState({ 
                modalOpen:true,
                modalMessage:'Vui lòng nhập mật khẩu'
             })
        }
        else if(this.info1.value !== this.info2.value )
        {
            this.setState({ 
                modalOpen:true,
                modalMessage:'Mật khẩu không trùng khớp'
             })
        }
        else
        {
            axios.post(this.props.url+'/api/user/CreateUser',JSON.stringify({
                username:event.target.username.value,
                fullname:event.target.fullname.value,
                password:event.target.password1.value
                }),{
                headers: {
                'Content-Type':'application/json',
                "Access-Control-Allow-Origin": "*",
                'Authorization':auth
                }
            }).then((Response)=>{
                if (Response.data.Result)
                {
                    this.props.history.push('/login')
                }
                else{
                    this.setState({
                        modalOpen:true,
                        modalMessage:Response.data.Message
                    })
                }
            })
        }
      }
    handleClick(){
        axios.post(this.props.url+'/api/user/CreateUser',"asd",{
            headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*",
            "Authorization":auth
            }
        })
    }
    render() { 
        return ( 
            <div className='registercontainer'>
                <div class="bgimage"></div>
                <DefaultButton onClick={(e)=>{e.preventDefault();window.history.back()}} style={{position:'absolute',left:'40px',top:'40px'}} >Quay về</DefaultButton>
                <Modal isOpen={this.state.modalOpen} >
                    <h3 style={{marginLeft:'20px'}} >Error</h3>
                    <p style={{marginLeft:'20px'}}>{this.state.modalMessage}</p>
                   <div style={{width:'100%',display:'flex',position:'absolute',bottom:'20px'}}>
                   <PrimaryButton style={{marginLeft:'auto',marginRight:'auto'}} onClick={(e)=>  {e.preventDefault(); this.setState({modalOpen:false})}}>OK</PrimaryButton>
                   </div>
                   

                  
                </Modal>
                <h2>Coconut counting system</h2>
                <div className='loginbox'>
                    <h3>Register</h3>
                    <form style={{alignItems:'center',display:'flex',flexDirection:'column'}} onSubmit={this.handleSubmit}>
                    <TextField ref = {info => {this.infoname = info}} style={{textAlign:'center'}} className='inputbox' label='Tên đăng nhập' placeholder='Tên đăng nhập mới' name='username'></TextField>
                    <TextField ref = {info => {this.infofullname = info}} style={{textAlign:'center'}} className='inputbox' label='Họ và tên' name='fullname'></TextField>
                    <TextField ref = {info => {this.info1 = info}} style={{textAlign:'center'}} className='inputbox' type='password' label='Mật khẩu' placeholder='Mật khẩu' name='password1'></TextField>
                    <TextField ref = {info => {this.info2 = info}} style={{textAlign:'center'}} className='inputbox' type='password' placeholder='Nhập lại khẩu' name='password2'></TextField>
                   
                    <PrimaryButton style={{marginTop:'20px'}} type="submit" >Tạo tài khoản</PrimaryButton>
                    </form>
                    
                    <DefaultButton onClick={(e)=>{e.preventDefault(); this.props.history.push('/login')}} style={{marginTop:'20px'}}>Quay lại</DefaultButton>
                </div>
                
            </div>
         );
    }
}
 
export default withRouter(RegisterPage);