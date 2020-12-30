import logo from './logo.svg';
import './App.css';
import MainPage from  './components/mainpage.js'
import LoginPage from  './components/loginpage.js'
import ReportPage from './components/reportpage.js'
import UserPage from './components/userpage.js'
import DiscoveryPage from './components/discoverypage.js'
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import {
  Redirect,
  HashRouter,
  Route,
  Switch
} from "react-router-dom";
import RegisterPage from './components/registerpage';
import MaintenancePage from './components/maintenance';
import axios from 'axios';
import React, { Component } from 'react';

const Store = window.require('electron-store');
const store = new Store();
const loadedDevice= store.get('deviceList');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipaddress:'localhost',
      showdiscovery:false, 
      listDevice:[]
     }
    this.routeref=React.createRef();
  }
  componentDidMount(){
    window.ipcRenderer.on('show-discovery',()=>{
      this.setState({showdiscovery:true})
    })
    window.ipcRenderer.on('message',(event,args)=>{
      console.log(args)
      this.routeref.current.history.push(args)
      
   })
  }
   handleAddDevice(devices){
    devices.forEach(element => {
      if(this.state.listDevice.some(item=>item.ip===element.ip)){

      }else{
         this.setState( prestate =>({ listDevice:([...prestate.listDevice,element])}))
      }
   });
  
  
}
  render() { 
    return ( 
      <div>
        {this.state.showdiscovery?
        <Modal isOpen={true}>
            <DiscoveryPage onAddDevice={(devices)=>this.handleAddDevice(devices)} onclose={()=>{this.setState({showdiscovery:false})}}></DiscoveryPage>
        </Modal>:null}
        <HashRouter ref={this.routeref}>
          <Switch>
            <Route exact   path="/" render={(props) => <MainPage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>       
            </Route>
            <Route   path="/login"  render={(props) => <LoginPage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>
            </Route>
            <Route   path="/register"  render={(props) => <RegisterPage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>
            </Route>
            <Route   path="/report"  render={(props) => <ReportPage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>
            </Route>
            <Route   path="/user" render={(props) => <UserPage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>
            </Route>
            <Route   path="/maintenance" render={(props) => <MaintenancePage url={'http://'+this.state.ipaddress+':9000'} {...props}/>}>
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;
