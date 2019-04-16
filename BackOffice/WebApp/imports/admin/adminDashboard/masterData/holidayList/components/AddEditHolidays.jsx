import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import ListOfHolidays from './ListOfHolidays.jsx';
import { HolidaysList } from '/imports/admin/adminDashboard/masterData/holidayList/api/HolidaysList.js';
class AddEditHolidays extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
      holidayDate : '',
      holidayReason : '',
      button : 'ADD',
      "subscription"  : {
      }  
    }; 
     this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.holiday){
         this.setState({
             holidayDate      : nextProps.holiday.holidayDate,
             holidayReason    : nextProps.holiday.holidayReason,
             id               : nextProps.holiday._id,
             button           : nextProps.button,
         });
      }
    }else{
      this.setState({
             holidayDate     : '',
             holidayReason   : '',
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
  

  componentDidMount(){
    $('#fieldSelect').multipleSelect();
     $.validator.addMethod("holidayreasonregx", function(value, element, regexpr) {          
       return regexpr.test(value);
     }, "Please enter valid data");
     
     $("#holidaylistValid").validate({
       rules: {
        holidayReason: {
           required: true,
           holidayreasonregx: /^[a-zA-Z_ ]+$|^$/, 
         },
         holidayDate: {
          required: true,
        }
       },
 
       errorPlacement: function(error, element) {   
         if (element.attr("name") == "holidayReason"){      
           error.insertAfter("#holidayReason");  
         }

         if (element.attr("name") == "holidayDate"){      
            error.insertAfter("#holidayDate");  
          }
         
       }
 
     });  
   }


  handleSubmit(e){
    e.preventDefault();
   if($("#holidaylistValid").valid()){ 
      var holidayDate     = this.refs.holidayDate.value;
      var holidayReason   = this.refs.holidayReason.value;
      var id              = FlowRouter.getParam('id');
      var todaysDate = new Date();
      todaysDate.setHours(0,0,0);
      var holidayConvertDate = new Date(holidayDate);
      holidayConvertDate.setHours(0,0,0);
      

      if(id){ 
        if(holidayConvertDate > todaysDate){
          Meteor.call('updateHoliday',id,holidayDate,holidayReason,(error,result)=>{
            if(error){
                console.log(error.reason);
            }else{                      
              swal("Done","Your Field has been Updated!.","success");  
              var path = "/admin/HolidayList";
              FlowRouter.go(path);
              $(".holidayDate").val("");
              $(".holidayReason").val("");
            }            
          });
        }else{
          swal("Please Enter valid date");
        }
      }else{    
        if(holidayConvertDate > todaysDate){
          Meteor.call('createHoliday',holidayDate,holidayReason,(error,result)=>{
            if(error){
                console.log(error.reason);
            }else{                      
              swal("Done","Your data has been Added!.","success"); 
              // $(".UniversityName").val("");
              $(".holidayDate").val("");
              $(".holidayReason").val("");
            }            
          });  
        }else{
          swal("Please Enter valid date");
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
              <a href="#"><i className="fa fa-file-code-o" /> Master Data</a></li>
            <li className="active">Add Holidays List</li>
          </ol>
        </section>
         <section className="content">
           <div className="row">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <div className="box box-primary">
                  <div className="box-header with-border">
                   <h2 className="box-title">Holidays List</h2>  
                  </div>
                  <div className="box-body">
                    <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                      <form id="holidaylistValid">
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                        <span className="blocking-span">
                            <label className="floating-label">Holiday Date<span className="astrikReq">*</span>
                            </label>
                            <input type="date" className="form-control inputText holidayDate" ref="holidayDate" id="holidayDate" name="holidayDate" value={this.state.holidayDate} onChange={this.handleChange} required/>
                        </span> 
                      </div>
                      <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12" id="holidayReasonError">
                        <span className="blocking-span">
                            <label className="floating-label">Holiday Reason <span className="astrikReq">*</span></label>
                            <input type="text" className="form-control inputText holidayReason" ref="holidayReason" id="holidayReason" name="holidayReason" value={this.state.holidayReason} onChange={this.handleChange} required/>
                        </span> 
                      </div>
                       <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="" onClick={this.handleSubmit.bind(this)}>{this.state.button}</button>
                        </div> 
                      </form>
                     </div>
                    <ListOfHolidays />
                 </div>
               </div>
              </div>
           </div>
         </section>
      </div> 
      );
  } 
}
EditHolidaysContainer = withTracker(({params}) => {
    var _id          = FlowRouter.getParam('id');
    const postHandle = Meteor.subscribe('singleholidayList',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const holiday  = HolidaysList.findOne({"_id":_id})|| {};
    const loading   = !postHandle.ready();
    
    if(_id){
      var button = "UPDATE";
      return {
          loading,
          holiday,
          button,
      };
    }else{
       var button = "ADD";
      return {
          loading,
          holiday,
          button
      };
    }
})(AddEditHolidays);

export default EditHolidaysContainer;