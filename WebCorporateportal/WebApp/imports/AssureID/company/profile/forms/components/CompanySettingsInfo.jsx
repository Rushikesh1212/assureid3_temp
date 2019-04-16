import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile }from '/imports/AssureID/company/profile/api/companyProfile.js';
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";
import PaymentMode from './PaymentMode.jsx';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import swal from 'sweetalert';


class CompanySettingsInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      'assureid'     : '',
      'currentPassword' : '',
      'newPassword'     : '',
      'reenterPassword' : '',
       "subscription" : { 
      },
      "accessArray"   :this.props.companyprofileobj.accessArray,
 
    };
   this.handleChange = this.handleChange.bind(this);
   this.addAccessPermissionPerson = this.addAccessPermissionPerson.bind(this);
  }
  
  componentDidMount(){

    $.validator.addMethod("regCx6", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter only text.");
    $.validator.addMethod("regCx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regCx2", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid email.");
    $.validator.addMethod("regx9", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid name.");
    // $.validator.addMethod("regxMessage", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "It should only contain alphanumeric and some special character.");      
  
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });    
    $("#addSPOCForm").validate({
      rules: {
       
        accessPersonEmail: {
          regCx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/, 
        },       
        accessPersonContact: {
          // required: true,            
          regCx3: /^((\\+91-?)|0)?[0-9]{10}$|^$/, 
        },
        accessPersonDesignation : {
          // required: true,            
          regCx6: /^[a-zA-Z-._/ ]+$|^$/,
        },
        accessPersonName:{
          // required: true,           
          regx9:/^[a-zA-Z0-9_ ]+$|^$/
        }
      },

      // errorPlacement: function(error, element) {   
      //   if (element.attr("name") == "accessPersonName"){      
      //     error.insertAfter("#accessPersonNameError");  
      //   }
      //   if (element.attr("name") == "accessPersonEmail"){      
      //     error.insertAfter("#accessPersonEmailError");  
      //   }
      //   if (element.attr("name") == "accessPersonContact"){      
      //     error.insertAfter("#accessPersonContactError");  
      //   }
      //   if (element.attr("name") == "accessPersonDesignation"){      
      //     error.insertAfter("#accessPersonDesignationError");  
      //   }
      //   if (element.attr("name") == "accessPersonName"){      
      //     error.insertAfter("#accessPersonNameError");  
      //   }
      // }

    });   
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   // event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // 
  
    this.setState({
      [name]: event.target.value,
    });
  }
  editDeletePersons(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
    }
  }

  addAccessPermissionPerson(event){
    
    if($('#addSPOCForm').valid()){
      var accessPersonName        = this.refs.accessPersonName.value;      
      var accessPersonDesignation = this.refs.accessPersonDesignation.value;      
      var accessPersonEmail       = this.refs.accessPersonEmail.value;
      var accessPersonContact     = this.refs.accessPersonContact.value;
      var accessPersonAddress     = this.refs.accessPersonAddress.value;
      var companyId               = $(event.target).attr('data-companyid');
      var accessArray = this.state.accessArray;
      
      if(accessArray.length>0){
        // var elemPresent = accessArray.indexOf(accessPersonContact);
        let found = accessArray.some(function(elem){ 
             return elem.accessPersonContact == accessPersonContact;
        });
        if(!found){
          accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
          this.setState({
            accessArray 
          });

          
          if(accessArray.length>0){
            this.state.accessPersonName         = "";
            this.state.accessPersonDesignation  = "";  
            this.state.accessPersonEmail        = "";
            this.state.accessPersonContact      = ""; 
            this.state.accessPersonAddress      = ""; 
          }
        }else{
          // swal("Contact number already exist");
          swal({
            title:'abc',
            text: "Contact number already exist!",
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'})
          
        }
       
      }else{
        accessArray.push({'accessPersonName': accessPersonName,'accessPersonDesignation':accessPersonDesignation,'address': accessPersonEmail,'accessPersonContact':accessPersonContact,'accessPersonAddress':accessPersonAddress,'verified':true});
        this.setState({
          accessArray 
        });
        if(accessArray.length>0){
          this.state.accessPersonName         = "";
          this.state.accessPersonDesignation  = "";  
          this.state.accessPersonEmail        = "";
          this.state.accessPersonContact      = ""; 
          this.state.accessPersonAddress      = "";
          
        }
      }
    }
  }

  submitCompanyInfo(event){
    event.preventDefault();
    var paymentBy = this.state.paymentBy;
    if(this.props.location){
      var companyId = this.props.location._id;
      var assureid  = this.props.assureid;
      Meteor.call('updatepaymentBy',companyId,paymentBy,function(error,result){
        if (result) {
        }else{
          // swal('Data submitted successfully.');
          swal({
            title:'abc',
            text: "Data submitted successfully!",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'})
          FlowRouter.go('/companyForms/viewCompany/'+assureid);
        }
      });
    }else{
      swal({
        title:'abc',
        text: "Please add company basic information first.",
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#666',
        // cancelButtonColor:'#d33',
        confirmButtonText: 'Ok'
      })
    }
  }

  addautherizedperson(event){
    event.preventDefault();
    var userId      = event.currentTarget.id;    
    var accessArray = this.state.accessArray;    
    Meteor.call('addauthorizedPerson',userId,accessArray,(err,res)=>{
      if(res){
        swal({
          title:'abc',
          text: "SPOC person added successfully!",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#666',
          // cancelButtonColor:'#d33',
          confirmButtonText: 'Ok'
        })
      }
    });
  }

  removeProofDocs(event){
    event.preventDefault();
    $('.selectWidth').removeClass('zeroMarginTop');
    $('.selectWidth').removeClass('documentSelect');
    var imgId     = $(event.target).attr('data-id');
    var imgValue  = $(event.currentTarget).attr('data-value');
    var companyId = $(event.currentTarget).attr('data-companyId');
    if(imgId){
      Meteor.call("removeTempCompanyImages",imgId,(error, result)=>{
        // swal({
        //   position: 'top-right',
        //   type: 'success',
        //   title: 'Deleted Successfully',
        //   showConfirmButton: false,
        //   timer: 1500
        // });
      });
    }else{
      Meteor.call("removeBasicCompanyImages",imgValue,companyId,(error, result)=>{
      });
    }
  }
  
  editchangeperson(event){
    event.preventDefault();
    var companyId       = this.props.location._id;
    var companyAssureID = this.props.location.companyAssureID;
    var index           = parseInt($(event.currentTarget).attr('data-index'));
    // 
    var assureid        = this.refs.assureid.value;
    // 
    var matchedUserID   = UserProfile.findOne({"assureId" : assureid});
    if (matchedUserID) {
          // 
        var authorizedPerson =  {
            "empId"    : matchedUserID.userId,
            "userId"   : matchedUserID._id,
            "assureId" : matchedUserID.assureId,
            "Name"     : matchedUserID.firstName+' '+matchedUserID.lastName,
            "emailId"  : matchedUserID.emailId,
            "mobileNo" : matchedUserID.mobileNo,
            "role"     : "companyAdmin"
        }
        // 
        Meteor.call('changeauthorizedPerson',companyId,index,authorizedPerson,function (error,result) {
          if (error) {
            
          }else{
            $('#assureid').val('');
            // 
            $('#changePersonModal-'+index).modal('hide');
          }
        })
    }else{
      //  swal("Sorry","No user found for this AssureID","error");

       swal({
        title:'abc',
        text: "Sorry! No user found for this AssureID",
        type: 'error',
        showCancelButton: false,
        confirmButtonColor: '#666',
        // cancelButtonColor:'#d33',
        confirmButtonText: 'Ok'
      })
       
    }
  }
  deleteAutherisedPerson(event){
    event.preventDefault();
    var companyId  = this.props.location._id;
    var index      = parseInt($(event.currentTarget).attr('data-index'));
    Meteor.call('deleteAutherisedPerson',companyId,index,function(error,result){
      if (error) {
        
      }else{
        // 
        $('#deletePerson-'+index).modal('hide');
      }
    });
  }

  getPaymentValue = (value)=>{
    this.setState({
      "paymentBy" : value,
    })
  } 

  removeAccessPerson(event){
    event.preventDefault();
    var index = $(event.currentTarget).attr('data-index');    
    if(this.props.companyprofileobj){
      var userId = $(event.currentTarget).attr('data-userid');      
        Meteor.call("removeEmailFromUser",userId,index);
    }
    var accessArray = this.state.accessArray;
    accessArray.splice(index,1);
    this.setState({
      accessArray
    }) 
  }
  handleChange(event){
    event.preventDefault();
     const target = event.target;
     const value  = target.type === 'checkbox' ? target.checked : target.value;
     const name   = target.name;
   
     this.setState({
       [name]: event.target.value,
     });
  }

  // change password
  changepassword(event) {
    event.preventDefault();
    if($("#changePassword").valid()){
      var currentPassword = this.refs.currentPassword.value;
      var newPassword     = this.refs.newPassword.value;
      var reenterPassword = this.refs.reenterPassword.value;
      
      var newID           = Meteor.userId();
          //Check password is at least 6 chars long
      if (newPassword == "company123" || reenterPassword == "company123") {
        //  swal("Invalid password","Not allowed to set the password to system","error")   
         swal({
          title:'abc',
          text: "Not allowed to set the password to system",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#666',
          confirmButtonText: 'Ok'
        })   
      }else{
        var isValidPassword = function(password, reenterPassword) {
          if (newPassword === reenterPassword) {
            return newPassword.length >= 6 ? true : swal({
              title: "Password should be at least 6 characters long",
              text: "Please try again",
              timer: 1700,
              showConfirmButton: false,
              type: "error"
            }); 
          }else{
            return swal({
              title: "Password doesn't match",
              text: 'Please try again',
              showConfirmButton: true,
              type: 'error'
            }); //End of error swal
          } //End of else
        }
        if (isValidPassword(newPassword,reenterPassword)) { 
          Meteor.call("resetPasswordUsingotp",newID, newPassword, function(err) {
            if (err) {
              
            }else {
              Meteor.logout();
              FlowRouter.go('/');
              swal({
                title:'abc',
                text: "Password has been changed successfully",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#666',
                confirmButtonText: 'Ok'
              })
            }
          });         
        }
        return false;
      }
    }else{
      $(event.target).find('.effect-21.error:first').focus();
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
  }
  render(){ 
    // if (!this.props.loading) {
      return (
        <div> 
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
            <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 NOpadding">
                <label>Payment By</label>
               <PaymentMode getPaymentValue={this.getPaymentValue.bind(this)} companyId={this.props.location._id} paymentValues={this.props.location.paymentBy} />
            </div>
            <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 NOpadding">
               <button className="btn btn-info col-lg-9 changepasswordButton pull-right" data-toggle="modal" data-target="#changePasswordModal">Change Password</button>
            </div>
          </div> 
          <div className="modal fade" id="changePasswordModal" role="dialog">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Change Password</h4>
                </div>
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                    <form id="changePassword" onSubmit={this.changepassword.bind(this)}>
                      <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                        <div className="input-effect input-group">
                          <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                          <input type="password" className="effect-21 form-control loginInputs" ref="currentPassword" onBlur={this.inputEffect.bind(this)} name="currentPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                          <label>Current Password<span className="astrikReq">*</span></label>
                          <span className="focus-border">
                            <i></i>
                          </span>
                        </div>
                      </div> 
                      <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                        <div className="input-effect input-group">
                          <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                          <input type="password" className="effect-21 form-control loginInputs" ref="newPassword" onBlur={this.inputEffect.bind(this)} name="newPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                          <label>New Password<span className="astrikReq">*</span></label>
                          <span className="focus-border">
                            <i></i>
                          </span>
                        </div>
                      </div> 
                      <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
                        <div className="input-effect input-group">
                          <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                          <input type="password" className="effect-21 form-control loginInputs" ref="reenterPassword" onBlur={this.inputEffect.bind(this)} name="reenterPassword" title="Password should be at least 6 characters long." pattern=".{6,}" required/>
                          <label>Re-enter Password<span className="astrikReq">*</span></label>
                          <span className="focus-border">
                            <i></i>
                          </span>
                        </div>
                      </div> 
                      <button type="submit" className="btn btn-info submitButton pull-right">Submit</button>

                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                </div>
              </div>
            </div>
          </div>
          
          {
            this.props.location.companyAssureID ?
              <a href={"/companyForms/viewCompany/"+this.props.location.companyAssureID}><button type="submit" onClick={this.submitCompanyInfo.bind(this)} className="btn btn-info pull-right submitButton">Submit</button></a>        
            :
             <button type="submit" className="btn btn-info pull-right submitButton" onClick={this.submitCompanyInfo.bind(this)}>Submit</button>        
          }
        
          
          {/* <button type="submit" className="btn btn-info pull-right submitButton">Submit</button>*/}

          <hr className="horizontalLineAtSetting"></hr>
         <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">

            <div className ="col-lg-12 col-md-12 col-sm-12 col-xs-12"><h5 className=""><b>ADD SPOC</b></h5></div>
            <form id="addSPOCForm">
              <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" id="accessPersonName" name="accessPersonName" ref="accessPersonName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.accessPersonName} required/>
                  <label>Name
                  <span className="astrikReq">*</span> 
                  </label>
                  <span className="focus-border">
                    <i></i>
                  </span>  
                </div>
              </div>
              <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                  <input type="email" className="effect-21 form-control loginInputs" id="accessPersonEmail" name="accessPersonEmail" ref="accessPersonEmail"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.accessPersonEmail} required/>
                  <label>Email<span className="astrikReq">*</span></label>
                  <span className="focus-border">
                    <i></i>
                  </span> 
                </div>
              </div>
              <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" id="accessPersonContact" name="accessPersonContact" ref="accessPersonContact"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.accessPersonContact} required/>
                  <label>Contact Number<span className="astrikReq">*</span> </label>
                  <span className="focus-border">
                    <i></i>
                  </span> 
                </div>
              </div>
              <div className="form-group inputmargin col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-file-o" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" id="accessPersonDesignation" name="accessPersonDesignation" ref="accessPersonDesignation"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.accessPersonDesignation} required/>
                  <label>Designation<span className="astrikReq">*</span> </label>
                  <span className="focus-border">
                    <i></i>
                  </span> 
                </div>
              </div>
              <div className="form-group inputmargin col-lg-12 col-md-12 col-sm-6 col-xs-6">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons"><i className="fa fa-address-book" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" id="accessPersonAddress" name="accessPersonAddress" ref="accessPersonAddress"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.accessPersonAddress} />
                  <label>Address</label>
                  <span className="focus-border">
                    <i></i>
                  </span> 
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <div className="form-group inputmargin btntop col-lg-12 col-md-12 col-sm-12 col-xs-12  addAuthorisedPermission noLRPad">
                  <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">                                              
                      <button type="button" className="btn btn-info submitButton pull-right" onClick={this.addAccessPermissionPerson.bind(this)} data-companyid={this.props.companyId}>Add</button>                                   
                  </div>
                </div>
              </div>
            </form>

             {/**Display added persons */}
          <div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <table className="table table-bordered table-striped table-hover accesspermissiontabel">
              <thead>
                <tr className="tableHeader">
                  <th> Person Name </th>
                  <th> Email ID</th>
                  <th> Contact Number </th>
                  <th> Action</th> 
                </tr>
              </thead>
              <tbody>
                { this.state.accessArray ?
                  this.state.accessArray.length>0 ?
                  this.state.accessArray.map((accessData,index)=>{
                    return( 
                      accessData == null ?
                       <tr key={index}></tr>
                       :
                        <tr key={index}>
                            <td>{accessData.accessPersonName}</td>
                            <td>{accessData.address}</td>			
                            <td>{accessData.accessPersonContact} </td>			
                            <td>{this.props.loginEmailid == accessData.address ? "-" : <i className="fa fa-trash text-danger uniqueCursorPointer" title="Delete Record" data-index={index} data-userid={this.props.companyprofileobj ? this.props.companyprofileobj.userId:""} onClick ={this.removeAccessPerson.bind(this)}></i>}</td>		
                        </tr>
                    )
                  })
                  
                  :
                  <tr>
                    <td></td>			
                    <td>Access person not yet added</td>			
                    <td></td>		
                  </tr>
                  :
                  <tr>
                    <td></td>			
                    <td>Access person not yet added</td>			
                    <td></td>		
                  </tr>
                }
              </tbody>
            </table>
            <button type="submit" className="btn btn-info pull-right submitButton1" id= {this.props.companyprofileobj.userId} onClick={this.addautherizedperson.bind(this)}>Submit</button>        
          </div>

        </div>
        </div>
      );
    // }else{
    //   return(
    //     <span>Loading</span>
    //     );
    // }
  }
}
CompanySettingsInfoContainer = withTracker(props => {
  var _id = props.companyProfileId;
  var assureid = props.assureId;
  const postHandle = Meteor.subscribe('companyProfileData',assureid);
  const userHandle = Meteor.subscribe('allUserProfileData');
  var location     = CompanyProfile.findOne({"companyAssureID": assureid}) || {};

  var authorizedPerson = [];
   if(location){ 
    const userHandle  = Meteor.subscribe('userData',location.userId);      
    const userDetails = Meteor.users.findOne({'_id':location.userId}) || {};
     if (location.authorizedPerson) {
        for (var i = 0; i < location.authorizedPerson.length; i++) {
          if (location.authorizedPerson[i].role == "companyAdmin") {

            var user = UserProfile.findOne({"_id": location.authorizedPerson[i].userId}) || {};
            if (user) {
              if (user.userProfile) {
                if (user.userProfile != '') {
                  var userImage = user.userProfile;
                  var userFileName = user.userFileName;
                  var userFileExt  = user.userFileExt;
                }else{
                   var userImage    = 'https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png';
                   var userFileName = '';
                   var userFileExt  = '';
                }
              }else{
                 var userImage    = 'https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png';
                 var userFileName = '';
                 var userFileExt  = '';
              }
                
                 authorizedPerson.push({
                  "empId"        : location.authorizedPerson[i].empId,
                  "userId"       : location.authorizedPerson[i].userId,
                  "assureId"     : location.authorizedPerson[i].assureId,
                  "Name"         : location.authorizedPerson[i].Name,
                  "emailId"      : location.authorizedPerson[i].emailId,
                  "mobileNo"     : location.authorizedPerson[i].mobileNo,
                  "userImage"    : userImage,
                  "userFileName" : userFileName,
                  "userFileExt"  : userFileExt,
               });              
            } 
          }
        }
     }
     if (userDetails) {
      if (userDetails.profile) {
        var loginEmailid = userDetails.profile.loggedinEmail;
      }
     }
   }

  const loading    = !postHandle.ready() && !userHandle.ready();
  return {
    loading,
    assureid,
    location,
    loginEmailid,
    authorizedPerson,
  };
})(CompanySettingsInfo);
export default CompanySettingsInfoContainer;