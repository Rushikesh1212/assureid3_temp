import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import { TempLogoImage } from '../api/TempLogoImage.js';
import { CompanySettings } from '../api/CompanySettingMaster.js';


class companyInformation extends TrackerReact(Component){

  componentDidMount(){
    $('.companyInformation').addClass('divActive');
    $("#companyInformationForm").validate({
        rules: {
          companyName: {
            required: true,
          },
          companyAddress : {
            required: true,
          },
          companyContactNumber : {
            required: true,
          },
          companyEmail: {
            required: true,
          },
          companyPincode : {
            required: true,
          },
          companyCity : {
            required: true,
          },
          companyState : {
            required: true,
          },
          companyCountry : {
            required: true,
          },
        },
        messages: {
          companyName: {
            required: "Please enter company name",
          },
         companyAddress: {
            required: "Please enter company address",
          },
         companyContactNumber: {
            required: "Please enter company mobile number",
          },
          companyEmail: {
            required: "Please enter comapny email",
          },
         companyPincode: {
            required: "Please enter comapny pincode",
          },
          companyCity: {
            required: "Please enter company city",
          },
          companyState: {
            required: "Please enter company state",
          },
          companyCountry: {
            required: "Please enter company country",
          },
        },
         errorPlacement: function(error, element) {
          error.appendTo(element.parent().parent(".form-group"));
        }
    });
  }

