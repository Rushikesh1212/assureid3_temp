import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const Invoice = new Mongo.Collection("invoice");
import {Order} from './Order.js';


if(Meteor.isServer){
    Meteor.publish('invoiceData',()=>{
        return Invoice.find({});
    });
    Meteor.publish('singleInvoice',(_id)=>{
        return Invoice.find({"_id" : _id});
    });
   Meteor.methods({
      'insertInvoice':function(invoiceData) {
          var lastInvoiceId = Invoice.findOne({},{sort: {createdAt: -1}});
          if(!lastInvoiceId){
            var  invoiceNo = 1;
          }else{
            var  invoiceNo = lastInvoiceId.invoiceNo + 1;
          }
          
          invoiceData.invoiceNo      = invoiceNo;
          invoiceData.paymentStatus  = 'unpaid';
          invoiceData.createdAt      = new Date();
          var id  = Invoice.insert(invoiceData
            //   "invoiceNo"         : invoiceNo, 
            //   "companyName"       : invoiceData.companyName,
            //   "serviceId"         : invoiceData.serviceId,
            //   "serviceName"       : invoiceData.serviceName,
            //   "serviceRate"       : invoiceData.serviceRate,
            //   "serviceDayNumbers" : invoiceData.serviceDayNumbers,
            //   "serviceDuration"   : invoiceData.serviceDuration,
            //   "serviceDate"       : invoiceData.serviceDate,
            //   "serviceImage"      : invoiceData.serviceImage,
            //   "serviceImgFileExt" : invoiceData.serviceImgFileExt,
            //   "userId"            : invoiceData.userId,
            //   "userName"          : invoiceData.userName  ,
            //   "companyAddress"    : invoiceData.companyAddress,
            //   "companyCity"       : invoiceData.companyCity,
            //   "companyState"      : invoiceData.companyState ,
            //   "companyCountry"    : invoiceData.companyCountry ,
            //   "companyPincode"    : invoiceData.companyPincode,
            //   "tax"               : invoiceData.tax,
            //   "totalAmount"       : parseFloat(invoiceData.totalAmount),
            //   "addressCount"      : invoiceData.addressCount,
            //   "employmentCount"   : invoiceData.employmentCount,
            //   "academicsCount"    : invoiceData.academicsCount,
            //   "certificatesCount" : invoiceData.certificatesCount,
            //   "professionalCount" : invoiceData.professionalCount,
            //   "detailData"        : invoiceData.detailData,
            //   "data"              : invoiceData.data,
            //   "paymentStatus"     : 'unpaid',
            //   "createdAt"         :   new Date(),
          ,(error, result)=>{
              if (error) {
                  return error;
              }else{
                 return result;
              }
          });

          //Insert data into Order Table
        //   var newOrder = {
        //       "invoiceId"         : id,
        //       "invoiceNo"         : invoiceNo,
        //       "companyOrderId"    : invoiceData.companyOrderId,
        //       "serviceId"         : invoiceData.serviceId,
        //       "serviceName"       : invoiceData.serviceName,
        //       "serviceDayNumbers" : invoiceData.serviceDayNumbers, 
        //       "serviceDuration"   : invoiceData.serviceDuration,
        //       "serviceDate"       : invoiceData.serviceDate,
        //       "serviceImage"      : invoiceData.serviceImage,
        //       "serviceImgFileExt" : invoiceData.serviceImgFileExt,
        //       "totalAmount"       : parseFloat(invoiceData.totalAmount),
        //       "userId"            : invoiceData.userId,
        //       "userName"          : invoiceData.userName  ,
        //       "detailData"        : invoiceData.detailData,
        //       "data"              : invoiceData.data,
        //       "paymentStatus"     : 'unpaid',
        //       "orderStatus"       : 'Not Yet Purchased',
        //       "createdAt"         :  new Date(),
        //   };

        //   Meteor.call('insertOrder',newOrder,function(error,result){
        //       if (error) {
        //           console.log('error ',error);
        //       }else{
        //           var adminData   = Meteor.users.findOne({'roles' : "admin"});
        //           var userData    = Meteor.users.findOne({"_id" : Meteor.userId()});
        //           var order       = Order.findOne({"_id":result});
        //             if (adminData) {
        //               var adminId  = adminData._id;
        //             }
        //             if (userData) {
        //               var newID = userData._id;
        //               if (userData.profile) {
        //                 var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
        //                 var mobNumber   = userData.profile.mobNumber;
        //               }
        //             }
        //             if (order) {
        //               var orderNo = order.orderNo;
        //             }
        //             var newDate     = new Date();
        //             var msgvariable = {                       
        //                               '[username]' : firstLastNm,
        //                               '[orderNo]'  : orderNo,
        //                               '[date]'     : moment(newDate).format("DD/MM/YYYY"),
        //                              };
        //             // Format for send Email //
        //             var inputObj = {
        //                 from         : adminId,
        //                 to           : newID,
        //                 templateName : 'Order Placed',
        //                 variables    : msgvariable,
        //             }
        //             sendMailNotification(inputObj);
                    
        //             // Format for sending SMS //
        //             var smsObj = {
        //                 to           : newID,
        //                 templateName : 'Order Placed',
        //                 number       : mobNumber,
        //                 variables    : msgvariable,
        //             }
        //             // console.log("smsObj",smsObj);
        //             sendSMS(smsObj);

        //             // Format for sending notification //
        //             var notifictaionObj = {
        //               to           : newID,
        //               templateName : 'Order Placed',
        //               variables    : msgvariable,
        //             }
        //             sendInAppNotification(notifictaionObj);
        //       }
        //   });
          return id;

      },
      'insertCompanyInvoice':function(invoiceData) {
          var lastInvoiceId = Invoice.findOne({},{sort: {createdAt: -1}});
          if(!lastInvoiceId){
            var  invoiceNo = 1;
          }else{
            var  invoiceNo = lastInvoiceId.invoiceNo + 1;
          }
          var id  = Invoice.insert({
              "invoiceNo"         : invoiceNo, 
              "requestPoolId"     : invoiceData.requestPoolId,
              "companyName"       : invoiceData.companyName,
              "serviceId"         : invoiceData.serviceId,
              "serviceName"       : invoiceData.serviceName,
              "serviceRate"       : invoiceData.serviceRate,
              "serviceDayNumbers" : invoiceData.serviceDayNumbers,
              "serviceDuration"   : invoiceData.serviceDuration,
              "serviceDate"       : invoiceData.serviceDate,
              "serviceImage"      : invoiceData.serviceImage,
              "serviceImgFileExt" : invoiceData.serviceImgFileExt,
              "userId"            : invoiceData.userId,
              "userName"          : invoiceData.userName  ,
              "companyAddress"    : invoiceData.companyAddress,
              "companyCity"       : invoiceData.companyCity,
              "companyState"      : invoiceData.companyState ,
              "companyCountry"    : invoiceData.companyCountry ,
              "companyPincode"    : invoiceData.companyPincode,
              "tax"               : invoiceData.tax,
              "totalAmount"       : parseFloat(invoiceData.totalAmount),
              "addressCount"      : invoiceData.addressCount,
              "employmentCount"   : invoiceData.employmentCount,
              "academicsCount"    : invoiceData.academicsCount,
              "certificatesCount" : invoiceData.certificatesCount,
              "professionalCount" : invoiceData.professionalCount,
              "detailData"        : invoiceData.detailData,
              "data"              : invoiceData.data,
              "paymentStatus"     : 'unpaid',
              "companyReference"  : invoiceData.companyReference,
              "createdAt"         :   new Date(),
          },(error, result)=>{
              if (error) {
                  return error;
              }else{
                 return result;
              }
          });

          //Insert data into Order Table
          var newOrder = {
              "invoiceId"         : id,
              "invoiceNo"         : invoiceNo,
              "requestPoolId"     : invoiceData.requestPoolId,
              "serviceId"         : invoiceData.serviceId,
              "serviceName"       : invoiceData.serviceName,
              "serviceDayNumbers" : invoiceData.serviceDayNumbers, 
              "serviceDuration"   : invoiceData.serviceDuration,
              "serviceDate"       : invoiceData.serviceDate,
              "serviceImage"      : invoiceData.serviceImage,
              "serviceImgFileExt" : invoiceData.serviceImgFileExt,
              "totalAmount"       : parseFloat(invoiceData.totalAmount),
              "userId"            : invoiceData.userId,
              "userName"          : invoiceData.userName  ,
              "detailData"        : invoiceData.detailData,
              "data"              : invoiceData.data,
              "paymentStatus"     : 'unpaid',
              "orderStatus"       : 'Not Yet Purchased',
              "companyReference"  : invoiceData.companyReference,
              "createdAt"         :  new Date(),
          };

          Meteor.call('insertUsersCompanyOrder',newOrder,function(error,result){
              if (error) {
                  console.log('error ',error);
              }else{
                  var adminData   = Meteor.users.findOne({'roles' : "admin"});
                  var userData    = Meteor.users.findOne({"_id" : Meteor.userId()});
                  var order       = Order.findOne({"_id":result});
                    if (adminData) {
                      var adminId  = adminData._id;
                    }
                    if (userData) {
                      var newID = userData._id;
                      if (userData.profile) {
                        var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
                        var mobNumber   = userData.profile.mobNumber;
                      }
                    }
                    if (order) {
                      var orderNo = order.orderNo;
                    }
                    var newDate     = new Date();
                    var msgvariable = {                       
                                      '[username]' : firstLastNm,
                                      '[orderNo]'  : orderNo,
                                      '[date]'     : moment(newDate).format("DD/MM/YYYY"),
                                     };
                    // Format for send Email //
                    var inputObj = {
                        from         : adminId,
                        to           : newID,
                        templateName : 'Order Placed',
                        variables    : msgvariable,
                    }
                    sendMailNotification(inputObj);
                    
                    // Format for sending SMS //
                    var smsObj = {
                        to           : newID,
                        templateName : 'Order Placed',
                        number       : mobNumber,
                        variables    : msgvariable,
                    }
                    // console.log("smsObj",smsObj);
                    sendSMS(smsObj);

                    // Format for sending notification //
                    var notifictaionObj = {
                      to           : newID,
                      templateName : 'Order Placed',
                      variables    : msgvariable,
                    }
                    sendInAppNotification(notifictaionObj);
              }
          });
          // return id;

      },
      'updateInvoice':function (invoiceNo) {
          Invoice.update({'invoiceNo' : parseInt(invoiceNo)},
          {$set:{
              "paymentStatus"     : 'paid',
            }
          });
      },
      'updateOrderInvoice':function(invoiceId,invoiceData){
         Invoice.update({"_id": invoiceId},
         {$set:{
            "assureId"          : invoiceData.assureId,
            "companyName"       : invoiceData.companyName,
            "orderId"           : invoiceData.orderId,
            "orderNo"           : invoiceData.orderNo,
            "orderDate"         : invoiceData.orderDate,
            "userDetails"       : invoiceData.userDetails,
            "companyAddress"    : invoiceData.companyAddress,
            "serviceDetails"    : invoiceData.serviceDetails,
            "tax"               : invoiceData.tax,
            "taxAmount"         : invoiceData.taxAmount,
            "actualAmount"      : invoiceData.actualAmount,
            "totalAmount"       : invoiceData.totalAmount,
           }
         });
      },
      'updatePackageOrderInvoice':function(invoiceId,invoiceData){
         Invoice.update({"_id": invoiceId},
         {$set:{
              "assureId"             : invoiceData.assureId,
              "companyName"          : invoiceData.companyName,
              "orderId"              : invoiceData.orderId,
              "orderNo"              : invoiceData.orderNo,
              "orderDate"            : invoiceData.orderDate,
              "userDetails"          : invoiceData.userDetails,
              "companyAddress"       : invoiceData.companyAddress,
              "packageDetails"       : invoiceData.packageDetails,
              "billingDetails"       : invoiceData.billingDetails,  
              "companyReference"     : invoiceData.companyReference,                  
              "tax"                  : invoiceData.tax,
              "taxAmount"            : invoiceData.taxAmount,
              "packageDiscountValue" : invoiceData.packageDiscountValue,
              "actualAmount"         : invoiceData.actualAmount,
              "reducedActualAmount"  : invoiceData.reducedActualAmount,
              "totalAmount"          : invoiceData.totalAmount,
           }
         });
      },
   });
}
