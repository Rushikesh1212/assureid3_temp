import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import { Invoice } from '/imports/AssureID/userPortal/api/Invoice.js';

class Receipt extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : {
        "singleTempOrder" : Meteor.subscribe("singleTempOrder"),
      }
    };
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
    $('html, body').scrollTop(0);
  }
  backToProfile(event){
     var path = "/profile";
     // console.log("path",path);
     FlowRouter.go(path);
  }
  formatRupees(num){    
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  }

  
  
  render(){
   if(!this.props.loading){
      if(this.props.order){
        if (this.props.order.serviceDetails) {
          return(
            <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                       <div className="col-lg-4 col-md-4 col-sm-4 col-xs-8 outerpaddingForMobile">
                         <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/Assure-ID-logo-Grey.png" className="img-responsive assureidLogoOnReciept" />
                       </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerRecieptBlock">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderHeading">
                         <h5>Thank you</h5>
                         <p>Your Payment has been successfully received with the following details.</p>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderBody">
                        <h5>Transaction Status</h5>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Number</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.orderNo}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Transaction ID</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Service Name </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.serviceDetails.serviceName}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Service Duration </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.serviceDetails.serviceCompletionDays} Days</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Total Amount </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12"><i className="fa fa-rupee"></i>{this.formatRupees(this.props.order.amountPaid)}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Date</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{moment(this.props.order.createdAt).format("DD/MM/YYYY")}</span>
                         </div>
                      </div>
                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv text-center">
                          <button type="submit" className="btn btn-info col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 ServiceProcessButtons" onClick={this.backToProfile.bind(this)} >Okay, Go back to Home</button>
                       </div>
                    </div>
                </div>
              </div>
            </div>
          );
        }else if (this.props.order.packageDetails) {
           return(
            <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                       <div className="col-lg-4 col-md-4 col-sm-4 col-xs-8 outerpaddingForMobile">
                         <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/Assure-ID-logo-Grey.png" className="img-responsive assureidLogoOnReciept" />
                       </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerRecieptBlock">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderHeading">
                         <h5>Thank you</h5>
                         <p>Your Payment has been successfully received with the following details.</p>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderBody">
                        <h5>Transaction Status</h5>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Number</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.orderNo}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Transaction ID</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Package Name </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.packageDetails.packageName}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Package Duration </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.order.packageDetails.packageCompletionDays} Days</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Total Amount </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12"><i className="fa fa-rupee"></i>{this.formatRupees(this.props.order.amountPaid)}</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Date</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">{moment(this.props.order.createdAt).format("DD/MM/YYYY")}</span>
                         </div>
                      </div>
                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv text-center">
                          <button type="submit" className="btn btn-info col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 ServiceProcessButtons" onClick={this.backToProfile.bind(this)} >Okay, Go back to Home</button>
                       </div>
                    </div>
                </div>
              </div>
            </div>
          );
        }else{
          return(
            <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                       <div className="col-lg-4 col-md-4 col-sm-4 col-xs-8 outerpaddingForMobile">
                         <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Assure-ID-logo-Grey.png" className="img-responsive assureidLogoOnReciept" />
                       </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerRecieptBlock">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderHeading">
                         <h5>Thank you</h5>
                         <p>Your Payment has been successfully received with the following details.</p>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight orderBody">
                        <h5>Transaction Status</h5>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Number</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Transaction ID</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Package Name </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Package Duration </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Total Amount </span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 innerOrderBody noPadLeftRight">
                           <span className="orderLabel col-lg-12 col-md-12 col-sm-12 col-xs-12">Order Date</span>
                           <span className="orderValue col-lg-12 col-md-12 col-sm-12 col-xs-12">-</span>
                         </div>
                      </div>
                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv text-center">
                          <button type="submit" className="btn btn-info col-lg-3 col-lg-offset-9 col-md-3 col-md-offset-9 col-sm-3 col-sm-offset-9 ServiceProcessButtons" onClick={this.backToProfile.bind(this)} >Okay, Go back to Home</button>
                       </div>
                    </div>
                </div>
              </div>
            </div>
          );
        }
      }
    }else{
      return(<span>Data not available</span>);
    }
  }
}

ReceiptContainer = withTracker(({params}) => {
    var _id = FlowRouter.getParam('id');
    // console.log("_id",_id);
    const postHandle = Meteor.subscribe('singleOrder',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const order = Order.findOne({"_id":_id});
    // console.log('invoice ', invoice);
    const loading = !postHandle.ready();
    
    if(_id){
      return {
          loading,
          order,
      };
    }
})(Receipt);
export default ReceiptContainer;
