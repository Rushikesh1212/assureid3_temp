import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import ListOfCheckList from './ListOfCheckList.jsx';
import { ChecklistFieldExpert } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';

class AddEditChecklist extends TrackerReact(Component){
  constructor(props) {
      super(props);
        this.state = {
        checkListFrom : 'Database',
        task : '', 
        checkListFor : '',
        button : 'ADD',
        "subscription" : {
        }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
   $('#fieldSelect').multipleSelect();
    $.validator.addMethod("regCx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter valid value");
    $.validator.addMethod("regCx5", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter only text.");
    $("#checklistValid").validate({
      rules: {
        task: {
          required: true,
          regCx2: /^[a-zA-Z_ ]+$|^$/, 
        },               
        checkListForField:{
          required: true,          
          regCx5 : /^[a-zA-Z_ ]+$|^$/,
        },
      },

      errorPlacement: function(error, element) {   
        if (element.attr("name") == "task"){      
          error.insertAfter("#taskError");  
        }
        
      }

    });  
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.checkList){
        this.setState({
        checkListFor      : nextProps.checkList.checkListFor,
        task              : nextProps.checkList.task,
        checkListFrom     : nextProps.checkList.checkListFrom,
        id                : nextProps.checkList._id,
        button            : nextProps.button,
        });
      }
    }else{
      this.setState({
        checkListFrom   : 'Database',
        task            : '',
        checkListFor    : '',
        id              : '',
        button          : '',
      });
  }

  this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
    const target = event.target;
    const name = target.name;
    this.setState({
    [name]: event.target.value,
    },()=>{
      if(this.state.checkListFrom){
        if(this.state.checkListFrom == "Database"){
          $('#multiCheckListBlock').css("display","block");
        }else{
          $('#multiCheckListBlock').css("display","none");
          
        }
      }
    });

    
  }
  
  handleSubmit(e){
    e.preventDefault();
    var relatedFieldArr = [];
    if($("#checklistValid").valid()){
      var checkListFor = this.refs.checkListFor.value;
      var task = this.refs.task.value;
      var checkListFrom = this.refs.checkListFrom.value;
      var id = FlowRouter.getParam('id');
      var checkListForField = $('#fieldSelect').val();

      var option_all = $("select#fieldSelect option:selected").map(function () {
      var optionText= $(this).text();
      var optionValue= $(this).val();

      relatedFieldArr.push({
      "selectedField":optionText,
      "dbField" :optionValue
      });

      }).get().join(',');

      var formValue = {
        "task"            : task,
        "checkListFrom"   : checkListFrom,
        "checkListFor"    : checkListFor,
        "relatedFields"   : relatedFieldArr,
        "createdAt"       : new Date(),
      }
      // console.log("formValue:",formValue);
      if(id){

        if(checkListFrom!="" && checkListFor!=""){
          if(formValue.checkListFrom == "User Upload"){
            Meteor.call('updateChecklist',id,formValue,(error,result)=>{
            if(error){
            console.log(error.reason);
            }else{
              swal("Done","Your Check List has been Created!.","success");
              // $(".UniversityName").val("");
              $(".task").val("");
              $(".checkListFor").val("");
              $(".checkListFrom").val("");
              }
            });
          }else  if(formValue.checkListFrom == "Database" && formValue.relatedFields.length>0){
            Meteor.call('updateChecklist',id,formValue,(error,result)=>{
              if(error){
              console.log(error.reason);
              }else{
                swal("Done","Your Check List has been Created!.","success");
                // $(".UniversityName").val("");
                $(".task").val("");
                $(".checkListFor").val("");
                $(".checkListFrom").val("");
                FlowRouter.go('/admin/Checklist');
                }
              });
          }else{
            swal("Please enter mandetory field");
          }
        }else{
          swal("Please enter mandetory field");
        }
      }else{
        if(checkListFrom!="" && checkListFor!=""){
          if(formValue.checkListFrom == "User Upload"){
            Meteor.call('createChecklist',formValue,(error,result)=>{
            if(error){
            console.log(error.reason);
            }else{
              swal("Done","Your Check List has been Created!.","success");
              // $(".UniversityName").val("");
              $(".task").val("");
              $(".checkListFor").val("");
              $(".checkListFrom").val("");
              }
            });
          }else  if(formValue.checkListFrom == "Database" && formValue.relatedFields.length>0){
            Meteor.call('createChecklist',formValue,(error,result)=>{
              if(error){
              console.log(error.reason);
              }else{
                swal("Done","Your Check List has been Created!.","success");
                // $(".UniversityName").val("");
                $(".task").val("");
                $(".checkListFor").val("");
                $(".checkListFrom").val("");
                }
              });
          }else{
            swal("Please enter mandetory field");
          }
        }else{
          swal("Please enter mandetory field");
        }
       
      }
    }
  }

