import React from 'react'
import {Modal, PrimaryButton} from '@fluentui/react'
import {withRouter} from 'react-router';
class MessageError extends React.Component {
    constructor(props) {
        super(props);
         }
    render() {
        return(
            <Modal isOpen={true} >
                <h3 style={{marginLeft:'20px'}} >Error</h3>
                <p style={{margin:'20px',justifySelf:'center'}}>{this.props.message}</p>
                <div style={{width:'100%',display:'flex',position:'absolute',bottom:'20px'}}>
                <PrimaryButton style={{marginLeft:'auto',marginRight:'auto'}} onClick={(e)=>  {e.preventDefault(); this.setState({modalOpen:false});this.props.history.push('/login')}}>OK</PrimaryButton>
                </div>
            </Modal>
        )
    }
}
export default withRouter(MessageError) 