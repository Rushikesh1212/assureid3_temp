import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import ProfessionalEduForm from '/imports/AssureID/userPortal/profile/forms/components/ProfessionalEduForm.jsx';
import EducationForm from '/imports/AssureID/userPortal/profile/forms/components/EducationForm.jsx';

export default class ListAcademics extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "subscription" : {
      }
    }
  }
  componentDidMount(){
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  editAcademics(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  deleteAcademics(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeBasicEducation",index,(error, result)=>{
      if (error) {
       
      }else{  
        $('#deleteAcadamicInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  deleteProfessionalAcadamic(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeProfessionalEducation",index,(error, result)=>{
      if (error) {
       
      }else{  
        $('#deleteProfessionalAcadamicInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }

  render(){
    return( 
      <div>
        {this.props.academicsData.length > 0 || this.props.professionalData.length > 0 ?
          <div>
            <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-graduation-cap col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Academics Information</span>
              </div>
              <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12" >   
                {this.props.academicsData.length > 0 ?
                  this.props.academicsData.map((academicsDetails, index)=>{
                    return( 
                      academicsDetails  == null ? 
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}>
                        </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}> 
                          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                            <div className="edu-box ">
                              <i className={academicsDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : academicsDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : academicsDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                               title={academicsDetails.verifiedStatus == 'In Process' ? "Verification is in process." : academicsDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : academicsDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/college.png" className="college-img"/>
                            </div>
                          </div> 
                          <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <span className="university-name">{academicsDetails.university}</span><br />
                            <span className="degree">{academicsDetails.educationQualification}{academicsDetails.specialization ? ' - ' + academicsDetails.specialization : ""}</span><br />
                            <span className="year">{academicsDetails.dateAttendedFrom ? academicsDetails.dateAttendedFrom : ""}{academicsDetails.dateAttendedTo ? ' - ' + academicsDetails.dateAttendedTo : ""}</span>                
                          </div>
                          {
                            academicsDetails.editStatus == "Open" || academicsDetails.editStatus == "Reopen" ?
                              <div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                  <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight">
                                    <i className="fa fa-pencil edit-pencil pull-right" title="Edit Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"editAcadamicInfo-"+index}></i>
                                  </div>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                  <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <i className="fa fa-trash edit-pencil pull-right" title="Delete Academics" data-toggle="modal" onClick={this.editAcademics.bind(this)} data-target={"deleteAcadamicInfo-"+index}></i>
                                  </div>
                                </div>
                              </div>
                            :
                            ""
                          }   
                          <div className="modal fade" id={"deleteAcadamicInfo-"+index} role="dialog">
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
                          <div className="modal fade" id={"editAcadamicInfo-"+index} role="dialog">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <br/>
                                  <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <h4 className="text-center">Edit Your Acadamics Information</h4>
                                      <br/>
                                      <EducationForm key={index + '-academics'} academicsValues={academicsDetails} indexValue={index} listEducation="listEducation"/>
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

                {this.props.professionalData.length > 0 ? 
                  this.props.professionalData.map((professionalsDetails, index)=>{
                    return(
                      professionalsDetails == null ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}>
                        </div>
                       :
                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}> 
                          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"> 
                            <div className="edu-box ">
                              <i className={professionalsDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : professionalsDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : professionalsDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                               title={professionalsDetails.verifiedStatus == 'In Process' ? "Verification is in process." : professionalsDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : professionalsDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/college.png" className="college-img"/>
                            </div>
                          </div>
                          <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <span className="university-name">{professionalsDetails.professionalQualification}</span><br />
                            <span className="degree">{professionalsDetails.qualifyingBodyNm}</span><br />
                            <span className="year">{professionalsDetails.dateOfQualification ? professionalsDetails.dateOfQualification : ""}</span>                
                          </div>
                          { 
                            professionalsDetails.editStatus == "Open" || professionalsDetails.editStatus == "Reopen" ?
                              <div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                  <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight">
                                    <i className="fa fa-pencil edit-pencil pull-right" title="Edit Academics" onClick={this.editAcademics.bind(this)} data-toggle="modal" data-target={"editProfessionalAcadamicInfo-"+index}></i>
                                  </div>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                  <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <i className="fa fa-trash edit-pencil pull-right" title="Delete Academics" onClick={this.editAcademics.bind(this)} data-toggle="modal" data-target={"deleteProfessionalAcadamicInfo-"+index}></i>
                                  </div>
                                </div>
                              </div>
                            :
                            ""
                          }
                          <div className="modal fade" id={"deleteProfessionalAcadamicInfo-"+index} role="dialog">
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
                          <div className="modal fade" id={"editProfessionalAcadamicInfo-"+index} role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content"> 
                                  <div className="modal-body">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <br/>
                                    <div className="row">
                                      <h4 className="text-center">Edit Your Professional Acadamics Information</h4>
                                      <br/>
                                      <ProfessionalEduForm key={index + '-professionalAcademics'} professionalAcademicsValues={professionalsDetails} indexValue={index} listProfEductaion="listProfEductaion"/>
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
            </div>
          </div>
          :
          ""
        }
      </div>
    );
  }
}
