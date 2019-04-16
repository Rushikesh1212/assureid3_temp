import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {Order} from '/imports/admin/orderManagement/api/Order.js';
import {TicketMaster} from '/imports/admin/caseManagement/api/TicketMaster.js';


export const CorporateOrders       = new Mongo.Collection("corporateOrders");
export const TempCompanyDocuments  = new Mongo.Collection("tempCompanyDocuments");

if(Meteor.isServer){
    Meteor.publish('allocatedCorporateOrders',(userid)=>{
	   	return CorporateOrders.find({"allocatedToUserid": userid});
    });
	Meteor.publish('singleCorporateOrder',(id)=>{
		return CorporateOrders.find({"_id": id});
	});

	Meteor.publish('allCorporateOrder',()=>{ 
		return CorporateOrders.find({});
	});
  Meteor.publish('allcorporateOrdersOfcompany',(informationFilledBy)=>{
   	return CorporateOrders.find({"informationFilledBy": informationFilledBy});
  });
  

	Meteor.methods({
		updateDEOStatus:function(corporateId){
			var updateDEOStatus = CorporateOrders.update({'_id':corporateId},
			{
				$set:{
					'DEOStatus': "Completed"
				}
  
			})
			return updateDEOStatus;	
		},
		
		updateDEOReopenStatus:function(corporateId){
			var updateDEOStatus = CorporateOrders.update({'_id':corporateId},
			{
				$set:{
					'DEOStatus': "Work In Progress"
				}

			})
			return updateDEOStatus;	
		},
 
		updateStatusInCorporateOrderDetails:function(orderId,ticketid){
			console.log("orderId,ticketid :",orderId,ticketid);
			var orderDetails = Order.findOne({"_id":orderId});
			if(orderDetails){
				var corporateNo = orderDetails.corporateOrderNo;
				var updateCorporate = CorporateOrders.update(
					{'corporateOrderNo' : corporateNo,'orderDetails.orderNo':orderDetails.orderNo},
					{
						$push:{
							'orderDetails.$.rejectedTickets':{
								'ticketId':ticketid
							}
						},
						$set:{
							'orderDetails.$.status': "Case Reopened",
							'DEOStatus'            : "Case Reopened",       
						}

					},
				);
				// console.log("updateCorporate :",updateCorporate);
				/**Update verification status verificationDataStatus in order table */
				var ticketDetails = TicketMaster.findOne({"_id":ticketid});
				
				if(ticketDetails){
					var verificationType = ticketDetails.verificationType;
					var verificationId   = ticketDetails.verificationId;
					var candidateId      = ticketDetails.userId;

					/**find matched candidate index in orders candidate details */
					/**find matched candidate verificationdata index in orders candidate details */
					var matchCandidateIndex = orderDetails.candidateDetails.findIndex(x=> x.candidateId == candidateId);
					var verificationIndex   = orderDetails.candidateDetails[matchCandidateIndex].verificationData.findIndex(x=> x.verificationType == verificationType, x=>x.verificationId);

					Order.update(
						{'_id':ticketDetails.orderId},
						{$set:{							
							['candidateDetails.'+matchCandidateIndex+'.verificationData.'+verificationIndex+'.verificationDataStatus']: "Case Reopen",
						}}
					)
				}
			} 
		},
  	'updateorderDetails':function(corporateOrderId,candidateLen,NumberOfVerifications,orderId,serviceid) {
			/**Add orderDetails in corporate order collection */
      var singlecorporateOrder = CorporateOrders.findOne({"_id" : corporateOrderId});
      if (singlecorporateOrder) {
      	var serviceIndex = singlecorporateOrder.packageDetails.servicesIncluded.findIndex(obj=> obj.serviceId == serviceid)
       var updateServiceActualCheck = CorporateOrders.update({"_id":corporateOrderId},{
      	 $inc:{
          	['packageDetails.servicesIncluded.'+serviceIndex+'.actualServiceCheck'] : parseInt(NumberOfVerifications),
          },
        });
        if (updateServiceActualCheck) { 
        	var afterUpdateCorporateOrder = CorporateOrders.findOne({"_id" : corporateOrderId});
        	if (afterUpdateCorporateOrder) {
        		var actualChecks = 0;
	        	afterUpdateCorporateOrder.packageDetails.servicesIncluded.map((obj)=>{
	        		 actualChecks += obj.actualServiceCheck;
	        		 // return actualChecks;
	        	});
	        	 var updateCorporate = CorporateOrders.update(
				        {"_id":corporateOrderId, 'orderDetails.orderId' : orderId},
				        {
				          $inc:{
				          	['orderDetails.$.numberOfCandidate'] : parseInt(candidateLen),
				            ['orderDetails.$.numberOfVerifications'] : NumberOfVerifications,
				          },
				          $set:{
				            'corporateOrderStatus'  : "Order InProcess",
				            'DEOStatus'             : "In Process",
				            ['orderDetails.$.status'] : "Open",
				            ['orderDetails.$.rejectedTickets'] : [],
				            'actualChecks'           : actualChecks,
				          }
				        }
				     );
        	}
        }
      } 
	},
		'updateStatusInCorporateOrder':function(corporateOrderId){
			var corporateorder = CorporateOrders.findOne({"_id" : corporateOrderId});
			if (corporateorder){
				var count = 0;
				var orderDetailsCount = corporateorder.orderDetails.length;
				if (orderDetailsCount > 0) {
					corporateorder.orderDetails.map((obj)=>{
						var order =  Order.findOne({"_id" : obj.orderId});
						if (order) {
							if (order.orderStatus == "Completed") {
								count++;
							}
						}
					});
					if (orderDetailsCount == count) {
						var updatecorporateOrderStatus = CorporateOrders.update({"_id" : corporateOrderId},{
							$set:{
								'corporateOrderStatus' : "Completed",
							}
						});
						if (updatecorporateOrderStatus) {
	         		var updatedcorporateorder = CorporateOrders.findOne({"_id" : corporateOrderId});
	         		if (updatedcorporateorder) {
	         			if (updatedcorporateorder.corporateOrderStatus == "Completed") {
	         				var companyId  = updatedcorporateorder.companyDetails.companyId;
	         				var contractId = updatedcorporateorder.companyDetails.contractId;
	         				var corporateCompleteOrderCount = 1;

	         				Meteor.call('updateContractAfterCorporateComplete',companyId,contractId,corporateCompleteOrderCount,orderDetailsCount);
	         			}
	         		}
						}
					}
				}
			}
		},
  });
} 