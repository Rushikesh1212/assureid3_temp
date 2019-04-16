import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';

export default class AgreementTable extends TrackerReact(Component) {
    constructor(props){
        super(props);   
         
        if(this.props.dataDetails){
            this.state={
                'serviceRate': this.props.dataDetails.serviceRate,
                'newTATDays' : this.props.dataDetails.dayNumbers,
                'name': this.props.dataDetails.Name,
                'type': this.props.dataDetails.type,
                '_id' : this.props.dataDetails._id,
                'serviceCount' : this.props.dataDetails.serviceCount,
                'checked'  : this.props.dataDetails.checked
            };
        }else{
            this.state={
                'serviceRate': "",
                'newTATDays' : "",
                'name': "",
                'type': "",
                '_id' : "",
                'serviceCount':"0",
                'checked': false
            };
        }
        // console.log("this.props.dataDetails :",this.props.dataDetails);



    }
   
    handleChangeForServices(event){
        const target = event.target;
        const value  = target.type === 'checkbox' ? target.checked : target.value;
        const name   = target.name;
        this.props.dataDetails.checked = value;
    
        this.setState({
         [name]: event.target.value,
        });
      }
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const value  = target.value;
        const name   = target.name;
    
        this.setState({
        [name]: event.target.value,
        });
    }
    
    render(){
        // console.log("this.props.dataDetails :",this.props.dataDetails);
        return(
        <tr key={this.props.indexValue+'AgreementTableList'}>
        {/* <td><input type="checkbox" ref="serviceLevelCheckbox" name="serviceLevelCheckbox" id={"serviceLevelCheckbox-"+index} data-type={agreement.type} data-name={agreement.Name} data-number={agreement.dayNumbers} className="serviceLevelCheckbox" value={agreement._id} /></td> */}

        <td className="col-lg-1 col-md-1 col-sm-1 col-xs-1"><input type="checkbox" ref="serviceLevelCheckbox" name="serviceLevelCheckbox" id={"serviceLevelCheckbox-"+this.props.indexValue} data-type={this.state.type} data-name={this.state.name} data-number={this.state.newTATDays} value = {this.props.dataDetails._id} data-servicecount={this.state.serviceCount} className="serviceLevelCheckbox" checked={this.props.dataDetails.checked} data-servicerequired={this.props.dataDetails.serviceRequired} onChange={this.handleChangeForServices.bind(this)}/></td>
        <td className="col-lg-3 col-md-3 col-sm-3 col-xs-3 serviceNameStyle">{this.state.name}</td>
        {/* <td>{agreement.TAT} Days</td> */}
        {/* <td><input type="text" name="serviceRate" ref="serviceRate"  id={"serviceRate-"+index} value={agreement.serviceRate} onChange={this.handleChange.bind(this)}/></td> */}
        <td className="col-lg-2"><input type="text" className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-sm-12 col-xs-12 commoninputstyle"   name="serviceRate" ref="serviceRate"  id={"serviceRate-"+this.props.indexValue} value={this.state.serviceRate} onChange={this.handleChange.bind(this)}/></td>                                                                                                                                         
        <td className="col-lg-2"><input type="number" className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-sm-12 col-xs-12 commoninputstyle" name="newTATDays" ref="newTATDays" min="0"  id={"newTATDays-"+this.props.indexValue} value={this.state.newTATDays} onChange={this.handleChange.bind(this)}/></td>
        <td className="col-lg-2"><input type="number" className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-sm-12 col-xs-12 commoninputstyle" name="serviceCount" ref="serviceCount" min="0"  id={"serviceCount-"+this.props.indexValue} value={this.state.serviceCount} onChange={this.handleChange.bind(this)}/></td>                                                                                                                                         
        
        </tr>
        
        );
    }
    
}