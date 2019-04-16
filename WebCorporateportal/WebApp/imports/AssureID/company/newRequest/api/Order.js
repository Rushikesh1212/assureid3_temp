import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
// import { RequestPool } from '/imports/website/company/api/company.js';
// import {CompanyOrder} from '../../company/api/company.js';
// import {HolidaysList} from '../../../dashboard/forms/api/HolidaysList.js';
// import { Invoice } from '/imports/AssureID/company/newRequest/api/Invoice.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import '/imports/admin/notificationManagement/components/SendMailnNotification.jsx';
// import {Packages} from '/imports/dashboard/reactCMS/api/Package.js';
// import Moment from 'moment';

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
    Meteor.publish('matchedcompanyOrders',(assureid,serviceId)=>{
       return Order.find({"companyDetails.companyAssureID" : assureid, "serviceDetails.serviceId" :serviceId},{sort:{"createdAt": -1}});
    });
    Meteor.publish('matchedCompOrdersContractId',(assureid,contractId)=>{
       return Order.find({"companyDetails.companyAssureID" : assureid, "companyDetails.contractId" :contractId},{sort:{"createdAt": -1}});
    });    

	  Meteor.methods({
      // insert oredr by company
      'insertOrderByCompany' : function(orderTempDetails){
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
              console.log('insertOrderByCompany error ',err);
            }else{
              var orderDetails = Order.findOne({"_id":orderId});
              if(orderDetails){
                if(orderDetails.candidateDetails){
                  var maxLen = orderDetails.candidateDetails.length;
                  var totalcount = 0;
                  for (var i = 0; i < maxLen; i++) {
                    var candidateUser = Meteor.users.findOne({
                                  "profile.firstname" : orderDetails.candidateDetails[i].candidateFirstName,
                                  "profile.lastname"  : orderDetails.candidateDetails[i].candidateLastName,
                                  "profile.mobNumber" : orderDetails.candidateDetails[i].candidateMobile,
                                  "emails.address"    : orderDetails.candidateDetails[i].candidateEmailId,
                              });
                    if (candidateUser) {
                      var userId = candidateUser._id;
                      var userAssureId = candidateUser.profile.assureId;
                       Order.update(
                          {"_id" : orderId, "candidateDetails.candidateEmailId" : orderDetails.candidateDetails[i].candidateEmailId,"candidateDetails.candidateMobile" : orderDetails.candidateDetails[i].candidateMobile},
                          {$set:{
                            ["candidateDetails."+i+".candidateId"]       : userId,
                            ["candidateDetails."+i+".candidateAssureID"] : userAssureId, 
                          }
                        }
                        );
                       
                       Meteor.call("sendVerifivacationData",userId,orderDetails.candidateDetails[i].verificationData,i,orderId,function (error,result) {
                         if (error) {
                            console.log(error.reason);
                         }else{
                           // console.log("data send");
 
                         }
                       });
                    }else{
                       Meteor.call("createAssureID",orderDetails.candidateDetails[i],i,orderId,function (error,result) {
                         if (error) {
                          console.log(error.reason);
                         }else{
                          // console.log("result");
                         }
                       });
                    }
                    totalcount = totalcount + orderDetails.candidateDetails[i].verificationData.length;
                  }
                  Meteor.call('updateCountInContract',orderTempDetails.companyDetails.companyAssureID,orderTempDetails.companyDetails.contractId,orderTempDetails.serviceDetails.serviceId , totalcount);
                }
              }
              //Delete Data from TempOrder collections
              Meteor.call('removeTempOrderId',orderTempDetails._id);
            }
          });
          return orderId;
        }
      },

      // genrate assureID methos
      'createAssureID': function (candidateDetails,index,orderId) {
        //AssureID Absent
         var latestUsersDetails = Meteor.users.findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
          console.log("latestUsersDetails",latestUsersDetails);
         if(latestUsersDetails){
            if(latestUsersDetails.profile){
              if(latestUsersDetails.profile.assureId){
                var str = latestUsersDetails.profile.assureId;
                console.log("str",str);
                var splitStr = str.split('-');
                
                var firstChar  = splitStr[1].substr(2,1);
                var middleChar = splitStr[1].substr(1,1);
                var lastChar   = splitStr[1].substr(0,1);
                //Charcter Code Calculation
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
              }
              console.log("present AssureID",newAssureID);
              Meteor.call("createUserByCompany",candidateDetails,index,orderId,newAssureID,function (error,result) {
                if (error) {
                  console.log(error.reason);
                }else{
                  console.log("result user created");
                }
              });
            }
          }else{
             var newAssureID = "IN-AAA-000000";
               Meteor.call("createUserByCompany",candidateDetails,index,orderId,newAssureID,function (error,result) {
                if (error) {
                  console.log(error.reason);
                }else{
                  console.log("result user created");
                }
              });
          }

      },

      // // create user by company method
      // 'createUserByCompany':function (candidateDetails,index,orderId,newAssureID) {
      //    console.log("newAssureID",newAssureID);
      //     var userValues = {
      //       'firstname'        : (candidateDetails.candidateFirstName).trim(),
      //       'lastname'         : (candidateDetails.candidateLastName).trim(),
      //       'signupEmail'      : candidateDetails.candidateEmailId,
      //       'mobNumber'        : candidateDetails.candidateMobile,
      //       'signupPassword'   : 'assureid123',
      //       'aadharCard'       : candidateDetails.candidateAadharNo,
      //       'assureId'         : newAssureID,
      //     }
      //     console.log("userValues",userValues);
      //     //start of user create method  
      //     Meteor.call('userCreateAccountByCompany',userValues,(error,result)=>{
      //       if(error){
      //       }else{
      //         var newuserId = result;
      //         //start of order update method
      //         Order.update(
      //             {"_id" : orderId, "candidateDetails.candidateEmailId" : userValues.signupEmail,"candidateDetails.candidateMobile" : userValues.mobNumber},
      //             {$set:{
      //               ["candidateDetails."+index+".candidateId"]       : newuserId,
      //               ["candidateDetails."+index+".candidateAssureID"] : newAssureID, 
      //             }
      //           },(error,result)=>{
      //             if (error) {

      //             }else{
      //               var basicformValues = {
      //                 "userId"          : newuserId,
      //                 "firstName"       : userValues.firstname,
      //                 "lastName"        : userValues.lastname,
      //                 "fatherFirstName" : '',
      //                 "fatherLastName"  : '',
      //                 "motherFirstName" : '',
      //                 "motherLastName"  : '',
      //                 "spouseFirstName" : '',
      //                 "spouseLastName"  : '',
      //                 "gender"          : 'Female',
      //                 "dateOfBirth"     : '',
      //                 "mobileNo"        : userValues.mobNumber,
      //                 "altMobileNo"     : '',
      //                 "emailId"         : userValues.signupEmail,
      //                 "altEmailId"      : '',
      //                 'assureId'        : newAssureID,
      //                 "proofType"       : '',
      //                 "proofOfDocument" : '', 
      //                 "fileExt"         : '',
      //                 "fileName"        : '',
      //                 "aadharCard"      : userValues.aadharCard,
      //               }
      //               if(basicformValues){
      //                 //start of insert basic data
      //                 Meteor.call("insertBasicData", basicformValues, function(error,result){
      //                   if(error){
                         
      //                   }else{
      //                     var mobile = userValues.mobNumber;
      //                     var mobileotp = Math.floor(1000 + Math.random() * 9000);
      //                     var emailotp = Math.floor(100000 + Math.random() * 900000);
      //                     if(mobile && mobileotp && emailotp){
      //                       //add otp method starts
      //                       Meteor.call('addOTP', newuserId , mobileotp, emailotp, function(error,result){
      //                         if(error){
                                     
      //                         }else{
      //                           if(result){
      //                             //add roles method starts
      //                             Meteor.call('addRoles', newuserId , "user", function(error,result){
      //                               if(error){
                                           
      //                               }else{    
      //                                 if(result){
      //                                   var mobileotpStr = mobileotp.toString();
      //                                   var smsBody = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
      //                                   Meteor.call('SEND_SMS',mobile,smsBody,function(error,result){
      //                                     if(error){
                                            
      //                                     }else{
      //                                     }
      //                                   });                                                                                          
      //                                 }
      //                               }//end of else
      //                             });//add roles method ends
      //                           }//end of else
      //                         }// end of else
      //                       });//add otp method ends
      //                     }//end of if 
      //                   }//end of else
      //                 });//end of insert basic data
      //               }//end of if
      //             }//end of else
      //           }
      //         );//end of order update method
      //     }
      //   });//end of user create method      
      // },

      //Update id in verification data in candidate details
      "updateIdInOrders":function (orderId,candidateIndex,verificationId,id,verificationIndex) {
        Order.update(
            {'_id': orderId},
            {$set:{
              ['candidateDetails.'+candidateIndex+'.verificationData.'+verificationIndex+'.verificationId']: verificationId,
              ['candidateDetails.'+candidateIndex+'.verificationData.'+verificationIndex+'.'+id]           : verificationId,
            }}
          );
      },
      
      'updateOrdertatdate':function (orderId,tatDate) {
          Order.update({'_id' : orderId},
          {$set:{
              "tatDate"           : tatDate,
            }
          }); 
      },
      'InsertImageInOrder':function(orderId,userId,dataIndex,prooftype,documents) {  
          Order.update(
            {'_id': orderId, "candidateDetails.candidateId" : userId},
            {$push :{
              ['candidateDetails.$.verificationData.'+dataIndex+'.documents']     : documents,
            }}
          );
      },
      'delDocumentsFromVerificationData':function (orderId,candidateId,verificationDataIndex,documentIndex) {
        Order.update({'_id': orderId, "candidateDetails.candidateId" : candidateId},{
          $unset:{
            ['candidateDetails.$.verificationData.'+verificationDataIndex+'.documents.'+documentIndex] : 1
          }
        });
        Order.update(
          {'_id': orderId, "candidateDetails.candidateId" : candidateId},
          {$pull: 
              {
                ['candidateDetails.$.verificationData.'+verificationDataIndex+'.documents'] : null ,
              }
          }
        ); 
      },


      //Code By Anagha as per Discussion on 28 sept
      'insertOrderByCompanyWithOutTemp' : function(basicOrderDetails,candidateBasicData,orderDetailIndex,informationFilledBy){
        var returnCandidateDetails = {
            candidateId         : '', 
            candidateAssureID   : '', 
            candidateFirstName  : candidateBasicData.candidateFirstName,
            candidateLastName   : candidateBasicData.candidateLastName,
            candidateMobile     : candidateBasicData.candidateMobile,
            candidateAadharCard : candidateBasicData.candidateAadharNo, 
            candidateEmail      : candidateBasicData.candidateEmailId,
            candidateGender     : candidateBasicData.candidateGender,   
            candidateVerificationStatus : candidateBasicData.candidateVerificationStatus,
            candidatepaymentStatus      : "Company",
        };
        //Insert into Order Table
        var order = Order.findOne({},{sort: {createdAt: -1}});
        if(order){ 
          var orderNo = parseInt(order.orderNo) + 1; 
        }else{
          var orderNo = 1;
        }
        if(orderNo){ 
          basicOrderDetails.orderNo = orderNo;
          basicOrderDetails.candidateDetails = [];
          if(basicOrderDetails.orderNo){
            var insertedOrder = Order.insert(basicOrderDetails);
            if(insertedOrder){
              var candidateUser = Meteor.users.findOne({
                  "profile.firstname" : candidateBasicData.candidateFirstName,
                  "profile.lastname"  : candidateBasicData.candidateLastName,
                  "profile.mobNumber" : candidateBasicData.candidateMobile,
                  "emails.address"    : candidateBasicData.candidateEmailId,
              });
              if(candidateUser){
                // console.log("In if");
                returnCandidateDetails.candidateId       = candidateUser._id;
                returnCandidateDetails.candidateAssureID = candidateUser.profile.assureId;
                if (informationFilledBy == "candidate" || informationFilledBy == "manual") {
                  Meteor.call("sendNotitificationByCompanytouser",returnCandidateDetails.candidateId,candidateBasicData.candidateEmailId,basicOrderDetails.companyDetails.companyName,"")
                }
              }else{
                // console.log("In else");
                var userDetails = Meteor.call('generateAssureIDForUser',candidateBasicData);
                if (userDetails) {
                   returnCandidateDetails.candidateId       = userDetails.newUsrId;
                   returnCandidateDetails.candidateAssureID = userDetails.userAssureId;
                   if (informationFilledBy == "candidate" || informationFilledBy == "manual") {
                    Meteor.call("sendNotitificationByCompanytouser",returnCandidateDetails.candidateId,candidateBasicData.candidateEmailId,basicOrderDetails.companyDetails.companyName,returnCandidateDetails.candidateAssureID)
                   }
                }
              }
              //Push CandidateDetails into order Table
              if(returnCandidateDetails.candidateAssureID){
                var orderInformation = {
                  'corporateOrderId' : basicOrderDetails.corporateOrderId,
                  'orderId'          : insertedOrder,
                  'orderDetailIndex' : parseInt(orderDetailIndex),
                  'candidateId'      : returnCandidateDetails.candidateId,
                  'candidateAssureID': returnCandidateDetails.candidateAssureID,
                }
                Meteor.call("updateorderNoNCandidateId",orderInformation);
                var returnVal = Order.update(
                  {"_id":insertedOrder},
                  {$push:{
                    candidateDetails :returnCandidateDetails }},
                );
                if (informationFilledBy == "candidate" || informationFilledBy == "manual") {
                  Order.update(
                    {"_id":insertedOrder},
                    {$set:{
                      "userId" : returnCandidateDetails.candidateId }},
                  );
                 var requestedOrder = Order.findOne({"_id" : insertedOrder});
                 if (requestedOrder) {
                    var requestPool = {
                      "orderId"      : insertedOrder,
                      "orderNo"      : requestedOrder.orderNo,
                      "orderDate"    : requestedOrder.createdAt, 
                      "assureId"     : returnCandidateDetails.candidateAssureID,
                      "packageId"    : requestedOrder.packageDetails.packageId,
                      "packageName"  : requestedOrder.packageDetails.packageName,
                      "createdAt"    : new Date(),
                      "paidBy"       : requestedOrder.paymentBy,
                      "orderPlacedBy" : "Company",
                      "tatDate"      : "",
                    }
                    Meteor.call('insertOrderInRequestPool',requestPool);

                 }
                  
                }
              }
              // console.log("returnVal",returnVal);
              if(returnVal){
                return returnVal; 
              }
            }
          }
        }
      },
      // genrate assureID method
      'generateAssureIDForUser' : function(candidateDetail){
        var userDetails = {
          newUsrId : '',
          userAssureId : '',
        };
        var latestUsersDetails = Meteor.users.findOne({'profile.loginAs':'user'},{sort: {"createdAt":-1}});
        if(latestUsersDetails){
          if(latestUsersDetails.profile){
            if(latestUsersDetails.profile.assureId){
              var str        = latestUsersDetails.profile.assureId;
              var splitStr   = str.split('-');
              var firstChar  = splitStr[1].substr(2,1);
              var middleChar = splitStr[1].substr(1,1);
              var lastChar   = splitStr[1].substr(0,1);

              //Charcter Code Calculation
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
                  firstAscii     = firstAscii + 1;
                  firstChar      = String.fromCharCode(firstAscii);
                }else{
                  firstChar = 'A'; 
                  if(middleChar != 'Z'){
                    var middleAscii  = middleChar.charCodeAt();
                    middleAscii      = middleAscii  + 1;
                    middleChar       = String.fromCharCode(middleAscii );
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
            }
            var newUsrId = Meteor.call("createUserByCompany",candidateDetail,newAssureID);
            userDetails.userAssureId = newAssureID;
            userDetails.newUsrId     = newUsrId;
          }
        }else{
         var newAssureID = "IN-AAA-000001";
          var newUsrId = Meteor.call("createUserByCompany",candidateDetail,newAssureID);
          userDetails.userAssureId = newAssureID;
          userDetails.newUsrId     = newUsrId;
        }
        if(userDetails.newAssureID != '' && userDetails.newUsrId != ''){
         return userDetails;
        }//End of newAssureID     
      },
      'createUserByCompany':function (candidateDetails,newAssureID) {
        var userValues = {
          'firstName'        : (candidateDetails.candidateFirstName).trim(),
          'lastName'         : (candidateDetails.candidateLastName).trim(),
          'emailId'          : candidateDetails.candidateEmailId,
          'mobileNo'         : candidateDetails.candidateMobile,
          'gender'           : candidateDetails.candidateGender,
          'signupPassword'   : 'assureid123',
          'aadharCard'       : candidateDetails.candidateAadharNo,
          'assureId'         : newAssureID,
        };
        if(userValues){
          var newUserId = Meteor.call('createUserAccountByCompany',userValues);
          return newUserId;       
        }
      },
      'sendNotitificationByCompanytouser':function(newuserId,newuseremailId,companyName,newAssureID){
        // console.log("newuseremailId",newuseremailId);
        // console.log("newAssureID",newAssureID);
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
        // console.log("assureId :",assureId);
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
          // console.log("in if");
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
          // console.log("in else");
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