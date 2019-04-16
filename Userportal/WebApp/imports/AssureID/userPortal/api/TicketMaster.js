import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const TicketMaster = new Mongo.Collection("ticketMaster");
export const TicketBucket = new Mongo.Collection("ticketbucket");
export const TempFEUploadData = new Mongo.Collection("tempFEUploadData");
import {CompanySettings} from '/imports/admin/companySettings/api/CompanySettingMaster.js';
import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import {RequestPool} from '/imports/AssureID/company/api/companyProfile.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';

if(Meteor.isServer){
require('moment-weekday-calc');
	Meteor.publish('allNewTickets',()=>{
        return TicketMaster.find({"ticketStatus.status":"New"});
	});
	Meteor.publish('allTicketBucket',()=>{
        return TicketMaster.find({});
	});
	Meteor.publish('singleTicket',(id)=>{
        return TicketMaster.find({"_id": id});
	});

	Meteor.publish('allTickets',()=>{
        return TicketMaster.find({});
	});

	Meteor.publish('allTicketsCount', function() {
	  Counts.publish(this, 'allTicketsCount', TicketMaster.find({}) );
	});

	Meteor.publish('tempFEUploadData',()=>{
        return TempFEUploadData.find({});
	});
	Meteor.publish('tempFEImgData',(ticketId, type)=>{
        return TempFEUploadData.find({ ticketId :ticketId, type : { $in: [type, "data"] }   });
	});

	Meteor.publish('allocatedTickets',(userId)=>{
        return TicketMaster.find({ticketElement: { $elemMatch: { allocatedToUserid:userId}}});
	});

	Meteor.methods({
   

	'delTempFEImage':function(id){
		TempFEUploadData.remove({'_id':id});
	},
	
  'saveTicketFEImgUpload':function(ticketId, img, type) {
  		// var imgName = img.split('uploads%2F')[1];
    	TempFEUploadData.insert({  
			ticketId  : ticketId,
			// imgs      : "https://s3.ap-south-1.amazonaws.com/assureidportal/uploads/"+imgName,
			imgs      : img,
			type      : type,
			createdAt : new Date(),
		});    		

  },
 
 'createTicket':function(newTicket,index) {	

  	var count = 0;
	  //Ticket Generation Logic
  	var ticketObj = TicketMaster.findOne({}, {sort: { createdAt : -1}});
  	if(ticketObj){
  		var first = ticketObj.ticketNumber.substr(0, 2);
		  var last  = parseInt(ticketObj.ticketNumber.substr(ticketObj.ticketNumber.length - 6));
			last = last + 1; 
		//Next number is padding 
	   	var padding = 6;
	    var zeroes = "0";			    
	    for (var i = 0; i < padding; i++) { zeroes += "0"; }
		    var nextNumber = (zeroes + last).slice(padding * -1);
				if(last >= 100000){
					nextNumber = '000000';
					var first2Char = first.substr(1,1); /*second digit*/
					var secondAscii = first2Char.charCodeAt(); /*second ascii*/
					var firstChar = first.substr(0,1); /*First char*/
					if(secondAscii == 90){
						var firstAscii = firstChar.charCodeAt() + 1;
						first = String.fromCharCode(firstAscii) + 'A';
					}else {
						var newsecond = secondAscii + 1;
						first = firstChar +''+ String.fromCharCode(newsecond);
					}
				}
				var ticketNumber = first+''+nextNumber;			   
  	}else{
  		var ticketNumber = 'AA000000';
  	}
  	if(ticketNumber){
  		//Create a ticket Master 
      if (newTicket.verificationType == "reference") {
       	var varificationDocument = [];
      }else if (newTicket.verificationType == "Identity") {
				 var varificationDocument = []; 
  			 var documents = {
         	 "proofType"       : newTicket.verificationData.identityType,
         	 "proofOfDocument" : '',
           "fileExt"         : '', 
           "fileName"        : '',
          }
         documents.proofOfDocument = newTicket.verificationData.proofOfDocument;
         documents.fileExt         = newTicket.verificationData.fileExt;
         documents.fileName        = newTicket.verificationData.fileName;
         varificationDocument.push(documents);
  			if (newTicket.verificationData.proofOfDocument2 != "") {
  				var documents2 = {
  				 "proofType"       : newTicket.verificationData.identityType,
         	 "proofOfDocument" : '',
           "fileExt"         : '', 
           "fileName"        : '',
  				}
          documents2.proofOfDocument = newTicket.verificationData.proofOfDocument2;
          documents2.fileExt         = newTicket.verificationData.fileExt2;
          documents2.fileName        = newTicket.verificationData.fileName2;
          varificationDocument.push(documents2);
  			}
	  	}else{
				var varificationDocument = []; 
				var documentObj={
					"proofOfDocument" : newTicket.verificationData.proofOfDocument,
					"fileExt"		      : newTicket.verificationData.fileExt,
					"fileName"        : newTicket.verificationData.fileName,
				}
				varificationDocument.push(documentObj);
      }
			
		newTicket.ticketNumber 			    = ticketNumber;
		newTicket.verificationDocument 	= varificationDocument;
		newTicket.createdAt			      	= new Date();
		var newTicket1 = TicketMaster.insert(newTicket,(error, result)=>{
			if(error){
				
			}else{
				//User Entry into ticketElement / activity
				var holidaysList = [];
        var HolidaysDB = HolidaysList.find({}).fetch();
		    if(HolidaysDB.length){
		    	for(i = 0 ;i < HolidaysDB.length; i++){
		        holidaysList.push(HolidaysDB[i].holidayDate);
		      }
		      
		    }
			  var tatDate1   = moment().addWorkdays(parseInt(2),holidaysList);
				var insertData ={
					"userId"              : newTicket.userId,
					"userName"            : newTicket.userName,
					"allocatedToUserid"   : "",
					"allocatedToUserName" : "",
					"role"                : "Customer",
					"roleStatus"          : "New",
					"msg"                 : "Created New Ticket",
					"createdAt"           : new Date(),
					"tatDate"             : new Date(tatDate1),
				}
				TicketMaster.update(
					{'_id':newTicket1},
					{$push:{
							'ticketElement':insertData,
						   }
					},(error,result)=>{
						if(error){
							
						}else if(result){
							Meteor.call("updateEditStatus",newTicket.userId,newTicket.verificationType,newTicket.verificationId,newTicket.orderNo,newTicket.orderDate,(error,result)=>{
								if(error){
									
								}else{
									//Find user with minium ticket allocated
									var memberDetails = Meteor.users.find({"profile.status":"Active", "roles":"screening committee"},{sort: {"count":1},limit:1}).fetch();
										
									if(memberDetails.length > 0){
										//Get maximum number of tickets which can be allocated to screening committee
										var companyObj = CompanySettings.findOne({"maxnoOfTicketAllocate.role":"screening committee"});
										if(companyObj){
											var maxTicketAllocateArray = companyObj.maxnoOfTicketAllocate;
											//Find max number of ticket allocation to "screening committee"
											if(maxTicketAllocateArray){
												var obj1 = maxTicketAllocateArray.find(function (obj) { return obj.role == 'screening committee' });
      											if(obj1){
													var count  = memberDetails[0].count; 
													var userID = memberDetails[0]._id;
													var allocatedToUserName = memberDetails[0].profile.firstname + ' ' + memberDetails[0].profile.lastname;
													var insertData = {
														"userId"              : "",
														"userName"            : "",
														"allocatedToUserid"   : userID,
														"allocatedToUserName" : allocatedToUserName,
														"role"                : "system action",
														"roleStatus"          : "NewScrAllocated",
														"msg"                 : "System Allocated Ticket To Screening Committee",
														"createdAt"           :  new Date(),
														"tatDate"             :  new Date(tatDate1)
													}
													TicketMaster.update(
														{'_id':newTicket1},
														{$push:{
																'ticketElement':insertData,
																}
														},(error,result)=>{
															if(error){
																
															}else if(result){
																//Increment count of screening committee user
																
																Meteor.call('updateCommitteeUserCount',count+1,userID,(err,result)=>{
																	if(err){
																		
																	}else{
																		
																	}
																});									
															}
													});
													// }//end of userList
												}//end of obj
											}//end of maxTicketAllocateArray
										}//end of companyobj
									}//end of memberDetails
								}	
							});								
						}	//end of updateState			
				});	
				/*Insert ticketDetails Object in Order*/ 
				
				var ticketDetails = TicketMaster.findOne({'_id':result});
				if(ticketDetails){						
					var orderTicketDetails = {
						ticketId      : newTicket1,
						ticketNumber  : ticketDetails.ticketNumber,
						status        : "In Process",
						completedDate : "",
					}
					Order.update(
						{'_id':ticketDetails.orderId},
						{$set:{
							['candidateDetails.'+newTicket.matchCandidateIndex+'.verificationData.'+index+'.ticketDetails']: orderTicketDetails,
							['candidateDetails.'+newTicket.matchCandidateIndex+'.verificationData.'+index+'.serviceId']    : newTicket.serviceId,

						}}
					)
				}
			}//EOF else
		});
			// }//end of newticket1

		// 
		if(newTicket1){
			var userAssureID = Meteor.user().profile.assureId;
			
			RequestPool.remove({"assureId":userAssureID,"orderId":newTicket.orderId});	
		}

		// Order.update({})
		return newTicket1;	
  	}
  	
  },  
	
	'updateOuterStatus':function(ticketId){
		TicketMaster.update(
		{'_id':ticketId},
		{   $set:{
				"ticketStatus.0.role":"screening committee",
			}
		}
		)
	},
	'updateCommitteeUserCount':function(count,id){		
		return Meteor.users.update(
			{'_id':id},
			{$set:{
				'count':count
			}}
		);
	},
	'updateTicketElement':function(ticketId,newTicketAllocated){
		TicketMaster.update(
				{'_id':ticketId},
				{   $push:{
						'ticketElement':newTicketAllocated,
					}
				}
		)
	},
	'updateEditStatus':function(userId,verificationType,verificationId,orderNo,orderDate){
		// console.log("userId :"+userId+" verificationType :"+verificationType+" verificationId :"+verificationId+" orderNo :"+orderNo+" orderDate :"+orderDate);
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
		}else if (verificationType == "reference") {
			var verificationUniqueId = "referenceId";
		}
		return UserProfile.update(
				{'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
				{ $set:{
              [verificationType+'.$'+'.verifiedStatus']   : "In Process",
              [verificationType+'.$'+'.editStatus']       : "Block" ,
              [verificationType+'.$'+'.orderNo']          :  orderNo,
              [verificationType+'.$'+'.orderDate']        :  orderDate,
					} 
				}
			);
	},
 'updateTicketAfterReopen':function (userId,verificationType,verificationId,verificationData) {
    var verificationDocument = [];
		var documentObj={
			"proofOfDocument" : verificationData.proofOfDocument,
			"fileExt"		  : verificationData.fileExt,
			"fileName"        : verificationData.fileName,
		}
		verificationDocument.push(documentObj);
        TicketMaster.update({'userId' : userId, "verificationType" : verificationType, "verificationId" : parseInt(verificationId)},
     	  {$set: {
     	  	"verificationData" : verificationData,
     	  	"verificationDocument" : verificationDocument,
     	  }         	  
     	});
		var memberDetails = Meteor.users.find({"roles":"screening committee"},{sort:{'count':1}}).fetch();
    	var companyObj = CompanySettings.findOne({"maxnoOfTicketAllocate.role":"screening committee"});
		for(var i=0;i<companyObj.maxnoOfTicketAllocate.length;i++){
			if(companyObj.maxnoOfTicketAllocate[i].role == "screening committee"){
			  var allocatedtickets = companyObj.maxnoOfTicketAllocate[i].maxTicketAllocate;
			}
		}
	    var ticket = TicketMaster.findOne({"userId" :userId ,"verificationType" : verificationType, "verificationId" : parseInt(verificationId)});
		if (ticket) {
			var ticketid = ticket._id;
			for(var k=0;k<memberDetails.length;k++){
			  if(memberDetails[k].count==undefined || memberDetails[k].count<allocatedtickets){
				var firstName = memberDetails[k].profile.firstname;
				var lastName = memberDetails[k].profile.lastname;
				var allocatedToUserName = firstName +" "+ lastName;
				var insertData = {
					"userId"              : "",
					"userName"            : "",
					"allocatedToUserid"   : memberDetails[k]._id,
					"allocatedToUserName" : allocatedToUserName,
					"role"                : "system action",
					"roleStatus"          : "NewScrAllocated",
				    "msg"                 : "System Allocated Ticket To Screening Committee",
					"createdAt"           :  new Date(),
				}
		
				Meteor.call('updateTicketElement',ticketid,insertData,function(error,result){
				});
			

				if(memberDetails[k].count){
				  var newCount = memberDetails[k].count + 1;
				}else{
				  var newCount = 1;
				}
				
				break;
			}else{
										
				// Meteor.call('updateCommitteeUserCount',0,memberDetails[k]._id);
			} 
		}
		 Meteor.call('updateReopenStatus',userId,verificationType,verificationId);
		}

      },
	});
}