import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';

import { TempTicketImages } from '/imports/admin/caseManagement/api/TempUpload.js';
import { TempTicketVideo } from '/imports/admin/caseManagement/api/TempUpload.js';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { ChecklistFieldExpert } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Order }               from '/imports/admin/orderManagement/api/Order.js';

class VerificationDataSubmit extends TrackerReact(Component){
    constructor(props){ 
        super(props); 
        // console.log("EditValue :",this.props.EditValue);
        if(this.props.EditValue){
            this.state = {  
                "checkLists"        : this.props.EditValue.checkLists,
                "textLists"         : this.props.EditValue.textLists,
                "images"            : this.props.EditValue.images,
                "videos"            : this.props.EditValue.videos,
                "remark"            : this.props.EditValue.remark,
                "documents"         : this.props.EditValue.documents,
                "status"            : this.props.EditValue.status,
                "data"              : [],
                "verifiedInfo"      : [],
                "chekFieldList"     : [],
                "supportEmailId"    : '',
                "fromEmailId"       : '',
                "panCardNumber"     : '',
                "subscription"      : {
                  "singleOrder"     : Meteor.subscribe('singleTicket',this.props.tickets.orderId),
                }
            };
            // 
        }else{
            this.state ={
                "checkLists"        : [],
                "textLists"         : [],
                "images"            : [],
                "videos"            : [],
                "remark"            : [],
                "documents"         : [],
                "status"            : '',
                "buttonstatus"      : 'Incorrect',
                "chekFieldList"     : [],
                "finalListArray"    : [],
                "data"              : [],
                "supportEmailId"    : '',
                "fromEmailId"       : '',
                "panCardNumber"     : '',
                "subscription"   : {
                  "singleOrder"     : Meteor.subscribe('singleTicket',this.props.tickets.orderId),
                }
            };
        }

       
        this.handleChange          = this.handleChange.bind(this);
        this.handleChangeChecklist = this.handleChangeChecklist.bind(this);
        this.handleChangeForArray  = this.handleChangeForArray.bind(this);
        // this.removechecked  = this.removechecked.bind(this);
    }
    componentDidMount(){   
        $.validator.addMethod("regCx2", function(value, element, regexpr) {
          return regexpr.test(value);
        }, "Please enter a valid pan card number.");

        jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });   
         $("#pancardvalidateForm").validate({
          rules: {
            panCardNumber : {
              required: true,          
              regCx2:  /^([a-zA-Z]){3}([CHFATBLJGP]){1}([a-zA-Z]){1}([0-9]){4}([a-zA-Z]){1}$/,
            },
          },
        });  
      }
    getRole(role) {
        return role != "backofficestaff";
    }
    handleChangeChecklist(event){
        // event.preventDefault();
        const target = event.target;
        const value  = target.type === 'checkbox' ? target.checked : target.value;
        const name   = target.name;
        var index = $(event.currentTarget).attr('data-index');
        this.state.checkLists[index].value = event.target.value;
        this.setState({
         [name]: event.target.value,
        });
       
        var currentData = this.state.checkLists;
        var newArr = [];
        for(i=0;i<currentData.length;i++){
            if(i==index){
                var newObj = {
                    statement:currentData[i].statement,
                    status:!currentData[i].status,
                    value:!currentData[i].status,
                }                
                newArr.push(newObj);
            }else{
                newArr.push(currentData[i]);
            }
        }
        
        this.setState({
            checkLists: newArr,
        }) 
    }
    handleChangeForArray(event){
        event.preventDefault();
        const target = event.target;
        const name   = target.name;
        var index    = $(event.currentTarget).attr('data-index');
        this.state.textLists[index].value = event.target.value;
        this.setState({
         [name]: event.target.value,
        });
    }
    handleChange(event){
        event.preventDefault();
        const target = event.target;
        const name   = target.name; 
        this.setState({
         [name]: event.target.value,
        });
    }
    sendEmailTosupportTeam(event){
        event.preventDefault();
        //update status to insuficiency
        var userId  = this.props.tickets.userId;
        var ticketId = this.props.ticketId;
        var userData  = Meteor.users.findOne({"_id" : userId});
          if (userData) {
            if (userData.profile) {
              var firstLastNm = userData.profile.firstname+' '+userData.profile.lastname;
              var mobNumber   = userData.profile.mobNumber;
              var emailId     = userData.emails[0].address;
            }
          }
        var order   = this.props.singleOrder;
        if (order) {
            if (order.companyDetails) {
                var companyInfo = '<br><br><b>Company Name</b> = '+order.companyDetails.companyName+'<br><b>Order placed by Email ID</b> = '+order.companyDetails.SPOCDetails.EmailID;
            }else{
                var companyInfo = '';
            }
        }

        var to      = this.refs.supportEmailId.value;
        var fromId  = emailId;
        var subject = "User Remark";
        var remark  = this.refs.remark.value;
        var body    = 'Hello,<br><br><b>User Name</b> ='+firstLastNm+'<br><b>Email ID</b> ='+emailId+'<br><b>Mobile Number =</b>'+mobNumber+'<br><b>Remark =</b>'+remark+''+companyInfo+'<br><br>For further communication regarding this insufficiency kindly send an email on '+this.refs.fromEmailId.value+'<br><br>'+'<br><br>Regards,<br>Team ASSUREiD';
        if (remark) {
          Meteor.call('sendEmailnNotification',to, fromId, subject, body,function(error,result){
             if(error){
               swal("Email ID is not valid","error");
             }else{
               $("#sendEmailModal").modal('hide');
               $("#supportEmailId").val('');
               swal("Congratulations!","Email send successfully","success");
               Meteor.call('UpdateTatDate',ticketId);
             }
            });  
        }else{
            swal("Please fill the remark first");
        }
        
    }
    // handleUpload(event){
    //     event.preventDefault();
    //     let self = this;
    //      // this.setState({isUploading: true});
    //      // 
         
    //      Session.set("uploadDocumentProgressbar","");
    //     if (this.props.ticketImages.length >= 0 && this.props.ticketImages.length < 5 ) {
    //       if (event.currentTarget.files.length <= 5) {
    //         for (var i = 0; i < event.currentTarget.files.length; i++) {
    //           if (event.currentTarget.files[i]) {
    //             var dataImg = event.currentTarget.files[i]; 
    //              if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){     
    //                var reader = new FileReader();       
    //                reader.onload = function (e) {         
    //                  // $('.uploadedImageFromLocl').attr('src', e.target.result);     
    //                };      
    //                reader.readAsDataURL(event.currentTarget.files[i]);     
    //                var file = event.currentTarget.files[i];     
    //                 if (file) {        
    //                   addImgsToS3Function(file,self);      
    //                 }  
    //              } 
    //              else {
    //               swal({   
    //                  position: 'top-right',    
    //                  type: 'error',   
    //                  title: 'Please select image',      
    //                  showConfirmButton: false,     
    //                  timer: 1500     
    //                });  
    //             }
    //           }
    //         }
    //        }else if (event.currentTarget.files.length > 5 ) {
    //           swal({   
    //              position: 'top-right',    
    //              type: 'error',   
    //              title: 'You can not add more than 5 images',      
    //              showConfirmButton: false,     
    //              timer: 3000     
    //            }); 
    //         }
    //     }else if (this.props.ticketImages.length >= 5 ){
    //        swal({   
    //          position: 'top-right',    
    //          type: 'error',   
    //          title: 'You can not add more than 5 images',      
    //          showConfirmButton: false,     
    //          timer: 3000     
    //        }); 
    //     }
    // }
    handleUpload(event){
        event.preventDefault();
        let self = this;
     // this.setState({isUploading: true});
     // 
         
         Session.set("uploadDocumentProgressbar","");
            for (var i = 0; i < event.currentTarget.files.length; i++) {
              if (event.currentTarget.files[i]) {
                var dataImg = event.currentTarget.files[i]; 
                 if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){     
                   var reader = new FileReader();       
                   reader.onload = function (e) {         
                     // $('.uploadedImageFromLocl').attr('src', e.target.result);     
                   };      
                   reader.readAsDataURL(event.currentTarget.files[i]);     
                   var file = event.currentTarget.files[i];     
                    if (file) {     
                           
                      addImgsToS3Function(file,self);      
                    }  
                 } 
                 else {
                  swal({   
                     position: 'top-right',    
                     type: 'error',   
                     title: 'Please select image',      
                     showConfirmButton: false,     
                     timer: 1500     
                   });  
                }
              }
            }
           
    }
    handleVideoUpload(event){
        event.preventDefault();
        let self = this;
        if (this.props.ticketVideo.length >= 0 && this.props.ticketVideo.length < 1) {
            if (event.currentTarget.files.length > 1) {
                swal({   
                    position: 'top-right',    
                    type: 'error',   
                    title: 'You can not add more than one video',      
                    showConfirmButton: false,     
                    timer: 3000     
                }); 
            }else{
                if (event.currentTarget.files && event.currentTarget.files[0]) { 
                    var dataImg =event.currentTarget.files[0];
                    if(dataImg.type == "video/mp4"){      
                        var reader = new FileReader();       
                        reader.onload = function (e) {          
                        };       
                        var vid = document.createElement('video');
                        reader.readAsDataURL(event.currentTarget.files[0]);      
                        var file = event.currentTarget.files[0]; 
                        if (file) {         
                            var fileURL = URL.createObjectURL(event.currentTarget.files[0]);
                            vid.src = fileURL;
                            // wait for duration to change from NaN to the actual duration
                            vid.ondurationchange = function() {
                                var duration = this.duration;
                                if (duration <= 10) {
                                    addTicketVideoS3Function(file,self);       
                                }else{
                                    swal({    
                                        position: 'top-right',     
                                        type: 'error',    
                                        title: 'You are not allowed to add video Beyond 10Sec!',       
                                        showConfirmButton: false,      
                                        timer: 1500      
                                    });  
                                }   
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
         }    
        }else if (this.props.ticketVideo.length >= 1 ){
           swal({   
             position: 'top-right',    
             type: 'error',   
             title: 'You can not add more than one video',      
             showConfirmButton: false,     
             timer: 3000     
           }); 
        }
    
    }
    deleteTempImage(event){
        event.preventDefault();
        var id = $(event.currentTarget).attr('id');
        // 
        Meteor.call('deleteTempImage',id,function (error,result) {
          if (error) {
            
          }else{
            
          }
        });
    }
    deleteTempVideo(event){
        event.preventDefault();
        var id = $(event.currentTarget).attr('id');
        // 
        Meteor.call('deleteTempVideo',id,function (error,result) {
          if (error) {
            
          }else{
            
          }
        });
    }
    deleteImageFromticket(event){
        event.preventDefault();
        var id = $(event.currentTarget).attr('id');
        console.log('id: ', id);
        var dataIndex = parseInt($(event.currentTarget).attr('data-index'));
        console.log('dataIndex: ', dataIndex);
        Meteor.call('deleteImageFromSubmitDocument',id,dataIndex,function(error,result){
            if (error) {
                
            }else{
                
            }
        });
    }


    submitReport(event){
        event.preventDefault();
        var checkLists = [];
        var dataChk    = {};
        var remark     = [];
        var remarkObj  = {
            "dataRemark"  : "",
            "createdAt"   : new Date(),
        }
        //Get Values for all the text field
        var textLists = [];
        $('textarea.textObjs').each(function(i){
            var dataChk    = {};
            dataChk.task   = $(this).attr('id');
            dataChk.value  = $(this).val();
            textLists.push(dataChk);
        });
        var status      = this.refs.documentStatus.value;
        var actualStatus = status.split('-');
        // remark.push(this.refs.remark.value);
        if(actualStatus[0] == 'Completed'){
            if(this.props.EditValue){
                var status      = this.refs.documentStatus.value;
                // var subStatus   = this.refs.documentSubStatus.value;
                var images      = this.props.EditValue.images.concat(this.props.ticketImages);
                var videos      = this.props.EditValue.videos;
                var roleStatus  = "ProofResubmitted";
                var msg         = "Resubmitted Verification Information";
                remarkObj.dataRemark = this.refs.remark.value,
                remark          = this.props.EditValue.remark.concat(remarkObj);
                // remark          = this.props.EditValue.remark.push(remarkValue);

                // var docRemark      = this.refs.textarea#.value;
            }else{
                var status      = this.refs.documentStatus.value;
                // var status      = buttoValue;            
                // var subStatus   = this.refs.documentSubStatus.value;
                var images      = this.props.ticketImages;
                var videos      = this.props.ticketVideo;
                var roleStatus  = "ProofSubmit";
                var msg         = "Submitted Verification Information";
                remarkObj.dataRemark = this.refs.remark.value,
                remark.push(remarkObj);
            }

            var orderstatus  = "Verification Received";
            var bgColor      = "Bg-info";
            Meteor.call('updateTicketStatusColorIn',this.props.tickets._id,orderstatus,bgColor);
        }else{
            if(this.props.EditValue){
                var status      = this.refs.documentStatus.value;
                var images      = this.state.images.concat(this.props.ticketImages);
                var videos      = this.state.videos;
                var roleStatus  = "ProofResubmitted-Pending";
                var msg         = "Resubmitted Verification Information";
                remarkObj.dataRemark = this.refs.remark.value,
                remark          = this.props.EditValue.remark.concat(remarkObj);
            }else{
                var status      = this.refs.documentStatus.value;  
                var images      = this.props.ticketImages;
                var videos      = this.props.ticketVideo;
                var roleStatus  = "ProofSubmit-Pending";
                var msg         = "Submitted Verification Information";
                remarkObj.dataRemark = this.refs.remark.value,
                remark.push(remarkObj);
                           
            } 
            var orderstatus  = "Insufficiency";
            var bgColor      = "Bg-danger";
            Meteor.call('updateTicketStatusColorIn',this.props.tickets._id,orderstatus,bgColor);
        }
        // 
        if (this.state.chekFieldList.length > 0) {
            for (var i = 0; i < this.state.chekFieldList.length; i++) {
                if (this.state.chekFieldList[i].correctVal == "Incorrect") {
                  $("#remarkText-"+i).attr('required',true);
                }else{
                  $("#remarkText-"+i).attr('required',false);
                }        
            }
        }
        var documents ={
            checkLists : this.state.chekFieldList.length > 0 ? this.state.chekFieldList : this.state.checkLists ,
            textLists  : textLists,
            status     : status,
            images     : images,
            videos     : videos,
            remark     : remark,
            
        }
        if(documents.status != "Select"){
            var splitStatus = documents.status.split('-');
            if (splitStatus[0] == "Completed") {
               $("#ticketImageFile").attr('required',true);
            }else{
               $("#ticketImageFile").attr('required',false);
            }
            if (this.props.tickets) {
                if (this.props.tickets.ticketElement) {
                    if (this.props.tickets.ticketElement.length > 0) {
                        var ticketElements = this.props.tickets.ticketElement;
                        var teamMemberDetails = ticketElements.find(function (obj) { return obj.roleStatus == 'SelfAllocated' });

                    }
                }
                var role = Meteor.user().roles.find(this.getRole);
                if(role){
                    var insertData ={
                        "userId"              : Meteor.userId(),
                        "userName"            : Meteor.user().profile.firstname + ' ' + Meteor.user().profile.lastname,
                        "allocatedToUserid"   : teamMemberDetails.userId,
                        "allocatedToUserName" : teamMemberDetails.userName,
                        "role"                : role,
                        "roleStatus"          : roleStatus,
                        "msg"                 : msg,
                        "submitedDoc"         : documents,
                        "createdAt"           : new Date(),
                    }
                        
                }
                if($('#submitDocument').valid()){
                    Meteor.call('genericUpdateTicketMasterElement',this.props.tickets._id,insertData,function(error,result){
                        if (error) {
                          
                        }else{
        
                          $("#AddImagesVideo1").css({"display" : "none"});
                          $("#uploadButtonDiv").css({"display" : "none"});
                          $('#submitedDocWrap').css({"display" : "block"});
                        }
                    });
                }else{
                    $(event.target).parent().parent().parent().find('input.error').addClass('error');
                    // swal("Please upload document");
                    
                }
               
            }
        }else{

            swal({   
                position: 'top-right',    
                type: 'error',   
                title: 'Please fill mandatory fields',      
                showConfirmButton: false,     
                timer: 2000     
              });
        }
        //Fetch object ticketElement for getting information of Team Leader
    
    }
    /**================ Image Progress  Bar==================*/
    getUploadImagePercentage(){
        var uploadProgressPercent = Session.get("uploadDocumentProgressbar");
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
                    Session.set("uploadDocumentProgressbar",0); 
                }, 3000);
                
                 
            }
    
            return (
              <div className="progress"  style={styleCBar}>
                <div className="progress-bar progress-bar-striped active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
                  {percentVal} %
                </div>
              </div>
            );
        }
    }
    /**=========== Video Progress Bar ==============*/
    getUploadVideoPercentage(){
        var uploadProgressPercent = Session.get("uploadVideoProgressbar");
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
                    Session.set("uploadVideoProgressbar",0); 
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
    yesReason(event){
        event.preventDefault();
        var currentIndex = $(event.currentTarget).attr("data-indexVal");
        if(this.props.EditValue){     
            var data = this.props.EditValue.checkLists;
        }else{
            var data = this.state.chekFieldList.length>0 ? this.state.chekFieldList : this.props.chekFieldList;        
        }
        var newArr = [];
        for(i=0;i<data.length;i++){
            if(i==currentIndex){
                data[i].correctVal = "Correct";
                newArr.push(data[i]);
            }else{
                newArr.push(data[i]);
            }
        }
        this.setState({
            chekFieldList:data,
        })
        
        $(event.target).css({'backgroundColor':'#00b8ff','color':'#fff'});        
        $(event.target).siblings().css({'backgroundColor':'#fff','color':'#00b8ff'});
 
              
      }

    noReason(event){
     event.preventDefault();

        var currentIndex = $(event.currentTarget).attr("data-indexVal");
        if(this.props.EditValue){     
            var data = this.props.EditValue.checkLists;
        }else{
            var data = this.state.chekFieldList.length>0 ? this.state.chekFieldList : this.props.chekFieldList;        
        }
        var newArr = [];
        for(i=0;i<data.length;i++){
            if(i==currentIndex){
                data[i].correctVal = "Incorrect";
                newArr.push(data[i]);
            }else{
                newArr.push(data[i]);
            }
        }
        this.setState({
            chekFieldList:data,
        })
      
            $(event.target).css({'backgroundColor':'#00b8ff','color':'#fff'});
            $(event.target).siblings().css({'backgroundColor':'#fff','color':'#00b8ff'});
        }

        removechecked = (index)=>{
            var currentData = this.state.checkLists;
            var newArr = [];
            for(i=0;i<currentData.length;i++){
                if(i==index){
                    var newObj = {
                        statement:currentData[i].statement,
                        status:!currentData[i].status,
                        value:!currentData[i].status,
                    }
                    
                    newArr.push(newObj);
                    
                }else{
                    newArr.push(currentData[i]);
                }
            }
            this.setState({
                checkLists: newArr,
            })
            
    }
    
    getRemark(event){
        event.preventDefault();

        var currentIndex = $(event.currentTarget).attr("data-indexVal");
        var currentIndexval = event.target.value;
        
        var data = this.state.chekFieldList.length>0 ? this.state.chekFieldList : this.props.chekFieldList;
        var newArr = [];
        for(i=0;i<data.length;i++){
            if(i==currentIndex){
                data[i].remarkVal = currentIndexval;
                newArr.push(data[i]);
            }else{
                newArr.push(data[i]);
            }
        }
        this.setState({
            chekFieldList:data,
        })
    }
    pancardInt(event){
      event.preventDefault();
      if($('#pancardvalidateForm').valid()){
        var panCardNumber = (this.refs.panCardNumber.value).trim();
        var ticketId      = this.props.tickets._id;
        Meteor.call('pancardvalidate',panCardNumber,ticketId,function (error,result) {
            if (error) {
                
                swal("Invalid Pan card");
            }else{
                
                // 
                $('#submitPancardButtons').hide();
                // $("#pancardVerificationModal").modal('hide');
            }
          });
      }
    } 
    render(){
        var chekFieldList  = this.state.chekFieldList.length>0 ? this.state.chekFieldList :  this.props.chekFieldList;
        // console.log('chekFieldList: ', chekFieldList);
        return(
            <div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 choosefilebox">
                    <form id="submitDocument">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wholeborder ">
                            <div className="imgtitile col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad Selectimg"> <b>Verified Information:</b></div>
                            </div>
                            {/* Check List Display */}
                            {this.props.EditValue ?
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerChecklisttoteamM">
                                    {this.state.checkLists ?
                                        this.state.checkLists.map((checkObjsDefault,index)=>{
                                            return(
                                                <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 innerChecklisttoteamM noLRPad" key={index}>  
                                                    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 noLRPad">
                                                        <label className = "col-lg-12" name ="checkObjs">{checkObjsDefault.titleVal}</label>
                                                        <div className="col-lg-12 col-lg-offset-0 outerInfo">
                                                            {
                                                                checkObjsDefault.textVal ?
                                                                   checkObjsDefault.textVal.map((checkObjsRelatedField,index)=>{
                                                                    return checkObjsRelatedField.dbField != "residingFrom" ?

                                                                        <span key={index} className="">{checkObjsRelatedField.value},&nbsp;</span>
                                                                    :
                                                                        <span key={index} className="">{moment(checkObjsRelatedField.value).format("DD/MM/YYYY")} ,&nbsp;</span>
                                                                    })
                                                                :
                                                                 null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad correctBtn">
                                                        <button type="button" className= {checkObjsDefault.correctVal =="Correct" ? "btn btn-info noDataButton active":"btn noDataButton Correctborder transparentbg"}  data-indexVal={index} data-value= "Correct" onClick={this.yesReason.bind(this)}>Correct</button>
                                                        <button type="button" className= {checkObjsDefault.correctVal == "Incorrect" ? "btn btn-info noDataButton active": "btn noDataButton Correctborder transparentbg"} data-indexVal={index} data-value = "Incorrect" onClick={this.noReason.bind(this)}>Incorrect</button>
                                                    </div>
                                                    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                        <span className="col-lg-12 noLRPad">Remark &nbsp;</span>
                                                        <textarea rows="3" cols="60" className="col-lg-12"  value={checkObjsDefault.remarkVal} data-indexVal={index} id={"remarkText-"+index} onChange={this.getRemark.bind(this)}/>
                                                    </div>  
                                                 </div>
                                                
                                              );
                                        })
                                    : 
                                        ""
                                    }
                                </div>
                               :

                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerChecklisttoteamM">
                                    {chekFieldList ?
                                        chekFieldList.map((checkObjsDefault,index)=>{
                                        return(
                                            <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 innerChecklisttoteamM noLRPad" key={index}>  
                                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 noLRPad">
                                                    <label className = "col-lg-12" name ="checkObjs">{checkObjsDefault.titleVal}</label>
                                                    <div className="col-lg-12 col-lg-offset-0 outerInfo">
                                                        {
                                                            checkObjsDefault.textVal ?
                                                               checkObjsDefault.textVal.map((checkObjsRelatedField,index)=>{                                                               
                                                                    return checkObjsRelatedField.dbField != "residingFrom" ?

                                                                        <span key={index} className="">{checkObjsRelatedField.value},&nbsp;</span>
                                                                    :
                                                                        <span key={index} className="">{moment(checkObjsRelatedField.value).format("DD/MM/YYYY")} ,&nbsp;</span>
                                                                })
                                                            :
                                                             null
                                                        }
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6 noLRPad correctBtn">
                                                    <button type="button" className= {checkObjsDefault.correctVal =="Correct" ? "btn btn-info noDataButton active":"btn noDataButton Correctborder"}  data-indexVal={index} data-value= "Correct" onClick={this.yesReason.bind(this)}>Correct</button>
                                                    <button type="button" className= {checkObjsDefault.correctVal == "Correct" ? "btn btn-info noDataButton": "btn btn-info noDataButton active"} data-indexVal={index} data-value = "Incorrect" onClick={this.noReason.bind(this)}>Incorrect</button>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6">
                                                    <span className="col-lg-12 noLRPad">Remark &nbsp;</span>
                                                    <textarea rows="3" cols="60" className="col-lg-12"  data-indexVal={index} id={"remarkText-"+index} onChange={this.getRemark.bind(this)}/>
                                                </div>  
                                             </div>
                                            
                                          );
                                        })
                                    :
                                        null
                                    }
                                </div>
                            } 
                            {/* Data from user */}
                            {this.props.EditValue ? 
                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.state.textLists ?
                                    this.state.textLists.map((textObjsUsrUpload, index)=>{
                                        return(
                                        <div className="imgtitile col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad" key={index}>
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3  Selectimg">{textObjsUsrUpload.task}:</div>
                                            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-7">
                                                <textarea className="form-control textObjs" id={textObjsUsrUpload.task} data-index={index} name="textObjs" value={textObjsUsrUpload.value} ref="textObjs" rows="1" onChange={this.handleChangeForArray}></textarea>
                                            </div>
                                        </div>
                                        );
                                    })
                                    :
                                        ""
                                    }
                               </div>
                              
                            : 
                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.props.textObjs ?
                                    this.props.textObjs.map((textObjsUsrUpload, index)=>{
                                        return(
                                        <div className="imgtitile col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad" key={index}>
                                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3  Selectimg">{textObjsUsrUpload.task}:</div>
                                            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-7">
                                                <textarea className="form-control textObjs" id={textObjsUsrUpload.task} name="textObjs" ref="textObjs" rows="1" onChange={this.handleChange} required>
                                                </textarea>
                                            </div>
                                        </div>
                                        );
                                    })
                                    :
                                        ""
                                    }
                               </div>

                            }
                            
                            {/* Images upload and Display */}
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wholeborder ">
                                <div className="imgtitile col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad Selectimg"> Select images:
                                    </div>
                                    <input type="file" ref="ticketImageFile" id="ticketImageFile" name="ticketImageFile"  onChange={this.handleUpload.bind(this)} className="col-lg-12 noLRPad" multiple/>
                                </div>
                                {/*<label>(You can choose maximum 5 images)</label>*/}
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    
                                    {this.getUploadImagePercentage()}
                                </div>
                                <div className="col-lg-12 bcolor">
                                    <div className="col-lg-12 noLRPad Selectimg">Added Images will show here</div>                              
                                </div>
                            </div>
                            {!this.props.loading ?
                                <div className="col-lg-11 col-md-12 col-sm-12 col-xs-12 imgbox">
                                    {  this.props.EditValue ?
                                        <div>
                                          { this.props.EditValue.images? 
                                                this.props.EditValue.images.map((ticketImages,index) =>{
                                                    return(
                                                     ticketImages == null ?
                                                        <div className="" key={index}>
                                                        </div>
                                                       :   
                                                        <div className="col-lg-3 imgbrPre" key={index}>
                                                           <i className="fa fa-times pull-right tempImageDelete" id={this.props.ticketId} data-index={index} onClick={this.deleteImageFromticket.bind(this)}></i>
                                                            <div className="imgbr">
                                                            <img src={ticketImages.imageLink} className="img1 img-responsive" />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            :
                                            ""
                                          }
                                          {
                                              this.props.ticketImages ? 
                                                   this.props.ticketImages.length > 0 ?
                                                    this.props.ticketImages.map((ticketImages,index) =>{
                                                        return(
                                                           ticketImages == null ?
                                                            <div className="" key={index}>
                                                            </div>
                                                           :   
                                                            <div className="col-lg-3 imgbrPre" key={index}>
                                                                <i className="fa fa-times pull-right tempImageDelete" id={ticketImages._id} onClick={this.deleteTempImage.bind(this)}></i>
                                                                <div className="imgbr">
                                                                <img src={ticketImages.imageLink} className="img1 img-responsive" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                    :
                                                 ""
                                                :
                                                ""
                                             }

                                          </div>

                                        :
                                            this.props.ticketImages ? 
                                               this.props.ticketImages.length > 0 ?
                                                this.props.ticketImages.map((ticketImages,index) =>{
                                                    return(
                                                      ticketImages == null ?
                                                        <div className="" key={index}>
                                                        </div>
                                                       :   
                                                        <div className="col-lg-3 imgbrPre" key={index}>
                                                            <i className="fa fa-times pull-right tempImageDelete" id={ticketImages._id} onClick={this.deleteTempImage.bind(this)}></i>
                                                            <div className="imgbr">
                                                            <img src={ticketImages.imageLink} className="img1 img-responsive" />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                               :
                                               ""
                                            :
                                         ""
                                    }
                                </div>
                            :
                                ""
                            } 
                            {/* End of Images upload and Display */}
                          {/* Video upload and Display */}
                            <div className="col-lg-12 wholeborder">
                                <div className="imgtitile col-lg-12 ">
                                    <div className="col-lg-12 noLRPad Selectimg"> Select Video:</div>
                                        <input type="file" ref="ticketVideoFile" id="s3file" name="ticketVideoFile"  onChange={this.handleVideoUpload.bind(this)} className="col-lg-12 noLRPad" multiple/>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="videoProgressbar" >
                                    {/* <div id="errorProofList"></div> */}
                                    {this.getUploadVideoPercentage()}
                                </div>
                                <div className="col-lg-12 bcolor">
                                    <div className="col-lg-12 noLRPad Selectimg">Added Videos will show here</div>                              
                                </div>
                            </div>
                           <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12 imgbox">

                            {
                                this.props.EditValue ?
                                  <div>
                                    <div>
                                      {
                                        this.props.ticketVideo ?
                                        this.props.ticketVideo.length > 0 ?
                                            this.props.ticketVideo.map((ticketVideo,index) =>{
                                                return(
                                                ticketVideo == null ?
                                                <div key={index}>

                                                </div>
                                                :   
                                                <div className="col-lg-4 imgbrvid" key={index}>
                                                    <i className="fa fa-times pull-right tempImageDelete" id={ticketVideo._id} onClick={this.deleteTempVideo.bind(this)}></i>
                                                    <video width="200" height="200"  controls>
                                                        <source src={ticketVideo.videoLink} type="video/mp4" />
                                                    </video>
                                                </div>
                                                );
                                            })
                                            :
                                            ""
                                        :
                                      ""
                                      }
                                    </div>
                                    <div> 
                                      {
                                        this.props.EditValue.videos? 
                                            this.props.EditValue.videos.map((ticketVideo,index) =>{
                                                return(
                                                ticketVideo == null ?
                                                <div key={index}>

                                                </div>
                                                :   
                                                <div className="col-lg-4 imgbrvid" key={index}>
                                                    <video width="200" height="200"  controls>
                                                        <source src={ticketVideo.videoLink} type="video/mp4" />
                                                    </video>
                                                </div>
                                                );
                                        })
                                        :
                                            ""
                                      }

                                    </div>                           
                                  </div> 
                                :
                                   this.props.ticketVideo ?
                                        this.props.ticketVideo.length > 0 ?
                                            this.props.ticketVideo.map((ticketVideo,index) =>{
                                                return(
                                               ticketVideo == null ?
                                                <div key={index}>

                                                </div>
                                                :   
                                                <div className="col-lg-4 imgbrvid" key={index}>
                                                    <i className="fa fa-times pull-right tempImageDelete" id={ticketVideo._id} onClick={this.deleteTempVideo.bind(this)}></i>
                                                    <video width="200" height="200"  controls>
                                                        <source src={ticketVideo.videoLink} type="video/mp4" />
                                                    </video>
                                                </div>
                                                );
                                            })
                                        :
                                        ""
                                    :
                                  ""
                            }
                            </div>
                            {/* End of Video upload and Display */}
                            {/* Status and Sub Status */}
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerStatusBlock">
                                {/* Status Block */}
                                <div className="imgtitile col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3  Selectimg statusTitle"> Status:<span className="starcolor">*</span></div>
                                    <div className="col-lg-8 col-md-8 col-sm-9 col-xs-9">
                                        <select className="form-control inputText documentStatus required" defaultValue ="0" ref="documentStatus" id="documentStatus" defaultValue={this.state.status ? this.state.status : ''} name="documentStatus" onChange={this.handleChange}>
                                            <option value="Select">-- Select --</option>
                                            <option value="Initiated">Initiated</option>
                                            <option value="WIP">WIP ( Work in Progress)</option>
                                            <option value="Insufficiency">Insufficiency</option> 
                                            <option value="Insufficiency Cleared">Insufficiency Cleared</option> 
                                            <option value="Completed-Clear">Completed - Clear</option> 
                                            <option value="Completed-Minor Discrepancy">Completed - Minor Discrepancy</option> 
                                            <option value="Completed-Major Discrepancy">Completed - Major Discrepancy</option> 
                                            <option value="Completed-Inaccessible">Completed - Inaccessible</option> 
                                            <option value="Completed-Unable to Verify">Completed - Unable to Verify</option> 
                                            <option value="Completed-Cancelled">Completed - Cancelled</option> 
                                            {/*<option value="Completed-Case Drop">Completed - Case Drop</option>*/}
                                            <option value="Completed-Stop Checked">Completed - Stop Checked</option>
                                            
                                        </select>
                                    </div>
                                </div>{/* Status Block */}
                                <div className="imgtitile col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                    <button type="button" className="btn btn-success pull-right" data-toggle="modal" data-target="#sendEmailModal" >Send Email</button>
                                    <div className="modal fade" id="sendEmailModal" role="dialog">
                                        <div className="modal-dialog modal-sm">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                                              <h4 className="modal-title">Add Email Id</h4>
                                            </div>
                                            <div className="modal-body" >
                                              <form className="col-lg-12 col-sm-12 col-md-12 col-xs-12" >
                                                 <div className="form-group col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                                    <label className="col-lg-12 col-sm-12 col-md-12 col-xs-12">To :</label>
                                                    <input type="email" className="form-control col-lg-12 col-sm-12 col-md-12 col-xs-12" ref="supportEmailId" name="supportEmailId" id="supportEmailId" onChange={this.handleChange}/>
                                                 </div> 
                                                 <div className="form-group col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                                    <label className="col-lg-12 col-sm-12 col-md-12 col-xs-12">From :</label>
                                                    <input type="email" className="form-control col-lg-12 col-sm-12 col-md-12 col-xs-12" ref="fromEmailId" name="fromEmailId" id="fromEmailId" onChange={this.handleChange}/>
                                                 </div> 
                                              </form>
                                            </div>
                                            <div className="modal-footer">
                                              <button type="button" className="btn btn-success" onClick={this.sendEmailTosupportTeam.bind(this)}>Send</button>
                                              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                            </div>
                                          </div>
                                        </div>
                                    </div> 
                                    {
                                        this.props.tickets.verificationType == "Identity" ? 
                                          this.props.tickets.verificationData.identityType == "Pan Card" ?
                                            <div>
                                                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#pancardVerificationModal">Pan Card Verification</button>                            
                                                <div className="modal fade" id="pancardVerificationModal" role="dialog">
                                                    <div className="modal-dialog modal-md">
                                                      <div className="modal-content">
                                                        <div className="modal-header">
                                                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                          <h4 className="modal-title">Add Pan card number</h4>
                                                        </div>
                                                        <div className="modal-body col-lg-12 col-sm-12 col-md-12 col-xs-12" >
                                                          <form className="col-lg-12 col-sm-12 col-md-12 col-xs-12" id="pancardvalidateForm">
                                                             <div className="form-group col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                                                <label className="col-lg-12 col-sm-12 col-md-12 col-xs-12">Pan Card No.(xxxxxxxxxx) :</label>
                                                                <input type="text" className="form-control" ref="panCardNumber" name="panCardNumber" id="panCardNumber" onChange={this.handleChange.bind(this)}/>
                                                             </div> 
                                                          </form>
                                                          {this.props.tickets.verifiedData ?
                                                             this.props.tickets.verifiedData.data.length > 0 ?
                                                                this.props.tickets.verifiedData.data.map((data,index)=>{
                                                                    return(
                                                                         <div key={index}>
                                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                                                                             <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span><b>Pan card number</b></span>
                                                                              <span className="pull-right">:</span>
                                                                            </div> 
                                                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span>{data.pan_number}</span>
                                                                            </div>
                                                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span><b>Pan card holder name</b></span>
                                                                              <span className="pull-right">:</span>
                                                                            </div>
                                                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span>{data.pan_holder_title} {data.first_name} {data.middle_name} {data.last_name}</span>
                                                                            </div>
                                                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span><b>Pan card status</b></span>
                                                                              <span className="pull-right">:</span>
                                                                            </div>
                                                                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                                                              <span>{data.pan_status}</span>
                                                                            </div>
                                                                          </div>
                                                                         
                                                                        </div>
                                                                    );                                                                    
                                                                })                                                                  
                                                              : 
                                                              null
                                                            :
                                                            null
                                                          }
                                                        </div>
                                                        <div className="modal-footer">
                                                          <button type="button" className="btn btn-success" id="submitPancardButtons" onClick={this.pancardInt.bind(this)}>Submit</button>
                                                          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                                          {this.props.tickets.verifiedData ?
                                                             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                               <p style={{"color":"red"}}>Note : Please make sure to take screenshot befor closing dialog box.</p> 
                                                              </div>
                                                            :
                                                            null
                                                           }
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
                                    
                               </div>
                                {/* Sub Status Block */}
                                {/*<div className="imgtitile col-lg-6 col-md-6 col-sm-12 col-xs-12 noLRPad">
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3  Selectimg statusTitle"> Sub-status:<span className="starcolor">*</span></div>
                                    <div className="col-lg-8 col-md-8 col-sm-9 col-xs-9">
                                        <select className="form-control inputText documentSubStatus" ref="documentSubStatus" id="documentSubStatus" defaultValue={this.state.subStatus ? this.state.subStatus : ''} name="documentSubStatus" onChange={this.handleChange}>
                                            <option value="Select">-- Select --</option>
                                            <option value="Clear">Clear</option>
                                            <option value="Minor Discrepancy">Minor Discrepancy</option>
                                            <option value="Major Discrepancy">Major Discrepancy</option>
                                            <option value="Inaccessible">Inaccessible</option>
                                            <option value="Unable to Verify">Unable to Verify</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Case Drop">Case Drop</option>
                                        </select>
                                    </div>
                                </div> Sub Status Block */}
                            </div>{/* End Status and Sub Status */}
                            {/* Remark Block */}
                            <div className="col-lg-12 wholeborder">
                                <div className="imgtitile col-lg-12 ">
                                    <div className="col-lg-12 noLRPad Selectimg">Remark:<span className="starcolor1">*</span></div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                                    <textarea className="form-control col-lg-12 col-sm-12 col-md-12 col-xs-12" name="remark" ref="remark" id="remark" onChange={this.handleChange} rows="5" id="remark" required ></textarea>          
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  wholeborder text-center">
                                <button type="submit" onClick={this.submitReport.bind(this)}className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            );
        }       
    }
VerificationDataSubmitContainer = withTracker(props => { 
    const ticketId     = props.ticketId;
    var chekFieldList  = props.chekFieldList;
    const postHandle   = Meteor.subscribe('allTicketImages');
    const postHandle1  = Meteor.subscribe('allTicketVideo');
    const postHandle2  = Meteor.subscribe('checklistFieldExpert');
    const postHandle3  = Meteor.subscribe('singleTicket',ticketId);
    const ticketImages = TempTicketImages.find({}).fetch() || []; 
    
    const ticketVideo  = TempTicketVideo.find({}).fetch() || [];  
    const loading     = !postHandle.ready();
    const loading1    = !postHandle1.ready();
    const loading3    = !postHandle3.ready();
    var checkList     = [];
    if (ticketId) {
        var tickets =  TicketMaster.findOne({"_id" : ticketId});       
        if (tickets) {
          const orderHandle  = Meteor.subscribe("singleOrder",tickets.orderId);
          const orderLoading = !orderHandle.ready();
          var singleOrder    = Order.findOne({"_id" : tickets.orderId}) || {};
            var verificationType = tickets.verificationType;
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
            }else if (verificationType == 'Identity'){
                var checkListFrom = "Identity Information";
            }else if (verificationType == 'reference') {
                var checkListFrom = "Reference Information";
            }
            var checkListObjs = ChecklistFieldExpert.find({"checkListFor" : checkListFrom}).fetch();
            // console.log('checkListObjs: ', checkListObjs);
            var checkObjs = [];
            var textObjs = [];
            if (checkListObjs) {
                for (var i = 0; i < checkListObjs.length; i++) {
                    if(checkListObjs[i].checkListFrom == 'Database'){
                        if(checkListFrom == "Address Information"){
                            if(verificationType == "permanentAddress"){
                                for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                    checkListObjs[i].relatedFields[j].value = tickets.verificationData[checkListObjs[i].relatedFields[j].dbField];   
                                }
                            }else{
                                for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                    var tempVar = 'temp'+checkListObjs[i].relatedFields[j].dbField;
                                    checkListObjs[i].relatedFields[j].value = tickets.verificationData[tempVar];   
                                }
                            }
                        }else{
                            for(j = 0 ; j < checkListObjs[i].relatedFields.length; j++){
                                checkListObjs[i].relatedFields[j].value = checkListObjs[i].relatedFields[j].dbField + ':'+tickets.verificationData[checkListObjs[i].relatedFields[j].dbField];   
                            }
                        }
                        checkObjs.push(checkListObjs[i]); 
                    }else{
                        textObjs.push(checkListObjs[i]); 
                        
                    }
                }
                
            }

        }
    }
    // console.log("singleOrder :",singleOrder);
    return {
        loading      : loading,
        loading1     : loading1,
        ticketImages : ticketImages,
        ticketVideo  : ticketVideo,
        ticketId     : ticketId,
        tickets      : tickets,
        chekFieldList    : chekFieldList,
        textObjs     : textObjs,
        singleOrder
    };
})(VerificationDataSubmit);
export default VerificationDataSubmitContainer;