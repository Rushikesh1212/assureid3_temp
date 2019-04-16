import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js'; 
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import {RequestPool} from '/imports/AssureID/company/api/companyProfile.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
require('moment-weekday-calc');

class ServiceInfo extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      serviceName         : '',
      serviceRate         : '',
      serviceDuration     : '', 
      servicesDescription : '',
      id                  : '',
      "subscription" : {
        "singleServices" : Meteor.subscribe("singleServices"),
        "projectSettingsPublish" : Meteor.subscribe("projectSettingsPublish"),
        "tempServiceImages" : Meteor.subscribe("tempServiceImages"),

        // "userProfileData" : Meteor.subscribe("userProfileData"),
      }
    };
    // this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.services){
         this.setState({
             serviceName         : nextProps.services.serviceName, 
             serviceDayNumbers   : nextProps.services.serviceDayNumbers,
             serviceRate         : nextProps.services.serviceRate,
             serviceDuration     : nextProps.services.serviceDuration,
             servicesDescription : nextProps.services.servicesDescription,
             image               : nextProps.services.image,
             id                  : nextProps.services._id,
         });
      }
    }else{
      this.setState({
             serviceName         : '',
             serviceRate         : '',
             serviceDayNumbers   : '',
             serviceDuration     : '',
             servicesDescription : '',
             image               : '',
             id                  : '',
      });
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
    $('html,body').scrollTop(0);
  }
  backClick(event){
    event.preventDefault();
    var path = "/profile";
    FlowRouter.go(path); 
  }
 
  userServiceRequired(url,assureId){
    var serviceDetail      = Services.findOne({"_id":url});
    const requestPoolHandle = Meteor.subscribe("matchedServiceRequestPoolData",assureId,url);
    if (!requestPoolHandle.ready()) {
       var requestPoolObj   = RequestPool.findOne({"assureId" : assureId, "serviceId" : url,"orderPlacedBy" : "User"},{sort:{"createdAt": -1}});
       if (requestPoolObj) {
         var orderId  = requestPoolObj.orderId;
         // console.log("orderId",orderId);
         var orderObj = Order.findOne({"_id": orderId});
         // console.log("orderObj",orderObj);
         if (orderObj) {
            if (orderObj.orderStatus != "In Process" && orderObj.orderStatus != "Paid") {
              var id      =  url+"-"+serviceDetail.serviceName+"-"+orderId;
              var path    = "/ServiceRequiredData/"+id;
              FlowRouter.go(path);
            }else{
              var serviceDetail = Services.findOne({"_id":url});
              var orderObj      = Order.findOne({}, {sort: { orderNo : -1}});
              var userId        = Meteor.userId(); 
              if(orderObj){
                var orderNo = orderObj.orderNo + 1;
              }else{
                var orderNo = 1;
              }
              var holidaysList = [];
              var HolidaysDB   = HolidaysList.find({}).fetch();
              if(HolidaysDB.length > 0){
                HolidaysDB.map((holidaylist)=>{
                  holidaysList.push(holidaylist.holidayDate);
                });               
              }
              var tatDate1     = moment().addWorkdays(parseInt(serviceDetail.serviceDayNumbers),holidaysList);
              var orderDetails = {
                "orderNo" : orderNo,
                "userId"  : Meteor.userId(),
                "serviceDetails":{
                  "serviceId"              : serviceDetail._id,
                  "serviceName"            : serviceDetail.serviceName,
                  "serviceCompletionDays"  : serviceDetail.serviceDayNumbers,
                  "serviceImage"           : serviceDetail.image,
                  "serviceFileExt"         : serviceDetail.fileExt,
                  "serviceRate"            : serviceDetail.serviceRate
                },
                "candidateDetails" : [{
                  "candidateId"            : Meteor.user()._id,
                  "candidateAssureID"      : Meteor.user().profile.assureId,
                  "candidateFirstName"     : Meteor.user().profile.firstname,
                  "candidateLastName"      : Meteor.user().profile.lastname,
                  "candidateEmail"         : Meteor.user().emails[0].address,
                  "candidateMobile"        : Meteor.user().mobNumber,
                  "candidateAadharCard"    : Meteor.user().aadharCard,
                  "candidateAmountPaid"    : "",
                  "candidatepaymentStatus" : "",
                  "candidateVerificationStatus": "Incomplete",
                }],
                "tatDate"     : new Date(tatDate1),
                "createdAt"   : new Date(),
                "orderStatus" : "Incomplete",   
              }//End of orderDetails
              
              
              Meteor.call("insertNewOrder",orderDetails,(error,result)=>{
                if(result){
                   var orderId = result;
                   // console.log('orderId: ', orderId);
                   var id      =  url+"-"+orderDetails.serviceDetails.serviceName+"-"+orderId;
                   var path    = "/ServiceRequiredData/"+id;
                   FlowRouter.go(path);
                }
              });
            }
         }
       }else{
         /*Create Service Details Object*/
        /*Get Data from  service database*/
        var serviceDetail = Services.findOne({"_id":url});
        // console.log("serviceDetail :",serviceDetail);
        var orderObj      = Order.findOne({}, {sort: { orderNo : -1}});
        // console.log("orderObj :",orderObj);
        var userId        = Meteor.userId(); 
        if(orderObj){
          var orderNo = orderObj.orderNo + 1;
        }else{
          var orderNo = 1;
        }
        var holidaysList = [];
        var HolidaysDB   = HolidaysList.find({}).fetch();
        if(HolidaysDB.length > 0){
          HolidaysDB.map((holidaylist)=>{
            holidaysList.push(holidaylist.holidayDate);
          });               
        }
        var tatDate1     = moment().addWorkdays(parseInt(serviceDetail.serviceDayNumbers),holidaysList);
        // console.log("orderNo",orderNo);
        var orderDetails = {
          "orderNo" : orderNo,
          "userId"  : Meteor.userId(),
          "serviceDetails":{
            "serviceId"              : serviceDetail._id,
            "serviceName"            : serviceDetail.serviceName,
            "serviceCompletionDays"  : serviceDetail.serviceDayNumbers,
            "serviceImage"           : serviceDetail.image,
            "serviceFileExt"         : serviceDetail.fileExt,
            "serviceRate"            : serviceDetail.serviceRate
          },
          "candidateDetails" : [{
            "candidateId"            : Meteor.user()._id,
            "candidateAssureID"      : Meteor.user().profile.assureId,
            "candidateFirstName"     : Meteor.user().profile.firstname,
            "candidateLastName"      : Meteor.user().profile.lastname,
            "candidateEmail"         : Meteor.user().emails[0].address,
            "candidateMobile"        : Meteor.user().mobNumber,
            "candidateAadharCard"    : Meteor.user().aadharCard,
            "candidateAmountPaid"    : "",
            "candidatepaymentStatus" : "",
            "candidateVerificationStatus": "Incomplete",
          }],
          "tatDate"     : new Date(tatDate1), 
          "createdAt"   : new Date(),
          "orderStatus" : "Incomplete",   
        }//End of orderDetails
        
        
        Meteor.call("insertNewOrder",orderDetails,(error,result)=>{
          if(result){
             var orderId = result;
             // console.log('orderId: ', orderId);
             var id      =  url+"-"+orderDetails.serviceDetails.serviceName+"-"+orderId;
             var path    = "/ServiceRequiredData/"+id;
             FlowRouter.go(path);
          }
        });
       }
    }
  }
  
  proceedClick(event){
    event.preventDefault();
     var url      = FlowRouter.getParam('id');
     var assureId = this.props.assureId;
    this.userServiceRequired(url,assureId);

    // if(!this.props.loading){
    //   var url = FlowRouter.getParam('id');
    //   if(url){
    //     var serviceDetail              = Services.findOne({"_id":url});
    //     const requestPoolCompanyHandle = Meteor.subscribe("matchedServiceRequestPoolForCompany",this.props.assureId,url);
    //     console.log("requestPoolCompanyHandle",requestPoolCompanyHandle);
    //     if (!requestPoolCompanyHandle.ready()) {
    //        var requestPoolCompanyObj   = RequestPool.findOne({"assureId" : this.props.assureId, "serviceId" : url,"orderPlacedBy" : "Company"},{sort:{"createdAt": -1}});
    //        console.log("requestPoolCompanyObj",requestPoolCompanyObj);
    //        if (requestPoolCompanyObj) {
    //          var companyorderId  = requestPoolCompanyObj.orderId;
    //          // console.log("companyorderId",companyorderId);
    //          var companyorderObj = Order.findOne({"_id": companyorderId});
    //          // console.log("companyorderObj",companyorderObj);
    //          if (companyorderObj) {
    //           var companyName = companyorderObj.companyDetails.companyName;
    //           var serviceName = companyorderObj.serviceDetails.serviceName;
    //           var companyPath = url+"-"+serviceDetail.serviceName+"-"+companyorderId; 
    //           var assureId    = this.props.assureId;
    //           swal({
    //             title: companyName+" has requested for the verification of "+serviceName,
    //             text: "Do you want to complete the process?",
    //             type: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#DD6B55",
    //             confirmButtonText: "Yes",
    //             closeOnConfirm: true,
    //             html: false
    //           }, (companyorderObj)=>{
    //             console.log("companyorderObj",companyorderObj);
    //             // console.log("companyPath",companyPath);
    //               if (companyorderObj) {
    //                 var path    = "/ServiceRequiredData/"+companyPath;
    //                 FlowRouter.go(path);
    //               } else {
    //                 this.userServiceRequired(url,assureId);
    //               }
    //           });
    //         }
    //       }else{
    //         console.log("hi");
    //         var assureId    = this.props.assureId;
    //         this.userServiceRequired(url,assureId);
    //       }
    //     }else{
    //         var assureId    = this.props.assureId;
    //         this.userServiceRequired(url,assureId);
    //       }

    //   }
    // }
    // var id = $(event.currentTarget).attr('id');
     
  }

  render(){
    if (!this.props.loading) {
      return(
        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerpaddingForMobile">
            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 ">
              <h1 className="text-center headerinvoice"> {this.props.services.serviceName} </h1>    

              <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12 outerServiceImage">
                <img src={this.props.services.image} className="img-responsive serviceImage" />
              </div>
              <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12 outerpaddingForMobile">
                <div className="col-lg-6 col-md-5 col-sm-5 col-xs-12 serviceInfoColumn">
                    <span className="">Rate : <i className="fa fa-inr" aria-hidden="true"></i> {this.props.services.serviceRate}</span>
                </div>
                <div className="col-lg-6 col-md-7 col-sm-7 col-xs-12 text-right serviceInfoColumn">
                    <span className="">Expected Completion : {this.props.services.serviceDayNumbers} {this.props.services.serviceDuration}</span>
                </div> 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 serviceInfoDesc">
                    <span className="">{this.props.services.servicesDescription}</span>
                </div>

              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                <button className="col-lg-3 col-md-4 col-sm-5 col-xs-5 btn ServiceProcessButtons pull-left" onClick={this.backClick.bind(this)} value="" >Back</button>
                <button className="col-lg-3 col-md-4 col-sm-5 col-xs-5 btn ServiceProcessButtons pull-right" id={this.props.services._id + "-" +this.props.services.serviceName} onClick={this.proceedClick.bind(this)} type="submit" value="" >Continue</button>
              </div>
              
            </div>                    
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

ServiceInfoContainer = withTracker(({params}) => {
    var _id = FlowRouter.getParam('id');
    const postHandle  = Meteor.subscribe('singleServices',_id);
    const orderHandle = Meteor.subscribe('allOrders');
    var userId        = Meteor.userId(); 
    const userHandle  = Meteor.subscribe("userData",userId);
    const services    = Services.findOne({"_id":_id});
    const loading     = !postHandle.ready() && !orderHandle.ready() && !userHandle.ready();
    const user        = Meteor.users.findOne({"_id": userId});
    if (user) {
      if (user.profile) {
        var assureId = user.profile.assureId;
      }
    }
    
    return {
        loading,
        services,
        assureId,
    };
})(ServiceInfo);
export default ServiceInfoContainer;

