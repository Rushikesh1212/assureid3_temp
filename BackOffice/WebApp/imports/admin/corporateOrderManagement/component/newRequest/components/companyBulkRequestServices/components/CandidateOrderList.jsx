import React,{Component} from 'react';
import {render} from 'react-dom'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
import {Order} from '/imports/admin/orderManagement/api/Order.js';
import {HolidaysList} from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';

require('moment-weekday-calc');

// ticket generation logic
ticketGeneration = function(Orders,index,matchCandidateIndex,serviceid,serviceRequired){ 
    let self = this; 
    var cnt = false;
    if(index >= 0){
      if (Orders.candidateDetails[matchCandidateIndex].verificationData[index].documents || Orders.candidateDetails[matchCandidateIndex].verificationData[index].proofOfDocument || serviceRequired == "CriminalRecords") 
      {
        /**Generate ticket accroding to service details or package details */
        if(Orders.serviceDetails){
          var serviceId         = Orders.serviceDetails.serviceId;
          var serviceName       = Orders.serviceDetails.serviceName;
          var serviceDayNumbers = Orders.serviceDetails.serviceDayNumbers;
          var serviceImage      = Orders.serviceDetails.serviceImage;
          var serviceImgFileExt = Orders.serviceDetails.serviceImgFileExt;  
          var serviceRequired   = Orders.serviceDetails.verificationType;
          cnt = true;              
        }else if(Orders.packageDetails){ 
          var service = Orders.packageDetails.servicesIncluded.find((obj)=>{ return obj.serviceId == serviceid});    
          if(service){
            var serviceId         = service.serviceId;
            var serviceName       = service.serviceName;
            var serviceDayNumbers = service.serviceCompletionDays;
            var serviceImage      = service.serviceImage;
            var serviceImgFileExt = service.serviceImgFileExt;
            var serviceRequired   = service.verificationType;
            cnt = true;
          }
        }
        if(cnt){ 
          var newTicket = {
            "orderId"           : Orders._id,
            "orderNo"           : Orders.orderNo,
            "orderDate"         : Orders.createdAt,
            "assureId"          : Orders.candidateDetails[matchCandidateIndex].candidateAssureID,
            "serviceId"         : serviceId,
            "serviceName"       : serviceName,
            "serviceDayNumbers" : serviceDayNumbers,
            "serviceImage"      : serviceImage,
            "serviceImgFileExt" : serviceImgFileExt,
            "serviceRequired"   : serviceRequired,
            "corporateDetails"  : Orders.companyDetails,
            "tatDate"           : Orders.tatDate,
            "type"              : Orders.type,
            // "userId"            : Orders.candidateDetails[matchCandidateIndex].candidateId,
            "userId"            : Orders.candidateDetails[matchCandidateIndex].candidateId,
            "userName"          : Orders.candidateDetails[matchCandidateIndex].candidateFirstName+" "+Orders.candidateDetails[matchCandidateIndex].candidateLastName,
            "verificationType"  : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationType,
            "verificationId"    : Orders.candidateDetails[matchCandidateIndex].verificationData[index].verificationId,
            "verificationData"  : Orders.candidateDetails[matchCandidateIndex].verificationData[index],
            "matchCandidateIndex":matchCandidateIndex,
          };
          // console.log("newTicket",newTicket);
          Meteor.call('createTicket',newTicket,index,function (error,result) {
          if (error) {
            console.log('createTicket error ',error);
          }else if(result){
            // console.log('createTicket result ',result);
            self.ticketGeneration(Orders,index-1,matchCandidateIndex,serviceid);
          }
        });
        }
      }else{
        // Meteor.call('updateVerificationDataStatusToPending',Orders._id,matchCandidateIndex,index,"Pending from Applicant") 
        self.ticketGeneration(Orders,index-1,matchCandidateIndex,serviceid);

      }
     
    }else{
      return;
    }
}
class CandidateOrderList extends TrackerReact(Component) {
  
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    }
  } 
  handleChange(event){
   event.preventDefault();
   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
   });
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

  submitOrders(event){ 
    event.preventDefault();
    var orders    = this.props.orderDetails;
    var assureId  = this.props.assureId;
    var serviceid = this.props.serviceid;
    var corporatDetailsId = this.props.corporatDetails._id;
    var serviceRequired   = this.props.serviceRequired;
    var todayDate = new Date();
    if (this.props.candidateList.length > 0) {
     if(orders){
        orders.map((orders)=>{
          var verificationDataLen = 0;
          if(orders.serviceDetails!=undefined){
            var noOFDays = orders.serviceDetails.serviceCompletionDays
            // console.log('noOFDays: ', noOFDays);
          }else{
           var servicesIncluded = orders.packageDetails.servicesIncluded.find((obj)=>{
              return obj.serviceId == serviceid;
            })
           if (servicesIncluded) {
             var noOFDays = servicesIncluded.serviceCompletionDays;    
           }
          }
          console.log("noOFDays :",noOFDays);
           var tatDate1 = moment().addWorkdays(parseInt(noOFDays),this.props.holidaysList);
           let self = this;
           orders.tatDate = new Date(tatDate1); 
           if (tatDate1) {
              Meteor.call('updateOrdertatdate',orders._id,new Date(tatDate1),function (error,result) {
                if (error) {
                  console.log("Error while in TAT Date updateOrdertatdate");
                }else{              
                }
              });
             
             if (orders.candidateDetails) {
                var candidateLen = orders.candidateDetails.length;
                orders.candidateDetails.map((candidateDetails,i)=>{
                  if (candidateDetails.verificationData) {
                    var verificationData = candidateDetails.verificationData.filter((veriData)=>{
                      return veriData.serviceId == serviceid 
                    });
                    if (verificationData.length > 0 ) {
                      verificationDataLen = verificationData.length;
                      var index           = verificationDataLen - 1;

                      ticketGeneration(orders,index,i,serviceid,serviceRequired);
                    }
                  }
                  //   if (verificationData.length > 0 ) {
                  //     verificationDataLen = verificationData.length;
                  //     var index           = verificationDataLen - 1;
                  //     ticketGeneration(orders,index,i,serviceid);
                  //   }else{
                  //     var docsNotPresent = candidateDetails.verificationData.filter((verificationData)=>{
                  //       return verificationData.proofOfDocument != '' && verificationData.verificationType == "Identity"
                  //     })
                  //     if (docsNotPresent.length > 0) {
                  //       verificationDataLen = docsNotPresent.length;
                  //       var index           = verificationDataLen - 1;
                  //       ticketGeneration(orders,index,i,serviceid);
                  //     }
                  //   }
                  // } 
               }); 
                Meteor.call('updateorderDetails',corporatDetailsId,candidateLen,verificationDataLen,orders._id,serviceid);
                FlowRouter.go("/newRequest/"+corporatDetailsId+"/detailOrder/"+assureId+"/"+serviceid);
             }
           }
        }); 
      }
    }
  }

  inputFileChange(event){
    event.preventDefault();
    var index = $(event.currentTarget).attr('data-id');
    var dataSubtype = $(event.currentTarget).attr('data-subtype');
    if($('#proofType-'+index).val() != '-- Select --'){
        console.log("in if :",'#inputFile-'+index);
        $('#inputFile-'+index).click();
        $('#proofType-'+index).removeClass('error');
    }else{
      swal('Please select the '+dataSubtype+' proof type.');
      $('#proofType-'+index).addClass('error has-content');
    }
  }
  // upload proof for address,employement,education
  uploadProofDocs(event){ 
    event.preventDefault();
    var proofSubtype = $(event.currentTarget).attr('data-subtype');
    let self = this;   
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file      = event.currentTarget.files[0]; 
      var currentId = $(event.currentTarget).attr('id'); 
      var id        = currentId.split('-');
      var userId    = id[1]; 
      var dataIndex = id[2];
      var orderId   = $(event.currentTarget).attr("data-orderid");
      var verificationid = $(event.currentTarget).attr("data-verificationid");
      var proofTypeName  = $('#proofType-'+userId+"-"+dataIndex).val();
      Session.set(userId+"-"+dataIndex,"");

      // console.log("proofTypeName",proofTypeName);
      if (file) {
        var fileName  = file.name;
        // var fileSize  = file.size;
        // var size      = 2000000;
        var prooftype = $(event.currentTarget).attr('data-prooftype');
        // console.log("verificationid",verificationid);
        var ext       = fileName.split('.').pop();
        console.log("ext",ext);
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG" ){
          if (verificationid && prooftype) {
            addProofToS3Function(userId,file,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid,self);                       
            event.currentTarget.value = null;
          }else{
            swal("File not uploaded","Something went wrong","error");
          }
        }else{
            swal("Please upload file","in images format","error");
        }
      }
    }
  }
  //upload the document for identity 
  uploadProofDocsForIdentity(event){
    let self = this;   
    Session.set("uploadProofIdentityDocProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file         = event.currentTarget.files[0]; 
      var currentId    = $(event.currentTarget).attr('id'); 
      var id           = currentId.split('-');
      var userId       = id[1];
      var dataIndex    = id[2];
      var orderId      = $(event.currentTarget).attr("data-orderid");
      var card         = $(event.currentTarget).attr("data-card").split('-');
      var cardType     = card[0];
      var carNo        = card[1];
      var proofSubtype = $(event.currentTarget).attr('data-subtype');
      
      if (file) {
        var fileName  = file.name;
        var prooftype = $(event.currentTarget).attr('data-prooftype');
        var ext       = fileName.split('.').pop();
        var data = {
         "prooftype"    : prooftype,
         "proofSubtype" : proofSubtype,
         "dataIndex"    : dataIndex,
         "orderId"      : orderId,
         "cardType"     : cardType,
         "carNo"        : carNo,
        }
        console.log("data",data);
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){
          if (prooftype) {
            addIdentityProofToS3Function(userId,file,data,self);                       
          }else{
            swal("File not uploaded","Something went wrong","error");
          }
        }else{
            swal("Please upload file","in images format","error");
        }
      }
    }
  }
  // Progressbar for All the address,employement,education
  getUploadImagePercentage(candidateId,dataIndex){
    // console.log("candidateId",candidateId);
    // console.log("dataIndex",dataIndex);
    var uploadProgressPercent = Session.get(candidateId+'-'+dataIndex);
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
              Session.set(candidateId+'-'+dataIndex,0); 
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
  // Progressbar for Identity
  getUploadIdentityImagePercentage(){
    var uploadProgressPercent = Session.get("uploadProofIdentityDocProgressPercent");
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
              Session.set("uploadProofIdentityDocProgressPercent",0); 
          }, 5000);     
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
  // delete documents from verification data
  delDocumentsFromVerificationData(event){
    event.preventDefault();
    var currentId   = $(event.currentTarget).attr('id').split('-');
    // console.log("currentId",currentId);
    var orderId               = currentId[0];
    var candidateId           = currentId[1];
    var verificationDataIndex = currentId[2];
    var documentIndex         = currentId[3];
    Meteor.call('delDocumentsFromVerificationData',orderId,candidateId,verificationDataIndex,documentIndex,function (error,result) {
      if (error) {
        console.log(error.reson);
      }else{
       console.log("successfully deleted");
      }
    });
  }
  // delete documents from verification data
  delFromIdentityVerificationData(event){
    event.preventDefault();
    var currentId   = $(event.currentTarget).attr('id').split('-');
    var orderId      = currentId[0];
    var candidateId = currentId[1];
    var verificationDataIndex = currentId[2];
    var docs  = $(event.currentTarget).attr('data-docs');
    Meteor.call('delFromIdentityVerificationData',orderId,candidateId,verificationDataIndex,docs,function (error,result) {
      if (error) {
        console.log(error.reson);
      }else{
       console.log("successfully deleted");
      }
    });
  }
  // In case of case reopen update ticket
  updateTicketAfterReopen(event){
    event.preventDefault();
    var ticketId           = $(event.currentTarget).attr('data-ticketid');
    var orderSplit         = $(event.currentTarget).attr('data-order').split('-');
    var orderId            = orderSplit[0];
    var candidateId        = orderSplit[1];
    var verificationDataId = orderSplit[2];
    Meteor.call('updateTicketVerificationDoc',ticketId,orderId,candidateId,verificationDataId);
  }
  //Ticket Raise in case of documents are not present
  generateTicketForSingleOrder(event){ 
    event.preventDefault();
    var orderSplit         = $(event.currentTarget).attr('data-order').split('-');
    var orderId            = orderSplit[0];
    var candidateId        = orderSplit[1];
    var verificationDataId = parseInt(orderSplit[2]);
    var holidaysList       = this.props.holidaysList;
    var serviceId          = this.props.serviceid;

    Meteor.call("generateTicketForSingleVerification",orderId,candidateId,verificationDataId,holidaysList,serviceId);
  }
  // show error while bulk upload
  showErrorList(faildList){
    return <div>
     <p className="text-danger text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Error In following fields.</p>
     <table className="table empVerifListTable table-striped table-bordered">
       <thead>
         <tr>
          <th className="text-center">Row No.</th>
          <th className="text-center">Column Name</th>
          <th className="text-center">Value</th>
          <th className="text-center">Message</th> 
         </tr>
       </thead>
       <tbody>
         {faildList.map((faildList,index) =>{
            return <tr key={index}>
                     <td className="text-left">{faildList.rowIndex}</td>
                     <td className="text-left">{faildList.columnName}</td>
                     <td className="text-left">{faildList.columnValue}</td>
                     <td>{
                        faildList.columnName == "FirstName" || faildList.columnName == "LastName" || faildList.columnName == "fatherFirstName" || faildList.columnName == "fatherLastName" ?
                          faildList.columnName + "only contains string."                     
                        :
                        faildList.message ?
                          faildList.message
                        :
                        "Invalid Data"
                     }
                     </td>
                  </tr>;
            })
         }
       </tbody>
     </table>
    </div>
  }
  /**Terminate ticket and change ticket status in ticketmaster and order tabel */
  terminateTicket(event){
    event.preventDefault();

    var verificationId   = parseInt($(event.currentTarget).attr('data-verificationid'));
    var verificationType = $(event.currentTarget).attr('data-verificationtype');
    var orderId          = $(event.currentTarget).attr('data-orderid');
    var ticketId         = $(event.currentTarget).attr('data-ticketid');
    var candidateId      = $(event.currentTarget).attr('data-candidateid');
    var userId           = Meteor.userId();
    var terminateReason  = $('#terminationReason-'+candidateId+"-"+verificationId).val();
    var allDetailsElem  ={
      verificationId   : verificationId,
      verificationType : verificationType,
      orderId          : orderId,
      ticketId         : ticketId,
      candidateId      : candidateId,
      userId           : userId,
      terminateReason  : terminateReason
    }
    var terminateRegExt = /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/;
    console.log('terminateRegExt: ', terminateRegExt);
    if (terminateReason) {
      if(terminateReason.match(terminateRegExt)){
        Meteor.call('terminateTicketOrder',allDetailsElem,(err,res)=>{
          if(res){
            swal("Order terminated successfully");
            $("#terminateStatusModal-"+candidateId+"-"+verificationId).modal('hide');
          }
        });
      }else{
        swal("Please fill correct reason");
      }
    }else{
      swal("Please fill the reason!");
    }
    
    

  }
  render() {
    if (!this.props.loading) {
      return (
       <div>
          {
            this.props.failedList ?
              this.props.failedList.length > 0 ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile"> 
                  {this.showErrorList(this.props.failedList)}
                </div>
              :
              null
            :
            null
          }
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerServicesBlock"> 
            <table className="table empVerifListTable table-striped table-bordered">
              <thead className="" >
                <tr className="" >
                  <th className="text-center col-lg-1">Sr. No.</th>
                  <th className="text-center col-lg-1">AssureID</th>
                  <th className="text-center col-lg-2">Employee Details</th>
                  <th className={this.props.serviceRequired == "ReferenceForm" ? "text-center col-lg-7" : "text-center col-lg-3"}>
                  {this.props.serviceRequired == "AddressForm" || this.props.serviceRequired == "CriminalRecords" ?
                      "Address"
                    :
                    this.props.serviceRequired == "EducationForm"? 
                      "Education"
                    :
                    this.props.serviceRequired == "WorkForm"? 
                      "Employement"
                    :
                    this.props.serviceRequired == "StatutoryForm"? 
                      "Identity"
                    :
                    this.props.serviceRequired == "ReferenceForm"?
                      "Reference"
                    :
                    "-"
                   }
                  </th>
                  {this.props.serviceRequired == "ReferenceForm" ? 
                      null
                     :
                    <th className="text-center col-lg-4">Document Attachment</th>
                  }
                  <th className="text-center col-lg-1">Status</th>
                  <th className="text-center col-lg-1">Action</th>

                </tr>
              </thead>
              <tbody className="" >
                { this.props.candidateList ?
                    this.props.candidateList.length > 0 ?
                      this.props.candidateList.map((candidate, index)=>{
                        return(
                          <tr key={index} className="">
                            <td className="text-left col-lg-1">
                              {index + 1}
                            </td>
                            <td className="text-left col-lg-1">
                              {candidate.candidateAssureID}
                            </td>
                            <td className="text-left col-lg-2">
                              {candidate.candidateFirstName} {candidate.candidateLastName}<br />
                              {candidate.candidateEmail}<br />
                              {candidate.candidateMobile ? candidate.candidateMobile : "-" }<br />
                              {candidate.candidateAadharNo ? candidate.candidateAadharNo : "-"} 
                            </td>
                            <td className={this.props.serviceRequired == "ReferenceForm" ? "text-left col-lg-7" :"text-left  col-lg-3"}>
                             { 
                              this.props.serviceRequired == "AddressForm" || this.props.serviceRequired == "CriminalRecords" ?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                          <div key={i}>
                                             {verificationData.verificationType == "permanentAddress" ?
                                               <div className="verificationDataOuter">
                                                {verificationData.line1 ? verificationData.line1 : ""} {verificationData.line2 ? ", "+verificationData.line2 : "" }{verificationData.line3 ? ", "+verificationData.line3 : "" }{verificationData.landmark ? ", "+verificationData.landmark+"," : "" } <br />
                                                {verificationData.city ?  verificationData.city : ""}{verificationData.state ? ", "+verificationData.state : ""}{verificationData.country ? ", "+verificationData.country : ""}{verificationData.pincode ? "-"+verificationData.pincode : ""}<br />
                                                {verificationData.residingFrom ? "From ="+verificationData.residingFrom : ""} {verificationData.residingTo ? "To ="+verificationData.residingTo : ""}
                                                {verificationData.fatherFirstName ? ", "+verificationData.fatherFirstName : ""}{verificationData.fatherLastName ? verificationData.fatherLastName+", " : ""}{verificationData.dateOfBirth ? verificationData.dateOfBirth : ""} 
                                               </div>
                                              :
                                               <div className="verificationDataOuter" >
                                                {verificationData.tempLine1 ? verificationData.tempLine1 : "" }{verificationData.tempLine2 ? ", "+verificationData.tempLine2 : "" }{verificationData.tempLine3 ? ", "+verificationData.tempLine3 : "" }{verificationData.tempLandmark ? ", "+verificationData.tempLandmark+"," : "" }<br />
                                                {verificationData.tempCity ? verificationData.tempCity : ""}{verificationData.tempState ? ", "+verificationData.tempState : ""}{verificationData.tempCountry ? ", "+verificationData.tempCountry : ""}{verificationData.tempPincode ? "-"+verificationData.tempPincode : ""}<br />
                                                {verificationData.tempresidingFrom ? "From ="+verificationData.tempresidingFrom : ""} {verificationData.tempresidingTo ? "To ="+verificationData.tempresidingTo : ""}                                              
                                                {verificationData.fatherFirstName ? ", "+verificationData.fatherFirstName : ""}{verificationData.fatherLastName ? verificationData.fatherLastName+", " : ""}{verificationData.dateOfBirth ? verificationData.dateOfBirth : ""} 
                                               </div>
                                              }
                                          </div>
                                        );
                                    })
                                  : 
                                  null
                                :
                                null
                              :
                              this.props.serviceRequired == "EducationForm" ?
                                candidate.verificationData ?
                                    candidate.verificationData.length > 0?
                                      candidate.verificationData.map((verificationData,i)=>{
                                        return(
                                          <div key={i} className="verificationDataOuter">
                                            {verificationData.educationLevel ? verificationData.educationLevel : ""} {verificationData.educationQualification ? " - "+verificationData.educationQualification : "" }{verificationData.specialization ? ", "+verificationData.specialization : "" }{verificationData.grades ? ", "+verificationData.grades : "" }
                                            {verificationData.educationMode ? ", "+verificationData.educationMode : ""}{verificationData.dateAttendedFrom ? ", Attended From= "+ verificationData.dateAttendedFrom : ""} {verificationData.dateAttendedTo ? ", Attended To ="+ verificationData.dateAttendedTo+"," : ""}<br />
                                            {verificationData.collegeName ? verificationData.collegeName : ""}{verificationData.university ? ", "+verificationData.university : ""}{verificationData.collegeAddress ? ", "+verificationData.collegeAddress+"," : ""}
                                            {verificationData.city ? verificationData.city : ""}{verificationData.state ? ", "+verificationData.state : ""}{verificationData.country ? ", "+verificationData.country : ""}{verificationData.pincode ? "-"+verificationData.pincode : ""}
                                          </div>
                                        );
                                      })
                                    : 
                                    null
                                  :
                                null
                              :
                              this.props.serviceRequired == "WorkForm" ?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i} className="verificationDataOuter">
                                          {verificationData.nameOfEmployer ? verificationData.nameOfEmployer+" - " : ""} {verificationData.employerAddress ? verificationData.employerAddress+", ": "" }{verificationData.employerCity ? verificationData.employerCity+", " : ""}{verificationData.employerState ? verificationData.employerState+", " : ""}{verificationData.contactNo ? verificationData.contactNo+", " : ""}
                                          {verificationData.employeeCode ? verificationData.employeeCode+", " : ""}{verificationData.designation ? verificationData.designation+", " : ""}{verificationData.department ? verificationData.department+", " : ""}{verificationData.employmentFrom ? "Employement From = "+moment(verificationData.employmentFrom).format("MM/YYYY")+", " : ""}{verificationData.employmentTo ?  verificationData.employmentTo != 'Present' ? "Employement To = "+ moment(verificationData.employmentTo).format("MM/YYYY")+"," : "Employement To = Present" : ""}<br />
                                          {verificationData.lastSalaryDrawn ? verificationData.lastSalaryDrawn+", " : ""}{verificationData.typeOfEmployement ? verificationData.typeOfEmployement+", " : ""}{verificationData.detailOfAgency ? verificationData.detailOfAgency+", " : ""}{verificationData.reasonOfLeaving ? verificationData.reasonOfLeaving+", " : ""}{verificationData.dutiesAndResponsibilites ? verificationData.dutiesAndResponsibilites+", " : ""}
                                          {verificationData.reportingManagerNm ? verificationData.reportingManagerNm+", " : ""}{verificationData.prevDesignation ? verificationData.prevDesignation : ""}{verificationData.contactDetails ? ", "+verificationData.contactDetails : ""}.
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null 
                              :
                              this.props.serviceRequired == "StatutoryForm" ?
                                candidate.verificationData ? 
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i} className="verificationDataOuter">
                                          {verificationData.identityType ? verificationData.identityType+'-' : ""}  {verificationData.cardNo ? verificationData.cardNo : "-"} 
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null 
                              :
                               this.props.serviceRequired == "ReferenceForm" ?
                                candidate.verificationData ? 
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i} className="verificationDataOuter">
                                          {verificationData.referralFirstName} {verificationData.referralLastName+","} <br />
                                          {verificationData.referralMobileNum ? verificationData.referralMobileNum+", " : "-"}{verificationData.referralEmailID ? verificationData.referralEmailID+", " : "-"} <br />
                                          {verificationData.referralOrganization ? verificationData.referralOrganization+", " : "-"} {verificationData.referralDesignation ? verificationData.referralDesignation+", " : "-"}  <br />
                                          {verificationData.referralRelationship ? verificationData.referralRelationship+", " : "-"} {verificationData.referralAssociatedSinceMonths ? verificationData.referralAssociatedSinceMonths+"." : "-"}
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null 
                              :
                              null
                             }
                            </td> 
                            {this.props.serviceRequired == "ReferenceForm" ? 
                                null
                               :
                              <td className="text-left col-lg-4">
                               { 
                                this.props.serviceRequired == "AddressForm" || this.props.serviceRequired == "CriminalRecords" ?
                                  candidate.verificationData ?
                                    candidate.verificationData.length > 0?
                                      candidate.verificationData.map((verificationData,i)=>{
                                        return(
                                          <div key={i} className="verificationDataOuter">
                                            {                                           
                                             verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant"   ?
                                               <div>
                                                <div className="form-group col-lg-10">
                                                  <label className="text-left col-lg-12 NOpadding">Address Proof Type</label>
                                                  <div className="input-effect input-group">
                                                    <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                                                    <select className="effect-21 form-control loginInputs proofType" id={"proofType-"+candidate.candidateId+"-"+verificationData.index} data-orderid={candidate.orderId} name="proofType" ref="proofType" onChange={this.handleChange.bind(this)} onBlur={this.inputEffect.bind(this)}>
                                                      <option>-- Select --</option>
                                                      <option>Aadhar Card</option>
                                                      <option>Driving License</option>
                                                      <option>Index To</option>
                                                      <option>Passport</option>
                                                      <option>Voting Card</option>
                                                      <option>Ration Card</option>
                                                      <option>Electric Bill</option>
                                                    </select>
                                                    <span className="focus-border">
                                                      <i></i>
                                                    </span>
                                                  </div>
                                                </div> 
                                               <div className="">
                                                 <input type="file" className="btn btn-info inputFiles" name="inputFile" data-ticketid={verificationData.verificationDataStatus == "Case Re-opened" ? verificationData.ticketDetails.ticketId : ""} data-verificationid={verificationData.verificationType == "permanentAddress"? verificationData.permanentAddressId :  verificationData.currentAddressId} data-prooftype="address" data-orderid={candidate.orderId} data-subtype={verificationData.verificationType == "permanentAddress"? "permanentAddress" : "currentAddress"} id={"inputFile-"+candidate.candidateId+"-"+verificationData.index} onChange={this.uploadProofDocs.bind(this)}/>
                                                 <button type="button" className="btn btn-info uploadBtn col-lg-offset-2"  data-id={candidate.candidateId+"-"+verificationData.index} data-prooftype="address" data-subtype={verificationData.verificationType == "permanentAddress"? "permanentAddress" : "currentAddress"}  onClick={this.inputFileChange.bind(this)}>Upload Document</button>
                                                  {this.getUploadImagePercentage(candidate.candidateId,verificationData.index)}
                                               </div>

                                              </div>
                                              :
                                              null
                                            }
                                            {verificationData.documents ?
                                              verificationData.documents.length > 0 ?
                                                <div>
                                                  {verificationData.documents.map((documents,l)=>{
                                                    return(
                                                      documents == null ?
                                                        <div key={l}>
                                                          
                                                        </div>
                                                      :
                                                        <div className={this.props.urlValue == "detailOrder" ? "col-lg-6 outerprofileStatusServiceImage NOpadding"  : "col-lg-6 outerprofileStatusServiceImage"} key={l} style={{"paddingTop" : "10px"}}>
                                                          {verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant" ? <i className="fa fa-times pull-right deleteDocuments" id={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index+"-"+l} onClick={this.delDocumentsFromVerificationData.bind(this)}></i> : null}
                                                          {documents.proofOfDocument ?
                                                            <div>
                                                              <img src={documents.proofOfDocument} className="img img-responsive profileStatusServiceImage"/>
                                                              
                                                                
                                                            </div>
                                                            
                                                            :
                                                            null
                                                          }
                                                        </div>
                                                     );
                                                    })
                                                  }
                                                  {
                                                    verificationData.remark ?
                                                    <div className="deoRemark col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                      <label>Remark : </label>
                                                      <label>{verificationData.remark}</label>
                                                    </div>
                                                    :
                                                    null

                                                  }
                                                  {this.props.urlValue == "detailOrder" && (verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant") ?
                                                      <div className="col-lg-12">
                                                        <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-ticketid={verificationData.ticketDetails ? verificationData.ticketDetails.ticketId : "" } data-order={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} 
                                                        onClick={verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Document Required" ? this.generateTicketForSingleOrder.bind(this) : verificationData.verificationDataStatus == "Case Re-opened"? this.updateTicketAfterReopen.bind(this) : null }>Submit</button>
                                                      </div>
                                                    :
                                                    null
                                                  }
                                                </div>
                                               :
                                               this.props.urlValue == "detailOrder" && this.props.serviceRequired == "CriminalRecords"?
                                               <p>No Documents Attached</p>
                                               :
                                               null
                                              :                                              
                                              this.props.urlValue == "detailOrder" && this.props.serviceRequired == "CriminalRecords" ?
                                               <p>No Documents Attached</p>
                                               :
                                               null
                                            }
                                           
                                          </div>
                                            
                                          );
                                      })
                                    : 
                                    null
                                  :
                                  null
                                 :
                                 this.props.serviceRequired == "EducationForm" ?
                                   candidate.verificationData ?
                                      candidate.verificationData.length > 0?
                                        candidate.verificationData.map((verificationData,i)=>{
                                          return(
                                            <div key={i} className="verificationDataOuter">
                                              {
                                               verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant"  ?
                                                 <div>
                                                   <div className="form-group col-lg-10">
                                                      <label className="text-left col-lg-12 NOpadding">Education Proof Type</label>
                                                      <div className="input-effect input-group">
                                                        <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                                                        <select className="effect-21 form-control loginInputs proofType" id={"proofType-"+candidate.candidateId+"-"+verificationData.index} data-orderid={candidate.orderId} name="proofType" ref="proofType" onChange={this.handleChange.bind(this)} onBlur={this.inputEffect.bind(this)}>
                                                          <option>-- Select --</option>
                                                          <option>Certificate</option>
                                                          <option>Provisional Degree</option>
                                                          <option>Degree</option>
                                                          <option>Marksheet</option>
                                                        </select>
                                                        <span className="focus-border">
                                                          <i></i>
                                                        </span>
                                                      </div>
                                                    </div> 
                                                    <div className="">
                                                      <input type="file" className="btn btn-info inputFiles" name="inputFile" data-ticketid={verificationData.verificationDataStatus == "Case Re-opened" ? verificationData.ticketDetails.ticketId : ""} data-prooftype="education" data-verificationid={verificationData.verificationType == "education"? verificationData.educationId : ""} data-orderid={candidate.orderId} data-subtype={verificationData.verificationType} id={"inputFile-"+candidate.candidateId+"-"+verificationData.index} onChange={this.uploadProofDocs.bind(this)}/>
                                                      <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-id={candidate.candidateId+"-"+verificationData.index} data-subtype={verificationData.verificationType} data-prooftype="education"  onClick={this.inputFileChange.bind(this)}>Upload Document</button>
                                                        {this.getUploadImagePercentage(candidate.candidateId,verificationData.index)}
                                                    </div>
                                                  </div>
                                                :
                                                null
                                              }
                                              {verificationData.documents ?
                                                verificationData.documents.length > 0 ?
                                                <div>
                                                  {verificationData.documents.map((documents,l)=>{
                                                    return(
                                                      documents == null ?
                                                        <div key={l}>
                                                        </div>
                                                      :
                                                      <div className={this.props.urlValue == "detailOrder" ? "col-lg-6 outerprofileStatusServiceImage NOpadding"  : "col-lg-6 outerprofileStatusServiceImage"}  key={l} style={{"paddingTop" : "10px"}}>
                                                       {verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant" ? <i className="fa fa-times pull-right deleteDocuments" id={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index+"-"+l} onClick={this.delDocumentsFromVerificationData.bind(this)}></i> : null}
                                                       <img src={documents.proofOfDocument} className="img img-responsive profileStatusServiceImage"/>
                                                       
                                                     </div>
                                                    );
                                                  })}
                                                  {
                                                    verificationData.remark ?
                                                    <div className="deoRemark col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                      <label>Remark : </label>
                                                      <label>{verificationData.remark}</label>
                                                    </div>
                                                    :
                                                    null

                                                  }
                                                   {this.props.urlValue == "detailOrder" && (verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant") ?
                                                      <div className="col-lg-12">
                                                        <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-ticketid={verificationData.ticketDetails ? verificationData.ticketDetails.ticketId : "" } data-order={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} 
                                                        onClick={ verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Pending from Applicant" ? this.generateTicketForSingleOrder.bind(this) : verificationData.verificationDataStatus == "Case Re-opened"? this.updateTicketAfterReopen.bind(this) : null }>Submit</button>
                                                      </div>
                                                    :
                                                    null
                                                  }
                                                  </div>
                                                 :
                                                 null
                                                :
                                                null
                                              }
                                            </div>
                                              
                                            );
                                        })
                                      : 
                                      null
                                    :
                                    null
                                  :
                                   this.props.serviceRequired == "WorkForm" ?
                                     candidate.verificationData ?
                                        candidate.verificationData.length > 0 ?
                                          candidate.verificationData.map((verificationData,i)=>{
                                            return(
                                              <div key={i} className="verificationDataOuter">
                                                {
                                                  verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant"  ?
                                                   <div>
                                                     <div className="form-group col-lg-10">
                                                        <label className="text-left col-lg-12 NOpadding">Employement Proof Type</label>
                                                        <div className="input-effect input-group">
                                                          <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                                                          <select className="effect-21 form-control loginInputs proofType" id={"proofType-"+candidate.candidateId+"-"+verificationData.index} data-orderid={candidate.orderId} name="proofType" ref="proofType" onChange={this.handleChange.bind(this)} onBlur={this.inputEffect.bind(this)}>
                                                             <option>-- Select --</option>
                                                              <option>Offer Letter</option>
                                                              <option>Experience Letter</option>
                                                              <option>Appointment Letter</option>
                                                          </select>
                                                          <span className="focus-border">
                                                            <i></i>
                                                          </span>
                                                        </div>
                                                      </div> 
                                                      <div className="">
                                                        <input type="file" className="btn btn-info inputFiles" name="inputFile" data-prooftype="employement" data-ticketid={verificationData.verificationDataStatus == "Case Re-opened" ? verificationData.ticketDetails.ticketId : ""} data-verificationid={verificationData.verificationType == "employement"? verificationData.employementId : ""} data-orderid={candidate.orderId} data-subtype={verificationData.verificationType} id={"inputFile-"+candidate.candidateId+"-"+verificationData.index} onChange={this.uploadProofDocs.bind(this)}/>
                                                        <button type="button" className="btn btn-info uploadBtn col-lg-offset-2"  data-id={candidate.candidateId+"-"+verificationData.index} data-prooftype="employement" data-subtype={verificationData.verificationType}  onClick={this.inputFileChange.bind(this)}>Upload Document</button>
                                                        {this.getUploadImagePercentage(candidate.candidateId,verificationData.index)}
                                                      </div>
                                                    </div>
                                                  :
                                                  null
                                                }
                                                {verificationData.documents ?
                                                  verificationData.documents.length > 0 ?
                                                  <div>
                                                    {verificationData.documents.map((documents,l)=>{
                                                      return(
                                                        documents == null ?
                                                          <div key={l}>
                                                          </div>
                                                        :
                                                        <div className={this.props.urlValue == "detailOrder" ? "col-lg-6 outerprofileStatusServiceImage NOpadding"  : "col-lg-6 outerprofileStatusServiceImage"}  key={l} style={{"paddingTop" : "10px"}}>
                                                         {verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant" ? <i className="fa fa-times pull-right deleteDocuments" id={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index+"-"+l} onClick={this.delDocumentsFromVerificationData.bind(this)}></i> : null}
                                                         <img src={documents.proofOfDocument} className="img img-responsive profileStatusServiceImage"/>
                                                         
                                                        </div>

                                                        );
                                                    })}
                                                    {
                                                      verificationData.remark ?
                                                      <div className="deoRemark col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <label>Remark : </label>
                                                        <label>{verificationData.remark}</label>
                                                      </div>
                                                      :
                                                      null
                                                    }
                                                    {this.props.urlValue == "detailOrder" && (verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant") ?
                                                      <div className="col-lg-12">
                                                        <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-ticketid={verificationData.ticketDetails ? verificationData.ticketDetails.ticketId : "" } data-order={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} 
                                                        onClick={ verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Pending from Applicant" ? this.generateTicketForSingleOrder.bind(this) : verificationData.verificationDataStatus == "Case Re-opened"? this.updateTicketAfterReopen.bind(this) : null }>Submit</button>
                                                      </div>
                                                    :
                                                    null
                                                   }
                                                   </div>
                                                   :
                                                   null
                                                  :
                                                  null
                                                }
                                             </div>
                                            );
                                        })
                                      : 
                                    null
                                     :
                                  null
                                   :
                                   this.props.serviceRequired == "StatutoryForm" ?
                                    candidate.verificationData ?
                                      candidate.verificationData.length > 0?
                                        candidate.verificationData.map((verificationData,i)=>{
                                          return(
                                            <div key={i} className="verificationDataOuter">
                                              {
                                                verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant"  ?
                                                 <div>
                                                  <div className="form-group col-lg-10">
                                                    <label className="text-left col-lg-12 NOpadding">{verificationData.identityType} Proof Type</label>
                                                    <div className="input-effect input-group">
                                                      <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
                                                      <select className="effect-21 form-control loginInputs proofType" id={"proofType-"+candidate.candidateId+"-"+verificationData.index} data-orderid={candidate.orderId} name="proofType" ref="proofType" onChange={this.handleChange.bind(this)} onBlur={this.inputEffect.bind(this)}>
                                                        <option>{verificationData.identityType}</option>
                                                      </select>
                                                      <span className="focus-border">
                                                        <i></i>
                                                      </span>
                                                    </div> 
                                                  </div> 
                                                {verificationData.proofOfDocument == "" ?
                                                 <div className="">
                                                   <input type="file" className="btn btn-info inputFiles" name="inputFile" data-ticketid={verificationData.verificationDataStatus == "Case Re-opened" ? verificationData.ticketDetails.ticketId : ""} data-prooftype="Identity" data-orderid={candidate.orderId} 
                                                   data-subtype={verificationData.identityType == "Aadhar Card" ? "aadhar1" : verificationData.identityType == "Pan Card" ? "pan1" : "" } data-card={verificationData.identityType+"-"+verificationData.cardNo} id={"inputFile-"+candidate.candidateId+"-"+verificationData.index} onChange={this.uploadProofDocsForIdentity.bind(this)}/>
                                                   <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-id={candidate.candidateId+"-"+verificationData.index} data-prooftype="Identity"  onClick={this.inputFileChange.bind(this)}>Upload Document</button>
                                                    {this.getUploadImagePercentage(candidate.candidateId,verificationData.index)}
                                                 </div>
                                                  :
                                                  verificationData.proofOfDocument2 == "" ?
                                                    <div className="">
                                                     <input type="file" className="btn btn-info inputFiles" name="inputFile" data-ticketid={verificationData.verificationDataStatus == "Case Re-opened" ? verificationData.ticketDetails.ticketId : ""} data-prooftype="Identity" data-orderid={candidate.orderId} 
                                                     data-subtype={verificationData.identityType == "Aadhar Card" ? "aadhar2" : verificationData.identityType == "Pan Card" ? "pan2" : "" } data-card={verificationData.identityType+"-"+verificationData.cardNo} id={"inputFile-"+candidate.candidateId+"-"+verificationData.index} onChange={this.uploadProofDocsForIdentity.bind(this)}/>
                                                     <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-id={candidate.candidateId+"-"+verificationData.index} data-prooftype="Identity"  onClick={this.inputFileChange.bind(this)}>Upload Document</button>
                                                     {this.getUploadImagePercentage(candidate.candidateId,verificationData.index)}
                                                   </div>
                                                  :

                                                  null
                                                }                                              
                                                </div>  
                                                :
                                                null                                          
                                              }                                              
                                              {verificationData.proofOfDocument != "" ?
                                                  <div className={this.props.urlValue == "detailOrder" ? "col-lg-5 outerprofileStatusServiceImage NOpadding"  : "col-lg-5 outerprofileStatusServiceImage"} style={{"paddingTop" : "10px"}}>
                                                    {verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" ?<i className="fa fa-times pull-right deleteDocuments" data-docs="firstDoc" id={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} onClick={this.delFromIdentityVerificationData.bind(this)}></i> : null}
                                                    <img src={verificationData.proofOfDocument} className="img img-responsive profileStatusServiceImage"/>
                                                  </div>                                                 
                                                 :
                                                 null
                                              }
                                              {verificationData.proofOfDocument2 != "" ?
                                                  <div className={this.props.urlValue == "detailOrder" ? "col-lg-5 outerprofileStatusServiceImage NOpadding"  : "col-lg-5 outerprofileStatusServiceImage"} style={{"paddingTop" : "10px"}}>
                                                    {verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" ?<i className="fa fa-times pull-right deleteDocuments" data-docs="secondDoc" id={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} onClick={this.delFromIdentityVerificationData.bind(this)}></i> : null}
                                                    <img src={verificationData.proofOfDocument2} className="img img-responsive profileStatusServiceImage"/>
                                                  </div>                                                 
                                                 :
                                                 null
                                              }
                                               {
                                                  verificationData.remark ?
                                                  <div className="deoRemark col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label>Remark : </label>
                                                    <label>{verificationData.remark}</label>
                                                  </div>
                                                  :
                                                  null

                                                }
                                              {verificationData.proofOfDocument || verificationData.proofOfDocument2 ?
                                                this.props.urlValue == "detailOrder" && (verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Case Re-opened" || verificationData.verificationDataStatus == "Pending from Applicant") ?
                                                    <div className="col-lg-12">
                                                      <button type="button" className="btn btn-info uploadBtn col-lg-offset-2" data-ticketid={verificationData.ticketDetails ? verificationData.ticketDetails.ticketId : "" } data-order={candidate.orderId+"-"+candidate.candidateId+"-"+verificationData.index} 
                                                      onClick={ verificationData.verificationDataStatus == "Data Entry is in progress" || verificationData.verificationDataStatus == "Pending from Applicant" ? this.generateTicketForSingleOrder.bind(this) : verificationData.verificationDataStatus == "Case Re-opened" ? this.updateTicketAfterReopen.bind(this) : null }>Submit</button>
                                                    </div>
                                                  :
                                                  null
                                                :
                                                null
                                              }
                                            </div>
                                              
                                            );
                                        })
                                      : 
                                      null
                                    :
                                    null
                                :
                                null
                               }
                              </td>
                            }
                            <td className="text-left col-lg-1">
                             {candidate.verificationData ?
                                candidate.verificationData.length > 0?
                                  candidate.verificationData.map((verificationData,i)=>{
                                    return(
                                      <div key={i} className="verificationDataOuter">
                                         <div className={verificationData.bgColor ? "blockwrap1 "+verificationData.bgColor : "blockwrap1" }>
                                          <p>{verificationData.verificationDataStatus}</p> 
                                        </div>
                                      </div>
                                    );
                                  })
                                 :
                                 null
                                :
                                null
                             }
                                
                            </td> 
                            <td>

                            {
                              candidate.verificationData ?
                                candidate.verificationData.length > 0?
                                  candidate.verificationData.map((verificationData,ind)=>{
                                    return(
                                      <div key={ind} className="verificationDataOuter">
                                       {
                                          verificationData.ticketDetails ?
                                            verificationData.ticketDetails.terminationReason ?
                                              <div className="terminateReason">
                                                <label>Terminated</label>
                                                <label>Reason :{verificationData.ticketDetails.terminationReason}</label>
                                              </div>
                                            :

                                              <button type="button" className="btn btn-danger" data-toggle="modal" data-target={"#terminateStatusModal-"+candidate.candidateId+"-"+verificationData.index}>Terminate</button>
                                          :
                                            null 
                                          
                                       }                                      
                                        <div className="modal fade" id={"terminateStatusModal-"+candidate.candidateId+"-"+verificationData.index} role="dialog">
                                          <div className="modal-dialog">
                                          
                                            <div className="modal-content">
                                              <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                <h4 className="modal-title">Terminate Order</h4>
                                              </div>
                                              <div className="modal-body">
                                              <div className="row inputrow">
                                               <form>
                                                  <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                                    <div className="input-effect input-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <label className="pull-left">Reason For Termination :</label>
                                                        <textarea rows="5" className="form-control inputText contractDescription" ref="terminationReason" id={"terminationReason-"+candidate.candidateId+"-"+verificationData.index} name="terminationReason" required></textarea>
                                                    </div> 
                                                  </div>
                                                </form>
                                              </div>
                                              </div>
                                              <div className="modal-footer">
                                                {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> */}
                                                 <button type="button" className="btn btn-primary" data-candidateid={candidate.candidateId} data-verificationid={verificationData.index} data-verificationtype={verificationData.verificationType} data-ticketid={verificationData.ticketDetails ? verificationData.ticketDetails.ticketId : ""} data-orderid={candidate.orderId} onClick={this.terminateTicket.bind()}>Submit</button>
                                                 <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                              </div>
                                            </div>
                                            
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                              :
                                null
                              :
                                null
                            }
                             </td>                          
                          </tr>                        
                        );
                      })
                    :
                    <tr>
                    </tr>  
                  :
                  <tr>
                  </tr> 
                }
              </tbody>
            </table>
          </div>
          
          
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
            {
              this.props.candidateList.length > 0 ?  
                this.props.urlValue == "detailOrder" ?
                   null
                :
                <button className="btn btn-info pull-right bulkEmpButton" onClick={this.submitOrders.bind(this)}>Submit</button>  
              :
              ""
            } 
          </div>
        </div> 
      );
    }else{
      return(
          <span>Loading</span>
        );
    }
   
  }
}
CandidateOrderListContainer = withTracker(props => {
  const postHandle     = Meteor.subscribe('orderWithCorporateOrder', props.corporatDetails._id);
  const HandleHolidays = Meteor.subscribe('holidaysList');
  const loading        = !postHandle.ready() && !HandleHolidays.ready();
  // console.log("serviceid",props.serviceRequired);

  if (props.urlValue == "detailOrder") {
    var orderDetails   = Order.find({"corporateOrderId" : props.corporatDetails._id, 
                                    },{sort:{"createdAt": -1}}).fetch();
    var candidateList = []; 
    if(orderDetails){
      orderDetails.map((order, Index)=>{
        order.candidateDetails.map((candidateDetails, Ind)=>{
          candidateDetails.orderId  = order._id;
           if (candidateDetails.verificationData) {
             var verificationData = candidateDetails.verificationData.filter((obj, i)=>{
              obj.index = i;
                return obj.serviceId == props.serviceid;
               })
              candidateDetails.verificationData = verificationData;
              if (candidateDetails.verificationData.length > 0) {                  
                candidateDetails.verificationData.map((ticketData,index)=>{
                  if(ticketData.ticketDetails){ 
                    var ticketSub = Meteor.subscribe('singleTicket',ticketData.ticketDetails.ticketId);
                    if(ticketSub.ready()){
                      var ticketDetails = TicketMaster.findOne({"_id":ticketData.ticketDetails.ticketId});
                      if (ticketDetails) {
                        if (ticketDetails.ticketElement) {
                          if(ticketDetails.ticketElement.length>0){
                            var ticketElemLength = ticketDetails.ticketElement.length;
                            if(ticketDetails.ticketElement[ticketElemLength-1].roleStatus == "ScreenRejected"){
                              var remark = ticketDetails.ticketElement[ticketElemLength -1].remark;
                              candidateDetails.verificationData[index].remark = remark;
                            }
                          }  
                        }
                      }
                    }
                  }             
                });                
                candidateList.push(candidateDetails);
              }

           }    
        });
      });
    }
  }else{
    var orderDetails   = Order.find({"corporateOrderId" : props.corporatDetails._id, 
                                    },{sort:{"createdAt": -1}}).fetch();
    var candidateList = []; 
    if(orderDetails){
      orderDetails.map((order, Index)=>{
        order.candidateDetails.map((candidateDetails, Ind)=>{
          candidateDetails.orderId  = order._id;
           if (candidateDetails.verificationData) {
             var verificationData = candidateDetails.verificationData.filter((obj, i)=>{
                 obj.index = i;
                return obj.serviceId == props.serviceid && !obj.ticketDetails;
               })
              candidateDetails.verificationData = verificationData;
              if (candidateDetails.verificationData.length > 0) {
                candidateList.push(candidateDetails);
              }
           }              
        });
        if (candidateList.length > 0 ) {
           var candidate  = candidateList.filter((candidate)=>{
            return candidate.orderId == order._id
           });
           if (candidate) {
              order.candidateDetails = candidate;
           }
        }
      });
    }
  }
  var HolidaysDB = HolidaysList.find({}).fetch();
  if(HolidaysDB.length){
    var holidaysList = [];
    for(i = 0 ;i < HolidaysDB.length; i++){
      holidaysList.push(HolidaysDB[i].holidayDate);
    }
    // console.log("candidateList",candidateList);
  }
  return {
    loading,
    orderDetails,
    candidateList,
    holidaysList,
  };
  
})(CandidateOrderList);

export default CandidateOrderListContainer;