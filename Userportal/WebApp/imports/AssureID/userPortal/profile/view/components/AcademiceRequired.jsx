import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import ProfessionalEduForm from '/imports/AssureID/userPortal/profile/forms/components/ProfessionalEduForm.jsx';
import EducationForm from '/imports/AssureID/userPortal/profile/forms/components/EducationForm.jsx';

export default class AcademiceRequired extends TrackerReact(Component) {
  constructor(props){
  super(props);
    this.state ={
      "subscription" : {
      }
    }
  }
  editAcademics(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  editProfessionalAcademics(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  deleteAcademics(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeBasicEducation",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{ 
        $('#delAcadamicInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();        
      }
    });
  }
  handleChageEducation(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.academicsData[index].value = value;

     this.setState({
      [name]: value, 
     });
  }
  handleChangeProfessionalEducation(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.professionalData[index].value = value;

     this.setState({
      [name]: value, 
     });
  }
  deleteProfessionalAcadamic(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeProfessionalEducation",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{ 
        $('#delProfessionalAcadamicInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();        
      }
    });
  }

  render() {
    // console.log("academics",this.props.academicsData);
    return (
     <div>
       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-graduation-cap col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i>
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-9 viewTitle">Academics Information</span>
          { FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
            Meteor.userId() == this.props.currentId ?
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Academics Details" data-target="#acadamicinfo"></i>
            </div>
            :
            ""
            :
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Academics Details" data-target="#acadamicinfo"></i>
            </div> 
          } 
        </div>
      <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12" >   
       {this.props.academicsData ?
         this.props.academicsData.length > 0 ?
          this.props.academicsData.map((academicsDetails, index)=>{
            return(
              academicsDetails == null ?
              <div key={index}>
              </div>
              :
              <div className={academicsDetails.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" } key={index}>
                { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ?
                  ""
                  : 
                  academicsDetails.editStatus == "Block" ?
                    <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                    </div>
                  :
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                    <input type="checkbox" className="reqInfocheck" name="academicsCheck" data-present="EducationForm" data-index={index} id={academicsDetails.chkid} checked={academicsDetails.value} value={"Academics : "+academicsDetails.educationId} onChange={this.handleChageEducation.bind(this)}/>
                  </div>
                }  
                <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
                  <div className={academicsDetails.editStatus == "Reopen" ? "reOpenedu-box" : academicsDetails.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                    <i className={academicsDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : academicsDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : academicsDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                    title={academicsDetails.verifiedStatus == 'In Process' ? "Verification is in process." : academicsDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : academicsDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/college.png" className="college-img"/>
                  </div>
                </div>
                <div className={FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : academicsDetails.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile"  : "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
                  <span className="university-name">{academicsDetails.university}</span><br />
                    <span className="degree">{academicsDetails.educationQualification}{academicsDetails.specialization ? ' - ' + academicsDetails.specialization : ""}</span><br />
                    <span className="year">{academicsDetails.dateAttendedFrom ? academicsDetails.dateAttendedFrom : ""}{academicsDetails.dateAttendedTo ? ' - ' + academicsDetails.dateAttendedTo : ""}</span><br />               
                    <span className="year text-success">{academicsDetails.ticketStatus ? "Verification Status: "+academicsDetails.ticketStatus : ""}</span>               
                   {academicsDetails.editStatus == "Reopen" ?
                         <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {academicsDetails.remark}</span>
                       :
                       ""
                      }
                </div>
               { this.props.currentId ?
                 (academicsDetails.editStatus == "Open" || academicsDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
                    <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"delAcadamicInfo-"+index}></i>
                    <i className="fa fa-pencil edit-pencil pull-right add-btn" title="Edit Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"editacadamicinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                  </div>
                   :
                   academicsDetails.verifiedStatus == 'Approved' && academicsDetails.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                       {/*<a href={academicsDetails.report} target="_blank">
                        <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                       </a> */}  
                      </div>
                  :
                  ""
                :
                academicsDetails.editStatus == "Open" || academicsDetails.editStatus == "Reopen" ?
                <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 NOpadding">
                  <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"delAcadamicInfo-"+index}></i>
                  <i className="fa fa-pencil edit-pencil pull-right add-btn" title="Edit Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"editacadamicinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                </div>
                :
                academicsDetails.editStatus == "Block" && academicsDetails.verifiedStatus != 'Approved'?
                  <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                        Order No <span className="pull-right">:</span>
                      </div>
                      
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                        <p>{academicsDetails.orderNo}</p>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                        Status <span className="pull-right">:</span>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                        <p>{academicsDetails.verifiedStatus}</p>
                      </div> 
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                        Order Date <span className="pull-right">:</span>
                      </div>                                    
                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                        <p>{moment(academicsDetails.orderDate).format("DD/MM/YYYY")}</p>
                      </div>    
                  </div>
                  :
                  academicsDetails.verifiedStatus == 'Approved' && academicsDetails.editStatus == "Block" ?
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                      {/*<a href={academicsDetails.report} target="_blank">
                        <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                      </a> */}
                    </div>
                : 
                ""
              }                   
              <div className="modal fade" id={"delAcadamicInfo-"+index} role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                      </div>
                      <p className="">Do you want to delete this data?</p>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteAcademics.bind(this)} data-index={index}>Yes</button>
                        &nbsp;&nbsp;
                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                      </div>
                    </div>
                    <div className="modal-footer">
                    </div>
                  </div> 
                </div>
              </div>
             <div className="modal fade" id={"editacadamicinfo-"+index} role="dialog">
              <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <br/>
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h4 className="text-center">Edit Your Acadamics Information</h4>
                          <br/>
                          <EducationForm key={index + '-academics'} academicsValues={academicsDetails} indexValue={index} />
                        </div>
                      </div>
                    </div>
                  </div> 
                </div>
              </div>
            </div>
          );
        })
        :
          FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
          Meteor.userId() == this.props.currentId ?
          <span className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 acadamicinfoOuter noProfilePadding">Please add your Acadamics Information</span>
          :
            <span className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 acadamicinfoOuter noProfilePadding">No data available.</span>
          :
        <span className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 acadamicinfoOuter noProfilePadding">Please add your Acadamics Information</span>
        :
        <span className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 acadamicinfoOuter noProfilePadding">Please add your Acadamics Information</span>
      }

      {this.props.professionalData ?
        this.props.professionalData.map((professionalsDetails, index)=>{
          return(
            professionalsDetails == null ?
            <div key={index}>
            </div>
            :
           <div className={professionalsDetails.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" } key={index}>
              { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms'
                ?
                 ""
               : 
               professionalsDetails.editStatus == "Block" ?
                <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                </div>
                :
                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                  <input type="checkbox" className="reqInfocheck" name="professionalsCheck" id={professionalsDetails.chkid} data-index={index} checked={professionalsDetails.value} data-present="EducationForm" value={"Professionals Academics : "+professionalsDetails.professionalEducationId} onChange={this.handleChangeProfessionalEducation.bind(this)}/>
                </div>
              }
              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
                <div className={professionalsDetails.editStatus == "Reopen" ? "reOpenedu-box" : professionalsDetails.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                  <i className={professionalsDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : professionalsDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : professionalsDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                  title={professionalsDetails.verifiedStatus == 'In Process' ? "Verification is in process." : professionalsDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : professionalsDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/college.png" className="college-img"/>
                </div>
              </div>
              <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : professionalsDetails.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" : "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
                <span className="university-name">{professionalsDetails.professionalQualification}</span><br />
                <span className="degree">{professionalsDetails.qualifyingBodyNm}</span><br />
                <span className="year">{professionalsDetails.dateOfQualification ? professionalsDetails.dateOfQualification : ""}</span>               
                <span className="year text-success">{professionalsDetails.ticketStatus ? "Verification Status: "+professionalsDetails.ticketStatus : ""}</span>               
                {professionalsDetails.editStatus == "Reopen" ?
                  <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {professionalsDetails.remark}</span>
                  :
                  ""
                }
              </div>
              {this.props.currentId ?
               (professionalsDetails.editStatus == "Open" || professionalsDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                 <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
                    <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Academics" onClick={this.editAcademics.bind(this)} data-toggle="modal" data-target={"delProfessionalAcadamicInfo-"+index}></i>
                    <i className="fa fa-pencil edit-pencil pull-right add-btn" title="Edit Academics" onClick={this.editProfessionalAcademics.bind(this)} data-toggle="modal" data-target={"editprofessionalacadamicinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                 </div>
                   :
                   professionalsDetails.verifiedStatus == 'Approved' && professionalsDetails.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                     {/* <a href={professionalsDetails.report} target="_blank">
                        <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                      </a>*/}
                    </div>
                  :
                  ""
                :
                professionalsDetails.editStatus == "Open" || professionalsDetails.editStatus == "Reopen" ?
                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 NOpadding">
                     <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Academics" onClick={this.editAcademics.bind(this)} data-toggle="modal" data-target={"delProfessionalAcadamicInfo-"+index}></i>
                     <i className="fa fa-pencil edit-pencil pull-right add-btn" title="Edit Academics" onClick={this.editProfessionalAcademics.bind(this)} data-toggle="modal" data-target={"editprofessionalacadamicinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                  </div>
                :
                professionalsDetails.editStatus == "Block" &&  professionalsDetails.verifiedStatus != 'Approved' ?
                <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                      Order No <span className="pull-right">:</span>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                      <p>{professionalsDetails.orderNo}</p>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                      Status <span className="pull-right">:</span>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                      <p>{professionalsDetails.verifiedStatus}</p>
                    </div> 
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                      Order Date <span className="pull-right">:</span>
                    </div>                                    
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                      <p>{moment(professionalsDetails.orderDate).format("DD/MM/YYYY")}</p>
                    </div> 
                  </div>  
                </div> 
                :
                 professionalsDetails.verifiedStatus == 'Approved' && professionalsDetails.editStatus == "Block" ?
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                     {/* <a href={professionalsDetails.report} download>
                        <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                      </a>  */}
                    </div>
              :
              ""
                }  
                <div className="modal fade" id={"delProfessionalAcadamicInfo-"+index} role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <p className="">Do you want to delete this data?</p>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteProfessionalAcadamic.bind(this)} data-index={index}>Yes</button>
                          &nbsp;&nbsp;
                          <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                        </div>
                      </div>
                      <div className="modal-footer">
                      </div>
                    </div> 
                  </div>
                </div>
                <div className="modal fade" id={"editprofessionalacadamicinfo-"+index} role="dialog">
                  <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <br/>
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <h4 className="text-center">Edit Your Professional Acadamics Information</h4>
                              <br/>
                              <ProfessionalEduForm key={index + '-professionalAcademics'} professionalAcademicsValues={professionalsDetails} indexValue={index} />
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
           );
         })
        :
        <span></span>
      }
        
    </div>
     <div className="modal fade" id="acadamicinfo" role="dialog">
       <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <br/>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <h4 className="text-center">Add Your Acadamics Information</h4>
                  <br/>
                  <EducationForm key="educationFormAdd" educationFormAdd="educationFormAddValue" />
                  <h4 className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Professional Qualification Information [Only in case of IIT, CA, ICWAI, CS, MBBS etc]</h4>
                  <ProfessionalEduForm key="profEducationFormAdd" profEducationFormAdd="profEducationFormAddValue" />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}