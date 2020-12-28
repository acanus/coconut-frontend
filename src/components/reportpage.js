import React from 'react'
import {ComboBox,Dropdown,Label,PrimaryButton, DatePicker, DayOfWeek, IDatePickerStrings,Icon, SearchBox,DefaultButton} from '@fluentui/react';
import './reportpage.scss'
import {DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, Selection, ConstrainMode, IDetailsFooterProps, DetailsRow,} from 'office-ui-fabric-react/lib/DetailsList';
import { IRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IDetailsColumnRenderTooltipProps } from 'office-ui-fabric-react/lib/DetailsList';
import onRenderDetailsHeader from './renderheader'
import axios from 'axios'
import moment from 'moment'
import myStore from './myStore'

const DayPickerStrings = {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December',],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    goToToday: 'Go to today',
    prevMonthAriaLabel: 'Go to previous month',
    nextMonthAriaLabel: 'Go to next month',
    prevYearAriaLabel: 'Go to previous year',
    nextYearAriaLabel: 'Go to next year',
    closeButtonAriaLabel: 'Close date picker',
    monthPickerHeaderAriaLabel: '{0}, select to change the year',
    yearPickerHeaderAriaLabel: '{0}, select to change the month',
    isRequiredErrorMessage: 'Start date is required.',
    invalidInputErrorMessage: 'Invalid date format.',
  };
const controlClass = mergeStyleSets({
control: {
    margin: '0 0 15px 0',
    maxWidth: '300px',
},
});
const firstDayOfWeek = DayOfWeek.Sunday;
const desc = 'This field is required. One of the support input formats is year dash month dash day.';
const classNames = mergeStyleSets({
    table: {
      margin: 'auto',
    }
  });
const auth = 'bearer '+Object.values(myStore.state).join('')

class ReportPage extends React.Component{
    constructor(){
        super()
        this.state = {  
            searchStartTime: '',
            searchEndTime: '',
            searchType:"All",
            searchWhat:"",
            enableImportReport:false,
            items:[{ 
                ID: null,
                WarehouseUser: [],
                BuyerUser: [],
                ConveyorID: null,
                Standard: "",
                CoconutType: "",
                WarehouseLocation: "",
                Region: "",
                ImportCode: "",
                Transporter: ""          
            }], 
            items2:[],
        }
        this.onSearchBox=this.onSearchBox.bind(this)
        this.onChangeDropdown=this.onChangeDropdown.bind(this)
        this.onSelectDateBegin=this.onSelectDateBegin.bind(this)
        this.onSelectDateEnd=this.onSelectDateEnd.bind(this)

        this._selection = new Selection({
            onSelectionChanged: () => {
                if (this._selection.getSelectedCount()>0){
                        this.setState({enableImportReport:true})
                } else {
                    this.setState({enableImportReport:false})
                }
                const data = []
                const items = this._selection.getSelection()
                const ImportID = items.map(item=>{return(item.ID)})
                var id
                for (id in ImportID){
                    axios.get(this.props.url+'/api/data/getTransportSessionbyImportID',{headers:{'Authorization': auth}, params: {ImportID: ImportID[id]}}).then(res=>{
                        data.push.apply(data,res.data)    
                    })
                    
                }
                this.setState({items2:data})
           
                
            },
          });
        
        this._columns = [
            { key: 'column9', name: 'UID', fieldName: 'ID', minWidth: 30,  isResizable: true ,maxWidth:80},
            { key: 'column0', name: 'Mã lô dừa', fieldName: 'ImportCode', minWidth: 80,  isResizable: true },
            { key: 'column1', name: 'Tiêu chuẩn', fieldName: 'Standard', minWidth: 100,  isResizable: true },
            { key: 'column2', name: 'Nhân viên thu mua', fieldName: 'BuyerUser', minWidth: 140,  isResizable: true },
            { key: 'column3', name: 'Nhân viên thủ kho', fieldName: 'WarehouseUser', minWidth: 140,  isResizable: true },
            { key: 'column4', name: 'Loại dừa', fieldName: 'CoconutType', minWidth: 80, isResizable: true },
            { key: 'column5', name: 'Vùng thu mua', fieldName: 'Region', minWidth: 100,  isResizable: true },
            { key: 'column6', name: 'Đơn vị vận chuyển', fieldName: 'Transporter', minWidth: 140,  isResizable: true },
            { key: 'column7', name: 'Vị trí lưu kho', fieldName: 'WarehouseLocation', minWidth: 140,  isResizable: true },
            { key: 'column8', name: 'Băng tải lên dừa', fieldName: 'ConveyorID', minWidth: 140,  isResizable: true },
            { key: 'column10', name: 'Thời điểm bắt đầu', fieldName: 'Date', minWidth: 140, maxWidth:160, isResizable: true },
        ];
        this._columns2 = [

            { key: 'column0', name: 'Mã lô dừa', fieldName: 'ImportCode', minWidth: 80, maxWidth: 100, isResizable: true },
            { key: 'column1', name: 'Lượt vận chuyển', fieldName: 'TransportID', minWidth: 120, maxWidth: 140, isResizable: true },
            { key: 'column2', name: 'Khối lượng', fieldName: 'Weight', minWidth: 100, maxWidth: 120, isResizable: true },
            { key: 'column3', name: 'Số lượng', fieldName: 'Count', minWidth: 100, maxWidth: 120, isResizable: true },
            { key: 'column4', name: 'Thời gian bắt đầu', fieldName: 'StartTime', minWidth: 140, maxWidth: 160, isResizable: true },
            { key: 'column5', name: 'Thời gian kết thúc', fieldName: 'EndTime', minWidth: 140, maxWidth: 160, isResizable: true },
        ];
        
    }
    onSelectDateBegin(dateBegin){
        dateBegin = moment(dateBegin).format("YYYY-MM-DDTHH:MM:SS.SSS")
        console.log(dateBegin)
        this.setState({searchStartTime: dateBegin})
        console.log('State', this.state)
    }
    onSelectDateEnd(dateEnd){
        dateEnd = moment(dateEnd).format("YYYY-MM-DDTHH:MM:SS.SSS")
        console.log(dateEnd)
        this.setState({searchEndTime: dateEnd})
        console.log('State1', this.state)
    }
    onSearchBox(_,text){
        if (text==""){
            axios.get(this.props.url+'/api/data/get10daysimportsessions',{headers:{'Authorization': auth}}).then(res=>{
              this.setState({items:res.data})
            })
        } else {
            axios.get(this.props.url+'/api/data/getsearchbyname', 
                {headers:{'Authorization': auth},params: {searchType: this.state.searchType, searchWhat: text, searchStartTime: this.state.searchStartTime, searchEndTime: this.state.searchEndTime}}).then(res=>
                this.setState({items:res.data})
            )
        }
            
    }
    onChangeDropdown(_,option){
        return(
            this.setState({searchType:option.key})

        )
    }
    
