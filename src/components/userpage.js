import React, { Component } from 'react';
import './userpage.scss';
import { DefaultButton, PrimaryButton, Stack, IStackTokens, Label, Modal } from 'office-ui-fabric-react';
import { Text} from 'office-ui-fabric-react/lib/Text';
import { IColumn,SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import {TextField, SearchBox} from '@fluentui/react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { Icon } from '@fluentui/react/lib/Icon';
import {DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, 
        ConstrainMode, IDetailsFooterProps, DetailsRow,Selection} from 'office-ui-fabric-react/lib/DetailsList';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IDetailsColumnRenderTooltipProps } from 'office-ui-fabric-react/lib/DetailsList';
import onRenderDetailsHeader from './renderheader'
import Newuser from './newuser'
import NewRole from './newrole'
import myStore from './myStore'
import MessageError from './modalMessageError'


class UserPage extends Component {
    constructor(props) {

        super(props);    
        this.state = {
            user:{username:'',name:'',role:''}, 
            items:[ 
            ], 
            itemsRender:[],
            IDs:[],
            error:false,
            isOpenModal: false,
            modalMessage:""
        }
        this._IDs=[];
        this.names=[];
        this._columns = [
            { key: 'column0', name: 'STT', fieldName: 'key', minWidth: 100, maxWidth:130,  isResizable: true },
            { key: 'column1', name: 'Tên đăng nhập', fieldName: 'userName', minWidth: 100, maxWidth:130,  isResizable: true },
            { key: 'column2', name: 'Họ và tên', fieldName: 'firstName', minWidth: 100, maxWidth:130,  isResizable: true },
            { key: 'column4', name: 'Quyền', fieldName: 'role', minWidth: 100, maxWidth:130, isResizable: true },
            { key: 'column6', name: 'Đăng nhập lần cuối', fieldName: 'lastLogin', minWidth: 130, maxWidth:200,  isResizable: true },
            { key: 'column7', name: 'Ngày tạo tài khoản', fieldName: 'createdDate', minWidth: 150, maxWidth:200,  isResizable: true },

        ];
        this.onRemoveRow=this.onRemoveRow.bind(this)
        this.onUserNameTextChange=this.onUserNameTextChange.bind(this)
        this.onFirstNameTextChange=this.onFirstNameTextChange.bind(this)
        this.state.itemsRender=this.state.items
        this.onSelectIDs = this.onSelectIDs.bind(this)
        this.onUpdate = this.onUpdate.bind(this)

        this._selection = new Selection({
            onSelectionChanged: () => {
                const data = []
                const items = this._selection.getSelection()
                this._IDs = items.map(item=>{return(item.ID)})
                this.names = items.map(item=>{return(item.userName)})
          }
        })
    }
    onUpdate(){
        axios.get(this.props.url+'/api/user/IsLogin').then((Response)=>{
            if (Response.data){
                axios.get(this.props.url+'/api/user/CurrentUser').then((Respone1)=>{
                    if(Respone1.data)
                    {
                        // console.log(Respone1.data)
                        this.setState({user:{username:Respone1.data.username,name:Respone1.data.name,role:Respone1.data.role.Name}})
                    }
                })
            }
            else{
                // window.location.href='/#/login'
            }
      })
      axios.get(this.props.url+'/api/user/GetUserList',{headers:{"Authorization":myStore.state.auth}}).then((Response)=>{
            if (Response.data){
                const userlist= Response.data.map((value,index)=>{
                    return (
                    {
                        key:index,
                        userName:value.Username,
                        lastLogin:value.LastLogin,
                        createdDate:value.DateCreated,
                        role:value.Role.Name,   
                        firstName:value.Name,
                        ID: value.ID
                    }
                    )
                })
                
                this.setState({items:userlist, itemsRender: userlist})
            }
           
      }).catch(e=>this.setState({error:e.response.status===401?true:false}))
    }
    componentDidMount(){
        this.onUpdate();
    }

