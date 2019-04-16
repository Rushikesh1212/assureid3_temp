// import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { CompanySettings } from '/imports/admin/companySettings/api/CompanySettingMaster.js';
import { Order } from '/imports/admin/orderManagement/api/Order.js';
import { UserProfile } from '/imports/admin/userViewProfile/api/userProfile.js';
import { TempFEUploadData } from '/imports/admin/caseManagement/api/TicketMaster.js';

// export const TempTicketImages = new Mongo.Collection("tempTicketImages");
// export const TempTicketVideo = new Mongo.Collection("tempTicketVideo");


if(Meteor.isServer){
	
	// Meteor.publish('singleTicket',(_id)=>{
	// 	// console.log('ticket id : ',_id);
    //     return TicketMaster.find({"_id" : _id}); 
	// });

	// Meteor.publish('allTicketImages',()=>{
	//      return TempTicketImages.find({});
	// });

	// Meteor.publish('allTicketVideo',()=>{
	//      return TempTicketVideo.find({});
	// });
}

Meteor.methods({

	'saveFEDataTemp':function(formValues){
		var tempDataFound = TempFEUploadData.findOne({ ticketId : formValues.ticketId, type : 'data' });
		if(tempDataFound){
	    	TempFEUploadData.update({'_id' : tempDataFound._id},
									{ $set : {
												textLists  : formValues.textLists,
												checkLists : formValues.checkLists,
                        videos     : formValues.videos,
												status     : formValues.status,
												remark     : formValues.remark,
												type       : 'data',
												updatedAt  : new Date(),
											} 
									}); 
		}else{
	    	TempFEUploadData.insert({  
				ticketId   : formValues.ticketId,
				textLists  : formValues.textLists,
				checkLists : formValues.checkLists,
        videos     : formValues.videos,
				status     : formValues.status,
				remark     : formValues.remark,
				type       : 'data',
				createdAt  : new Date(),
			}); 			
		}

	},

	'FELogin':function(email, password){
		console.log("serveside FELogin :",email, password);
		var userFound = Meteor.users.findOne({'emails.0.address':email});
		if(userFound && Roles.userIsInRole(userFound._id, ['field expert'])){
			return true;
		}else{
			return false;
		}
	},

	// 'autoAllocateMember':function(role,serviceName){
	// 	//Allocating Ticket to Screening Committte
	// 	var memberDetails = Meteor.users.find({"roles":role,"profile.status":"Active"}).fetch();
	// 	if(memberDetails){
	// 		//Get maximum number of tickets which can be allocated to screening committee
	// 		var companyObj = CompanySettings.findOne({"maxnoOfTicketAllocate.role":role});
	// 		if(companyObj){
	// 			var maxTicketAllocateArray = companyObj.maxnoOfTicketAllocate;
	// 			//Find max number of ticket allocation to "screening committee"
	// 			var obj1 = maxTicketAllocateArray.find(function (obj) { return obj.role == role });
	// 			if(obj1){
	// 				//Find user with minium ticket allocated
	// 				var userList = memberDetails.reduce(function(prev,curr){ return (prev.count || prev.count < curr.count ) ? prev : curr;});
	// 				if(userList){
	// 					return userList;
	// 				}
	// 			}
	// 		}
	// 	}	
	// },

		// 'genericUpdateTicketMasterElement': function (ticketid, insertData) {
		// 	//Update TicketElement
		// 	//Write code for split
		// 	console.log('ticketid: ', ticketid);
		// 	console.log('insertData: ', insertData);
		// 	var memberValue = insertData.allocatedToUserName;
		// 	var a = memberValue.indexOf("(");

		// 	if (a !== -1) {
		// 		var splitDropdownValue = memberValue.split('(');
		// 		insertData.allocatedToUserName = splitDropdownValue[0];
		// 		var countValueSplit = splitDropdownValue[1].split(')');
		// 	}

		// 	var updateStatus = TicketMaster.update({
		// 		'_id': ticketid
		// 	}, {
		// 		$push: {
		// 			'ticketElement': insertData
		// 		}
		// 	});
		// 	console.log('insertData.roleStatus: ', insertData.roleStatus);

		// 	switch (insertData.roleStatus) {
		// 		case 'ScreenApproved':
		// 			var newCount = Meteor.user().count;

		// 			if (newCount) {
		// 				Meteor.call('updateCommitteeUserCount', newCount - 1, insertData.userId);
		// 			}

		// 			var role = "team leader";
		// 			var roleStatus = "screenTLAllocated";
		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				var newMember = Meteor.call('autoAllocateMember', role, ticketDetails.serviceName);
		// 				var roleSentence = Meteor.call('toTitleCase', role);

		// 				if (roleSentence) {
		// 					var insertData = {
		// 						"userId": '',
		// 						"userName": '',
		// 						"role": 'system action',
		// 						"roleStatus": roleStatus,
		// 						"msg": "System Allocated Ticket To " + roleSentence,
		// 						"allocatedToUserid": newMember[0]._id,
		// 						"allocatedToUserName": newMember[0].profile.firstname + ' ' + newMember[0].profile.lastname,
		// 						"createdAt": new Date() //Update TicketElement - System Action

		// 					};
		// 					TicketMaster.update({
		// 						'_id': ticketid
		// 					}, {
		// 						$push: {
		// 							'ticketElement': insertData
		// 						}
		// 					});
		// 					Meteor.call('updateCommitteeUserCount', newMember[0].count + 1, newMember[0]._id);
		// 				}
		// 			}

		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'Started'
		// 				}
		// 			});
		// 			break;

		// 		case 'ScreenRejected':
		// 			var newCount = Meteor.user().count;

		// 			if (newCount) {
		// 				Meteor.call('updateCommitteeUserCount', newCount - 1, insertData.userId);
		// 			}

		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				// console.log('ticketmaster ',ticketid,ticketDetails.userId,insertData.remark,ticketDetails.verificationType,ticketDetails.verificationId);
		// 				Meteor.call('changeStatusMethod', ticketid, ticketDetails.userId, insertData.remark, ticketDetails.verificationType, ticketDetails.verificationId);
		// 			}

		// 			break;

		// 		case 'Assign':
		// 			count = parseInt(countValueSplit) + 1;

		// 			if (count) {
		// 				Meteor.call('updateCommitteeUserCount', count, insertData.allocatedToUserid);
		// 			}

		// 			break;

		// 		case 'AssignAccept':
		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'Initiated'
		// 				}
		// 			});
		// 			break;

		// 		case 'AssignReject':
		// 			var teamMember = Meteor.users.findOne({
		// 				"_id": insertData.userId
		// 			});

		// 			if (teamMember && teamMember.count) {
		// 				var newCount = teamMember.count - 1;
		// 			} else {
		// 				var newCount = 0;
		// 			}

		// 			Meteor.call('updateCommitteeUserCount', newCount, teamMember._id);
		// 			break;

		// 		case 'ProofSubmit-Pending':
		// 			var updatRes = TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$set: {
		// 					'submitedDoc.createdAt': insertData.createdAt,
		// 					'submitedDoc.documents': insertData.submitedDoc
		// 				}
		// 			});
		// 			if(updatRes){
		// 				TempTicketImages.remove({});
		// 				TempTicketVideo.remove({});
		// 				TempFEUploadData.remove({'ticketId':ticketid, "type" : {$in:["image","data"]} });
		// 			}
		// 			// TempTicketImages.remove({});
		// 			// TempTicketVideo.remove({}); //notification to be implemented  - Field person was not able to complete the verification.

		// 			break;

		// 		case 'ProofSubmit':
		// 			var updatRes  = TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$set: {
		// 					'submitedDoc.createdAt': insertData.createdAt,
		// 					'submitedDoc.documents': insertData.submitedDoc
		// 				}
		// 			});
		// 			if(updatRes){
		// 				TempTicketImages.remove({});
		// 				TempTicketVideo.remove({});
		// 				TempFEUploadData.remove({'ticketId':ticketid, "type" : {$in:["image","data"]} });
		// 			}
		// 			var curTicket = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (curTicket) {
		// 				var ticketElements = curTicket.ticketElement;
		// 				var selfAllocated = ticketElements.find(function (obj) {
		// 					return obj.roleStatus == 'SelfAllocated';
		// 				});

		// 				if (selfAllocated) {
		// 					var insertData = {
		// 						"userId": Meteor.userId(),
		// 						"userName": Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
		// 						"allocatedToUserid": '',
		// 						"allocatedToUserName": '',
		// 						"role": 'team member',
		// 						"roleStatus": 'VerificationPass',
		// 						"msg": 'Approved Verification Information',
		// 						"createdAt": new Date()
		// 					};
		// 					TicketMaster.update({
		// 						'_id': ticketid
		// 					}, {
		// 						$push: {
		// 							'ticketElement': insertData
		// 						}
		// 					});
		// 				}
		// 			} //notification to be implemented - Field Expert has collected the infomration.


		// 			break;

		// 		case 'ProofResubmitted':
		// 			var updatRes = TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$set: {
		// 					'submitedDoc.createdAt': insertData.createdAt,
		// 					'submitedDoc.documents': insertData.submitedDoc
		// 				}
		// 			});
		// 			if(updatRes){
		// 				TempTicketImages.remove({});
		// 				TempTicketVideo.remove({});
		// 				TempFEUploadData.remove({'ticketId':ticketid, "type" : {$in:["image","data"]} });
		// 			}
		// 			var curTicket = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (curTicket) {
		// 				var ticketElements = curTicket.ticketElement;
		// 				var selfAllocated = ticketElements.find(function (obj) {
		// 					return obj.roleStatus == 'SelfAllocated';
		// 				});

		// 				if (selfAllocated) {
		// 					var insertData = {
		// 						"userId": Meteor.userId(),
		// 						"userName": Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
		// 						"allocatedToUserid": '',
		// 						"allocatedToUserName": '',
		// 						"role": 'team member',
		// 						"roleStatus": 'VerificationPass',
		// 						"msg": 'Approved Verification Information',
		// 						"createdAt": new Date()
		// 					};
		// 					TicketMaster.update({
		// 						'_id': ticketid
		// 					}, {
		// 						$push: {
		// 							'ticketElement': insertData
		// 						}
		// 					});
		// 				}
		// 			} //notification to be implemented


		// 			break;
		// 		case 'ProofResubmitted-Pending' :
	    //     var updatRes = TicketMaster.update({"_id": ticketid},{
	    //         $set: {
	    //             'submitedDoc.createdAt' : insertData.createdAt,
	    //             'submitedDoc.documents' : insertData.submitedDoc,
	    //         }
	    //     });
		// 			if(updatRes){
		// 				TempTicketImages.remove({});
	    //     	TempTicketVideo.remove({});
		// 				TempFEUploadData.remove({'ticketId':ticketid, "type" : {$in:["image","data"]} });
	    //     }
	        
	    //   break;
		// 		case 'VerificationPass-CompanyInfo':
		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'companyDetails': insertData.companyDetails
		// 				}
		// 			});
		// 			break;

		// 		case 'ReportSubmitted':
		// 		case 'ReportGenerated':
		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				TicketMaster.update({
		// 					"_id": ticketid
		// 				}, {
		// 					$set: {
		// 						'reportGenerated.createdAt': insertData.createdAt,
		// 						'reportGenerated.documents': ticketDetails.submitedDoc.documents,
		// 						'reportGenerated.reviewRemark': ticketDetails.reviewRemark,
		// 						'reportGenerated.url': '/reportHeader/' + ticketid
		// 					}
		// 				});
		// 			}

		// 			if (ticketDetails.companyDetails) {
		// 				TicketMaster.update({
		// 					"_id": ticketid
		// 				}, {
		// 					$set: {
		// 						'reportGenerated.companyDetails': ticketDetails.companyDetails
		// 					}
		// 				});
		// 			}

		// 			var role = "quality team leader";
		// 			var roleStatus = "QAPassQTLAllocated";
		// 			var newMember = Meteor.call('autoAllocateMember', role, ticketDetails.serviceName);
		// 			var roleSentence = Meteor.call('toTitleCase', role);

		// 			if (roleSentence) {
		// 				var insertData = {
		// 					"userId": '',
		// 					"userName": '',
		// 					"role": 'system action',
		// 					"roleStatus": roleStatus,
		// 					"msg": "System Allocated Ticket To " + roleSentence,
		// 					"allocatedToUserid": newMember[0]._id,
		// 					"allocatedToUserName": newMember[0].profile.firstname + ' ' + newMember[0].profile.lastname,
		// 					"createdAt": new Date() //Update TicketElement - System Action

		// 				};
		// 				TicketMaster.update({
		// 					'_id': ticketid
		// 				}, {
		// 					$push: {
		// 						'ticketElement': insertData
		// 					}
		// 				});
		// 				Meteor.call('updateCommitteeUserCount', newMember[0].count + 1, newMember[0]._id);
		// 			}

		// 			break;

		// 		case 'TMReviewRemark':
		// 			var reviewRemark = {
		// 				'createdAt': insertData.createdAt,
		// 				'remark': insertData.reviewRemark,
		// 				'role': 'Team Member',
		// 				'userName': insertData.userName,
		// 				'userId': insertData.userId
		// 			};
		// 			TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$push: {
		// 					'reviewRemark': reviewRemark
		// 				}
		// 			});
		// 			var role = "quality team member";
		// 			var roleStatus = "VerificationPassQTMAllocated";
		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				var newMember = Meteor.call('autoAllocateMember', role, ticketDetails.serviceName);
		// 				var roleSentence = Meteor.call('toTitleCase', role);

		// 				if (roleSentence) {
		// 					var insertData = {
		// 						"userId": '',
		// 						"userName": '',
		// 						"role": 'system action',
		// 						"roleStatus": roleStatus,
		// 						"msg": "System Allocated Ticket To " + roleSentence,
		// 						"allocatedToUserid": newMember[0]._id,
		// 						"allocatedToUserName": newMember[0].profile.firstname + ' ' + newMember[0].profile.lastname,
		// 						"createdAt": new Date() //Update TicketElement - System Action

		// 					};
		// 					TicketMaster.update({
		// 						'_id': ticketid
		// 					}, {
		// 						$push: {
		// 							'ticketElement': insertData
		// 						}
		// 					});
		// 					Meteor.call('updateCommitteeUserCount', newMember[0].count - 1, newMember[0]._id);
		// 				}
		// 			}

		// 			break;

		// 		case 'QTMReviewRemark':
		// 			var reviewRemark = {
		// 				'createdAt': insertData.createdAt,
		// 				'remark': insertData.reviewRemark,
		// 				'role': 'Quality Team Member',
		// 				'userName': insertData.userName,
		// 				'userId': insertData.userId
		// 			};
		// 			TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$push: {
		// 					'reviewRemark': reviewRemark
		// 				}
		// 			});
		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'Report'
		// 				}
		// 			}); // Meteor.call('updateCommitteeUserCount',newMember[0].count-1,newMember[0]._id);

		// 			break;

		// 		case 'ReportReGenerated':
		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				TicketMaster.update({
		// 					"_id": ticketid
		// 				}, {
		// 					$set: {
		// 						'reportGenerated.createdAt': insertData.createdAt,
		// 						'reportGenerated.documents': ticketDetails.submitedDoc.documents,
		// 						'reportGenerated.reviewRemark': ticketDetails.reviewRemark,
		// 						'reportGenerated.url': '/reportHeader/' + ticketid
		// 					}
		// 				});
		// 			}

		// 			if (ticketDetails.companyDetails) {
		// 				TicketMaster.update({
		// 					"_id": ticketid
		// 				}, {
		// 					$set: {
		// 						'reportGenerated.companyDetails': ticketDetails.companyDetails
		// 					}
		// 				});
		// 			}

		// 			break;

		// 		case 'QAFail':
		// 			break;

		// 		case 'TicketClosed':
		// 			TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'TicketClosed'
		// 				}
		// 			});
		// 			var ticketDetails = TicketMaster.findOne({
		// 				"_id": ticketid
		// 			});

		// 			if (ticketDetails) {
		// 				console.log('ticketDetails.submitedDoc.status ', ticketDetails.submitedDoc.documents.status);
		// 				console.log('ticketDetails.submitedDoc.subStatus ', ticketDetails.submitedDoc.documents.subStatus);
		// 				var ticketStatus = ticketDetails.submitedDoc.documents.status + '-' + ticketDetails.submitedDoc.documents.subStatus;
		// 				Meteor.call('changeTicketStatusInOrder', ticketDetails.orderId, ticketid, ticketStatus, ticketDetails.reportGenerated.url);
		// 			}

		// 			break;

		// 		case 'QTLReviewRemark':
		// 			var reviewRemark = {
		// 				'createdAt': insertData.createdAt,
		// 				'remark': insertData.reviewRemark,
		// 				'role': 'Quality Team Leader',
		// 				'userName': insertData.userName,
		// 				'userId': insertData.userId
		// 			};
		// 			TicketMaster.update({
		// 				"_id": ticketid
		// 			}, {
		// 				$push: {
		// 					'reviewRemark': reviewRemark
		// 				}
		// 			});
		// 			break;

		// 		case 'FEAllocated':
		// 		case 'BAAllocated':
		// 			count = parseInt(countValueSplit) + 1;

		// 			if (count) {
		// 				Meteor.call('updateCommitteeUserCount', count, insertData.allocatedToUserid);
		// 			}

		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'WIP'
		// 				}
		// 			}); //notification 

		// 			break;

		// 		case 'SelfAllocated':
		// 			TicketMaster.update({
		// 				'_id': ticketid
		// 			}, {
		// 				$set: {
		// 					'ticketStatus': 'WIP'
		// 				}
		// 			}); //notification - Ticket for Address verification is initiated. Field person will be visting you soon

		// 			break;
		// 	}

		// 	return updateStatus;
		// },



	// 'updateCommitteeUserCount':function(count,id){
	// 	Meteor.users.update(
	// 		{'_id':id},
	// 		{$set:{
	// 			'count':count
	// 		}}
	// 	)
	// },


    // 'changeTicketStatusInOrder': function (orderId, ticketId, status, reportLink) {
    //   Order.update({
    //     "_id": orderId,
    //     "ticket.ticketId": ticketId
    //   }, {
    //     $set: {
    //       "ticket.$.status": status,
    //       "ticket.$.report": reportLink
    //     }
    //   });
    //   var orderDetails = Order.findOne({
    //     "_id": orderId
    //   });

    //   if (orderDetails) {
    //     var ticketDetails = TicketMaster.findOne({
    //       "_id": ticketId
    //     });

    //     if (ticketDetails) {
    //       Meteor.call('actulStatuofVerificationType', ticketDetails.userId, ticketDetails.verificationType, ticketDetails.verificationId, "Verified");
    //     }

    //     var ticketList = orderDetails.ticket;

    //     if (ticketList.length == 1) {
    //       Order.update({
    //         "_id": orderId
    //       }, {
    //         $set: {
    //           "orderStatus": status
    //         }
    //       });
    //     } else {
    //       var reportLinkStatus = ticketList.find(function (obj) {
    //         return obj.report ? true : false;
    //       });
    //       console.log('reportLinkStatus ', reportLinkStatus);
    //     }
    //   }
    // },

    // 'actulStatuofVerificationType': function (userId, verificationType, verificationId, remark) {
    //   if (verificationType == "permanentAddress") {
    //     var verificationUniqueId = "permanentAddressId";
    //   } else if (verificationType == "currentAddress") {
    //     var verificationUniqueId = "currentAddressId";
    //   } else if (verificationType == "education") {
    //     var verificationUniqueId = "educationId";
    //   } else if (verificationType == "employement") {
    //     var verificationUniqueId = "employementId";
    //   } else if (verificationType == "certificates") {
    //     var verificationUniqueId = "certificateId";
    //   } else if (verificationType == "professionalEducation") {
    //     var verificationUniqueId = "professionalEducationId";
    //   }

    //   var status = UserProfile.update({
    //     'userId': userId,
    //     [verificationType + '.' + verificationUniqueId]: parseInt(verificationId)
    //   }, {
    //     $set: {
    //       [verificationType + '.$' + '.verifiedStatus']: remark
    //     }
    //   });
    // },

    'delFEDocImage': function(id,index){
    	var updateTicket = TicketMaster.update(
        {"_id" : id},
        {$unset: 
            {
              ['submitedDoc.documents.images.'+index] : 1 ,  
            }
        }
      ); 
      // console.log("updateTicket :",updateTicket);
      if(updateTicket == 1){
      	var x=TicketMaster.update(
        {"_id" : id},
        {$pull: 
            {
              ['submitedDoc.documents.images'] : null ,
            }
        }
      ); 
      }
      return x;
    }
});