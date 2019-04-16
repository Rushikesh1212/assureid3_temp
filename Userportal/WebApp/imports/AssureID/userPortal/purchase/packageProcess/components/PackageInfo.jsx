import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import {Order} from '/imports/AssureID/userPortal/api/Order.js';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import {RequestPool} from '/imports/AssureID/company/api/companyProfile.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
require('moment-weekday-calc');

class PackageInfo extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={ 
      
    };
    // this.handleChange = this.handleChange.bind(this);
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
  userPackageRequired(url,assureId){
    const requestPoolHandle = Meteor.subscribe("matchedPackageRequestPoolData",assureId,url);
    if (!requestPoolHandle.ready()) {
      var PackageDetail    = Packages.findOne({"_id":url, "packageStatus" : "Active"});        
      var requestPoolObj   = RequestPool.findOne({"assureId" : assureId, "packageId" : url,"orderPlacedBy" : "User"},{sort:{"createdAt": -1}});
      if (requestPoolObj) {
        // console.log("requestPoolObj",requestPoolObj);
         var orderId  = requestPoolObj.orderId;
         // console.log("orderId",orderId);
         var orderObj = Order.findOne({"_id": orderId});
         // console.log("orderObj",orderObj);
        if (orderObj) {
          if (orderObj.orderStatus != "In Process" && orderObj.orderStatus != "Paid") {
             var id   =  url+"-"+PackageDetail.packageName+"-"+orderId;
             var path = "/PackageRequiredData/"+id;
             FlowRouter.go(path);
          }else{
            /*Create Service Details Object*/
            /**Get Data from  service database */
            var PackageDetail = Packages.findOne({"_id":url, "packageStatus" : "Active"});        
            var orderObj = Order.findOne({}, {sort: { orderNo : -1}});
            var userId = Meteor.userId();
            if(orderObj){
              var orderNo = orderObj.orderNo + 1;
            }else{
              var orderNo = 1;  
            }
            var packageServiceDetails ={};
            var serviceArrya  = [];
            if(PackageDetail){
              for( i=0;i<PackageDetail.selectedServices.length;i++){
                if(PackageDetail.selectedServices[i].value == true){
                    var serviceDetails = Services.findOne({"_id": PackageDetail.selectedServices[i].serviceId});
                    packageServiceDetails={
                      "serviceId"             : serviceDetails._id,
                      "serviceName"           : serviceDetails.serviceName,
                      "serviceCompletionDays" : serviceDetails.serviceDayNumbers,
                      "serviceImage"          : serviceDetails.image,
                      "serviceFileExt"        : serviceDetails.fileExt,
                      "serviceRate"           : serviceDetails.serviceRate,
                      "serviceRequired"       : serviceDetails.serviceRequired,
                    }
                    if(serviceDetails.serviceRequired =="StatutoryForm"){
                      packageServiceDetails.selectedCard = serviceDetails.selectedCard;
                    }
                    serviceArrya.push(packageServiceDetails);
                }
              }
              var holidaysList = [];
              var HolidaysDB   = HolidaysList.find({}).fetch();
              if(HolidaysDB.length > 0){
                HolidaysDB.map((holidaylist)=>{
                  holidaysList.push(holidaylist.holidayDate);
                });               
              }
              var tatDate1          = moment().addWorkdays(parseInt(PackageDetail.packageDuration),holidaysList);
            }
            var orderDetails = {
              "orderNo"          : orderNo,
              "userId"           : Meteor.userId(),
              "packageDetails"   :{
                "packageId"             : PackageDetail._id,
                "packageName"           : PackageDetail.packageName,
                "packageCompletionDays" : PackageDetail.packageDuration,
                "packageImage"          : PackageDetail.image,
                "packageFileExt"        : PackageDetail.fileExt,
                "packageDiscount"       : PackageDetail.packageDiscount,
                "servicesIncluded"      : serviceArrya, 
              },
              "candidateDetails" : [{
                "candidateId"            : Meteor.user()._id,
                "candidateAssureID"      : Meteor.user().profile.assureId,
                "candidateFirstName"     : Meteor.user().profile.firstname,
                "candidateLastName"      : Meteor.user().profile.lastname,
                "candidateEmail"         : Meteor.user().emails[0].address,
                "candidateMobile"        : Meteor.user().profile.mobNumber,
                "candidateAadharCard"    : Meteor.user().profile.aadharCard,
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
                 var id   =  url+"-"+orderDetails.packageDetails.packageName+"-"+orderId;
                
                 var path = "/PackageRequiredData/"+id;
                 FlowRouter.go(path);
              }
            });
          }
        }
      }else{
        /*Create Service Details Object*/
        /**Get Data from  service database */
        var PackageDetail = Packages.findOne({"_id":url, "packageStatus" : "Active"});        
        var orderObj = Order.findOne({}, {sort: { orderNo : -1}});
        var userId = Meteor.userId();
        if(orderObj){
          var orderNo = orderObj.orderNo + 1;
        }else{
          var orderNo = 1; 
        }
        var packageServiceDetails ={};
        var serviceArrya  = [];
        if(PackageDetail){
          for(var i=0;i<PackageDetail.selectedServices.length;i++){
            if(PackageDetail.selectedServices[i].value == true){
                var serviceDetails = Services.findOne({"_id": PackageDetail.selectedServices[i].serviceId});
                packageServiceDetails={
                  "serviceId"             : serviceDetails._id,
                  "serviceName"           : serviceDetails.serviceName,
                  "serviceCompletionDays" : serviceDetails.serviceDayNumbers,
                  "serviceImage"          : serviceDetails.image,
                  "serviceFileExt"        : serviceDetails.fileExt,
                  "serviceRate"           : serviceDetails.serviceRate,
                  "serviceRequired"       : serviceDetails.serviceRequired,
                }
                if(serviceDetails.serviceRequired =="StatutoryForm"){
                  packageServiceDetails.selectedCard = serviceDetails.selectedCard;
                }
                serviceArrya.push(packageServiceDetails);
            }
          }
          var holidaysList = [];
          var HolidaysDB   = HolidaysList.find({}).fetch();
          if(HolidaysDB.length > 0){
            HolidaysDB.map((holidaylist)=>{
              holidaysList.push(holidaylist.holidayDate);
            });               
          }
          var tatDate1          = moment().addWorkdays(parseInt(PackageDetail.packageDuration),holidaysList);
        }
        var orderDetails = {
          "orderNo"          : orderNo,
          "userId"           : Meteor.userId(),
          "packageDetails"   :{
            "packageId"             : PackageDetail._id,
            "packageName"           : PackageDetail.packageName,
            "packageCompletionDays" : PackageDetail.packageDuration,
            "packageImage"          : PackageDetail.image,
            "packageFileExt"        : PackageDetail.fileExt,
            "packageDiscount"       : PackageDetail.packageDiscount,
            "servicesIncluded"      : serviceArrya, 
          },
          "candidateDetails" : [{
            "candidateId"            : Meteor.user()._id,
            "candidateAssureID"      : Meteor.user().profile.assureId,
            "candidateFirstName"     : Meteor.user().profile.firstname,
            "candidateLastName"      : Meteor.user().profile.lastname,
            "candidateEmail"         : Meteor.user().emails[0].address,
            "candidateMobile"        : Meteor.user().profile.mobNumber,
            "candidateAadharCard"    : Meteor.user().profile.aadharCard,
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
             var id   =  url+"-"+orderDetails.packageDetails.packageName+"-"+orderId;
             var path = "/PackageRequiredData/"+id;
             FlowRouter.go(path);
          }
        });
      }
    }
  }
  proceedClick(event){
    event.preventDefault();
    if(!this.props.loading){
      var url = FlowRouter.getParam('id');
      // console.log("user assureId",this.props.assureId);
      if(url){
        var PackageDetail             = Packages.findOne({"_id":url, "packageStatus" : "Active"});
        const requestPoolCompanyHandle = Meteor.subscribe("matchedPackageRequestPoolForCompany",this.props.assureId,url);
        // console.log("requestPoolCompanyHandle",requestPoolCompanyHandle);
        if (!requestPoolCompanyHandle.ready()) {
           var requestPoolCompanyObj   = RequestPool.findOne({"assureId": this.props.assureId, "packageId": url, "orderPlacedBy": "Company"},{sort:{"createdAt": -1}});
           // console.log("requestPoolCompanyObj",requestPoolCompanyObj);
           if (requestPoolCompanyObj) {
             var companyorderId  = requestPoolCompanyObj.orderId;
             var companyorderObj = Order.findOne({"_id": companyorderId});
             // console.log("companyorderObj",companyorderObj);
             if (companyorderObj) {
              var companyName = companyorderObj.companyDetails.companyName;
              var packageName = companyorderObj.packageDetails.packageName;
              var companyPath = url+"-"+PackageDetail.packageName+"-"+companyorderId; 
              var assureId    = this.props.assureId;
              swal({
                title: companyName+" has requested for the verification of "+packageName,
                text: "Do you want to complete the process?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true,
                html: false
              }, (companyorderObj)=>{
                console.log("companyorderObj",companyorderObj);
                // console.log("companyPath",companyPath);
                  if (companyorderObj) {
                    var path    = "/PackageRequiredData/"+companyPath;
                    FlowRouter.go(path);
                  } else {
                    this.userPackageRequired(url,assureId);
                  }
              });
            }
          }else{
            var assureId    = this.props.assureId;
            this.userPackageRequired(url,assureId);
          }
        }else{
          var assureId    = this.props.assureId;
          this.userPackageRequired(url,assureId);
        }
      }
    }   
  }
  
  render(){
    if (!this.props.loading) {
      return(
        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <h1 className="text-center headerinvoice"> {this.props.packages.packageName} </h1>    

              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 outerServiceImage">
                <img src={this.props.packages.image} className="img-responsive serviceImage" />
              </div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 serviceInfoColumn">
                 {/* <span className="">Rate : <i className="fa fa-inr" aria-hidden="true"></i> {this.props.packages.serviceRate}</span>*/}                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right serviceInfoColumn">
                    <span className="">Expected Completion : {this.props.packages.packageDuration} Days</span>
                </div> 
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 serviceInfoDesc">
                    <span className="">{this.props.packages.packageDescription}</span>
                </div>

              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left" onClick={this.backClick.bind(this)} value="" >Back</button>
                <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" id={this.props.packages._id + "-" +this.props.packages.packageName} onClick={this.proceedClick.bind(this)} type="submit" value="" >Continue</button>
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

PackageInfoContainer = withTracker(({params}) => {
    var _id             = FlowRouter.getParam('id');
    const packageHandle = Meteor.subscribe("singlePackages",_id);
    const serviceHandle = Meteor.subscribe("services");
    const orderHandle   = Meteor.subscribe("allOrders");
    const packages      = Packages.findOne({"_id":_id});
    var userId          = Meteor.userId(); 
    const userHandle    = Meteor.subscribe("userData",userId);
    const user          = Meteor.users.findOne({"_id": userId});
    if (user) {
      if (user.profile) {
        var assureId    = user.profile.assureId;
      }
    }
    const loading = !packageHandle.ready() && !serviceHandle.ready() && !userHandle.ready();

    return {
        loading,
        packages,
        assureId,
    };
})(PackageInfo);
export default PackageInfoContainer;

