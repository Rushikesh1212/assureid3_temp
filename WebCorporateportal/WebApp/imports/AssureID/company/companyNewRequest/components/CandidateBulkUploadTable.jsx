import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import DeleteCandidateFromTempCorp from './DeleteCandidateFromTempCorp.jsx';
class CandidateBulkUploadTable extends TrackerReact(Component) {
	constructor(){ 
    super(); 
    this.state ={ 
      "subscription" : {
      } 
    } 
  }
  componentDidMount() {
  }
  render() {
  	return(
  		<div> 
        <table className="table empVerifListTable table-striped table-bordered">
          <thead>
            <tr>
              <th className="text-center">Sr. No.</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email ID</th>
              <th className="text-center">Mobile Number</th>
              <th className="text-center">Gender</th>
              <th className="text-center">Aadhar Card Number</th>
              <th className="text-center">PAN Card Number</th>
              <th className="text-center">Action</th>
            </tr>
          </thead> 
          <tbody>
          
            {
            	this.props.orderDetails ? 
	              this.props.orderDetails.length > 0 ?
	                this.props.orderDetails.map((orderDetails, index)=>{
	                  return( 
	                    <tr key={index}>
						            <td>
						             {index+1}
						            </td>
						            <td className="text-left">
						              {orderDetails.candidateDetails.candidateFirstName} {orderDetails.candidateDetails.candidateLastName}
						            </td>
						            <td className="text-left">
						             {orderDetails.candidateDetails.candidateEmailId}
						            </td>                            
						            <td className="text-left">
						              {orderDetails.candidateDetails.candidateMobile}
						            </td>
						            <td className="text-left">
						              {orderDetails.candidateDetails.candidateGender}
						            </td>
						            <td className="text-left">
						              {orderDetails.candidateDetails.candidateAadharNo ? orderDetails.candidateDetails.candidateAadharNo : "-"} 
						            </td>
						            <td className="text-left">
						              {orderDetails.candidateDetails.candidatePanNo ? orderDetails.candidateDetails.candidatePanNo : "-"} 
						            </td> 
						            <td className="text-center">
	                        <DeleteCandidateFromTempCorp arrayIndex={index} tempCorporateOrderId={this.props.tempCorporateOrderId} csvFileId={this.props.csvFileId} />
						            </td>
						          </tr>                     
	                  );
	                })
								:
									<tr>
										<td className="text-center" colSpan="7"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img></td>
									</tr>
								:
									<tr>
										<td className="text-center" colSpan="7"><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img></td>
									</tr>
							
            }
          </tbody>
        </table>         
      </div> 
  	);
  }
 
}
CandidateBulkUploadTableContainer = withTracker(props => {
	var orderDetails = _.without(props.orderDetails,null);
  return {
    orderDetails,
  };
})(CandidateBulkUploadTable);
export default CandidateBulkUploadTableContainer;
