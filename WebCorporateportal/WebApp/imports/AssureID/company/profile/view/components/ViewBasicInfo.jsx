import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import CompanyBasicInfo from '/imports/AssureID/company/profile/forms/components/CompanyBasicInfo.jsx';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

export default class ViewBasicInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  componentDidMount(){      
  }

  render(){
    
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-user col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Basic Information</span>
          <i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" title="Edit Information" data-toggle="modal" data-target="#basiccompanyinfoModal"></i>
          <div className="modal fade" id="basiccompanyinfoModal" role="dialog">
            <div className="modal-dialog"> 
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <h4 className="text-center">Edit Basic Information</h4>
                      <br/>
                      <CompanyBasicInfo key={this.props.location._id +'-basicEdit'} basicValues={this.props.location} basicEdit="basicEdit"/>
                    </div>
                  </div> 
                </div>
              </div> 
            </div>
          </div>
        </div>
        <div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
              <h5>Company Name</h5>
              <p>{this.props.location.companyName ? this.props.location.companyName : "--"}</p>
            </div>  
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
              <h5>Website</h5>
              <p>{this.props.location.companyWebsite ? this.props.location.companyWebsite : "--"}</p>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
              <h5>Pan Card Number</h5>
              <p>{this.props.location.companyPanNo ? this.props.location.companyPanNo : "--"}</p>
            </div>  
            
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
            <h5>CIN Number</h5>              
              <p>{this.props.location.companycinNo ? this.props.location.companycinNo : "--"}</p>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
              <h5>Address</h5>              
              <p>{this.props.location.companyAddress ? this.props.location.companyAddress+", " : "--"}&nbsp;</p>
              <p>{this.props.location.companyCity ? this.props.location.companyCity+", " : ""}{this.props.location.companyState ? this.props.location.companyState+", " : ""}&nbsp;</p>
              <p>{this.props.location.companyCountry ? this.props.location.companyCountry : ""}{this.props.location.companyPincode ? " - "+this.props.location.companyPincode : ""}.</p>
            </div>  
          </div>
        </div>
      </div>
    );
  }
}