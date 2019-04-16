import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';

import { Order } from '/imports/AssureID/userPortal/api/Order.js';

class LatestUpdates extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
   
    this.state = {
      "subscription"  : {
      }   
    }; 
  }
	render() {
    if(!this.props.loading && !this.props.loading1) {
      return (
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding activityOuter landingBlocks">
          <h5 className="text-center"><b>Latest Updates</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 latestUpadatesBlock noProfilePadding">
           {
            this.props.statusArray.length > 0 ?
              this.props.statusArray.map((statusDetails, index)=>{
                return(
                  <div key={index + '-status'}>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding text-center">
                        <i className={"fa fa-2x " + statusDetails.icon}></i>
                      </div>
                      <div className="col-lg-9 col-md-9 col-sm-8 col-xs-8">
                        <p>{statusDetails.msg}</p>
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 noProfilePadding">
                        <a href="/myOrders">{statusDetails.linkName}</a>
                      </div>
                    </div>
                    <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
                  </div>
                );
              })
            :
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nodatablock">
               <h5>No Data Available..</h5>
            </div>
          }
          </div>
          
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
            <h5>Latest Login: &nbsp;{this.props.userData.status ? this.props.userData.status.lastLogin ? moment(this.props.userData.status.lastLogin.date).format('dddd, Do MMMM YYYY, h:mm:ss a'): <span>Wednesday, 13 <sup>th</sup> December 2018 &nbsp;&nbsp;&nbsp; 15:37:23 pm</span> : <span>Wednesday, 13 <sup>th</sup> December 2018 &nbsp;&nbsp;&nbsp; 15:37:23 pm</span>}</h5>
          </div>
        </div>
      );
    }else{
      return(
        <span>Loading..</span>
      );
    }
  }
}
LatestUpdateContainer = withTracker(({props}) => {
  var _id          = Meteor.userId();
  const postHandle = Meteor.subscribe('userData',_id);
  const userData   = Meteor.users.findOne({"_id" : _id})|| {};
  const loading    = !postHandle.ready();

  const postHandle1 = Meteor.subscribe('userOrder',_id);
  const loading1    = !postHandle1.ready();
  const OrderObj    = Order.find({"userId" : _id}).fetch() || [];
  
  var statusArray = [];
  if(OrderObj){
    for(i=0; i<OrderObj.length; i++){
      if(OrderObj[i].orderStatus == "In Process"){
        var date = new Date(OrderObj[i].tatDate);
        var icon = "fa-male";
        if(OrderObj[i].serviceDetails){
           var msg = "Your " + OrderObj[i].serviceDetails.serviceName + " is in process. It will be verified by " + moment(date).format('Do MMMM, YYYY') + ".";        
           statusArray.push({icon,msg,linkName});
           
        }else{
          var serviceLength = OrderObj[i].packageDetails.servicesIncluded.length;
          for(var j=0;j<serviceLength;j++){
            
            var msg = "Your " + OrderObj[i].packageDetails.servicesIncluded[j].serviceName + " is in process. It will be verified by " + moment(date).format('Do MMMM, YYYY') + ".";        
            statusArray.push({icon,msg,linkName});
            
          }
        }
        var linkName = "Learn More";
      }
    }
  }
  
  return {
    loading,
    userData,
    statusArray,
    loading1,
  };
})(LatestUpdates);

export default LatestUpdateContainer;