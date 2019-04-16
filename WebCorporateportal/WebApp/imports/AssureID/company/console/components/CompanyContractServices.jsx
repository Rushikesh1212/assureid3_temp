import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';

export default class CompanyContractServices extends TrackerReact(Component) {
	render() {
      return (
        <div className="col-lg-12 col-md-12 col-sm-4 col-xs-12 outerpaddingForMobile">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 newsVerBlock noProfilePadding landingBlocks text-center">
            <h5><b>List of Services</b></h5>
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding contractservicesWrapper">
                  {this.props.services ? 
                    this.props.services.length > 0 ?
                      this.props.services.map((service,index)=>{
                        return(
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 consoleServiceBlock" key={index}>
                               <div className="col-lg-3 col-md-2 col-sm-2 col-xs-2 pull-left noProfilePadding">
                                   <img src={service.image} className="profileStatusServiceImage"/>
                                </div>
                                <div className="col-lg-9 col-md-10 col-sm-10 col-xs-10 text-left">
                                  <span className="consoleServiceName">{service.serviceName}</span>
                                </div> 
                            </div>
                         );
                      })
                    :
                    <div> 
                      {/* <p className="text-center">No data found!</p> */}
                      <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 loadingImg">
                          <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
                      </div>
                    </div>
                    :
                    <div>
                      <p className="text-center">No data found!</p>
                    </div>
                  }      
              </div>     
          </div>
        </div>
      );   
  }
}