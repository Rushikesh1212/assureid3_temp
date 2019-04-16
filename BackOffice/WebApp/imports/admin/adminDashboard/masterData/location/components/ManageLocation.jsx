import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import ListOfLocations from './ListOfLocations.jsx';
import { Location } from '/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js';

class ManageLocation extends TrackerReact(Component) {
  constructor(props) {
    super(props);  
    this.state = {
      country  : '',
      state    : '',
      city     : '',
      area     : '',
      pinCode  : '',
      button   : 'ADD',
      "subscription"  : {
        "singleLocation" : Meteor.subscribe("singleLocation"),
      }
    }; 
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.location){
         this.setState({
             country  : nextProps.location.country,
             state    : nextProps.location.state,
             city     : nextProps.location.city,
             area     : nextProps.location.area,
             pinCode  : nextProps.location.pinCode,
             id       : nextProps.location._id,
             button   : nextProps.button,
        });
      }
    }else{
      this.setState({
             country  : '',
             state    : '',
             city     : '',
             area     : '',
             pinCode  : '',
             id       : '',
             // button   : '',
      });
    }

    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() { 
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
    $.validator.addMethod("regxCO1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters and spaces.");
    $.validator.addMethod("regxPC", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid pincode.");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#add-Location").validate({
        rules: { 
          country: {
            required: true,
            regxCO1 :  /^[a-zA-Z ]+$|^$/,
          },
          state: {
            required: true,
            regxCO1 :  /^[a-zA-Z ]+$|^$/,
          },
          area: {
            required: true,
            regxCO1 :  /^[a-zA-Z0-9 ]+$|^$/,
          },
          city: {
            required: true,
            regxCO1 :  /^[a-zA-Z ]+$|^$/,
          }, 
          pinCode: {
            required: true,
            regxPC  : /^[1-9][0-9]{5}$|^$/,
          },
        }
    });
  }
  componentWillMount() { 
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
 componentWillUnmount(){  
   $("script[src='/js/adminLte.js']").remove(); 
   // $("link[href='/css/dashboard.css']").remove(); 
 }
 handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }
  handleSubmit(event){
    event.preventDefault();
    if($('#add-Location').valid()){
      var country   = this.refs.country.value.charAt(0).toUpperCase() + this.refs.country.value.slice(1);
      var state     = this.refs.state.value.charAt(0).toUpperCase() + this.refs.state.value.slice(1);
      var city      = this.refs.city.value.charAt(0).toUpperCase() + this.refs.city.value.slice(1);
      var area      = this.refs.area.value.charAt(0).toUpperCase() + this.refs.area.value.slice(1);
      var pinCode   = this.refs.pinCode.value;
      var id        = FlowRouter.getParam('id');
      // console.log("country :",country);
      
        if(id){
          var dataMatch = Location.findOne({"country" : country, "state" : state, "city" : city, "area" :area, "pinCode" : pinCode});
          if (!dataMatch) {
           Meteor.call('updateLocation',id,country,state,city,area,pinCode,(error,result)=>{
              if(error){
                  console.log(error.reason);
              }else{                      
                swal("Done","Location has been Updated!.","success");  
                var path = "/admin/ManageLocation";
                FlowRouter.go(path);
              }            
            });
           }else{
            swal("Duplicate entry occurs!");
           }
        }else{
          var dataMatch = Location.findOne({"country" : country, "state" : state, "city" : city, "area" :area, "pinCode" : pinCode});
          if (!dataMatch) {
            Meteor.call('addLocation',country,state,city,area,pinCode,(error,result)=>{
              if(error){
                  console.log(error.reason);
              }else{                      
                swal("Done","Location has been Inserted!.","success");  
                $(".country").val("");
                $(".state").val("");
                $(".city").val("");
                $(".area").val("");
                $(".pinCode").val("");
              }            
            });
          }else{
            swal("Duplicate entry occurs!");
          }
          
        }
      
    }
  }
  render() {
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Master Data </h1> 
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-newspaper-o" />Master Data</a></li>
          <li className="active">Manage Location</li>
        </ol>
      </section>
      <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">Manage Location</h2>  
                </div>
                <div className="box-body">                      
                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12"> 
                    <form id="add-Location">
                       <div className="row inputrow">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Country <span className="astrikReq">*</span></label>
                               <input type="text" ref="country" id="country" name="country" value={this.state.country} className="templateName country col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" onChange={this.handleChange} />
                            </div>
                           </div>
                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                              <div className="form-group">
                               <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">State <span className="astrikReq">*</span></label>
                                 <input type="text" ref="state" id="state" name="state" value={this.state.state} className="templateName state col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" onChange={this.handleChange} />
                              </div>
                           </div>
                        </div>
                        <div className="row inputrow">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">City <span className="astrikReq">*</span></label>
                               <input type="text" ref="city" id="city" name="city" value={this.state.city} className="templateName city col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" onChange={this.handleChange} />
                            </div>
                           </div>
                           <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                              <div className="form-group">
                               <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Area <span className="astrikReq">*</span></label>
                                 <input type="text" ref="area" id="area" name="area" value={this.state.area} className="templateName area col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" onChange={this.handleChange} />
                              </div>
                           </div>
                        </div>
                        <div className="row inputrow">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Pin Code <span className="astrikReq">*</span></label>
                               <input type="text" ref="pinCode" id="pinCode" name="pinCode" value={this.state.pinCode} className="templateName pinCode col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" onChange={this.handleChange} />
                            </div>
                           </div>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" onClick={this.handleSubmit.bind(this)} type="submit" value="" >{this.state.button}</button>
                        </div> 
                    </form>
                  </div>
                  <ListOfLocations />
                </div>
             </div>
            </div>
         </div>
       </section>
    </div>
    );
  } 
}

EditMangaeLocationContainer = withTracker(({params}) => {
    var _id          = FlowRouter.getParam('id');
    const postHandle = Meteor.subscribe('singleLocation',_id);
    const location  = Location.findOne({"_id":_id})|| {};
    const loading   = !postHandle.ready();
    
    if(_id){
      var button = "UPDATE";
      return {
          loading,
          location,
          button,
      };
    }else{
       var button = "ADD";
      return {
          loading,
          location,
          button
      };
    }
})(ManageLocation);

export default EditMangaeLocationContainer;
