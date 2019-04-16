import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
// import UserInformation from './UserInformation.jsx';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra'; 
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { CodeAndReason } from '/imports/admin/adminDashboard/masterData/codeAndReason/api/CodeAndReason.js';
import { TempTicketReport } from "/imports/admin/caseManagement/api/TempUpload.js";
import { UserProfile } from '/imports/admin/userViewProfile/api/userProfile.js';
import { ChecklistFieldExpert } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import ServiceInformation from './ServiceInformation.jsx';
import VerifiedDocuments from './VerifiedDocuments.jsx';
import MultipleVerifiedDocuments from './MultipleVerifiedDocuments.jsx';
import DocumentStatus from './DocumentStatus.jsx';
import VerificationDataSubmit from './VerificationDataSubmit.jsx';
import ReportHeader from '/imports/admin/reportgeneration/components/ReportHeader.jsx';
import VerifyDetailsDocument from './VerifyDetailsDocument.jsx';
import SubmittedDocuments from './SubmittedDocuments.jsx';
import EmployementCompanyDetails from './EmployementCompanyDetails.jsx';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf'; 

class CaseDetail extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      'userDetails': {},
      "userRoleIn": Meteor.userId(),
      "showRejectBox" : 'N',
      "radioState":'',
      "showRadiobtn": 'N',
      "verifiedInfo":[],
     "searchArray"         : [],
       "subscription"     : {
        "codeAndReason" : Meteor.subscribe('codeAndReason'),
        "postNotifHandle" : Meteor.subscribe('notificationTemplate')
                }
    }   
    this.handleChangeForArray  = this.handleChangeForArray.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.loading){
      this.setState({
        'userDetails':nextProps.user,
      });
    }   
  }
  viewprofile(event){
    event.preventDefault();
    var path = $(event.target).attr('data-userid');
    browserHistory.replace('/admin/viewProfile/'+path);
  }
  getRole(role) {
    return role != "backofficestaff";
  }
  handleChangeForArray(event){
      event.preventDefault();
      const target = event.target;
      const name   = target.name;
      var index = $(event.currentTarget).attr('data-index');

     
      this.props.getTicket.reviewRemark[index].remark = event.target.value;

      this.setState({
       [name]: event.target.value,
      });
  }
  showRejectBoxState(){
    this.setState({"showRejectBox" : 'Y','showRadiobtn': "N"});
  }
  showTicketDataState(){
    this.setState({ showRadiobtn: "Y",showRejectBox : 'N'}, () => {
    }); 
  }
  getRejectBox(){
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 finalApprovewrap noLRPad">
        <textarea rows="3" cols="60" className="col-lg-8 col-lg-offset-0" id="rejectReason"/>
        <button onClick={this.rejectButton.bind(this)}
          id="rejectButton"
          className="col-lg-4 rejectSubmit">
          Submit </button>
      </div>
    )
  }
  rejectButton(event){
    event.preventDefault();
    var ticketId = this.props.ticketId;
    var elementLength = this.props.getTicket.ticketElement.length;
    switch(this.props.getTicket.ticketElement[elementLength-1].roleStatus){
      case 'Assign' :
        var roleStatus          = $('#TMRejectTicket').attr('data-rolestatus');
        var msg                 = $('#TMRejectTicket').attr('data-msg');
        var allocatedToUserid   = this.props.getTicket.ticketElement[elementLength-1].userId;
        var allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].userName;
        break;
      case 'ProofSubmit' :
        var roleStatus          = $('#TMProofReject').attr('data-rolestatus');
        var msg                 = $('#TMProofReject').attr('data-msg');
        var allocatedToUserid   = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserid;
        var allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserName;
        break;
      case 'VerificationPassQTMAllocated' :
        var roleStatus          = $('#QTMRejectTicket').attr('data-rolestatus');
        var msg                 = $('#QTMRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement; 
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'TMReviewRemark' });
        var allocatedToUserid   = teamMemberDetails.userId;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      case 'QAPassQTLAllocated' :
        var roleStatus          = $('#QTLRejectTicket').attr('data-rolestatus');
        var msg                 = $('#QTLRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement; 
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'VerificationPassQTMAllocated' });
        var allocatedToUserid   = teamMemberDetails.allocatedToUserid;
        var allocatedToUserName = teamMemberDetails.allocatedToUserName;
        break;
      case 'ReviewFail' :
        var roleStatus          = $('#QTMReRejectTicket').attr('data-rolestatus');
        var msg                 = $('#QTMReRejectTicket').attr('data-msg');
        var ticketElements      = this.props.getTicket.ticketElement; 
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'TMReviewRemark' });
        var allocatedToUserid   = teamMemberDetails.userId;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      default :
        break;
    }
    var insertData = {
      "userId"              : Meteor.userId(),
      "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
      "allocatedToUserid"   : allocatedToUserid,
      "allocatedToUserName" : allocatedToUserName,
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : roleStatus,
      "msg"                 : msg,
      "remark"              : $('#rejectReason').val(),
      "createdAt"           : new Date()
    }
    // 
    Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData);
    this.setState({"showRejectBox" : 'N'});
  }
  // get review by code event
  getReviewByCode(event){
    event.preventDefault();
    var ipvalue = $(event.currentTarget).val();
      if(ipvalue){
        var codeReview = CodeAndReason.findOne({"code" : ipvalue});
        if (codeReview) {
          var Review = codeReview.reason;
          $('#TMReviewRemark').val(Review);
        }
      }else{
        swal("Please enter message code");
      }
      
  } 
  getReviewByCodeToQTM(event){
    event.preventDefault();
    var ipvalue = $(event.currentTarget).val();
    if(ipvalue){    
      var codeReview = CodeAndReason.findOne({"code" : ipvalue});
      if (codeReview) {
        var Review = codeReview.reason;
        $('#QTMReviewRemark').val(Review);
      }
    }else{
      swal("Please enter message code");      
    }
  }
  getReviewByCodeToQTL(event){
    event.preventDefault();
    var ipvalue = $(event.currentTarget).val();
    if(ipvalue){        
      var codeReview = CodeAndReason.findOne({"code" : ipvalue});
      if (codeReview) {
        var Review = codeReview.reason;
        $('#QTLReviewRemark').val(Review);
      }
    }else{
      swal("Please enter message code");      
    }
  }
  // edit review
  editReview(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('id');
    $('#remarkWrapper-'+id).css({"display" : "none"});
     $('#textbox-'+id).css({"display" : "block"});
  }
  submitEditedReview(event){
    event.preventDefault();
    var ticketId = this.props.ticketId;
    // 
    var userId = $(event.currentTarget).attr('id');
    // 
    var index  = parseInt($(event.currentTarget).attr('data-index'));
    var remark = this.props.getTicket.reviewRemark[index].remark;
    // 
    Meteor.call('updateReviewRemark',ticketId,userId,remark,function(error,result){
      if (error) {
        
      }else{
        
        $('#remarkWrapper-'+userId).css({"display" : "block"});
        $('#textbox-'+userId).css({"display" : "none"});
      }
    });
  }
  /*Get radio value and display dropdown and textbox*/
  getRadioValue(event){
    // event.preventDefault();
    var radioValue = $('input[name=radioState]:checked').val();
    this.setState({
        'radioState':radioValue,
    });
  }
  showBAFEList(role){
    var teammemberDetails = Meteor.users.find({"roles": {$in:[role]},"profile.status":"Active"}).fetch(); 
    return teammemberDetails;
  }
  showTMQTMList(){
    var teammemQualityDetails = Meteor.users.find({"roles": {$in:["team member","quality team member"]}}).fetch();
    return teammemQualityDetails;
  }
  uploadDocsDiv(event){
    event.preventDefault();
    $('#AddImagesVideo').css({"display" : "block"});
    $(event.currentTarget).css({"display" : "none"});
    var data = this.props.checkObjs;
    if(data){
        var dataArr = [];
        for(var i=0; i<data.length;i++){
            var relatedField = data[i].relatedFields;
            var strngVal = "";
            for(var k=0;k<relatedField.length;k++){
              strngVal = strngVal + relatedField[k].dbField + ", ";                               
            }
            
        if(this.props.getTicket.submitedDoc){ 
            if(this.props.getTicket.submitedDoc.checkLists.length > 0 ){
              var obj = {
                titleVal : data[i].task,
                textVal :  this.props.getTicket.submitedDoc.checkLists.textVal,
                correctVal : this.props.getTicket.submitedDoc.checkLists.correctVal,
                remarkVal : this.props.getTicket.submitedDoc.checkLists.remarkVal,
              }
              dataArr.push(obj);
            }
          }else{
              
              var obj = {
                titleVal : data[i].task,
                textVal : relatedField,
                // textVal : [],
                correctVal : 'Incorrect',
                remarkVal : "",
              }    
              
            dataArr.push(obj);
          }
          this.setState({
            verifiedInfo: dataArr,
        })
      }  
    }
  }
  handleReportUpload(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var dataImg =event.currentTarget.files[0];
       
      if(dataImg){
        
            var imageFileName = dataImg.name;
            var splitName = imageFileName.split(".");
            var fileextension = splitName[1];
          if(fileextension == "pdf"){    
            $('#uploadReportShowprogress').addClass('showProgressBar');         
            var reader = new FileReader();      
              reader.onload = function (e) {         
            };     
            reader.readAsDataURL(event.currentTarget.files[0]);     
            var file = event.currentTarget.files[0];
            if (file){        
                    addReportFunction(file,self,fileextension);      
            }
          }else{
              swal({   
                position: 'top-right',    
                type: 'error',   
                title: 'Please Upload Report In Pdf Format',      
                showConfirmButton: false,     
                timer: 2000     
              }); 
              $('#uploadReport').val('');
          }
          };
          } else {
          swal({   
              position: 'top-right',    
              type: 'error',   
              title: 'Please select Video',      
              showConfirmButton: false,     
              timer: 1500     
          });  
      }
  }
  showTicketDataRadiobtn(){
    return(
      <div className="col-lg-9 col-lg-offset-3 col-md-11 col-sm-12 col-xs-12 finalstatuswrap">
        <label className="radio-inline">
          <input type="radio" name="ticketDataApproveReject" value ="Approved"/>Ticket Information Approve
        </label>
        <label className="radio-inline">
          <input type="radio" name="ticketDataApproveReject" value ="Reject"/>Ticket Information Reject
        </label>
        <div className="col-lg-8 col-lg-offset-4 finaldatasubmit">
          <button className="col-lg-5 rejectSubmit" data-rolestatus="ReviewPass" data-msg="Approved And Delivered Verification Report" onClick={this.approveButton.bind(this)}>Submit </button>
        </div>
      </div>
    )
  }
  buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
      return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
  }
  /*=========== Report Progressbar =============*/
  getUploadReportPercentage(){
    var uploadProgressPercent = Session.get("uploadReportProgressPercent");
    if(uploadProgressPercent){
        var percentVal = parseInt(uploadProgressPercent);
        if(percentVal){
            
            var styleC = {
                width:percentVal + "%",
                display:"block",
            }
            var styleCBar = {
                display:"block",
                marginTop:5,
            }
        }
        if(!percentVal){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
            }
            var styleCBar = {
                display:"none",
                marginTop:5,
            }
        }

        if(parseInt(percentVal)==100){
          setTimeout(()=>{ 
              Session.set("uploadReportProgressPercent",0); 
          }, 3000);    
        }

        return (
          <div className="progress"  style= {styleCBar}>
            <div className="progress-bar progress-bar-striped active" role="progressbar"
            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
              {percentVal} %
            </div>
          </div>
        );
    }
  }
  
  reportReSubmit(event){
    var exeQuery = 1;    
    event.preventDefault();
    var ticketId = this.props.ticketId;
    var insertData = {
      "userId"              : Meteor.userId(),
      "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : $(event.currentTarget).attr('data-rolestatus'),
      "msg"                 : $(event.currentTarget).attr('data-msg'),
      "allocatedToUserid"   : '',
      "allocatedToUserName" : '',
      "createdAt"           : new Date()
    }
    if(exeQuery == 1){
      Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData,(error,result)=>{
        if(result == 1){
          // $('#showReport').css('display','none');
        }
      });
    }    
  }
  approveButton(event){
    event.preventDefault();
    var flag=0;    
    var ticketId = this.props.ticketId;
    var elementLength = this.props.getTicket.ticketElement.length;
    var insertData = {
      "userId"              : Meteor.userId(),
      "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
      "role"                : Meteor.user().roles.find(this.getRole),
      "roleStatus"          : $(event.currentTarget).attr('data-rolestatus'),
      "msg"                 : $(event.currentTarget).attr('data-msg'),
      "createdAt"           : new Date()
    }
    var memberid ='';
    var memberName = '';
    var exeQuery = 1;
    switch(this.props.getTicket.ticketElement[elementLength-1].roleStatus){
      case 'screenTLAllocated' :
      case 'ReAssign' :
      case 'AssignReject' :
        if($("#selectTMMember option:selected").val() !="--Select--"){
          insertData.allocatedToUserid = $("#selectTMMember option:selected").val();
          insertData.allocatedToUserName = $("#selectTMMember option:selected").text();
        }else{
          swal({   
            position: 'top-right',    
            type: 'error',   
            title: 'Please select team member ',      
            showConfirmButton: false,     
            timer: 1500     
          });  
        }
        break;
      case 'Assign' :
      case 'ProofSubmit' :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'AssignAccept':
        if(($(event.currentTarget).attr('data-rolestatus') == 'FEAllocated') || ($(event.currentTarget).attr('data-rolestatus') == 'BAAllocated')){
            insertData.allocatedToUserid = $("#selectMember option:selected").val();
            insertData.allocatedToUserName = $("#selectMember option:selected").text();
         }else{
            insertData.allocatedToUserid = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserid;
            insertData.allocatedToUserName = this.props.getTicket.ticketElement[elementLength-1].allocatedToUserName;
        }
        break;
      case 'VerificationPass' :
      case 'VerificationPass-CompanyInfo' :
      case 'TMReviewSubRemark' :
        var id= event.target.id;
        /** validation for textarea*/
        var textAreaValue = $('#TMReviewRemark').val();
        if(id != "passtoqtm"){
          var nameRegex =/^[a-zA-Z0-9-_ ]+$/;
          if (textAreaValue==null||textAreaValue==""||!textAreaValue.match(nameRegex)){
            // $(".commonReviewRemark").addClass("ErrorRedText");
            // $(".commonReviewRemark").addClass("SpanLandLineRedBorder");
            // $( ".spanReviewRemark" ).text("Please enter a valid remark" );
            insertData.reviewRemark ="";
            swal("Please enter valid remark");
          }else{
            flag = 1;
            insertData.reviewRemark = textAreaValue;
            $('#anotherTMReview').hide();
            $('.modal-backdrop').hide();       
          }
        }
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'VerificationPassQTMAllocated' :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'QAPass' :
        // insertData.reviewRemark = $('#QTMReviewRemark').val();
        var flag=0;;       
        var textAreaValue = $('#QTMReviewRemark').val();
        var nameRegex =/^[a-zA-Z0-9-_ ]+$/;
        if(textAreaValue==null||textAreaValue==""||!textAreaValue.match(nameRegex)){
          insertData.reviewRemark = "";
          swal("Please enter valid remark");
        }else{
          flag = 1;
          insertData.reviewRemark = textAreaValue;
          $('#anotherTMReview').hide();
          $('.modal-backdrop').hide();       
        }

        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'QTMReviewRemark' :
        insertData.allocatedToUserid = "";
        insertData.allocatedToUserName = "";
        break;
      case 'QTLReviewRemark' :
        insertData.allocatedToUserid = "";
        insertData.allocatedToUserName = "";
        break;
      case 'QTMReviewRemark-GetUsrRemark' :     
        var textAreaValue = $('#QTMReviewRemark').val();
        var nameRegex =/^[a-zA-Z0-9-_ ]+$/;
          if(textAreaValue==null||textAreaValue==""||!textAreaValue.match(nameRegex)){
            // $(".commonReviewRemark").addClass("SpanLandLineRedBorder");
            // $( ".spanReviewRemark" ).text("Please enter a valid remark" );
            swal("Please enter valid remark");
            insertData.reviewRemark = "";
            
          }else{
            flag = 1;
            insertData.reviewRemark = textAreaValue;
            $('#anotherTMReview').hide();
            $('.modal-backdrop').hide();       
          }
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
      break;
      case 'QAFail' :
        if(!this.props.loading){
            var reportLinkDetails = TempTicketReport.findOne({},{sort:{'createdAt':-1}}); 
            if(reportLinkDetails){
              insertData.reportSubmited = reportLinkDetails.ReportLink;
            }
        }
        var ticketElements      = this.props.getTicket.ticketElement; 
        var teamMemberDetails   = ticketElements.find(function (obj) { return obj.roleStatus == 'QAFail' });
        var allocatedToUserid   = teamMemberDetails.userid;
        var allocatedToUserName = teamMemberDetails.userName;
        break;
      case 'QAPassQTLAllocated' :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'ReviewPass' :
        // insertData.reviewRemark = $('#QTLReviewRemark').val();
        var flag = 0;
        var textAreaValue = $('#QTLReviewRemark').val();
        var nameRegex =/^[a-zA-Z0-9-_  ]+$/;
          if(textAreaValue==null||textAreaValue==""||!textAreaValue.match(nameRegex)){
            // $(".commonReviewRemark").addClass("SpanLandLineRedBorder");
            // $( ".spanReviewRemark" ).text("Please enter a valid remark" );
            swal("Please enter valid value");
            insertData.reviewRemark = "";
            $('#QTLReviewRemark').val("");
        
            
          }else{
            flag = 1;
            insertData.reviewRemark = textAreaValue;
            $('#anotherTMReview').hide();
            $('.modal-backdrop').hide();       
          }
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'ReportReGenerated' :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
      case 'ReportReGenerated' :
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
      default : 
        insertData.allocatedToUserid   = '';
        insertData.allocatedToUserName = '';
        break;
     $('#closeTicketModal').modal('hide');
      // $("[class*='modal-backdrop fade in']").remove();
    }
    if('reviewRemark' in insertData){
        if(exeQuery == 1 && insertData.reviewRemark!=""){
          if(flag == 1){
            Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData);      
            if(this.props.getTicket.ticketElement[elementLength-1].roleStatus == 'QTMReviewRemark' || this.props.getTicket.ticketElement[elementLength-1].roleStatus == 'QTLReviewRemark'){
              var path = '/reportHeader/'+this.props.ticketId;
              window.open(path);
            }
          }else{
            swal("Please add correct remark");
          }
        }else{
          swal("Please Enter Valid remark");
          
        }          
    }else{
          Meteor.call('genericUpdateTicketMasterElement',this.props.ticketId,insertData);      
            if(this.props.getTicket.ticketElement[elementLength-1].roleStatus == 'QTMReviewRemark' || this.props.getTicket.ticketElement[elementLength-1].roleStatus == 'QTLReviewRemark'){
              var path = '/reportHeader/'+this.props.ticketId;
              window.open(path);
          }
    }
  }
  targetReport(){
    window.scrollBy(0, -300); 
  }
  editInformation(){
    window.scrollBy(0, -700);
  }
  deleteReport(event){
      event.preventDefault();
      var id = $(event.currentTarget).attr('id');
      Meteor.call('deleteReport',id,function (error,result) {
        if (error) {
          
        }else{
        // $('#showReport').css('display','block');
        }
      });
  }
  getTextValueWhenType(event){
    var textValue= $(event.target).val();
    if(textValue != ""){
      var RegExpBuildValue = this.buildRegExp(textValue); 
      // 
      var searchData = CodeAndReason.find({'code':RegExpBuildValue}).fetch();
      if(searchData){
        if($(event.target).hasClass('code')){
          var pluckCode = _.pluck(searchData,"code");
          var uniqueCode = _.uniq(pluckCode);
          this.setState({"searchArray":uniqueCode});
        }else if ($(event.target).hasClass('qtmcode')){
          var pluckqtmCode  = _.pluck(searchData,"code");
          var uniqueqtmCode = _.uniq(pluckqtmCode);
          this.setState({"searchArray":uniqueqtmCode});
        }else if ($(event.target).hasClass('qtlcode')) {
          var pluckqtlCode  = _.pluck(searchData,"code");
          var uniqueqtlCode = _.uniq(pluckqtlCode);
          this.setState({"searchArray":uniqueqtlCode});
        }else{
          this.setState({"searchArray":[]});
           $(event.target).val('');
        }
      }else{
        this.setState({"searchArray":[]});
         $(event.target).val('');
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).val('');
    }
  }


  actionBlock(){
    var n = this.props.getTicket.ticketElement.length;
    var reportLinkDetails = TempTicketReport.findOne({},{sort:{'createdAt':-1}}); 
    if(reportLinkDetails){
      var reportLink = reportLinkDetails.ReportLink;
    }
    switch(this.props.getTicket.ticketElement[n-1].roleStatus){
      case 'screenTLAllocated' :
        if((Meteor.user().roles.find(this.getRole) == 'team leader' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId())){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this case to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName"> 
                <option>--Select--</option>
                  {
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                      <option key={i} value={data._id} >
                          {data.profile.firstname + ' ' + data.profile.lastname}&nbsp; 
                          ({data.count ? data.count : 0})
                        </option>
                      );
                    })
                  }
                </select>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-6 fesubmitouter fesubmitouter1 noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-rolestatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                      
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'ReAssign' :
        if(Meteor.user().roles.find(this.getRole) == 'team leader' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this ticket to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName"> 
                  {
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                        <option key={i} value={data._id}>
                          {data.profile.firstname + ' ' + data.profile.lastname}
                          {data.count ? data.count : 0}
                          
                        </option>
                      );
                    })
                  }
                </select>
                <div className="col-lg-3 fesubmitouter noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-rolestatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                      
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'AssignReject' :
        if(Meteor.user().roles.find(this.getRole) == 'team leader'){
          var teamMemberList=[];
          var title = "Team Leader";
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12">
                <span className="col-lg-3 col-md-3 col-sm-4 col-xs-5"> Assign this ticket to: </span>
                <select className="col-lg-3 col-md-3 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName"> 
                  {
                    this.showBAFEList('team member').map((data,i)=>{
                      return(
                        <option key={i} value={data._id}>
                          {data.profile.firstname + ' ' + data.profile.lastname}&nbsp;
                          ({data.count ? data.count : 0})                          
                        </option>
                      );
                    })
                  }
                </select>
                <div className="col-lg-3 fesubmitouter noLRPad">
                  <button type="submit" value="Submit" className="col-lg-11 fesubmitbtn noLRPad" data-role="Team Leader" data-rolestatus="Assign" data-msg="Assigned Ticket To Team Member" onClick={this.approveButton.bind(this)} >Submit</button>                                      
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'Assign' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span>Please accept if your are going to work on this ticket. If rejected please provide an appropriate reason.</span>
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 acceptrejectwrap">
                <button className="btn btn-danger approvebtn col-lg-3 col-md-3 col-sm-4 col-xs-5" id="TMRejectTicket" data-rolestatus="AssignReject" data-msg="Rejected Ticket and returned back to " onClick={this.showRejectBoxState.bind(this)}>
                  Reject
                </button>
                <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-rolestatus="AssignAccept" data-msg="Accepted Ticket" onClick={this.approveButton.bind(this)} >
                  Accept </button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>
          )
        }
        break;
      case 'AssignAccept' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member";
          var data = [];
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
                <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper removePadding">
                    <div className="radio radiobtn col-lg-3 noLRPad" value="Self">
                      <label className="noLRPad" value="Self">
                        <input type="radio" name="radioState" value="Self" checked={ this.state.radioState == 'Self'} className="optradio" onChange={this.getRadioValue.bind(this)}/>Self
                      </label>
                    </div>    
                    <div className="radio col-lg-5 radiobtn noLRPad">
                      <label className="noLRPad">
                        <input type="radio" name="radioState" value="field expert" checked={ this.state.radioState == 'field expert'} className="optradio" onChange={this.getRadioValue.bind(this)}/>Field Expert
                      </label>
                    </div>
                    <div className="radio radiobtn col-lg-4 noLRPad">
                      <label className="noLRPad">
                        <input type="radio" name="radioState" value="ba" className="optradio" checked={ this.state.radioState == 'ba' ? true : false } onChange={this.getRadioValue.bind(this)}/>Business Associate
                      </label>
                    </div>
                </div>

                {this.state.radioState != '' ?     
                
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad hideFieldexpert selfallocatedwrap">                           
                  {this.state.radioState == 'field expert'?      
                    <div>
                        <div className="col-lg-7 teamMemOuter">
                          <lable>Allocate To Field Expert</lable>
                          <select className="form-control" id="selectMember" aria-describedby="basic-addon1" ref="allocateToFEName">
                              {
                                this.showBAFEList('field expert').map((data,i)=>{
                                  
                                  return(
                                    <option key={i} value={data._id}>
                                      {data.profile.firstname + ' ' + data.profile.lastname}&nbsp;
                                      ({data.count ? data.count : 0}), {data.profile.area ? data.profile.area != "" ?  data.profile.area : '' : ''} {data.profile.state ? data.profile.state != "" ? ", "+data.profile.state : "" : "" } {data.profile.country ? data.profile.country != '' ? ", "+data.profile.country : "" : ""} {data.profile.pincode ? data.profile.pincode != "" ? "- "+data.profile.pincode : "" : ""}
                                      
                                    </option>
                                  );
                                })
                              }
                          </select>
                        </div>
                        <div className="col-lg-4 fesubmitouter noLRPad">
                          <lable>&nbsp;</lable>
                          <button type="submit" value="Submit" className="col-lg-11 feSubmitbtn noLRPad" data-role="field expert" data-rolestatus="FEAllocated" data-msg="Allocated Ticket To Field Expert" onClick={this.approveButton.bind(this)} >Submit</button>                                      
                        </div>
                    </div>
                  :this.state.radioState == 'ba'?      
                    <div>
                        <div className="col-lg-7 teamMemOuter">
                          <lable>Allocate To Business Associate</lable>
                          <select className="form-control" id="selectMember" aria-describedby="basic-addon1" ref="allocateToFEName">
                              {
                                this.showBAFEList('ba').map((data,i)=>{
                                  return(
                                    <option key={i} value={data._id}>
                                      {data.profile.firstname + ' ' + data.profile.lastname}
                                      ({data.count ? data.count : 0}), {data.profile.area ? data.profile.area != "" ? data.profile.area : '' : ''} {data.profile.state ? data.profile.state != "" ? ", "+data.profile.state : "" : "" } {data.profile.country ? data.profile.country != '' ? ", "+data.profile.country : "" : ""} {data.profile.pincode ? data.profile.pincode != "" ? "- "+data.profile.pincode : "" : ""}
                                      
                                    </option>
                                  );
                                })
                              }
                          </select>
                        </div>
                        <div className="col-lg-4 fesubmitouter noLRPad">
                          <button type="submit" value="Submit" className="col-lg-11 feSubmitbtn  noLRPad" data-role="Business Associate" data-rolestatus="BAAllocated" data-msg="Allocated Ticket To Business Associate" onClick={this.approveButton.bind(this)} >Submit</button>                                      
                        </div>
                    </div>
                  : this.state.radioState == 'Self'?
                    <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 selfallocatedwrap noLRPad">
                      <h5><strong>You are going to handle this ticket</strong></h5>
                      <button type="submit" value="Submit" className="col-lg-5 col-lg-offset-3 col-md-5 col-md-offset-3 col-lg-12 col-xs-12 selfsubmit noLRPad" data-role="team member" data-rolestatus="SelfAllocated"  data-msg="Allocated Ticket To Self" onClick={this.approveButton.bind(this)} >Submit</button>                                                                             
                    </div>
                  :    
                    ""
                  }
                </div>
                :
                ""
                }
              </div>
            </div>
          );
        }
        break;
      case 'SelfAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>

              <div id="uploadButtonDiv" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12">
                <button className="btn btn-primary col-lg-7 col-md-7 col-sm-12 col-xs-12"  onClick={this.uploadDocsDiv.bind(this)} >
                      Upload Documents & Remark</button> 
              </div>
              <div id="AddImagesVideo" style={{"display":"none"}}>
                {<VerificationDataSubmit ticketId={this.props.ticketId} chekFieldList={ this.state.verifiedInfo}/>}
              </div>
            </div>
          )
        }
        break;
      case 'ProofSubmit' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span> Do you accept the Information Regarding the Ticket</span>
              <div className="docbtnwrap col-lg-6 col-lg-offset-4">
                <button type="button" className="btn btn-danger col-lg-4 ApprovRejDoc" id="TMProofReject" data-rolestatus="VerificationFail" data-msg="Rejected Verification Information from" onClick={this.showRejectBoxState.bind(this)}>Reject</button>
                <button type="button" className="btn btn-success col-lg-4 ApprovRejDoc" data-rolestatus="VerificationPass" data-msg="Approved Verification Information" onClick ={this.approveButton.bind(this)}>Approve</button>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
                
              </div>
            </div>
          )
        }
        break;
      case 'ProofResubmitted' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span> Do you accept the Information Regarding the Ticket</span>
              <div className="docbtnwrap col-lg-6 col-lg-offset-4">
                <button type="button" className="btn btn-danger col-lg-4 ApprovRejDoc" id="TMProofReject" data-rolestatus="VerificationFail" data-msg="Rejected Verification Information from" onClick={this.showRejectBoxState.bind(this)}>Reject</button>
                <button type="button" className="btn btn-primary col-lg-4 ApprovRejDoc" data-rolestatus="VerificationPass" data-msg="Approved Verification Information" onClick ={this.approveButton.bind(this)}>Approve</button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>
          )
        }
        break;
      case 'VerificationPass' :
      case 'VerificationPass-CompanyInfo':
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              {this.props.getTicket.verificationType == 'employement' ?
                   !this.props.getTicket.companyDetails ?
                    <EmployementCompanyDetails ticketId = {this.props.ticketId}/>
                   : 
                   <div>
                    <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Code: </span>
                    <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 outercodeInput">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <input type="text" name="code" ref="code" autoComplete="off" list="autoTempCode" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 codeInput code" onBlur={this.getReviewByCode.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
                        <datalist className="autocomplete" id="autoTempCode">
                          { 
                            this.state.searchArray.map((searchDetails, index)=>{
                              return(
                                <option value={searchDetails} key={searchDetails + '-searchCode'} />                        
                              );
                            })
                          } 
                        </datalist>
                      </div> 
                    </div>
                    <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Review Remark: </span>
                    <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commonReviewRemark" id="TMReviewRemark"/>
                      </div>
                      <div className="spanReviewRemark"></div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButton acceptrejectwrap">
                          <button type="button" className="fesubmitbtn1 col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-9 " data-rolestatus="TMReviewSubRemark" data-msg="Team Member Review Remark Submitted" onClick={this.approveButton.bind(this)}>Submit</button>
                      </div>
                    </div>
                  </div>
                :
                <div>
                  <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Code<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
                  <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 outercodeInput">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <input type="text" name="code" ref="code" autoComplete="off" list="autoTempCode" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 codeInput code" onBlur={this.getReviewByCode.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
                        <datalist className="autocomplete" id="autoTempCode">
                          { 
                            this.state.searchArray.map((searchDetails, index)=>{
                              return(
                                <option value={searchDetails} key={searchDetails + '-searchCode'} />                        
                              );
                            })
                          }
                        </datalist>                   
                     </div>
                  </div>
                  <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Review Remark<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
                  <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commonReviewRemark" id="TMReviewRemark" pattern="[A-Za-z0-9]+"/>
                    </div>
                    <div className="spanReviewRemark"></div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButton acceptrejectwrap">
                        <button type="button" className="fesubmitbtn1 col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-9  " data-rolestatus="TMReviewSubRemark" data-msg="Team Member Review Remark Submitted" onClick={this.approveButton.bind(this)}>Submit</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          )
        }
        break;
      case 'TMReviewSubRemark' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <button type="button" className="tmListWrap col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3" data-toggle="modal" data-target="#anotherTMReview">Review</button>
              <button type="button" className="tmListWrap col-lg-3 col-lg-offset-1 col-md-3 col-md-offset-1 " data-rolestatus="TMReviewRemark" data-msg="Team Member Review Remark Submitted" id="passtoqtm" onClick={this.approveButton.bind(this)}>Pass to QTM</button>
              <div id="anotherTMReview" className="modal fade" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <h5 className="modal-title"> {title} </h5>
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                        <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Code<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
                        <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 outercodeInput">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <input type="text" name="code" ref="code" autoComplete="off" list="autoTempCode" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 codeInput code" onBlur={this.getReviewByCode.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
                            <datalist className="autocomplete" id="autoTempCode">
                              { 
                                this.state.searchArray.map((searchDetails, index)=>{
                                  return(
                                    <option value={searchDetails} key={searchDetails + '-searchCode'} />                        
                                  );
                                })
                              }
                            </datalist>
                          </div> 
                        </div>
                        <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Review Remark<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
                        <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commonReviewRemark" id="TMReviewRemark"/>
                          </div>
                          <div className="spanReviewRemark"></div>                  
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-success" data-rolestatus="TMReviewSubRemark" data-msg="Team Member Review Remark Submitted" onClick={this.approveButton.bind(this)} id="submitExtraRemark">Submit</button>
                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        }
        break;
      case 'VerificationPassQTMAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Quality Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">Is the Information submitted appropriate ?</span>
              <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 acceptrejectwrap">
                <button className="btn btn-danger approvebtn col-lg-3 col-md-3 col-sm-4 col-xs-5" id="QTMRejectTicket" data-rolestatus="QAFail" data-msg="Rejected Ticket and returned back to " onClick={this.showRejectBoxState.bind(this)}>
                  Reject
                </button>
                <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-rolestatus="QAPass" data-msg="Verified the Ticket related Information" onClick={this.approveButton.bind(this)} >
                  Approved </button>
              </div>
              {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
            </div>       
          )
        }
        break;
      case 'QAPass' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Quality Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Code<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
              <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 outercodeInput">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <input type="text" name="qtmcode" ref="qtmcode" autoComplete="off" list="autoqtmCode" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 codeInput qtmcode" onBlur={this.getReviewByCodeToQTM.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
                 <datalist className="autocomplete" id="autoqtmCode">
                    { 
                      this.state.searchArray.map((searchDetails, index)=>{
                        return(
                          <option value={searchDetails} key={searchDetails + '-searchqtmcode'} />                        
                        );
                      })
                    }
                  </datalist>    
                </div>
              </div>
              <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-2 col-xs-2">Review Remark<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
              <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commonReviewRemark" id="QTMReviewRemark"/>
                </div>
                <div className="spanReviewRemark"></div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButton acceptrejectwrap">
                    <button type="button" className="fesubmitbtn col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-9" data-rolestatus="QTMReviewRemark-GetUsrRemark" data-msg="Quality Team Member Review Remark Submitted" onClick={this.approveButton.bind(this)}>Submit</button>
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'QTMReviewRemark-GetUsrRemark' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
            var title = "Quality Team Member"; 
            return(
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
                <h5> {title} </h5>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 reportRemarkOuter">
                  <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-2 col-xs-2">Report Remark<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
                  <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                     <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 commonReviewRemark" id="QTMReviewRemark"/>
                  </div>
                  <div className="spanReviewRemark"></div>
                </div>
                <button type="button" className="tmListWrap col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-9" data-rolestatus="QTMReviewRemark" data-msg="Quality Team Member Report Remark Submitted" onClick={this.approveButton.bind(this)}>Submit</button>
              </div>
            )
        }
      case 'QTMReviewRemark' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Quality Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-7 col-lg-offset-1 col-md-10 col-md-offset-1 col-xm-12 col-xs-12">
                <div className="col-lg-7">
                    <button type="button" className="fesubmitbtn col-lg-6 col-lg-offset-2" data-rolestatus="ReportGenerated" data-msg="Generated The Ticket" onClick={this.approveButton.bind(this)}>Generate Report</button>
                </div>
              </div>
            </div>       
          )
        }
        break;
      case 'QAFail' :
        if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Team Member"; 
          
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span>Select  appropriate action ? </span>

              <div className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 fesubmitbtn">
                   {/* <button type="button" className="btn reportcommonbtn btn-info" onClick = {this.targetReport.bind(this)}>Edit Report</button> */}               
                {
                  this.props.getTicket.ticketElement.find(function (obj) { return obj.roleStatus == 'SelfAllocated' })?
                    
                    <button type="button" className="btn reportcommonbtn btn-info" onClick = {this.editInformation.bind(this)}>Edit Inforamation</button>
                  :
                 
                    <button type="button" className="btn reportcommonbtn btn-info">Ask FE/BA To Report</button>
                }
              </div>
            </div>
          ) 
        }
        break;
      case 'QAPassQTLAllocated' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team leader' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Qulity Team Leader"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-10 col-md-10 col-md-offset-0 col-xm-12 col-xs-12">
                <div className="col-lg-7 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
                  <label className="col-lg-12">Is the Report appropriate ? </label>                  
                  <button className="btn btn-danger col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" id="QTLRejectTicket" data-rolestatus="ReviewFail" data-msg="Rejected Verification Report For Quality Issue" onClick={this.showRejectBoxState.bind(this)} >
                    Reject
                  </button>
                  <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-rolestatus="ReviewPass" data-msg="Approved the Ticket" onClick={this.approveButton.bind(this)} >
                   Approve 
                  </button>
                </div>
                <div className="col-lg-6 acceptrejectwrap">
                  {this.state.showRejectBox === 'Y' ? 

                    // return(
                      <div>
                        {/* <select className="col-lg-7 col-md-7 col-sm-4 col-xs-5 tmListWrap" id="selectTMMember" aria-describedby="basic-addon1" ref="allocateToName"> 
                            {
                              this.showTMQTMList('team member').map((data,i)=>{
                                return(
                                  <option key={i} value={data._id}>
                                    {data.profile.firstname + ' ' + data.profile.lastname}&nbsp;
                                  </option>
                                );
                              })
                            }
                        </select> */}
                      </div>
                    // );
                  :
                  "" 
                  }
                  {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
                </div>
                
                {this.state.showRadiobtn === 'Y' ? this.showTicketDataRadiobtn() : '' }
                
              </div>
              
            </div>
          )
        }
        break;
      case 'ReviewPass' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team leader' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Quality Team Leader"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-12 col-xs-12">Code<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
              <div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 outercodeInput">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <input type="text" name="qtlcode" ref="qtlcode" autoComplete="off" list="autoqtlCode" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 codeInput qtlcode" onBlur={this.getReviewByCodeToQTL.bind(this)} onInput={this.getTextValueWhenType.bind(this)}/>
                   <datalist className="autocomplete" id="autoqtlCode">
                    { 
                      this.state.searchArray.map((searchDetails, index)=>{
                        return(
                          <option value={searchDetails} key={searchDetails + '-searchqtlcode'} />                        
                        );
                      })
                    }
                  </datalist>   
                </div>
              </div>
              <span className="uploadreportTitle col-lg-2 col-md-2 col-sm-2 col-xs-2">Review Remark<span className="codecolor">*</span>&nbsp;&nbsp;: </span>
              <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <textarea rows="3"  className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="QTLReviewRemark"/>
                </div>
                <div className="spanReviewRemark"></div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButton acceptrejectwrap">
                    <button type="button" className="fesubmitbtn1 col-lg-3 col-lg-offset-5 col-md-3 col-md-offset-9" data-rolestatus="QTLReviewRemark" data-msg="Quality Team Leader Review Remark Submitted" onClick={this.approveButton.bind(this)}>Submit</button>
                </div>
              </div>
            </div>
          )
        }
        break;
      case 'QTLReviewRemark' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team leader' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Quality Team Leader"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <span className="uploadreportTitle">Upload Updated Report : </span>
              <div className="col-lg-7 col-lg-offset-1 col-md-10 col-md-offset-1 col-xm-12 col-xs-12">
                
                <div className="col-lg-7">
                    <button type="button" className="fesubmitbtn col-lg-6 col-lg-offset-2" data-rolestatus="ReportReGenerated" data-msg="Regenerated The Report" onClick={this.approveButton.bind(this)}>Re-generate Report</button>
                </div>
              </div>
            </div>        
          )
        }
        break;
      case 'ReportReGenerated' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team leader' && this.props.getTicket.ticketElement[n-1].userId == Meteor.userId()){
          var title = "Quality Team Leader"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
              <div className="col-lg-7 col-lg-offset-1 col-md-10 col-md-offset-1 col-xm-12 col-xs-12">
                <div className="col-lg-7">
                    <button type="button" className="btn btn-success approvebtn col-lg-5 col-lg-offset-2" data-toggle="modal" data-target="#closeTicketModal">Close Ticket</button>
                </div>
              </div>
              <div className="modal fade" id="closeTicketModal" role="dialog">
                <div className="modal-dialog modal-sm"> 
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      {/*<h4 class="modal-title">Modal Header</h4>*/}
                    </div>
                    <div className="modal-body">
                      <p><b>Do you want to close ticket?</b></p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-success approvebtn" data-rolestatus="TicketClosed" data-msg="Closed the Ticket" onClick={this.approveButton.bind(this)} data-dismiss="modal">Confirm</button>
                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>        
          )
        }
        break;
      case 'ReviewFail' :
        if(Meteor.user().roles.find(this.getRole) == 'quality team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){
          var title = "Qulity Team Member"; 
          return(
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
              <h5> {title} </h5>
             
              <div className="col-lg-10 col-md-10 col-md-offset-0 col-xm-12 col-xs-12">
                {/* <h6>Submitted Report</h6> */}
                {/* <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                  <div className="docdownload col-lg-3 col-lg-offset-1" title="Download Report">
                      <a href={this.props.getTicket.reportGenerated.url} download>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                      </a>
                  </div>
                  <lable className=" col-lg-9 col-md-9 col-sm-12 col-xs-12 downloadLable">Download Report</lable>
                </div> */}
                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 acceptrejectwrap">Is the Report appropriate ? </span>
                <div className="col-lg-6 col-lg-offset-0 col-md-6 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
                  <button className="btn btn-danger col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" id="QTMReRejectTicket" data-rolestatus="QAFail" data-msg="Rejected Verification Report For Quality Issue" onClick={this.showRejectBoxState.bind(this)} >
                    Reject
                  </button>
                  <button className="btn btn-success col-lg-3 col-md-3 col-sm-4 col-xs-5 approvebtn" data-rolestatus="QAPass" data-msg="Re-Approved Verification Report" onClick={this.approveButton.bind(this)} >
                        Approve </button>
                </div>
                {this.state.showRejectBox === 'Y' ? this.getRejectBox() : '' }
              </div>
            </div>
          )
        }else if(Meteor.user().roles.find(this.getRole) == 'team member' && this.props.getTicket.ticketElement[n-1].allocatedToUserid == Meteor.userId()){

        }
        break;
    }
  }
  printTicket(event){
    event.preventDefault();
    // window.print();
      var printContents = document.getElementById('outerCaseWrapper').innerHTML;
      var originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
  }
  createcasePDF(){
    var outerCaseWrapper = $('#outerCaseWrapper'),
    cache_width          = outerCaseWrapper.width();
    this.getCanvas(cache_width);
  }

  getCanvas(cachewidth){
    html2canvas($('#outerCaseWrapper').get(0)).then( function (canvas) {
    var outerCaseWrapper = $('#outerCaseWrapper');
      var img = canvas.toDataURL("image/png");
      if(canvas.width > canvas.height){
         var doc = new jsPDF('landscape','mm','a4',[canvas.width, canvas.height]);
      }else{
        var doc = new jsPDF('p', 'mm','a4',[canvas.height, canvas.width]);
      }
      doc.setFontSize(16); 
      var width           = doc.internal.pageSize.getWidth(); 
      var height          = doc.internal.pageSize.getHeight();
      var imgHeight       = (canvas.height * width) / canvas.width;
      var heightLeft      = imgHeight;
      var position        = 0;

      doc.addImage(img, 'PNG', 0, position, width, imgHeight);
      heightLeft -= height;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(img, 'PNG', 0, position, width, imgHeight);
        heightLeft -= height;
      }
      doc.save('Case.pdf');
      outerCaseWrapper.width(cachewidth);
    });
  }
  
  downloadCaseaspdf(event){
    event.preventDefault();
    this.createcasePDF();
  }
  render(){

      if(!this.props.loading){
        var ticketElemLength = this.props.getTicket.ticketElement.length;
        // console.log('ticketElemLength: ', ticketElemLength);
        
        return(           
          <div>
            <div className="content-wrapper">
              <section className="content">
                <div className="row">
                  <div className="col-md-12">
                    <div className="box">
                      <div className="box-header with-border">
                        <h2 className="box-title">Case</h2>
                      </div>
                      <div className="box-body">
                         <div className="ticketWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12" id="outerCaseWrapper">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="ticketHeader col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="ticketBorder col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noLRPad">
                                    <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="assureidLogo" />
                                </div>
                              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-right outerTicketIcons">
                                  <i className="fa fa-print ticketIcons" title="Print" onClick={this.printTicket.bind(this)}></i> 
                                 {/* <i className="fa fa-file-pdf-o ticketIcons"  title="PDF"></i>*/}
                                  <i className="fa fa-download ticketIcons" title="Download as pdf" onClick={this.downloadCaseaspdf.bind(this)}></i>
                              </div>
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                              <h3 className="ticketheadStyle col-lg-12">{this.props.getTicket.serviceName}/{this.props.getTicket.ticketNumber}</h3>
                            </div>
                            <div className="ticketPills col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              

                           {
                             this.props.role !="quality team leader" ?

                                <div className="col-lg-12 noLRPad">
                                 <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                  { this.props.userProfile && this.props.userProfile.userProfile ?
                                      <img src={this.props.userProfile.userProfile } className="ticketUserImage" />
                                    :
                                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/userIcon.png" className="ticketUserImage" />
                                  }
                                  {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight assureidValue">
                                      <button type="button" className="btn viewbtn" data-userid={this.props.user._id} onClick= {this.viewprofile.bind(this)}>View Profile</button>
                                  </div> */}
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    {/* <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-left userLabel">
                                    Name <span className="pull-right">:</span>
                                    </div>   */}
                                    <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 text-left userName">
                                    {
                                      this.props.userProfile ?
                                        <h5>{this.props.userProfile.firstName} {this.props.userProfile.lastName}</h5>                                      
                                      :
                                      null
                                    }
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left  userLabel">
                                    Assure ID <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    {
                                      this.props.userProfile ?
                                        <p>&nbsp;{this.props.userProfile.assureId ? this.props.userProfile.assureId : "-"}</p>
                                      :
                                      null
                                        
                                      
                                    }
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                   Mobile <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    {/* <p>{this.state.userDetails.emails[0].address}</p> */}
                                      {
                                        this.props.userProfile ?                                         
                                          <p>{this.props.userProfile.mobileNo ? "+91"+this.props.userProfile.mobileNo : "-"}</p>
                                        :
                                         null                                        
                                      }
                                    </div>
                                  </div>

                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Email Id <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    {
                                      this.props.userProfile ? 
                                        <p>{this.props.userProfile.emailId ? this.props.userProfile.emailId : "-"}</p>
                                      :
                                       null
                                        

                                    }
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Age<span className="pull-right">:</span>
                                    </div> 
                                     <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                     {
                                       this.props.userProfile ? 
                                        <p>{this.props.userProfile.dateOfBirth!="-" ? this.props.userProfile.dateOfBirth +" Years" : "-"}</p>                                       
                                       :
                                       null
                                     }
                                      
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                    <div className="col-lg-5 col-md-5 col-sm-4 col-xs-4 text-left userLabel">
                                    Gender <span className="pull-right">:</span>
                                    </div> 
                                    <div className="col-lg-7 col-md-7 col-sm-8 col-xs-8 text-left userValue">
                                    {
                                      this.props.userProfile ? 
                                        <p className="genName">{this.props.userProfile.gender ? this.props.userProfile.gender : ""}</p>
                                      :
                                      null
                                    }
                                    </div>
                                  </div>
                                
                                </div>
                              </div>
                                 
                                  <div className="col-lg-6">
                                    <ServiceInformation ticketId={this.props.ticketId}/>
                                  </div>
                                  
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <VerifyDetailsDocument ticketId={FlowRouter.getParam('id')}/>
                                  </div>
                                  {/* <VerifiedDocuments ticketId={FlowRouter.getParam('id')}/> */}
                                  {
                                    // var n=this.props.getTicket.ticketElement
                                    this.props.getTicket.ticketElement[ticketElemLength-1].roleStatus=="ScreenApproved" && this.props.getTicket.verificationType=="reference" ? 
                                      null
                                    :
                                    
                                      <MultipleVerifiedDocuments ticketId={FlowRouter.getParam('id')}/>
                                      
                                  }
                                  
                                  
                                  <div id="SubmittedDocuments" >
                                    {this.props.getTicket.submitedDoc ?
                                      <SubmittedDocuments submittedDocuments={this.props.getTicket.submitedDoc} ticketId={FlowRouter.getParam('id')} />
                                      :
                                      ""
                                    }
                                  </div>

                                  <div id="displayReporta">
                                    {this.props.getTicket.reportGenerated?
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outeReportBlock">
                                          <h6 className="dataDetails col-lg-1 col-md-1 col-sm-1 col-xs-1">Report:</h6> 
                                          {
                                            //Roles.userIsInRole(Meteor.userId(),['quality team member','quality team leader']) ?
                                            this.props.getTicket.ticketStatus != 'TicketClosed' && (this.props.qtmUserAccess || this.props.qtlUserAccess) ?
                                              <i className="fa fa-times tempImageDelete" title="Delete Report" id={this.props.ticketId} onClick={this.deleteReport.bind(this)}></i>                                
                                            :
                                              ""
                                          }
                                            <div className="docdownload col-lg-1 col-lg-offset-1" title="Download Report">
                                                <a href={this.props.getTicket.reportGenerated.url} target="_blank">
                                                  {
                                                    this.props.getTicket.reportGenerated ?
                                                      <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                    :
                                                    null
                                                  }
                                                </a>
                                            </div>
                                          <lable className=" col-lg-11 col-md-11 col-sm-12 col-xs-12 downloadLable">Download Report</lable>
                                        </div>   
                                      </div>                       
                                      :
                                      null
                                    }
                                    {
                                      this.props.showHideBtn && this.props.getTicket.reportGenerated ?
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outeReportBlock">
                                            <h6 className="dataDetails col-lg-1 col-md-1 col-sm-1 col-xs-1">Report:</h6> 
                                                <div  id="showReport" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fesubmitbtn tickStatWrapper">
                                                <span className="uploadreportTitle">Re-generate Report </span>
                                                  <div className="col-lg-7 col-lg-offset-1 col-md-10 col-md-offset-1 col-xm-12 col-xs-12">
                                                    <div className="col-lg-7">
                                                        <button type="button" className="fesubmitbtn col-lg-6 col-lg-offset-2" data-rolestatus="ReportReGenerated" data-msg="Report Re-generate" onClick={this.reportReSubmit.bind(this)}>Re-generate Report</button>
                                                    </div>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                  </div>
                                  
                                  <div id="displayReporta">
                                    {this.props.getTicket.reviewRemark ?
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outeReportBlock">
                                          <h6 className="dataDetails col-lg-12 col-md-12 col-sm-12 col-xs-12">Ticket Review:</h6> 
                                            {this.props.getTicket.reviewRemark.map((review,i)=>{
                                              return(
                                                <div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapperForReview">
                                                  <h5><b> {review.role} </b> </h5>
 
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerReviewsBlock">
                                                    <b>Name   : </b>{review.userName}
                                                    {
                                                      review.userId == Meteor.userId() && this.props.getTicket.ticketStatus != 'TicketClosed'&& this.props.getTicket.ticketElement[this.props.ticketElemLen-1].roleStatus!= 'VerificationPassQTMAllocated' ?
                                                        <i className="fa fa-edit tempImageDelete col-lg-1 text-right pull-right" title="Edit Review" id={review.userId} onClick={this.editReview.bind(this)}></i>
                                                      :
                                                        null
                                                    }
                                                    <br/>
                                                  </div>
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerReviewsBlock" id={"remarkWrapper-"+review.userId} >
                                                    <b>Date : </b>{moment(review.createdAt).format("DD MMM YYYY")}
                                                  </div>
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerReviewsBlock" id={"remarkWrapper-"+review.userId} >
                                                    <b>Remark : </b>{review.remark}
                                                  </div>
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerReviewsBlock" style={{"display" : "none"}} id={"textbox-"+review.userId}  data-index={i}  onChange={this.handleChangeForArray}>
                                                    <textarea rows="3" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="reviewsRemark" name="reviewsRemark" data-index={i} id={review.userId} value={review.remark}  onBlur={this.submitEditedReview.bind(this)}/>
                                                  </div>
                                                </div>
                                              )
                                            })
                                          }
                                            
                                        </div>   
                                      </div>                       
                                      :
                                      null
                                    }
                                  </div>
                                </div>
                              :
                               this.props.getTicket.reportGenerated ?
                                <ReportHeader />
                              :
                              null
                           }
                           </div>
                           {this.props.getTicket.verificationType == "employement" ?
                              this.props.getTicket.companyDetails ?
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerShadow">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityDetails">                           
                                          <h3> Company Details</h3>
                                      </div>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>Type of Ownership <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.typeOfOwnersip ? this.props.getTicket.companyDetails.typeOfOwnersip : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>CIN No. <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.cinNo ? this.props.getTicket.companyDetails.cinNo : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>Registration In <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.registeringIn ? this.props.getTicket.companyDetails.cinNo : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>Site Visit <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.siteVisit ? this.props.getTicket.companyDetails.siteVisit : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>Current Status <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.currentStatus ? this.props.getTicket.companyDetails.currentStatus : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                          <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                            <p><b>Past Aberrations <span className="pull-right">:</span></b></p>
                                          </div>
                                          <div className="col-lg-9 col-md-9 col-sm-3 col-xs-9">
                                            <p>{this.props.getTicket.companyDetails.pastAberrations ? this.props.getTicket.companyDetails.pastAberrations : "-"}</p>
                                          </div>
                                          <div>
                                          </div>
                                        </div>
                                      </div>
                                   </div>
                                </div>
                              :
                              null
                            :
                            null
                           }
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerShadow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityDetails">                           
                                    <h3> Activity Log</h3>
                                </div>
                                {this.actionBlock()}
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                  {this.props.getTicket.ticketElement.slice(Math.max(this.props.getTicket.ticketElement.length - 2, 1)).reverse().map((element,i)=>{
                                     return (
                                      <div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
                                        <h5> {element.role} </h5>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <b>{element.userName}</b> {element.msg} <b>{element.allocatedToUserName}</b> on {moment(element.createdAt).format("DD MMM YYYY hh:mm A")}.
                                        
                                          {
                                            element.remark ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad outerReviewsBlock">
                                                <span>Remark &nbsp;:</span><span>{element.remark}</span>
                                              </div>
                                            :
                                            ""
                                          }
                                          {
                                            element.reviewRemark ?
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad outerReviewsBlock">
                                                <span><b>Review Remark</b> &nbsp;:</span><span>&nbsp;{element.reviewRemark}</span>
                                              </div>
                                            :
                                            ""
                                          }

                                        </div> 
                                      </div>
                                      )
                                    })
                                  }
                                  {this.props.getTicket.ticketElement.length > 2 ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerClickHere noLRPad">
                                     <p className="clickHereforseemore" data-toggle="collapse" data-target="#moreActivities">Click here to see more >></p>
                                       <div id="moreActivities" className="collapse">
                                        {this.props.getTicket.ticketElement.slice(2).reverse().map((element,i)=>{
                                            return (
                                              <div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 tickStatWrapper">
                                                <h5> {element.role} </h5>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <b>{element.userName}</b> {element.msg} <b>{element.allocatedToUserName}</b> on {moment(element.createdAt).format("DD MMM YYYY hh:mm A")}.                                                
                                                  {
                                                    element.remark ?
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad outerReviewsBlock">
                                                        <span>Remark &nbsp;:</span><span>{element.remark}</span>
                                                      </div>
                                                    :
                                                    ""
                                                  }
                                                  {
                                                    element.reviewRemark ?
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad outerReviewsBlock">
                                                        <span><b>Review Remark</b> &nbsp;:</span><span>&nbsp;{element.reviewRemark}</span>
                                                        <span><b>Date </b> &nbsp;:</span><span>&nbsp;{moment(element.createdAt).format("DD MMM YYYY")}</span>
                                                      </div>
                                                    :
                                                    ""
                                                  }

                                                </div> 
                                              </div>
                                              )
                                            })
                                          }
                                      </div>
                                    </div>
                                     :
                                    ""
                                  }
                                </div>
                              </div>
                          </div>

                         </div>
                         </div>
                         </div>
                      </div>
                    </div>
                  </div>
                {/* </div> */}
              </section>
            </div>
          </div>   
        );
      }else{
        return(<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noData"> No Data Available</div>);
      }

     }
  }

export default CaseDetailContainer = withTracker(props => {
  var ticketId = FlowRouter.getParam('id');
  
  
  var handleSinTick = Meteor.subscribe("singleTicket",ticketId);
  var handleUseFunc = Meteor.subscribe('userfunction');
  var handleUserProfile = Meteor.subscribe("userProfileData");
  var handleReport    = Meteor.subscribe("allTicketReport");
  const postHandle2  = Meteor.subscribe('checklistFieldExpert');
  const postNotifHandle  = Meteor.subscribe('notificationTemplate');
  console.log('postNotifHandle: ', postNotifHandle);
  
  var loading = !handleSinTick.ready() && !handleUseFunc.ready() && !handleUserProfile.ready() && !handleReport.ready() && !postHandle2.ready() && !postNotifHandle.ready();
  var getTicket = TicketMaster.findOne({"_id":ticketId}) ;
  var loginUserID = Meteor.userId();
  var loggedInUser = Meteor.users.findOne({"_id":loginUserID});
  
  if(getTicket){
    
    var user = Meteor.users.findOne({"_id": getTicket.userId});
    if(user && getTicket && getTicket.userId){
      var userProfile = UserProfile.findOne({"userId": getTicket.userId});
      // console.log('userProfile: ', userProfile);
      
      var roleArr = loggedInUser.roles;
      if(roleArr){
        var role = roleArr.find(function (obj) { return obj != 'backofficestaff' });
      }
      if(userProfile){
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
    }
    

    //---------------- Nilam Added code for change remark and new requirement--------------------------------------------------------------

      var verificationType = getTicket.verificationType;
      if (verificationType == "professionalEducation") {
      var checkListFrom = "Academic Information";
      }else if (verificationType == "permanentAddress") {
      var checkListFrom = "Address Information";
      }else if (verificationType == "currentAddress") {
      var checkListFrom = "Address Information";
      }else if (verificationType == "employement") {
      var checkListFrom = "Employment Information";
      }else if (verificationType == "education") {
      var checkListFrom = "Academic Information";
      }else  if (verificationType == "certificates") {
      var checkListFrom = "Skills And CertificationInformation";
      }
      var checkListObjs = ChecklistFieldExpert.find({"checkListFor" : checkListFrom}).fetch();
      

      var checkObjs = [];
      var textObjs = [];
      if (checkListObjs) {
          for (var i = 0; i < checkListObjs.length; i++) {
              if(checkListObjs[i].checkListFrom == 'Database'){
                  if(checkListObjs[i].checkListFor == "Address Information"){
                      if(verificationType == "permanentAddress"){

                          for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                              checkListObjs[i].relatedFields[j].value = getTicket.verificationData[checkListObjs[i].relatedFields[j].dbField];   
                          }
                      }else{
                          for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                              var str = checkListObjs[i].relatedFields[j].dbField;
                              if(str == 'residingFrom' || str == 'residingTo'){

                              }else{
                                str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                                    return letter.toUpperCase();
                                });
                              }
                              var tempVar = 'temp'+str;
                              checkListObjs[i].relatedFields[j].value = getTicket.verificationData[tempVar];   
                          }
                      }
                  }else{
                      for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                          checkListObjs[i].relatedFields[j].value = getTicket.verificationData[checkListObjs[i].relatedFields[j].dbField]; 
                          //   
                      }
                  }
                  checkObjs.push(checkListObjs[i]);
              }else{
                  textObjs.push(checkListObjs[i]); 
                  // checkObjs.push(checkListObjs[i]); 
              }
          }
      }
    //------------------------------------------------------------------------------
  }   
  
  
  if(getTicket && getTicket.reportGenerated && getTicket.reportGenerated.documents){
    var ticketElement = getTicket.ticketElement;
    var qtmUserAccess = ticketElement.find(function (obj) { return obj.role == 'quality team member' && obj.userId == Meteor.userId()});
    var qtlUserAccess = ticketElement.find(function (obj) { return obj.role == 'quality team leader' && obj.userId == Meteor.userId()});
    var showHideBtn = false;
  }else{
    var showHideBtn = true;
  }
  if(checkObjs){
    checkObjs = checkObjs;

  }
  if(getTicket){
    var ticketElemLen = getTicket.ticketElement.length;
  }
  return {
    loading,
    getTicket,
    user,
    userProfile,
    ticketId,
    checkObjs,
    showHideBtn,
    role,
    qtmUserAccess,
    qtlUserAccess,
    ticketElemLen
  };
})(CaseDetail);