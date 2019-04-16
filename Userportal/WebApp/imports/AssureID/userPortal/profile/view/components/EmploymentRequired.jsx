import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import WorkForm from '/imports/AssureID/userPortal/profile/forms/components/WorkForm.jsx';
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
export default class EmploymentRequired extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
      } 
    }
  } 
  componentDidMount() {
  } 
  editExperience(event){
    event.preventDefault(); 
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
  deleteExperience(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeEmploymentData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#delExperienceInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  handleChangeEmployement(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.employeeData[index].value = value;

     this.setState({
      [name]: value, 
     });
  }
  render() {
    return ( 
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-briefcase col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-9 viewTitle">Experience Information</span>
          {
            FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
              Meteor.userId() == this.props.currentId ?
                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
                  <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Employment Details" data-target="#experienceinfo"></i>
                </div>
              :
              ""
            :
            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
              <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Employment Details" data-target="#experienceinfo"></i>
            </div>      
          }
        </div>
        <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12" >   
          {this.props.employeeData ?
            this.props.employeeData.length > 0 ?
            this.props.employeeData.map((employmentDetails, index)=>{
              return (
                employmentDetails == null ?
                 <div key={index}>
                 </div>
                :
                <div className={employmentDetails.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"} key={index + '-' + 'employment'}> 
                  { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ?
                    ""
                    : 
                    employmentDetails.editStatus == "Block" ?
                      <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                      </div>
                    : 
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                      <input type="checkbox" className="reqInfocheck" name="employementCheck" data-index={index} data-present="WorkForm" checked={employmentDetails.value} id={employmentDetails.chkid} value={"Employment : "+employmentDetails.employementId} onChange={this.handleChangeEmployement.bind(this)}/>
                    </div> 
                   } 
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
                    <div className={employmentDetails.editStatus == "Reopen" ? "reOpenedu-box": employmentDetails.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                      <i className={employmentDetails.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : employmentDetails.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : employmentDetails.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                      title={employmentDetails.verifiedStatus == 'In Process' ? "Verification is in process." : employmentDetails.verifiedStatus == 'Reject' ? "Verification is rejected." : employmentDetails.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/company.png" className="college-img"/>
                    </div>
                  </div>
                  <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : employmentDetails.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile"  : "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
                    <span className="university-name">{employmentDetails.designation}</span><br />
                    <span className="company-name">{employmentDetails.nameOfEmployer}</span><br />
                    <span className="year">{employmentDetails.employmentFrom ? moment(employmentDetails.employmentFrom).format('MMMM YYYY') + ' - ' : ""}{employmentDetails.employmentTo ? employmentDetails.employmentTo == 'Present' ? employmentDetails.employmentTo : moment(employmentDetails.employmentTo).format('MMMM YYYY') : ""}</span><br />
                    <span className="year text-success">{employmentDetails.ticketStatus ? "Verification Status: "+employmentDetails.ticketStatus : ""}</span>                                
                    {employmentDetails.editStatus == "Reopen" ?
                       <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {employmentDetails.remark}</span>
                     :
                     ""
                    }
                  </div>
                  { 
                    this.props.currentId ?
                    (employmentDetails.editStatus == "Open" || employmentDetails.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 NOpadding">
                        <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Employment" data-toggle="modal" onClick={this.editExperience.bind(this)} data-target={"delExperienceInfo-"+index}></i>
                        <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editExperience.bind(this)} title="Edit Employment" data-toggle="modal" data-target={"editexperienceinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                      </div>
                       :
                        employmentDetails.verifiedStatus == 'Approved' && employmentDetails.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                            {/*<a href={employmentDetails.report} target="_blank">
                             <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a>*/}                         
                          </div>
                      :
                      "" 
                    :
                    employmentDetails.editStatus == "Open" || employmentDetails.editStatus == "Reopen" ?
                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 NOpadding">
                      <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Employment" data-toggle="modal" onClick={this.editExperience.bind(this)} data-target={"delExperienceInfo-"+index}></i>
                      <i className="fa fa-pencil edit-pencil pull-right add-btn" onClick={this.editExperience.bind(this)} title="Edit Employment" data-toggle="modal" data-target={"editexperienceinfo-"+index} style={{marginRight: '10' + 'px'}}></i>
                    </div>
                    : 
                     employmentDetails.editStatus == "Block" &&  employmentDetails.verifiedStatus != 'Approved' ?
                        <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                              Order No <span className="pull-right">:</span>
                            </div>     
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                              <p>{employmentDetails.orderNo}</p>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                              Status <span className="pull-right">:</span>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                              <p>{employmentDetails.verifiedStatus}</p>
                            </div> 
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                              Order Date <span className="pull-right">:</span>
                            </div>                                    
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                              <p>{moment(employmentDetails.orderDate).format("DD/MM/YYYY")}</p>
                            </div> 
                          </div>   
                        </div>
                        :
                         employmentDetails.verifiedStatus == 'Approved' && employmentDetails.editStatus == "Block" ?
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                             {/*<a href={employmentDetails.report} target="_blank">
                             <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                            </a> */}                          
                          </div>
                      :
                      "" 
                  } 
                  <div className="modal fade" id={"delExperienceInfo-"+index} role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                          </div>
                          <p className="">Do you want to delete this data?</p>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteExperience.bind(this)} data-index={index}>Yes</button>
                            &nbsp;&nbsp;
                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                          </div>
                        </div>
                        <div className="modal-footer">
                        </div>
                      </div>  
                    </div>
                  </div>
                  <div className="modal fade" id={"editexperienceinfo-"+index} role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <h4 className="text-center">Edit Employment Information</h4>
                              <br/>
                              <WorkForm key={index + '-work'} workValues={employmentDetails} indexValue={index}/>
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
                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Experience Information</span>
              :
              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">No data available.</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Experience Information</span>
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Please add your Experience Information</span>
          }
        </div>
        <div className="modal fade" id="experienceinfo" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Employment Information</h4>
                    <br/>
                    <WorkForm key="workFormAdd" workFormAdd="workFormAddValue"  />
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