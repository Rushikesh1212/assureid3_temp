import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {TempOrder} from '/imports/admin/corporateOrderManagement/component/newRequest/api/TempOrder.js';
import {CorporateOrders} from '/imports/admin/corporateOrderManagement/api/CorporateOrder.js';
import DeleteCandidate from './DeleteCandidate.jsx';

class CompanyUploadedData extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    };
  } 
  componentDidMount() { 
  }
  placeOrder(event){
    event.preventDefault();
    var orderTempDetails    = this.props.orderTempDetails;
    orderTempDetails.tempId = this.props.orderTempDetails._id;
    orderTempDetails.corporateOrderId = this.props.corporderid;
    if(orderTempDetails.corporateOrderId){
      Meteor.call("insertOrderByCompany",orderTempDetails,function(error,result){
        if(error){
          console.log(error.reason);
        }else if(result){
          // console.log('result ',result);
          var orderId = result;
          swal("Done","Your order has been placed successfully!"); 
          // var companyId = CompanyOrder.findOne({},{sort: {createdAt: -1}});
          // FlowRouter.go('/requestStatus/company/'+orderTempDetails.companyDetails.companyAssureID+"/"+orderTempDetails.serviceDetails.serviceId);
        }
      });
      
    }else{
      swal('Please upload .csv file.');
    }
  } 

  render() {
    if(Meteor.userId())
      return(
      <div>
        {
          this.props.uploadedCandidate.length > 0 ?
            <div> 
              <table className="table empVerifListTable table-striped table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Sr. No.</th>
                    <th className="text-center">Employee Details</th>
                    <th className="text-center">
                    {this.props.serviceRequired == "AddressForm" ?
                      "Address"
                      :
                      this.props.serviceRequired == "EducationForm"? 
                        "Education"
                      :
                       this.props.serviceRequired == "WorkForm"? 
                        "Employement"
                      :
                        this.props.serviceRequired == "StatutoryForm"?
                          "Card Number"
                      :
                      "-"
                     }
                    </th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.props.uploadedCandidate.length > 0 ?
                      this.props.uploadedCandidate.map((candidate, index)=>{
                        return(
                          <tr key={index}>
                            <td>
                              {index + 1}
                            </td>
                            <td className="text-left">
                              {candidate.candidateFirstName} {candidate.candidateLastName}<br />
                              {candidate.candidateEmailId}<br />
                              {candidate.candidateMobile ? candidate.candidateMobile : "-" }<br />
                              {candidate.candidateAadharNo ? candidate.candidateAadharNo : "-"} 
                            </td>
                            <td className="text-left">
                             { 
                              this.props.serviceRequired == "AddressForm" ?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                          <div key={i}>
                                             {verificationData.verificationType == "permanentAddress" ?
                                               <div>
                                                {verificationData.line1 ? verificationData.line1 : ""} {verificationData.line2 ? ", "+verificationData.line2 : "" }{verificationData.line3 ? ", "+verificationData.line3 : "" }{verificationData.landmark ? ", "+verificationData.landmark : "" } <br />
                                                {verificationData.city ? ", "+verificationData.city : ""}{verificationData.state ? ", "+verificationData.state : ""}{verificationData.country ? ", "+verificationData.country : ""}{verificationData.pincode ? "-"+verificationData.pincode : ""}<br />
                                                {verificationData.residingFrom ? "From ="+verificationData.residingFrom : ""} {verificationData.residingTo ? "To ="+verificationData.residingTo : ""}
                                               </div>
                                              :
                                               <div>
                                                {verificationData.tempLine1 ? verificationData.tempLine1 : "" }{verificationData.tempLine2 ? ", "+verificationData.tempLine2 : "" }{verificationData.tempLine3 ? ", "+verificationData.tempLine3 : "" }{verificationData.tempLandmark ? ", "+verificationData.tempLandmark : "" }<br />
                                                {verificationData.tempCity ? ", "+verificationData.tempCity : ""}{verificationData.tempState ? ", "+verificationData.tempState : ""}{verificationData.tempCountry ? ", "+verificationData.tempCountry : ""}{verificationData.tempPincode ? "-"+verificationData.tempPincode : ""}<br />
                                                {verificationData.tempresidingFrom ? "From ="+verificationData.tempresidingFrom : ""} {verificationData.tempresidingTo ? "To ="+verificationData.tempresidingTo : ""}                                              
                                               </div>
                                               }
                                          </div>
                                        );
                                    })
                                  : 
                                  null
                                :
                                null
                              :
                              this.props.serviceRequired == "EducationForm" ?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i}>
                                          {verificationData.educationLevel ? verificationData.educationLevel : ""} {verificationData.educationQualification ? " - "+verificationData.educationQualification : "" }{verificationData.specialization ? ", "+verificationData.specialization : "" }{verificationData.grades ? ", "+verificationData.grades : "" }
                                          {verificationData.educationMode ? ", "+verificationData.educationMode : ""}{verificationData.dateAttendedFrom ? ", Attended From= "+ moment(verificationData.dateAttendedFrom).format("MM/YYYY") : ""} {verificationData.dateAttendedTo ?  verificationData.dateAttendedTo != 'Present' ? ", Attended To ="+ moment(verificationData.dateAttendedTo).format("MM/YYYY")+"," : "Present" : ""}<br />
                                          {verificationData.collegeName ? verificationData.collegeName : ""}{verificationData.university ? ", "+verificationData.university : ""}{verificationData.collegeAddress ? ", "+verificationData.collegeAddress+"," : ""}
                                          {verificationData.city ? verificationData.city : ""}{verificationData.state ? ", "+verificationData.state : ""}{verificationData.country ? ", "+verificationData.country : ""}{verificationData.pincode ? "-"+verificationData.pincode : ""}
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null
                              :
                              this.props.serviceRequired == "WorkForm" ?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i}>
                                          {verificationData.nameOfEmployer ? verificationData.nameOfEmployer+" - " : ""} {verificationData.employerAddress ? verificationData.employerAddress+", ": "" }{verificationData.employerCity ? verificationData.employerCity+", " : ""}{verificationData.employerState ? verificationData.employerState+", " : ""}{verificationData.contactNo ? verificationData.contactNo+", " : ""}
                                          {verificationData.employeeCode ? verificationData.employeeCode+", " : ""}{verificationData.designation ? verificationData.designation+", " : ""}{verificationData.department ? verificationData.department+", " : ""}{verificationData.employmentFrom ? "Employement From = "+moment(verificationData.employmentFrom).format("MM/YYYY")+", " : ""}{verificationData.employmentTo ?  verificationData.employmentTo != 'Present' ? "Employement To = "+ moment(verificationData.employmentTo).format("MM/YYYY")+"," : "Employement To = Present" : ""}<br />
                                          {verificationData.lastSalaryDrawn ? verificationData.lastSalaryDrawn+", " : ""}{verificationData.typeOfEmployement ? verificationData.typeOfEmployement+", " : ""}{verificationData.detailOfAgency ? verificationData.detailOfAgency+", " : ""}{verificationData.reasonOfLeaving ? verificationData.reasonOfLeaving+", " : ""}{verificationData.dutiesAndResponsibilites ? verificationData.dutiesAndResponsibilites+", " : ""}
                                          {verificationData.reportingManagerNm ? verificationData.reportingManagerNm+", " : ""}{verificationData.prevDesignation ? verificationData.prevDesignation : ""}{verificationData.contactDetails ? ", "+verificationData.contactDetails : ""}.
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null 
                              :
                              this.props.serviceRequired == "StatutoryForm"?
                                candidate.verificationData ?
                                  candidate.verificationData.length > 0?
                                    candidate.verificationData.map((verificationData,i)=>{
                                      return(
                                        <div key={i}>
                                          {verificationData.identityType ? verificationData.identityType+'-' : ""}  {verificationData.cardNo ? verificationData.cardNo : verificationData.cardNo} 
                                        </div>
                                      );
                                    })
                                  : 
                                  null
                                :
                                null
                              :
                              null
                             }
                            </td>                            
                            <td>
                              <DeleteCandidate arrayIndex={index} tempOrderId={this.props.tempOrderId} />
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
        
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
          {/*<a href="/admin/allcorporateallocatedorders"><button className="btn btn-info pull-left bulkEmpButton">Back</button></a>          */}
          {
            this.props.uploadedCandidate.length > 0 ?  
              <button className="btn btn-info pull-right bulkEmpButton" onClick={this.placeOrder.bind(this)}>Confirm List</button>  
            :
            ""
          } 
        </div>
      </div> 
    );
  }
}
CompanyUploadedDataContainer = withTracker(props => {
  var corporderid  = FlowRouter.getParam('corporderid');
  const postHandle = Meteor.subscribe('allTempOrders');
  const corporateOrderHandle = Meteor.subscribe('singleCorporateOrder',corporderid)
  const loading    = !postHandle.ready() && !corporateOrderHandle.ready();
  
  var corporder  = CorporateOrders.findOne({"_id" : corporderid});

  if (corporder) {
    // var corporateOrderNo = corporder.corporateOrderNo;
     var orderTempDetails = TempOrder.findOne({"companyDetails.companyAssureID" : props.assureId, 
                                            "serviceDetails.serviceId"     : props.typeId,
                                            "companyDetails.SPOCDetails.EmailID" :  corporder.companyDetails.SPOCDetails.EmailID });
  }

  var uploadedCandidate = [];
 
  if(orderTempDetails){
    var tempOrderId = orderTempDetails._id;
    if(orderTempDetails.candidateDetails){
      orderTempDetails.candidateDetails = _.without(orderTempDetails.candidateDetails,null);
      uploadedCandidate = orderTempDetails.candidateDetails;
    }
  }
  
  return {
    tempOrderId,
    orderTempDetails,
    uploadedCandidate,
    corporderid
  };
  
})(CompanyUploadedData);

export default CompanyUploadedDataContainer;