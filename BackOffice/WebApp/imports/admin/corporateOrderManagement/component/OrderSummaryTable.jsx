import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
class OrderSummaryTable extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={  
      "subscription" : { 
      } 
    }; 
  }
  render(){
    // console.log("order",this.props.order);
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
          <div className={"col-lg-12 col-md-12 col-sm-12 col-xs-12 orderStatusWrapper text-center "+this.props.backgroundColor}>
            <span>{this.props.order.orderStatus}</span>
          </div>
	        <table className="table table-bordered generationTable">
            <thead>
               <tr>
                <th rowSpan="2" className="text-center">Verification Component</th>
                <th rowSpan="2" className="text-center">Verification Obtained From</th>
                <th rowSpan="2" className="text-center">Clear</th>
                <th colSpan="2" className="text-center">Discrepancy</th>
                <th rowSpan="2" className="text-center">Inaccessible for verification</th>
                <th rowSpan="2" className="text-center">Unable to Verify</th>
              </tr>
              <tr>
                <th>Minor</th>
                <th>Major</th>              
              </tr>
 
            </thead>
            <tbody>
              {
                this.props.orderSummaryTable ?
                  this.props.orderSummaryTable.length > 0 ?
                    this.props.orderSummaryTable.map((orderSummaryTable,index)=>{
                      return(
                        <tr key={index}>
                          <td>{orderSummaryTable.verificationComponenet}</td>
                          <td>{orderSummaryTable.VerificationObtainedFrom} </td>
                          {orderSummaryTable.clear ?
                            <td><i className={orderSummaryTable.clear+" fa-lg text-success"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.minor ?
                            <td><i className={orderSummaryTable.minor+" fa-lg text-success"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.major ?
                            <td><i className={orderSummaryTable.major+" fa-lg text-success"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.inaccessible ?
                            <td><i className={orderSummaryTable.inaccessible+" fa-lg text-success"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.unableVerify ?
                            <td><i className={orderSummaryTable.unableVerify+" fa-lg text-success"}></i></td>
                            :
                            <td></td>
                          }
                                                          
                        </tr>
                  
                        );
                    })
                   
                  :
                  null
                :
                null
              }              
            </tbody>
          </table>
        </div>
      </div>
    );
   
  }
}
export default OrderSummaryTableContainer = withTracker(props => {
  //Get Order from the props
  var order = props.order;
  var data = [] ;
  var orderSummaryTable= [];
  // var tempdata = {
  // "verificationComponenet"          : 
  // "VerificationObtainedFrom"        :
  // "colSpanValue"                    : 
  // "clear"                           :
  // "minor"                           :
  // "major"                           :
  // "inaccessible"                    :
  // "unableVerify"                    :
  // }

  var serviceData = [];
  if (order) {
    if(order.packageDetails){
      for(s = 0 ; s < order.packageDetails.servicesIncluded.length; s++){
        serviceData.push({
          "serviceName" : order.packageDetails.servicesIncluded[s].serviceName,
          "serviceRequired" : order.packageDetails.servicesIncluded[s].serviceRequired,
        });
      }
    }else{
      serviceData.push({
        "serviceName" : order.serviceDetails.serviceName,
        "serviceRequired" : order.serviceDetails.serviceRequired,
      });
    }
    // console.log("serviceData",serviceData);
    
    if (order.candidateDetails) {
     var verificationData = order.candidateDetails.map((q)=> { if(q.candidateId == props.candidateId){return q.verificationData;}});
     console.log("verificationData",verificationData);
     
     var dataArray = verificationData.map((verifData,index)=>{
      if(verifData){
        return verifData;
      }
     });
     console.log("dataArray :",dataArray)
     if(verificationData){
      for(i = 0 ; i < dataArray.length; i++){
        var tempdata = {
          "verificationComponenet"          :  '',
          "VerificationObtainedFrom"        :  '',
          "colSpanValue"                    :  '1',
          "clear"                           :  '',
          "minor"                           :  '',
          "major"                           :  '',
          "inaccessible"                    :  '',
          "unableVerify"                    :  '',
          }
        var serviceName = serviceData.find(function (obj) { return obj.serviceRequired == verificationData[1][i].serviceRequired });
        if(serviceName){
          // console.log('serviceName ',serviceName);
          tempData ={
            "verificationComponenet" : serviceName.serviceName,
          }
          if(serviceName.serviceRequired == 'EducationForm'){
            tempData.VerificationObtainedFrom = verificationData[0][i].collegeName;           
          }else if(serviceName.serviceRequired == 'AddressForm'){
            if(verificationData[0][i].verificationType == 'permanentAddress'){
              tempData.VerificationObtainedFrom = 'Permanent Address';           
            }else{
              tempData.VerificationObtainedFrom = 'Current Address';           
            }
          }else if(serviceName.serviceRequired == 'WorkForm') {
            tempData.VerificationObtainedFrom = verificationData[0][i].nameOfEmployer;           
          }else if(serviceName.serviceRequired == 'SkillsCertificate') {
            tempData.VerificationObtainedFrom = verificationData[0][i].certificateName;           
          }else if(serviceName.serviceRequired == 'StatutoryForm') {
            tempData.VerificationObtainedFrom = verificationData[0][i].identityType;           
          }

          if(verificationData[0][i].ticketDetails.status == 'Major Discrepancy'){
            tempData.major = 'fa fa-check-circle';
          }else if(verificationData[0][i].ticketDetails.status == 'Minor Discrepancy'){
            tempData.minor = 'fa fa-check-circle';
          }else if(verificationData[0][i].ticketDetails.status == 'Clear'){
            tempData.clear = 'fa fa-check-circle';
          }else if(verificationData[0][i].ticketDetails.status == 'Inaccessible'){
            tempData.inaccessible = 'fa fa-check-circle';
          }else if(verificationData[0][i].ticketDetails.status == 'Unable to Verify'){
            tempData.unableVerify = 'fa fa-check-circle';
          }
        }
        // console.log("tempData",tempData);

        orderSummaryTable.push(tempData);
        // console.log("orderSummaryTable",orderSummaryTable);
      }

      
     }
    }
  }
  return{
     order,
     orderSummaryTable,
  };
})(OrderSummaryTable);