import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/AssureID/company/newRequest/api/TicketMaster.js';
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
                            <td className="rightTick text-center"><i className={orderSummaryTable.clear+" fa-lg"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.minor ?
                            <td className="rightTick text-center"><i className={orderSummaryTable.minor+" fa-lg"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.major ?
                            <td className="rightTick text-center"><i className={orderSummaryTable.major+" fa-lg"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.inaccessible ?
                            <td className="rightTick text-center"><i className={orderSummaryTable.inaccessible+" fa-lg"}></i></td>
                            :
                            <td></td>
                          }
                          {orderSummaryTable.unableVerify ?
                            <td className="rightTick text-center"><i className={orderSummaryTable.unableVerify+" fa-lg"}></i></td>
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
    if (order.candidateDetails) {
     var candidate = order.candidateDetails.find((q)=> { return q.candidateId == props.candidateId});
     if (candidate) {
      var verificationData = candidate.verificationData;
      if (verificationData) { 
         var dataArray=[];
         dataArray = verificationData.map((verifData,index)=>{
          if(verifData){
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
                var serviceName = serviceData.find(function (obj) { return obj.serviceRequired == verifData.serviceRequired });
                if(serviceName){
                  // console.log('serviceName ',serviceName);
                  tempData ={
                    "verificationComponenet" : serviceName.serviceName,
                  }
                  if(serviceName.serviceRequired == 'EducationForm'){
                    tempData.VerificationObtainedFrom = verifData.collegeName;           
                  }else if(serviceName.serviceRequired == 'AddressForm' || serviceName.serviceRequired == "CriminalRecords"){
                    if(verifData.verificationType == 'permanentAddress'){
                      tempData.VerificationObtainedFrom = 'Permanent Address';           
                    }else{
                      tempData.VerificationObtainedFrom = 'Current Address';           
                    }
                  }else if(serviceName.serviceRequired == 'WorkForm') {
                    tempData.VerificationObtainedFrom = verifData.nameOfEmployer;           
                  }else if(serviceName.serviceRequired == 'SkillsCertificate') {
                    tempData.VerificationObtainedFrom = verifData.certificateName;           
                  }else if(serviceName.serviceRequired == 'StatutoryForm') {
                    tempData.VerificationObtainedFrom = verifData.identityType;           
                  }else if (serviceName.serviceRequired == 'ReferenceForm') {
                    tempData.VerificationObtainedFrom = verifData.referralFirstName+' '+verifData.referralLastName;           
                  } 

                  if(verifData.ticketDetails.status == 'Major Discrepancy'){
                    tempData.major = 'fa fa-check';
                  }else if(verifData.ticketDetails.status == 'Minor Discrepancy'){
                    tempData.minor = 'fa fa-check';
                  }else if(verifData.ticketDetails.status == 'Clear'){
                    tempData.clear = 'fa fa-check';
                  }else if(verifData.ticketDetails.status == 'Inaccessible'){
                    tempData.inaccessible = 'fa fa-check';
                  }else if(verifData.ticketDetails.status == 'Unable to Verify'){
                    tempData.unableVerify = 'fa fa-check';
                  }
                }
                // console.log("tempData",tempData);
                orderSummaryTable.push(tempData);
              
            // }
          }
        }); 
      }
       
     }
     
    }
    // console.log("orderSummaryTable",orderSummaryTable);
  }
  return{
     order,
     orderSummaryTable,
  };
})(OrderSummaryTable);