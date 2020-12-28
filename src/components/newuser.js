import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import './newuser.scss';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import { Link, Text } from 'office-ui-fabric-react';
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    SelectableOptionMenuItemType,
  } from 'office-ui-fabric-react/lib/index';

import axios from 'axios';
import myStore from './myStore'
const auth = 'bearer '+Object.values(myStore.state).join('')

class Newuser extends Component {
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
        if (this.infoname.value ==="")
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
            console.log(event.target.password1.value)
            axios.post(this.props.url+'/api/user/CreateUser',JSON.stringify({
                username:event.target.username.value,
                fullname:event.target.fullname.value,
                password:event.target.password1.value
                }),{
                headers: {
                'Content-Type':'application/json',
                'Authorization':auth,
                "Access-Control-Allow-Origin": "*"
                }
            }).then((Response)=>{
                if (Response.data.Result)
                {
                    console.log(Response.data.Result)
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
            "Access-Control-Allow-Origin": "*"
            }
        })
    }
    render() { 
        return ( 
            <div>
                <Modal isOpen={this.state.modalOpen} >
                    <h3 style={{marginLeft:'20px'}} >Error</h3>
                    <p style={{marginLeft:'20px'}}>{this.state.modalMessage}</p>
                    <div style={{width:'100%',display:'flex',position:'absolute',bottom:'20px'}}>
                    <PrimaryButton style={{marginLeft:'auto',marginRight:'auto'}} onClick={(e)=>  {e.preventDefault(); this.setState({modalOpen:false})}}>OK</PrimaryButton>
                    </div>
                </Modal>
                <Modal isOpen={true} style={{overflowY:'hidden'}}>
                    <div className='userdatabox' >
                        <h3 style = {{alignItems:'center',display:'flex',flexDirection:'column'}}>TẠO TÀI KHOẢN MỚI</h3>
                        <form style={{alignItems:'center',display:'flex',flexDirection:'column'}} onSubmit={this.handleSubmit}>
                            <div style={{display:'flex', flexDirection:'column'}} >
                                <TextField ref = {info => {this.infoname = info}} style={{textAlign:'center'}} className='inputbox' label='Tên đăng nhập' placeholder='Tên đăng nhập mới' name='username'></TextField>
                                <TextField ref = {info => {this.infofullname = info}} style={{textAlign:'center'}} className='inputbox' label='Họ và tên' name='fullname'></TextField>
                                <TextField ref = {info => {this.info1 = info}} style={{textAlign:'center'}} className='inputbox' type='password' label='Mật khẩu' placeholder='Mật khẩu' name='password1'></TextField>
                                <TextField ref = {info => {this.info2 = info}} style={{textAlign:'center'}} className='inputbox' type='password' placeholder='Nhập lại khẩu' name='password2'></TextField>
                                <div style={{display:'flex',justifyContent:'center',margin:'20px 60px 20px 60px', flexDirection:'column'}}>
                                <PrimaryButton style={{margin: '4px'}}  type="submit" >Tạo tài khoản</PrimaryButton>
                                <PrimaryButton style={{margin:'4px',}} onClick={(e)=>  {e.preventDefault(); this.props.onClose(e)}} >Cancel</PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </div> 
                </Modal> 
            </div>
         );
    }
}
 
export default withRouter(Newuser);