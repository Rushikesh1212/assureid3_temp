import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import {Router, Route, browserHistory} from 'react-router';

import {Order} from '/imports/website/ServiceProcess/api/Order.js';

class CompanyOrderPlaced extends TrackerReact(Component) {
	render() {
    if (!this.props.loading) {
      return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerpaddingForMobile">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
            <h5 className="text-center"><b>Order Placed</b></h5>
            {
              this.props.companyOrder.length > 0 ?
               <div>
                 {this.props.companyOrder.map((companyOrder, index)=>{
                    return(
                      <Link key={companyOrder._id + '-companyOrderPlaced-' + index} to={"/companyOrder/"+companyOrder._id}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyVerificationDetails">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 landingBlocks noProfilePadding companyOrder">
                           { companyOrder.serviceDetails ?
                            <h5 className="text-center"><b>{companyOrder.serviceDetails.serviceName}</b></h5>
                            :
                            companyOrder.packageDetails ? 
                            <h5 className="text-center"><b>{companyOrder.packageDetails.packageName}</b></h5>
                            :
                            <h5 className="text-center"><b>-</b></h5>
                           }
                          <p className="col-lg-8 col-md-8 col-sm-8 col-xs-8">Total Request </p>
                          <p className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: {companyOrder.candidateDetails.length}</p>
                          <p className="col-lg-8 col-md-8 col-sm-8 col-xs-8">Verification </p>
                          <p className="col-lg-4 col-md-4 col-sm-4 col-xs-4">: 0</p>
                        </div>
                      </div>
                    </Link>                 
                    );
                  })
                   
                 }
                </div>
              :
              null
            }
            {
              this.props.companyOrder.length == 5 ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center outerViewMoreBlock">
                  <Link to={"/companyOrders/"+this.props.assureid} className="outerViewMoreBlockLink">View More <i className="fa fa-angle-double-right" aria-hidden="true"></i></Link>
                </div>
              :
              null
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
CompanyOrderPlacedContainer = withTracker(({props,params}) => {
  // var assureid = params.id;
  var currentLocation = browserHistory.getCurrentLocation();
  var splitUrl = currentLocation.pathname.split('/');
  var assureid = splitUrl[2];
  // console.log("assureid",assureid);
  var orders         = [];
  const postHandle   = Meteor.subscribe('assureIdmatched',assureid);
  const loading      = !postHandle.ready();
  const companyOrder = Order.find({"companyDetails.companyAssureID" : assureid},{sort:{"createdAt": -1},limit: 5}).fetch() || [];

  return {
    loading,
    assureid,
    companyOrder,
  };
})(CompanyOrderPlaced);
export default CompanyOrderPlacedContainer;