  imgBrowse(event){
    event.preventDefault();

    // /*--------------Code form Logo Image-----------*/

    // var file = event.target.files[0];  //assuming you have only one file
    // var render = new FileReader(); //this works only in html5
    //   render.onload =function(event){
    //      var fileData = render.result;
    //      var fileName = file.name;
    //      Meteor.call('tempLogoImageUpload', fileName, fileData,function(err,result){
    //       if(err){
    //         console.log(err);
    //       }else{
    //         console.log('Image Uploaded!');
    //       }
    //      });
    //   };
    //   render.readAsDataURL(file);
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      Session.set("uploadLogoProgressPercent",0);

      var file      = event.currentTarget.files[0];
      var fileName  = file.name;
      var fileSize  = file.size;
      var size      = 1073741824;
      var ext       = fileName.split('.').pop();
      var userId    = Meteor.userId();
      if(file){
        if(ext=="jpg" || ext=="png" || ext=="jpeg"){
          if (fileSize < size) {
            addLogoToS3Function(userId,file,self);
          }else{
            swal("File not uploaded!","Document size limit is upto 1gb.","error");
          }
        }else{
          swal("Please upload file","in images format","error");
        }
      }
    }
  }

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    console.log("name",name);
    this.setState({
      [name]: event.target.value,
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      companyName          : this.props.companyName,
      companyContactNumber : this.props.companyContactNumber,
      companyMobileNumber  : this.props.companyMobileNumber,
      companyEmail         : this.props.companyEmail,
      companyAltEmail      : this.props.companyAltEmail,
      companyAddress       : this.props.companyAddress,
      companyPincode       : this.props.companyPincode,
      companyCity          : this.props.companyCity,
      companyState         : this.props.companyState,
      companyCountry       : this.props.companyCountry,
      companyUniqueID      : this.props.companyUniqueID,
      logoFilename         : '',
      companyLogo          : '',
      subscription : {
        "tempLogoImage" : Meteor.subscribe('tempLogoImage'),
        "companyData" : Meteor.subscribe('companyData'),
      }

    };

      this.handleChange = this.handleChange.bind(this);
  }

    componentWillReceiveProps(nextProps) {
      if(!nextProps.loading){
      if(nextProps.post.companyLocationsInfo){
            this.setState({
                "_id"                 : nextProps.post._id,
                companyName           : nextProps.post.companyName,
                companyContactNumber  : nextProps.post.companyContactNumber,
                companyMobileNumber   : nextProps.post.companyMobileNumber,
                companyEmail          : nextProps.post.companyEmail,
                companyAltEmail       : nextProps.post.companyAltEmail,
                companyUniqueID       : nextProps.post.companyUniqueID,
                logoFilename          : nextProps.post.logoFilename,
                companyLogo           : nextProps.post.companyLogo,
                companyAddress        : nextProps.post.companyLocationsInfo[0].companyAddress,
                companyPincode        : nextProps.post.companyLocationsInfo[0].companyPincode,
                companyCity           : nextProps.post.companyLocationsInfo[0].companyCity,
                companyState          : nextProps.post.companyLocationsInfo[0].companyState,
                companyCountry        : nextProps.post.companyLocationsInfo[0].companyCountry,
            })
         }
      }
      this.handleChange = this.handleChange.bind(this);
            // this.handleSubmit = this.handleSubmit.bind(this);
    }

  submitCompanyInformation(event){
    event.preventDefault();
    if($('#companyInformationForm').valid()){

      // console.log("logoFilename",this.state._id);
      var image = TempLogoImage.findOne({"userId" : Meteor.userId()},{sort:{"createdAt" : -1}});
      if (image) {
        var logoFilename = image.logoFilename;
        var companyLogo  = image.tempLogoImg;
      }else{
        var logoFilename = this.state.logoFilename;
        var companyLogo  = this.state.companyLogo;
      }
    
      var companyInfoFormValue ={
          companyName          : $(".companyName").val(),
          companyContactNumber : $(".contactNo").val(),
          companyMobileNumber  : $(".altContactNo").val(),
          companyEmail         : $(".companyEmail").val(),
          companyAltEmail      : $(".altCompanyEmail").val(),
          logoFilename         : logoFilename,
          companyLogo          : companyLogo,
          companyAddress       : $(".companyAddress").val(),
          companyPincode       : $(".companyPincode").val(),
          companyCity          : $(".companyCity").val(),
          companyState         : $(".companyState").val(),
          companyCountry       : $(".companyCountry").val(),
          companyUniqueID      : $(".uniqueId").val(),

       }//close array
      Meteor.call('insertCompanyInfo',companyInfoFormValue,
              function(error, result){
                if(error){
                  console.log(error);
                }else{
                  //As logo is added to main companySettings table, we can now remove
                  //the same logo from temporary collection.
                  // Meteor.call('tempLogoImageDelete', fileName);
                  console.log('Added!');
                }
              }
      );
    }
  }

  getButton(){
    var companyData = CompanySettings.findOne({});
    if(companyData){
     return ( <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right compInformation">Update</button>);
    }else{
      return (<button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right compInformation">Submit</button>);
    }
  }
   getUploadImagePercentage(){
    var uploadProgressPercent = Session.get("uploadLogoProgressPercent");
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
                Session.set("uploadLogoProgressPercent",0); 
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
      <section className="NotificationContent">
        <div className="row">
          <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 ">
            <div className="box box-default">
            <div className="box-header with-border">
            <h3 className="box-title">COMPANY INFORMATION</h3>
            </div>

            <div className="box-body">
            <form id="companyInformationForm" onSubmit={this.submitCompanyInformation.bind(this)} className="companyInformationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-briefcase" aria-hidden="true"></i></span>
                   <input value={this.state.companyName} onChange={this.handleChange}  type="text" placeholder="Company Name" name="companyName" className="form-control companyName inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed" />
                  </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                    <span className="input-group-addon ipAddons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                    <input value={this.state.companyAddress} onChange={this.handleChange}  type="text" placeholder="Company Address" name="companyAddress" className="form-control companyAddress inputValid" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-phone" aria-hidden="true"></i></span>
                     <input value={this.state.companyContactNumber} onChange={this.handleChange}  type="text" placeholder="Contact Number" name="companyContactNumber" className="form-control contactNo inputValid" required pattern="^\+?\d+$" minLength="10" title="Please enter a valid mobile number" />
                  </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-phone" aria-hidden="true"></i></span>
                   <input value={this.state.companyMobileNumber} onChange={this.handleChange}  type="text" placeholder="Alternate Contact Number" name="companyMobileNumber" className="form-control altContactNo inputValid" pattern="^\+?\d+$|^$" minLength="8" title="Please enter a valid mobile number" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                     <input value={this.state.companyEmail} onChange={this.handleChange}  type="text" placeholder="Contact Email" name="companyEmail" className="form-control companyEmail inputValid" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Please enter a valid email" />
                  </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                  <div className="input-group">
                   <span className="input-group-addon ipAddons"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                   <input value={this.state.companyAltEmail} onChange={this.handleChange}  type="text" placeholder="Alternate Company Email" name="companyAltEmail" className="form-control altCompanyEmail inputValid" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$|^$" title="Please enter a valid email" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                  <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-address-card-o" aria-hidden="true"></i></span>
                     <input value={this.state.companyPincode} onChange={this.handleChange}  type="text" placeholder="Pincode" name="companyPincode" className="form-control companyPincode inputValid" required pattern="[1-9][0-9]{5}" title="Please enter a valid pincode" />
                  </div>
                </div>
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyCity} onChange={this.handleChange}  type="text" placeholder="City" name="companyCity" className="form-control companyCity inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed" />
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                 <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyState} onChange={this.handleChange}  type="text" placeholder="State" name="companyState" className="form-control companyState inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed" />
                   </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-globe" aria-hidden="true"></i></span>
                     <input value={this.state.companyCountry} onChange={this.handleChange}  type="text" placeholder="Country" name="companyCountry" className="form-control companyCountry inputValid" required pattern="[a-zA-Z ]*" title="Only alphabetic characters are allowed" />
                    </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                <div className="form-group col-lg-6 col-md-4 col-sm-6 col-xs-6">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-id-badge" aria-hidden="true"></i></span>
                     <input value={this.state.companyUniqueID} onChange={this.handleChange}  type="text" placeholder="Company Unique ID" name="companyUniqueID" className="form-control uniqueId inputValid" />
                    </div>
                </div>
                <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12 ">
                   <div className="input-group">
                     <span className="input-group-addon ipAddons"><i className="fa fa-upload" aria-hidden="true"></i></span>
                     <input onChange={this.imgBrowse.bind(this)} type="file" className="form-control companyInfoInput inputValid" name="" required=""/>
                    </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="pull-left col-lg-6 col-md-6 col-sm-12 col-xs-12"><a href=""><img src={this.props.post.companyLogo} className="commonLogo displayLogo img-responsive img-rounded"/></a></div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                {this.getUploadImagePercentage()}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {this.getButton()}
              </div>
            </form>
            </div>
            </div>
          </div>
          {/*<div className="emptyDiv"></div>*/}
        </div>

      </section>
     );
  }

 }

 EditCompanyInformation = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = CompanySettings.findOne({})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
})(companyInformation);

export default EditCompanyInformation;
