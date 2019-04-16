import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';

class SummaryLedger extends TrackerReact(Component) { 
    moveToRequest(event){
		event.preventDefault();
		var assureid = this.props.companyDetails.companyAssureID; 
    // FlowRouter.go('/companynewRequest/'+assureid);
    FlowRouter.go('/companynewRequest/company/'+assureid);

	}
  render() {
    if (!this.props.loading) { 
      return ( 
        this.props.assureId == "IN-CAA-000001"?
            <div className="col-lg-12 col-md-12 col-sm-8 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
            <h5 className="text-center"><b>Verification Dashboard</b></h5>
            {/* <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryDivRule">
                <div className="col-lg-8 col-md-8 col-sm-10 col-xs-10">Total Cases Received</div> 
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">: 10</div>
                <div className="col-lg-8 col-md-8 col-sm-10 col-xs-10">Total Checks Received</div> 
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">: 48</div>
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                  <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryPHeadRule noProfilePadding">Checks Details</p>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryHrRule"></div>
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Total Cases</div> 
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: 124</div>
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Address Verification</div> 
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: 40</div>
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Education Verification</div> 
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: 59</div>
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Aadhar Card Verification</div> 
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: 25</div>
                </div>

              </div>
            </div> */}
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <p className="summaryPHeadRule noProfilePadding">Case Details</p>
                      <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 innerblock noLRPad">
                          <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                              <i className="fa fa-ticket iconStyle bg-darkblue" aria-hidden="true"></i>
                          </span>
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                                  <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Total Cases</span>
                                  <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp;10</span>
                              </div>
                          </div>
                      </div>
 
                      {/* Case Details Block */}
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad Bg-success">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Completed</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; 48</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-8 col-xs-8 noLRPad Bg-warning">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext ">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Pending</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; 10</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                    <i className="fa fa-ticket iconStyle Bg-danger" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Insufficiency</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; 20</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
            </div>  
             </div>
         :
            <div className="col-lg-12 col-md-12 col-sm-8 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
                <div className="dashboardHead">
                    <h5 className="col-lg-3 col-md-3 col-sm-6 col-xs-12 pull-left"><b>Verification Dashboard</b></h5>
                    {
                        this.props.services && this.props.contractstatus && this.props.services.length ?
                            <button className="btn newReqButton btn-default pull-right" onClick={this.moveToRequest.bind(this)}> New Request</button>
                        :

                        this.props.services.length <= 0 && this.props.contractstatus == "Inactive" ?
                        <button className="btn newReqButton btn-default pull-right" title="No Contract availabel in this date" disabled> New Request</button>
                        :
                        <button className="btn newReqButton btn-default pull-right" title="Please add contract" disabled> New Request</button>
                    }
                </div>
                {this.props.services.length > 0 ?
                  this.props.contract ?
                  <div>
                    {/* ==========Case Block=============*/}
                    
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <p className="summaryPHeadRule noProfilePadding">Case Details</p>
                      <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12 innerblock noLRPad">
                          <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                              <i className="fa fa-ticket iconStyle bg-darkblue" aria-hidden="true"></i>
                          </span>
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totalcasetext ">
                                  <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad"> &nbsp; &nbsp; Total Cases</span>
                                  <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; {this.props.totalCorporateOrders ? this.props.totalCorporateOrders : 0}</span>
                              </div>
                          </div>
                      </div>

                      {/* Case Details Block */}
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad Bg-success">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Completed</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; {this.props.completedCheckst ? this.props.completedCheckst : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-8 col-xs-8 noLRPad Bg-warning">
                                    <i className="fa fa-ticket iconStyle" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext ">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Pending</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; {this.props.pendingChecks ? this.props.pendingChecks : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerblock noLRPad">
                                <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                    <i className="fa fa-ticket iconStyle Bg-danger" aria-hidden="true"></i>
                                </span>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noLRPad">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innerboxtext">
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> &nbsp; &nbsp; Insufficiency</span>
                                        <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 totStatics">&nbsp; &nbsp; {this.props.insufficiencyChecks ? this.props.insufficiencyChecks : 0}</span>
                                    </div>                                  
                                </div>
                            </div>
                        </div>
                    </div>  
                  </div>
                  :
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
                     <p className="text-center contactAdminMsg">Please contact admin for further processing..</p>
                   </div>
                 :
                   <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
                     <p className="text-center contactAdminMsg">Please contact admin for further processing.</p>
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
  var currentLocation = FlowRouter.current().path;
  var splitUrl        = currentLocation.split('/');
  var assureId        = splitUrl[2]; 

  var companyDetails = props.companyDetails;
  var services       = props.services;
  var contract       = props.contract;
  var contractstatus = props.contractstatus

  const corporateHandle = Meteor.subscribe('matchedCorporateOrderDetails',assureId);
  const loading         = !corporateHandle.ready();  
  var corporateOrders   = CorporateOrders.find({"companyDetails.companyAssureID" : assureId}).fetch();


  var serviceCaseDetails =  [];
  var corporateOrdersOrder = [];
  var totalCorporateOrders = 0;
  var totalChecksReceived  = 0;
  var completedChecks      = 0; 
  var insufficiencyChecks  = 0;
  var pendingChecks        = 0;
  var totalNoofCases = 0;
  var totalnumberofCandidates = 0;

  if(corporateOrders){
    totalCorporateOrders = corporateOrders.length;
    corporateOrders.map((corpData , index)=>{
      totalChecksReceived+= corpData.totalCandidateNumber;
      if(corpData.orderDetails){
        if(corpData.orderDetails.length>0){
          corpData.orderDetails.map((corpDetails,i)=>{
            if(corpDetails.status == "Completed"){
              completedChecks++;
            }
            if(corpDetails.rejectedTickets){
              if(corpDetails.rejectedTickets.length > 0 ){
                insufficiencyChecks++;
              }
            }
          });
          
        }
      }
    });
    pendingChecks = totalChecksReceived - completedChecks;
  }
  return {
    loading,
    totalCorporateOrders,
    totalChecksReceived,
    completedChecks,
    insufficiencyChecks,
    pendingChecks,
    assureId,
    companyDetails,
    services,
    contract,
    contractstatus
  };
})(SummaryLedger);
export default CompanyConsoleContainer;
