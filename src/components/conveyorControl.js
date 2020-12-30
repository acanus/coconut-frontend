import React, { Component } from 'react';
import './conveyorControl.scss';
import {withRouter} from 'react-router'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton, PrimaryButton, Stack, IStackTokens,Modal,IconButton } from 'office-ui-fabric-react';
import { Link, Text } from 'office-ui-fabric-react';
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    SelectableOptionMenuItemType,
  } from 'office-ui-fabric-react/lib/index';
import axios from 'axios'
class ConveyorControl extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isload:false
         }
    }
    handleStart(value){
        if (value===1){
            axios.get(this.props.url+'/api/plc/runcv1').then((Response)=>{
                this.setState({isload:false})
            })
            this.setState({isload:true})
        }
        
    }
    handleStop(value){
        if (value===1){
            axios.get(this.props.url+'/api/plc/stopcv1').then((Response)=>{
                this.setState({isload:false})
            })
            this.setState({isload:true})
        }
        
    }
    handleMaintenance(){
        //this.setState({isload:false}) 
        axios.get(this.props.url+'/api/plc/StartMaintenance').then((Response)=>{
            this.setState({isload:false})
        })
         this.setState({isload:true})      
         this.props.history.push('/maintenance')
    }

    handleStartConveyor(e){
        e.preventDefault()
        axios.get(this.props.url+'/api/inspection/continue',{
            headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*"
            }
        })
        
    }
    handleStopConveyor(e){
        e.preventDefault()
        axios.get(this.props.url+'/api/inspection/pause',{
            headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*"
            }
        })
    }

    render() { 
        return ( 
        <Modal isOpen={true}>
            <div className='conveyorBox' >
                <h3 >Điều khiển hệ thống</h3>
                <div style={{marginBottom:'4px'}}>
                    <Stack tokens={{childrenGap:12}} horizontal style={{alignItems:'center'}}>
                        <PrimaryButton  iconProps={{iconName:'Play'}} filled text='Tiếp tục' onClick={(e)=>this.handleStartConveyor(e)} >
                        </PrimaryButton>
                        <PrimaryButton iconProps={{iconName:'Stop'}} text='Tạm dừng' onClick={(e)=>this.handleStopConveyor(e)} ></PrimaryButton>
                    </Stack>
                </div>
                <h3 >Vào chế độ thủ công</h3>      
                <div style={{ display:'flex',justifyContent:'center'}}>
                    <PrimaryButton disabled={!this.props.isAdminManager} style={{marginBottom:'4px'}} onClick={(e)=>{e.preventDefault(); this.handleMaintenance()}}>Chế độ thủ công</PrimaryButton>
                </div>
                <div style={{ display:'flex',justifyContent:'center'}}>
                    <PrimaryButton style={{marginTop:'80px'}} onClick={(e)=>  {e.preventDefault(); this.props.onClose(e)}} >Đóng</PrimaryButton>
                </div>
            </div> 
        </Modal> );
    }
}
 
export default withRouter(ConveyorControl);