import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data'; 
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import EditCompanyEmpData from './EditCompanyEmpData.jsx';
import {TempOrder} from '/imports/admin/corporateOrderManagement/component/newRequest/api/TempOrder.js';

class EmployeeVerificationTable extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    };
  } 
  componentDidMount() {
  }
  checkAllField(event){ 
    if(event.target.checked){
      $('.empCheckbox').prop('checked',true);
    }else{
      $('.empCheckbox').prop('checked',false);
    }
  }
  continueManualEmp(event){
    var index = $(event.currentTarget).attr('data-index');
    // console.log("index",index);
    if(event.target.checked){
      $(event.target).prop('checked',true);
      Meteor.call("changeSelectionCandidate",this.props.tempOrderId,index,'Selected',true,function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          // swal("Done","Basic Information inserted successfully!"); 
        }
      });
    }else{
      $(event.target).prop('checked',false);
      Meteor.call("changeSelectionCandidate",this.props.tempOrderId,index,'unSelected',false,function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          // swal("Done","Basic Information inserted successfully!"); 
        }
      });
    }
  }
  // addBulkEmp(event){
  //   var checkedList = [];
  //   $('input[name=empCheckbox]:checked').each(function() {
  //     checkedList.push(this.value);
  //   });

  //   var finalCheckedList = jQuery.unique( checkedList );
  //   if(finalCheckedList.length == 0){  
  //     swal('Please select the user first and then continue.');
  //   }else{
  //     browserHistory.replace('/verificationProcess/before-bulk/'+this.props.assureId+'/'+this.props.serviceId);
  //   }
  // }
  addManualEmp(event){
    var checkedList = [];
    $('input[name=empCheckbox]:checked').each(function() {
      checkedList.push(this.value);
    });

    var finalCheckedList = jQuery.unique( checkedList );
    if(finalCheckedList.length == 0){  
      swal('Please select the user first and then continue.');
    }else{
      FlowRouter.go('/verificationProcess-before/'+this.props.tempOrderId);
      // browserHistory.replace('/verificationProcess/before-manual/'+this.props.assureId+'/'+this.props.serviceId);
    }
  }
  deleteUser(event){
    event.preventDefault();
    var idVal= $(event.currentTarget).attr('data-target'); 
    // console.log("idVal",idVal)
    $('#'+idVal).modal('show');
  }
  deleteCompanyDetails(event){
    event.preventDefault();
   
  }


  render() {
    if(Meteor.userId())
      return(
      <div>
        {
          this.props.notSelectedArr.length > 0 ?
            <div> 
              <p className="text-danger text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Not selected Candidates</p>
              <table className="table empVerifListTable table-striped table-bordered">
                <thead>
                  <tr>
                    <th>
                    {/*<input type="checkbox" id="empCheckbox" value="" onClick={this.checkAllField.bind(this)}/>*/}
                    </th>
                    <th className="text-center">First Name</th>
                    <th className="text-center">Last Name</th>
                    <th className="text-center">Email ID</th>
                    <th className="text-center">Mobile Number</th>
                    <th className="text-center">Aadhar Number</th>
                    <th className="text-center">AssureID</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.notSelectedArr.length > 0 ?
                      this.props.notSelectedArr.map((notSelected, index)=>{
                        return(
                          <tr key={index+'unSelected'}>
                            <td>
                              <input type="checkbox" name="empCheckbox" className="empCheckbox uniqueCursorPointer" data-index={notSelected.arrayIndex} value={notSelected.i} defaultChecked={notSelected.selected} checked={notSelected.selected} onClick={this.continueManualEmp.bind(this)} />
                            </td>
                            <td>
                              {notSelected.firstName}
                            </td>
                            <td>
                              {notSelected.lastName}
                            </td>
                            <td>
                              {notSelected.emailId}
                            </td>
                            <td>
                              {notSelected.mobile}
                            </td> 
                            <td>
                              {notSelected.aadharNo}
                            </td>
                            <td>
                              {notSelected.assureId}
                            </td>
                            {/*<EditCompanyEmpData key={companyOrder._id+"editCompanyData"} companyOrder={companyOrder} serviceId={this.props.serviceId ? this.props.serviceId : ''} assureId={this.props.assureId ? this.props.assureId : ''} serviceName={this.props.serviceName ? this.props.serviceName : ''} />*/}
                            <td>
                            {/*<EditCompanyEmpData arrayIndex={notSelected.arrayIndex} tempOrderId={this.props.tempOrderId} />*/}
                            {/* <i className="fa fa-trash add-btn" data-toggle="modal" onClick={this.deleteUser.bind(this)} data-target={"deleteNotselectedUser-"+index}></i>
                              <div className="modal fade" id={"deleteNotselectedUser-"+index} role="dialog">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                      </div>
                                      <p className="">Do you want to delete this data?</p>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" data-index={notSelected.arrayIndex} onClick={this.deleteCompanyDetails.bind(this)}>Yes</button>
                                        &nbsp;&nbsp;
                                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                    </div>
                                  </div>  
                                </div>
                                </div>*/}
                            </td>
                          </tr>                        
                        );
                      })
                    :
                    <tr>
                    </tr>  
                  }
                </tbody>
              </table>
            </div>
          :
          ""
        }
        {
          this.props.selectedArr.length > 0 ?
            <div>
              <p className="text-danger text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Selected Candidates</p>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
                <table className="table empVerifListTable table-striped table-bordered" style={{marginTop : '0'+'px'}}>
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-center">First Name</th>
                      <th className="text-center">Last Name</th>
                      <th className="text-center">Email ID</th>
                      <th className="text-center">Mobile No</th>
                      <th className="text-center">Aadhar Number</th>
                      <th className="text-center">AssureID</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.selectedArr.length > 0 ?
                        this.props.selectedArr.map((selected, index)=>{
                          return(
                            <tr key={index+'Selected'}>
                              <td>
                                <input type="checkbox" name="empCheckbox" className="empCheckbox uniqueCursorPointer" data-index={selected.arrayIndex} value={selected.i} defaultChecked={selected.selected} checked={selected.selected} onClick={this.continueManualEmp.bind(this)} />
                              </td>
                              <td>
                                {selected.firstName}
                              </td>
                              <td>
                                {selected.lastName}
                              </td>
                              <td>
                                {selected.emailId}
                              </td>
                              <td>
                                {selected.mobile}
                              </td>
                              <td>
                                {selected.aadharNo}
                              </td>
                              <td>
                                {selected.assureId}
                              </td>
                                {/*<i className="fa fa-trash add-btn" data-toggle="modal" onClick={this.deleteUser.bind(this)} data-target={"deleteselectedUser-"+index}></i>*/}
                              <EditCompanyEmpData arrayIndex={selected.arrayIndex} tempOrderId={this.props.tempOrderId} />
                              {/*<div className="modal fade" id={"deleteselectedUser-"+index} role="dialog">
                                <div className="modal-dialog">
                                  <div className="modal-content">
                                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                      </div>
                                      <p className="">Do you want to delete this data?</p>
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" data-index={selected.arrayIndex} onClick={this.deleteCompanyDetails.bind(this)}>Yes</button>
                                        &nbsp;&nbsp;
                                        <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                    </div>
                                  </div>  
                                </div>
                              </div>*/}
                            </tr>                        
                          );
                        })
                      :
                      <tr>
                      </tr>  
                    }
                  </tbody>
                </table>
              </div>
            </div>
          :
          ""
        }
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
          {
            this.props.type == 'service' ?
              <a href={"/companyConsole/"+this.props.assureId}><button className="btn btn-info pull-left bulkEmpButton">Back</button></a>
            :
              <a href={"/companyConsole-Package/"+this.props.assureId}><button className="btn btn-info pull-left bulkEmpButton">Back</button></a>
          }
          
          {
            this.props.selectedArr.length > 0 || this.props.notSelectedArr.length > 0 ?  
              <button className="btn btn-info pull-right bulkEmpButton" onClick={this.addManualEmp.bind(this)}>Continue</button>  
            :
            ""
          }
        </div>
      </div> 
    );
  }
}
EmployeeVerificationTableContainer = withTracker(props => {
  const postHandle = Meteor.subscribe('allTempOrders');
  const loading    = !postHandle.ready();
  if(props.type == 'service'){
    var orderTempDetails = TempOrder.findOne({"companyDetails.companyAssureID" : props.assureId, 
                                              "serviceDetails.serviceId"       : props.typeId,
                                              "companyDetails.orderPlacedById" : Meteor.userId()
                                              });
  }else{
    var orderTempDetails = TempOrder.findOne({"companyDetails.companyAssureID" : props.assureId, 
                                              "packageDetails.packageId"       : props.typeId,
                                              "companyDetails.orderPlacedById" : Meteor.userId()
                                              });
  }
  var selectedArr = [];
  var notSelectedArr = [];
  console.log("orderTempDetails",orderTempDetails);
  if(orderTempDetails){
    var tempOrderId = orderTempDetails._id;
    if(orderTempDetails.candidateDetails){
      orderTempDetails.candidateDetails = _.without(orderTempDetails.candidateDetails,null);
      for( i = 0; i < orderTempDetails.candidateDetails.length; i++ ){
        if(orderTempDetails.candidateDetails[i].selectionStatus){
          if(orderTempDetails.candidateDetails[i].selectionStatus == 'Selected'){
            selectedArr.push({
              "firstName" : orderTempDetails.candidateDetails[i].candidateFirstName,
              "lastName"  : orderTempDetails.candidateDetails[i].candidateLastName,
              "emailId"   : orderTempDetails.candidateDetails[i].candidateEmailId,
              "mobile"    : orderTempDetails.candidateDetails[i].candidateMobile,
              "aadharNo"  : orderTempDetails.candidateDetails[i].candidateAadharNo,
              "assureId"  : orderTempDetails.candidateDetails[i].candidateAssureID,
              "arrayIndex": i,
              "selected"  : true,
            });
          }else{
            notSelectedArr.push({
              "firstName" : orderTempDetails.candidateDetails[i].candidateFirstName,
              "lastName"  : orderTempDetails.candidateDetails[i].candidateLastName,
              "emailId"   : orderTempDetails.candidateDetails[i].candidateEmailId,
              "mobile"    : orderTempDetails.candidateDetails[i].candidateMobile,
              "aadharNo"  : orderTempDetails.candidateDetails[i].candidateAadharNo,
              "assureId"  : orderTempDetails.candidateDetails[i].candidateAssureID,
              "arrayIndex": i,
              "selected"  : false,
            });
          }
        }
      }
    }
  }
 
  return {
    tempOrderId,
    selectedArr,
    notSelectedArr,
  };
  
})(EmployeeVerificationTable);

export default EmployeeVerificationTableContainer;