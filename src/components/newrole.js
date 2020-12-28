import React, { Component } from 'react';
import {withRouter} from 'react-router';
import './newuser.scss';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    SelectableOptionMenuItemType,
  } from 'office-ui-fabric-react/lib/index';

import axios from 'axios';
import myStore from './myStore'
const auth = 'bearer '+Object.values(myStore.state).join('')
class NewRole extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            RoleKey: ""
         }
         this.handleSubmit= this.handleSubmit.bind(this)
         this.roleoption=[{key:0,text:'Admin'},{key:1,text:'Manager'},{key:2,text:'Monitor'}]
    }

    handleSubmit(e) {
        e.preventDefault();        
        if (this.state.RoleKey===0)
        {
            for (var i =0; i< this.props.IDs.length;i++)
            {        
              
                axios.get(this.props.url+'/api/user/SetRole',{params:{id: this.props.IDs[i], Role: "Admin"}},
                {
                    headers: {
                    'Content-Type':'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Authorization":auth
                    }
                }).then((Response)=>{
                   if(!Response.data)
                   {
                        
                   }
                   else{
                       this.props.onClose(e)
                   }
                })
                
            }
        }
        else if (this.state.RoleKey===1)
        {
            for (var i =0; i< this.props.IDs.length;i++)
            {        
                axios.get(this.props.url+'/api/user/SetRole',{params:{id: this.props.IDs[i], Role: "Manager"}},
                {
                    headers: {
                    'Content-Type':'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Authorization":auth
                    }
                }).then((Response)=>{
                   if(!Response.data)
                   {
                        
                   }
                   else{
                       this.props.onClose(e)
                   }
                })
            }
        }
        else 
        {
            for (var i =0; i< this.props.IDs.length;i++)
            {        
                axios.get(this.props.url+'/api/user/SetRole',{params:{id: this.props.IDs[i], Role: "Monitor"}},
                {
                    headers: {
                    'Content-Type':'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Authorization":auth
                    }
                }).then((Response)=>{
                   if(!Response.data)
                   {
                        
                   }
                   else{
                       this.props.onClose(e)
                   }
                })
            }
        }
        this.props.onClose(e)
    }

    render(){
        return(
            <Modal isOpen={true} style={{overflowY:'hidden'}}>
                <div style={{ margin:'20px 20px 10px 20px'}}>
                <h3>Phân quyền</h3>       
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div>
                <ComboBox onChange={(e,v)=>{this.setState({RoleKey:v.key})}}  useComboBoxAsMenuWidth options={this.roleoption} label='Phân quyền người dùng'></ComboBox>
                    </div>
                    <div style={{justifyContent:'center'},{justifyItems: 'center'}, {alignItems:'center'}}>
                    <PrimaryButton style={{margin:'20px 4px 4px 4px' }} onClick={(e)=>this.handleSubmit(e)}>OK</PrimaryButton>
                    <PrimaryButton style={{margin:'20px 4px 4px 4px'}} onClick={(e)=>  {e.preventDefault(); this.props.onClose(e)}}>Cancel</PrimaryButton>
                    </div>
                </div>
                </div>
            </Modal>
        )
    }
}

export default withRouter(NewRole);