import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import { QualificationLevel } from '/imports/admin/adminDashboard/masterData/qualification/api/QualificationLevel.js';
import  ListOfQualificationLevel  from './ListOfQualificationLevel.jsx';

class AddQualificationLevel extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      QualificationLevelTitle : '',
      button   : 'ADD',
      "subscription"  : {
      }  
    }; 
     this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.qualificationLevel){
         this.setState({
             QualificationLevelTitle  : nextProps.qualificationLevel.QualificationLevelTitle,
             id                  : nextProps.qualificationLevel._id,
             button              : nextProps.button,
         });
      }
    }else{
      this.setState({
             QualificationLevelTitle  : '',
             id                  : '',
             button              : '',
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

    $("#qualificationVaild").validate({
        rules: {
          QualificationLevelTitle: {
            required: true,
            regxMessageBox:/^[a-zA-Z_ ]+$|^$/, 
          },
        },
        errorPlacement: function(error, element) {   
         if (element.attr("name") == "QualificationLevelTitle"){      
           error.insertAfter("#QualificationLevelTitle");  
         }
         
       }
    });
  }
 componentWillMount() {
 
 }
 componentWillUnmount(){  
   $("script[src='/js/adminLte.js']").remove(); 
 }
 uppercase(str){
    var array1 = str.split(' ');
    var newarray1 = [];
      
    for(var x = 0; x < array1.length; x++){
        newarray1.push(array1[x].charAt(0).toUpperCase()+array1[x].slice(1));
    } 
   return newarray1.join(' ');
  }
  handleSubmit(e){
    e.preventDefault();
    if($("#qualificationVaild").valid()){ 
      var QualificationLevelTitle  = this.uppercase(this.refs.QualificationLevelTitle.value);
      var id = FlowRouter.getParam('id');
      if(id){
        Meteor.call('updateQualificationLevel',id,QualificationLevelTitle,(error,result)=>{
          if(error){ 
              console.log(error.reason);
          }else{                      
            swal("Done","Your Qualification Title has been Updated!.","success");  
            var path = "/admin/Qualification";
            FlowRouter.go(path);
            $(".QualificationLevelTitle").val("");
          }            
        });
      }else{
        Meteor.call('createQualificationLevel',QualificationLevelTitle,(error,result)=>{
          if(error){
              console.log(error.reason);
          }else{                      
            swal("Done","Your Qualification Title has been Created!.","success");  
            $(".QualificationLevelTitle").val("");
          }            
        });  
      }
    }
        
  }
   handleChange(event){
     const target = event.target;
     const name   = target.name; 
     this.setState({
      [name]: event.target.value, 
     });
   }
  
    render() { 
       return (
        <div className="content-wrapper">
           <section className="content-header">
            <h1> Master Data </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-newspaper-o" />Master Data</a></li>
              <li className="active">Manage Qualification</li>
            </ol>
          </section>
           <section className="content">
             <div className="row">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <div className="box box-primary">
                    <div className="box-header with-border">
                     <h2 className="box-title">Manage Qualification</h2>  
                    </div>
                    <div className="box-body ">
                      <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                        <form id="qualificationVaild">
                          <div className="notifWrapper col-lg-12 col-md-8 col-sm-12 col-xs-12">
                            <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                              <span className="blocking-span">
                                  <label className="floating-label">Title <span className="astrikReq">*</span></label>
                                  <input type="text" className="form-control inputText QualificationLevelTitle" ref="QualificationLevelTitle" id="QualificationLevelTitle" value={this.state.QualificationLevelTitle} name="QualificationLevelTitle" onChange={this.handleChange} required />
                              </span>
                            </div>
                            <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                              <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="" onClick={this.handleSubmit.bind(this)}>{this.state.button}</button>
                            </div> 
                          </div> 
                        </form>
                      </div>  
                      <ListOfQualificationLevel />
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
    const postHandle = Meteor.subscribe('singlequalificationLevel',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const qualificationLevel  = QualificationLevel.findOne({"_id":_id})|| {};
    const loading    = !postHandle.ready();
    
    if(_id){
      var button = "UPDATE";
      return {
          loading,
          qualificationLevel,
          button,
      };
    }else{ 
       var button = "ADD"; 
      return {
          loading,
          qualificationLevel,
          button
      };
    }
})(AddQualificationLevel);

export default EditPageContainer;