    onUserNameTextChange(_,text) {
        return(
        this.setState((prevState)=>{
            return(
                {itemsRender: prevState.items.filter(item => item.userName.toLowerCase().indexOf(text.toLowerCase()) >= 0)}
            )
        }))
    }
    onFirstNameTextChange(_,text) {
        return(
        this.setState((prevState)=>{
            return(
                {itemsRender: prevState.items.filter(item => item.firstName.toLowerCase().indexOf(text.toLowerCase()) >= 0)}
            )
        }))
    }
    onRemoveRow(){
        // this._IDs = []
        // const _id = this.state.items.filter((item, index) => {
        //     if (this._selection.isIndexSelected(index))
        //     {
        //       let list_ids = this._IDs
        //       list_ids.push(item.ID)
        //       this._IDs= list_ids
        //     }
             
        // })
        for (var i =0; i< this._IDs.length;i++)
        {        
            if(this.names[i] === this.state.user.username)
            {
                this.setState({isOpenModal: true, modalMessage:"Không thể xóa tài khoản " + this.names[i]})
            }
            else
            {                
                axios.get(this.props.url+'/api/user/deleteuser',{headers:{"Authorization":myStore.state.auth}, params: {id: this._IDs[i]}})
                this.setState(prevState => {
                return {
                    items: prevState.items.filter((item, index) => !this._selection.isIndexSelected(index)),
                    itemsRender: prevState.items.filter((item, index) => !this._selection.isIndexSelected(index))
                    }
                })
            }
        }
       
    }
    onSelectIDs(){
        // this._IDs = []
        // const _id = this.state.items.filter((item, index) => {
        //     if (this._selection.isIndexSelected(index))
        //     {
        //       let list_ids = this._IDs
        //       list_ids.push(item.ID)
        //       console.log(item.ID)
        //       this._IDs= list_ids
        //     }
             
        // })
        // console.log(this._IDs)
    }
    handleLogout(e){
        e.preventDefault(); 
        // console.log(auth) 
        axios.post(this.props.url+'/api/user/Logout','',{
            headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*",
            }
        }).catch(e=>console.log(e))
        localStorage.setItem('token','')
        myStore.setState({auth:''})
        window.location.href='/#/login'
    }
    _onItemInvoked(item) {
        alert(`Item invoked: ${item.name}`);
      };
    

    render() {
        
        return ( 
            
            <div className='userpage'>
                <Modal isOpen={this.state.isOpenModal} >
                    <h3 style={{marginLeft:'20px'}} >Error</h3>
                    <p style={{marginLeft:'20px'}}>{this.state.modalMessage}</p>
                    <div style={{width:'100%',display:'flex',position:'absolute',bottom:'20px'}}>
                    <PrimaryButton style={{marginLeft:'auto',marginRight:'auto'}} onClick={(e)=>  {e.preventDefault(); this.setState({isOpenModal:false})}}>OK</PrimaryButton>
                    </div>                 
                </Modal>
                {this.state.error?<MessageError message='Bạn không có quyền truy cập' onClose={(e)=>{e.preventDefault(); this.setState({error:false})}}></MessageError>:null}
                {this.state.isSetRole?<NewRole IDs = {this._IDs} url={this.props.url} onClose={(e)=>{e.preventDefault(); this.setState({isSetRole:false}); this.onUpdate()}}></NewRole>:null}
                {this.state.modalOpen?<Newuser url={this.props.url} onClose={(e)=>{e.preventDefault(); this.setState({modalOpen:false})}}></Newuser>:null}
                <div className='navheader'>
                    <div className='leftHeader'>
                        <Label className='headerTitle'>
                            Quản lý người dùng  
                        </Label>
                    </div>
                    <div className="rightHeader">
                    <div className='personaContainer' >                               
                            <div className='personaIcon'>
                                <Icon iconName='UserOptional' style={{color:'white'}}></Icon>
                            </div>
                            <div className='personaDescription'>
                                <div className='header'>
                                    {this.state.user.name}
                                </div>
                                <div className='description'>
                                    {this.state.user.role}
                                </div>
                            </div>
                        </div>
                        <div className='headerButton'  onClick={(e)=>{this.handleLogout(e)}}>
                            <Icon iconName='SignOut' >

                            </Icon>
                            
                        </div>   
                    </div>
                </div>
                <div className='contentContainer'>
                    <div className='contentHeader'>
                        <div style={{paddingLeft:'50px'}}></div>
                        <TextField style={{marginLeft:'0px', marginRight:'auto'}} 
                                    onChange={this.onUserNameTextChange} label="Tên đăng nhập:" 
                                    placeholder='vd: user1' />
                        <div style={{paddingLeft:'20px'}}></div>
                        <TextField label="Tên:" onChange={this.onFirstNameTextChange} placeholder='vd: Văn A' />
                        <div style={{paddingLeft:'20px'}}></div>
                   
                        <PrimaryButton text='Phân quyền'  onClick={(e)=> {e.preventDefault(); this.setState({isSetRole:true})}} style={{margin:'29px 0 0 0', width: '100px'}}>
                            <Icon iconName='Edit'/>
                        </PrimaryButton>  
              
                        <div style={{paddingLeft:'20px'}}></div>
                        {/* <PrimaryButton text='Thêm' href='/#register' style={{margin:'29px 0 0 0', width: '100px'}}>
                            <Icon iconName='Add'/>
                        </PrimaryButton>   */}
                        
                        <PrimaryButton text='Thêm'  onClick={(e)=> {e.preventDefault(); this.setState({modalOpen:true})}} style={{margin:'29px 0 0 0', width: '100px'}}>
                            <Icon iconName='Add'/>
                        </PrimaryButton>  
                        <div style={{paddingLeft:'20px'}}></div>
                        <PrimaryButton text = 'Xóa' onClick={this.onRemoveRow} style={{margin:'29px 0 0 0', width: '100px'}}>
                            <Icon iconName='Delete'/>
                        </PrimaryButton>
                        <div style={{paddingLeft:'20px'}}></div>
                        {/* <PrimaryButton text='Thêm' href='/#register' style={{margin:'29px 0 0 0', width: '100px'}}>
                            <Icon iconName='Add'/>
                        </PrimaryButton>   */}
                        
                   
                    </div>
                    <ScrollablePane className='pane' scrollbarVisibility={ScrollbarVisibility.auto}>
                        <DetailsList
                            selection={this._selection}
                            items={this.state.items}
                            columns={this._columns}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.unconstrained}
                            onRenderDetailsHeader={onRenderDetailsHeader}
                        />
                    </ScrollablePane>
                </div>
            </div>
         );
    }
}
 
export default UserPage;