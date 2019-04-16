import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import ListOfColleges from './ListOfColleges.jsx';
import { College } from '/imports/admin/adminDashboard/masterData/college/api/College.js'; 

class AddEditCollege extends TrackerReact(Component) {
  constructor(props) {
    super(props);  
    this.state = {
      collegeName    : '',
      universityName : '',
      collegeStatus  : '',
      button : 'ADD',
      "subscription"  : {
      }  
    }; 
     this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.college){
         this.setState({
             collegeName         : nextProps.college.collegeName,
             universityName      : nextProps.college.universityName,
             collegeStatus       : nextProps.college.collegeStatus,
             id                  : nextProps.college._id,
             button              : nextProps.button,
         });
      }
    }else{
      this.setState({
             collegeName     : '',
             universityName  : '',
             collegeStatus   : '',
             id              : '',
             button          : '',
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
    $.validator.addMethod("regxMessageBox", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    }); 

     $("#collegeVaild").validate({ 
        rules: {
          collegeName: {
            required: true,
            regxMessageBox: /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
          },
          universityName: {
            required: true,
            regxMessageBox: /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
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
  uppercase(str)
  {
    var array1 = str.split(' ');
    var newarray1 = []; 
      
    for(var x = 0; x < array1.length; x++){
        newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
    }
    return newarray1.join(' ');
  } 
  handleSubmit(event){
    event.preventDefault();
    if($("#collegeVaild").valid()){ 
      var collegeName       = this.uppercase(this.refs.collegeName.value);
      var universityName    = this.uppercase(this.refs.universityName.value);
      var collegeStatus     = this.refs.collegeStatus.value;
      var id = FlowRouter.getParam('id');
      if(id){
        Meteor.call('updateCollegeData',id,collegeName,universityName,collegeStatus,(error,result)=>{
          if(error){
              console.log(error.reason);
          }else{                      
            swal("Done","College Data has been Updated!.","success"); 
            var path = "/admin/College";
            FlowRouter.go(path);
            $(".collegeName").val("");
            $(".universityName").val("");
            $(".collegeStatus").val(""); 
          }            
        });
      }else{
        var dataMatch = College.findOne({"collegeName" : collegeName, "universityName" : universityName});
        if (!dataMatch) {
          Meteor.call('createCollegeData',collegeName,universityName,collegeStatus,(error,result)=>{
            if(error){
                console.log(error.reason);
            }else{                      
              swal("Done","College Data has been Created!.","success");  
              $(".collegeName").val("");
              $(".universityName").val("");
              $(".collegeStatus").val("");
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
          <li className="active">Manage College</li>
        </ol>
      </section>
      <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">Manage College</h2>  
                </div>
                <div className="box-body">                       
                  <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                    <form id="collegeVaild">
                       <div className="row inputrow">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">College Name <span className="astrikReq">*</span></label>
                               <input type="text" ref="collegeName" id="collegeName" name="collegeName" value={this.state.collegeName} onChange={this.handleChange} className="templateName collegeName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                            </div>
                           </div>      
                       </div>
                       <div className="row inputrow">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">University Name <span className="astrikReq">*</span></label>
                               <input type="text" ref="universityName" id="universityName" name="universityName" value={this.state.universityName} onChange={this.handleChange} className="templateName universityName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                            </div>
                           </div>
                       </div>
                       <div className="row inputrow">
                         <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="form-group">
                             <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Status <span className="astrikReq">*</span></label>
                              <select className="form-control inputText collegeStatus" ref="collegeStatus" value={this.state.collegeStatus} onChange={this.handleChange} id="collegeStatus" name="collegeStatus" required>
                                <option selected disabled value>-- Select Status --</option>
                                <option value="Functioning">Functioning</option>
                                <option value="Fake">Fake</option>
                                <option value="Disfunctioning">Disfunctioning</option>
                              </select>                          
                            </div>
                          </div> 
                       </div>
                        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" onClick={this.handleSubmit.bind(this)} type="submit" value="" >{this.state.button}</button>
                        </div> 
                    </form>
                  </div>
                  <ListOfColleges />
                </div>
             </div>
            </div>
         </div>
         </section>
      </div>
      );
    } 
}
EditPageContainer = withTracker(({params}) => {
    var _id          = FlowRouter.getParam('id');
    const postHandle = Meteor.subscribe('singlecollege',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const college    = College.findOne({"_id":_id})|| {};
    const loading    = !postHandle.ready();
    
    if(_id){
      var button = "UPDATE";
      return {
          loading,
          college,
          button,
      };
    }else{
       var button = "ADD";
      return {
          loading,
          college,
          button,
      };
    }
})(AddEditCollege);
export default EditPageContainer;