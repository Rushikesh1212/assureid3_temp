import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile }from '/imports/AssureID/company/profile/api/companyProfile.js';
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";
import PaymentMode from '/imports/AssureID/company/profile/forms/components/PaymentMode.jsx';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

class ViewSettingsInfo extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  } 
  componentDidMount(){      
  }
  // paymentBy(data){
  //  this.setState(data);
  // }
  render(){
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12 horizontalLine"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-cog col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Settings</span>
          {/*<i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" title="Edit Payment Mode" data-toggle="modal" data-target="#editPaymentModal"></i>
            <div className="modal fade" id="editPaymentModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-body">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <br/>
                    <div className="row">
                      <h4 className="text-center">Change Payment Mode</h4>
                        <form>
                          <div className="col-lg-12 col-md-12 changepersonFormWrapper">
                            <PaymentMode paymentBy={this.paymentBy.bind(this)} paymentValues={this.props.location.paymentBy}/>
                          </div>
                        </form>
                    </div>
                  </div> 
                </div> 
              </div>
            </div> */}
        </div>
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins companyMarginBottomZero">
            <label>Payment By</label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  nopadLeft nopadRight">
              <p className="year companyMarginBottomZero">{this.props.location ? this.props.location.paymentBy : ""}</p>
           
{/*               <PaymentMode companyId={this.props.location._id} paymentValues={this.props.location.paymentBy}/>
*/}            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companySettingsMargins">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadLeft nopadRight">
              <label>Authorize Person</label>              
            </div>
           {this.props.authorizedPerson ?
               this.props.authorizedPerson.length > 0 ?
                  this.props.authorizedPerson.map((authorizedPerson,i)=>{
                    return(
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerBlockofautherized" key={i}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewSettingsInfo">                        
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyEmployees nopadRight">
                            <i className="fa fa-user viewIcon col-lg-1 col-md-1 col-sm-1 col-xs-1 nopadLeft nopadRight"></i><p className="col-lg-11 col-md-11 col-sm-11 col-xs-11 year  nopadLeft nopadRight">{authorizedPerson.accessPersonName ? authorizedPerson.accessPersonName : "-"}</p>
                            <i className="fa fa-envelope viewIcon col-lg-1 col-md-1 col-sm-1 col-xs-1 nopadLeft nopadRight"></i><p className="col-lg-11 col-md-11 col-sm-11 col-xs-11 year nopadLeft nopadRight">{authorizedPerson.address ? authorizedPerson.address : "-"}</p>
                            <i className="fa fa-phone viewIcon col-lg-1 col-md-1 col-sm-1 col-xs-1 nopadLeft nopadRight"></i><p className="col-lg-11 col-md-11 col-sm-11 col-xs-11 year nopadLeft nopadRight">{authorizedPerson.accessPersonContact ? authorizedPerson.accessPersonContact : "-"}</p>
                            <i className="fa fa-briefcase viewIcon col-lg-1 col-md-1 col-sm-1 col-xs-1 nopadLeft nopadRight"></i><p className="col-lg-11 col-md-11 col-sm-11 col-xs-11 year nopadLeft nopadRight">{authorizedPerson.accessPersonDesignation ? authorizedPerson.accessPersonDesignation : "-"}</p>
                            <i className="fa fa-id-card viewIcon col-lg-1 col-md-1 col-sm-1 col-xs-1 nopadLeft nopadRight"></i><p className="col-lg-11 col-md-11 col-sm-11 col-xs-11 year nopadLeft nopadRight">{authorizedPerson.accessPersonAddress ? authorizedPerson.accessPersonAddress : "-"}</p>
                          </div>
                        </div>
                      </div>
                      );
                  })
                :
                <span>No authorized person! Please add authorized person.</span>
              :
              <span>No authorized person! Please add authorized person.</span>
            }
          </div>
        </div>
      </div>
    );
  }
}
ViewSettingsInfoContainer = withTracker(props => {
  var _id = props.companyProfileId;
  var assureid = props.assureId;
  const postHandle = Meteor.subscribe('companyProfileData',assureid);
  const userHandle = Meteor.subscribe('allUserProfileData');
  var location     = CompanyProfile.findOne({"companyAssureID": assureid});
  
  var authorizedPerson = props.spocperson;
  
  //  if(location){ 
  //    if (location.authorizedPerson) {
  //       for (var i = 0; i < location.authorizedPerson.length; i++) {
  //         if (location.authorizedPerson[i].role == "companyAdmin") {

  //           var user = UserProfile.findOne({"_id": location.authorizedPerson[i].userId});
  //           if (user) {
  //             if (user.userProfile) {
  //               if (user.userProfile != '') {
  //                 var userImage = user.userProfile;
  //                 var userFileName = user.userFileName;
  //                 var userFileExt  = user.userFileExt;
  //               }else{
  //                  var userImage    = 'https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png';
  //                  var userFileName = '';
  //                  var userFileExt  = '';
  //               }
  //             }else{
  //               var userImage    = 'https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png';
  //                var userFileName = '';
  //                var userFileExt  = '';
  //             }
                
  //                authorizedPerson.push({
  //                 "empId"        : location.authorizedPerson[i].empId,
  //                 "userId"       : location.authorizedPerson[i].userId,
  //                 "assureId"     : location.authorizedPerson[i].assureId,
  //                 "Name"         : location.authorizedPerson[i].Name,
  //                 "emailId"      : location.authorizedPerson[i].emailId,
  //                 "mobileNo"     : location.authorizedPerson[i].mobileNo,
  //                 "userImage"    : userImage,
  //                 "userFileName" : userFileName,
  //                 "userFileExt"  : userFileExt,
  //               });
              
  //           } 
  //         }
  //       }
  //    }
  //  }
     // 

  const loading    = !postHandle.ready();
  return {
    loading,
    location,
    authorizedPerson,
  };
})(ViewSettingsInfo);
export default ViewSettingsInfoContainer;