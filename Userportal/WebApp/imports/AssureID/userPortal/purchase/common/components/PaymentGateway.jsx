import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
import '/imports/admin/notificationManagement/components/SendMailnNotification.jsx';
require('moment-weekday-calc');

ticketGeneration = function(Orders,index,matchCandidateIndex){ 
    let self = this; 
    var cnt = false; 
    
    if(index >= 0){
      /**Generate ticket accroding to service details or package details */
      if(Orders.serviceDetails){
        var serviceId         = Orders.serviceDetails.serviceId;
        var serviceName       = Orders.serviceDetails.serviceName;
        var serviceDayNumbers = Orders.serviceDetails.serviceDayNumbers;
        var serviceImage      = Orders.serviceDetails.serviceImage;
        var serviceImgFileExt = Orders.serviceDetails.serviceImgFileExt;
        var serviceRequired   = Orders.serviceDetails.serviceRequired;  
        cnt = true;              
      }else if(Orders.packageDetails){
        var serviceIndex = Orders.packageDetails.servicesIncluded.findIndex(x=> x.serviceRequired == Orders.candidateDetails[matchCandidateIndex].verificationData[index].serviceRequired);    
        if(serviceIndex >= 0){
          var serviceId         = Orders.packageDetails.servicesIncluded[serviceIndex].serviceId;
          var serviceName       = Orders.packageDetails.servicesIncluded[serviceIndex].serviceName;
          var serviceDayNumbers = Orders.packageDetails.servicesIncluded[serviceIndex].serviceDayNumbers;
          var serviceImage      = Orders.packageDetails.servicesIncluded[serviceIndex].serviceImage;
          var serviceImgFileExt = Orders.packageDetails.servicesIncluded[serviceIndex].serviceImgFileExt;
          cnt = true;
        }
      }
      
      if(cnt){ 
        var newTicket = {
          "orderId"             : Orders._id,
          "orderNo"             : Orders.orderNo,
          "orderDate"           : Orders.createdAt,
          "assureId"            : Orders.candidateDetails[matchCandidateIndex].candidateAssureID,
          "serviceId"           : serviceId,
          "serviceName"         : serviceName,
          "serviceDayNumbers"   : serviceDayNumbers,
          "serviceImage"        : serviceImage,
          "serviceImgFileExt"   : serviceImgFileExt,
          "tatDate"             : Orders.tatDate,
          "type"                : "user",
          "userId"              : Orders.candidateDetails[matchCandidateIndex].candidateId,
          "userName"            : Orders.candidateDetails[matchCandidateIndex].candidateFirstName+" "+Orders.candidateDetails[matchCandidateIndex].candidateLastName,
          "verificationType"    : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationType,
          "verificationId"      : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationId,
          "verificationData"    : Orders.candidateDetails[matchCandidateIndex].verificationData[index],
          "matchCandidateIndex" : matchCandidateIndex,
        };
        if(Orders.invoiceDetails){
          newTicket.invoiceId = Orders.invoiceDetails.invoiceId;
          newTicket.invoiceNo = Orders.invoiceDetails.invoiceNumber;
        }
        if (Orders.companyDetails) {
          newTicket.corporateDetails = Orders.companyDetails;
        }
        
        // self.ticketGeneration(Orders,index-1,matchCandidateIndex);
        Meteor.call('createTicket',newTicket,index,function (error,result) {
          if (error) { 
          }else if(result){
            var adminData   = Meteor.users.findOne({'roles' : "admin"});
            var userData    = Meteor.users.findOne({"_id" : Meteor.userId()});
            if (adminData) {
              var adminId  = adminData._id;
            }
            if (userData) {
              var newID = userData._id;
              if (userData.profile) {
                var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
                var assureId    = userData.profile.assureId;
                var mobNumber   = userData.profile.mobNumber;
              }
            }
            var newDate     = new Date();
            var msgvariable = {                       
                             '[username]' : firstLastNm+"("+assureId+") ",
                              '[date]'    : moment(newDate).format("DD/MM/YYYY"),
                            };
            // Format for send Email //
            var inputObj = {
                from         : adminId,
                to           : newID,
                templateName : 'Payment Complete',
                variables    : msgvariable,
            }
            sendMailNotification(inputObj);
            
            // Format for sending SMS //
            var smsObj = {
                to           : newID,
                templateName : 'Payment Complete',
                number       : mobNumber,
                variables    : msgvariable,
            }
            sendSMS(smsObj);

            // Format for sending notification //
            var notifictaionObj = {
              to           : newID,
              templateName : 'Payment Complete',
              variables    : msgvariable,
            }
            sendInAppNotification(notifictaionObj);
            self.ticketGeneration(Orders,index-1,matchCandidateIndex);
           
          }
        });
      }
     
    }else{
      return;
    }
  }
