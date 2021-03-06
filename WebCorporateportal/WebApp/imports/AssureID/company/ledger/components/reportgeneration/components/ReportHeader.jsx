import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {Router, Route, browserHistory} from 'react-router';
import { UserProfile } from '/imports/AssureID/user/api/userProfile.js';
import { TicketMaster } from '/imports/AssureID/company/newRequest/api/TicketMaster.js';
import ReportGeneration from './ReportGeneration.jsx';

class ReportHeader extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  } 
  //create pdf 
  createPDF(){
    var outerReport = $('#outerReport'),
    cache_width     = outerReport.width();
    // a4              =[850,  2000];  // for a4 size paper width and height
    this.getCanvas().then(function(canvas){
    var img = canvas.toDataURL("image/png"),
    doc     = new jsPDF({
          orientation : 'portrait',
            unit:'px', 
            format:'a4',
          });
          doc.setFontSize(16); 
          var width           = doc.internal.pageSize.width; 
          var height          = doc.internal.pageSize.height;
          var imgHeight       = canvas.height * width / canvas.width;
          var heightLeft = imgHeight;
          var position = 0;

          doc.addImage(img, 'PNG', 0, position, width, imgHeight);
          heightLeft -= height;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(img, 'PNG', 0, position, width, imgHeight);
            heightLeft -= height;
          }
          doc.save('Report.pdf');
          outerReport.width(cache_width);
   });
  }
    // create canvas object
  getCanvas(){ 
    var outerReport = $('#outerReport'),
    cache_width     = outerReport.width(),
    a4              = [850,  2000];  // for a4 size paper width and height
   // outerReport.width(cache_width).css('max-width','none');
   return html2canvas(outerReport,{
       imageTimeout:2000,
       useCORS : true,
       removeContainer:true
      }); 
  }
  downloadReportaspdf(event){
    event.preventDefault();
     this.createPDF();
  }
  componentDidMount(){      
  }

  render(){
    if (!this.props.loading) {
      return (
        <div >
          <div className={this.props.url == 'reportHeader' ? "col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 reportHeaderBoxShadow" : "col-lg-12 col-md-12 col-sm-12 col-xs-12 reportHeaderBoxShadowQTL"} id="outerReport">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding generationHeader"> 
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pull-left">
                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/Assure-ID-logo-Grey.png" className="generationImg"  />
              </div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 outerpdficon">
                <i className="fa fa-file-pdf-o pull-right fa-2x pdf-icon" title="Download as pdf" onClick={this.downloadReportaspdf.bind(this)}></i>
              </div>
            </div>
             <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12 outerUserData">
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                    { this.props.userProfile.userProfile ?
                      <img src={this.props.userProfile.userProfile } className="reportUserImage" /> : 
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/userIcon.png" className="reportUserImage" />
                    }               
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userName">
                        <h5>{this.props.userProfile.firstName} {this.props.userProfile.lastName}</h5>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left  userLabel">
                      Assure ID <span className="pull-right">:</span>
                      </div> 
                      <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                        <p>&nbsp;{this.props.userProfile.assureId ? this.props.userProfile.assureId : "-"}</p>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                     Mobile <span className="pull-right">:</span>
                      </div> 
                      <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                      {/* <p>{this.state.userDetails.emails[0].address}</p> */}
                        <p>{this.props.userProfile.mobileNo ? "+91"+this.props.userProfile.mobileNo : "-"}</p>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                      Email Id <span className="pull-right">:</span>
                      </div> 
                      <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                        <p>{this.props.userProfile.emailId ? this.props.userProfile.emailId : "-"}</p>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                      Age<span className="pull-right">:</span>
                      </div> 
                       <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                        <p>{this.props.userProfile.dateOfBirth ? this.props.userProfile.dateOfBirth +" Years" : "-"}</p>
                        
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                      Gender <span className="pull-right">:</span>
                      </div> 
                      <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                        <p className="genName">{this.props.userProfile.gender ? this.props.userProfile.gender : ""}</p>
                      </div>
                    </div>
                  
                  </div>
             </div>
             <div className={"col-lg-5 col-md-5 col-sm-12 col-xs-12 outerUserData reportGeneratedStatus "+this.props.textColor}>
                <h3>Status  : {this.props.getTicket.reportGenerated.documents.status}</h3>
             </div>
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
            <ReportGeneration ticketId={this.props.ticketId} />
            </div>
          </div>
          {
            this.props.url == 'reportHeader' ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reportEndFooter">
                <span className="col-lg-2 col-lg-offset-5 endReportFooter">End of Report</span>
              </div>
            :
                null
          }
          
        </div>
      );
    }else{
      return(
        <span>loading</span>
        );
    }
  }
}
export default ReportHeaderContainer = withTracker(({params}) => {
  var curUrl = location.pathname;
  var id = curUrl.split('/').pop();
  
  var handleSinTick = Meteor.subscribe("singleTicket",id);
  var handleUseFunc = Meteor.subscribe('userfunction');
  var handleUserProfile = Meteor.subscribe("userProfileData");
  var ticketId  = id;
  var loading   = !handleSinTick.ready() && !handleUseFunc.ready() && !handleUserProfile.ready();
  var getTicket = TicketMaster.findOne({"_id":ticketId});
  
  if(getTicket){
    var statusTicketArr = getTicket.reportGenerated.documents.status.split('-');
    if(statusTicketArr[1]){
      var statusTicket = statusTicketArr[1];
    }else{
      var statusTicket = getTicket.reportGenerated.documents.status;
    }
    getTicket.reportGenerated.documents.status = statusTicket;
    if (statusTicket == 'Not Verified' || statusTicket == "Cancelled" || statusTicket == "Stop Checked") {
      var textColor = 'blackColorDiv';
    }else if (statusTicket == "Clear" ) {
      var textColor = 'text-success';
    }else if (statusTicket == "Major Discrepancy"  ) {
        var textColor = 'redColorDiv';
    }else if (statusTicket == "Minor Discrepancy") { 
      var textColor = 'orangeColorDiv';
    }else if (statusTicket == 'Unable to Verify' || statusTicket == "Inaccessible") {
      var textColor = 'amberColorDiv';
    }else if (statusTicket == "Initiated" || statusTicket == "WIP") {
      var textColor = 'text-primary';
    }else{
      var textColor = 'text-primary';
    }
    var user = Meteor.users.findOne({"_id": getTicket.userId}) || {};

    if(user){
      var userProfile = UserProfile.findOne({"userId": getTicket.userId}) || {};
      if(userProfile.dateOfBirth){
        var today = new Date();
        var birthDate = new Date(userProfile.dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
            age--;
        }
        userProfile.dateOfBirth=age;
      }else{
        userProfile.dateOfBirth='-';
      } 
    }  
    //------------------------------------------------------------------------------
  }   

  // var currentLocation = browserHistory.getCurrentLocation();
  var currentLocation = window.location.href;
  


  var splitUrl = currentLocation.split('/');
  
  var url = splitUrl[3];
  
  return {
    loading,
    getTicket,
    user,
    userProfile,
    ticketId,
    statusTicket,
    textColor,
    url
  };
})(ReportHeader);