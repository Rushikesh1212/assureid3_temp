import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { UserProfile } from '/imports/admin/userViewProfile/api/userProfile.js';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CorporateOrders } from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';


export const Order = new Mongo.Collection("order");
export const TempOrder = new Mongo.Collection("tempOrder");
require('moment-weekday-calc');
if(Meteor.isServer){
     Meteor.publish('allOrders',()=>{
        return Order.find({});
    });
	  Meteor.publish('singleOrder',(_id)=>{
        return Order.find({"_id" : _id});
    });
    Meteor.publish('singleTempOrder',(_id)=>{
        return TempOrder.find({"_id" : _id});
    });
    Meteor.publish('orderWithCorporateOrder',(corporateOrderId)=>{
        return Order.find({"corporateOrderId" : corporateOrderId});
    });
 
	  Meteor.methods({
   	 'insertTempPayment':function(invoiceDate,invoiceNo,serviceId,serviceName,serviceRate,serviceDuration,userId,userName,totalAmount) {
   	      var id  = TempOrder.insert({
   	      	  "invoiceDate"      :   invoiceDate,
   	      	  "invoiceNo"        :   invoiceNo,
              "serviceId"        :   serviceId,
              "serviceName"      :   serviceName,
              "serviceRate"      :   serviceRate,
              "serviceDuration"  :   serviceDuration,
              "userId"           :   userId,
              "userName"         :   userName,
              "totalAmount"      :   totalAmount,
              "remark"           :   '',
              "createdAt"        :   new Date(),
   	      },(error, result)=>{
             if (error) {
                return error;
             }else{
             	 return result;
             }
          });
      return id;
   	 },
   	 'insertOrder':function(invoiceDate,invoiceNo,serviceId,serviceName,serviceRate,serviceDuration,userId,userName,totalAmount,paymentStatus,delieveryStatus) {      
   	     var orderObj = Order.findOne({}, {sort: { orderNo : -1}});
			    if(orderObj){
			      orderNo = orderObj.orderNo + 1;
			    }else{
			      orderNo = 1;
			    }
   	      var id  = Order.insert({
   	      	  "orderNo"          :   orderNo,
   	      	  "invoiceDate"      :   invoiceDate,
   	      	  "invoiceNo"        :   invoiceNo,
              "serviceId"        :   serviceId,
              "serviceName"      :   serviceName,
              "serviceRate"      :   serviceRate,
              "serviceDuration"  :   serviceDuration,
              "userId"           :   userId,
              "userName"         :   userName,
              "totalAmount"      :   totalAmount,
              "paymentStatus"    :   paymentStatus,
              "delieveryStatus"  :  [delieveryStatus],
              "remark"           : '',
              "createdAt"        :   new Date(),
   	      },(error, result)=>{
             if (error) {
                return error;
             }else{
             	 return result;
             }
          });
          Meteor.call('createTicket',id,userId,serviceId,serviceName,totalAmount,paymentStatus,delieveryStatus);
       TempOrder.remove({});
      return id;
      },
      
     'changeTicketStatusInOrder':function(orderId,ticketId,status,reportLink,summeryFinding){
        var orderDetails = Order.findOne({"_id":orderId});
        var ticketDetails = TicketMaster.findOne({"_id":ticketId});
        
         if(ticketDetails && orderDetails){
          var verificationId   = ticketDetails.verificationId;
          var verificationType = ticketDetails.verificationType;
         
         var index = orderDetails.candidateDetails.findIndex(x=> x.candidateId == ticketDetails.userId);
         var verificationDataIndex = orderDetails.candidateDetails[index].verificationData.findIndex(y=> ( (y.verificationId == verificationId) && (y.verificationType == verificationType) ) );
         if(index >= 0 && verificationDataIndex >=0){
          var updateOrder = Order.update(
              {"_id":orderId,"candidateDetails.candidateId":ticketDetails.userId,
                'candidateDetails.verificationData':{$elemMatch:{'verificationId':verificationId,
                'verificationType':verificationType}}
              },
              {
                $set:{
                    ["candidateDetails."+index+".verificationData."+verificationDataIndex+".ticketDetails.status"]  : status,
                    ["candidateDetails."+index+".verificationData."+verificationDataIndex+".ticketDetails.report"]  : reportLink,
                    ["candidateDetails."+index+".verificationData."+verificationDataIndex+".ticketDetails.completedDate"]  : new Date(),
                }
              }
            );
          }else{
            
          }
          
          var orderDetails = Order.findOne({"_id":orderId});
          
          if(orderDetails){
            var ticketDetails = TicketMaster.findOne({"_id":ticketId});
            if(ticketDetails){
              if(status == 'Clear' || status == 'Minor Discrepancy' || status == 'Terminate'){
                var ticketStatus = 'Approved';
              }else{
                var ticketStatus = 'Reject';
              }
              Meteor.call('actulStatuofVerificationType',ticketDetails.userId,ticketDetails.verificationType,ticketDetails.verificationId,ticketStatus,reportLink);
            }
            var ticketList = orderDetails.ticket;
            
            var orderStatus = 'Completed';
            var candidateVerificationStatus = 'Completed';
            
            for(i = 0 ; i < orderDetails.candidateDetails[index].verificationData.length ; i++){
              if(!orderDetails.candidateDetails[index].verificationData[i].ticketDetails.report){
                orderStatus = 'In Process';
                break;
              }
            }     
            
            
            if(orderStatus == 'Completed' && candidateVerificationStatus == 'Completed'){
              Order.update(
                {"_id":orderId,'candidateDetails.candidateId':ticketDetails.userId},
                {
                  $set:{
                      ["candidateDetails."+index+".candidateVerificationStatus"]:'Order Completed - Generating Report',
                      "orderStatus" : 'Order Completed - Generating Report',
                      "completedDate" : new Date(),
                  }
                }
              );   
            }   
              //Allocate the order to the dispatch team
              var memberDetails = Meteor.users.find({"roles":"dispatch team","profile.status":"Active"},{sort: {"count":1},limit:1}).fetch();
              if(memberDetails){
                Order.update(
                  {"_id":orderId},
                  {
                    $set : {
                      "allocatedToUserid"   : memberDetails[0]._id,
                      "allocatedToUserName" : memberDetails[0].profile.firstname + ' ' + memberDetails[0].profile.lastname,
                    }
                  }
                );
              } 
            } 
          }
     },
     'changeStatusofOrder':function(userId, remark,verificationId,verificationType){
        if(verificationType=='employement'){
          Order.update({"userId":userId,"data.employementId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
        if(verificationType=='education'){
          Order.update({"userId":userId,"data.educationId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
        if(verificationType=='permanentAddress'){
          Order.update({"userId":userId,"data.permanentAddressId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
        if(verificationType=='currentAddress'){
          Order.update({"userId":userId,"data.currentAddressId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
        if(verificationType=='certificates'){
          Order.update({"userId":userId,"data.certificatesId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
        if(verificationType=='professionalEducation'){
          Order.update({"userId":userId,"data.professionalEducationId":verificationId},
            {
              $set:{
                "data.$.editStatus":"Open",
                "data.$.remark": remark,
              }
            });
        }
     }, 

     'orderCompleted':function(orderId,candidateId){
       
       var orderDetails = Order.findOne({"_id":orderId});
        if(orderDetails){
          var index = orderDetails.candidateDetails.findIndex(x=> x.candidateId == candidateId);
          if(index >=0){
            var orderStatus = Order.update(
              {"_id":orderId,'candidateDetails.candidateId':candidateId},
              {
                $set:{
                    ["candidateDetails."+index+".candidateVerificationStatus"]:'Order Completed - Report Completed',
                }
              }
            );
          }
        } 
        
      },

     'updateOrderGenrationlink' :function(orderId,genratedReport,genratedReportDate,candidateId){ 
        var orderDetails = Order.findOne({"_id":orderId});
        if(orderDetails){
          var index = orderDetails.candidateDetails.findIndex(x=> x.candidateId == candidateId);
          if(index >=0){
            var updateStatus = Order.update(
              {"_id":orderId,'candidateDetails.candidateId':candidateId},
              {
                $set:{
                    ["candidateDetails."+index+".candidateVerificationStatus"] :'Completed',
                    ["candidateDetails."+index+".genratedReport"]              : genratedReport,
                    ["candidateDetails."+index+".genratedReportDate"]          : genratedReportDate,
                }
              }
            );

          // var verificationDataLength    = orderDetails.candidateDetails.map((q)=> {if(q.candidateId == candidateId){ return q.verificationData.length;}});
          //  console.log('verificationDataLength: ', verificationDataLength);
          // var actualVerificationDataLen = verificationData[0];
          // console.log("orderDetails.candidateDetails[index].verificationData :",orderDetails.candidateDetails[index].verificationData);
          if(orderDetails.candidateDetails[index].verificationData.length>0){
            orderDetails.candidateDetails[index].verificationData.map((verifData,i)=>{
              Order.update(
                {"_id":orderId},
                {$set:{
                  // ["candidateDetails."+index+".verificationData."+i+".ticketDetails.status"]: "Completed",
                  // ["candidateDetails."+index+".verificationData."+i+".ticketDetails.bgColor"]: "bgBlue",
                  ["candidateDetails."+index+".verificationData."+i+".verificationDataStatus"]: "Completed",
                  ["candidateDetails."+index+".verificationData."+i+".bgColor"]: "bgBlue"
                  
                }}
              )
            });
          }
          }
        } 
        // Order.update({"_id": orderId},{
        //   $set:{
        //     "genratedReport"      : genratedReport,
        //     "genratedReportDate"  : genratedReportDate,
        //   }
        // });

        /**Check candidateVerificationStatus in candidatedetails and if all status is completed the change order status as completed*/

        // var orderStatus = 'Completed';

        if(updateStatus == 1){
        var updatedOrderDetails = Order.findOne({"_id":orderId});
        var candidateVerificationStatus = 'Completed';

        for(i = 0 ; i < updatedOrderDetails.candidateDetails.length; i++){
          if(updatedOrderDetails.candidateDetails[i].candidateVerificationStatus!='Completed'){
            candidateVerificationStatus = 'In Process';
            break;
          }
        } 
        
        if(candidateVerificationStatus == 'Completed'){
          var orderStatus = Order.update(
              {"_id":orderId}, 
              {
                $set:{
                    
                    "orderStatus" : 'Completed',
                    "completedDate" : new Date(),
                }
              }
            ); 
            
          }//EOF if
        }//EOF orderDetails
        
        // updateTicketStatusColorIn("",ticketid,status,bgColor)
        var adminData   = Meteor.users.findOne({'roles' : "admin"});
        if (adminData) {
          var adminId  = adminData._id;
        }
        var status  = "Case Completed";
				var bgColor = "Bg-success";
        Meteor.call('updateTicketStatusColorIn',ticketid,status,bgColor);
        
        var order   = Order.findOne({"_id" : orderId});
        if (order) {
          var corporateOrderId = order.corporateOrderId;
          if (corporateOrderId) {
            Meteor.call("updateStatusInCorporateOrder",corporateOrderId);
          }
          var userid   = order.userId;
          var userData = Meteor.users.findOne({"_id" : userid});
           if (userData) {
            var newID = userData._id;
            if (userData.profile) {
              var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
              var assureId    = userData.profile.assureId;
              var mobNumber   = userData.profile.mobNumber;
            }
          }
         //  var currentPath = browserHistory.getCurrentLocation();
         // 
           var orderNo     = order.orderNo;
           var newDate     = new Date();
           var msgvariable = {                       
                            '[username]' : firstLastNm+"("+assureId+") ",
                            '[orderNo]'  : orderNo,
                            '[date]'     : moment(newDate).format("DD/MM/YYYY"),
                           };
            // Format for send Email //
            var inputObj = {
              from         : adminId,
              to           : newID,
              templateName : 'OrderCompleted',
              variables    : msgvariable,
            }
            sendMailNotification(inputObj);
            // Format for sending SMS //
            var smsObj = {
              to           : newID,
              templateName : 'OrderCompleted',
              number       : mobNumber,
              variables    : msgvariable,
            }
            // 
            sendSMS(smsObj);
            // Format for sending notification //
            var notifictaionObj = {
              to           : newID,
              templateName : 'OrderCompleted',
              variables    : msgvariable,
           }
            sendInAppNotification(notifictaionObj);
        }
        
     },

    //  /**=============== Update Status in Company Order Table ==================== */
    //  updateStatusInCompanyOrder(orderId,companyReference,userId){

    //   CompanyOrder.update(
    //     {'_id':companyReference,'orderDetails.orderId' :orderId},
    //     {
    //       $set:{
    //         'orderDetails.$.verifStatus':"Completed"
    //       }


    //     }
    //   ); 
    //  }
     // insert order by company
      // 'insertOrderByCompany' : function(orderTempDetails){
      //   //Insert into Order Table 
      //   var order = Order.findOne({},{sort: {createdAt: -1}});
      //   if(order){
      //     var orderNo = parseInt(order.orderNo) + 1;
      //   }else{
      //     var orderNo = 1; 
      //   } 
      //   orderTempDetails.orderNo = orderNo;
      //   if(orderTempDetails.orderNo){
      //     var orderId = Order.insert(orderTempDetails,(err,result)=>{
      //       if(err){
      //         
      //       }else{
      //         var orderDetails = Order.findOne({"_id":orderId});
      //         if(orderDetails){
      //           if(orderDetails.candidateDetails){
      //             var maxLen = orderDetails.candidateDetails.length;
      //             var totalcount = 0;
      //             for (var i = 0; i < maxLen; i++) {
      //               var candidateUser = Meteor.users.findOne({
      //                             "profile.firstname" : orderDetails.candidateDetails[i].candidateFirstName,
      //                             "profile.lastname"  : orderDetails.candidateDetails[i].candidateLastName,
      //                             "profile.mobNumber" : orderDetails.candidateDetails[i].candidateMobile,
      //                             "emails.0.address"  : orderDetails.candidateDetails[i].candidateEmailId,
      //                         });
      //               if (candidateUser) {
      //                 var userId = candidateUser._id;
      //                 var userAssureId = candidateUser.profile.assureId;
      //                  Order.update(
      //                     {"_id" : orderId, "candidateDetails.candidateEmailId" : orderDetails.candidateDetails[i].candidateEmailId,"candidateDetails.candidateMobile" : orderDetails.candidateDetails[i].candidateMobile},
      //                     {$set:{
      //                       ["candidateDetails."+i+".candidateId"]       : userId,
      //                       ["candidateDetails."+i+".candidateAssureID"] : userAssureId, 
      //                     }
      //                   }
      //                   );
                       
      //                  Meteor.call("sendVerifivacationData",userId,orderDetails.candidateDetails[i].verificationData,i,orderId,function (error,result) {
      //                    if (error) {
      //                       
      //                    }else{
      //                      // 

      //                    }
      //                  });
      //               }else{
      //                  Meteor.call("createAssureID",orderDetails.candidateDetails[i],i,orderId,function (error,result) {
      //                    if (error) {
      //                     
      //                    }else{
      //                     // 
      //                    }
      //                  });
      //               }
      //               totalcount = totalcount + orderDetails.candidateDetails[i].verificationData.length;
      //             }
      //             Meteor.call('updateCountInContract',orderTempDetails.companyDetails.companyAssureID,orderTempDetails.companyDetails.contractId,orderTempDetails.serviceDetails.serviceId , totalcount);
      //           }
      //         }
      //         //Delete Data from TempOrder collections
      //         Meteor.call('removeTempOrderId',orderTempDetails._id);
      //       }
      //     });
      //     return orderId;
      //   }
      // },
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
            console.log('order insert err ',err);  
          }else{
            if(result){
              
              var orderIdAfterInsert = result;
              if(orderIdAfterInsert){
                var orderDetails = Order.findOne({"_id":orderIdAfterInsert});
                if(orderDetails){
                  if(orderDetails.candidateDetails){
                    var candidateDetails = orderDetails.candidateDetails;
                    if(candidateDetails){
                       var totalcount = 0;
                      candidateDetails.map((candidateDetail,index)=>{
                        var userDetails = {
                          newUsrId : '',
                          userAssureId : '',
                        };
                        var candidateUser = Meteor.users.findOne({
                                "profile.firstname" : candidateDetail.candidateFirstName,
                                "profile.lastname"  : candidateDetail.candidateLastName,
                                "profile.mobNumber" : candidateDetail.candidateMobile,
                                "emails.0.address"  : candidateDetail.candidateEmailId,
                        });
                        //Check if candidate already exist
                        if(candidateUser){
                          if(candidateUser){
                          //candidate exist
                            userDetails.newUsrId     = candidateUser._id;
                            userDetails.userAssureId = candidateUser.profile.assureId;
                              // Meteor.call('orderCandidateIdUpdate',userDetails.newUsrId,index,orderIdAfterInsert);
                          }else{
                            //candidate does not exists
                            var userDetails = Meteor.call('generateAssureIDForUser',candidateDetail);
                            if (userDetails) {
                               userDetails.newUsrId     = userDetails.newUsrId;
                               userDetails.userAssureId = userDetails.userAssureId;
                            }
                          }  
                        }else{
                          if(candidateUser){
                            //candidate exist
                            userDetails.newUsrId     = candidateUser._id;
                            userDetails.userAssureId = candidateUser.profile.assureId;
                              // Meteor.call('orderCandidateIdUpdate',userDetails.newUsrId,index,orderIdAfterInsert);
                          }else{
                            //candidate does not exists
                            var userDetails = Meteor.call('generateAssureIDForUser',candidateDetail);
                            if (userDetails) {
                               userDetails.newUsrId     = userDetails.newUsrId;
                               userDetails.userAssureId = userDetails.userAssureId;
                            }
                          }
                        }
                        Meteor.call('orderCandidateIdUpdate',orderIdAfterInsert,index,userDetails.newUsrId,userDetails.userAssureId);
                        Meteor.call("updateVeriDataInUsrProfile",userDetails.newUsrId,candidateDetail.verificationData,index,orderIdAfterInsert);
                        totalcount = totalcount + candidateDetail.verificationData.length;
                      });
                     Meteor.call('updateCountInContract',orderDetails.companyDetails.companyAssureID,orderDetails.companyDetails.contractId,orderDetails.serviceDetails.serviceId,totalcount);
                    }
                  }
                  Meteor.call("removeTempOrder",orderDetails._id);
                }
              }
            }else{
              console.log('order insert no result'); 
            }
          }
        });
      }//end of orderTempDetails.orderNo
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
    // create user by company method
    'createUserByCompany':function (candidateDetails,newAssureID) {
      var userValues = {
        'firstName'        : (candidateDetails.candidateFirstName).trim(),
        'lastName'         : (candidateDetails.candidateLastName).trim(),
        'emailId'          : candidateDetails.candidateEmailId,
        'mobileNo'         : candidateDetails.candidateMobile,
        'signupPassword'   : 'assureid123',
        'aadharCard'       : candidateDetails.candidateAadharNo,
        'assureId'         : newAssureID,
      };
      if(userValues){
        var newUserId = Meteor.call('createUserAccountByCompany',userValues);
        return newUserId;       
      }
    },
    //Update id in verification data in candidate details
    "updateIdInOrders":function (orderId,candidateId,verificationId,id,verificationIndex) {
      
      return Order.update(
          {'_id': orderId, 'candidateDetails.candidateId' : candidateId},
          {$set:{
            ['candidateDetails.$.verificationData.'+verificationIndex+'.verificationId']: verificationId,
            ['candidateDetails.$.verificationData.'+verificationIndex+'.'+id]           : verificationId,
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
    'InsertImageInIdentityOrder':function(orderId,userId,dataIndex,proofSubtype,documents) {
      if (proofSubtype == "aadhar1" || proofSubtype == "pan1" || proofSubtype == "driving1" || proofSubtype == "voting1" || proofSubtype == "ration1" || proofSubtype == "passport1") {
        var proofOfDocument = "proofOfDocument";
        var fileExt         = "fileExt";
        var fileName        = "fileName";
      }else{
        var proofOfDocument = "proofOfDocument2";
        var fileExt         = "fileExt2";
        var fileName        = "fileName2";
      }
      Order.update(
        {'_id': orderId, "candidateDetails.candidateId" : userId},
        {$set :{
          ['candidateDetails.$.verificationData.'+dataIndex+'.'+proofOfDocument]     : documents.proofOfDocument,
          ['candidateDetails.$.verificationData.'+dataIndex+'.'+fileExt]             : documents.fileExt,
          ['candidateDetails.$.verificationData.'+dataIndex+'.'+fileName]            : documents.fileName,
        }}
      );
    },
   'UpdateImageInOrder':function(orderId,userId,dataIndex,prooftype,documents) {  
        Order.update(
          {'_id': orderId, "candidateDetails.candidateId" : userId},
          {$set :{
            ['candidateDetails.$.verificationData.'+dataIndex+'.documents']     : documents,
          }}
        );
    },
    'updateVerificationDataStatus':function(orderId,userId,dataIndex) {  
        Order.update(
          {'_id': orderId, "candidateDetails.candidateId" : userId},
          {$set :{
            ['candidateDetails.$.verificationData.'+dataIndex+'.verificationDataStatus']     : "Verification Initiated",
            ['candidateDetails.$.verificationData.'+dataIndex+'.bgColor']                    : "Bg-primary",
          }}
        );
    },
    'updateVerificationDataStatusToPending':function(orderId,matchCandidateIndex,verificationDataIndex,status) {  
      Order.update(
        {'_id': orderId},
        {$set:{
          ['candidateDetails.'+matchCandidateIndex+'.verificationData.'+verificationDataIndex+'.verificationDataStatus']: status,
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
      // var matchedOrder = Order.findOne({"_id" : orderId});
      // console.log("matchedOrder",matchedOrder);
      // console.log("candidateId",candidateId);
      // if (matchedOrder) {
      //   if (matchedOrder.candidateDetails) {
      //     var candidate = matchedOrder.candidateDetails.find((obj)=>{return obj.candidateId == candidateId});
      //     console.log("candidate",candidate);
      //     if (candidate) {
      //      var verificationData = candidate.verificationData[parseInt(verificationDataIndex)];
      //       if (verificationData) {
      //        console.log("verificationData",verificationData);
      //         if (verificationData.documents) {
      //           console.log("verificationData.documents",verificationData.documents);
      //           if (verificationData.documents == []) {
      //             Order.update({'_id': orderId, "candidateDetails.candidateId" : candidateId},{
      //               $unset:{
      //                 ['candidateDetails.$.verificationData.'+verificationDataIndex+'.documents'] : 1
      //               }
      //             });
      //           }
      //         }
      //       }
      //     }
      //   }
      // }

    },
    "delFromIdentityVerificationData" :function (orderId,candidateId,verificationDataIndex,docs) {
      if (docs == "firstDoc") {
        var proofOfDocument = "proofOfDocument";
        var fileExt         = "fileExt";
        var fileName        = "fileName";
      }else{
        var proofOfDocument = "proofOfDocument2";
        var fileExt         = "fileExt2";
        var fileName        = "fileName2";
      }

      Order.update(
        {'_id': orderId, "candidateDetails.candidateId" : candidateId},
        {$set :{
          ['candidateDetails.$.verificationData.'+verificationDataIndex+'.'+proofOfDocument]     : "",
          ['candidateDetails.$.verificationData.'+verificationDataIndex+'.'+fileExt]             : "",
          ['candidateDetails.$.verificationData.'+verificationDataIndex+'.'+fileName]            : "",
        }}
      );
    },
    "orderCandidateIdUpdate": function (orderId,i,userId,userAssureId) {
      Order.update(
          {"_id" : orderId},
          {$set:{
            ["candidateDetails."+i+".candidateId"]       : userId,
            ["candidateDetails."+i+".candidateAssureID"] : userAssureId, 
          }
        }
      );
    },
    'actulStatuofVerificationType':function(userId,verificationType,verificationId,remark,reportLink){
      if (verificationType == "permanentAddress") {
        var verificationUniqueId = "permanentAddressId";
      }else if (verificationType == "currentAddress") {
        var verificationUniqueId = "currentAddressId";
      }else if (verificationType == "education") {
        var verificationUniqueId = "educationId";
      }else if (verificationType == "employement") {
        var verificationUniqueId = "employementId";
      }else if (verificationType == "certificates") {
        var verificationUniqueId = "certificateId";
      }else if (verificationType == "professionalEducation") {
        var verificationUniqueId = "professionalEducationId";
      }
      var status =  UserProfile.update(
          {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
          { $set:{
                  [verificationType+'.$'+'.verifiedStatus']           : remark,
                  [verificationType+'.$'+'.report']                   : reportLink,
            } 

          }
      );
    },
    'statuofVerificationType':function(userId,verificationType,verificationId,remark){
      if (verificationType == "permanentAddress") {
        var verificationUniqueId = "permanentAddressId";
      }else if (verificationType == "currentAddress") {
        var verificationUniqueId = "currentAddressId";
      }else if (verificationType == "education") {
        var verificationUniqueId = "educationId";
      }else if (verificationType == "employement") {
        var verificationUniqueId = "employementId";
      }else if (verificationType == "certificates") {
        var verificationUniqueId = "certificateId";
      }else if (verificationType == "professionalEducation") {
        var verificationUniqueId = "professionalEducationId";
      }
      var status =  UserProfile.update(
          {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
          { $set:{
                  [verificationType+'.$'+'.ticketStatus'] :  remark,
            } 

          }
      );
    },
    'updateOrderCandidateInfo':function(corporateOrderId,candidateInfo,serviceid){
       var corporateOrder = CorporateOrders.findOne({"_id":corporateOrderId});
       if(corporateOrder){
        var orderDetails = corporateOrder.orderDetails;
        if(orderDetails){
          var orderDetailsUser = orderDetails.find(function (obj) {
            return obj.candidateDetails.candidateFirstName == candidateInfo.candidateFirstName 
                && obj.candidateDetails.candidateLastName == candidateInfo.candidateLastName 
                && obj.candidateDetails.candidateEmailId == candidateInfo.candidateEmailId 
                && obj.candidateDetails.candidateMobile == candidateInfo.candidateMobile
          });
          // console.log('orderDetailsUser ',orderDetailsUser); 

          if(orderDetailsUser){
            var orderId = orderDetailsUser.orderId; 
            var candidateId = orderDetailsUser.candidateDetails.candidateId;
            var verificationData = candidateInfo.verificationData[0];
            verificationData.serviceId = serviceid;
            if(orderId){
              var updatedOrder = Order.update({"_id" : orderId, "candidateDetails.candidateId" : candidateId},{
                $push:{
                  ['candidateDetails.$.verificationData']            : verificationData,
                },
                $set:{
                  ['candidateDetails.$.candidateVerificationStatus'] : "In Process",
                }
              });
              if (updatedOrder) {
                var order       = Order.findOne({"_id":orderId});
                if (order) {
                  var candidate = order.candidateDetails.find(function(obj) {
                    return obj.candidateId == candidateId
                  }); 
                  if(candidate) {
                    var candidateId           = candidate.candidateId;
                    var verificationDataIndex = candidate.verificationData.length -1;
                    var verificationData      = verificationData;
                    if (verificationData) {
                      var data = Meteor.call('updateVeriDataInUsrProfile',candidateId,verificationData,orderId,verificationDataIndex);
                      if(data){
                        return data;
                      }
                    }
                  }
                }
              }
            }
          }else{
            return 'Candidate is not list in the order given by the Company';
          }
        }
       }
    },
    
    "generateTicketForSingleVerification":function (orderId,candidateId,verificationDataId,holidaysList,serviceId) {
       var servicesIncluded = {};
       var matchedOrder   = Order.findOne({"_id": orderId});
       if (matchedOrder) {
         if(matchedOrder.serviceDetails!=undefined){
            var noOFDays = matchedOrder.serviceDetails.serviceCompletionDays
          }else{
            servicesIncluded = matchedOrder.packageDetails.servicesIncluded.find((obj)=>{
              return obj.serviceId == serviceId;
            })
           if (servicesIncluded) {
             var noOFDays = servicesIncluded.serviceCompletionDays;    
           }
          }
           var tatDate1 = moment().addWorkdays(parseInt(noOFDays),holidaysList);
           let self = this;
           matchedOrder.tatDate = new Date(tatDate1); 
           if (tatDate1) {
              Meteor.call('updateOrdertatdate',matchedOrder._id,new Date(tatDate1),function (error,result) {
                if (error) {
                  
                }else{              
                }
              });
          }
        var candidateDetails = matchedOrder.candidateDetails.find((obj)=>{
          return obj.candidateId == candidateId;
        })
        var candidateIndex  = matchedOrder.candidateDetails.findIndex((obj)=>{
          return obj.candidateId == candidateId;
        })
        if (candidateDetails) {
          if (candidateDetails.verificationData) {
              if(matchedOrder.serviceDetails){
                var serviceId         = matchedOrder.serviceDetails.serviceId;
                var serviceName       = matchedOrder.serviceDetails.serviceName;
                var serviceDayNumbers = matchedOrder.serviceDetails.serviceDayNumbers;
                var serviceImage      = matchedOrder.serviceDetails.serviceImage;
                var serviceImgFileExt = matchedOrder.serviceDetails.serviceImgFileExt;  
                var serviceRequired   = matchedOrder.serviceDetails.verificationType;          
              }else if(matchedOrder.packageDetails){
                var serviceId         = servicesIncluded.serviceId;
                var serviceName       = servicesIncluded.serviceName;
                var serviceDayNumbers = servicesIncluded.serviceCompletionDays;
                var serviceImage      = servicesIncluded.serviceImage;
                var serviceImgFileExt = servicesIncluded.serviceImgFileExt;
                var serviceRequired   = servicesIncluded.verificationType;
              }
              var verificationData = candidateDetails.verificationData[verificationDataId];
              verificationData.index = verificationDataId;
                var newTicket = {
                  "orderId"           : matchedOrder._id,
                  "orderNo"           : matchedOrder.orderNo,
                  "orderDate"         : matchedOrder.createdAt,
                  "assureId"          : candidateDetails.candidateAssureID,
                  "serviceId"         : serviceId,
                  "serviceName"       : serviceName,
                  "serviceDayNumbers" : serviceDayNumbers,
                  "serviceImage"      : serviceImage,
                  "serviceImgFileExt" : serviceImgFileExt,
                  "serviceRequired"   : serviceRequired,
                  "tatDate"           : matchedOrder.tatDate,
                  "userId"            : candidateDetails.candidateId,
                  "userName"          : candidateDetails.candidateFirstName+" "+candidateDetails.candidateLastName,
                  "verificationType"  : candidateDetails.verificationData[verificationDataId].verificationType,
                  "verificationId"    : candidateDetails.verificationData[verificationDataId].verificationId,
                  "verificationData"  : verificationData,
                  "matchCandidateIndex": candidateIndex,
                };
                Meteor.call('createTicket',newTicket,verificationDataId,function (error,result) {
                if (error) {
                  console.log('createTicket error ',error);
                }else if(result){
                  console.log('createTicket result ',result);
                }
              });               
          }
        }
      }

    },


   });

}
