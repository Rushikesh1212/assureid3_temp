import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {TempOrder} from '/imports/AssureID/company/newRequest/api/TempOrder.js';
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
    var orderTempDetails = this.props.orderTempDetails;
    if(orderTempDetails){
      Meteor.call("insertOrderByCompany",this.props.orderTempDetails,function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          // console.log('result ',result);
          var orderId = result;
          // var companyId = CompanyOrder.findOne({},{sort: {createdAt: -1}});
          FlowRouter.go('/requestStatus/company/'+orderTempDetails.companyDetails.companyAssureID+"/"+orderTempDetails.serviceDetails.serviceId);
        }
      });
      
      swal({
        title:'abc',
        text: "Your order has been placed successfully!",
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#666',
        confirmButtonText: 'Ok'
      })
    }else{
      swal({
        title:'abc',
        text: "Please upload .csv file",
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#666',
        confirmButtonText: 'Ok'
      })
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
                            <td>
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
        
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile noProfilePadding">
          <a href={"/companyConsole/"+this.props.assureId}><button className="btn btn-info pull-left bulkEmpButton">Back</button></a>          
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
  const postHandle = Meteor.subscribe('allTempOrders');
  const loading    = !postHandle.ready();
  // if(props.type == 'service'){
    var orderTempDetails = TempOrder.findOne({"companyDetails.companyAssureID" : props.assureId, 
                                              "serviceDetails.serviceId"       : props.typeId,
                                              "companyDetails.orderPlacedById" : Meteor.userId()
                                              });
  // }else{
  //   var orderTempDetails = TempOrder.findOne({"companyDetails.companyAssureID" : props.assureId, 
  //                                             "packageDetails.packageId"       : props.typeId,
  //                                             "companyDetails.orderPlacedById" : Meteor.userId()
  //                                             });
  // }
  var uploadedCandidate = [];
  console.log("orderTempDetails",orderTempDetails);
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
  };
  
})(CompanyUploadedData);

export default CompanyUploadedDataContainer;