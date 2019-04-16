import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import {Order} from '/imports/admin/orderManagement/api/Order.js'; 
import {Packages} from '/imports/admin/adminDashboard/packageManagement/api/Package.js';

// import { Services } from '../reactCMS/api/Services.js';

class ServiceInformation extends TrackerReact(Component){   
  constructor(props){
    super(props); 
    this.state = {
      "subscription" : {
        "allTickets" : Meteor.subscribe("allTickets"),  
        // "services" : Meteor.subscribe('services'),
      } 
    } 
  } 

  render(){
    if (!this.props.loading) {
     return(            
        <div className="col-lg-12 col-md-6 col-sm-6 col-xs-6">
          {/* {this.serviceData()} */}
          <div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 ticketServiceWrap">
            {
              this.props.serviceInfo ?

                <img src={this.props.serviceInfo.image} className="serviceImgicon img-thumbnail" />
              :
                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/noImage.png" className="serviceImgicon img-thumbnail" />
              
            }
            </div>
             <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerTickeBlock noPadLeftRight">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left noLRPad userName">
                {/* <h5>{this.state.userDetails.profile.firstname} {this.state.userDetails.profile.lastname}</h5> */}

                  {/* <h5>{this.props.serviceInfo.serviceName}</h5> */}
                  <h5>Service Details</h5>

                </div> 
              </div>
              {
                this.props.serviceInfo ?
                  this.props.serviceInfo.serviceName ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                        Service Name<span className="pull-right">:</span>
                      </div>  
                      <div className="serviceNameonly col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                        <p>&nbsp;{this.props.serviceInfo.serviceName}</p>
                      </div> 
                    </div>

                  :
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                        Package Name<span className="pull-right">:</span>
                      </div>  
                      <div className="serviceNameonly col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                        <p>&nbsp;{this.props.serviceInfo.packageName}</p>
                      </div> 
                    </div>
                :
                 null
              }
             
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                 {this.props.labelName}<span className="pull-right">:</span>
                </div>  
                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                  <p>{this.props.Id}</p>
                </div> 
              </div>
               
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                 Created Date<span className="pull-right">:</span>
                </div>  
                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                  <p>{moment(this.props.getTicket.createdAt).format("DD MMM YYYY")}</p> 
                
                </div>  
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 noLRPad text-left userLabel">
                 Turn Around Time<span className="pull-right">:</span>
                </div>  
                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                  <p>{moment(this.props.getTicket.tatDate).format("DD MMM YYYY")}</p> 
                
                </div>  
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                <div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 text-left noLRPad userLabel">
                Location<span className="pull-right">:</span>
                </div>  
                <div className="col-lg-7 col-md-8 col-sm-8 col-xs-8 text-left userValue">
                {
                  this.props.getTicket.verificationType == "currentAddress" ? <p>{this.props.getTicket.verificationData.tempCity},{this.props.getTicket.verificationData.tempState}</p> 
                  :this.props.getTicket.verificationType == "permanentAddress" ? <p>{this.props.getTicket.verificationData.city},{this.props.getTicket.verificationData.state}</p> 
                  :this.props.getTicket.verificationType == "permanentAddress"?<p>{this.props.getTicket.verificationData.city},{this.props.getTicket.verificationData.state}</p> 
                  :" - "
                }
                </div>  
              </div>
                
              
            </div>
           </div>
        </div>    
      );
    }else{

        return(<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noData"> No Data Available</div>);

    }
   }
}
serviceContainer = withTracker(props => {

    var parameter = props.ticketId;
    const postHandle = Meteor.subscribe('singleTicket',_id);
    const servicePublish = Meteor.subscribe('services');
    var handleSinTick = Meteor.subscribe("singleOrder",_id);
    var packageHandle = Meteor.subscribe("packages");
    const loading = !postHandle.ready() && !servicePublish.ready();  
    // var parameter    = props.params.id;  
    if(parameter.indexOf("-")>-1){
      var splitParam   = parameter.split('-');
      var _id      = splitParam[0];
      var candidateId  = splitParam[1];
    }else{
      var _id   = parameter;
    }
    
    
    if (window.location.href.indexOf("orderdetails") > -1){
        var getTicket  = Order.findOne({"_id" : _id});
        if(getTicket){
        var Id         = getTicket.orderNo;
        var labelName  = "Order Number";
        if(getTicket.serviceDetails){
          var serviceInfo = Services.findOne({'_id':getTicket.serviceDetails.serviceId});        
        }else{
          var serviceInfo = Packages.findOne({'_id':getTicket.packageDetails.packageId});
        }
      }
    }else{
        var getTicket  = TicketMaster.findOne({"_id" : _id}) || {};  
        var Id         = getTicket.ticketNumber;  
        var labelName  = "Case Number";   
        var serviceInfo = Services.findOne({'_id':getTicket.serviceId});
                       
    }
    
    
      return {
          loading  : loading,
          getTicket : getTicket,
          serviceInfo : serviceInfo,
          Id          : Id,
          labelName   : labelName
      };
})(ServiceInformation);
export default serviceContainer;

