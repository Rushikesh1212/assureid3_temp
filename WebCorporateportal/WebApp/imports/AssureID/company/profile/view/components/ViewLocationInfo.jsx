import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import CompanyLocationsInfo from '/imports/AssureID/company/profile/forms/components/CompanyLocationsInfo.jsx';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

export default class ViewLocationInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  componentDidMount(){      
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
        $('#deleteCompanyLocationAtView-'+index).modal('hide');
        $('.modal-backdrop').hide();
      }
    });
  }

  render(){
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-map-marker col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Locations</span>
          <i className="fa fa-plus add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" title="Add Location" data-toggle="modal" data-target="#addLocationModal"></i>
        </div>
        { this.props.companyLocations ?
          this.props.companyLocations.length > 0 ?
            this.props.companyLocations.map((companyLocation,index)=>{
              return(
                <div key={index}> 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight outercompanyLocations">
                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                      <div className="edu-box">
                        <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pinImage3.png" className="college-img"/>
                      </div>
                    </div>
                    <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                      <span className="year"><b>{companyLocation.companyLine1} {companyLocation.companyLine2 ? ', ' + companyLocation.companyLine2 : ""} {companyLocation.companyArea ? ', ' + companyLocation.companyArea : ""}</b></span>
                      <span className="year"><b> {companyLocation.companyCity ? ', ' + companyLocation.companyCity : ""} {companyLocation.companyState ? ', ' +companyLocation.companyState : ""} {companyLocation.companyCountry ? ', ' + companyLocation.companyCountry : "" } {companyLocation.companyPincode}</b></span><br />
                      <span className="year"><b>Incharge : { companyLocation.companyIncharge ?  companyLocation.companyIncharge : "-" }</b></span>
                    </div>
                    <div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                        <i className="fa fa-pencil pull-right add-btn" title="Edit Location" data-toggle="modal" data-target={"editlocationModalAtView-"+index} id={companyLocation.companyLocationsId} onClick={this.editDeleteLocations.bind(this)}></i>
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                        <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <i className="fa fa-trash edit-pencil pull-right" title="Delete Location" data-toggle="modal" onClick={this.editDeleteLocations.bind(this)} data-target={"deleteCompanyLocationAtView-"+index}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal fade" id={"deleteCompanyLocationAtView-"+index} role="dialog">
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
                  <div className="modal fade" id={"editlocationModalAtView-"+index} role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-body">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <br/>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h4 className="text-center">Edit Company Location</h4>
                                <CompanyLocationsInfo key={this.props.companyProfileId +'-locationEdit'}  id={this.props.companyProfileId} companyLocationsValues={companyLocation} indexVal={index} companyLocationEdit="companyLocationEdit" />
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
           <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewMarginBottom">Please Add Your Locations</span>
          :
           <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewMarginBottom">Please Add Your Locations</span>
        }
        <div className="modal fade" id="addLocationModal" role="dialog">
           <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <br/>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Company Location</h4>
                    <CompanyLocationsInfo key={this.props.companyProfileId +'-locationAdd'}  id={this.props.companyProfileId} companyLocationAdd="companyLocationAdd" />
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