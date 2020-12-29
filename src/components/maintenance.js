import React, { Component } from 'react';
import {withRouter} from 'react-router';
import {NavLink} from 'react-router-dom';
import './maintenance.scss';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal } from 'office-ui-fabric-react';
import { Link, Text } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    SelectableOptionMenuItemType,
  } from 'office-ui-fabric-react/lib/index';
import axios from 'axios';

class MaintenancePage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isload:false,
            Cv1IsRun: false,
            CV2IsRun: false,
        }
        this.handleStopMaintenance = this.handleStopMaintenance.bind(this);
    }

    handleStopMaintenance()
    {
        axios.get(this.props.url+'/api/plc/StopMaintenance').then((Response)=>{
            this.setState({isload:false})
        })
        this.setState({isload:true})
        window.history.back();
    }

    handleSelectCV1()
    {
        if (!this.state.Cv1IsRun)
        {
            axios.get(this.props.url+'/api/plc/MaintenanceCV1').then((Response)=>{
                this.setState({Cv1IsRun:true})
            })
        }
        else{
            axios.get(this.props.url+'/api/plc/CancelMaintenanceCV1').then((Response)=>{
                this.setState({Cv1IsRun:false})
            })
        }
        
    }
    handleSelectCV2()
    {
        if (!this.state.Cv2IsRun)
        {
            axios.get(this.props.url+'/api/plc/MaintenanceCV2').then((Response)=>{
                this.setState({Cv2IsRun:true})
            })
        }
        else{
            axios.get(this.props.url+'/api/plc/CancelMaintenanceCV2').then((Response)=>{
                this.setState({Cv2IsRun:false})
            })
        }
    }

    render() { 
        return ( 
            <div className='maintenancecontainer'>

                <div class="bgimage"></div>
                <DefaultButton onClick={(e)=>{e.preventDefault();this. handleStopMaintenance()}} style={{position:'absolute',left:'40px',top:'40px'}} >Quay về</DefaultButton>
                <h2>Coconut counting system</h2>

                <div className='maintenancebox'>
                <h3>Chế độ thủ công</h3>    
                    <div className='buttonbox'>                                
                    <PrimaryButton className={this.state.Cv1IsRun? 'RunStatus' : 'StopStatus'} style={{width:'110px', margin:'4px', alignItems:'center', justifyContent:'center'}} onClick={(e)=>{e.preventDefault();this.handleSelectCV1()}}>Băng tải 1</PrimaryButton>
                    <PrimaryButton className={this.state.Cv2IsRun? 'RunStatus' : 'StopStatus'} style={{width:'110px', margin:'4px', alignItems:'center', justifyContent:'center'}} onClick={(e)=>{e.preventDefault();this.handleSelectCV2()}}>Băng tải 2</PrimaryButton>
                    </div>               
                </div>        
            </div>

         );
    }
}

export default withRouter(MaintenancePage);