  render() {
    return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Check List </h1>
        <ol className="breadcrumb">
          <li>
          <a href="#"><i className="fa fa-check-square" /> Check List</a></li>
          <li className="active">Add Check List</li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box box-primary">
              <div className="box-header with-border">
              <h2 className="box-title">Check List For Verification</h2>
              </div>
              <div className="box-body">
              <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                <form id="checklistValid">
                     <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12" id="checkListForError">
                        <span className="blocking-span col-lg-12 col-md-6 col-xs-12 col-sm-12 NOleftPad">
                            <label className="floating-label">Checklist For         
                                <span className="astrikReq">*</span>
                            </label>
                            <select className="form-control inputText checkListFor" ref="checkListFor" id="checkListFor" value={this.state.checkListFor} name="checkListFor" onChange={this.handleChange}>
                              {/* <option value="Basic Information">Basic Information</option> */}
                              <option value="Basic Information">Basic Information</option>
                              <option value="Identity Information">Identity Information</option>
                              <option value="Address Information">Address Information</option>
                              <option value="Academic Information">Academic Information</option>
                              <option value="Employment Information">Employment Information</option>
                              <option value="Skills And CertificationInformation">Skills & Certification Information</option>
                              <option value="Referral Information">Referral Information</option>
                              {/* <option value="Other Information">Other Information</option> */}
                            </select>
                        </span>
                      </div>
                       <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12" id="taskError">
                        <span className="blocking-span">
                            <label className="floating-label">Checklist
                              <span className="astrikReq">*</span>                              
                            </label>
                            <input type="text" className="form-control inputText task" ref="task" id="task" value={this.state.task} name="task" onChange={this.handleChange}/>
                        </span> 
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12">
                        <span className="blocking-span">
                          <label className="floating-label">Checklist From
                            <span className="astrikReq">*</span>                            
                          </label>
	                        <select className="form-control inputText  checkListFrom" ref="checkListFrom" id="checkListFrom" value={this.state.checkListFrom} name="checkListFrom" onChange={this.handleChange}>
                            <option selected disabled value>-- Select --</option>
	                          <option value="Database">Database</option>
	                          <option value="User Upload">User Upload</option>
	                        </select>
	                       </span> 
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 multiCheckListBlockError" id="multiCheckListBlock">
                        <span className="blocking-span col-lg-12 col-md-6 col-xs-12 col-sm-12 NOleftPad">
                          <label className="floating-label col-lg-12 noLRPad">Checklist For Verification
                            <span className="astrikReq">*</span>  
                          </label>                           
                          <select className="w300" multiple="multiple" id="fieldSelect" ref="checkListForField" name="checkListForField">
                            <option disabled>Checklist For Basic Information </option>
                            <option value="firstName">First Name </option>                
                            <option value="lastName">Last Name </option>   
                            <option value="dateOfBirth">Date Of Birth </option> 
                            <option value="mobileNo">Contact Number </option> 
                            <option value="emailId">Email Id </option>   
                            <option disabled>Checklist For Address Information</option>  ``                                        
                            <option value="line1">Address Line 1 </option>
                            <option value="line2">Address Line 2 </option>
                            <option value="line3">Address Line 3 </option>
                            <option value="landmark">Landmark </option>
                            <option value="city">City </option>
                            <option value="state">State </option>
                            <option value="country">Country </option>
                            <option value="pincode">Pincode </option>
                            <option value="residingFrom">residingFrom</option>
                            <option value="residingTo">residingTo</option>
                            <option disabled>Checklist For Employemnt </option>
                            <option value="nameOfEmployer">Employer Name </option>
                            <option value="employerAddress">Company Address </option>
                            <option value="employerCity">Company Address City </option>
                            <option value="employerState">Company Address State</option>
                            <option value="contactNo">Company contact number  </option>
                            <option value="employeeCode">Employee ID / Employee code </option>
                            <option value="designation">Employee designation </option>
                            <option value="department">Employee department </option>
                            <option value="employmentFrom">Employee period from </option>
                            <option value="employmentTo">Employee period to </option>
                            <option value="lastSalaryDrawn">Last Salary Drawn </option>
                            <option value="typeOfEmployement">Type of Employment</option>
                            <option value="detailOfAgency">Detail of Agency</option>
                            <option value="reasonOfLeaving">Reason of Leaving</option>
                            <option value="dutiesAndResponsibilites">Duties And Responsibilites</option>
                            <option value="reportingManagerNm">Reporting manager name</option>
                            <option value="prevDesignation">Reporting manager designation</option>
                            <option value="contactDetails">Reporting manager contact number</option>
                            <option disabled>Checklist For Education </option>                  
                            <option value="educationLevel">Qualification Level</option>
                            <option value="educationQualification">Qualification</option>
                            <option value="specialization">Specialization</option>
                            <option value="grades">Grades/Percentage</option>
                            <option value="educationMode">Mode of Eduction</option>
                            <option value="dateAttendedFrom">Date attended from</option>
                            <option value="dateAttendedTo">Date attended to</option>
                            <option value="university">University</option>
                            <option value="collegeName">College/Institute</option>
                            <option value="collegeAddress">College Address</option>
                            <option value="city">College City</option>
                            <option value="state">College State</option>
                            <option value="rollNo">Roll No./Registratation No.</option>
                            <option value="proofType">Education Proof Type</option>
                            <option disabled>Checklist For Identity </option>                                    
                            <option value="adharCardNo">Aadhar Number</option>
                            <option value="panCardNo">Pan Number</option>
                            <option value="drivingCardNo">Driving Card Number</option>
                            <option value="votingCardNo">Voting Card Number</option>
                            <option value="rationCardNo">Ration Card NUmber</option>
                            <option value="passportNo">passport Card NUmber</option>
                            <option disabled>Checklist For Reference </option>   
                            <option value="referralFirstName">Referral First Name</option>
                            <option value="referralLastName">Referral Last Name</option>
                            <option value="referralMobileNum">Referral Mobile Number</option>
                            <option value="referralEmailID">Referral EmailID</option>
                            <option value="referralOrganization">Referral Organization</option>
                            <option value="referralDesignation">Referral Designation</option>   
                            <option value="referralRelationship">Referral Relationship</option>   
                            <option value="referralAssociatedSinceMonths">Referral Associated Since Months</option>                           
                          </select>
                        </span>
                      </div>
                <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                 <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="" onClick={this.handleSubmit.bind(this)}>{this.state.button}</button>
                </div>
                </form>
              </div>
              <ListOfCheckList />
            </div>
          </div>
         </div>
       </div>
      </section>
    </div>
    );
 }
}
EditChecklistContainer = withTracker(({params}) => {
  var _id = FlowRouter.getParam('id');
  const postHandle = Meteor.subscribe('singleChecklistFieldExpert',_id);
  // var editServices   = this.props.params.id;
  // console.log("Param" +editServices);
  const checkList = ChecklistFieldExpert.findOne({"_id":_id})|| {};
  const loading = !postHandle.ready();

  if(_id){
    var button = "UPDATE";
    return {
    loading,
    checkList,
    button,
    };
  }else{
    var button = "ADD";
    return {
    loading,
    checkList,
    button
    };
  }
})(AddEditChecklist);

export default EditChecklistContainer;
