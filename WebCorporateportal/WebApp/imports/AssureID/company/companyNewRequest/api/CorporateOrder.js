import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import {CompanyDocuments} from '/imports/AssureID/company/companyNewRequest/components/UploadToServer/CompanyDocumentUploadToServer.js';
import {Order} from '/imports/AssureID/company/newRequest/api/Order.js';
export const CorporateOrders       = new Mongo.Collection("corporateOrders");
export const TempCompanyDocuments = new Mongo.Collection("tempCompanyDocuments");

if(Meteor.isServer){
	Meteor.publish('companyDocsData',(userId,uploadType,urlType)=>{
   return TempCompanyDocuments.find({"uploadType": uploadType,'userId':userId,"urlType":urlType});
  });
  Meteor.publish('matchedCorporateOrder',(companyId,contractId)=>{
   return CorporateOrders.find({"companyDetails.companyId" : companyId, "companyDetails.contractId" : contractId});
	}); 
	Meteor.publish('matchedCorporateOrderDetails',(companyAssureid)=>{
		return CorporateOrders.find({"companyDetails.companyAssureID" : companyAssureid});
	 });
	 Meteor.publish('allCorporateOrder',()=>{
		return CorporateOrders.find({},{sort :{createdAt : -1}});
	 });
	  
  Meteor.publish('matchedCorporateOrderlimit',(companyId,contractId)=>{
   return CorporateOrders.find({"companyDetails.companyId" : companyId, "companyDetails.contractId" : contractId},{sort:{'createdAt':-1}, limit:5});
	});
  
	Meteor.methods({
	 	"addTemporaryDocument": function(fileObjId,uploadType,urlType){
	 		
	    var data = CompanyDocuments.findOne({'_id':fileObjId});
	    var checkIfCSVexists = TempCompanyDocuments.findOne({'uploadType':'CSV',"userId":Meteor.userId(),"urlType":urlType});
	    var checkIfdocumentsexists = TempCompanyDocuments.findOne({'uploadType':'document',"userId":Meteor.userId(),"urlType":urlType});
	    if(data){
	    	if(uploadType == 'CSV' ){
		    	if(checkIfCSVexists){
		    		TempCompanyDocuments.update(
		                {"userId":Meteor.userId(),"uploadType": uploadType},
		                {
		                  $set : {
		                    "userId" 			      : Meteor.userId(),
						            "docsLink"          : "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path,
						            "docsFileName"      : data.name,
						            "docsFileExt"       : data.ext,
						            "uploadType"        : uploadType,
						            "urlType"           : urlType,
						            "createdAt"         : new Date(),
		                  }
		                } 
		            );
		    	}else{
			        TempCompanyDocuments.insert({
			          "userId" 			      : Meteor.userId(),
			          "docsLink"          : "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path,
			          "docsFileName"      : data.name,
			          "docsFileExt"       : data.ext,
			          "uploadType"        : uploadType,
			          "urlType"           : urlType,
			          "createdAt"         : new Date(),
			          },(error, result)=>{
			        });
		    	}
	    	}

	    	if(uploadType == 'document'){
	    		if(checkIfdocumentsexists){
		    		TempCompanyDocuments.update(
		                {"userId":Meteor.userId(),"uploadType": uploadType},
		                {
		                  $set : {
		                    "userId" 			      : Meteor.userId(),
						            "docsLink"          : "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path,
						            "docsFileName"      : data.name,
						            "docsFileExt"       : data.ext,
						            "uploadType"        : uploadType,
						            "urlType"           : urlType,
						            "createdAt"         : new Date(),
		                  }
		                }
		            );
		    	}else{
			        TempCompanyDocuments.insert({
			          "userId" 			      : Meteor.userId(),
			          "docsLink"          : "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path, 
			          "docsFileName"      : data.name,
			          "docsFileExt"       : data.ext,
			          "uploadType"        : uploadType,
			          "urlType"           : urlType,
			          "createdAt"         : new Date(),
			          },(error, result)=>{
			        });
		    	}
	    	}
	    }
    }, 
    "deleteCompanyDocs": function (id) {
    	TempCompanyDocuments.remove({'_id': id});
    },
    "insertCorporateOrders":function (formValue) {
    	var user = Meteor.user();
    	if (user) {
    		if (user.profile) {
    			var EmailID = user.profile.loggedinEmail; 
    		}
    	}
    	var serviceDetails = [];
    	var corporateOrder = CorporateOrders.findOne({},{sort: {createdAt: -1}});
        if(corporateOrder){
          var corporateOrderNo   = parseInt(corporateOrder.corporateOrderNo) + 1;
        }else{
          var corporateOrderNo   = 1; 
        } 
        var tempCompanyDocument  = TempCompanyDocuments.findOne({"uploadType" : "CSV"},{sort: {createdAt: -1}});
        if (tempCompanyDocument) {
        	var candidateListCSV   = {
	          	"link"          : tempCompanyDocument.docsLink,
	            "fileName"      : tempCompanyDocument.docsFileName,
	            "fileExt"       : tempCompanyDocument.docsFileExt,
        	} 
        }
    	var companyProfileObj = CompanyProfile.findOne({'companyAssureID':formValue.companyAssureID});
        if(companyProfileObj && corporateOrderNo){
        	var candidatepaymentStatus = 'Paid';
            formValue.services.map((services)=>{
            	var serviceDetailsData   = Services.findOne({"_id":  services._id});
	            if(serviceDetailsData){
	                var serviceDetail  = {
	                    "serviceId"                   : serviceDetailsData._id,
	                    "serviceName"                 : serviceDetailsData.serviceName,
	                    "serviceCompletionDays"       : serviceDetailsData.serviceDayNumbers,
	                    "serviceImage"                : serviceDetailsData.image,
	                    "serviceFileExt"              : serviceDetailsData.fileExt,
	                    "serviceImgName"              : serviceDetailsData.fileName,
	                    "serviceRate"                 : serviceDetailsData.serviceRate,
	                    "verificationType"            : serviceDetailsData.serviceRequired,
	                }
	                serviceDetails.push(serviceDetail); 
	            }
            });
	        if(serviceDetails){
              	var CorporateOrder ={
              		"corporateOrderNo"              : corporateOrderNo,
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
	                "serviceDetails"                : serviceDetails,
	                "CandidateListCSV"              : candidateListCSV,
	                "DocumentUploads"               : formValue.documents,
	                "TotalCandidateNumber"          : formValue.numOfCandidate-2,
	                "NumOfCandidateOrderPlacedFor"	: 0,
	                "TotalUploadDocument"           : formValue.documents.length,
	                "createdAt"                     : new Date(),
	                "corporateOrderStatus"			    : 'Order Placed',
	                "DEOStatus"			                : 'New',
	            }//EOF tempCompanyOrder
	            // console.log('CorporateOrder ',CorporateOrder);
              	if(CorporateOrder){
                	var CorporateOrderId = CorporateOrders.insert(CorporateOrder);
                	if(CorporateOrderId){
                		var memberDetails = Meteor.users.find({"roles":"data entry operator","profile.status":"Active"},{sort: {"count":1},limit:1}).fetch();
			            if(memberDetails){
			              CorporateOrders.update(
			                {"_id":CorporateOrderId},
			                {
			                  $set : {
			                    "allocatedToUserid"   : memberDetails[0]._id,
			                    "allocatedToUserName" : memberDetails[0].profile.firstname + ' ' + memberDetails[0].profile.lastname,
			                  }
			                }
			              );
			            } 
			            // Meteor.call("updateOrderCountInContract",formValue.companyAssureID,formValue.contractId,1);
                 			TempCompanyDocuments.remove({});
                			return CorporateOrderId;
                	}
                }
            }
        }else{
          console.log('Company not found');
        }
    },
    //Code by Anagha
    "insertCorporateOrderNOrder": function(tempcorporateOrder,csvDocId,documentsId){
    	// console.log("insertCorporateOrderNOrder");
    	var corpOrderMaxNo = CorporateOrders.findOne({},{sort:{createdAt: -1}});
    	if(corpOrderMaxNo){
    		if (corpOrderMaxNo.corporateOrderNo) {
    		  tempcorporateOrder.corporateOrderNo = parseInt(corpOrderMaxNo.corporateOrderNo) +1;
    		}else{
    		  tempcorporateOrder.corporateOrderNo = 1;
    		}
    	} else{
    		tempcorporateOrder.corporateOrderNo = 1;
    	}
    	// console.log("tempcorporateOrder.corporateOrderNo",tempcorporateOrder.corporateOrderNo);
    	if(tempcorporateOrder.corporateOrderNo){
    		var companyProfileObj = CompanyProfile.findOne({'_id': tempcorporateOrder.companyDetails.companyId});
    		// console.log("companyProfileObj",companyProfileObj);
	    	var CorporateOrderId  = CorporateOrders.insert(tempcorporateOrder);
	    	if(CorporateOrderId){
	    		 // console.log("CorporateOrderId",CorporateOrderId);
	     		Meteor.call('removeTempCorporateOrder',CorporateOrderId);
	     		TempCompanyDocuments.remove({"_id" : csvDocId});
	     		TempCompanyDocuments.remove({"_id" : documentsId});
	         	if (companyProfileObj) {
       			//Generate Order Per candidates
	      		var candidatepaymentStatus = 'Paid';
	    		var corporateOrderCurrent  = CorporateOrders.findOne({"_id":CorporateOrderId});
	    		if(corporateOrderCurrent){
	    			var orderDetailsLength = corporateOrderCurrent.orderDetails.length;
	     		  	Meteor.call('updatecountInCompanyProfile',corporateOrderCurrent.companyDetails.companyId,corporateOrderCurrent.companyDetails.contractId,orderDetailsLength);
	    			var basicOrderDetails = {
	    				"orderNo" 				: 0,
	    				"companyDetails" 		: corporateOrderCurrent.companyDetails,
	    				"packageDetails"	    : corporateOrderCurrent.packageDetails,
	    				"orderStatus"           : candidatepaymentStatus,
	        			"paymentBy"             : companyProfileObj.paymentBy,
	        			"createdAt"             : new Date(),
	        			"orderDate"             : new Date(),
	        			"type"                  : corporateOrderCurrent.informationFilledBy,
	        			"status"                : "Active",
	        			"tatDate"               : corporateOrderCurrent.tatDate,
	        			"corporateOrderId"      : CorporateOrderId,
	    			};//EOF of basicOrderDetails
		    		// console.log("basicOrderDetails",basicOrderDetails);
		    		if(basicOrderDetails){
		    			corporateOrderCurrent.orderDetails.map((candidateBasicData,index)=>{
							var candidateDetails = Meteor.call("insertOrderByCompanyWithOutTemp",basicOrderDetails,candidateBasicData.candidateDetails,index);
							// console.log("candidateDetails",candidateDetails);
		    				if(!candidateBasicData.candidateDetails){
		    					console.log('candidateBasicData not inserted properly ',candidateBasicData.candidateDetails);
		    				}
		    			});
		    		}
	    		}
        	}
        	var memberDetails = Meteor.users.find({"roles":"data entry operator","profile.status":"Active"},{sort: {"count":1},limit:1}).fetch();
        	// console.log("memberDetails",memberDetails);
        	if(memberDetails){
        		if(memberDetails[0]){
	          		var allocationDeo = CorporateOrders.update(
	              		{"_id":CorporateOrderId}, 
	              		{ 
	                		$set : {
	                  				"allocatedToUserid"   : memberDetails[0]._id,
	                  				"allocatedToUserName" : memberDetails[0].profile.firstname + ' ' + memberDetails[0].profile.lastname,
	                		}
	              		}
	              	);
	          		if (allocationDeo) {
	          			var id = memberDetails[0]._id;
	          			// console.log("id",id);
	          			if (id) {
	          				Meteor.users.update({"_id" : id},{
	          					$inc:{
	          						"count" : 1,
	          					}
	          				});
	          			}
	          		}
        		}else{
        			swal("Something Went Wrong. Please Contact Admin.");
        		}
        	} 
    		}    	
    	}
    },
    "insertCorporateOrderNOrderofCandidate": function(tempcorporateOrder,csvDocId){
    	// console.log("insertCorporateOrderNOrder");
      var informationFilledBy = tempcorporateOrder.informationFilledBy;
    	var corpOrderMaxNo      = CorporateOrders.findOne({},{sort:{createdAt: -1}});
    	if(corpOrderMaxNo){
    		if (corpOrderMaxNo.corporateOrderNo) {
    		  tempcorporateOrder.corporateOrderNo = parseInt(corpOrderMaxNo.corporateOrderNo) +1;
    		}else{
    		  tempcorporateOrder.corporateOrderNo = 1;
    		}
    	} else{
    		tempcorporateOrder.corporateOrderNo = 1;
    	}
    	// console.log("tempcorporateOrder.corporateOrderNo",tempcorporateOrder.corporateOrderNo);
    	if(tempcorporateOrder.corporateOrderNo){
    		var companyProfileObj = CompanyProfile.findOne({'_id': tempcorporateOrder.companyDetails.companyId});
    		// console.log("companyProfileObj",companyProfileObj);
	    	var CorporateOrderId  = CorporateOrders.insert(tempcorporateOrder);
	    	if(CorporateOrderId){
	    		  // console.log("CorporateOrderId",CorporateOrderId);

	     			Meteor.call('removeTempCorporateOrder',CorporateOrderId); 
	     			TempCompanyDocuments.remove({"_id" : csvDocId});
	         	if (companyProfileObj) {
       				//Generate Order Per candidates
	      		var candidatepaymentStatus = 'Paid';
	    			var corporateOrderCurrent  = CorporateOrders.findOne({"_id":CorporateOrderId});
	    			if(corporateOrderCurrent){
	    				var orderDetailsLength   = corporateOrderCurrent.orderDetails.length;
	     		  	Meteor.call('updatecountInCompanyProfile',corporateOrderCurrent.companyDetails.companyId,corporateOrderCurrent.companyDetails.contractId,orderDetailsLength);
		    			var basicOrderDetails = {
		    				"orderNo" 				        : 0,
		    				"companyDetails" 		      : corporateOrderCurrent.companyDetails,
		    				"packageDetails"	      	: corporateOrderCurrent.packageDetails,
		    				"orderStatus"             : candidatepaymentStatus,
		        			"paymentBy"             : companyProfileObj.paymentBy,
		        			"createdAt"             : new Date(),
		        			"orderDate"             : new Date(),
		        			"type"                  : corporateOrderCurrent.informationFilledBy,
		        			"status"                : "Active",
		        			"tatDate"               : corporateOrderCurrent.tatDate,
		        			"corporateOrderId"      : CorporateOrderId,
		    			};//EOF of basicOrderDetails
		    			// console.log("basicOrderDetails",basicOrderDetails);
		    			if(basicOrderDetails){
		    				corporateOrderCurrent.orderDetails.map((candidateBasicData,index)=>{
									var candidateDetails = Meteor.call("insertOrderByCompanyWithOutTemp",basicOrderDetails,candidateBasicData.candidateDetails,index,informationFilledBy);
									// console.log("candidateDetails",candidateDetails);
		    					if(!candidateBasicData.candidateDetails){
		    						console.log('candidateBasicData not inserted properly ',candidateBasicData.candidateDetails);
		    					}
		    				});
		    			}
	    			}
        	}
    		}    	
    	}
    }, 
    "insertCorporateOrderNOrderofManual": function(tempcorporateOrder){
    	// console.log("insertCorporateOrderNOrder");
      var informationFilledBy = tempcorporateOrder.informationFilledBy;
    	var corpOrderMaxNo = CorporateOrders.findOne({},{sort:{createdAt: -1}});
    	if(corpOrderMaxNo){
    		if (corpOrderMaxNo.corporateOrderNo) {
    		  tempcorporateOrder.corporateOrderNo = parseInt(corpOrderMaxNo.corporateOrderNo) +1;
    		}else{
    		  tempcorporateOrder.corporateOrderNo = 1;
    		}
    	} else{
    		tempcorporateOrder.corporateOrderNo = 1;
    	}
    	// console.log("tempcorporateOrder.corporateOrderNo",tempcorporateOrder.corporateOrderNo);
    	if(tempcorporateOrder.corporateOrderNo){
    		var companyProfileObj = CompanyProfile.findOne({'_id': tempcorporateOrder.companyDetails.companyId});
    		// console.log("companyProfileObj",companyProfileObj);
	    	var CorporateOrderId  = CorporateOrders.insert(tempcorporateOrder);
	    	if(CorporateOrderId){
	    		  // console.log("CorporateOrderId",CorporateOrderId);
	     			Meteor.call('removeTempCorporateOrder',CorporateOrderId);
	         	if (companyProfileObj) { 
       				//Generate Order Per candidates
	      		var candidatepaymentStatus = 'Paid';
	    			var corporateOrderCurrent  = CorporateOrders.findOne({"_id":CorporateOrderId});
	    			if(corporateOrderCurrent){
	    				var orderDetailsLength   = corporateOrderCurrent.orderDetails.length;
	     		  	Meteor.call('updatecountInCompanyProfile',corporateOrderCurrent.companyDetails.companyId,corporateOrderCurrent.companyDetails.contractId,orderDetailsLength);
		    			var basicOrderDetails = {
		    				"orderNo" 				        : 0,
		    				"companyDetails" 		      : corporateOrderCurrent.companyDetails,
		    				"packageDetails"	      	: corporateOrderCurrent.packageDetails,
		    				"orderStatus"             : candidatepaymentStatus,
		        			"paymentBy"             : companyProfileObj.paymentBy,
		        			"createdAt"             : new Date(),
		        			"orderDate"             : new Date(),
		        			"type"                  : corporateOrderCurrent.informationFilledBy,
		        			"status"                : "Active",
		        			"tatDate"               : corporateOrderCurrent.tatDate,
		        			"corporateOrderId"      : CorporateOrderId,
		    			};//EOF of basicOrderDetails
		    			// console.log("basicOrderDetails",basicOrderDetails);
		    			if(basicOrderDetails){
		    				corporateOrderCurrent.orderDetails.map((candidateBasicData,index)=>{
									var candidateDetails = Meteor.call("insertOrderByCompanyWithOutTemp",basicOrderDetails,candidateBasicData.candidateDetails,index,informationFilledBy);
									// console.log("candidateDetails",candidateDetails);
		    					if(!candidateBasicData.candidateDetails){
		    						console.log('candidateBasicData not inserted properly ',candidateBasicData.candidateDetails);
		    					}
		    				});
		    			}
	    			}
        	}
    		}    	
    	}
    },
    // update order no,id, candidate id,assureId in corporate order
    "updateorderNoNCandidateId" : function(orderInformation){
    	var order = Order.findOne({"_id" : orderInformation.orderId});
    	var orderNo = order.orderNo;
    	if (order) {
          CorporateOrders.update({"_id" : orderInformation.corporateOrderId},{
          	$set:{
          		['orderDetails.'+orderInformation.orderDetailIndex+'.orderId'] :orderInformation.orderId,
          		['orderDetails.'+orderInformation.orderDetailIndex+'.orderNo'] :orderNo,
          		['orderDetails.'+orderInformation.orderDetailIndex+'.candidateDetails.candidateId'] :orderInformation.candidateId,
          		['orderDetails.'+orderInformation.orderDetailIndex+'.candidateDetails.candidateAssureID'] :orderInformation.candidateAssureID,
          	}
          })
    	}
		},	
  });
} 