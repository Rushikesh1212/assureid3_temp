import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js'; 
import { withTracker } from 'meteor/react-meteor-data';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';

class OurServices extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      services       : [],
      "subscription"  : {
       
      }    
    };   
  }
  componentDidMount() { 
  }
  componentWillUnmount() {
  }  
  linkToServiceInfo(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('id');
    // console.log("id",id);
    var path = "/ServiceInfo/"+id;
    // console.log("path",path); 
    FlowRouter.go(path);
  }

  linkToPackageInfo(event){    
   event.preventDefault();    
   var id = $(event.currentTarget).attr('id');   
    // console.log("id",id);   
     var path = "/PackageInfo/"+id;    
     // console.log("path",path);    
      FlowRouter.go(path); 
  }
  orderStatusOnHover(serviceId,index){
    var userId    = Meteor.userId();
    var order     = Order.findOne({"serviceDetails.serviceId":serviceId,"userId":userId},{sort:{'createdAt':-1}});
    if (order) {
      return(
        <div>
          <div className="col-lg-5 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            Order No. <span className="pull-right">:</span>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            <p>{order.orderNo}</p>
          </div> 
          <div className="col-lg-5 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
             Status <span className="pull-right">:</span>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            <p>{order.orderStatus}</p>
          </div> 
        </div>
      );
    }
  }
  orderPackageStatusOnHover(packageId,index){
    var userId    = Meteor.userId();
    var order     = Order.findOne({"packageDetails.packageId":packageId,"userId":userId},{sort:{'createdAt':-1}});
    if (order) {
      return(
        <div>
          <div className="col-lg-5 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            Order No. <span className="pull-right">:</span>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            <p>{order.orderNo}</p>
          </div> 
          <div className="col-lg-5 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
             Status <span className="pull-right">:</span>
          </div>
          <div className="col-lg-7 col-md-6 col-sm-6 col-xs-6 noProfilePadding text-left">
            <p>{order.orderStatus}</p>
          </div> 
        </div>
      );
    }
  }
  orderStatus(serviceId,index){
    // console.log("serviceId",serviceId);
    var userId    = Meteor.userId();
    var order     = Order.findOne({"serviceDetails.serviceId":serviceId,"userId":userId},{sort:{'createdAt':-1}});
    // console.log("order",order);
    if (order) {
      if (order.orderStatus == "In Process") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 inProcessBackground orderverificationName" id={"orderverificationName-"+index}>
            <p>In Process since {moment(order.createdAt).format("DD/MM/YYYY")}</p>
          </div>
          );
      }else if (order.orderStatus == "Payment pending") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notPurchased orderverificationName"  id={"orderverificationName-"+index}>
            <p>Payment pending</p>
          </div>
          );
      }else if (order.orderStatus == "Incomplete") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notPurchased orderverificationName" id={"orderverificationName-"+index}>
            <p>Incomplete</p>
          </div>
          );
      }else if (order.orderStatus == "Closed") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 expired orderverificationName" id={"orderverificationName-"+index}>
            <p></p>
          </div>
          );
      }else if (order.orderStatus == "Approved") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 approved orderverificationName" id={"orderverificationName-"+index}>
            <p>Approved {moment(order.completedDate).format("DD/MM/YYYY")}</p>
          </div>
          );
      }
    }
  }
  orderStatusForPackage(packageId,index){
    // console.log("serviceId",serviceId);
    var userId    = Meteor.userId();
    var order     = Order.findOne({"packageDetails.packageId":packageId,"userId":userId},{sort:{'createdAt':-1}});
    // console.log("order",order);
    if (order) {
      if (order.orderStatus == "In Process") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 inProcessBackground orderverificationName" id={"orderverificationName-"+index}>
            <p>In Process since {moment(order.createdAt).format("DD/MM/YYYY")}</p>
          </div>
          );
      }else if (order.orderStatus == "Payment pending") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notPurchased orderverificationName"  id={"orderverificationName-"+index}>
            <p>Payment pending</p>
          </div>
          );
      }else if (order.orderStatus == "Incomplete") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 notPurchased orderverificationName" id={"orderverificationName-"+index}>
            <p>Incomplete</p>
          </div>
          );
      }else if (order.orderStatus == "Closed") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 expired orderverificationName" id={"orderverificationName-"+index}>
            <p></p>
          </div>
          );
      }else if (order.orderStatus == "Approved") {
        return(
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 approved orderverificationName" id={"orderverificationName-"+index}>
            <p>Approved {moment(order.completedDate).format("DD/MM/YYYY")}</p>
          </div>
          );
      }
    }
  }
  mouseOver(event){
    event.preventDefault();
    var serviceId = $(event.currentTarget).attr('id');
    var userId    = Meteor.userId();
    var index     = $(event.currentTarget).attr('data-key');
    var order = Order.findOne({"serviceDetails.serviceId":serviceId,"userId":userId},{sort:{'createdAt':-1}});
    // console.log("order",order);
    if (order) {
      var orderStatus = order.orderStatus;
      // console.log("orderStatus",orderStatus);
      $("#iconOuterBlock-"+index).parent().css({"margin-top":"-170px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus-"+index).css({"display":"block"});
    }else{
      $("#iconOuterBlock-"+index).parent().css({"margin-top":"0px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus-"+index).css({"display":"none"});
    }
  }
  mouseOut(event){
    event.preventDefault();
     var index = $(event.currentTarget).attr('data-key');
      $("#iconOuterBlock-"+index).parent().css({"margin-top":"0px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus-"+index).css({ "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
  }
  mouseOverPackage(event){
    event.preventDefault();
    var packageId = $(event.currentTarget).attr('id');
    var userId    = Meteor.userId();
    var index     = $(event.currentTarget).attr('data-key');
    var order     = Order.findOne({"packageDetails.packageId":packageId,"userId":userId},{sort:{'createdAt':-1}});
    // console.log("order",order);
    if (order) {
      var orderStatus = order.orderStatus;
      // console.log("orderStatus",orderStatus);
      $("#iconOuterBlock1-"+index).parent().css({"margin-top":"-170px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus1-"+index).css({"display":"block"});
    }else{
      $("#iconOuterBlock1-"+index).parent().css({"margin-top":"0px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus1-"+index).css({"display":"none"});
    }
  }
  mouseOutPackage(event){
   event.preventDefault();
     var index = $(event.currentTarget).attr('data-key');
      $("#iconOuterBlock1-"+index).parent().css({"margin-top":"0px", "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
      $("#verificationStatus1-"+index).css({ "-webkit-transition" : "margin 1s", "-moz-transition": "margin 1s","transition": "margin 1s"});
  }
  services(){
    return this.props.services.map((services,index)  => {
      return(
         <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 outerverificationBlock outerMargin" key={index}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock" data-key={index} onMouseOver={this.mouseOver.bind(this)} id={services._id} onClick={this.linkToServiceInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock " id={"iconOuterBlock-"+index}>
                 <img src={services.image} className="profileServiceImage"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName" id={"verificationName-"+index}>
                  <p>{services.serviceName}</p> 
              </div>
              {this.orderStatus(services._id,index)}
              
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationStatus noProfilePadding" data-key={index} onMouseLeave={this.mouseOut.bind(this)} style={{"display" : "block"}} id={"verificationStatus-"+index}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ouetrStatusProfileBlock noProfilePadding"> 
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left noProfilePadding">
                   <img src={services.image} className="profileStatusServiceImage"/>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 text-left noProfilePadding">
                  <span>{services.serviceName}</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderStatusBlock">
                 {this.orderStatusOnHover(services._id,index)}
               </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 purchaseBlock noProfilePadding" id={services._id} onClick={this.linkToServiceInfo.bind(this)}>
                 <p>Purchase <i className="fa fa-long-arrow-right purchaseArrowIcon"></i></p>
              </div>
             </div>
        </div>
        );
      });
  }

  packages(){
    return this.props.packages.map((packages,index)  => {
      return(
         <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 outerverificationBlock1" key={index}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock1" data-key={index} id={packages._id} onMouseOver={this.mouseOverPackage.bind(this)} onClick={this.linkToPackageInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock1" id={"iconOuterBlock1-"+index}>
                 <img src={packages.image} className="profileServiceImage1"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName1" id={"verificationName1-"+index}>
                  <p>{packages.packageName}</p>
              </div>
              {this.orderStatusForPackage(packages._id,index)}
             
            </div>
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationStatus1 noProfilePadding" data-key={index} onMouseLeave={this.mouseOutPackage.bind(this)} style={{"display" : "block"}} id={"verificationStatus1-"+index}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ouetrStatusProfileBlock1 noProfilePadding">
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 pull-left noProfilePadding">
                   <img src={packages.image} className="profileStatusServiceImage1"/>
                </div>
                <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 text-left noProfilePadding">
                  <span>{packages.packageName}</span>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderStatusBlock1">
                 {this.orderPackageStatusOnHover(packages._id,index)}
               </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 purchaseBlock1 noProfilePadding" id={packages._id} onClick={this.linkToPackageInfo.bind(this)}>
                 <p>Purchase <i className="fa fa-long-arrow-right purchaseArrowIcon1"></i></p>
              </div>
             </div>
        </div>
        );
      });
  }
	render() {  
    return (
  	  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 verSerBlock landingBlocks noProfilePadding">
          <h5 className="text-center"><b>Our Services</b></h5>
          {!this.props.loading ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerpaddingForMobile">
                {this.services()}
                {this.packages()}
              </div>
            :
            <span>Loading</span>
          }
 
      </div>
    );
  }
}
ServicesContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe("userandbothservice");
    const orderHandle   = Meteor.subscribe("allOrders");
    const packageHandle = Meteor.subscribe("adminpackages","Manual");
    const loading       = !postHandle.ready() && !orderHandle.ready() && !packageHandle.ready();
    const services      = Services.find({$or: [{"serviceFor" :'user'},{"serviceFor" :'both'},]}).fetch()||[];

    const packages      = Packages.find({"packageStatus": "Active","createdBy" : "Manual"}).fetch() || [];
    // console.log("packages",packages); 
    return {
      loading,
      services,
      packages,
    };
})(OurServices);
export default ServicesContainer;