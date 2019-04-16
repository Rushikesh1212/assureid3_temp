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

class VerifyDetailsDocument extends TrackerReact(Component){
    constructor(props){
    super(props);
    this.state = {
      "subscription" : {
        "allTickets" : Meteor.subscribe("allTickets"), 
        "userfunction" : Meteor.subscribe('userfunction'),
      } 
    }
  }

  render(){
    if (!this.props.loading) {
        this.props.getTicket.verificationType
        switch(this.props.getTicket.verificationType){
            case 'employement':
            return(
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">             
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <h5 className="dataDetails"> {this.props.getTicket.verificationData.verificationType} Details</h5>                           
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Name <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9"> {this.props.getTicket.verificationData.nameOfEmployer ? this.props.getTicket.verificationData.nameOfEmployer : " - " }</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Address <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.employerAddress ? this.props.getTicket.verificationData.employerAddress :" - "}</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Contact No. <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.contactNo ? this.props.getTicket.verificationData.contactNo : " - "}</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Employee Code <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.employeeCode ? this.props.getTicket.verificationData.employeeCode : " - "}</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Deignation <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.designation ? this.props.getTicket.verificationData.designation : " - "}</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                  <span className="col-lg-3 col-sm-3"><b>Department <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.department ? this.props.getTicket.verificationData.department : " - "}.</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                   <span className="col-lg-3 col-sm-3"><b>Employment Duration <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.employmentFrom ? moment(this.props.getTicket.verificationData.employmentFrom,'DD/MM/YYYY').format("DD MMM YYYY") : "-"} - &nbsp; {this.props.getTicket.verificationData.employmentTo ? this.props.getTicket.verificationData.employmentTo == "Present" ? "Present" : moment(this.props.getTicket.verificationData.employmentTo,'DD/MM/YYYY').format("DD MMM YYYY") : "-"}</span><br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                   <span className="col-lg-3 col-sm-3"><b>Employment Type <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.typeOfEmployement ? this.props.getTicket.verificationData.typeOfEmployement : " - "}</span> <br/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                   <span className="col-lg-3 col-sm-3"><b>Responsibilities <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.dutiesAndResponsibilites ? this.props.getTicket.verificationData.dutiesAndResponsibilites : "-"}</span>
                                </div>
                            </div>                
                        </div>
                    </div>
                    )
            break;
            case 'permanentAddress':
                    return(       
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                            {     
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <h5 className="dataDetails">Permanent Address</h5>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                        {this.props.getTicket.verificationData.line1}{this.props.getTicket.verificationData.line1 ? "," : ""}<br/>
                                        {this.props.getTicket.verificationData.line2}{this.props.getTicket.verificationData.line2 ? "," : ""}<br/>
                                        {this.props.getTicket.verificationData.line3}{this.props.getTicket.verificationData.line3 ? "," : ""}<br/>
                                        {this.props.getTicket.verificationData.landmark}.{this.props.getTicket.verificationData.landmark ? "," : ""}<br/>
                                        {this.props.getTicket.verificationData.city} {this.props.getTicket.verificationData.city ? "," : ""} - {this.props.getTicket.verificationData.pincode}{this.props.getTicket.verificationData.pincode ? "," : ""} &nbsp;{this.props.getTicket.verificationData.state},&nbsp;{this.props.getTicket.verificationData.country},<br/>
                                        Residing From -&nbsp;{moment(this.props.getTicket.verificationData.residingFrom,'DD/MM/YYYY').format("DD MMM YYYY")}<br/> Residing Till-&nbsp;{this.props.getTicket.verificationData.residingTo == "Present" ? "Present" : moment(this.props.getTicket.verificationData.residingTo,'DD/MM/YYYY').format("DD MMM YYYY")}
                                        </div>
                                    </div>       
                                </div>
                            }
                        </div>       
                );
                break;
            case 'currentAddress':
                        return(
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                                     
                                {
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                                        <h5 className="dataDetails"> Current Address</h5>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                                {this.props.getTicket.verificationData.tempLine1},<br/>
                                                {this.props.getTicket.verificationData.tempLine2},<br/>
                                                {this.props.getTicket.verificationData.tempLine3},<br/>
                                                {this.props.getTicket.verificationData.tempLandmark}.<br/>
                                                {this.props.getTicket.verificationData.tempCity}-&nbsp; {this.props.getTicket.verificationData.tempPincode},&nbsp;{this.props.getTicket.verificationData.tempState},{this.props.getTicket.verificationData.tempCountry},<br/>
                                            Residing From - &nbsp;{moment(this.props.getTicket.verificationData.tempresidingFrom,'DD/MM/YYYY').format("DD MMM YYYY")} <br/>Residing Till - {this.props.getTicket.verificationData.tempresidingTo == "Present" ? "Present" : moment(this.props.getTicket.verificationData.tempresidingTo,'DD/MM/YYYY').format("DD MMM YYYY") }
                                            </div>
                                        </div>                
                                    </div>
                                }
                            </div>  
                        );

                break;

            case 'education':
                    return(
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                            { 
                                
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <h5 className="dataDetails">{this.props.getTicket.verificationData.verificationType}</h5>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                          <span className="col-lg-3 col-sm-3"><b>Education Level <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.educationLevel ? this.props.getTicket.verificationData.educationLevel : " - "}</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                          <span className="col-lg-3 col-sm-3"><b>Qualification  <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.educationQualification ? this.props.getTicket.verificationData.educationQualification : " - "}</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>Specialization   <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.specialization ? this.props.getTicket.verificationData.specialization : " - "}</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>Grade  <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.grades ? this.props.getTicket.verificationData.grades : " - "}</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>Mode Of Education <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.educationMode ? this.props.getTicket.verificationData.educationMode : " - "},</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>Attended Duration<span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.dateAttendedFrom}-&nbsp;{this.props.getTicket.verificationData.dateAttendedTo},</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>College Name <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.collegeName}{this.props.getTicket.verificationData.collegeName || this.props.getTicket.verificationData.university ? "," : " "}{this.props.getTicket.verificationData.university}</span><br/>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                           <span className="col-lg-3 col-sm-3"><b>College Address <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.collegeAddress ? this.props.getTicket.verificationData.collegeAddress: " - "} </span>
                                        </div>
                                    </div>       
                                </div>
                            }
                        </div>
                    );
                break;
            case 'certificates':
                return(
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                        { 
                            
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h5 className="dataDetails">{this.props.getTicket.verificationData.verificationType}</h5>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    Certificate Name - &nbsp;{this.props.getTicket.verificationData.certificateName ? this.props.getTicket.verificationData.certificateName : "-"}<br/>
                                    Issued Date - &nbsp;{this.props.getTicket.verificationData.issuedBy ? this.props.getTicket.verificationData.issuedBy :"-"}<br/>
                                    Certificated Date - &nbsp;{this.props.getTicket.verificationData.certificatedOn ? this.props.getTicket.verificationData.certificatedOn: "-"}<br/>
                                    Valid Till - &nbsp;{this.props.getTicket.verificationData.validTill ? this.props.getTicket.verificationData.validTill :"-"}<br/>
                                    
                                    </div>
                                </div>       
                            </div>
                        }
                    </div>
                );
                break;
            case 'professionalEducation':
                        return(
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                                { 
                                    
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <h5 className="dataDetails">{this.props.getTicket.verificationData.verificationType}</h5>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                            Qualification - &nbsp;{this.props.getTicket.verificationData.professionalQualification ? this.props.getTicket.verificationData.professionalQualification :"-"}
                                            Registration No. - &nbsp;{this.props.getTicket.verificationData.registrationNo ? this.props.getTicket.verificationData.registrationNo:"-"}
                                            Qualification Date- &nbsp; {this.props.getTicket.verificationData.dateOfQualification ? this.props.getTicket.verificationData.dateOfQualification : "-"}
                                            {/* {this.props.getTicket.verificationData.professionalRollNo} */}
                                            Committee Name- &nbsp;{this.props.getTicket.verificationData.qualifyingBodyNm ? this.props.getTicket.verificationData.qualifyingBodyNm : "-"}
                                            </div>
                                        </div>       
                                    </div>
                                }
                            </div>
                        );
                break;
            case 'Identity':
                    return(
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp"> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h5 className="dataDetails">{this.props.getTicket.verificationData.verificationType} - {this.props.getTicket.verificationData.identityType}</h5>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                        Card No. - &nbsp;{this.props.getTicket.verificationData.cardNo ? this.props.getTicket.verificationData.cardNo :"-"}
                                    </div>
                                    
                                </div>       
                            </div>
                        </div>
                    );
            break;

            case 'reference':
                return(
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                        {                            
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h5 className="dataDetails">{this.props.getTicket.verificationData.verificationType}</h5>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Name <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralFirstName ? this.props.getTicket.verificationData.referralFirstName : " - "} {this.props.getTicket.verificationData.referralLastName ? this.props.getTicket.verificationData.referralLastName : " - "}</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Mobile  <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralMobileNum ? this.props.getTicket.verificationData.referralMobileNum : " - "}</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Email   <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralEmailID ? this.props.getTicket.verificationData.referralEmailID : " - "}</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Organization  <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralOrganization ? this.props.getTicket.verificationData.referralOrganization : " - "}</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Designation <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralDesignation ? this.props.getTicket.verificationData.referralDesignation : " - "},</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Relation<span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralRelationship ? this.props.getTicket.verificationData.referralRelationship : " - "},</span><br/>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad addressdetails">
                                    <span className="col-lg-3 col-sm-3"><b>Associated Since <span className="pull-right">:</span></b></span><span className="col-lg-9 col-md-9">{this.props.getTicket.verificationData.referralAssociatedSinceMonths ? this.props.getTicket.verificationData.referralAssociatedSinceMonths: "-" }</span><br/>
                                    </div>                                    
                                </div>       
                            </div>
                        }
                    </div>
                );
            break;
            default:
                return(
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singledocwrp">                    
                        <h4>Oops Something Went Wrong</h4>
                    </div>
                );
        }
    
   }else{
    return(
       <span>Loading</span>
      ); 
   }
   
  }
}
verifyDetailsDocumentsContainer = withTracker(props => {  
    var _id = props.ticketId;
    const postHandle = Meteor.subscribe('singleTicket',_id);
    const getTicket  = TicketMaster.findOne({"_id" : _id}) || {}; 
    const loading = !postHandle.ready();

    // if(_id){
      return {
          loading  : loading,
          getTicket : getTicket,
        //   firstTicketElen : firstTicketElen,
      };
})(VerifyDetailsDocument);
export default verifyDetailsDocumentsContainer;