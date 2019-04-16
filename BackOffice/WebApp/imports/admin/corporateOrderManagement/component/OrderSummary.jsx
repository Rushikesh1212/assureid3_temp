import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';



class OrderSummary extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  render(){
    if (!this.props.loading) {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
          {/* <h3>EXECUTIVE SUMMARY</h3> */}
          <table className="table table-bordered generationTable">
            <thead>
              <tr>
                <th colSpan='3' >{this.props.getTicket ? this.props.getTicket.service : " - "}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col-lg-8">
                    {
                      this.props.getTicket && this.props.getTicket.verificationType =="permanentAddress" ?
                          <div>
                            <span>Premanent Address</span>, &nbsp;
                            <span>{this.props.getTicket.verificationData.line1}</span>
                            <span>{this.props.getTicket.verificationData.line2}</span>
                            <span>{this.props.getTicket.verificationData.line3}</span><br/>
                            <span>{this.props.getTicket.verificationData.landmark}</span><br/>
                            <span>{this.props.getTicket.verificationData.city}</span>, &nbsp;
                            <span>{this.props.getTicket.verificationData.state}</span>, &nbsp;
                            <span>{this.props.getTicket.verificationData.country}</span>, &nbsp;
                            <span>{this.props.getTicket.verificationData.pincode}</span>, &nbsp;
                          
                          </div>
                      :
                      this.props.getTicket && this.props.getTicket.verificationType == "currentAddress" ?
                      
                          <div>
                              <span>Current Address</span>                        
                              <span>{this.props.getTicket.verificationData.tempLine1}</span>
                              <span>{this.props.getTicket.verificationData.tempLine2}</span>
                              <span>{this.props.getTicket.verificationData.tempLine3}</span><br/>
                              <span>{this.props.getTicket.verificationData.tempLandmark}</span><br/>
                              <span>{this.props.getTicket.verificationData.tempCity}</span>, &nbsp;
                              <span>{this.props.getTicket.verificationData.tempState}</span>, &nbsp;
                              <span>{this.props.getTicket.verificationData.tempCountry}</span>, &nbsp;
                              <span>{this.props.getTicket.verificationData.tempPincode}</span>, &nbsp;
                      
                          </div>
                      :
                      this.props.getTicket && this.props.getTicket.verificationType == "employement" ?
                          <div>
                              <span>{this.props.getTicket.verificationData.nameOfEmployer}</span>
                              <span>{this.props.getTicket.verificationData.employerCity}</span>
                          </div>
                      :
                      this.props.getTicket && this.props.getTicket.verificationType == "education" ?
                          <div>
                              <span>{this.props.getTicket.verificationData.collegeName}</span>
                          </div>
                      :
                      this.props.getTicket && this.props.getTicket.verificationType == "Identity" ?
                         <div>
                           <span><b>{this.props.getTicket.verificationData.identityType} :</b> {this.props.getTicket.verificationData.cardNo}</span>
                         </div>
                      :

                      null
                    }
                </td>
                <td className="col-lg-2">Verified</td>
                <td className="col-lg-2">{this.props.getTicket ? this.props.finalStatus: "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
   }else{
    return(
       <span>Loading</span>
      );
   }
  }
}export default OrderSummaryContainer = withTracker(props => {
  //Get id from the props
  var ticketId = props.ticketId;
  // console.log("ticketId",ticketId);
  var handleSinTick = Meteor.subscribe("singleTicket",ticketId);
  // var handleSinTick = Meteor.subscribe("allTickets");
  var loading = !handleSinTick.ready();
  
  if(ticketId){
     var getTicket = TicketMaster.findOne({"_id":ticketId});
     if(getTicket){
        if(getTicket.reportGenerated){
          var statusName  =  getTicket.reportGenerated.documents.status;
          if(statusName){
            var splitName   =  statusName.split('-');
            var finalStatus =  splitName[1]; 
            var verificationType = getTicket.verificationType;
            if (verificationType == "professionalEducation") {
              var checkListFrom = "Academic Verification";
            }else if (verificationType == "permanentAddress") {
              var checkListFrom = "Address Verification";
            }else if (verificationType == "currentAddress") {
              var checkListFrom = "Address Verification";
            }else if (verificationType == "employement") {
              var checkListFrom = "Employment Verification";
            }else if (verificationType == "education") {
              var checkListFrom = "Academic Verification";
            }else  if (verificationType == "certificates") {
              var checkListFrom = "Skills And Certification Verification";
            }else if (verificationType == "Identity") {
              var checkListFrom = "Identity Verification";
            }
            // getTicket.verificationType = checkListFrom;
            getTicket.service = checkListFrom;
          }
        }
     }
    }
  return{
    loading,
    getTicket,
    finalStatus
    }
})(OrderSummary);