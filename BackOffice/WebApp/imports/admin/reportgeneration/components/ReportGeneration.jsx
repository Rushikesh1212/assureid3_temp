import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

class ReportGeneration extends TrackerReact(Component){
  constructor(props){
    super(props);
  }
   render(){
      return(              
        <div>
          <section className="contentForReport">
            <div className="reportgenerationwrap">
              <div className="outerWrap">
               <label className="col-lg-12 reporttableHead">{this.props.getTicket ? this.props.getTicket.verificationType : 'Comming Soon'}</label>
               {
                 this.props.getTicket && this.props.getTicket.reportGenerated && this.props.getTicket.reportGenerated.companyDetails ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                      <table className="table table-bordered reportGenTable">
                        <tbody>
                          <tr style={{backgroundColor: '#'+'b9bed2'}}>
                            <td colSpan="9">Research Findings</td>
                          </tr>
                          <tr>
                            <td colSpan="1">Employer</td>
                            <td colSpan="8">{this.props.getTicket.verificationData.nameOfEmployer}</td>
                          </tr>
                          <tr>
                            <td colSpan="1">Type of Ownership </td>
                            <td colSpan="1">{this.props.getTicket.companyDetails.typeOfOwnersip}</td>
                            <td colSpan="2">Site Visit</td>
                            <td colSpan="2">{this.props.getTicket.companyDetails.siteVisit}</td>
                          </tr>
                          <tr>
                            <td colSpan="1">CIN NO. </td>
                            <td colSpan="1">{this.props.getTicket.companyDetails.cinNo}</td>
                            <td colSpan="2">Current Status</td>
                            <td colSpan="2">{this.props.getTicket.companyDetails.currentStatus}</td>
                          </tr>
                          <tr>
                            <td colSpan="1">Registration In.</td>
                            <td colSpan="1">{this.props.getTicket.companyDetails.registeringIn}</td>
                            <td colSpan="2">Past Aberrations</td>
                            <td colSpan="2">{this.props.getTicket.companyDetails.pastAberrations}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                :
                null
               } 
                <table className="table table-bordered reportGenTable">
                  <tbody>
                    <tr style={{backgroundColor: '#'+'b9bed2'}}>
                      <td className="col-lg-3 execBottomTitle" >Parameter</td>
                      <td className="col-lg-4 execBottomTitle" >Information Provided</td>
                      <td className="col-lg-4 execBottomTitle" >Information Verified</td>
                    </tr>
                      {
                        this.props.getTicket ?
                         this.props.getTicket.reportGenerated ?
                          this.props.getTicket.reportGenerated.documents.checkLists.map((data,i)=>{
                            return(
                              <tr key={i}>
                              <td className="col-lg-3">{data.titleVal}</td>
                              <td className="col-lg-4">
                              {
                                data.textVal.map((checkObjsRelatedField,index)=>{
                                  return(
                                      <span key={index}>{checkObjsRelatedField.value},&nbsp;</span>
                                  );
                                })
                              }
                              </td>
                              <td className="col-lg-4" >
                               <i className={data.correctVal == "Correct" ? "fa fa-check-circle fa-lg text-success" : "fa fa-times-circle fa-lg text-danger" }></i>
                               <br />{data.remarkVal ? data.remarkVal : '' }
                              </td>
                              </tr>
                            )
                             
                          })
                          :
                          null
                        :
                        null
                      }
                      {this.props.getTicket ?
                        this.props.getTicket.reportGenerated ? 
                          this.props.getTicket.reportGenerated.documents.textLists ?
                             this.props.getTicket.reportGenerated.documents.textLists.map((data,i)=>{
                               return(
                                  <tr key={i}>
                                    <td>{data.task}</td>
                                    <td className="text-left" colSpan="3">{data.value ? data.value : "-"}</td>
                                  </tr>
                                );
                             })
                           :
                           null
                          :
                          null
                        :
                        null
                      }
                    <tr>
                      <td>Remarks</td>
                      <td className="text-left" colSpan="3"> 
                         {
                            this.props.getTicket ?
                            // this.props.getTicket.reportGenerated.reviewRemark.map((reviewData,i)=>{
                            //   return(
                            //         reviewData.remark != ''?
                            //           <p key={i}>{reviewData.remark}</p>
                            //         :
                            //         ""
                            //   )
                            // })
                            // :
                            // null
                            this.props.getTicket.submitedDoc ?
                              this.props.getTicket.submitedDoc.reportRemark ?
                                this.props.getTicket.submitedDoc.reportRemark != ''?
                                    <p>{this.props.getTicket.submitedDoc.reportRemark}</p>
                                  :
                                  ""
                                :
                                null
                              :
                              null
                            :
                            null
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
               {this.props.getTicket ?
                  this.props.getTicket.reportGenerated ?
                    this.props.getTicket.reportGenerated.documents.images ?
                      this.props.getTicket.reportGenerated.documents.images.length > 0 ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                           <span><b> Proofs collected :</b></span><br /><br />
                              {this.props.getTicket.reportGenerated.documents.images.map((data,i)=>{
                                return(
                                    <div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 outerReportImage" key={i}>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <img src={data.imageLink} className="img img-responsive reportThumbnail" />
                                        <span>{moment(data.createdAt).format('DD-MMM-YYYY')}</span>
                                      </div> 
                                    </div>
                                  );
                              })
                            }
                        </div>
                        :
                        null
                      :
                      null
                    :
                    null
                  :
                  null
               }
               {this.props.getTicket ?
                 this.props.getTicket.reportGenerated ? 
                  this.props.getTicket.reportGenerated.documents.images ?
                    this.props.getTicket.reportGenerated.documents.images.length > 0 ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                         <span><b> Annexure :</b></span><br /><br />
                        
                            { this.props.getTicket.reportGenerated.documents.images.map((data,i)=>{
                                return(
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerReportImage" key={i}>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <p><b>{this.props.getTicket.verificationType} Evedence {i+1} :</b></p>
                                        <img src={data.imageLink} className="img img-responsive imagesOnReport" />
                                      </div> 
                                    </div>
                                  );
                              })
                             }
                      </div>
                       :
                    null
                    :
                    null
                  :
                  null
                :
                null
               }
            </div>
          </section>
        {/* </div> */}
        </div>    
      );
    }
}
export default ReportGenerationContainer = withTracker(props => {
  //Get id from the props
  var idValue = props.ticketId;
  if(!idValue){
    //Get the ticket id from the url
    var currentLocation = browserHistory.getCurrentLocation();
    if(currentLocation){
      var splitUrl = currentLocation.pathname.split('/');
      var url = splitUrl[2]; 
      idValue= url;
    }
  }
  var handleSinTick = Meteor.subscribe("singleTicket",idValue);
  var loading = !handleSinTick.ready();
  var getTicket = TicketMaster.findOne({"_id":idValue});
  if(getTicket){
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
    }else if (verificationType == "reference") {
      var checkListFrom = "Reference Verification";
    }
    getTicket.verificationType = checkListFrom;
  }
return{
  getTicket
}
})(ReportGeneration);
