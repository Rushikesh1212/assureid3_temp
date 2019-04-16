import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
// import {CompanyDocuments} from '/imports/AssureID/company/companyNewRequest/components/UploadToServer/CompanyDocumentUploadToServer.js';
import {CorporateOrders} from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import {TempCompanyDocuments} from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import {HolidaysList} from '/imports/admin/adminDashboard/Holiday/api/HolidaysList.js';
require('moment-weekday-calc');

export const TempCorporateOrder   = new Mongo.Collection("tempCorporateOrder");

if(Meteor.isServer){
  Meteor.publish('tempCorporateOrder',(assureId,userId,informationFilledBy)=>{
   return TempCorporateOrder.find({"companyDetails.orderPlacedById": userId, "companyDetails.companyAssureID": assureId,"informationFilledBy": informationFilledBy});
  });
	Meteor.methods({
    // insert temp corporate order  
		'insertTempCorporateOrder':function(formValue) {
			var serviceDetails = []; 
      var selectedServices = [];
    	//Get the information about the current SPOC 
    	var user = Meteor.user();
    	if (user) {
    		if (user.profile) {
    			var EmailID = user.profile.loggedinEmail; 
    		}
    	}
    	
    	var candidateListCSV   = {
        	"link"          : '',
          "fileName"      : '',
          "fileExt"       : '',
    	} 
      //Get the company details from the company Profile
      var companyProfileObj = CompanyProfile.findOne({'companyAssureID':formValue.companyAssureID});
      if(companyProfileObj){
      	var candidatepaymentStatus = 'Paid';
        var exceptedChecks = 0;
      	//Fetch Services Data from the Service's Collection
          formValue.services.map((services,i)=>{
						var serviceDetailsData   = Services.findOne({"_id":  services._id});
            if(serviceDetailsData){	     
                var serviceDetail  = {
                    "serviceId"                   : serviceDetailsData._id,
                    "serviceName"                 : serviceDetailsData.serviceName,
                    "serviceCompletionDays"       : services.TAT,
                    "serviceImage"                : serviceDetailsData.image,
                    "serviceFileExt"              : serviceDetailsData.fileExt,
                    "serviceImgName"              : serviceDetailsData.fileName,
                    "serviceRate"                 : services.serviceRate,
                    "serviceRequired"             : serviceDetailsData.serviceRequired,
                    "verificationType"            : serviceDetailsData.serviceRequired,
                    "MaxCheck" 					          : parseInt(services.serviceCount),
                    "actualServiceCheck"          : 0,
								}	
                if(services.serviceRequired =="StatutoryForm"){
                  serviceDetail.selectedCard = serviceDetailsData.selectedCard;
                } 
                exceptedChecks += parseInt(services.serviceCount);
                serviceDetails.push(serviceDetail); 
                if (formValue.url == "candidate" || formValue.url == "manual") {
                  var packageService = {
                    "serviceId"       : services._id,
                    "serviceName"     : services.Name,
                    "serviceDuration" : serviceDetailsData.serviceDayNumbers,
                    "index"           : i,
                    "value"           : services.value,
                    "serviceRequired" : services.serviceRequired
                  }
                 selectedServices.push(packageService); 
                }
            }
          });
          
          if(serviceDetails){
            var newPackageId = '';
            var numOfCandidate = 0;
            var finalexpectedChecks = 0;
           
            if (formValue.url == "candidate" || formValue.url == "manual") {
              var maxObj = selectedServices.reduce(function(max, obj) {
                return parseInt(obj.serviceDuration) > parseInt(max.serviceDuration) ? obj : max;
              });
              console.log("maxObj :",maxObj);
              var matchedPackage = Packages.findOne({"packageName" : companyProfileObj.companyName+'_'+formValue.contractId});
              if (matchedPackage) {
                var updatedPackageId = Meteor.call('updatePackage',matchedPackage._id,matchedPackage.packageName,maxObj.serviceDuration,0,"Package by company",selectedServices);
                if (updatedPackageId) {
                  newPackageId = matchedPackage._id;
                }
              }else{
                var insertedPackageId = Meteor.call('createPackage',companyProfileObj.companyName+'_'+formValue.contractId,maxObj.serviceDuration,0,"Package by company",selectedServices,Meteor.userId(),"System");
                if (true) {
                  newPackageId = insertedPackageId;
                }
              }
              var packageDetails = {
                packageId         : newPackageId,
                packageName       : companyProfileObj.companyName+'_'+formValue.contractId,
                packageCompletionDays   : maxObj.serviceDuration,
                packageImage        : companyProfileObj.companyLogo,
                packageFileExt      : '',
                packageDiscount     : 0,
                packageCreated      : 'System',
                servicesIncluded    : serviceDetails,
              }; 
            }else{
              var packageDetails = {
                packageId         : companyProfileObj._id+'-'+formValue.contractId,
                packageName       : companyProfileObj.companyName+'_'+formValue.contractId,
                packageCompletionDays   : 0,
                packageImage        : companyProfileObj.companyLogo,
                packageFileExt      : '',
                packageDiscount     : 0,
                packageCreated      : 'System',
                servicesIncluded    : serviceDetails,
              }; 
            }
            var holidaysList = [];
            var HolidaysDB   = HolidaysList.find({}).fetch();
            if(HolidaysDB.length > 0){
              for(var i = 0 ;i < HolidaysDB.length; i++){
                holidaysList.push(HolidaysDB[i].holidayDate);
              }
            }
            var noOFDays            = parseInt(packageDetails.packageCompletionDays);  
            // console.log("noOFDays",noOFDays);
            if (formValue.url == "candidate" || formValue.url == "manual") {
              var tatDate1          = moment().addWorkdays(parseInt(noOFDays),holidaysList);
              var DEOStatus         = "Completed";
              // console.log("tatDate1",tatDate1);
            }else{
              var  tatDate1         = '-';
              var DEOStatus         = "New";
            }
            if (formValue.url == "manual") {
              numOfCandidate = formValue.numOfCandidate;
              finalexpectedChecks = numOfCandidate * exceptedChecks;
            }else{
              numOfCandidate = formValue.numOfCandidate - 2;
              finalexpectedChecks = numOfCandidate * exceptedChecks;
            }

          	
          	if(packageDetails){
          		var tempCorporateOrder ={
                	"companyDetails": {
	                  "companyId"                   : companyProfileObj._id,
	                  "companyAssureID"             : companyProfileObj.companyAssureID,
	                  "companyName"                 : companyProfileObj.companyName,
	                  "orderPlacedById"             : Meteor.userId(),
	                  "orderPlacedByName"           : Meteor.user().profile.name,
	                  "orderPlacedByAssureID"       : Meteor.user().profile.assureId,
	                  "SPOCDetails"                 : {
	                  	"EmailID"                   : EmailID
	                  },
	                  "contractId"                  : formValue.contractId,
	                },
	                "packageDetails"                : packageDetails,
	                "candidateListCSV"              : candidateListCSV,
	                "documentUploads"               : {},
	                "totalCandidateNumber"          : numOfCandidate,
                  "exceptedChecks"                : finalexpectedChecks,
                  "actualChecks"                  : 0,
	                "orderDetails" 	 				        : formValue.listOfCandidates,
	                "numOfCandidateOrderPlacedFor"	: 0,
                  "informationFilledBy"           : formValue.url,
	                "createdAt"                     : new Date(),
                  "tatDate"                       : new Date(tatDate1),
	                "corporateOrderStatus"			    : 'Order Placed',
	                "DEOStatus"			                : DEOStatus,
	            };//EOF tempCorporateOrder
	            if(tempCorporateOrder){
	            	var tempCorporateOrderId = TempCorporateOrder.insert(tempCorporateOrder);
              
	            }
          	}
          }
        }else{
          console.log('Company not found');
        }
		},
    // update corporate order
		"updateTempCorporateOrder" : function(tempCorporateOrderId,formValue) {
			formValue.listOfCandidates.map((listOfCandidates)=>{
				TempCorporateOrder.update({"_id" : tempCorporateOrderId},{
					$push:{
						"orderDetails" : listOfCandidates,
					}
				});
			})
		},
    "updateTempCorporateOrderforManual" : function(tempCorporateOrderId,formValue) {
      formValue.listOfCandidates.map((listOfCandidates)=>{
        TempCorporateOrder.update({"_id" : tempCorporateOrderId},{
          $push:{
            "orderDetails" : listOfCandidates,
          }
        });
      })
      var exceptedChecks      = 0;
      var numOfCandidate      = 0;
      var finalexpectedChecks = 0; 
      var tempcorporateOrder = TempCorporateOrder.findOne({"_id" : tempCorporateOrderId});
      if (tempcorporateOrder) {
        if (tempcorporateOrder.packageDetails) {
          if (tempcorporateOrder.packageDetails.servicesIncluded) {
             tempcorporateOrder.packageDetails.servicesIncluded.map((services)=>{
                 exceptedChecks += parseInt(services.MaxCheck);                 
             });
             numOfCandidate      = tempcorporateOrder.totalCandidateNumber + formValue.numOfCandidate;
             finalexpectedChecks = numOfCandidate * exceptedChecks;
             TempCorporateOrder.update({"_id" : tempCorporateOrderId},{
              $inc:{
                "totalCandidateNumber" : formValue.numOfCandidate,               
              },
              $set:{
               "exceptedChecks"        : finalexpectedChecks,
              }
             });
          }
        }
      }
    },

    // delete orderdetails from corporate order
    'deleteCandidateFromTempCorpOrder':function (tempCorporateOrderId,index,csvFileId) {
      TempCorporateOrder.update(
        {"_id" : tempCorporateOrderId},
        {$unset: 
            {
              ['orderDetails.'+index] : 1 ,  
            }
        }
      ); 
      TempCorporateOrder.update(
        {"_id" : tempCorporateOrderId},
        {$pull: 
            {
              ['orderDetails'] : null ,
            } 
        }
      );
      var tempCorporateOrder = TempCorporateOrder.findOne({"_id" : tempCorporateOrderId});
        if (tempCorporateOrder) {
          if (tempCorporateOrder.orderDetails) {
            var tempOrdercandidateLength = tempCorporateOrder.orderDetails.length;
            if (tempOrdercandidateLength == 0) {
              Meteor.call('removeTempCorporateOrder',tempCorporateOrderId);
              if (csvFileId) {
                Meteor.call('deleteCompanyDocs',csvFileId);
              }
            }
          }
          var exceptedChecks = 0;
          if (tempCorporateOrder.packageDetails) {
            if (tempCorporateOrder.packageDetails.servicesIncluded) {
               tempCorporateOrder.packageDetails.servicesIncluded.map((services)=>{
                   exceptedChecks += parseInt(services.MaxCheck);                 
               });

               TempCorporateOrder.update({"_id" : tempCorporateOrderId},{
                $inc:{
                  "totalCandidateNumber" : -1, 
                  "exceptedChecks"       : (-1)* exceptedChecks,            
                }
               });
            }
          }

        }
    },
    // delete temp corporate order
    "removeTempCorporateOrder" : function(id) {
      TempCorporateOrder.remove({"_id" : id});
    },
    // update Docs To TempCorporateOrder
    "updateDocsToTempCorporateOrder": function (formValue) {
      if (formValue.url =="candidate") {
        var updateDocsToTempCorporateOrder = TempCorporateOrder.update({"_id" : formValue.tempcorporateOrderId},{
          $set:{
            "candidateListCSV.link"     : formValue.csvDocument.docsLink,
            "candidateListCSV.fileName" : formValue.csvDocument.docsFileName,
            "candidateListCSV.fileExt"  : formValue.csvDocument.docsFileExt,
          }
        });
      }else{
        var updateDocsToTempCorporateOrder = TempCorporateOrder.update({"_id" : formValue.tempcorporateOrderId},{
          $set:{
            "candidateListCSV.link"     : formValue.csvDocument.docsLink,
            "candidateListCSV.fileName" : formValue.csvDocument.docsFileName,
            "candidateListCSV.fileExt"  : formValue.csvDocument.docsFileExt,
            "documentUploads"           : formValue.documents,
          }
        });
      }
      
      if (updateDocsToTempCorporateOrder) {

          var tempcorporateOrder = TempCorporateOrder.findOne({"_id" : formValue.tempcorporateOrderId});
          // console.log("tempcorporateOrder",tempcorporateOrder);
          if (formValue.url =="candidate") {
            if (tempcorporateOrder) { 
               var csvDocId    = formValue.csvDocument._id;
               // console.log("csvDocId",csvDocId);     
               tempcorporateOrder.tempcorporateOrderId = tempcorporateOrder._id;
               Meteor.call('insertCorporateOrderNOrderofCandidate',tempcorporateOrder,csvDocId);
            }
          }else{
             if (tempcorporateOrder) {  
               var csvDocId    = formValue.csvDocument._id;
               // console.log("csvDocId",csvDocId); 
               var documentsId = formValue.documents._id; 
               // console.log("documentsId",documentsId);
               tempcorporateOrder.tempcorporateOrderId = tempcorporateOrder._id;
               Meteor.call('insertCorporateOrderNOrder',tempcorporateOrder,csvDocId,documentsId);
            }
          }        
      }
    },
   
	}); 
}