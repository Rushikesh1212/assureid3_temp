import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { TempProofDocs } from "/imports/AssureID/userPortal/api/userProfile.js";
import { UserProfile } from "/imports/AssureID/userPortal/api/userProfile.js";
import PermanentAddress from "/imports/AssureID/userPortal/profile/forms/components/PermanentAddress.jsx";
import CurrentAddress from "/imports/AssureID/userPortal/profile/forms/components/CurrentAddress.jsx";

class AddressRequired extends TrackerReact(Component){
  constructor(props){
    super(props); 
    this.state ={
      'permanentAddressId' : '', 
      'line1'           : '',
      'line2'           : '',
      'line3'           : '',
      'landmark'        : '',
      'city'            : '',
      'state'           : '',
      'country'         : '',
      'pincode'         : '',
      'residingFrom'    : '',  
      'residingTo'      : '', 
      'tempLine1'       : '',
      'tempLine2'       : '', 
      'tempLine3'       : '',
      'tempLandmark'    : '',
      'tempCity'        : '',
      'tempState'       : '',
      'tempCountry'     : '',
      'tempPincode'     : '',
      'tempresidingFrom': '',
      'tempresidingTo'  : '',
      'residingToDateOfAddress' : 'stillLivingHere',
      'currentResidingToDate'   : 'stillLivingHere',
      "subscription" : {
        "userData" : Meteor.subscribe("userData",Meteor.userId()),
        "userProfileData" : Meteor.subscribe("userProfileData"),
        "LatestTempProofDocs" : Meteor.subscribe("LatestTempProofDocs"),
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    
  }
  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }  
  editPermanaantAddress(event){
    var idVal= $(event.target).attr('data-target');
    // console.log("idVal",idVal);
    $('#'+idVal).modal('show');
  }
  editCurrentAddress(event){
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  newaddPermAddressModal(event){
   event.preventDefault(); 
   $('#permaddAddressModal').modal('show');
  }
  newAddCurrentAddressModal(event){
   $('#currentaddAddressModal').modal('show');
  }
  deleteAcademics(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removePermanentAddress",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#delPermanentAddrInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();        
      }
    });
  }
  deleteProfessionalAcadamic(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeCurrentAddress",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#delCurrentAddrInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
  handleChangePermAddr(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.permanentAddress[index].value = value;

     this.setState({
      [name]: value, 
     });
  }
  handleChangeCurrentAddr(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name; 
    var index    = parseInt($(event.currentTarget).attr('data-index'));
    this.props.currentAddress[index].value = value;

     this.setState({
      [name]: value, 
     });
  }

  requiredAddressInformation(){ 
      return( 
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <i className="fa fa-map-marker col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-10 viewTitle">Address Information</span>
          </div> 
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Permanent Address</h5>
                {
                  FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
                    Meteor.userId() == this.props.currentId ?
                      <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newaddPermAddressModal.bind(this)}></i>              
                    :
                    ""
                  :
                  <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newaddPermAddressModal.bind(this)}></i>              
                } 
              </div>  
              <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" >
              { this.props.permanentAddress.length > 0 ?
                this.props.permanentAddress.map((permAddress,index)=>{
                  return(
                    permAddress == null ?
                    <div key={index}> 
                    </div>
                    :
                    <div key={index}> 
                      <div className={permAddress.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData outerPermanentAddress" :"col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress"}>
                        { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ?
                           ""
                          : 
                           permAddress.editStatus == "Block" ?
                          <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                          </div>
                           :
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile">
                            <input type="checkbox" className="reqInfocheck" name="permanentAddressCheck" id={permAddress.chkid} data-index={index} checked={permAddress.value} value={"Permanent Address : "+permAddress.permanentAddressId} data-present="AddressForm" onChange={this.handleChangePermAddr.bind(this)}/>
                          </div>
                        }
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
                          <div className={permAddress.editStatus == "Reopen" ? "reOpenedu-box" : permAddress.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                            <i className={permAddress.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : permAddress.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : permAddress.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                             title={permAddress.verifiedStatus == 'In Process' ? "Verification is in process." : permAddress.verifiedStatus == 'Reject' ? "Verification is rejected." : permAddress.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                          </div>
                        </div>
                        <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : permAddress.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" :"edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
                          <span className="pull-left"> {permAddress.line1} {permAddress.line2 ? ', ' + permAddress.line2 : ""} {permAddress.line3 ? ', ' + permAddress.line3 : ""} {permAddress.landmark ? ', ' + permAddress.landmark : ""} {permAddress.city ? ', ' +permAddress.city : ""} {permAddress.state ? ', ' + permAddress.state : ""} {permAddress.country ? ', ' + permAddress.country : "" } {permAddress.pincode}</span><br />
                          <span className="year">{permAddress.residingFrom ? moment(permAddress.residingFrom,'DD/MM/YYYY').format('DD/MM/YYYY')+ ' - ' : ""}{permAddress.residingTo ? permAddress.residingTo == 'Present' ? permAddress.residingTo : moment(permAddress.residingTo,'DD/MM/YYYY').format('DD/MM/YYYY') : ""}</span> <br/>
                          <span className="year text-success">{permAddress.ticketStatus ? "Verification Status: "+permAddress.ticketStatus : ""}</span>               
                         {permAddress.editStatus == "Reopen" ?
                           <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {permAddress.remark}</span>
                         :
                         ""
                        }
                        </div>
                        { 
                          this.props.currentId ?
                            (permAddress.editStatus == "Open" || permAddress.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                            <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 noProfilePadding">                          
                              <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Address" data-toggle="modal" onClick={this.editPermanaantAddress.bind(this)} data-target={"delPermanentAddrInfo-"+index}></i>
                              <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"permAddressModal-"+index} id={permAddress.permanentAddressId} onClick={this.editPermanaantAddress.bind(this)} style={{marginRight: '10' + 'px'}}></i>
                            </div>
                            :
                              permAddress.verifiedStatus == 'Approved' && permAddress.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                               {/*<a href={permAddress.report} target="_blank">
                                 <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                                </a>*/}
                              </div>
                            :
                            ""
                          :
                          permAddress.editStatus == "Open" || permAddress.editStatus == "Reopen" ?
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 noProfilePadding">                          
                              <i className="fa fa-trash edit-pencil pull-right add-btn" title="Delete Address" data-toggle="modal" onClick={this.editPermanaantAddress.bind(this)} data-target={"delPermanentAddrInfo-"+index}></i>
                              <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"permAddressModal-"+index} id={permAddress.permanentAddressId} onClick={this.editPermanaantAddress.bind(this)} style={{marginRight: '10' + 'px'}}></i>
                            </div>
                          :
                          permAddress.editStatus == "Block" &&  permAddress.verifiedStatus != 'Approved' ?
                            <div className="col-lg-3 col-md-3 col-sm-2 col-xs-12 noProfilePadding">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                  Order No <span className="pull-right">:</span>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                  <p>{permAddress.orderNo}</p>
                                </div>
                              </div>
                             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                  Status <span className="pull-right">:</span>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                  <p>{permAddress.verifiedStatus}</p>
                                </div> 
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                  Order Date <span className="pull-right">:</span>
                                </div>                                    
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                  <p>{moment(permAddress.orderDate).format("DD/MM/YYYY")}</p>
                                </div>  
                              </div>  
                            </div>
                             :
                            permAddress.verifiedStatus == 'Approved' && permAddress.editStatus == "Block" ?
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-1"> 
                             {/*<a href={permAddress.report} target="_blank">
                               <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                              </a>*/}
                            </div>
                          :

                          "" 
                        }
                      </div>
                      <div className="modal fade" id={"delPermanentAddrInfo-"+index} role="dialog">
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
                      <div className="modal fade" id={"permAddressModal-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <br/>
                                <div className="row">
                                  <h4 className="text-center">Edit Permanent Address</h4>                 
                                  <br/>
                                  <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"permanentAddressForm-" + index}>
                                    <PermanentAddress  id={this.props.userprofile._id} permanentAddressValues={permAddress} indexVal={index} />
                                  </form>
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
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                        <span>Please Add Your Permanent Address</span>
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                      </div>
                    </div> 
                  :
                  <p>No data available.</p> 
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                    <span>Please Add Your Permanent Address</span>
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                  </div>
                </div> 
              }
              </div>        
            </div> 
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Current Address</h5>
                {
                  FlowRouter.current().path == "/viewProfile/"+this.props.currentId ?
                    Meteor.userId() == this.props.currentId ?
                      <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newAddCurrentAddressModal.bind(this)}></i>              
                    :
                    ""
                  :
                  <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newAddCurrentAddressModal.bind(this)}></i>              
                }  
              </div> 
              <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" >
                { this.props.currentAddress.length > 0 ?
                  this.props.currentAddress.map((currentAddress,index)=>{
                    return(
                      currentAddress == null ?
                        <div key={index}> 
                        </div>
                      :
                      <div key={index}> 
                        <div className={currentAddress.editStatus == "Block" ? "col-lg-12 col-md-12 col-sm-12 col-xs-12 blockedverficationData outerPermanentAddress" :"col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress"}>
                          { FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ?
                             ""
                            : 
                             currentAddress.editStatus == "Block" ?
                              <div className="col-lg-1 col-md-1 col-sm-1 hidden-xs noProfilePadding">
                              </div>
                             :  
                            <div className={"col-lg-1 col-md-1 col-sm-1 col-xs-12 outerpaddingForMobile"+currentAddress.chkid}>
                              <input type="checkbox" className="reqInfocheck" name="permanentAddressCheck" data-index={index} checked={currentAddress.value} id={currentAddress.chkid} value={"Current Address : "+currentAddress.currentAddressId} data-present="AddressForm" onChange={this.handleChangeCurrentAddr.bind(this)}/>
                            </div>
                          }
                          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-3 noProfilePadding">
                            <div className={currentAddress.editStatus == "Reopen" ? "reOpenedu-box": currentAddress.editStatus == "Block" ? "blockEdu-box" : "edu-box"}>
                              <i className={currentAddress.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : currentAddress.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : currentAddress.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                              title={currentAddress.verifiedStatus == 'In Process' ? "Verification is in process." : currentAddress.verifiedStatus == 'Reject' ? "Verification is rejected." : currentAddress.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                            </div>
                          </div>
                          <div className={ FlowRouter.current().path == "/viewProfile/"+this.props.currentId || this.props.currentUrl == 'profileForms' ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : currentAddress.editStatus == "Block" ? "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" : "edu-university col-lg-6 col-md-6 col-sm-6 col-xs-7 outerrightpaddingForMobile" }>
                            <span className="pull-left"> {currentAddress.tempLine1} {currentAddress.tempLine2 ? ', ' + currentAddress.tempLine2 : ""} {currentAddress.tempLine3 ? ', ' + currentAddress.tempLine3 : ""} {currentAddress.tempLandmark ? ', ' +  currentAddress.tempLandmark : ""} {currentAddress.tempCity ? ', ' +  currentAddress.tempCity : ""} {currentAddress.tempState ? ', ' + currentAddress.tempState : ""} {currentAddress.tempCountry ? ', ' + currentAddress.tempCountry : ""} {currentAddress.tempPincode}</span><br />
                            <span className="year">{currentAddress.tempresidingFrom ? moment(currentAddress.tempresidingFrom,'DD/MM/YYYY').format('DD/MM/YYYY') + ' - ' : ""}{currentAddress.tempresidingTo ? currentAddress.tempresidingTo == 'Present' ? currentAddress.tempresidingTo : moment(currentAddress.tempresidingTo,'DD/MM/YYYY').format('DD/MM/YYYY') : ""}</span><br/>
                            <span className="year text-success">{currentAddress.ticketStatus ? "Verification Status: "+currentAddress.ticketStatus : ""}</span>               
                            {currentAddress.editStatus == "Reopen" ?
                               <span className="remarkafterReopen noProfilePadding col-lg-12 col-sm-12 col-xs-12 col-md-12">Remark : {currentAddress.remark}</span>
                             :
                             ""
                            }
                          </div>
                          { 
                            this.props.currentId ?
                              (currentAddress.editStatus == "Open" || currentAddress.editStatus == "Reopen") && Meteor.userId() == this.props.currentId ?
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-2 noProfilePadding"> 
                                  <i className="fa fa-trash edit-pencil add-btn pull-right" title="Delete Address" onClick={this.editCurrentAddress.bind(this)} data-toggle="modal" data-target={"delCurrentAddrInfo-"+index}></i>
                                  <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"currentAddressModal-"+index} id={currentAddress.currentAddressId} onClick={this.editCurrentAddress.bind(this)} style={{marginRight: '10' + 'px'}}></i>
                               </div>
                                :
                                 currentAddress.verifiedStatus == 'Approved' && currentAddress.editStatus == "Block" && Meteor.userId() == this.props.currentId ?
                                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">                          
                                   {/*<a href={currentAddress.report} target="_blank">
                                     <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                                    </a>  */}                            
                                  </div>
                                :
                                ""
                            :
                            currentAddress.editStatus == "Open" || currentAddress.editStatus == "Reopen" ?
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-2 noProfilePadding"> 
                                <i className="fa fa-trash edit-pencil add-btn pull-right" title="Delete Address" onClick={this.editCurrentAddress.bind(this)} data-toggle="modal" data-target={"delCurrentAddrInfo-"+index}></i>
                                <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"currentAddressModal-"+index} id={currentAddress.currentAddressId} onClick={this.editCurrentAddress.bind(this)} style={{marginRight: '10' + 'px'}}></i>
                              </div>
                            :
                            currentAddress.editStatus == "Block" &&  currentAddress.verifiedStatus != 'Approved' ?
                              <div className="col-lg-3 col-md-3 col-sm-2 col-xs-112 noProfilePadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                    Order No <span className="pull-right">:</span>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                    <p>{currentAddress.orderNo}</p>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                    Status <span className="pull-right">:</span>
                                  </div>                                    
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                    <p>{currentAddress.verifiedStatus}</p>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding statusBlockLabel text-left">
                                    Order Date <span className="pull-right">:</span>
                                  </div>                                    
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 statusBlockLabel nopadRight text-left">
                                    <p>{moment(currentAddress.orderDate).format("DD/MM/YYYY")}</p>
                                  </div> 
                                </div>
                              </div>
                              :
                              currentAddress.verifiedStatus == 'Approved' && currentAddress.editStatus == "Block" ?
                              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-1">                          
                                {/*<a href={currentAddress.report} target="_blank">
                                 <i className="fa fa-file edit-pencil pull-right add-btn" title="Download Report" ></i>
                                </a>   */}                           
                              </div>
                            :
                            ""
                          }                        
                        </div> 
                        <div className="modal fade" id={"delCurrentAddrInfo-"+index} role="dialog">
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
                         <div className="modal fade" id={"currentAddressModal-"+index} role="dialog">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <br/>
                                  <div className="row">
                                    <h4 className="text-center">Edit Current Address</h4>   
                                    <br/>
                                    <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"currentAddressForm-"+index}>
                                     <CurrentAddress  id={this.props.userprofile._id} currentAddressValues={currentAddress} indexVal={index} />
                                    </form>
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
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                             <span>Please Add Your Current Address</span>
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                        </div>
                      </div> 
                    :
                    <p>No data available.</p>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                         <span>Please Add Your Current Address</span>
                    </div>
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                    </div>
                  </div> 
                }
              </div>        
            </div> 

            
           <div className="modal fade" id="permaddAddressModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <br/>
                    <div className="row">
                      <h4 className="text-center">Add Permanent Address</h4>                 
                      <br/>
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addPermanentAddressForm">
                        <PermanentAddress key={this.props.proofPerAddrData._id + 'editPermanentAddr'} proofPerAddrData={this.props.proofPerAddrData}/>
                      </form>
                    </div>
                  </div> 
                </div> 
              </div>
           </div> 
            <div className="modal fade" id="currentaddAddressModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-body">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <br/>
                      <div className="row">
                        <h4 className="text-center">Add Current Address</h4>                 
                        <br/>
                        <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addCurrentAddressForm">
                          <CurrentAddress key={this.props.proofCurrAddrData._id + 'editCurrentAddr'} proofCurrAddrData={this.props.proofCurrAddrData}/>
                        </form>
                      </div>
                    </div> 
                  </div> 
                </div>
            </div> 
          </div> 
       </div>
      );  
  }
  render(){
    // console.log(this.props.profileId);
    if (!this.props.loading1) {
     return (
        <div>
          {this.requiredAddressInformation()}
        </div>
      );  
    }else{
      return(
        <span></span>
      );
    }
  }
}
addrRequiredContainer = withTracker(props => {
  // console.log('props: ',this.props);
    var _id = props.profileId;
    var id  = Meteor.userId();
    // console.log("_id",_id);
    const postHandle1 = Meteor.subscribe('userprofile',Meteor.userId());
    const postHandle  = Meteor.subscribe('TempProofDocs',Meteor.userId());
    if(props.permanentAddress){
      var permanentAddress = props.permanentAddress;
    }else{
      var permanentAddress = [];
    }
    if(props.currentAddress){
      var currentAddress   = props.currentAddress;
    }else{
      var currentAddress   = [];
    }
    const userprofile      = UserProfile.findOne({"_id" : _id});
    const loading  = !postHandle.ready();
    const loading1 = !postHandle1.ready();
    const proofPerAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    // console.log("proofObj" ,proofObj);
    const proofCurrAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    // console.log("proofData" ,proofData);
    // if(_id){
      // console.log("permanentAddress",permanentAddress);
      console.log("currentAddress :",currentAddress);
      return {
          loading1 : loading1,
          userprofile : userprofile,
          // reqPermnentAddress : reqPermnentAddress,
          // reqCurrentAddress  : reqCurrentAddress,
          permanentAddress  : permanentAddress,
          currentAddress  : currentAddress,
          proofPerAddrData,
          proofCurrAddrData,
          loading,
      };
    // }
})(AddressRequired);
export default addrRequiredContainer;
