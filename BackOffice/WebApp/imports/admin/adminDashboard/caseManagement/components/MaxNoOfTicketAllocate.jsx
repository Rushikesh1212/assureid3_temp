import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {CompanySettings} from '/imports/admin/companySettings/api/CompanySettingMaster.js';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';

class MaxNoOfTicketAllocate extends TrackerReact(Component){
	constructor(props){
        super(props);
        this.state = {
            "numberallocated" : '',
            "role"            : '',
            "button"          : 'Submit',
        }
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
      // validation
      $.validator.addMethod("regCx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "You can enter only 1 to 5 digit number.");

      $("#maxnoofticketallocate").validate({
        rules: {
            // numberallocated: {
            //   required: true,
            // },

            numberallocated: {
              required: true,              
              regCx3: /^[0-9]{1,5}$/, 
            },
            role: {
              required: true,
            },
          },
          // messages: {
          //   numberallocated: {
          //     required: "You can enter only 1 to 5 digit number !",
          //     // minlength: "Use at least 1 characters, please."
          //   },
          //    role: {
          //     required: "Please select any of above !",
          //     // minlength: "Use at least 1 characters, please."
          //   },

          // }
      }); 
    }
    componentWillReceiveProps(nextProps) {
      if(!nextProps.loading){
        if(nextProps.editMaxAllocate){
           this.setState({
               numberallocated   : nextProps.editMaxAllocate.maxTicketAllocate,
               role              : nextProps.editMaxAllocate.role,
               id                : nextProps.id,
               button            : 'Update',
           });
        }else{
          this.setState({
            numberallocated   : '',
            role              : '',
            // id                : '',
            button            : 'Submit',
          });
        }
      }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    
  }
    delAllocatedTicket(event){
    	event.preventDefault();
      var id = event.currentTarget.id;
      var targetedID = parseInt(id);
      // console.log("targetedID",targetedID);
      Meteor.call('removeAllocatedTickets', targetedID);
    }

  editAllocatedTicket(event){
    event.preventDefault();
    var targetedID = event.currentTarget.id;
    FlowRouter.go('/admin/company-info/'+parseInt(targetedID));
   //  var companyData = CompanySettings.findOne({"companyId":1});
   //  var maxTicketAllocate =  companyData.maxnoOfTicketAllocate[targetedID].maxTicketAllocate;
   //  var role              =  companyData.maxnoOfTicketAllocate[targetedID].role;
  	// $(".numberallocated").val(maxTicketAllocate);
   //  $(".role").val(role);
        
   //    if ($(".companyTaxSubmit").text("Submit")){			
   //    	$(".companyTaxSubmit").html("Update");
   //    }
   //    Session.set('targetedID',targetedID);
   //    Session.set('role',role)
  }

  maxticketallocate(event){
    event.preventDefault();
    if(this.refs.role.value!='-- Select --'){
      var roleName = this.refs.role.value;
    }else{
      var roleName = '';
    }


    if(roleName){
      var formValues = {
        'maxTicketAllocate' : this.refs.numberallocated.value,
        'role'              : roleName,
      }   
      var id = this.state.id; 
      var targetedID = parseInt(id);
      var companySettings = CompanySettings.find({}).fetch();
      if(companySettings.length > 0){
        if($('#maxnoofticketallocate').valid()){
          // console.log(targetedID,this.refs.numberallocated.value);
          if(targetedID >= 0 && this.refs.numberallocated.value!=""){
            Meteor.call('updateAllocatedTicket',formValues,targetedID,(error, result)=>{
              if(error){
                console.log(error);
              }else{     

                swal({
                  title: "Data Updated",
                  text: 'Allocated Ticket Updated!!',
                  timer: 3000,
                  showConfirmButton: false,
                  type: "success"
                });
                // FlowRouter.go("/admin/company-info");
                $(".numberallocated").val('');
                $(".role").val('-- Select --');
                if ($(".companyTaxSubmit").text("Update")){     
                  $(".companyTaxSubmit").html("Submit");
                }
              }
            });
          }else{
            var valueArr = this.props.maxAllocatedData.map(function(item){ return item.role });
            var isRoleAvailable = valueArr.indexOf(roleName);

            if(isRoleAvailable<0){
              if(this.refs.numberallocated.value!=""){
                Meteor.call('insertMaxTicketAllocate',formValues,(error,result) => {
                  if(error){ 
                  swal(error.reason);
                  }else{ 
                  swal({
                    title: "Data Inserted",
                    text: "Data inserted successfully!!",
                    timer: 3000,
                    showConfirmButton: false,
                    type: "success"
                  });     
          
                  // CLEAR ALL FIELDS
                  this.refs.numberallocated.value  = '';
                  this.refs.role.value             = '-- Select --';
                  }
                })
              }
            }else{
              swal({
                title: "Duplicate Entry",
                text: "Please update data for the role '"+roleName+"'.",
                timer: 3000,
                showConfirmButton: false,
                type: "error"
              });
            }
          }
        }
      }else{
        swal("Please Add Company Settings");
      }
    }
  }

  render(){
      return (
          <div className="content-wrapper">
            {/*<section className="content-header">
              <h1> Case Management </h1>
              <ol className="breadcrumb">
                <li>
                  <a href="#"><i className="fa fa-newspaper-o" />Case Management</a></li>
                <li className="active">Allocate Maximum Cases</li>
              </ol>
            </section>*/}
             <section className="content">
               <div className="row">
                 <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12">
                   <div className="box box-primary">
                      <div className="box-header with-border">
                       <h2 className="box-title">Allocate Maximum Case</h2>  
                      </div>
                      <div className="box-body "> 
                        <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 noofticketwrapouter">
                          <form id="maxnoofticketallocate" onSubmit={this.maxticketallocate.bind(this)}>
                            <div className="noofticketwrap col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <div className="form-group col-lg-5 col-md-5 col-xs-12 col-sm-12 ">
                                <span className="blocking-span">
                                    <label className="floating-label">Role</label>
                                    <select className="form-control allProductSubCategories role" aria-describedby="basic-addon1" name="role" ref="role" value={this.state.role?this.state.role:'-- Select --'} onChange={this.handleChange}>
                                      <option disabled="disabled">-- Select --</option>
                                      { this.props.roleList ? 
                                        this.props.roleList.length > 0 ?
                                          this.props.roleList.map((data, index)=>{
                                            return (
                                                <option key={index}>
                                                  {data.name}
                                                </option>
                                            );
                                          })
                                            :
                                            ""
                                          :
                                          ""
                                      }
                                   </select>
                                </span>
                              </div>
                              <div className="form-group col-lg-7 col-md-7 col-xs-12 col-sm-12 ">
                                <span className="blocking-span">
                                    <label className="floating-label">Enter Maximum No. Of Cases to Allocate </label>
                                    <input type="number" min="0" className="form-control inputText numberallocated" ref="numberallocated" name="numberallocated" value={this.state.numberallocated} onChange={this.handleChange} required />
                                </span>
                              </div>
                              <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                <button className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right companyTaxSubmit" type="submit" value="Submit" >{this.state.button}</button>
                              </div> 
                            </div> 
                          </form>
                        </div>  
                        {/* <ListOfUniversity /> */}
                      </div>
                   </div>
                   {
                     !this.props.loading ?
                    //  return(
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                              <thead>
                                <tr className="tableHeader">
                                  <th> Maximum No. of Case Allocated </th>
                                  <th> Role </th>
                                  <th> Action </th>
                                </tr>
                              </thead>
                               <tbody>
                               { this.props.maxAllocatedData ?
                                this.props.maxAllocatedData.map((allocationNumber,index)=>{
                                    return(
                                      <tr key={index}>
                                        <td> {allocationNumber.maxTicketAllocate} </td>			
                                        <td> {allocationNumber.role} </td>	
                                        <td>
                                        <button onClick={this.editAllocatedTicket.bind(this)} id={index} className="editTax fa fa-pencil-square-o"></button>	
                                        <button className= "taxDelete fa fa-trash delIcon detailsCenter" data-toggle="modal" data-target={`#del-${index}`}></button>
                                          <div className="modal fade" id={`del-${index}`} role="dialog">
                                            <div className="modal-dialog modal-sm">
                                              <div className="modal-content">
                                                <div className="modal-header">
                                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                  <h4 className="modal-title">Delete Max Case Allocated Count</h4>
                                                </div>
                                                <div className="modal-body">
                                                  <p><b>Are you sure you want to continue?.</b></p>
                                                </div>
                                                <div className="modal-footer">
                                                  <button  onClick={this.delAllocatedTicket.bind(this)} id={index} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
                                                <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          </td>	
                                      </tr>
                                    )
                                  })
                                 : 
                                 ""
                                }
                              </tbody>
                            </table>
                        </div>
                      </div>
                    //  )
                     :
                     ""
                   }
                  

                  </div>
               </div>
             </section>
          </div> 
          );
  }
}
export default maxTicketAllocationContainer = withTracker(props => {
  var id                     = FlowRouter.getParam('id');
  const companySettingHandle = Meteor.subscribe('companyData');
  var companyDetails         = CompanySettings.findOne({'companyId':1});
  const roleSubscribe        = Meteor.subscribe("rolefunction");
  if(companyDetails && companyDetails.maxnoOfTicketAllocate){
    // var maxAllocatedData = companyDetails.maxnoOfTicketAllocate.reverse();
    var maxAllocatedData = companyDetails.maxnoOfTicketAllocate;
    var editMaxAllocate  = companyDetails.maxnoOfTicketAllocate[parseInt(id)];
  }else{
    var maxAllocatedData = [];
  }
  var roleList    = []; 
  var allRoleObj  = Meteor.roles.find({name: { $nin: [ "superAdmin", "admin","user","companyuser","backofficestaff"]} }).fetch();
  if(allRoleObj){
    roleList    = allRoleObj;      
  }
  var loading = !companySettingHandle.ready() && !roleSubscribe.ready();
  return{
    loading,
    maxAllocatedData,
    roleList,
    editMaxAllocate,
    id
  };

})(MaxNoOfTicketAllocate)
