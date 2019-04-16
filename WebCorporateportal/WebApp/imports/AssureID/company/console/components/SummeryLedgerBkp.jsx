import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
// import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';

class SummaryLedger extends TrackerReact(Component) { 
  render() {
    if (!this.props.loading) { 
      return ( 
        this.props.assureId == "IN-CAA-000001"?
         <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
            <h5 className="text-center"><b>Verification Dashboard</b></h5>
            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
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

                {/* <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryPHeadRule noProfilePadding">Contract Details</p>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryHrRule"></div>
                  <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 noProfilePadding">Max Address / Candidate</div> 
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">: 2</div>
                  <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 noProfilePadding">Max Education / candidate</div> 
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">: 1</div>
                  <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 noProfilePadding">Max Aadhar Card / Candidate</div> 
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">: 1</div>
                </div> */}
              </div>
            </div>
         </div>
         :
            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
                <h5 className="text-center"><b>Verification Dashboard</b></h5>
                {this.props.services.length > 0 ?
                  this.props.contract ?
                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryDivRule">
                            <div className="col-lg-8 col-md-8 col-sm-10 col-xs-10">Total Cases Received</div> 
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">: {this.props.totalCorporateOrders}</div>
                            <div className="col-lg-8 col-md-8 col-sm-10 col-xs-10">Total Checks Received</div> 
                            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">: {this.props.totalChecksReceived}</div>
                        </div>                
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryPHeadRule noProfilePadding">Checks Details</p>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 summaryHrRule"></div>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Completed Checks</div> 
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: {this.props.completedChecks ? this.props.completedChecks : 0 }</div>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Pending Checks</div> 
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: {this.props.pendingChecks ? this.props.pendingChecks : 0}</div>
                            <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 noProfilePadding">Insufficiency Checks</div> 
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: {this.props.insufficiencyChecks ? this.props.insufficiencyChecks : 0}</div>
                            
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
        <span>Loading</span>
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

  // const corporateHandle = Meteor.subscribe('matchedCorporateOrder',companyDetails._id,contract.contractId);
  const corporateHandle = Meteor.subscribe('matchedCorporateOrderDetails',assureId);
  const loading         = !corporateHandle.ready();  
  // var corporateOrders   = CorporateOrders.find({"companyDetails.companyId" : companyDetails._id, "companyDetails.contractId" : contract.contractId}).fetch();
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


  var totalCases          = 0;
  var completedCases      = 0;
  var pendingCases        = 0;
  var InsufficienyCases   = 0;

  var totalChecks          = 0;
  var completedChecks      = 0;
  var pendingChecks        = 0;
  var InsufficienyChecks   = 0;

  if(corporateOrders){
    corporateOrders.map((corpData,index)=>{
      totalCases += corpData.totalCandidateNumber;
       
    })
  }


  // if(corporateOrders){
  //   totalCorporateOrders = corporateOrders.length;
  //   corporateOrders.map((corpData , index)=>{
  //     totalChecksReceived+= corpData.totalCandidateNumber;
  //     if(corpData.orderDetails){
  //       if(corpData.orderDetails.length>0){
  //         corpData.orderDetails.map((corpDetails,i)=>{
  //           if(corpDetails.status == "Completed"){
  //             completedChecks++;
  //           }
  //           if(corpDetails.rejectedTickets){
  //             if(corpDetails.rejectedTickets.length > 0 ){
  //               insufficiencyChecks++;
  //             }
  //           }
  //         });
          
  //       }
  //     }
  //   });
  //   pendingChecks = totalChecksReceived - completedChecks;
  // }

  
  return {
    loading,
    // totalOrders,
    // serviceCaseDetails,
    // totalNoofCases,
    // totalnumberofCandidates,
    totalCorporateOrders,
    totalChecksReceived,
    completedChecks,
    insufficiencyChecks,
    pendingChecks,
    assureId
  };
})(SummaryLedger);
export default CompanyConsoleContainer;
