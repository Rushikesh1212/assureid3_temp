import React, { Component } from 'react';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Packages } from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import AgreementTable from '/imports/admin/adminDashboard/corporateManagement/component/AgreementTable.jsx';

class AddNewContract extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      "companyName"   : '', 
      "scopeOfWork"   : '',
      // "serviceLevelAgreement"  : [],
      'pricing' : '', 
      "authenticationLetter" : '',
      "contractDescription" : '',
      "validFrom"       : '',
      "validTo"         : '',
      "searchArray"     : [],
      "button"          : 'ADD', 
      'serviceRate'     :'',
      "serviceLevelAgreement" : [],
      "subscription"  : {
          "companyProfileDetails" : Meteor.subscribe('companyProfileDetails'),
      },  
    }; 
  } 
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.contractObj){
    // console.log("nextProps :",nextProps.contractObj);
         this.setState({
             companyName           : nextProps.contractObj.companyName,
             companyId             : nextProps.contractObj.companyId,
             serviceLevelAgreement : nextProps.serviceLevelAgreement,
             contractDescription   : nextProps.contractObj.contractDescription,
             validFrom             : nextProps.contractObj.validFrom,
             validTo               : nextProps.contractObj.validTo,
             "scopeOfWorkDoc"      : nextProps.contractObj.scopeOfWorkDoc,
             "scopeOfWorkFileName" : nextProps.contractObj.scopeOfWorkFileName,
             "scopeOfWorkFileExt"  : nextProps.contractObj.scopeOfWorkFileExt,
             "pricingDoc"          : nextProps.contractObj.pricingDoc,
             "pricingFileName"     : nextProps.contractObj.pricingFileName,
             "pricingFileExt"      : nextProps.contractObj.pricingFileExt,
             "authenticationLetterDoc" : nextProps.contractObj.authenticationLetterDoc,
             "authenticationLetterFileName" : nextProps.contractObj.authenticationLetterFileName,
             "authenticationLetterFileExt"  : nextProps.contractObj.authenticationLetterFileExt,
             "corporateTotalOrder"          : nextProps.contractObj.corporateTotalOrder,                                             
             "corporateCompleteOrder"       : nextProps.contractObj.corporateCompleteOrder,                                             
             "totalCandidateRequested"      : nextProps.contractObj.totalCandidateRequested,                                           
             "actualCandidateVerified"      : nextProps.contractObj.actualCandidateVerified,   
              button                        : nextProps.button,
         });
      }else{
        this.setState({
         companyName           : nextProps.companyName,
         companyId             : nextProps.companyId,
         serviceLevelAgreement : nextProps.serviceLevelAgreement,
         contractDescription   : '',
         validFrom             : '',
         validTo               : '',
         "scopeOfWorkDoc"      : '',
         "scopeOfWorkFileName" : '',
         "scopeOfWorkFileExt"  : '',
         "pricingDoc"          : '',
         "pricingFileName"     : '',
         "pricingFileExt"      : '',
         "authenticationLetterDoc" : '',
         "authenticationLetterFileName" : '',
         "authenticationLetterFileExt"  : '',
         "corporateTotalOrder"          : 0,                                             
         "corporateCompleteOrder"       : 0,                                             
         "totalCandidateRequested"      : 0,                                           
         "actualCandidateVerified"      : 0,   
         button                : nextProps.button,
        });
      }
     
     
    }else{
      this.setState({
             companyName           : '',
             companyId             : '',
             serviceLevelAgreement : [],
             contractDescription   : '',
             validFrom             : '',
             validTo               : '',
             "scopeOfWorkDoc"      : '',
             "scopeOfWorkFileName" : '',
             "scopeOfWorkFileExt"  : '',
             "pricingDoc"          : '',
             "pricingFileName"     : '',
             "pricingFileExt"      : '',
             "authenticationLetterDoc" : '',
             "authenticationLetterFileName" : '',
             "authenticationLetterFileExt"  : '',
             "corporateTotalOrder"          : 0,                                             
             "corporateCompleteOrder"       : 0,                                             
             "totalCandidateRequested"      : 0,                                           
             "actualCandidateVerified"      : 0, 
              button                : "ADD",

      });
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
    // $('#serviceLevelAgreement').multipleSelect();
  }
  componentWillMount() {
  
  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove(); 
  }
  // handleChange(event){
  //    const target = event.target;
  //    const name   = target.name;
  //    this.setState({
  //     [name]: event.target.value,
  //    });
  // }
 
  //Scope Of Work document upload
  handleScopeOfWorkUpload(event){ 
    event.preventDefault();
    let self = this;
    Session.set("uploadScopeOfWorkProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) { 
        var dataImg  = event.currentTarget.files[0];  
        var fileName = dataImg.name;
        var fileSize = dataImg.size;         
        var ext      = fileName.split('.').pop();
        var size     = 1073741824;

       if(ext == "pdf" || ext == "PDF" || ext == "pdfx"){      
         var reader = new FileReader();        reader.onload = function (e) {          
           // $('.uploadedImageFromLocl').attr('src', e.target.result);      
         };       
         reader.readAsDataURL(event.currentTarget.files[0]);      
         var file = event.currentTarget.files[0];      
          if (file) {
            if (fileSize < size) {       
              addContractToS3Function(file,self,"scopeOfWork");  
            }else{
              swal("File not uploaded!","Document size limit is upto 1gb.","error");
            }     
          }   
       } else { 
        swal({    
           position: 'top-right',     
           type: 'error',    
           title: 'Only .pdf files are allowed',       
           showConfirmButton: false,      
           timer: 3000      
         });   
      }
    }
  }
  //pricing document upload
  handlePricingUpload(event){ 
    event.preventDefault();
    let self = this;
    Session.set("uploadScopeOfWorkProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) { 
      var dataImg  = event.currentTarget.files[0];  
      var fileName = dataImg.name;
      var fileSize = dataImg.size;         
      var ext      = fileName.split('.').pop();
      var size     = 1073741824;

       if(ext == "pdf" || ext == "PDF" || ext == "pdfx"){      
         var reader = new FileReader();        reader.onload = function (e) {          
           // $('.uploadedImageFromLocl').attr('src', e.target.result);      
         };       
         reader.readAsDataURL(event.currentTarget.files[0]);      
         var file = event.currentTarget.files[0];      
          if (file) {   
            if (fileSize < size) {            
              addContractToS3Function(file,self,"pricing");
            }else{
              swal("File not uploaded!","Document size limit is upto 1gb.","error");
            }            
          }   
       } else { 
        swal({    
           position: 'top-right',     
           type: 'error',    
           title: 'Only .pdf files are allowed',       
           showConfirmButton: false,      
           timer: 3000      
         });   
      }
    }
  }
  //Auth Letter document upload
  handleAuthLetterUpload(event){ 
    event.preventDefault();
    let self = this;
    Session.set("uploadScopeOfWorkProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) { 
      var dataImg  = event.currentTarget.files[0];  
      var fileSize = dataImg.size;         
      var fileName = dataImg.name;
      var ext      = fileName.split('.').pop();
      var size     = 1073741824;
       if(ext == "pdf" || ext == "PDF" || ext == "pdfx"){      
         var reader = new FileReader();        reader.onload = function (e) {          
           // $('.uploadedImageFromLocl').attr('src', e.target.result);      
         };       
         reader.readAsDataURL(event.currentTarget.files[0]);      
         var file = event.currentTarget.files[0];      
          if (file) { 
            if (fileSize < size) {             
              addContractToS3Function(file,self,"authenticationLetter"); 
            }else{
              swal("File not uploaded!","Document size limit is upto 1gb.","error");
            }       
          }   
       } else { 
        swal({    
           position: 'top-right',     
           type: 'error',    
           title: 'Only .pdf files are allowed',       
           showConfirmButton: false,      
           timer: 3000      
         });   
      }
    }
  }
  //Scope Of Work document progress bar
  getScopeOfWorkPercentage(){
    var uploadProgressPercent = Session.get("uploadScopeOfWorkProgressPercent");
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
                Session.set("uploadScopeOfWorkProgressPercent",0); 
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
  //Pricing document progress bar
  getPricingPercentage(){
    var uploadProgressPercent = Session.get("uploadPricingProgressPercent");
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
                Session.set("uploadPricingProgressPercent",0); 
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
  //Auth Letter document progress bar
  getAuthLetterPercentage(){
    var uploadProgressPercent = Session.get("uploadAuthLetterProgressPercent");
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
                Session.set("uploadAuthLetterProgressPercent",0); 
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
  //regular expression
  buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
      return "(?=.*" + word + ")";
    });
    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
  }
  //auto search function
  getTextValueWhenType(event){
    var textValue= $(event.target).val();
    // console.log("textValue = ",textValue);
    var companyNameArray = [];
    if(textValue != ""){
      var RegExpBuildValue = this.buildRegExp(textValue); 
      // console.log("RegExpBuildValue",RegExpBuildValue);
      var searchData       = CompanyProfile.find({'companyName':RegExpBuildValue}).fetch();
      // console.log("searchData",searchData);
      if(searchData){
        if($(event.target).hasClass('companyName')){
          var pluckName  = _.pluck(searchData,"companyName");
          // console.log("pluckName",pluckName);
          var uniqueName = _.uniq(pluckName);
          var data       = CompanyProfile.findOne({"companyName":uniqueName[0]});
          if (data) {
            var Id       = data._id;
            companyNameArray.push({"companyName":uniqueName[0],"Id":Id});
            this.setState({"searchArray":companyNameArray});
          }
        }
      }else{ 
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).val('');
    }
  }
  //on change function for array elements
  handleChangeForServices(event){
    const target = event.target;
    // 
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    // 
    const name   = target.name;
    var id    = $(event.currentTarget).attr('id');
    var splitID = id.split("-");
    var index   = parseInt(splitID[1]);
    this.state.serviceLevelAgreement[index].value = value;

    this.setState({
     [name]: event.target.value,
    });
  }
  //submit form function
  contractForm(event){
    event.preventDefault();
    if ($('#addContractForm').valid()) {
    var companyName = this.refs.companyName.value;
    if (this.state.companyId) {
      var companyId = this.state.companyId;
    }else{
      var companyId = $('#autoCompanyName option').filter(function() {
            return this.value == companyName;
        }).data('id');         
    }
    var serviceLevelAgreement = [];
    // console.log("this.props.serviceLevelAgreement.length :", this.props.serviceLevelAgreement.length);
      if(this.props.serviceLevelAgreement.length >0){
        for (var i = 0; i < this.props.serviceLevelAgreement.length; i++) {
          var checkBoxId = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").val(); 
          var name       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-name');
          var type       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-type');
          var oldtat     = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-number');
          var serviceRequired = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-servicerequired');
          var serviceCount    = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-servicecount');
          if (checkBoxId) {
            var value   = true;
            var tat     = $("#newTATDays-"+i).val();
            var serviceRate = $("#serviceRate-"+i).val();
            
            if (tat) {
              serviceLevelAgreement.push({"_id": checkBoxId, "Name": name, "TAT": tat,"value":value,"type": type,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount":serviceCount});
            }else{
              serviceLevelAgreement.push({"_id": checkBoxId, "Name": name, "TAT": oldtat,"value":value,"type": type,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount":serviceCount});
            }
          }else{
            var value   = false;
            var unselectcheckBoxId = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").val(); 
            var unselectname       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-name');
            var unselecttype       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-type');
            var unselectoldtat     = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-number');
            var serviceRequired    = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-servicerequired');
            
            
            var unselecttat        = $("#newTATDays-"+i).val();
            if (unselecttat) {
              serviceLevelAgreement.push({"_id": unselectcheckBoxId, "Name": unselectname, "TAT": unselecttat,"value":value,"type": unselecttype,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount":serviceCount});
            }else{
              serviceLevelAgreement.push({"_id": unselectcheckBoxId, "Name": unselectname, "TAT": unselectoldtat,"value":value,"type": unselecttype,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount":serviceCount});
            }
          }
        }
      }else{
        swal("Atleast one service must be selected");
      }
     
    var contractDescription = this.refs.contractDescription.value;
    var validFrom           = this.refs.validFrom.value;
    var validTo             = this.refs.validTo.value;
    var flag = true; 
    var newValidFromDate = new Date(validFrom);
    var newValidToDate = new Date(validTo);
    var todaysDate    = new Date();
    if(todaysDate < newValidFromDate){
      var contractStatus  = "Inactive";
    }else if(todaysDate <= newValidToDate){
      var contractStatus  = "Active";
    }else if((todaysDate < newValidFromDate) || (todaysDate > newValidToDate)){
      flag = false;  
    }


    var contractExist = CompanyProfile.findOne({"_id":companyId,"contract.contractStatus":"Active"});
    if(contractExist){
      //   console.log("todaysDate <= contractExist.contract.validTo :",todaysDate +"<="+ contractExist.contract.validTo);
      //  if(todaysDate <= contractExist.contract.validTo){
      //    swal("Please First Inactive contract and then add new contract");
      //  }
      contractStatus = "Inactive";
    }

    
    if(flag){
      if (companyId || companyName) {
        var trueValue = this.state.serviceLevelAgreement.findIndex(x => x.checked==true);
        if(trueValue>-1){
          Meteor.call('updateContractToCompanyProfile',companyName,companyId,serviceLevelAgreement,contractDescription,validFrom,validTo,contractStatus,function(error,result){
            if (error) {
            }else{
              swal("Done","Contract Added successfully.","success");
              $(".companyName").val("");
              $(".contractDescription").val("");
              $(".validFrom").val("");
              $(".validTo").val("");
              FlowRouter.go('/admin/ListOfCorporates');
            }
          });
        }else{
          swal("Select atleast one service");
        }
      }else{
        swal("Invalid data","Please add company name!","error");
      }
    }else{
      swal("Invalid date","Please enter valid date!","error");
    }
   }
  }


  handleChange(event){
    event.preventDefault();
     const target = event.target;
     const value  = target.value;
     const name   = target.name;
    
     this.setState({
       [name]: event.target.value,
     });
   }

  //update form function
  updateContract(event){
    event.preventDefault();    
    if ($('#addContractForm').valid()){
      if (this.state.companyName){
        var companyName = this.state.companyName;
        var companyId   = this.state.companyId;
      }else{
        var companyName = this.refs.companyName.value;
        var companyId = $('#autoCompanyName option').filter(function() {
                return this.value == companyName;
            }).data('id');  
      }       
      var serviceLevelAgreement = [];
      
      if(this.state.serviceLevelAgreement.length>0){
          for (var i = 0; i < this.state.serviceLevelAgreement.length; i++){
            var checkBoxId      = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").val(); 
            var name            = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-name');
            var type            = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-type');
            var oldtat          = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-number');
            var serviceRequired = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-servicerequired');
            var serviceCount    = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:checked").attr('data-servicecount');
            if (checkBoxId) {          
              var value   = true;
              var tat     = $("#newTATDays-"+i).val();
              var serviceRate = $("#serviceRate-"+i).val();           
              if (tat) {  
                serviceLevelAgreement.push({"_id": checkBoxId, "Name": name, "TAT": tat,"value":value,"type": type,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount": serviceCount });
              }else{
                serviceLevelAgreement.push({"_id": checkBoxId, "Name": name, "TAT": oldtat,"value":value,"type": type,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount": serviceCount});
              }
            }else{
              var value   = false;
              var unselectcheckBoxId = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").val(); 
              var unselectname       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-name');
              var unselecttype       = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-type');
              var unselectoldtat     = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-number');
              var serviceRequired    = $("input:checkbox[id=serviceLevelCheckbox-"+i+"]:not(:checked)").attr('data-servicerequired');          
              var unselecttat        = $("#newTATDays-"+i).val();
              if (unselecttat) {
                serviceLevelAgreement.push({"_id": unselectcheckBoxId, "Name": unselectname, "TAT": unselecttat,"value":value,"type": unselecttype,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount": serviceCount});
              }else{
                serviceLevelAgreement.push({"_id": unselectcheckBoxId, "Name": unselectname, "TAT": unselectoldtat,"value":value,"type": unselecttype,"serviceRate":serviceRate,"serviceRequired":serviceRequired,"totalOrders":0,"completedOrders":0,"serviceCount": serviceCount});
              }
            }
        
        }
        // else{
        //   swal("Select atleast one service");
        // }
      }
    
      var contractDescription = this.refs.contractDescription.value;
      var validFrom = this.refs.validFrom.value;
      var validTo   = this.refs.validTo.value;

      var corporateTotalOrder     = this.state.corporateTotalOrder;                                        
      var corporateCompleteOrder  = this.state.corporateCompleteOrder;                                             
      var totalCandidateRequested = this.state.totalCandidateRequested;                                           
      var actualCandidateVerified = this.state.actualCandidateVerified; 
      
      var flag = true; 
      var newValidFromDate = new Date(validFrom);
      var newValidToDate = new Date(validTo);
      var todaysDate    = new Date();
      // console.log("Todays Date :",todaysDate);
      // console.log('newValidFromDate: ', newValidFromDate);
      if(todaysDate < newValidFromDate && newValidFromDate< newValidToDate){
        var contractStatus  = "Inactive";
      }else if(todaysDate <= newValidToDate){
        var contractStatus  = "Active";
      }else if((todaysDate < newValidFromDate) || (todaysDate > newValidToDate || newValidFromDate>= newValidToDate)){
        flag = false;  
      }
      // console.log("contractStatus :",contractStatus);
      
      var contractIndex  = this.props.contractId;
      var contractExist = CompanyProfile.findOne({"_id":companyId,"contract.contractStatus":"Active"});
      if((contractExist) && (contractExist.contract[contractIndex].contractStatus =="Active")){
        //   console.log("todaysDate <= contractExist.contract.validTo :",todaysDate +"<="+ contractExist.contract.validTo);
        //  if(todaysDate <= contractExist.contract.validTo){
        //    swal("Please First Inactive contract and then add new contract");
        //  }
        contractStatus = "Active";
      }else{
        contractStatus = "Inactive";        
      }
      /**Check contract field exist or not if exist check data range */
      var contractExistFromDate = '';
      var contractExistToDate   = '';
      if(flag){
        if (companyId) {
          var trueValue = this.state.serviceLevelAgreement.findIndex(x => x.checked==true);
          if(trueValue>-1){
            Meteor.call('updateContract',companyName,companyId,contractIndex,serviceLevelAgreement,contractDescription,validFrom,validTo,contractStatus,corporateTotalOrder,corporateCompleteOrder,totalCandidateRequested,actualCandidateVerified,function(error,result){
              if (error) {
                
              }else{
                swal("Done","Contract Updated successfully.","success");
                $(".companyName").val("");
                $(".contractDescription").val("");
                $(".validFrom").val("");
                $(".validTo").val("");
                
                FlowRouter.go("/admin/ListOfCorporates");
              }
            });
          }else{
            swal("Select atleast one service");
          }
        }else{
          swal("Invalid data","Please add company name!","error");
        }
      }else{
        swal("Invalid Date","Please enter valid date!","error");
        
      }
    }
  }
 
  removeScopeDoc(event){
    var dataDetails = $(event.target).attr('data-id');
    var splitData   = dataDetails.split('-');
    var link     = splitData[0];
    var id       = splitData[1];
    var scopeDoc = splitData[2];
    
    Meteor.call('removeCompanyProfileDoc',id,link,scopeDoc,(error,result)=>{
      if(result){
         swal("Document deleted successfully");
      }
    });

  }
  render() { 
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Corporate Management </h1>
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-file-o"/> Corporate Management</a></li>
          <li className="active">Add Contract</li>
        </ol>
      </section>
       <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                {
                  this.state.companyName ?
                    <h2 className="box-title">Edit New Contract</h2>  
                    
                  :
                    <h2 className="box-title">Add New Contract</h2>  
                }
                </div>
                <div className="box-body">  
                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <form id="addContractForm" onSubmit={this.props.contractObj ? this.updateContract.bind(this) : this.contractForm.bind(this)}>
                      <div className="row inputrow">
                         <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                          <span className="blocking-span">
                              <label className="floating-label">Add Company Name<span className="astrikReq">*</span></label>
                              {this.state.companyName ?
                                <input type="text" list="autoCompanyName" className="form-control inputText companyName" ref="companyName" id="companyName" name="companyName" onChange={this.handleChange.bind(this)} onInput={this.getTextValueWhenType.bind(this)} value={this.state.companyName}/>
                                :
                                 <input type="text" list="autoCompanyName" className="form-control inputText companyName" ref="companyName" id="companyName" name="companyName" onChange={this.handleChange.bind(this)} onInput={this.getTextValueWhenType.bind(this)} value ={this.props.companyName} required/>
                              }
                          </span> 
                          <datalist className="autocomplete" id="autoCompanyName">
                            { 
                              this.state.searchArray.map((searchDetails, index)=>{
                                return(
                                  <option value={searchDetails.companyName} data-id={searchDetails.Id} key={index} >{searchDetails.companyName}</option>                        
                                );
                              })
                            }
                          </datalist>
                        </div>
                        {
                          this.state.scopeOfWorkDoc && this.props.contractObj? 
                            <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                             
                              <span className="blocking-span">
                                  <label className="floating-label">Scope Of Work (only pdf format accepted)<span className="astrikReq">*</span></label>
                                  <input type="file" className="form-control inputText scopeOfWork" ref="scopeOfWork" id="scopeOfWork" name="scopeOfWork" onChange={this.handleScopeOfWorkUpload.bind(this)}/>
                              </span> 
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.getScopeOfWorkPercentage()}
                              </div>
                              <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 editDoc">  
                                <i className="fa fa-close fa-1x crossIcon" data-id={this.state.scopeOfWorkDoc+"-"+this.props.contractObj._id+"-"+"scopeOfWorkDoc"} aria-hidden="true" onClick={this.removeScopeDoc.bind(this)}></i>                                                          
                                <a href={this.state.scopeOfWorkDoc} download>
                                    <i className="fa fa-file-text-o fa-3x" aria-hidden="true" ></i>
                                </a>
                                

                              </div>
                            </div> 
                          :
                          <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                            <span className="blocking-span">
                                <label className="floating-label">Scope Of Work<span className="astrikReq">*</span>&nbsp;( only pdf format accepted )</label>
                                <input type="file" className="form-control inputText scopeOfWork" ref="scopeOfWork" id="scopeOfWork" name="scopeOfWork" accept="application/pdf" onChange={this.handleScopeOfWorkUpload.bind(this)} required/>
                            </span> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              {this.getScopeOfWorkPercentage()}
                            </div>
                          </div>
                        }
                        
                      </div>
                     <div className="row inputrow">
                        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <span className="blocking-span">
                              <label className="floating-label col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">Service Level Agreement</label>                                   
                              <table className="table table-bordered table-striped">
                                <thead> 
                                  <tr > 
                                    <th className="text-center"></th>
                                    <th className="text-center">Name</th>
                                    {/* <th className="text-center">TAT Days</th> */}
                                    <th className="text-center">Cost/Check</th>
                                    <th className="text-center">New TAT Days</th>
                                    <th className="text-center">Count/Check</th>
                                  </tr>
                                </thead>
                                
                                {
                                  this.props.serviceLevelAgreement ?
                                     this.props.serviceLevelAgreement.length > 0 ?
                                    <tbody>
                                      
                                        {
                                          this.props.serviceLevelAgreement.map((agreement,index)=>{
                                            return(
                                              <AgreementTable key={index} indexValue={index} dataDetails={agreement}/>
                                           );
                                         }) 
                                        }
                                     
                                    </tbody>
                                 :
                                  <tbody>
                                      <tr>
                                        No Data Available
                                      </tr>
                                    </tbody>
                                  :
                                      <tbody>
                                      <tr>
                                        <td></td>
                                        <td></td>
                                        <td>No contract available</td>
                                        <td></td>
                                      </tr>
                                    </tbody>
                                }
                              </table>
                         </span> 
                        </div>
                        
                      </div>
                      <div className="row inputrow">
                       {this.state.pricingDoc && this.props.contractObj ?
                          <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                            <span className="blocking-span">
                                <label className="floating-label">Pricing<span className="astrikReq">*</span>&nbsp; ( only pdf format accepted )</label>
                                <input type="file" className="form-control inputText pricing" ref="pricing" id="pricing" name="pricing" onChange={this.handlePricingUpload.bind(this)}/>
                            </span> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              {this.getPricingPercentage()}
                            </div>
                            <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 editDoc">  
                                <i className="fa fa-close fa-1x crossIcon" data-id={this.state.pricingDoc+"-"+this.props.contractObj._id+"-"+"pricingDoc"} aria-hidden="true" onClick={this.removeScopeDoc.bind(this)}></i>                                                          
                                <a href={this.state.pricingDoc} download>
                                    <i className="fa fa-file-text-o fa-3x" aria-hidden="true" ></i>
                                </a>
                            </div>
                          </div>
                        :
                          <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                            <span className="blocking-span">
                                <label className="floating-label">Pricing<span className="astrikReq">*</span>&nbsp; ( only pdf format accepted )</label>
                                <input type="file" className="form-control inputText pricing" ref="pricing" id="pricing" name="pricing" accept="application/pdf" onChange={this.handlePricingUpload.bind(this)} required/>
                            </span> 
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              {this.getPricingPercentage()}
                            </div>
                          </div>
                         }
                        {this.state.authenticationLetterDoc && this.props.contractObj ?
                           <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                              <span className="blocking-span">
                                  <label className="floating-label">Authentication Letter<span className="astrikReq">*</span>&nbsp; ( only pdf format accepted )</label>
                                  <input type="file" className="form-control inputText authenticationLetter" ref="authenticationLetter" id="authenticationLetter" name="authenticationLetter" onChange={this.handleAuthLetterUpload.bind(this)}/>
                              </span> 
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.getAuthLetterPercentage()}
                              </div>
                              <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 editDoc">  
                                <i className="fa fa-close fa-1x crossIcon" data-id={this.state.authenticationLetterDoc+"-"+this.props.contractObj._id+"-"+"authenticationLetterDoc"} aria-hidden="true" onClick={this.removeScopeDoc.bind(this)}></i>                                                          
                                <a href={this.state.authenticationLetterDoc} download>
                                    <i className="fa fa-file-text-o fa-3x" aria-hidden="true" ></i>
                                </a>
                            </div>
                            </div>
                           :
                            <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                              <span className="blocking-span">
                                  <label className="floating-label">Authentication Letter<span className="astrikReq">*</span>&nbsp; ( only pdf format accepted )</label>
                                  <input type="file" className="form-control inputText authenticationLetter" ref="authenticationLetter" id="authenticationLetter" name="authenticationLetter" accept="application/pdf" onChange={this.handleAuthLetterUpload.bind(this)} required/>
                              </span> 
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {this.getAuthLetterPercentage()}
                              </div>
                            </div>
                        }
                       
                        
                      </div>
                     <div className="row inputrow">
                        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <span className="blocking-span">
                              <label className="floating-label">Description</label>
                              <textarea rows="5" className="form-control inputText contractDescription" ref="contractDescription" id="contractDescription" name="contractDescription" value={this.state.contractDescription} onChange={this.handleChange.bind(this)} ></textarea>
                          </span> 
                        </div>
                      </div>
                      <div className="row inputrow">
                        <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                          <span className="blocking-span">
                              <label className="floating-label">Valid From<span className="astrikReq">*</span></label>
                              <input type="date" className="form-control inputText validFrom" ref="validFrom" id="validFrom" name="validFrom" value={this.state.validFrom} onChange={this.handleChange.bind(this)} required/>
                          </span> 
                        </div>
                        <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                          <span className="blocking-span">
                              <label className="floating-label">Valid To<span className="astrikReq">*</span></label>
                              <input type="date" className="form-control inputText validTo" ref="validTo" id="validTo" name="validTo" value={this.state.validTo} onChange={this.handleChange.bind(this)}required/>
                          </span> 
                        </div>
                      </div>
                      <div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <button type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">{this.state.button}</button>
                      </div>
                    </form>
                  </div>
                </div>
             </div>
            </div>
         </div>
       </section>
    </div>
    );
  } 
}
AddNewContractContainer = withTracker(({props,params}) => {
    var companyId       = FlowRouter.getParam('id');
    var contractIndex   = FlowRouter.getParam('corporateid');
    var contractId      = parseInt(FlowRouter.getParam('corporateid'));
    const postHandle    = Meteor.subscribe("services");
    // const packageHandle = Meteor.subscribe("packages");
    const companyProfileHandle = Meteor.subscribe('singleCompanyProfile',companyId);
    const services             = Services.find({$or:[{"serviceFor":"both"},{"serviceFor":"company"}]}).fetch()||[];
    // console.log('services: ', services);
    // const packages      = Packages.find({}).fetch()||[];

    // var companyProfileDetails = CompanyProfile.find({},{sort:{"createdAt":-1},limit:1}).fetch();
    
    // if(companyProfileDetails.length > 0){
      // if(!companyProfileDetails[0].contract){
        // var companyName = companyProfileDetails[0].companyName;
      // }
      
    // }
    // var urlID           = FlowRouter.getParam('id');
    // if (urlID) {
    //   var splitUrl      = urlID.split("-");
    //   var companyId     = splitUrl[0];    
    //   var contractIndex = splitUrl[1];
    //   var contractId    = parseInt(splitUrl[1]);
    // }
    
    /**Madam says comment code for pacakge bcz discuss with client */
    // if (packages) {
    //   for (var j = 0; j < packages.length; j++) {
    //      serviceLevelAgreement.push({"_id": packages[j]._id, "Name": packages[j].packageName,"dayNumbers": packages[j].packageDuration, "type": "package"}); 
    //    }
    // }
    var serviceLevelAgreement = [];    
    if (companyId){
      var companyProfile = CompanyProfile.findOne({"_id" : companyId});
      if (companyProfile) {
        if (contractIndex) {
          var contractObj         = companyProfile.contract[contractId];
          contractObj.companyName = companyProfile.companyName;
          contractObj._id         = companyProfile._id;
          var serviceCount        = 0;
          var serviceObj          = {};
          contractObj.companyId   = companyId;
          if (companyProfile.contract.length>0){
            if (services) {
              services.map((serviceData,index)=>{              
                  var serviceFound = false;      
                    contractObj.serviceLevelAgreement.map((serviceAgreement,agreementIndex)=>{
                      if(serviceAgreement.serviceCount){
                          serviceCount = serviceAgreement.serviceCount;
                      }else{
                          serviceCount = 0;                      
                      }
                      if(serviceAgreement.value){
                        if (serviceAgreement.value ==  true) {
                          var checked = true;
                        }
                      }   
                      // console.log(serviceData._id+" "+serviceAgreement._id);
                      if(serviceData._id == serviceAgreement._id){
                        serviceFound = true;                      
                        serviceObj={ 
                          "_id"            : serviceAgreement._id,
                          "Name"           : serviceAgreement.Name,
                          "dayNumbers"     : serviceAgreement.TAT,
                          "type"           : "service",
                          "serviceRate"    : serviceAgreement.serviceRate,
                          "serviceRequired": serviceAgreement.serviceRequired,
                          "totalOrders"    : serviceAgreement.totalOrders,
                          "completedOrders": serviceAgreement.completedOrders,
                          'serviceCount'   : serviceCount,
                          'checked'        : serviceAgreement.value
                        }
                      }
                        
                    }); //EOF serviceLevelagreement
                    if(serviceFound){ 
                      serviceLevelAgreement.push(serviceObj);                
                    }else{      
                      serviceObj={
                        "_id"        : serviceData._id,
                        "Name"       : serviceData.serviceName,
                        "dayNumbers" : serviceData.serviceDayNumbers,
                        "type"       : "service",
                        "serviceRate": serviceData.serviceRate,
                        "serviceRequired":serviceData.serviceRequired,
                        "totalOrders"    :0,
                        "completedOrders":serviceData.completedOrders,
                        'serviceCount'   :0,
                        'checked'        :false
                      }
                      serviceLevelAgreement.push(serviceObj);                
                      
                    }
                    
              });//EOF service
            }
          }
        }else{
          var companyName = companyProfile.companyName;
          if (services) {
            for (var i = 0; i < services.length; i++) {          
              serviceLevelAgreement.push({"_id": services[i]._id, "Name": services[i].serviceName,"dayNumbers" : services[i].serviceDayNumbers,"type": "service","serviceRate": services[i].serviceRate,"serviceRequired":services[i].serviceRequired,"totalOrders":services[i].totalOrders,"completedOrders":services[i].completedOrders,'serviceCount':0,"checked":false}); 
            }
          }
        }        
      } 
    }else{
      if (services) {
        for (var i = 0; i < services.length; i++) {          
           serviceLevelAgreement.push({"_id": services[i]._id, "Name": services[i].serviceName,"dayNumbers" : services[i].serviceDayNumbers,"type": "service","serviceRate": services[i].serviceRate,"serviceRequired":services[i].serviceRequired,"totalOrders":services[i].totalOrders,"completedOrders":services[i].completedOrders,'serviceCount':0,"checked":false}); 
        }
      }
    }
// console.log("=================serviceLevelAgreement=============: ",serviceLevelAgreement);
    const loading = !postHandle.ready() && !companyProfileHandle.ready();
    if (contractIndex) {
      var button  = "UPDATE";
    }else{
      var button  = "ADD";
    }
    return {
      loading,
      serviceLevelAgreement,
      contractObj,
      button,
      contractId,
      companyName,
      companyId
    };
})(AddNewContract);
export default AddNewContractContainer;