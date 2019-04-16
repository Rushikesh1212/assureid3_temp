import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import PermanentAddress from "/imports/AssureID/userPortal/profile/forms/components/PermanentAddress.jsx";
import CurrentAddress from "/imports/AssureID/userPortal/profile/forms/components/CurrentAddress.jsx";

class ListAddress extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "subscription" : {
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  editCertificate(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show'); 
  }
  deleteAcademics(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removePermanentAddress",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#deletePermanentAddrInfo-'+index).modal('hide');
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
        $('#deleteCurrentAddrInfo-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }

  render(){
    return(
      <div>
        { 
          this.props.permanentAddress.length > 0 || this.props.currentAddress.length > 0 ?
            <div>
              <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-id-card col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Address Information</span>
              </div> 
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <h5 className="pull-left">Permanent Address</h5>
                  </div>  
                  { this.props.permanentAddress ?
                    this.props.permanentAddress.length > 0 ?
                      this.props.permanentAddress.map((permAddress,index)=>{
                        return(
                          <div  key={index}> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                                <i className={permAddress.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : permAddress.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : permAddress.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                                 title={permAddress.verifiedStatus == 'In Process' ? "Verification is in process." : permAddress.verifiedStatus == 'Reject' ? "Verification is rejected." : permAddress.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                                <div className="edu-box">
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                                </div>
                              </div>
                              <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <span className="pull-left"> {permAddress.line1} {permAddress.line2 ? ', ' + permAddress.line2 : ""} {permAddress.line3 ? ', ' + permAddress.line3 : ""} {permAddress.landmark ? ', ' + permAddress.landmark : ""} {permAddress.city ? ', ' +permAddress.city : ""} {permAddress.state ? ', ' + permAddress.state : ""} {permAddress.country ? ', ' + permAddress.country : "" } {permAddress.pincode}</span><br />
                                <span className="year">{permAddress.residingFrom ? moment(permAddress.residingFrom).format('DD/MM/YYYY') + ' - ' : ""}{permAddress.residingTo ? permAddress.residingTo == 'Present' ? permAddress.residingTo : moment(permAddress.residingTo).format('DD/MM/YYYY') : ""}</span>                          
                              </div>
                              { 
                                permAddress.editStatus == "Open" || permAddress.editStatus == "Reopen" ?
                                  <div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                                      <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"permAddrModal-"+index} id={permAddress.permanentAddressId} onClick={this.editCertificate.bind(this)}></i>
                                    </div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                      <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <i className="fa fa-trash edit-pencil pull-right" title="Delete Address" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"deletePermanentAddrInfo-"+index}></i>
                                      </div>
                                    </div>
                                  </div>
                                :
                                ""
                              }
                            </div> 
                            <div className="modal fade" id={"deletePermanentAddrInfo-"+index} role="dialog">
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
                            <div className="modal fade" id={"permAddrModal-"+index} role="dialog">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-body">
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                      <br/>
                                      <div className="row">
                                        <h4 className="text-center">Edit Permanent Address</h4>
                                        <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"permanentAddrForm-" + index}>
                                         <PermanentAddress  id={this.props.profileId} permanentAddressValues={permAddress} indexVal={index} />
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
                     <span>Please Add Your Permanent Address</span>
                    :
                     <span>Please Add Your Permanent Address</span>
                  }
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <h5 className="pull-left">Current Address</h5>
                  </div>  
                  { this.props.currentAddress ?
                    this.props.currentAddress.length > 0?
                      this.props.currentAddress.map((currentAddress,index)=>{
                        return(
                          <div key={index}> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                                <div className="edu-box">
                                  <i className={currentAddress.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : currentAddress.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : currentAddress.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                                  title={currentAddress.verifiedStatus == 'In Process' ? "Verification is in process." : currentAddress.verifiedStatus == 'Reject' ? "Verification is rejected." : currentAddress.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                                </div>
                              </div>
                              <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <span className="pull-left"> {currentAddress.tempLine1} {currentAddress.tempLine2 ? ', ' + currentAddress.tempLine2 : ""} {currentAddress.tempLine3 ? ', ' + currentAddress.tempLine3 : ""} {currentAddress.tempLandmark ? ', ' +  currentAddress.tempLandmark : ""} {currentAddress.tempCity ? ', ' +  currentAddress.tempCity : ""} {currentAddress.tempState ? ', ' + currentAddress.tempState : ""} {currentAddress.tempCountry ? ', ' + currentAddress.tempCountry : ""} {currentAddress.tempPincode}</span><br />
                                <span className="year">{currentAddress.tempresidingFrom ? moment(currentAddress.tempresidingFrom).format('DD/MM/YYYY') + ' - ' : ""}{currentAddress.tempresidingTo ? currentAddress.tempresidingTo == 'Present' ? currentAddress.tempresidingTo : moment(currentAddress.tempresidingTo).format('DD/MM/YYYY') : ""}</span>                           
                              </div>
                              { 
                                currentAddress.editStatus == "Open" || currentAddress.editStatus == "Reopen" ?
                                  <div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                                      <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"currAddrModal-"+index} id={currentAddress.currentAddressId} onClick={this.editCertificate.bind(this)}></i>
                                    </div>
                                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                      <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <i className="fa fa-trash edit-pencil pull-right" title="Delete Address" onClick={this.editCertificate.bind(this)} data-toggle="modal" data-target={"deleteCurrentAddrInfo-"+index}></i>
                                      </div>
                                    </div>
                                  </div>
                                :
                                ""
                              }
                            </div> 
                            <div className="modal fade" id={"deleteCurrentAddrInfo-"+index} role="dialog">
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
                            <div className="modal fade" id={"currAddrModal-"+index} role="dialog">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-body">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <br/>
                                    <div className="row">
                                      <h4 className="text-center">Edit Current Address</h4>        
                                      <br/>
                                      <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"currentAddrForm-"+index}>
                                       <CurrentAddress  id={this.props.profileId} currentAddressValues={currentAddress} indexVal={index} />
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
                    <span>Please Add Your Current Address</span>

                    :
                    <span>Please Add Your Current Address</span>

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
addrRequiredContainer = withTracker(props => {
  var _id = props.profileId;
  if(props.permanentAddress){
    var permanentAddress =  _.without(props.permanentAddress,null);
  }else{
    var permanentAddress = [];
  }
  if(props.currentAddress){
    var currentAddress   = _.without(props.currentAddress,null);
  }else{
    var currentAddress   = [];
  }
  return {
    permanentAddress  : permanentAddress,
    currentAddress  : currentAddress,
  };
})(ListAddress);
export default addrRequiredContainer;