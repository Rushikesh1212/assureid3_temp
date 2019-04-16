import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';

import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js'; 
import { CompanySettings } from  '/imports/admin/companySettings/api/CompanySettingMaster.js';
import { UserProfile } from '/imports/AssureID/userPortal/api/userProfile.js';
// import { CompanyOrder } from '../company/api/company.js';
import { CompanyProfile } from '/imports/AssureID/company/api/companyProfile.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import { Order } from '/imports/AssureID/userPortal/api/Order.js';
import {RequestPool} from '/imports/AssureID/company/api/companyProfile.js';

import AddressRequired from '/imports/AssureID/userPortal/profile/view/components/AddressRequired.jsx';
import EmploymentRequired from '/imports/AssureID/userPortal/profile/view/components/EmploymentRequired.jsx';
import AcademiceRequired from '/imports/AssureID/userPortal/profile/view/components/AcademiceRequired.jsx'; 
import BasicInfoRequired from '/imports/AssureID/userPortal/profile/view/components/BasicInfoRequired.jsx';
import IdentityRequired from '/imports/AssureID/userPortal/profile/view/components/IdentityRequired.jsx';
import BasicForm from '/imports/AssureID/userPortal/profile/forms/components/BasicForm.jsx';
import CertificateRequired from '/imports/AssureID/userPortal/profile/view/components/CertificateRequired.jsx';
import SkillsRequired from '/imports/AssureID/userPortal/profile/view/components/SkillsRequired.jsx';
import SkillsForm from '/imports/AssureID/userPortal/profile/forms/components/SkillsForm.jsx';
import StatutoryForm from '/imports/AssureID/userPortal/profile/forms/components/StatutoryForm.jsx';
import ReferralRequired from '/imports/AssureID/userPortal/profile/view/components/ReferralRequired.jsx';

