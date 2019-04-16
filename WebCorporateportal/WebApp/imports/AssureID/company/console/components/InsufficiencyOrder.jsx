import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { CorporateOrders } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
class InsufficiencyOrder extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
   
    this.state = {
      "subscription"  : {
      }  
    }; 
  }
	render() {
    if(!this.props.loading) {
      return ( 
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding prZero landingBlocks placeholderVerBlock">
          <h5 className="text-center"><b>Insufficiency Order</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
            {this.props.insufficiencyOrders.length > 0 ? 
              this.props.insufficiencyOrders.map((insufficiencyOrders,index)=>{
                return(
                  <div key={index}>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
                      <div className="col-lg-2 col-md-2 col-sm-2 col-xs-1 noProfilePadding">
                        <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/error_warning_alert_attention-512.png" className="order_error"/>
                      </div>
                      <div className="col-lg-10 col-md-10 col-sm-8 col-xs-8">
                        <p>Order No. : {insufficiencyOrders.orderNumber}</p>
                        <p>Number of Candidates: {insufficiencyOrders.numberOfCandidate}</p>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-2 col-xs-3 noProfilePadding text-right">
                        <a href={"/ledger/"+this.props.assureId}>View Order</a>
                      </div>  
                    </div>
                    <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
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
            }              
          </div>
        </div>
      );
    }else{
      return(
        <span>Loading</span>
      );
    }
  }
}
InsufficiencyOrderContainer = withTracker(props => {
  var assureId        = FlowRouter.getParam('assureid'); 
  var companyDetails = props.companyDetails;
  var services       = props.services;
  var contract       = props.contract;

  var serviceCaseDetails = [];
  var insufficiencyOrders = [];
  const corporateHandle = Meteor.subscribe('matchedCorporateOrder',companyDetails._id,contract.contractId);
  const loading         = !corporateHandle.ready();  
  if(companyDetails.companyAssureID == 'IN-CAA-000001'){
    var insufficiencyOrders = [
      {
        orderNumber : 2,
        numberOfCandidate : 1,
      },
      {
        orderNumber : 5,
        numberOfCandidate : 2,
      },
    ];
  }else{
    var corporateOrders   = CorporateOrders.find({"companyDetails.companyId" : companyDetails._id, "companyDetails.contractId" : contract.contractId}).fetch();
    var corporateOrdersOrder = [];

    if (corporateOrders) {    
      corporateOrders.map((corporateOrders,ind)=>{
        if(corporateOrders.orderDetails){
          corporateOrders.orderDetails.map((orderDetails,i)=>{
             corporateOrdersOrder.push(orderDetails);
          })
        }
      })
    }
    if (corporateOrdersOrder.length > 0) {
      corporateOrdersOrder.map((corporateOrdersOrder,i)=>{
        if (corporateOrdersOrder.rejectedTickets) {
          if (corporateOrdersOrder.rejectedTickets.length > 0) {
            insufficiencyOrders.push(corporateOrdersOrder);
          }
        }
      })
    }
  }
  return {
    loading,
    assureId,
    insufficiencyOrders
  };
})(InsufficiencyOrder);
export default InsufficiencyOrderContainer;