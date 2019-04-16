import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';

export const TempOrder = new Mongo.Collection("temporder");

if(Meteor.isServer){ 
   Meteor.publish('allTempOrders',()=>{
      return TempOrder.find({});
   });
   


    Meteor.methods({
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
 
      // results.data,typeid,type,assureId
      'insertBulkOrderCompany' : function(csvObject,typeid,type,companyassureId){
        check( csvObject, Array);
        //  
        // var csvUploaded = true;
        if (csvObject.length <= 0) {
          // csvUploaded  = false;
        }else{

        var orderDate = new Date();
        orderDate = moment(orderDate).format('MMM DD YYYY');
        var companyProfileObj = CompanyProfile.findOne({'companyAssureID':companyassureId});
          if(companyProfileObj){
            if(companyProfileObj.paymentBy == 'Company'){
              var candidatepaymentStatus = 'Paid';
            }else{
              var candidatepaymentStatus = 'unPaid';
            }
            if(type == 'service'){
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
            // console.log("serviceDetails",serviceDetails);
            if(serviceDetails || packageDetails ){
              var tempCompanyOrder ={
                "companyDetails": {
                  "companyId"                   : companyProfileObj._id,
                  "companyAssureID"             : companyassureId,
                  "companyName"                 : companyProfileObj.companyName,
                  "orderPlacedById"             : Meteor.userId(),
                  "orderPlacedByName"           : Meteor.user().profile.name,
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
        var tempOrder = TempOrder.findOne({"_id" : tempOrderId});
        if (tempOrder) {
          if (tempOrder.candidateDetails) {
            var tempOrderLength = tempOrder.candidateDetails.length;
            if (tempOrderLength == 0) {
              Meteor.call('removeTempOrder',tempOrderId);
            }
          }
        }
      },
      'removeTempOrder':function(tempOrderId){
        TempOrder.remove({"_id": tempOrderId});
      },

      // company bulk upload methods
      'insertBulkUserDataTotempOrder' : function(typeid,companyassureId,SPOCDetails){
        var orderDate = new Date();
        orderDate = moment(orderDate).format('MMM DD YYYY');
        var companyProfileObj = CompanyProfile.findOne({'companyAssureID':companyassureId});
          if(companyProfileObj){
            var candidatepaymentStatus = 'Paid';
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
            if(serviceDetails){
              var contract = companyProfileObj.contract;
              if(contract){
                var contractId = contract.find(function (obj) { return obj.contractStatus == 'Active' });
                if(contractId){
                  var tempCompanyOrder ={
                    "companyDetails": {
                      "companyId"                   : companyProfileObj._id,
                      "companyAssureID"             : companyassureId,
                      "companyName"                 : companyProfileObj.companyName,
                      "orderPlacedById"             : companyProfileObj._id,
                      "orderPlacedByName"           : companyProfileObj.companyName,
                      "orderPlacedByAssureID"       : companyassureId,
                      "SPOCDetails"                 : SPOCDetails,
                      "contractId"                  : contractId.contractId,
                    },
                    "serviceDetails"                : serviceDetails,
                    "orderStatus"                   : candidatepaymentStatus,
                    "paymentBy"                     : companyProfileObj.paymentBy,
                    "createdAt"                     : new Date(),
                    "orderDate"                     : orderDate,
                    "type"                          : 'companybulk',
                    "status"                        : "Active",
                  }//EOF tempCompanyOrder
                  if(tempCompanyOrder){
                    var tempOrderId = TempOrder.insert(tempCompanyOrder);
                    if(tempOrderId){
                      return tempOrderId;
                    }
                  }
                }
              }
            }
          }else{
            console.log('Company not found');
          }
          //EOF companyProfileObj

      }, 
      'updateTempOrderCompanyDetails' : function(id,formValues){
        var checkCandidate = TempOrder.findOne({"_id":id});
        if(checkCandidate){
          var candidateDetailsList = checkCandidate.candidateDetails;
          if(candidateDetailsList){
           var matchedIndex = candidateDetailsList.findIndex(candidate => candidate.candidateFirstName == formValues.candidateFirstName && candidate.candidateLastName == formValues.candidateLastName && candidate.candidateEmailId == formValues.candidateEmailId && candidate.candidateMobile == formValues.candidateMobile);
           if (matchedIndex >= 0) {
             TempOrder.update(
              {"_id":id},
              {$push:{
                ['candidateDetails.'+matchedIndex+'.verificationData'] : formValues.verificationData[0],
              }}
              );
           }else{
              TempOrder.update(
              {"_id" : id},
              {$push : {candidateDetails: formValues}},
              (err,result)=>{
                if(err){
                  
                }else{
                  return result; 
                }
              });  
           }
          }else{
              TempOrder.update(
              {"_id" : id},
              {$push : {candidateDetails: formValues}},
              (err,result)=>{
                if(err){
                  
                }else{
                  return result;
                }
              });  
           }
        }
      },
      'removeTempOrderId':function(tempOrderId){
        TempOrder.remove({"_id": tempOrderId});
      },
  });
} 