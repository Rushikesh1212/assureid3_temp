import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const CompanyProfile = new Mongo.Collection("companyProfile");
export const TempCompanyImages = new Mongo.Collection("tempCompanyImages");
export const RequestPool       = new Mongo.Collection("requestPool");


if(Meteor.isServer){ 
  // Meteor.publish('companyOrderData',()=>{
  //  return CompanyOrder.find({}); 
  // });  
  Meteor.publish('tempCompanyOrderDetails',()=>{
    return TempCompanyOrder.find({});
  });
  Meteor.publish('requestPoolData',()=>{
    return RequestPool.find({});
  });
  Meteor.publish('requestPoolDataCount',(assureId)=>{
    // Counts.publish(this,"requestPoolDataCount",RequestPool.find({"assureId" : assureId}), {fastCount: true, noReady: true});
    return RequestPool.find({"assureId" : assureId});
  });
  Meteor.publish('matchedServiceRequestPoolData',(assureId,serviceId)=>{
    return RequestPool.find({"assureId" : assureId,"serviceId" : serviceId,"orderPlacedBy" : "User"},{sort:{"createdAt": -1}});
  });
  Meteor.publish('matchedServiceRequestPoolForCompany',(assureId,serviceId)=>{
    return RequestPool.find({"assureId" : assureId,"serviceId" : serviceId,"orderPlacedBy" : "Company"},{sort:{"createdAt": -1}});
  });
  Meteor.publish('matchedPackageRequestPoolData',(assureId,packageId)=>{
    return RequestPool.find({"assureId" : assureId,"packageId" : packageId,"orderPlacedBy" : "User"},{sort:{"createdAt": -1}});
  });
  Meteor.publish('matchedPackageRequestPoolForCompany',(assureId,packageId)=>{
    return RequestPool.find({"assureId" : assureId,"packageId" : packageId,"orderPlacedBy" : "Company"},{sort:{"createdAt": -1}});
  });
  Meteor.publish('requestPoolCount',function(assureId){
    Counts.publish(this,"requestPoolCount",RequestPool.find({"assureId" : assureId}), {fastCount: true, noReady: true});
  });
  Meteor.methods({
    "requestPoolDataCount":function(assureId){
      var count = RequestPool.find({"assureId" : assureId}).count();
       if (count > 0) {
         return true;
       }else{
         return false;
       }
    },

  });
}