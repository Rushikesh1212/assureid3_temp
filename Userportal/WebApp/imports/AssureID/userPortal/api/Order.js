import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {RequestPool} from '/imports/AssureID/company/api/companyProfile.js';
// import {CompanyOrder} from '../../company/api/company.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
import { Invoice } from './Invoice.js';
import { CompanyProfile } from '/imports/AssureID/company/api/companyProfile.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js'; 
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import Moment from 'moment';

export const TempOrder = new Mongo.Collection("temporder");
export const Order = new Mongo.Collection("order");
if(Meteor.isServer){
    Meteor.publish('allOrders',()=>{
        return Order.find({});

    });
	  Meteor.publish('singleOrder',(_id)=>{
        return Order.find({"_id" : _id}); 
    });
     Meteor.publish('userOrder',(_id)=>{
      return Order.find({"userId" : _id});
    });
    Meteor.publish('userOrders',()=>{
      return Order.find({});
    });
    Meteor.publish('alluserOrders',(_id)=>{
      return Order.find({"userId": _id},{sort : {createdAt : -1}});
    });
    Meteor.publish('assureIdmatched',(assureid)=>{
       return Order.find({"companyDetails.companyAssureID" : assureid},{sort:{"createdAt": -1},limit: 5});
    });
    Meteor.publish('companyOrders',(assureid)=>{
       return Order.find({"companyDetails.companyAssureID" : assureid},{sort:{"createdAt": -1}});
    });
    Meteor.publish('allTempOrders',()=>{
      return TempOrder.find({});
    });
	  Meteor.methods({
      'insertOrder':function(newOrder) {      
         var orderObj = Order.findOne({}, {sort: { orderNo : -1}});
          if(orderObj){
           var orderNo = orderObj.orderNo + 1;
          }else{
            var orderNo = 1;
          }
          // var newDate     = new Date();
          // var serviceDate = moment(newDate).format('L');                           
          // var serviceDayNumbers = parseInt(newOrder.serviceDayNumbers);
          // var duration = newOrder.serviceDuration;
          // if (duration == 'Days') { 
          //   var tatDuration = 'd';
          // }else if (duration == 'Weeks') {
          //   var tatDuration = 'week';
          // }else if (duration == 'Months') {
          //   var tatDuration = 'M';
          // } 
          // var new_date  = moment(serviceDate, "MM-DD-YYYY").add(serviceDayNumbers, duration);
          // var day       = new_date.format('DD');                            
          // var month     = new_date.format('MM');                           
          // var year      = new_date.format('YYYY');                            
          // var tatDate   = year + '-' + month + '-' + day ;
          // 
          var id  = Order.insert({ 
              "orderNo"           : orderNo,
              "requestPoolId"     : newOrder.requestPoolId,
              "invoiceId"         : newOrder.invoiceId,
              "invoiceNo"         : newOrder.invoiceNo,
              "serviceId"         : newOrder.serviceId,
              "serviceName"       : newOrder.serviceName,
              "serviceDayNumbers" : newOrder.serviceDayNumbers,
              "serviceDuration"   : newOrder.serviceDuration,
              "serviceImage"      : newOrder.serviceImage,
              "serviceImgFileExt" : newOrder.serviceImgFileExt,
              "totalAmount"       : newOrder.totalAmount,
              // "tatDate"           : tatDate,
              "userId"            : newOrder.userId,
              "userName"          : newOrder.userName  ,
              "detailData"        : newOrder.detailData,
              "data"              : newOrder.data,
              "paymentStatus"     : 'unpaid',
              "orderStatus"       : newOrder.orderStatus,
              "invoiceDate"       : newOrder.createdAt,
              "createdAt"         :   new Date(),
          },(error, result)=>{
             if (error) {
                return error;
             }else{
               return result;
             }
          });
      return id;
     },

     insertNewOrder(orderDetails){
      var orderId = Order.insert(orderDetails,(error,result)=>{
        if(result){
          if(orderDetails.serviceDetails){
            var requestPoolData = {
              "orderId"      : result,
              "orderNo"      : orderDetails.orderNo,
              "orderDate"    : orderDetails.createdAt, 
              "assureId"     : orderDetails.candidateDetails[0].candidateAssureID,
              "serviceId"    : orderDetails.serviceDetails.serviceId,
              "serviceName"  : orderDetails.serviceDetails.serviceName,
              "createdAt"    : new Date(),
              "paidBy"       : "User",
              "orderPlacedBy" : "User",
              "tatDate"      : "",  
            };
          }else{
            var requestPoolData = {
              "orderId"      : result,
              "orderNo"      : orderDetails.orderNo,
              "orderDate"    : orderDetails.createdAt, 
              "assureId"     : orderDetails.candidateDetails[0].candidateAssureID,
              "packageId"    : orderDetails.packageDetails.packageId,
              "packageName"  : orderDetails.packageDetails.packageName,
              "createdAt"    : new Date(),
              "paidBy"       : "User",
              "orderPlacedBy" : "User",
              "tatDate"      : "",  
            };
          }
          RequestPool.insert(requestPoolData,(err,res)=>{
            if(res){
              
              Order.update(
                {"_id":result},
                {
                  $set:{
                    'candidateDetails.0.requestpoolId': res,
                  }
                }
              );
            }
          });
          
        }
      
      });
      return orderId;
    },
      /** Add Verification data in candidate details */
      updateOrderVerification(orderId,data){
         var updateOrder = Order.update(
          {"_id":orderId,'candidateDetails.candidateId':Meteor.userId()},
          {
            $set  :{
              'candidateDetails.$.verificationData': data,
              'candidateDetails.$.candidateVerificationStatus' : "Incomplete",
            }
 
          });

          
          return updateOrder;

      },
    //   /*Add invoice details in order */

      updateInvoiceDetailsInOrder(orderId,invoiceId){
        var orderDetails = Order.findOne({"_id":orderId});
        var invoiceDetails = Invoice.findOne({"_id":invoiceId});
        var paymentBy;
        var orderStatus;
        if(invoiceDetails && orderDetails){
          var paymentByData = orderDetails.paymentBy;
          
          if(paymentByData == "Company"){
            paymentBy = "Company";
            candidateVerificationStatus = "Paid";
            orderStatus                 = "Paid";
            
          }else{
            paymentBy = "Candidate Pay";
            orderStatus                 = "Paid";            
            candidateVerificationStatus = "Payment Pending";
            
                        
          }
          
          var updateInvoiceInOrder = Order.update(
            {'_id':orderId,"candidateDetails.candidateId":Meteor.userId()},
            {
              $set:{
                'invoiceDetails' :{
                  'invoiceId'     : invoiceDetails._id,
                  'invoiceNumber' : invoiceDetails.invoiceNo,
                  'invoiceDate'   : invoiceDetails.createdAt,
                },
                "orderStatus"	                                   : orderStatus,
                "paymentBy"	                                     : paymentBy,
                "amountPaid"	                                   : invoiceDetails.totalAmount,
                "candidateDetails.$.candidateAmountPaid"         : invoiceDetails.totalAmount,
                "candidateDetails.$.candidatepaymentStatus"      : paymentBy,
                "candidateDetails.$.candidateVerificationStatus" : candidateVerificationStatus
              }
            }
          )
        }

        return updateInvoiceInOrder;
      },

   	 'insertUsersCompanyOrder':function(newOrder) {      
   	     var orderObj = Order.findOne({}, {sort: { orderNo : -1}});
			    if(orderObj){
			     var orderNo = orderObj.orderNo + 1;
			    }else{
			      var orderNo = 1;
          }
          // var newDate     = new Date();
          // var serviceDate = moment(newDate).format('L');                           
          // var serviceDayNumbers = parseInt(newOrder.serviceDayNumbers);
          // var duration = newOrder.serviceDuration;
          // if (duration == 'Days') { 
          //   var tatDuration = 'd';
          // }else if (duration == 'Weeks') {
          //   var tatDuration = 'week';
          // }else if (duration == 'Months') {
          //   var tatDuration = 'M';
          // } 
          // var new_date  = moment(serviceDate, "MM-DD-YYYY").add(serviceDayNumbers, duration);
          // var day       = new_date.format('DD');                            
          // var month     = new_date.format('MM');                           
          // var year      = new_date.format('YYYY');                            
          // var tatDate   = year + '-' + month + '-' + day ;
          // 
   	      var id  = Order.insert({ 
              "orderNo"           : orderNo,
              "requestPoolId"     : newOrder.requestPoolId,
   	      	  "invoiceId"         : newOrder.invoiceId,
              "invoiceNo"         : newOrder.invoiceNo,
              "assureId"          : newOrder.assureId,
              "serviceId"         : newOrder.serviceId,
              "serviceName"       : newOrder.serviceName,
              "serviceDayNumbers" : newOrder.serviceDayNumbers,
              "serviceDuration"   : newOrder.serviceDuration,
              "serviceImage"      : newOrder.serviceImage,
              "serviceImgFileExt" : newOrder.serviceImgFileExt,
              "totalAmount"       : newOrder.totalAmount,
              // "tatDate"           : tatDate,
              "userId"            : newOrder.userId,
              "userName"          : newOrder.userName,
              "detailData"        : newOrder.detailData,
              "data"              : newOrder.data,
              "paymentStatus"     : 'unpaid',
              "orderStatus"       : newOrder.orderStatus,
              "invoiceDate"       : newOrder.createdAt,
              "companyReference"  : newOrder.companyReference,
              "createdAt"         :   new Date(),
   	      },(error, result)=>{
             if (error) {
                return error;
             }else{
             	 return result; 
             }
          });
            var requestPoolObj = RequestPool.findOne({"_id" : newOrder.requestPoolId});
             if (requestPoolObj) {
              var companyOrderId = requestPoolObj.companyOrderId;
                if (requestPoolObj.paidBy == "Company") {
                  var userAssureId = Meteor.users.findOne({"_id": newOrder.userId});
                  if (userAssureId.profile) {
                    var assureId = userAssureId.profile.assureId;
                    Meteor.call("updateOrder",id,requestPoolObj,function(error,result){
                      if (error) {
                        
                      }else{
                        Meteor.call("updateCompanyOrder",companyOrderId,assureId,id);
                         var orderId = id;
                          var orders  = Order.findOne({"_id" : id});
                          var todayDate = new Date();
                          var HolidaysDB = HolidaysList.find({}).fetch();
                           let self = this;

                          var tatDate1 = moment().addWorkdays(parseInt(newOrder.serviceDayNumbers),HolidaysDB);
                          if(tatDate1){
                            
                              Meteor.call('updateInvoice',newOrder.invoiceNo,function (error,result) {
                                if (error) {
                                    
                                }else{
                                    
                                    Meteor.call('updateOrderStatus',orderId,new Date(tatDate1),function (error,result) {
                                    if (error) {
                                      
                                    }else{
                                      
                                      this.ticketGeneration(orders,orders.data.length-1);
                                    }
                                  });        
                                }
                              }); 
                            }

                      }
                    }); 
                  }
                }
             }
          
      return id;
   	 },
     'updateOrder':function(id,requestPoolObj){
       Order.update({"_id": id},{
        $set: {
          "paymentStatus" : "paid",
          "tatDate"    : requestPoolObj.tatDate._d,
          "companyDetails" : {
            "companyAssureId" : requestPoolObj.companyAssureId,
            "companyOrderId"  : requestPoolObj.companyOrderId,
            "requestPoolId"   : requestPoolObj._id,
          }
        }
       });
     },
     'updateOrderStatus':function (orderId,tatDate) {
          Order.update({'_id' : orderId,'candidateDetails.candidateId':Meteor.userId()},
          {$set:{
              "paymentStatus"     : 'paid',
              "orderStatus"       : 'In Process',
              "paymentDate"       : new Date(),
              "tatDate"           : tatDate,
              "candidateDetails.$.candidateVerificationStatus" : "In Process"               
            }
          });
      },
      'updateOrderTicket':function (orderId,result) {
           Order.update(
              {"_id":orderId},
              {$push:
                  {ticket:{ "status" : "In Process",
                            "ticketId" : result,
                         }
                  }
              }
          ); 
      },

      //Anagha's code
      'insertTempOrder' : function(formValues){
          var candidateDetailsDB = Meteor.users.findOne({
                                    "profile.firstname" : formValues.candidateDetails[0].candidateFirstName,
                                    "profile.lastname"  : formValues.candidateDetails[0].candidateLastName,
                                    "profile.mobNumber" : formValues.candidateDetails[0].candidateMobile,
                                    "emails.0.address" : formValues.candidateDetails[0].candidateEmailId});   
          if(candidateDetailsDB){
            formValues.candidateDetails[0].candidateId       = candidateDetailsDB._id;
            formValues.candidateDetails[0].candidateAssureID = candidateDetailsDB.profile.assureId;
            formValues.candidateDetails[0].selectionStatus   = 'unSelected';
            formValues.candidateDetails[0].selected          = false;
          }
          
          TempOrder.insert(formValues,(err,result)=>{
            if(err){
              
            }else{
              return result;
            }
          });
      },
      'updateTempOrder' : function(id,formValues){
        var candidateDetailsDB = Meteor.users.findOne({
                                    "profile.firstname" : formValues.candidateFirstName,
                                    "profile.lastname"  : formValues.candidateLastName,
                                    "profile.mobNumber" : formValues.candidateMobile,
                                    "emails.0.address" : formValues.candidateEmailId});   
        if(candidateDetailsDB){
          formValues.candidateId       = candidateDetailsDB._id;
          formValues.candidateAssureID = candidateDetailsDB.profile.assureId;
          formValues.selectionStatus   = 'unSelected';
          formValues.selected          = false;
        }
        TempOrder.update(
          {"_id" : id},
          {$push : {candidateDetails: formValues}},
          (err,result)=>{
            if(err){
              
            }else{
              return result;
            }
          });
      },
      'changeSelectionCandidate' : function(tempOrderId,index,status,selectedStatus){
        TempOrder.update(
          {"_id":tempOrderId},
          {$set:{

            ["candidateDetails."+index+".selectionStatus"] : status,
            ["candidateDetails."+index+".selected"]        : selectedStatus,
            }
          },
          (err,result)=>{
            if(err){
              
            }else{
              return result;
            }
        });
      },
      'newUserAssureID' : function(){
        var latestUsersDetails = Meteor.users.findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
        // 
        if(latestUsersDetails){
          if(latestUsersDetails.profile){
            if(latestUsersDetails.profile.assureId){
              var str = latestUsersDetails.profile.assureId;
              var splitStr = str.split('-');
              //splitStr[0] - Country Code
              //splitStr[1] - Character Code
              //splitStr[2] - Number
              //Number Logic
              // document.getElementById("demo").innerHTML = str;
              var firstChar = splitStr[1].substr(2,1);
              var middleChar = splitStr[1].substr(1,1);
              var lastChar = splitStr[1].substr(0,1);
              //Charcter Code Calculation
              //if DEG - then G - last E - middle D - first
              //var first2Char = splitStr[1].substr(1,1); /*second digit*/
               
              var number = parseInt(splitStr[2]);
              var last = number + 1;
              var last0 = '0';
              if(last > 0 && last < 11){
                last0 = '00000' + last;
                if(last == 10){last0 = '0000' + last;}
              }else if(last > 10 && last < 101){
                last0 = '0000' + last;
                if(last == 100){last0 = '000' + last;}
              }else if(last > 100 && last < 1001){
                last0 = '000' + last;
                if(last == 1000){last0 = '00' + last;}
              }else if(last > 1000 && last < 10001){
                last0 = '00' + last;
                if(last == 10000){last0 = '0' + last;}
              }else if(last > 10000 && last < 100001){
                last0 = last;
              }else if(last > 999999){
                last0 = '000000';         
                if(firstChar != 'Z'){
                  var firstAscii = firstChar.charCodeAt();
                  firstAscii = firstAscii + 1;
                  firstChar = String.fromCharCode(firstAscii);
                }else{
                  firstChar = 'A'; 
                  if(middleChar != 'Z'){
                    var middleAscii  = middleChar.charCodeAt();
                    middleAscii  = middleAscii  + 1;
                    middleChar = String.fromCharCode(middleAscii );
                  }else{
                    middleChar = 'A'; 
                    if(type == 'user'){
                      var lastAscii = lastChar.charCodeAt();
                      if(lastChar == 'B'){
                        lastAscii = lastAscii + 2;
                      }else{
                        lastAscii = lastAscii + 1;
                      }
                      lastChar = String.fromCharCode(lastAscii );
                    }
                  } 
                }
              }
              var newAssureID = splitStr[0] + '-' + lastChar+middleChar+firstChar + '-' + last0;
            }//EOF profile.assureID
          }else{
          var newAssureID = "IN-AAA-000000";
        }
        }else{
          var newAssureID = "IN-AAA-000000";
        }
        
        return newAssureID;
      },
      'insertOrderByCompany' : function(orderTempDetails){
        var candidateDetails = orderTempDetails.candidateDetails;
        var selectedAry = candidateDetails.filter(e => e.selectionStatus !== 'unSelected')
        orderTempDetails.candidateDetails = selectedAry;
        
        //Insert into Order Table 
        var order = Order.findOne({},{sort: {createdAt: -1}});
        if(order){
          var orderNo = parseInt(order.orderNo) + 1;
        }else{
          var orderNo = 1;
        }
        orderTempDetails.orderNo = orderNo;
        if(orderTempDetails.orderNo){
          var orderId = Order.insert(orderTempDetails,(err,result)=>{
            if(err){
              
            }else{
              var orderDetails = Order.findOne({"_id":orderId});
              if(orderDetails){
                if(orderDetails.candidateDetails){
                  // var maxLen = orderDetails.candidateDetails.length;
                  for (var i = 0; i < orderDetails.candidateDetails.length; i++) {
                    if(orderDetails.serviceDetails){
                      var companyReferences = {
                        "companyId"        : orderDetails.companyDetails.companyId,
                        "companyName"      : orderDetails.companyDetails.companyName,
                        "companyOrderId"   : orderDetails._id,
                        "serviceId"        : orderDetails.serviceDetails.serviceId,
                        "serviceName"      : orderDetails.serviceDetails.serviceName,
                        "status"           : 'Incomplete',
                      }
                      var companyValues = {
                        "companyId"        : orderDetails.companyDetails.companyId,
                        "companyName"      : orderDetails.companyDetails.companyName,
                        "companyOrderId"   : orderDetails._id,
                        "serviceId"        : orderDetails.serviceDetails.serviceId,
                        "serviceName"      : orderDetails.serviceDetails.serviceName,
                        "status"           : 'Incomplete',
                      }
                      var requestPool = {
                        "orderId"      : orderDetails._id,
                        "orderNo"      : orderDetails.orderNo,
                        "orderDate"    : orderDetails.createdAt, 
                        "assureId"     : '-',
                        "serviceId"    : orderDetails.serviceDetails.serviceId,
                        "serviceName"  : orderDetails.serviceDetails.serviceName,
                        "createdAt"    : new Date(),
                        "paidBy"       : orderDetails.paymentBy,
                        "orderPlacedBy" : "Company",
                        "tatDate"      : "",
                      }
                    }else{
                      var companyReferences = {
                        "companyId"        : orderDetails.companyDetails.companyId,
                        "companyName"      : orderDetails.companyDetails.companyName,
                        "companyOrderId"   : orderDetails._id,
                        "packageId"        : orderDetails.packageDetails.packageId,
                        "packageName"      : orderDetails.packageDetails.packageName,
                        "status"           : 'Incomplete',
                      }
                      var companyValues = {
                        "companyId"        : orderDetails.companyDetails.companyId,
                        "companyName"      : orderDetails.companyDetails.companyName,
                        "companyOrderId"   : orderDetails._id,
                        "packageId"        : orderDetails.packageDetails.packageId,
                        "packageName"      : orderDetails.packageDetails.packageName,
                        "status"           : 'Incomplete',
                      }
                      var requestPool = {
                        "orderId"      : orderDetails._id,
                        "orderNo"      : orderDetails.orderNo,
                        "orderDate"    : orderDetails.createdAt, 
                        "assureId"     : '-',
                        "packageId"    : orderDetails.packageDetails.packageId,
                        "packageName"  : orderDetails.packageDetails.packageName,
                        "createdAt"    : new Date(),
                        "paidBy"       : orderDetails.paymentBy,
                        "orderPlacedBy" : "Company",
                        "tatDate"      : "",
                      }
                    }
                    if(companyReferences && companyValues && requestPool){
                      // 
                      Meteor.call('completeBulkOrder',orderDetails.candidateDetails,i,requestPool,companyValues,companyReferences,function(error,result){
                        if(error){
                          
                        }else{
                          
                        }
                      });
                    }
                  }
                }
              }
              //Delete Data from TempOrder collections
              TempOrder.remove({"_id":orderTempDetails._id});
            }
          });
          return orderId;
        }
      },
      'completeBulkOrder' : function(candidateDetails,len,requestPool,companyValues,companyReferences){
          if(candidateDetails[len].candidateAssureID){
            requestPool.assureId = candidateDetails[len].candidateAssureID;
            RequestPool.insert(requestPool,(err,res)=>{
              if(err){
                
              }else{
                if(res){
                  Meteor.call("addCompanyReferences",companyValues,candidateDetails[len].candidateAssureID, function(error,result){
                    if(error){
                      
                    }else{
                      // 

                      Meteor.call("sendNotitificationByCompany",candidateDetails[len].candidateId,candidateDetails[len].candidateEmailId,companyValues.companyName,newAssureID,function(err,res){
                         if(err){
                            
                         }else{
                           
                         }
                      });
                    }
                  });
                }
              }
            });
          }else{
            //AssureID Absent
             var latestUsersDetails = Meteor.users.findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
              // 
              if(latestUsersDetails){
                if(latestUsersDetails.profile){
                  if(latestUsersDetails.profile.assureId){
                    var str = latestUsersDetails.profile.assureId;
                    var splitStr = str.split('-');
                    //splitStr[0] - Country Code
                    //splitStr[1] - Character Code
                    //splitStr[2] - Number
                    //Number Logic
                    // document.getElementById("demo").innerHTML = str;
                    var firstChar  = splitStr[1].substr(2,1);
                    var middleChar = splitStr[1].substr(1,1);
                    var lastChar   = splitStr[1].substr(0,1);
                    //Charcter Code Calculation
                    //if DEG - then G - last E - middle D - first
                    //var first2Char = splitStr[1].substr(1,1); /*second digit*/
                     
                    var number = parseInt(splitStr[2]);
                    var last = number + 1;
                    var last0 = '0';
                    if(last > 0 && last < 11){
                      last0 = '00000' + last;
                      if(last == 10){last0 = '0000' + last;}
                    }else if(last > 10 && last < 101){
                      last0 = '0000' + last;
                      if(last == 100){last0 = '000' + last;}
                    }else if(last > 100 && last < 1001){
                      last0 = '000' + last;
                      if(last == 1000){last0 = '00' + last;}
                    }else if(last > 1000 && last < 10001){
                      last0 = '00' + last;
                      if(last == 10000){last0 = '0' + last;}
                    }else if(last > 10000 && last < 100001){
                      last0 = last;
                    }else if(last > 999999){
                      last0 = '000000';         
                      if(firstChar != 'Z'){
                        var firstAscii = firstChar.charCodeAt();
                        firstAscii = firstAscii + 1;
                        firstChar = String.fromCharCode(firstAscii);
                      }else{
                        firstChar = 'A'; 
                        if(middleChar != 'Z'){
                          var middleAscii  = middleChar.charCodeAt();
                          middleAscii  = middleAscii  + 1;
                          middleChar = String.fromCharCode(middleAscii );
                        }else{
                          middleChar = 'A'; 
                          if(type == 'user'){
                            var lastAscii = lastChar.charCodeAt();
                            if(lastChar == 'B'){
                              lastAscii = lastAscii + 2;
                            }else{
                              lastAscii = lastAscii + 1;
                            }
                            lastChar = String.fromCharCode(lastAscii );
                          }
                        } 
                      }
                    }
                    var newAssureID = splitStr[0] + '-' + lastChar+middleChar+firstChar + '-' + last0;
                  }else{
                    var newAssureID = "IN-AAA-000000";
                  }//EOF profile.assureID
                  
                }else{
                var newAssureID = "IN-AAA-000000";
              }
               var userValues = {
                    'firstname'        : (candidateDetails[len].candidateFirstName).trim(),
                    'lastname'         : (candidateDetails[len].candidateLastName).trim(),
                    'signupEmail'      : candidateDetails[len].candidateEmailId,
                    'mobNumber'        : candidateDetails[len].candidateMobile,
                    'signupPassword'   : 'companyuser123',
                    'aadharCard'       : candidateDetails[len].candidateAadharNo,
                    'assureId'         : newAssureID,
                  }
                  Meteor.call('userCreateAccount',userValues,(error,result)=>{
                    if(error){
                      
                    }else{
                      var newuserId = result;
                      // 
                      Order.update(
                        {"_id" : requestPool.orderId, "candidateDetails.candidateEmailId" : userValues.signupEmail,"candidateDetails.candidateMobile" : userValues.mobNumber},
                        {$set:{
                          ["candidateDetails."+len+".candidateId"] : newuserId,
                          ["candidateDetails."+len+".candidateAssureID"] : newAssureID, 
                        }
                      },(error,result)=>{
                        if(error){
                          
                        }else if(result){
                          
                          
                          // Id of new USER 
                          // var newID = newuserId;
                          var basicformValues = {
                            "userId"          : newuserId,
                            "firstName"       : userValues.firstname,
                            "lastName"        : userValues.lastname,
                            "fatherFirstName" : '',
                            "fatherLastName"  : '',
                            "motherFirstName" : '',
                            "motherLastName"  : '',
                            "spouseFirstName" : '',
                            "spouseLastName"  : '',
                            "gender"          : 'Female',
                            "dateOfBirth"     : '',
                            "mobileNo"        : userValues.mobNumber,
                            "altMobileNo"     : '',
                            "emailId"         : userValues.signupEmail,
                            "altEmailId"      : '',
                            'assureId'        : newAssureID,
                            "proofType"       : '',
                            "proofOfDocument" : '', 
                            "fileExt"         : '',
                            "fileName"        : '',
                            "aadharCard"      : userValues.aadharCard,
                            "companyReferences" : [companyReferences],
                          }
                          if(basicformValues){
                            Meteor.call("insertBasicData", basicformValues, function(error,result){
                              if(error){
                               
                              }else{
                                // if(result){
                                  // 
                                  var mobile = userValues.mobNumber;
                                  var mobileotp = Math.floor(1000 + Math.random() * 9000);
                                  var emailotp = Math.floor(100000 + Math.random() * 900000);
                                  if(mobile && mobileotp && emailotp){
                                    // 
                                    Meteor.call('addOTP', newuserId , mobileotp, emailotp, function(error,result){
                                      if(error){
                                             
                                      }else{
                                        if(result){
                                          
                                          Meteor.call('addRoles', newuserId , "user", function(error,result){
                                            if(error){
                                                   
                                            }else{    
                                              if(result){
                                                
                                                requestPool.assureId = basicformValues.assureId;
                                                RequestPool.insert(requestPool,(err,res)=>{
                                                  if(err){
                                                    
                                                  }else{
                                                    if(res){
                                                      Meteor.call("addCompanyReferences",companyValues,candidateDetails[len].candidateAssureID,function(error,result){
                                                        if(error){
                                                          
                                                        }else{
                                                          Meteor.call("sendNotitificationByCompany",newuserId,basicformValues.emailId,companyValues.companyName,newAssureID,function(err,res){
                                                             if(err){
                                                                
                                                             }else{
                                                               
                                                             }
                                                          });
                                                          var mobileotpStr = mobileotp.toString();
                                                          var smsBody = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
                                                          Meteor.call('SEND_SMS',mobile,smsBody,function(error,result){
                                                            if(error){
                                                              
                                                            }else{
                                                              if(result){
                                                                
                                                                  Meteor.call('sendVerificationLinkToUser',newuserId,function(error,result){
                                                                    if(error){
                                                                      
                                                                    }else{  
                                                                      if(result){
                                                                      
                                                                                                                               
                                                                    }
                                                                  } //end else
                                                                });
                                                              }
                                                            }
                                                          });

                                                          
                                                        }
                                                      });
                                                    }
                                                  }
                                                });
                                                
                                              }
                                            }
                                          });
                                        }
                                      }
                                    });
                                  }
                                // }
                              }
                            });
                          }
                        }
                      });
                    }
                  });
              }else{
                var newAssureID = "IN-AAA-000000";
              }
                  
          }
         
      },
      // results.data,typeid,type,assureId
      'insertBulkOrderCompany' : function(csvObject,typeid,type,companyassureId){
        check( csvObject, Array);
        // 
        // var csvUploaded = true;
        if (csvObject.length <= 0) {
          // csvUploaded  = false;
        }else{

        var orderDate = new Date();
        orderDate = Moment(orderDate).format('MMM DD YYYY');
        var companyProfileObj = CompanyProfile.findOne({'companyAssureID':companyassureId});
          if(companyProfileObj){
            if(companyProfileObj.paymentBy == 'Company'){
              var candidatepaymentStatus = 'Paid';
            }else{
              var candidatepaymentStatus = 'unPaid';
            }
            if(type == 'Service'){
              var serviceDetailsData = Services.findOne({"_id":typeid});
              if(serviceDetailsData){
                var serviceDetails  = {
                    "serviceId"                   : typeid,
                    "serviceName"                 : serviceDetailsData.serviceName,
                    "serviceCompletionDays"       : serviceDetailsData.serviceDayNumbers,
                    "serviceImage"                : serviceDetailsData.image,
                    "serviceFileExt"              : serviceDetailsData.fileExt,
                    "serviceImgName"              : serviceDetailsData.fileName,
                    "serviceRate"                 : serviceDetailsData.serviceRate,
                    "verificationType"            : serviceDetailsData.serviceRequired,
                }
              }
            }else{
              var packageDetailsData = Packages.findOne({"_id":typeid , "packageStatus" : "Active"});
              if(packageDetailsData){
                var packageDetails = {
                  "packageId"                   : typeid,
                  "packageName"                 : packageDetailsData.packageName,
                  "packageDuration"             : packageDetailsData.packageDuration,
                  "packageImage"                : packageDetailsData.image,
                  "packageFileExt"              : packageDetailsData.fileExt,
                  "packageImgName"              : packageDetailsData.fileName,
                  "packageDiscount"             : packageDetailsData.packageDiscount,
                };
                var serviceDetailsPkgData = [];
                for(s = 0 ; s < packageDetailsData.selectedServices.length; s++){
                  var subServiceDetails = Services.findOne({"_id":packageDetailsData.selectedServices[s].serviceId});
                  
                  if(subServiceDetails){
                    sub_serviceDetails  = {
                        "serviceId"                   : subServiceDetails._id,
                        "serviceName"                 : subServiceDetails.serviceName,
                        "serviceCompletionDays"       : subServiceDetails.serviceDayNumbers,
                        "serviceImage"                : subServiceDetails.image,
                        "serviceFileExt"              : subServiceDetails.fileExt,
                        "serviceImgName"              : subServiceDetails.fileName,
                        "serviceRate"                 : subServiceDetails.serviceRate,
                        "verificationType"            : subServiceDetails.serviceRequired,
                        "serviceRequired"             : subServiceDetails.serviceRequired,
                    }
                    serviceDetailsPkgData.push(sub_serviceDetails);
                  }
                }
                packageDetails.servicesIncluded = serviceDetailsPkgData;
              }
            }
            if(serviceDetails || packageDetails ){
              var tempCompanyOrder ={
                "companyDetails": {
                  "companyId"                   : companyProfileObj._id,
                  "companyAssureID"             : companyassureId,
                  "companyName"                 : companyProfileObj.companyName,
                  "orderPlacedById"             : Meteor.userId(),
                  "orderPlacedByName"           : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
                  "orderPlacedByAssureID"       : Meteor.user().profile.assureId,
                },
                "serviceDetails"                : serviceDetails,
                "packageDetails"                : packageDetails,
                "orderStatus"                   : candidatepaymentStatus,
                "paymentBy"                     : companyProfileObj.paymentBy,
                "createdAt"                     : new Date(),
                "orderDate"                     : orderDate,
                "type"                          : 'bulk'
              }//EOF tempCompanyOrder
              if(tempCompanyOrder){
                TempOrder.insert(tempCompanyOrder,(err,result)=>{
                  if(err){
                    
                  }else{
                    var tempOrderId =  result;
                    //code to read from the csv file and add into temp file
                    
                    var uploadSyncArr = [];
                    if(csvObject){
                      UserSession.set("allProgressbarSession", csvObject.length-2, Meteor.userId());
                      if(csvObject[0].FirstName && csvObject[0].LastName && csvObject[0].EmailID && csvObject[0].MobileNo){
                        
                        for(i=0;i<csvObject.length;i++){
                          //scan candidate info and insert into TempOder collection
                          if(csvObject[i].FirstName && csvObject[i].LastName && csvObject[i].EmailID && csvObject[i].MobileNo){
                            var candidateInfo = {
                              "candidateFirstName"          : csvObject[i].FirstName,
                              "candidateLastName"           : csvObject[i].LastName,
                              "candidateEmailId"            : csvObject[i].EmailID,
                              "candidateMobile"             : csvObject[i].MobileNo,
                              "candidateAadharNo"           : csvObject[i].AadharNumber,
                              "candidatepaymentBy"          : tempCompanyOrder.paymentBy,
                              "candidatepaymentStatus"      : tempCompanyOrder.orderStatus,
                              "createdAt"                   : new Date(),
                              "selectionStatus"             : 'Selected',
                              "selected"                    : true,
                              // "candidateId"                 : '',
                              // "candidateAssureID"           : '',
                              // "selectionStatus"             : 'unSelected',
                              // "selected"                    : false,
                            }
                            Meteor.call("updateTempOrder",tempOrderId,candidateInfo, function(error,result){
                              if(error){
                                
                              }else{
                                // swal("Done","Basic Information inserted successfully!"); 
                                // csvUploaded = true;
                              }
                            });//EOF updateTempOrder
                          }//EOF valid data
                        }//EOF csvOject For loop
                        
                      }else{
                       // swal("Oops..!","Something went wrong","error");
                       // 
                       
                       Meteor.call('removeTempOrder',tempOrderId,function(error,result){
                        if (error) {

                        }else{
                          csvUploaded = false;
                        }
                       });
                       
                      }
                    }else{
                      // csvUploaded = false;
                      // return csvUploaded;
                    }
                  }
                });
              }
            }
          }//EOF companyProfileObj
        }
        // 
        // return csvUploaded;
      },
      'deleteUserFromComapnyDetails':function(tempOrderId,index) {
        TempOrder.update(
          {"_id" : tempOrderId},
          {$unset: 
              {
                ['candidateDetails.'+index] : 1 ,  
              }
          }
        ); 
        TempOrder.update(
          {"_id" : tempOrderId},
          {$pull: 
              {
                ['candidateDetails'] : null ,
              }
          }
        ); 
      },
      'removeTempOrder':function(tempOrderId){
        TempOrder.remove({"_id": tempOrderId});
      },
      'sendNotitificationByCompany':function(newuserId,newuseremailId,companyName,newAssureID){
        var adminData   = Meteor.users.findOne({'roles' : "admin"});
        if (adminData) {
          var adminId  = adminData._id;
        }
        var userData    = Meteor.users.findOne({"_id" : newuserId});
        if (userData) {
          if (userData.profile) {
            var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
            var assureId    = userData.profile.assureId;
            var mobNumber   = userData.profile.mobNumber;
          }
        } 
        var newDate     = new Date();
        var msgvariable = {                       
          '[username]'    : firstLastNm+"("+assureId+") ",
          '[companyName]' : companyName,
          '[userEmailId]' : newuseremailId,
          '[date]'        : moment(newDate).format("DD/MM/YYYY"),
        };
        // 
        if(newAssureID){
        
          // Format for send Email //
          var inputObj = {
              from         : adminId,
              to           : newuserId,
              templateName : 'Company Non-AssureID Users',
              variables    : msgvariable,
          }
          sendMailNotification(inputObj);
          
          // Format for sending SMS //
          var smsObj = {
              to           : newuserId,
              templateName : 'Company Non-AssureID Users',
              number       : mobNumber,
              variables    : msgvariable,
          }
          // 
          sendSMS(smsObj);

          // Format for sending notification //
           var notifictaionObj = {
             to           : newuserId,
             templateName : 'Company Non-AssureID Users',
             variables    : msgvariable,
           }
           sendInAppNotification(notifictaionObj);
        }else{
          
          // Format for send Email //
          var inputObj = {
              from         : adminId,
              to           : newuserId,
              templateName : 'Company AssureID Users',
              variables    : msgvariable,
          }
          sendMailNotification(inputObj);
          
          // Format for sending SMS //
          var smsObj = {
              to           : newuserId,
              templateName : 'Company AssureID Users',
              number       : mobNumber,
              variables    : msgvariable,
          }
          // 
          sendSMS(smsObj);

            // Format for sending notification //
           var notifictaionObj = {
             to           : newuserId,
             templateName : 'Company AssureID Users',
             variables    : msgvariable,
           }
           sendInAppNotification(notifictaionObj);
        }
      }

  });
}