import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {TempPackageImages} from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import {Packages} from '/imports/admin/adminDashboard/packageManagement/api/Package.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { withTracker } from 'meteor/react-meteor-data';

class EditPackages extends TrackerReact(Component){
  constructor(props) {
    super(props); 
    this.state = {
      packageName         : '',
      packageDuration     : '',
      packageDurationValues : [],   
      packageDiscount     : '',
      packageDescription  : '',
      image               : '',      
      "subscription"  : {
      }  
    }; 
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.singlepackage){
        // console.log("nextProps.services",nextProps.services);
        var packageDurationValue = [];
        for (var i = 0; i < nextProps.singlepackage.selectedServices.length; i++) {
          packageDurationValue.push(parseInt(nextProps.singlepackage.selectedServices[i].serviceDuration));
        }
         this.setState({
             packageName         : nextProps.singlepackage.packageName,
             packageDuration     : nextProps.singlepackage.packageDuration,
             packageDescription  : nextProps.singlepackage.packageDescription,
             image               : nextProps.singlepackage.image,
             id                  : nextProps.singlepackage._id,
             packageDiscount     : nextProps.singlepackage.packageDiscount,
             selectedServices    : nextProps.singlepackage.selectedServices,
             packageDurationValues : packageDurationValue,
         });
      }
    }else{
      this.setState({
            packageName         : '',
             packageDuration     : '',
             packageDescription  : '',
             image               : '',
             packageDiscount     : '',
             selectedServices    : '',
             packageDurationValues : [],
      });
    }
    // console.log("nextProps.services",nextProps.services);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
   const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name);
    // console.log("value",value);
    this.setState({
      [name]: value
    });
    
  }
  handleChangeForServices(event){
    const target = event.target;
    // console.log("target",target);
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    // console.log("value",value);
    const name   = target.name;
    var index    = $(event.currentTarget).attr('id');
    this.state.selectedServices[index].value = value;
    var dataNumber    = parseInt($(event.currentTarget).attr('data-number'));
    var packageDurationValues = this.state.packageDurationValues;
    if(target.checked){
      packageDurationValues.push(dataNumber);
    }else{
      var index = packageDurationValues.indexOf(dataNumber);
      packageDurationValues.splice(index,1);
    }
    var packageDuration = packageDurationValues.length > 0 ? Math.max.apply(null,packageDurationValues) : 0;
    this.setState({packageDuration:packageDuration});
    this.setState({packageDurationValues:packageDurationValues});
    this.setState({
     [name]: event.target.value,
    });
  }
  componentDidMount() {
   $("html,body").scrollTop(0);
    $(".serviceName").focus();
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
     $("#packageForm").validate({
        rules: {
          packageName: {
            required: true, 
          },
          packageDuration: {
            required: true,
          },  
          packageDescription: {
            required: true,
          },  
          // serviceRate: {
          //   required: true,
          // },  
        },
        messages: {
          packageName: {
            required: "Please enter Package Name!",
          },
          packageDuration: {
            required: "Please enter Package Duration In Days!",
          },
          packageDescription: {
            required: "Please enter Package Description!",
          },
        }
    });
  }
  componentWillMount() {
    
  }
  componentWillUnmount() {
      $("script[src='/js/adminLte.js']").remove(); 

  }
  handleUpload(event){
    event.preventDefault();
    let self = this;
     // this.setState({isUploading: true});
    if (event.currentTarget.files && event.currentTarget.files[0]) { 
      var dataImg =event.currentTarget.files[0];  
       if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){      
         var reader = new FileReader();        reader.onload = function (e) {          
           $('.uploadedImageFromLocl').attr('src', e.target.result);      
         };       
         reader.readAsDataURL(event.currentTarget.files[0]);      
         var file = event.currentTarget.files[0];      
          if (file) {         
            addPackageImageS3Function(file,self);       
          }   
       } else { 
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
 
  updatePackage(e){
      e.preventDefault();
       if($("#packageForm").valid()){ 
        var selectedServices   = [];
        var packageName        = this.refs.packageName.value;
        var packageDuration    = this.refs.packageDuration.value;
        var packageDiscount    = this.refs.packageDiscount.value;
        var packageDescription = this.refs.packageDescription.value;
        var id                 = FlowRouter.getParam('id');
        selectedServices      = this.state.selectedServices;
        // if (this.state.selectedServices) {
        //   for(var i = 0 ; i < this.state.selectedServices.length; i++){
        //     var value       = $("input:checkbox[id="+[i]+"]:checked").val();
        //     var serviceName = $("input:checkbox[id="+[i]+"]:checked").attr('data-name');
        //     var serviceId   = $("input:checkbox[id="+[i]+"]:checked").attr('data-id');
        //     var index       = parseInt($("input:checkbox[id="+[i]+"]:checked").attr('id'));
        //     var serviceDuration = $("input:checkbox[id="+[i]+"]:checked").attr('data-number');            
        //     if (serviceName) {
        //       selectedServices.push({"serviceId" : serviceId, "serviceName" : serviceName,"serviceDuration":serviceDuration, "index": index, "value":true});
        //     }else{
        //       var uncheckedserviceName = $("input:checkbox[id="+[i]+"]:not(:checked)").val();
        //       var uncheckedserviceId   = $("input:checkbox[id="+[i]+"]:not(:checked)").attr('data-id');
        //       var uncheckedindex       = parseInt($("input:checkbox[id="+[i]+"]:not(:checked)").attr('id'));
        //       var uncheckedserviceDuration = $("input:checkbox[id="+[i]+"]:not(:checked)").attr('data-number');            
        //       selectedServices.push({"serviceId" : uncheckedserviceId, "serviceName" : uncheckedserviceName,"serviceDuration":uncheckedserviceDuration,"index": uncheckedindex, "value":false});
        //     }

        //   }
        // }
        console.log("selectedServices",selectedServices);
        if (id) {
            Meteor.call('updatePackage',id,packageName,packageDuration,packageDiscount,packageDescription,selectedServices,(error,result)=>{
              if(error){
                  
              }else{                     
                 // swal("Done","Your page has been Created!.","success");
                   var path = "/admin/ListOfPackages";
                  FlowRouter.go(path);
                  $('.uploadedImageFromLocl').attr('src', "");
                  $('.packageName').val("");
                  $(".packageDuration").val("");  
                  $(".packageDiscount").val("");  
                  $(".packageDescription").val("");  

              }
          });
        }      
      } 
  }
  getUploadImagePercentage(){
    var uploadProgressPercent = Session.get("uploadPackageProgressbar");
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
                Session.set("uploadPackageProgressbar",0); 
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
 
  render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1> Package Management </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-briefcase" />Package Management</a></li>
              <li className="active">Edit Package</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Edit Package
                    </h3>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="notifWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <form className="newTemplateForm" id="packageForm">
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Package Name:</label>
                                     <input type="text" ref="packageName" id="packageName" name="packageName" value={this.state.packageName} onChange={this.handleChange} className="templateName packageName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-6 uploadedImageFromLocl1">
                                     <div className="form-group subjectDiv">
                                       <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload:</label>
                                        <input type="file" ref="serviceImageFile" id="s3file" name="serviceImageFile"  onChange={this.handleUpload.bind(this)}  className="subject uploadServiceImage col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid"/>     
                                      </div> 
                                  </div>
                                  
                                  <div className="col-lg-6 uploadedImageFromLocl2">    
                                      <div className="uploadedImageFromLocl3">       
                                          <img src={this.state.image} alt="" className="img-responsive uploadedImageFromLocl"/>   
                                      </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                    {this.getUploadImagePercentage()}
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 uploadedImageFromLocl1">
                                     <div className="form-group subjectDiv">
                                       <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Select Services:</label>
                                      </div> 
                                  </div>
                                  {this.state.selectedServices ? 
                                     this.state.selectedServices.length > 0 ? 
                                     this.state.selectedServices.map((allServices,index)=>{
                                       return(
                                          <div className="col-lg-6" key={index}>
                                            <div className="form-group">
                                              <input type="checkbox" name="service" onChange={this.handleChangeForServices.bind(this)} data-id={allServices.serviceId} data-name={allServices.serviceName} data-number={allServices.serviceDuration}  ref="service" value={allServices.value} checked={allServices.value} id={index}/> {allServices.serviceName} ({allServices.serviceDuration} Days)
                                            </div> 
                                          </div>
                                        );
                                     })
                                     : 
                                      <span>No service added!</span>
                                    :
                                    <span>No service added!</span>
                                  }
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Duration:</label>
                                     <input type="number" ref="packageDuration" id="packageDuration" name="packageDuration" value={this.state.packageDuration} onChange={this.handleChange} className="templateName packageDuration col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Discount:</label>
                                     <input type="number" ref="packageDiscount" id="packageDiscount" name="packageDiscount" value={this.state.packageDiscount} onChange={this.handleChange} className="templateName packageDiscount col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                      <label className="label-category">Description:</label>
                                      {/*<div id="servicesDescription" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" name="servicesDescription" ref="servicesDescription" value={this.state.servicesDescription} onChange={this.handleChange} ></div>*/}
                                      <textarea name="packageDescription" ref="packageDescription" id="packageDescription" value={this.state.packageDescription}  onChange={this.handleChange} className="form-control packageDescription col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="5"></textarea>                           
                                   </div>
                                </div>
                              </div>
                            
                              
                              <div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <button type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn" onClick={this.updatePackage.bind(this)}>Update</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
}
}
export default EditPackagePageContainer = withTracker(({params}) => {
    var _id = FlowRouter.getParam('id');
    const postHandle  = Meteor.subscribe('singlePackages',_id);
    const serviceHandle = Meteor.subscribe("userandbothservice");
    
    const singlepackage = Packages.findOne({"_id":_id})|| {};
    const services      = Services.find({$or: [{"serviceFor" :'user'},{"serviceFor" :'both'},]}).fetch();
    console.log("services",services);
    if (singlepackage) {
      var packgaeServices = [];
      var serviceObj      = {};
      if(services){
        if (singlepackage.selectedServices) {
          if (singlepackage.selectedServices.length > 0) {
             services.map((serviceData,ind)=>{
                var serviceFound = false;
                singlepackage.selectedServices.map((singleService,index)=>{
                  if(serviceData._id == singleService.serviceId){
                    serviceFound   = true;  
                    if (singleService.serviceRequired == "StatutoryForm") {
                      var selectedCard   = singleService.selectedCard;
                    }                    
                      serviceObj = {
                          "serviceId"       : singleService.serviceId,
                          "serviceName"     : singleService.serviceName,
                          "serviceDuration" : singleService.serviceDuration,
                          "index"           : singleService.index,
                          "value"           : singleService.value,
                          "serviceRequired" : singleService.serviceRequired,
                          "selectedCard"    : selectedCard,
                      }
                  }
                });
                if (serviceFound) {
                  packgaeServices.push(serviceObj);
                }else{
                  if (serviceData.serviceRequired == "StatutoryForm") {
                    var selectedCards   = serviceData.selectedCard;
                  }
                   serviceObj = {
                      "serviceId"       : serviceData._id, 
                      "serviceName"     : serviceData.serviceName,
                      "serviceDuration" : serviceData.serviceDayNumbers,
                      "index"           : ind,
                      "value"           : false,
                      "serviceRequired" : serviceData.serviceRequired,
                      "selectedCard"    : selectedCards,
                  }
                  packgaeServices.push(serviceObj);
                }
            });
          }
        }
       // console.log("packgaeServices",packgaeServices);
      }
      singlepackage.selectedServices  = packgaeServices;
    }
    
    const loading = !postHandle.ready() && !serviceHandle.ready();

     
    if(_id){
      return {
          loading,
          singlepackage,
      };
    }
})(EditPackages);