class ServiceRequiredData extends TrackerReact(Component){
  constructor(){
    super();
     this.state ={
        serviceName         : '',
        serviceRate         : '',
        serviceDuration     : '',
        servicesDescription : '',
        id                  : '',
        AddressForm         : false,
        EducationForm       : false,
        OtherInfoForm       : false,
        ProfileForm         : false,
        SkillsCertificate   : false,
        StatutoryForm       : false,
        WorkForm            : false, 
        address             : 'both',
        permanentAddrDetails : {},
        currentAddrDetails   : [],
        "subscription" : {
          "services"       : Meteor.subscribe("services"),
          "userfunction"   : Meteor.subscribe("userfunction"),
          "companyData"    : Meteor.subscribe("companyData"),
          "userprofile"    : Meteor.subscribe("userprofile"),
          // "companyOrderData" : Meteor.subscribe("companyOrderData"),
          "requestPoolData"  : Meteor.subscribe("requestPoolData"),

        }
      }
     this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
    $('html, body').scrollTop(0);

  }
  inputFileChange(event){
    event.preventDefault();
    $(event.target).parent().parent().find('.inputFileUser').click();
  } 
  backClick(event){
    event.preventDefault();
    var path = "/ServiceInfo/"+this.props.services._id;
    FlowRouter.go(path);
  }
  uploadProfileImg(event){
    event.preventDefault();
    let self = this; 
    this.setState({isUploading: true});
    //  this.calculateProgress();
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      // 
      var userId = Meteor.userId();
      // 
      if (file) {
        addUserToS3Function(userId,file,self);
      }
    }
  }
  purchaseClick(event){
    event.preventDefault();
    if ($("input:checkbox[class=reqInfocheck]:checked").prop("checked") == true) {
      var detailData = [];
      var data       = [];
      for(i = 1 ; i < this.props.userprofile.chkcount; i++){
        var addressCheck = $("input:checkbox[id="+[i]+"]:checked").val();
        if(addressCheck){
          detailData.push(addressCheck);
        }
      }
    
      var serviceData       = [];
      var addressCount      = 0;
      var employmentCount   = 0;  
      var academicsCount    = 0;
      var certificatesCount = 0;
      var professionalCount = 0;
      var identityCount     = 0;
      var referenceCount    = 0;
      var totalQty = 0;
      for(i = 0 ; i < detailData.length; i++){ 
        var type = detailData[i].split(':');
        if( type[0] == 'Permanent Address ' || type[0] == 'Current Address '){
          if ( type[0] == 'Permanent Address ') {
            for(var j = 0 ; j < this.props.userprofile.permanentAddress.length ; j++){
              if (parseInt(type[1]) == this.props.userprofile.permanentAddress[j].permanentAddressId) {
                var tempdata = this.props.userprofile.permanentAddress[j];
                tempdata.verificationType = "permanentAddress";
                tempdata.verificationId = parseInt(type[1]);
                tempdata.serviceId      =  this.props.services._id;
                if(tempdata.residingTo == 'Present'){
                  // tempdata.residingTo  = moment().format('MM/DD/YYYY');
                  tempdata.residingTo  = moment().format('DD/MM/YYYY');
                }
                data.push(tempdata);
              }  
            }
            // var tempdata = this.props.userprofile.permanentAddress[parseInt(type[1])];
          }
          if ( type[0] == 'Current Address ') {
            for(var k = 0 ; k < this.props.userprofile.currentAddress.length ; k++){
             if (parseInt(type[1]) == this.props.userprofile.currentAddress[k].currentAddressId) {
                  var tempdata = this.props.userprofile.currentAddress[k];
                  tempdata.verificationType = "currentAddress";
                  tempdata.verificationId   = parseInt(type[1]);
                   tempdata.serviceId       =  this.props.services._id;
                  if(tempdata.tempresidingTo == 'Present'){
                    // tempdata.tempresidingTo = moment().format('MM/DD/YYYY');
                     tempdata.tempresidingTo = moment().format('DD/MM/YYYY');
                  }
                  data.push(tempdata);
              }
            }
            // var tempdata = this.props.userprofile.currentAddress[parseInt(type[1])];
             
          }
          addressCount ++;
        }else if(type[0] == 'Employment '){
          for(var l = 0 ; l < this.props.userprofile.employement.length ; l++){
            if (parseInt(type[1]) == this.props.userprofile.employement[l].employementId) {
                var tempdata = this.props.userprofile.employement[l];
                tempdata.verificationType = "employement";
                tempdata.verificationId = parseInt(type[1]);
                tempdata.serviceId       =  this.props.services._id;
                if(tempdata.employmentTo == 'Present'){
                  // tempdata.employmentTo = moment().format('MM/DD/YYYY');
                  tempdata.employmentTo = moment().format('DD/MM/YYYY');
                }
                data.push(tempdata);
            }
          }
          // var tempdata = this.props.userprofile.employement[parseInt(type[1])];
          employmentCount++; 
        }else if(type[0] == 'Academics '){
          for(var m = 0 ; m < this.props.userprofile.education.length ; m++){
             if (parseInt(type[1]) == this.props.userprofile.education[m].educationId) {
                  var tempdata = this.props.userprofile.education[m];
                  tempdata.verificationType = "education";
                  tempdata.verificationId   = parseInt(type[1]);
                  tempdata.serviceId        =  this.props.services._id;
                  data.push(tempdata);
              }
          }
          // var tempdata = this.props.userprofile.education[parseInt(type[1])];
          // data.push(this.props.userprofile.employement[parseInt(type[1])]);
          academicsCount++
        }else if(type[0] == 'Certificate Details '){
          for(var n = 0 ; n < this.props.userprofile.certificates.length ; n++){
           if (parseInt(type[1]) == this.props.userprofile.certificates[n].certificateId) {
                var tempdata = this.props.userprofile.certificates[n];
                tempdata.verificationType = "certificates";
                tempdata.verificationId   = parseInt(type[1]);
                tempdata.serviceId        =  this.props.services._id;
                data.push(tempdata);
            }
          }
           // var tempdata = this.props.userprofile.certificates[parseInt(type[1])];
          certificatesCount++;
        }else if(type[0] == 'Professionals Academics '){
          for(var o = 0 ; o < this.props.userprofile.professionalEducation.length ; o++){
           if (parseInt(type[1]) == this.props.userprofile.professionalEducation[o].professionalEducationId) {
                var tempdata = this.props.userprofile.professionalEducation[o];
                 tempdata.verificationType = "professionalEducation";
                  tempdata.verificationId  = parseInt(type[1]);
                  tempdata.serviceId       =  this.props.services._id;
                  data.push(tempdata);
            }
          }
          // var tempdata = this.props.userprofile.professionalEducation[parseInt(type[1])]; 
          professionalCount++
        }else if(type[0] == 'Aadhar Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.adharCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.aadhar1,
            "fileExt"           : this.props.userprofile.identity.aadhar1ext,
            "fileName"          : this.props.userprofile.identity.aadhar1name,
            "proofOfDocument2"  : this.props.userprofile.identity.aadhar2,
            "fileExt2"          : this.props.userprofile.identity.aadhar2ext,
            "fileName2"         : this.props.userprofile.identity.aadhar2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "adharCardChkid"    : this.props.userprofile.identity.adharCardChkid,
            "adharCardvalue"    : this.props.userprofile.identity.adharCardvalue,
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Pan Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.panCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.pan1,
            "fileExt"           : this.props.userprofile.identity.pan1ext,
            "fileName"          : this.props.userprofile.identity.pan1name,
            "proofOfDocument2"  : this.props.userprofile.identity.pan2,
            "fileExt2"          : this.props.userprofile.identity.pan2ext,
            "fileName2"         : this.props.userprofile.identity.pan2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "panCardChkid"      : this.props.userprofile.identity.panCardChkid,
            "panCardvalue"      : this.props.userprofile.identity.panCardvalue,
            // "serviceRequired"   : "StatutoryForm"
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Driving License '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.drivingCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.driving1,
            "fileExt"           : this.props.userprofile.identity.driving1ext,
            "fileName"          : this.props.userprofile.identity.driving1name,
            "proofOfDocument2"  : this.props.userprofile.identity.driving2,
            "fileExt2"          : this.props.userprofile.identity.driving2ext,
            "fileName2"         : this.props.userprofile.identity.driving2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "drivingCardchkid"  : this.props.userprofile.identity.drivingCardchkid,
            "drivingCardvalue"  : this.props.userprofile.identity.drivingCardvalue,
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Voting Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.votingCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.voting1,
            "fileExt"           : this.props.userprofile.identity.voting1ext,
            "fileName"          : this.props.userprofile.identity.voting1name,
            "proofOfDocument2"  : this.props.userprofile.identity.voting2,
            "fileExt2"          : this.props.userprofile.identity.voting2ext,
            "fileName2"         : this.props.userprofile.identity.voting2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "votingCardchkid"   : this.props.userprofile.identity.votingCardchkid,
            "votingCardvalue"   : this.props.userprofile.identity.votingCardvalue,
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Ration Card '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.rationCardNo,
            "proofOfDocument"   : this.props.userprofile.identity.ration1,
            "fileExt"           : this.props.userprofile.identity.ration1ext,
            "fileName"          : this.props.userprofile.identity.ration1name,
            "proofOfDocument2"  : this.props.userprofile.identity.ration2,
            "fileExt2"          : this.props.userprofile.identity.ration2ext,
            "fileName2"         : this.props.userprofile.identity.ration2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "rationCardchkid"   : this.props.userprofile.identity.rationCardchkid,
            "rationCardvalue"   : this.props.userprofile.identity.rationCardvalue,
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Passport '){
          var tempdata = {
            "identityType"      : (type[0]).trim(),
            "cardNo"            : this.props.userprofile.identity.passportNo,
            "proofOfDocument"   : this.props.userprofile.identity.passport1,
            "fileExt"           : this.props.userprofile.identity.passport1ext,
            "fileName"          : this.props.userprofile.identity.passport1name,
            "proofOfDocument2"  : this.props.userprofile.identity.passport2,
            "fileExt2"          : this.props.userprofile.identity.passport2ext,
            "fileName2"         : this.props.userprofile.identity.passport2name,
            "verificationType"  : "Identity",
            "verificationId"    : parseInt(type[1]),
            "serviceRequired"   : "StatutoryForm",
            "serviceId"         : this.props.services._id,
            "passportchkid"     : this.props.userprofile.identity.passportchkid,
            "passportvalue"     : this.props.userprofile.identity.passportvalue,
          }
          data.push(tempdata);
          identityCount ++;
        }else if(type[0] == 'Reference Details '){
          for(var p = 0 ; p < this.props.userprofile.reference.length ; p++){
           if (parseInt(type[1]) == this.props.userprofile.reference[p].referenceId) {
                var tempdata = this.props.userprofile.reference[p];
                 tempdata.verificationType = "reference";
                  tempdata.verificationId  = parseInt(type[1]);
                  tempdata.serviceRequired = "ReferenceForm";
                  tempdata.serviceId       = this.props.services._id;
                  data.push(tempdata);
            }
          }
          // var tempdata = this.props.userprofile.professionalEducation[parseInt(type[1])]; 
          referenceCount++
        }
      }
      var paramsId         = FlowRouter.getParam('id');
      var splitId          = paramsId.split('-');
      var id               = splitId[0];
      var orderId          = splitId[2];
      var services         = Services.findOne({"_id": id});
      var serviceId        = services._id;
      var serviceName      = services.serviceName;
      var serviceRate      = parseFloat(services.serviceRate);
      var serviceDayNumbers = services.serviceDayNumbers;
      var serviceDuration  = services.serviceDuration;
      var serviceDate      = services.createdAt;
      var serviceImage     = services.image;
      var serviceImgFileExt  = services.fileExt;
      var getUser          = Meteor.user();
      var userId           = getUser._id;
      var userName         = getUser.profile.firstname+' '+getUser.profile.lastname;
      /**Get Order number from order table */
      var OrderDetails     = Order.findOne({"_id":orderId});
      if(OrderDetails){
          var orderNo   = OrderDetails.orderNo;
          var orderDate = OrderDetails.createdAt;
      }
      //Invoice Generation
      var tax  = [];
      var taxAmountArray = [];
      var companyData      = CompanySettings.findOne({"companyId": 1}); 
      if (companyData) {
        var companyName         = companyData.companyName;
        var companyAddressFeild = companyData.companyLocationsInfo[0];
        var companyAddress      = companyAddressFeild.companyAddress;
        var companyCity         = companyAddressFeild.companyCity;
        var companyCountry      = companyAddressFeild.companyCountry;
        var companyPincode      = companyAddressFeild.companyPincode;
        var companyState        = companyAddressFeild.companyState;
        var newDate             = new Date();
        var currentDate         = moment(newDate).format("YYYY-MM-DD");
        if (companyData.taxSettings){
          for (var i = 0; i < companyData.taxSettings.length; i++) {
            if (companyData.taxSettings[i].effectiveTo ) {
              if (currentDate <= companyData.taxSettings[i].effectiveTo && currentDate >= companyData.taxSettings[i].effectiveFrom) {
                 tax.push(companyData.taxSettings[i]);
              }
            }else if (currentDate >= companyData.taxSettings[i].effectiveFrom) {
               tax.push(companyData.taxSettings[i]);
            }
          }
        }
        var taxAmount  = 0;
        if (tax.length > 0) {
          for (var i = 0; i < tax.length; i++) {
            var taxPrice      = parseFloat(tax[i].applicableTax);
            var actualAmount  = parseFloat(serviceRate) * parseFloat(data.length);  
            var taxAmt        = (parseFloat(taxPrice) / 100) *  parseFloat(actualAmount);
            taxAmount         = taxAmount + taxAmt;
            var taxDetails        = {
                                    'taxName'         : tax[i].taxType,
                                    'taxRate'         : tax[i].applicableTax,
                                    'calculatedAmount': taxAmt
                                }
            taxAmountArray.push(taxDetails);
          }
         
          
        }else{
          var actualAmount  = parseFloat(serviceRate) * parseFloat(data.length);
        }
        var totalAmount     = parseFloat(taxAmount) + parseFloat(actualAmount);  
      }
      // 
      // 
      var assureId    = this.props.userprofile.assureId;
      var invoiceData = {
        assureId          : assureId,
        companyName       : companyName,
        orderId           : orderId,
        orderNo           : orderNo,
        orderDate         : orderDate,
        userDetails       : {
                              userId    : userId,
                              userName  : userName,
                            },
        companyAddress    : {
                              companyAddress    : companyAddress,
                              companyCity       : companyCity,
                              companyState      : companyState ,
                              companyCountry    : companyCountry ,
                              companyPincode    : companyPincode,
                            },
        serviceDetails    : {
                              serviceId         : serviceId,
                              serviceName       : serviceName,
                              serviceRate       : serviceRate,
                              totalQty          : addressCount+employmentCount+academicsCount+certificatesCount+professionalCount+identityCount+referenceCount,
                            },
        tax               : tax,
        taxAmount         : taxAmountArray,
        actualAmount      : actualAmount,
        totalAmount       : totalAmount,
        receiptId         : "",
        paymentStatus     : 'unpaid'
      }
      
      // console.log("data",data);
      if (data) {
        var dataCount = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].proofOfDocument == ''){
            if (data[i].verificationType == "permanentAddress") {
              var typeOfVerification = "Permanent Address";
            }else if (data[i].verificationType == "currentAddress") {
               var typeOfVerification = "Current Address";
            }else if (data[i].verificationType == "education") {
               var typeOfVerification = "Academics";
            }else if (data[i].verificationType == "certificates") {
               var typeOfVerification = "Certificate";
            }else if (data[i].verificationType == "employement") {
               var typeOfVerification = "Employement";
            }else if (data[i].verificationType == "professionalEducation") {
               var typeOfVerification = "Professionals Academics";
            }else if(data[i].verificationType == "Identity"){
              var typeOfVerification = "Identity";
            }else if (data[i].verificationType == "reference") {
              var typeOfVerification = "Reference";
            }
            swal({
              title: "Please add Proof of Document in"+' '+typeOfVerification,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }); 
          }else{
             dataCount ++;
          }
        }
        // if (data.length == dataCount) {  
        //     if(this.props.userprofile.permanentAddress.length > 0 || this.props.userprofile.currentAddress.length > 0){            
        //         // var companyOrderObj = CompanyOrder.find({}).fetch();
        //         //  
        //         // if (companyOrderObj) {
        //         //   for (var i = 0; i < companyOrderObj.length; i++) {
        //         //     var requestPoolObj = RequestPool.findOne({"companyOrderId" : companyOrderObj[i]._id});
        //         //   }
        //         // }


        //         var billingDetails = {
        //           address  : this.props.userprofile.permanentAddress[0].line1 +","+ this.props.userprofile.permanentAddress[0].line2+","+ this.props.userprofile.permanentAddress[0].line3+","+ this.props.userprofile.permanentAddress[0].landmark,
        //           city     : this.props.userprofile.permanentAddress[0].city,
        //           state    : this.props.userprofile.permanentAddress[0].state,
        //           country  : this.props.userprofile.permanentAddress[0].country,
        //           pincode  : this.props.userprofile.permanentAddress[0].pincode,

        //         } 
                
        //         var selectedArr ={};
        //         var requestPool = RequestPool.find({}).fetch();
        //         if(requestPool){
        //           for (var i = 0; i < requestPool.length; i++) {
        //             if(requestPool[i].companyOrderId){
        //               var companyOrder = CompanyOrder.findOne({'_id':requestPool[i].companyOrderId}) || {};
                      
        //               if(companyOrder.orderDetails){
        //                 if(companyOrder.orderDetails.length > 0){
        //                   for (var j = 0; j < companyOrder.orderDetails.length; j++) {
        //                     var userProfile = UserProfile.findOne({'assureId':companyOrder.orderDetails[j].assureId,'userId':Meteor.userId()}) || {};
        //                     var companyProfile  = CompanyProfile.findOne({'companyAssureID':requestPool[i].companyAssureId}) || {};
        //                     if(companyProfile){
        //                       var companyName = companyProfile.companyName;
        //                     }else{
        //                       // var companyName = userProfile.firstName + ' ' + userProfile.lastName;
        //                       var companyName = '';
        //                     }

        //                     if(companyOrder.orderDetails[j].userId == Meteor.userId() && companyOrder.serviceId == this.props.services._id ){
        //                       // selectedArr.push({
        //                       //   "_id"        : requestPool[i]._id,
        //                       //   "tatDate"    : requestPool[i].tatDate._d,
        //                       //   "paidBy"     : requestPool[i].paidBy,
        //                       // });
        //                       selectedArr._id = requestPool[i]._id;
        //                       selectedArr.tatDate = requestPool[i].tatDate._d;
        //                       selectedArr.paidBy = requestPool[i].paidBy;
        //                     }
        //                   }
        //                 }
        //               }
        //             }
        //           }
        //         }
        //         invoiceData.billingDetails = billingDetails;
                
        //         if (selectedArr) {
        //            invoiceData.companyReference = this.props.userprofile.companyReferences;
        //            invoiceData.requestPoolId = selectedArr._id;
        //             if (selectedArr.paidBy == "Company") {
                          
        //                 Meteor.call("insertCompanyInvoice",invoiceData,function(error,result){
        //                    if (error) {
                            
        //                    }else{
        //                     // swal("Done","Temporary Invoice Genrated!"); 
        //                     var path = "/myOrders";
        //                     browserHistory.replace(path);
        //                    }
        //                 });
        //             }else{
                    
        //                var url      = this.props.params.id;
        //                var splitUrl = url.split('-');
        //                var orderId  = splitUrl[2];
                       
        //                Meteor.call("updateOrderVerification",orderId,data,(error,result)=>{
        //                 if(result == 1){
        //                     Meteor.call("insertInvoice",invoiceData,function(err,res){
        //                       if (error) {
                                
        //                       }else{
        //                         // swal("Done","Temporary Invoice Genrated!"); 
                                
        //                         var invoiceId = res;
        //                         Meteor.call('updateInvoiceDetailsInOrder',orderId,invoiceId,(error,result)=>{
        //                           if(result == 1){
        //                             Session.set('showInvoice','');
        //                             var path = "/ServiceInvoice/"+invoiceId;
        //                             browserHistory.replace(path);
        //                           }
                                  
        //                         });
                              
        //                       }
        //                     });
        //                 }
        //                })

                     
        //             }
        //          }            
        //     } else{
        //       swal('Please add address information.');
        //     } 

        //   }
        // }
        if (data.length == dataCount) {  
          if (this.props.userprofile.permanentAddress || this.props.userprofile.currentAddress) {

            if(this.props.userprofile.permanentAddress.length > 0 || this.props.userprofile.currentAddress.length > 0){            
              var billingDetails = {
                address  : this.props.userprofile.permanentAddress[0].line1 +","+ this.props.userprofile.permanentAddress[0].line2+","+ this.props.userprofile.permanentAddress[0].line3+","+ this.props.userprofile.permanentAddress[0].landmark,
                city     : this.props.userprofile.permanentAddress[0].city,
                state    : this.props.userprofile.permanentAddress[0].state,
                country  : this.props.userprofile.permanentAddress[0].country,
                pincode  : this.props.userprofile.permanentAddress[0].pincode,
              } 
              var selectedArr = {};
              var requestPool = RequestPool.find({}).fetch();
              if(requestPool){
               
              }
              invoiceData.billingDetails = billingDetails;   
                           
                           
              // if (selectedArr) {
                //  invoiceData.companyReference = this.props.userprofile.companyReferences;
                //  invoiceData.requestPoolId = selectedArr._id;
                 
                /*============================================================== */
                  var url      = FlowRouter.getParam('id');
                  var splitUrl = url.split('-');
                  var orderId  = splitUrl[2];
                  
                  var orders   = Order.findOne({"_id":orderId});
                  if (orders) {
                    if (orders.invoiceDetails) {
                      var orderInvoiceId = orders.invoiceDetails.invoiceId;
                        Meteor.call("updateOrderVerification",orderId,data,(error,result)=>{
                          if(result == 1){
                            Meteor.call("updateOrderInvoice",orderInvoiceId,invoiceData,function(err,res){
                              if (error) {
                                
                              }else{
                                // swal("Done","Temporary Invoice Genrated!"); 
                                 var path = "/ServiceInvoice/"+orderInvoiceId;
                                 FlowRouter.go(path);
                              }
                            });
                          }
                        }); 
                    }else{
                      Meteor.call("updateOrderVerification",orderId,data,(error,result)=>{
                        if(result == 1){
                            Meteor.call("insertInvoice",invoiceData,function(err,res){
                              if (error) {
                                
                              }else{
                                // swal("Done","Temporary Invoice Genrated!"); 
                                
                                var invoiceId = res;
                                Meteor.call('updateInvoiceDetailsInOrder',orderId,invoiceId,(error,result)=>{
                                  //  if(result == 1){
                                  //    Session.set('showInvoice','');
                                  //    var path = "/ServiceInvoice/"+invoiceId;
                                  //    browserHistory.replace(path);
                                  //  }
                                  
                                  
                                });
                                var orders = Order.findOne({"_id":orderId});                          
                                
                                if((orders) && (result == 1)){
                                  if(orders.paymentBy == "Company"){
                                    /**when company paid for candidate Generate ticket and land on myorder page*/
                                    var verificationDataLength = orders.candidateDetails.map((q)=> { if(q.candidateId == Meteor.userId()){ return q.verificationData.length;}  });
                                    
                                    var matchCandidateIndex = orders.candidateDetails.findIndex(x=> x.candidateId == Meteor.userId());  
                                    
                                    var verificationData = verificationDataLength.filter(verificationDataLength => verificationDataLength > 0);
                                    var actualVerificationDataLen =  verificationData[0];
                                    
                                    var index = actualVerificationDataLen - 1;
                                    
                        
                                    this.ticketGeneration(orders,index,matchCandidateIndex);
                                   
                                    var path = "/myOrders"; 
                                    FlowRouter.go(path);
                                  }else{
                                    var path = "/ServiceInvoice/"+invoiceId;
                                    FlowRouter.go(path);
                                  }
                                }
                              
                              }
                            });
                        }
                      });
                    }
                  }
              /*============================================================== */
              //  }            
            } else{
              swal('Please add address information.');
            } 
          }else{
             swal({
              title: "Please add address information!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }); 
          }

        }
      }
      }else{
          swal({
          title: "Please add information and then select one",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        }); 
      }
  }
  handleChange(event){
   // event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
 
  render(){
    if (!this.props.loading) {
     if (!this.props.loading1) {
     return(
      <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <h1 className="text-center headerinvoice">Required Information</h1>
          </div>
        </div> 
        
        { this.props.services.serviceRequired == "ProfileForms" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerpaddingForMobile">
              <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <i className="fa fa-user col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                    <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Basic Information</span>
                    {
                      this.props.userprofile ?
                       <i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" data-toggle="modal" data-target="#basicinfo" title="Edit Information"></i>
                      :
                      ""
                    }
                     <div className="modal fade" id="basicinfo" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-body">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h4 className="text-center">Edit Basic Information</h4>
                                <br/>
                                <BasicForm basicValues={this.props.userprofile}/>
                              </div>
                            </div>
                          </div>
                        </div> 
                      </div>
                    </div> 

                </div>
                <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                    <BasicInfoRequired  userData={this.props.userprofile}/>
                </div>
                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerpaddingForMobile"> 
                    { this.props.userprofile.userProfile ?
                       <div>
                        <input type="file" className="btn btn-info inputFileUser" onChange={this.uploadProfileImg.bind(this)}/>  
                  
                        <div className="userImageOnServiceOuter" onClick={this.inputFileChange.bind(this)}>
                           <img src={this.props.userprofile.userProfile} title="Change profile picture"   className="img-responsive userImageOnService"/>
                        </div>
                      </div>   
                      : 
                       <div>
                          <input type="file" onChange={this.uploadProfileImg.bind(this)} className="btn btn-info inputFileUser"/>  
                          <div className="addUserImageAtService" onClick={this.inputFileChange.bind(this)}>
                            <i className="fa fa-plus-circle fa-lg inputFileSpan"></i><br/>Add Your Photo
                          </div>
                        </div>
                    }
                   
                  </div>
                </div>
              </div>
            </div>
            :
          ""
        }
        
        { this.props.services.serviceRequired == "StatutoryForm" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerpaddingForMobile">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <i className="fa fa-id-card col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                    <span className="col-lg-9 col-md-9 col-sm-9 col-xs-9 viewTitle">Identity Information</span>
                    {/*
                      this.props.userprofile ?
                       <i className="fa fa-pencil add-btn pull-right col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right" data-toggle="modal" data-target="#identityinfo" title="Edit Information"></i>
                      :
                      ""
                   */ }
                   {/*<div className="modal fade" id="identityinfo" role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <h4 className="text-center">Edit Identity Information</h4>
                              <br/>
                              <StatutoryForm identityValues={this.props.userprofile.identity}/>
                            </div>
                          </div>
                        </div>
                      </div> 
                    </div>
                  </div>*/}

                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <IdentityRequired  serviceDetails ={this.props.services} userData={this.props.userprofile}/>
                </div>
            </div>
          </div>
            :
          ""
        }
        { this.props.services.serviceRequired == "AddressForm" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
               <AddressRequired profileId={this.props.userprofile._id} permanentAddress={this.props.userprofile.permanentAddress} currentAddress={this.props.userprofile.currentAddress} />
                {/*this.props.services.serviceName == "Address Verification" ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter outeraddresssType">
                     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <h5 className="pull-left">Which address is to be verified</h5>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <form>
                            <input type="radio" name="address" ref="address" className="addressRadioInput" value="permanentAddress" onChange={this.handleChange} checked={this.state.address === 'permanentAddress'} />&nbsp; <label className="addressRadioLabel" >Permanent Address</label>
                            <input type="radio" name="address" ref="address" className="addressRadioInput" value="currentAddress" onChange={this.handleChange} checked={this.state.address === 'currentAddress'}/>&nbsp; <label className="addressRadioLabel"> Current Address</label>
                            <input type="radio" name="address" ref="address" className="addressRadioInput" value="both" onChange={this.handleChange} checked={this.state.address === 'both'}/>&nbsp; <label className="addressRadioLabel"> Both </label>
                          </form>
                        </div>
                      </div> 
                   </div>
                 :
                 ""
                 */} 
              </div>
            </div>
          </div>
            : 
          ""
        }
         
        { this.props.services.serviceRequired == "WorkForm"  ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OuterexperienceBlock noProfilePadding">
                 <EmploymentRequired key={this.props.userprofile._id + '-employement'} employeeData={this.props.userprofile.employement}/>       
               </div>
            </div>
           </div>
            :
          ""
        }
          
        { this.props.services.serviceRequired  == "EducationForm" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <AcademiceRequired key={this.props.userprofile._id + '-academics'} academicsData={this.props.userprofile.education} professionalData={this.props.userprofile.professionalEducation} />
              </div>
            </div>
          </div>
            :
          ""
        }
          
        { this.props.services.serviceRequired  == "SkillsCertificate" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <i className="fa fa-certificate col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                  <span className="col-lg-10 col-md-10 col-sm-10 col-xs-9 viewTitle">Skills</span>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
                    <i className="fa fa-plus add-plus pull-right" data-toggle="modal" title="Add Skills" data-target="#skillsinfo"></i>
                  </div>
                   <SkillsRequired userId={this.props.userprofile.userId} skillData={this.props.userprofile.skills}/>
                   <div className="modal fade" id="skillsinfo" role="dialog">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-body">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h4 className="text-center">Add Skills</h4>
                                <br/>
                                <SkillsForm />
                              </div>
                            </div>
                          </div>
                        </div> 
                      </div>
                    </div>
                </div>
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <CertificateRequired key={this.props.userprofile._id + '-certificate'} certificateData={this.props.userprofile.certificates} />
                </div>1
            </div>
          </div>
          :
          ""
        }     
        {/* this.props.services.serviceRequired  == "ReferenceForm" ?
          <div className="servicesTypeBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
            <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                   <ReferralRequired key={this.props.userprofile._id + '-referral'} referralData={this.props.userprofile.reference}/>
                </div>
            </div>
          </div>
            :
          "" 
        */}
          
        <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12">
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerpaddingForMobile">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
              <button className="col-lg-3 col-md-4 col-xs-5 col-sm-5 btn ServiceProcessButtons pull-left" onClick={this.backClick.bind(this)} value="" >Back</button>
              <button className="col-lg-3 col-md-4 col-xs-5 col-sm-5 btn ServiceProcessButtons pull-right" onClick={this.purchaseClick.bind(this)} type="submit" value="" >Procced</button>
            </div>
        </div>
        </div> 
      </div>
      );
      }else{
        return(<span>Loading</span>);
      }  
    }else{
      return(
       <span>Loading</span>
      );
    }
  }
}
requiredInfoContainer = withTracker(({params}) =>{
    var paramsId = FlowRouter.getParam('id');
    var splitId  = paramsId.split('-');
    var _id      = splitId[0];
    var orderId  = splitId[2];
    const postHandle = Meteor.subscribe('singleServices',_id);
    const orderData  = Meteor.subscribe("singleOrder",orderId);
    const postHandle1 = Meteor.subscribe('userprofile',Meteor.userId());

    const loading  = !postHandle.ready();
    const loading1 = !postHandle1.ready()&& !orderData.ready();
    
    const services = Services.findOne({"_id":_id});
    const packages = Services.findOne({"_id":_id});

    const userprofile  = UserProfile.findOne({"userId" : Meteor.userId()});
    // console.log("before userprofile", userprofile);
    const order        = Order.findOne({"_id" : orderId});

    if (order) {
      var candidate = order.candidateDetails.find(i => i.candidateId === userprofile.userId);
      if (candidate) {
        var verificationData = candidate.verificationData;
      }
    }

    if (userprofile){
      var count = 1;
        if (verificationData){      
          for (var j = 0; j < verificationData.length; j++) {
            if (verificationData[j].verificationType == "permanentAddress") {
              if(userprofile.permanentAddress){
                for(var i = 0 ; i < userprofile.permanentAddress.length;i++){
                  if (userprofile.permanentAddress[i].permanentAddressId == verificationData[j].permanentAddressId) {
                    userprofile.permanentAddress[i].chkid = count;
                    userprofile.permanentAddress[i].value = true;
                    count++;
                  } 
                }
                for(var i = 0 ; i < userprofile.permanentAddress.length;i++){
                  if(!userprofile.permanentAddress[i].chkid){
                    userprofile.permanentAddress[i].chkid = count;
                    userprofile.permanentAddress[i].value = false;
                    count++;
                  }
                }
              }
            }else if (verificationData[j].verificationType == "currentAddress") {
               if(userprofile.currentAddress){
                  for(var i = 0 ; i < userprofile.currentAddress.length;i++){
                    if (userprofile.currentAddress[i].currentAddressId == verificationData[j].currentAddressId) {
                      userprofile.currentAddress[i].chkid = count;
                      userprofile.currentAddress[i].value = true;
                      count++;
                    }
                  }
                  for(var i = 0 ; i < userprofile.currentAddress.length;i++){
                    if(!userprofile.currentAddress[i].chkid){
                      userprofile.currentAddress[i].chkid = count;
                      userprofile.currentAddress[i].value = false;
                      count++;
                    }
                  }
                }
            }else if (verificationData[j].verificationType == "employement") {
              if(userprofile.employement){
                for(var i = 0 ; i < userprofile.employement.length;i++){
                  if (userprofile.employement[i].employementId == verificationData[j].employementId) {
                    userprofile.employement[i].chkid = count;
                    userprofile.employement[i].value = true;
                    count++;
                  }
                }
                for(var i = 0 ; i < userprofile.employement.length;i++){
                  if(!userprofile.employement[i].chkid){
                    userprofile.employement[i].chkid = count;
                    userprofile.employement[i].value = false;
                    count++;
                  }
                }
              }
            }else if (verificationData[j].verificationType == "education") {
              if(userprofile.education){
                for(var i = 0 ; i < userprofile.education.length;i++){
                  if (userprofile.education[i].educationId == verificationData[j].educationId ){
                    userprofile.education[i].chkid = count;
                    userprofile.education[i].value = true;
                    // console.log('userprofile.education[',i,'].value = ',userprofile.education[i].value);
                    count++;
                  }
                }
                for(var i = 0 ; i < userprofile.education.length;i++){
                  if(!userprofile.education[i].chkid){
                    userprofile.education[i].chkid = count;
                    userprofile.education[i].value = false;
                    count++;
                  }
                }
              }
            }else if (verificationData[j].verificationType == "professionalEducation") {
              if(userprofile.professionalEducation){
                for(var i = 0 ; i < userprofile.professionalEducation.length;i++){
                  if (userprofile.professionalEducation[i].professionalEducationId == verificationData[j].professionalEducationId) {
                    userprofile.professionalEducation[i].chkid = count;
                    userprofile.professionalEducation[i].value = true;
                    count++;
                  }
                }
                for(var i = 0 ; i < userprofile.professionalEducation.length;i++){
                  if(!userprofile.professionalEducation[i].chkid){
                    userprofile.professionalEducation[i].chkid = count;
                    userprofile.professionalEducation[i].value = false;
                    count++;
                  }
                }
              }
            }else if (verificationData[j].verificationType == "certificates") {
              if(userprofile.certificates){
                for(var i = 0 ; i < userprofile.certificates.length;i++){
                  if (userprofile.certificates[i].certificateId == verificationData[j].certificateId) {
                    userprofile.certificates[i].chkid = count;
                    userprofile.certificates[i].value = true;
                    count++;
                  }
                }
                for(var i = 0 ; i < userprofile.certificates.length;i++){
                  if(!userprofile.certificates[i].chkid){
                    userprofile.certificates[i].chkid = count;
                    userprofile.certificates[i].value = false;
                    count++;
                  }
                }
              }
            }else if (verificationData[j].verificationType == "Identity") {
              if (verificationData[j].identityType == "Aadhar Card") {
                userprofile.identity.adharCardChkid = count;
                userprofile.identity.adharCardvalue = true;
                count++;
              }
              if(!userprofile.identity.adharCardChkid){
                userprofile.identity.adharCardChkid = count;
                userprofile.identity.adharCardvalue = false;
                count++;
              }
              if (verificationData[j].identityType == "Pan Card") {
                userprofile.identity.panCardChkid = count;
                userprofile.identity.panCardvalue = true;
                count++;
              }
              if (!userprofile.identity.panCardChkid){
                userprofile.identity.panCardChkid = count;
                userprofile.identity.panCardvalue = false;
                count++;
              }
              if (verificationData[j].identityType == "Driving License") {
                userprofile.identity.drivingCardchkid = count;
                userprofile.identity.drivingCardvalue = true;
                count++;
              }
              if (!userprofile.identity.drivingCardchkid){
                userprofile.identity.drivingCardchkid = count;
                userprofile.identity.drivingCardvalue = false;
                count++;
              }

              if (verificationData[j].identityType == "Voting Card") {
                userprofile.identity.votingCardchkid = count;
                userprofile.identity.votingCardvalue = true;
                count++;
              }
              if (!userprofile.identity.votingCardchkid){
                userprofile.identity.votingCardchkid = count;
                userprofile.identity.votingCardvalue = false;
                count++;
              }
              if (verificationData[j].identityType == "Ration Card") {
                userprofile.identity.rationCardchkid  = count;
                userprofile.identity.rationCardvalue  = true;
                count++;
              }
              if (!userprofile.identity.rationCardchkid){
                userprofile.identity.rationCardchkid = count;
                userprofile.identity.rationCardvalue = false;
                count++;
              }
              if (verificationData[j].identityType == "Passport" ) {
                userprofile.identity.passportchkid = count;
                userprofile.identity.passportvalue = true;
                count++;
              }  
              if (!userprofile.identity.passportchkid){
                userprofile.identity.passportchkid = count;
                userprofile.identity.passportvalue = false;
                count++;
              }         
            }else if (verificationData[j].verificationType == "reference") {
              if(userprofile.reference){
                for(var i = 0 ; i < userprofile.reference.length;i++){
                  if (userprofile.reference[i].referenceId == verificationData[j].referenceId) {
                    userprofile.reference[i].chkid = count;
                    userprofile.reference[i].value = true;
                    count++;
                  }
                }
                for(var i = 0 ; i < userprofile.reference.length;i++){
                  if(!userprofile.reference[i].chkid){
                    userprofile.reference[i].chkid = count;
                    userprofile.reference[i].value = false;
                    count++;
                  }
                }
              }
            }
          }//EOF j loop
        }else{
          if(userprofile.permanentAddress){
            for(i = 0 ; i < userprofile.permanentAddress.length;i++){
              userprofile.permanentAddress[i].chkid = count;
              userprofile.permanentAddress[i].value = false;
              count++;
            }
          }
          if(userprofile.currentAddress){
            for(i = 0 ; i < userprofile.currentAddress.length;i++){
              userprofile.currentAddress[i].chkid = count;
              userprofile.currentAddress[i].value = false;
              count++;
            }
          }
          if(userprofile.employement){
            for(i = 0 ; i < userprofile.employement.length;i++){
              userprofile.employement[i].chkid = count;
              userprofile.employement[i].value = false;
              count++;
            }
          }
          if(userprofile.education){
            for(i = 0 ; i < userprofile.education.length;i++){
              userprofile.education[i].chkid = count;
              userprofile.education[i].value = false;
              count++;
            }
          }
          if(userprofile.professionalEducation){
            for(i = 0 ; i < userprofile.professionalEducation.length;i++){
              userprofile.professionalEducation[i].chkid = count;
              userprofile.professionalEducation[i].value = false;
              count++;
            }
          }
          if(userprofile.certificates){
            for(i = 0 ; i < userprofile.certificates.length;i++){
              userprofile.certificates[i].chkid = count;
              userprofile.certificates[i].value = false;
              count++;
            }
          }
          if(userprofile.identity){
            if(userprofile.identity.adharCardNo){
              userprofile.identity.adharCardChkid = count;
              userprofile.identity.adharCardvalue = false;
              count++;
            }
            if(userprofile.identity.panCardNo){
              userprofile.identity.panCardChkid = count;
              userprofile.identity.panCardvalue = false;
              count++;
            }
            if(userprofile.identity.drivingCardNo){
              userprofile.identity.drivingCardchkid = count;
              userprofile.identity.drivingCardvalue = false;
              count++;
            }
            if(userprofile.identity.votingCardNo){
              userprofile.identity.votingCardchkid = count;
              userprofile.identity.votingCardvalue = false;
              count++;
            }
            if(userprofile.identity.rationCardNo){
              userprofile.identity.rationCardchkid = count;
              userprofile.identity.rationCardvalue = false;
              count++;
            }
            if(userprofile.identity.passportNo){
              userprofile.identity.passportchkid = count;
              userprofile.identity.passportvalue = false;
              count++;
            }
          }
          if(userprofile.reference){
            for(i = 0 ; i < userprofile.reference.length;i++){
                userprofile.reference[i].chkid = count;
                userprofile.reference[i].value = false;
                count++;
            }
          }
        }
        userprofile.chkcount = count;
    }
    // console.log("services userprofile",services);
    return{
        loading,
        loading1,
        services,
        userprofile
   };
})(ServiceRequiredData);
export default requiredInfoContainer;