    options = [
        { key: 'All', text: 'Tất cả' },
        { key: 'Standard', text: 'Tiêu chuẩn' },
        { key: 'BuyerUser', text: 'Nhân viên thu mua' },
        { key: 'WarehouseUser', text: 'Nhân viên thủ kho' },
        { key: 'CoconutType', text: 'Loại dừa' },
        { key: 'Region', text: 'Vùng thu mua' },
        { key: 'ImportCode', text: 'Mã lô dừa' },
        { key: 'Transporter', text: 'Đơn vị vận chuyển' },
        { key: 'WarehouseLocation', text: 'Vị trí lưu kho'},
      ];
    componentDidMount(){
        
        // console.log(auth)
        this.setState({searchEndTime: moment(Date.now()).add(1,'days').format("YYYY-MM-DDTHH:MM:00.000")})
        this.setState({searchStartTime: moment(Date.now()).subtract(10, 'days').format("YYYY-MM-DDTHH:MM:00.000")})
        axios.get('http://localhost:9000/api/data/get10daysimportsessions',{headers:{'Authorization': auth}}).then(res=>{
            this.setState({items:res.data})
            // console.log(this.state.items)
        })
      }
      handleImportExportPDF(){
        window.ipcRenderer.send('openpdf',{url:this.props.url+'/api/report/GetImportReportpdf?id='+this._selection.getSelection()[0].ID,title:'Báo cáo nhập hàng'})
        // axios.get(this.props.url+'/api/report/GetImportReportpdf?id=1',
        // {
        //     responseType:'blob'
        // }
        // ).then(response=>{
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', 'file.pdf'); //or any other extension
        //     document.body.appendChild(link);
        //     link.click();
          
        // })
      }
    render(){
        return(
            <div className='reportpage'>
                <div className='navheader'>
                    <div className="leftHeader">
                        <Label className='headerTitle'>
                           Tìm kiếm
                        </Label>
                        <ComboBox
                            className='dropdown'
                            defaultSelectedKey='ngaynhapkho'
                            // dropdownWidth={170}
                             borderless={true}                            
                            // selectedKey={this.state._columns}
                            // eslint-disable-next-line react/jsx-no-bind
                            onChange={this.onChangeDropdown}
                            placeholder="Tất cả"
                            options={this.options}
                            
                        />
                        <SearchBox className='searchBox' placeholder="Tìm kiếm" onChange={this.onSearchBox}/>
                    </div>
                    <div className='centerHeader'>
                        <DatePicker
                            className='date'
                            isRequired={false}
                            // borderless={true}
                            allowTextInput={true}
                            ariaLabel={desc}
                            firstDayOfWeek={firstDayOfWeek}
                            strings={DayPickerStrings}
                            placeholder='Từ ngày'
                            // value={value}
                            // eslint-disable-next-line react/jsx-no-bind
                            onSelectDate={this.onSelectDateBegin}
                            
                        />
                        <div style={{paddingLeft:'8px'}}></div>
                        <DatePicker
                            className='date'
                            isRequired={false}
                            // borderless={true}
                            allowTextInput={true}
                            ariaLabel={desc}
                            firstDayOfWeek={firstDayOfWeek}
                            strings={DayPickerStrings}
                            placeholder='Đến ngày'
                            // value={value}
                            // eslint-disable-next-line react/jsx-no-bind
                            onSelectDate={this.onSelectDateEnd}
                            
                        />
                        
                    </div>
                    <div className='rightHeader'>
                        <PrimaryButton className='headerButtonText' text="Xuất báo cáo tháng" />
                        <PrimaryButton className='headerButtonText' text="Xuất báo cáo theo User" />
                      
                    </div>
                </div>
                <div className="contentContainer">
                    <div style={{width:'100%', display:'flex',flexDirection:'row',alignItems:'center',marginRight:'20px'}}>
                        <Label className='textContent'>Lượt nhập hàng</Label>
                        <DefaultButton style={{marginRight:'0px',marginLeft:'auto'}} disabled={!this.state.enableImportReport} text="Xuất báo cáo"  onClick={(e)=>{e.preventDefault();
                            this.handleImportExportPDF();
                        }}/>
                    </div>
                   
                    <ScrollablePane className='pane' scrollbarVisibility={ScrollbarVisibility.auto}>
                        <DetailsList selection={this._selection}
                            items={this.state.items.map((value,index)=>{
                                return {
                                    ID:value.ID,
                                    ImportCode:value.ImportCode,
                                    Standard:value.Standard,
                                    BuyerUser:value.BuyerUser.Name,
                                    WarehouseUser:value.WarehouseUser.Name,
                                    CoconutType:value.CoconutType,
                                    Region:value.Region,
                                    Transporter:value.Transporter,
                                    WarehouseLocation:value.WarehouseLocation,
                                    ConveyorID:value.ConveyorID==0?'Băng tải 2':'Cả hai băng tải'

                                }
                            })}
                            columns={this._columns}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.unconstrained}
                            onRenderDetailsHeader={onRenderDetailsHeader}
                            onActiveItemChanged={this.onActiveItemChanged}
                        />
                    </ScrollablePane>
                    <div style={{width:'100%',height:'1px',backgroundColor:'#c5c5c5', marginTop:'10px'}}></div>
                    <Label className='textContent'>Chi tiết lượt nhập hàng</Label>
                    <ScrollablePane className='pane' scrollbarVisibility={ScrollbarVisibility.auto}>
                        <DetailsList
                            items={this.state.items2}
                            columns={this._columns2}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.unconstrained}
                            onRenderDetailsHeader={onRenderDetailsHeader}
                        />
                    </ScrollablePane>
                    {/* <Label className='textContent'>Hiển thị báo cáo chi tiết từng lô nguyên liệu</Label>
                    <ScrollablePane className='pane' scrollbarVisibility={ScrollbarVisibility.auto}>
                        <DetailsList
                            items={this.state.items2}
                            columns={this._columns2}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.unconstrained}
                            onRenderDetailsHeader={onRenderDetailsHeader}
                        />
                    </ScrollablePane> */}
                </div>
            </div>                    
                
        )
    }
}

export default ReportPage