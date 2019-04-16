import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import VerificationDashboard from '/imports/AssureID/company/console/components/VerificationDashboard.jsx';

class ServiceStatistics extends TrackerReact(Component){ 
    render(){
        return(
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 masterWrap">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 plateBlock noLRPad">
                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad">
                        <i className="verifDashIcon iconColor fa fa-tasks" aria-hidden="true"></i>
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6 serviceHead">
                        <label>{this.props.serviceStatistics.serviceName ? this.props.serviceStatistics.serviceName : "Service Name"}</label><br/>
                        <label>{this.props.serviceStatistics.totalChecks ? this.props.serviceStatistics.totalChecks : 0}</label>
                    </div>
                </div>
                <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                    <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 leftColorBox">
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <label>WIP</label>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                        <label>{this.props.serviceStatistics.wip ? this.props.serviceStatistics.wip : 0}</label>
                    </div>
                </div>

                <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                    <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 completedBg">
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <label>Completed</label>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                        <label>{this.props.serviceStatistics.completed ? this.props.serviceStatistics.completed : 0}</label>
                    </div>
                </div>

                <div className="col-lg-1 col-lg-offset-1 col-md-3 col-sm-6 col-xs-6 innerLine1"></div>
                <div className="col-lg-1 col-lg-offset-6 col-md-3 col-sm-6 col-xs-6 innerLine2 pull-right noLRPad"></div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 statusStatistics">
                    <div className="col-lg-2 col-md-2 col-xs-4 col-sm-4 insifficiencyBg">
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <label>Insufficiency</label>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 noLRPad pull-right textCenter">
                        <label>{this.props.serviceStatistics.insuff ? this.props.serviceStatistics.insuff : 0}</label>
                    </div>
                </div>
            </div>
        )
    }
    
}ServiceStatisticsContainer = withTracker(props => {
    var serviceStatistics = props.checkdetailsdata;
    // console.log('serviceStatistics============: ', serviceStatistics);
    return{
        serviceStatistics
    }
  
})(ServiceStatistics);
export default ServiceStatisticsContainer;
