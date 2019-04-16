import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react'; 
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';

class SummaryLedger extends TrackerReact(Component) { 
   
  render() {
    if (this.props.allorders ) { 
      return ( 
            <div className="col-lg-12 col-md-12 col-sm-8 col-xs-12 noLRPad ">
                {this.props.services.length > 0 ?
                  <div>
                    {/* ==========Case Block=============*/}
                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                       <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                            <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                <i className="fa fa-ticket iconStyle bg-darkblue" aria-hidden="true"></i>
                            </span>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Total Checks</b></span>
                                    <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp;{this.props.totalOrders ? this.props.totalOrders : 0}</span>
                                </div>
                            </div>
                          </div>
                        </div> 
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad Bg-success">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Completed</b></span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; {this.props.completedOrder ? this.props.completedOrder : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad Bg-warning">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"> <b> Pending</b></span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp;  {this.props.pendingOrders ? this.props.pendingOrders : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                         <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 casesinnerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                    <i className="fa fa-ticket iconStyle Bg-danger" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><b> Insufficiency</b></span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center totStatics">&nbsp; &nbsp; {this.props.insufficiencyOrder ? this.props.insufficiencyOrder : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                    </div>  
                  </div>
                  :
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
                     <p className="text-center contactAdminMsg">No data available..</p>
                   </div>
                
                }   
            </div>  
      );  
    }else{
      return(
        <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 loadingImg">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
        </div>
      );
    } 
  }
}
CompanyConsoleContainer = withTracker(props => {

  var services          = props.services;
  var allorders         = props.orderList;


  var totalOrders            = 0;
  var totalChecksReceived    = 0; 
  var completedOrder         = 0; 
  var insufficiencyOrder     = 0;
  var pendingOrders          = 0;

  if(allorders){
    totalOrders = allorders.length;
    allorders.map((orders , index)=>{
      if (orders.orderStatus == "Completed") {      
        completedOrder++;
      }
      if (orders.orderStatus == "Insufficiency") {
        insufficiencyOrder++;
      }
    });
    pendingOrders = totalOrders - completedOrder - insufficiencyOrder;
  }
  return {
    allorders,
    totalOrders,
    completedOrder,
    pendingOrders,
    insufficiencyOrder,
    services,
  };
})(SummaryLedger);
export default CompanyConsoleContainer;
