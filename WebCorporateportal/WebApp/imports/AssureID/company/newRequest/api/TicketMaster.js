import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
export const TicketMaster = new Mongo.Collection("ticketMaster");
export const TicketBucket = new Mongo.Collection("ticketbucket");
export const TempFEUploadData = new Mongo.Collection("tempFEUploadData");
import {CompanySettings} from '/imports/admin/companySettings/api/CompanySettingMaster.js';
import { UserProfile } from '/imports/AssureID/user/api/userProfile.js';
import {Order}         from '/imports/AssureID/company/newRequest/api/Order.js';
import {HolidaysList}  from '/imports/admin/adminDashboard/Holiday/api/HolidaysList.js';

if(Meteor.isServer){

	Meteor.publish('allNewTickets',()=>{
        return TicketMaster.find({"ticketStatus.status":"New"});
	});
	Meteor.publish('singleTicket',(id)=>{
        return TicketMaster.find({"_id":id});
	});
	Meteor.publish('allTicketBucket',()=>{
        return TicketMaster.find({});
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
	    	var varificationDocument = [];

				varificationDocument.push(newTicket.verificationData.proofOfDocument);

				var varificationDocument = [];
				var documentObj={
					"proofOfDocument" : newTicket.verificationData.proofOfDocument,
					"fileExt"		      : newTicket.verificationData.fileExt,
					"fileName"        : newTicket.verificationData.fileName,
				}
				varificationDocument.push(documentObj);

				newTicket.ticketNumber 			    = ticketNumber;
				newTicket.verificationDocument 	= varificationDocument;
				newTicket.createdAt			      	= new Date();
				var newTicket1 = TicketMaster.insert(newTicket,(error, result)=>{
					if(error){
					
					}else{
						//User Entry into ticketElement / activity
							var insertData={
							"userId"              : newTicket.userId,
							"userName"            : newTicket.userName,
							"allocatedToUserid"   : "",
							"allocatedToUserName" : "",
							"role"                : "Customer",
							"roleStatus"          : "New",
							"msg"                 : "Created New Ticket",
							"createdAt"           : new Date(),
							"tatDate"             : newTicket.tatDate,
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
												// console.log("memberDetails",memberDetails);
											if(memberDetails.length > 0){
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
													"tatDate"             :  newTicket.tatDate
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
								  "status"  : "Inactive",
								}}
							)
						}
					}//EOF else
				});
				// }//end of newticket1

			return newTicket1;	
	  	}
	  	
	  }, 
	  'updateCommitteeUserCount':function(count,id){		
			return Meteor.users.update(
				{'_id':id},
				{$set:{
					'count':count
				}}
			);
		}, 
		'updateEditStatus':function(userId,verificationType,verificationId,orderNo,orderDate){
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
		'getCandidateOrderList':function(AssureID,ServiceId,contractId) {
			console.log('assureId ', AssureID , ' ServiceId ',ServiceId);
			var candidateList = [];
			var serviceName = '';
			var orderDetails   = Order.find({  "companyDetails.companyAssureID" : AssureID, 
    			                               "serviceDetails.serviceId"       : ServiceId,
                                    		},{sort:{"createdAt": -1}}).fetch();

			if(orderDetails.length > 0){
				serviceName = orderDetails[0].serviceDetails.serviceName;
				orderDetails.map((order,index)=>{
					if(order.candidateDetails){
						if(order.candidateDetails.length > 0){
							var candidateDetailsList = order.candidateDetails;
							if(candidateDetailsList){
								candidateDetailsList.map((singleCandidate,i)=>{
								    var verifyData = singleCandidate.verificationData;
								    if(verifyData){
								    	verifyData.map((data,j)=>{
								    		if(data.verificationType == "permanentAddress"){
								    			var verificationData = new Object();
								    			verificationData.line1 = data.line1 + data.line2 + data.line3 + data.landmark;
								    			verificationData.line2 = data.city + data.state + data.country + data.pincode;
								    			verificationData.line3 = 'From ' + data.residingFrom + ' To ' + data.residingTo;
								    		}else if(data.verificationType == "currentAddress"){
								    			var verificationData = new Object();
								    			verificationData.line1 = data.tempLine1 + data.tempLine2 + data.tempLine3 + data.tempLandmark;
								    			verificationData.line2 = data.tempCity + data.tempState + data.tempCountry + data.tempPincode;
								    			verificationData.line3 = 'From ' + data.tempresidingFrom + ' To ' + data.tempresidingTo;
								    		}
								    		//Get Ticket Status
								    		Meteor.call('corpOrderTktStatus',data.ticketDetails.ticketId,(error,res)=>{
								    			if(error){
								    				console.log('corpOrderTktStatus call error ',error);
								    			}else{
								    				if(res){
								    					if(verificationData.line1){
												    		var candidate = {
														      "candidateAssureID"         : singleCandidate.candidateAssureID,
														      "candidateName"             : singleCandidate.candidateFirstName + ' ' + singleCandidate.candidateLastName,
														      "candidateEmailId"          : singleCandidate.candidateEmailId,
														      "candidateMobile"           : singleCandidate.candidateMobile,
														      "candidateAadharNo"         : singleCandidate.candidateAadharNo,
														      "verificationData"          : verificationData,
														      "verificationDocument"      : data.documents,
														      "verificationStatusBGColor" : res.bgColor,
														      "verificationDataStatus"    : res.displayMsg,
														      "report"                    : '-'
														    };
															if(candidate){
														    	candidateList.push(candidate);
														    }					    
											    		}
								    				}else{
								    					console.log('corpOrderTktStatus call no result ');
								    				}
								    			}
								    		});
								    		
								    	});
								    }
								    
								});
							}
						}
					}
				});
			}else{
				console.log('no data found');
			}
			if(candidateList){
				return infoCandidateOrderList = {
					serviceName : serviceName,
					candidateList : candidateList,
				};
			}
		},
		'corpOrderTktStatus' : function(ticketId){
			var displayArrayMsg = [
				{
					roleStatus : 'New',
					role 	   : 'data entry operator',
					displayMsg : 'Case Initiated',
					bgColor    : 'blockwrap1 bgOrange', 
				},
				{
					roleStatus : 'NewScrAllocated',
					role 	   : 'system action',
					displayMsg : 'Case Initiated',
					bgColor    : 'blockwrap1 bgOrange', 
				},
				{
					roleStatus : 'ScreenApproved',
					role 	   : 'screening committee',
					displayMsg : 'Case Initiated',
					bgColor    : 'blockwrap1 bgOrange', 
				},
				{
					roleStatus : 'screenTLAllocated',
					role 	   : 'system action',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'Assign',
					role 	   : 'team leader',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'AssignReject',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ReAssign',
					role 	   : 'team leader',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'AssignAccept',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'SelfAllocated',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'FEAllocated',
					role 	   : 'field expert',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'BAAllocated',
					role 	   : 'ba',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ProofSubmit-Pending',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ProofSubmit',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ProofResubmitted',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ProofResubmitted-Pending',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'VerificationPass-CompanyInfo',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ReportSubmitted',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ReportGenerated',
					role 	   : 'team member',
					displayMsg : 'Report Generating',
					bgColor    : 'blockwrap1 bgGeen', 
				},
				{
					roleStatus : 'TMReviewSubRemark',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'TMReviewRemark',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'QTMReviewRemark-GetUsrRemark',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'QTMReviewRemark',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ReportReGenerated',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'QAFail',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'ReviewFail',
					role 	   : 'team member',
					displayMsg : 'Verification Started',
					bgColor    : 'blockwrap1 bgYellow', 
				},
				{
					roleStatus : 'QTLReviewRemark',
					role 	   : 'quality team leader',
					displayMsg : 'Report Generating',
					bgColor    : 'blockwrap1 bgGreen', 
				},
				{
					roleStatus : 'TicketClosed',
					role 	   : 'quality team leader',
					displayMsg : 'Completed',
					bgColor    : 'blockwrap1 bgBlue', 
				},
			];
			var ticketObj = TicketMaster.findOne({"_id":ticketId}, {sort: { createdAt : -1}});
			if(ticketObj){
				var lastTktElem = ticketObj.ticketElement[ticketObj.ticketElement.length-1];
				if(lastTktElem){
					var ticketStatus = displayArrayMsg.find(function (obj) { return obj.roleStatus == lastTktElem.roleStatus });
					if(ticketStatus){
						return ticketStatus;
					}
				}
			}
		},

	});
}