class PaymentGateway extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
        nav : 0,
      "subscription" : {
        "singleOrder" : Meteor.subscribe("singleOrder"),
      }
    };
    // this.ticketGeneration = this.ticketGeneration.bind(this);
   
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
    $('html, body').scrollTop(0);
  }
  cancelPayment(event){
    event.preventDefault();
    var path = "/ServiceInvoice/"+this.props.Orders.invoiceDetails.invoiceId;
    FlowRouter.go(path);
  }
  
  confirmPayment(event){ 
    event.preventDefault();
    var orderId = this.props.Orders._id;
    var orders  = this.props.Orders;
    // var todayDate = new Date();
    // if(this.props.Orders.serviceDetails!=undefined){
    //   var noOFDays = this.props.Orders.serviceDetails.serviceCompletionDays
    // }else{
    //   var noOFDays = this.props.Orders.packageDetails.packageCompletionDays      
    // }
    // var tatDate1 = moment().addWorkdays(parseInt(noOFDays),this.props.holidaysList);
    // let self = this;
    // this.props.Orders.tatDate = new Date(tatDate1);
    // if(tatDate1){
      
        Meteor.call('updateInvoice',this.props.Orders.invoiceNo,function (error,result) {
          if (error) {
              
          }else{
              // Meteor.call('updateOrderStatus',orderId,new Date(tatDate1),function (error,result) {
              // if (error) {
                
              // }else{
                
                // this.ticketGeneration(orders,0);
                if(orders){
                  
                  //Get length of verification data where candidate id match and get verifiedData length
                  var verificationDataLength = orders.candidateDetails.map((q)=> { if(q.candidateId == Meteor.userId()){ return q.verificationData.length;}  });
                  var matchCandidateIndex = orders.candidateDetails.findIndex(x=> x.candidateId == Meteor.userId());
                    // a.findIndex(x => x.prop2=="yutu");
                  
                  var verificationData = verificationDataLength.filter(verificationDataLength => verificationDataLength > 0);
                  var actualVerificationDataLen =  verificationData[0];
                  var index = actualVerificationDataLen - 1;
                 ticketGeneration(orders,index,matchCandidateIndex);
                }
              // }
            // });        
          }
        });

        var path = "/Receipt/"+orderId;
        FlowRouter.go(path);           
    // } //EOF if  
 
    
  }
  
  render(){
    if (!this.props.loading) {
      return(
        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <h1 className="text-center headerinvoice">Payment Gateway</h1>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 PaymentGatewayDIv">
                  <p>Payment Gateway will be added soon!</p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                  <button  type="submit" className="col-lg-3 col-md-4 col-xs-5 col-sm-5 btn ServiceProcessButtons pull-left" onClick={this.cancelPayment.bind(this)}>Back</button>
                  <button  type="submit" className="col-lg-3 col-md-4 col-xs-6 col-sm-5 btn ServiceProcessButtons pull-right" onClick={this.confirmPayment.bind(this)}>Confirm Payment</button>
                </div>
            </div>
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

PaymentGatewayContainer = withTracker(({params}) => {
    var id = FlowRouter.getParam('id');
    // 
    const postHandle = Meteor.subscribe('singleOrder',id);
    const HandleHolidays = Meteor.subscribe('holidaysList');
    // var editServices   = this.props.params.id;
    // 
    const Orders = Order.findOne({"_id" :id}) || {};
    
    // if (Orders) {
    //   var invoice = Order.findOne({"_id" :id}) || {};
    // }
    const loading = !postHandle.ready() && !HandleHolidays.ready();
    var HolidaysDB = HolidaysList.find({}).fetch();
    if(HolidaysDB.length){
      var holidaysList = [];
      for(i = 0 ;i < HolidaysDB.length; i++){
        holidaysList.push(HolidaysDB[i].holidayDate);
      }
      
    }

    // if(_id){
      return {
          loading,
          Orders,
          holidaysList,
      };
    // }
})(PaymentGateway);
export default PaymentGatewayContainer;