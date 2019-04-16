import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import CompanyLocationsInfo from "./CompanyLocationsInfo.jsx";

class ListOfCompanyLocation extends TrackerReact(Component){
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

  editDeleteLocations(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
  deleteLocations(event){
    event.preventDefault();
    var id    = $(event.currentTarget).attr('data-id');
    var index = parseInt($(event.currentTarget).attr('data-index'));
    Meteor.call("removecompanyLocations",id,index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#deleteCompanyLocation-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }
   
  render(){
    return(
      <div>
        { 
          this.props.companyLocations.length > 0 ?
            <div>
              <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-map-marker col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Locations</span>
              </div> 
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
                  { this.props.companyLocations ?
                    this.props.companyLocations.length > 0 ?
                      this.props.companyLocations.map((companyLocation,index)=>{
                        return(
                          <div  key={index}> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outercompanyLocations">
                              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
{/*                                <i className={companyLocation.verifiedStatus == 'In Process' ? "fa fa-exclamation-triangle faStatus fa-lg text-warning" : companyLocation.verifiedStatus == 'Reject' ? "fa fa-times-circle faStatus fa-lg text-danger" : companyLocation.verifiedStatus == 'Approved' ? "fa fa-check-circle faStatus fa-lg text-success" : ""}
                                 title={companyLocation.verifiedStatus == 'In Process' ? "Verification is in process." : companyLocation.verifiedStatus == 'Reject' ? "Verification is rejected." : companyLocation.verifiedStatus == 'Approved' ? "Verified" : ""}></i>
*/}                                
                                <div className="edu-box">
                                  <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                                </div>
                              </div>
                              <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                <span className="year"><b>{companyLocation.companyLine1} {companyLocation.companyLine2 ? ', ' + companyLocation.companyLine2 : ""} {companyLocation.companyArea ? ', ' + companyLocation.companyArea : ""}</b></span>
                                <span className="year"><b>  {companyLocation.companyCity ? ', ' + companyLocation.companyCity : ""} {companyLocation.companyState ? ', ' +companyLocation.companyState : ""} {companyLocation.companyCountry ? ', ' + companyLocation.companyCountry : "" } {companyLocation.companyPincode}</b></span><br />
                                {companyLocation.companyIncharge != "" ?<span className="year"><b>Incharge : { companyLocation.companyIncharge }</b></span> : ""}
                              </div>
                              <div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                                  <i className="fa fa-pencil pull-right add-btn" title="Edit Location" data-toggle="modal" data-target={"editlocationModal-"+index} id={companyLocation.companyLocationsId} onClick={this.editDeleteLocations.bind(this)}></i>
                                </div>
                                <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                                  <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <i className="fa fa-trash edit-pencil pull-right" title="Delete Location" data-toggle="modal" onClick={this.editDeleteLocations.bind(this)} data-target={"deleteCompanyLocation-"+index}></i>
                                  </div>
                                </div>
                              </div> 
                            </div> 
                            <div className="modal fade" id={"deleteCompanyLocation-"+index} role="dialog">
                              <div className="modal-dialog">
                                <div className="modal-content">
                                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <p className="">Do you want to delete this data?</p>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                      <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" data-id={this.props.companyProfileId} onClick={this.deleteLocations.bind(this)} data-index={index}>Yes</button>
                                      &nbsp;&nbsp;
                                      <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                  </div>
                                </div>  
                              </div>
                            </div>
                            <div className="modal fade" id={"editlocationModal-"+index} role="dialog">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-body">
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                      <br/>
                                      <div className="row">
                                        <h4 className="text-center">Edit Company Location</h4>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <CompanyLocationsInfo key={this.props.companyProfileId+"viewLocationsCompany"}  id={this.props.companyProfileId} companyLocationsValues={companyLocation} indexVal={index} />
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
                     <span>Please Add Your Locations</span>
                    :
                     <span>Please Add Your Locations</span>
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
ListOfCompanyLocationContainer = withTracker(props => {
  var _id = props.companyProfileId;
  if(props.companyLocations){
    if(props.companyLocations.length>0){
      var companyLocations = props.companyLocations;
    }
  }else{
    var companyLocations = [];
  }

  companyLocations = _.without(companyLocations,null);
  return {
    companyLocations  : companyLocations,
  };
})(ListOfCompanyLocation);
export default ListOfCompanyLocationContainer;