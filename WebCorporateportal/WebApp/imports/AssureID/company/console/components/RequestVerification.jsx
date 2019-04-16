import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {CorporateOrders} from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';

class RequestVerification extends TrackerReact(Component) {
	moveToRequest(event){
		event.preventDefault();
		var assureid = this.props.companyDetails.companyAssureID; 
    // FlowRouter.go('/companynewRequest/'+assureid);
    FlowRouter.go('/companynewRequest/company/'+assureid);

	}
	render() {

     if(this.props.services && this.props.contractstatus && this.props.services.length > 0){
      return (
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 verSerBlock landingBlocks noProfilePadding outerpaddingForMobile">
            <h5 className="text-center reqVerifTitle col-lg-12 col-md-12 col-sm-6 col-xs-12">
              <span className="col-lg-3 col-md-3 col-sm-6 col-xs-12 pull-left"><b>Latest Order</b></span>
              {/* <span className="col-lg-3 col-md-3 col-sm-6 col-xs-12 pull-right newbtn" onClick={this.moveToRequest.bind(this)}><b>New Request</b></span> */}
              {
                this.props.services && this.props.contractstatus && this.props.services.length ?
                    <button className="btn newReqButton btn-default pull-right" onClick={this.moveToRequest.bind(this)}> New Request</button>
                :

                this.props.services.length <= 0 && this.props.contractstatus == "Inactive" ?
                  <button className="btn newReqButton btn-default pull-right" title="No Contract availabel in this date" disabled> New Request</button>
                :
                  <button className="btn newReqButton btn-default pull-right" title="Please add contract" disabled> New Request</button>
              }
              
            </h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 latestOrderWrap">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Date</th>
                    <th>No. Of Candidates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.corporateOrderDetails?
                      this.props.corporateOrderDetails.length>0 ?
                        this.props.corporateOrderDetails.map((orderData,index)=>{
                          return(
                            <tr key={index}>
                              <td className="orderNoStyle">{orderData.orderNo}</td>
                              <td> {moment(orderData.orderDate).format('DD MMM YYYY')}</td>
                              <td>{orderData.numberOfCandidate ? orderData.numberOfCandidate : 0}</td>
                              <td><a className={"corpStatus "+orderData.color}>{orderData.corporateStatus ? orderData.corporateStatus : "-"}</a></td>
                            </tr> 
                          )
                        })
                      :
                        <tr>
                          <td className="text-center" colspan="4">
                            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img>
                          </td>
                        </tr>
                      :
                      <tr>
                        <td></td>
                        <td>NO Data Available</td>
                        <td></td>
                        <td></td>
                      </tr> 
                    
                  }
                   
                </tbody>
              </table>
            </div>
           
        </div>
      );   
    }else{
      return null
    }
  }
}RequestVerificationContainer = withTracker(props => {
 
  var companyDetails = props.companyDetails;
  var contractDetails = props.contractDetails;
  var coporateStatus = "";
  var color = "";
  var corporateOrderDetails = [];
  const corporateHandle = Meteor.subscribe('matchedCorporateOrderlimit',companyDetails._id,contractDetails.contractId);
  const corporateCompanyProfile = Meteor.subscribe('');
  const loading         = !corporateHandle.ready();  
  
  var corporateOrders   = CorporateOrders.find({"companyDetails.companyId" : companyDetails._id, "companyDetails.contractId" : contractDetails.contractId},{sort:{'createdAt':-1},limit:5}).fetch();
  if(corporateOrders.length>0){
    corporateOrders.map((corporateDetails,index)=>{
      var orderDetails= {
        'orderNo':corporateDetails.corporateOrderNo,
        'orderDate':corporateDetails.createdAt,
        'numberOfCandidate' : corporateDetails.numOfCandidateOrderPlacedFor,
      };

      switch(corporateDetails.corporateOrderStatus){
        case "Order Placed":
            orderDetails.corporateStatus = "New";
            orderDetails.color           = "Bg-primary";
        break;

        case "Order InProcess": 
            orderDetails.corporateStatus = "WIP";
            orderDetails.color           = "Bg-warning";
        break;
        case "Completed" :
            orderDetails.corporateStatus = "Completed";
            orderDetails.color           = "bg-Success";

        break;
      }
      if(orderDetails.color!=""){
        corporateOrderDetails.push(orderDetails);
      }

    });
  }
 
  return{
    loading,
    corporateOrderDetails
  }

})(RequestVerification);
export default RequestVerificationContainer;
