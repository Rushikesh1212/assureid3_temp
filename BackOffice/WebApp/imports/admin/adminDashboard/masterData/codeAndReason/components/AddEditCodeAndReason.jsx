import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import ListOfCodeAndReason from './ListOfCodeAndReason.jsx';
import { CodeAndReason } from '/imports/admin/adminDashboard/masterData/codeAndReason/api/CodeAndReason.js';

class AddEditCodeAndReason extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
      code : '',
      reason : '',
      button : 'ADD',
      "subscription"  : {
      }  
    }; 
     this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    $('#fieldSelect').multipleSelect();
     $.validator.addMethod("regCx1", function(value, element, regexpr) {          
       return regexpr.test(value);
     }, "Please enter only numbers");
     $.validator.addMethod("regxMessageBox", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain alphanumeric and some special character.");
     $("#codereasonValid").validate({
       rules: {
        code: {
           required: true,
           regCx1: /^[0-9]+$|^$/, 
         },               
        reason:{
           required: true,          
           regxMessageBox : /^[a-zA-Z0-9 .,@$#%&*_-|:;""''?=/]+$|^$/,
         },
       },
 
       errorPlacement: function(error, element) {   
          if (element.attr("name") == "code"){      
            error.insertAfter("#code");  
          }

          if (element.attr("name") == "reason"){      
            error.insertAfter("#reason");  
          }
         
       }
 
     });  
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.codeAndReason){
         this.setState({
             code             : nextProps.codeAndReason.code,
             reason           : nextProps.codeAndReason.reason,
             id               : nextProps.codeAndReason._id,
             button           : nextProps.button,
         });
      }
    }else{
      this.setState({
             code            : '',
             reason          : '',
             id              : '',
             button          : '',
      });
    }

    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }
  handleSubmit(e){
    e.preventDefault();
   if($("#codereasonValid").valid()){ 
      var code            = this.refs.code.value;
      var reason          = this.refs.reason.value;
      var id              = FlowRouter.getParam('id');
      var alreadyExists   = CodeAndReason.findOne({"code" : code});
        if(id){ 
          Meteor.call('updateField',id,code,reason,(error,result)=>{
            if(error){
                console.log(error.reason);
            }else{                      
              swal("Done","Your Field has been Updated!.","success");  
              var path = "/admin/CodeAndReason";
              FlowRouter.go(path);
              $("#code").val("");
              $("#reason").val("");
            }            
          });
        }else{
          if (alreadyExists) {
              swal("Oops...!","This code is already taken!","error");
          }else{
              Meteor.call('createField',code,reason,(error,result)=>{
                if(error){
                    console.log(error.reason);
                }else{                      
                  swal("Done","Your data has been Created!.","success"); 
                  // $(".UniversityName").val("");
                  $("#code").val("");
                  $("#reason").val("");
                }            
              });  
            }
        }
      // }
    }
  }
 
	render() {
     return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1> Master Data </h1>
          <ol className="breadcrumb">
            <li>
              <a href="#"><i className="fa fa-file-code-o" /> Master Data</a></li>
            <li className="active">Add Code And Reason</li>
          </ol>
        </section>
         <section className="content">
           <div className="row">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <div className="box box-primary">
                  <div className="box-header with-border">
                   <h2 className="box-title">Code And Reason</h2>   
                  </div>
                  <div className="box-body">
                    <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                      <form id="codereasonValid">
                      <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="codeError">
                        <span className="blocking-span">
                            <label className="floating-label">Code <span className="astrikReq">*</span>
                            </label>
                            <input type="text" className="form-control inputText code" ref="code" id="code" name="code" value={this.state.code} onChange={this.handleChange} required/>
                        </span> 
                      </div>
                      <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="reasonError">
                        <span className="blocking-span">
                            <label className="floating-label">Reason <span className="astrikReq">*</span></label>
                            <textarea rows="6" className="form-control inputText code" ref="reason" id="reason" name="reason" value={this.state.reason} onChange={this.handleChange} required></textarea>
                        </span> 
                      </div>
                       <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="" onClick={this.handleSubmit.bind(this)}>{this.state.button}</button>
                        </div> 
                      </form>
                     </div>
                    <ListOfCodeAndReason />
                 </div>
               </div>
              </div>
           </div>
         </section>
      </div> 
      );
  } 
}
EditCodeReasonContainer = withTracker(({params}) => {
    var _id          = FlowRouter.getParam('id');
    const postHandle = Meteor.subscribe('singleCodeAndReason',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const codeAndReason  = CodeAndReason.findOne({"_id":_id})|| {};
    const loading    = !postHandle.ready();
    
    if(_id){
      var button = "UPDATE";
      return {
          loading,
          codeAndReason,
          button,
      };
    }else{
       var button = "ADD";
      return {
          loading,
          codeAndReason,
          button
      };
    }
})(AddEditCodeAndReason);

export default EditCodeReasonContainer;