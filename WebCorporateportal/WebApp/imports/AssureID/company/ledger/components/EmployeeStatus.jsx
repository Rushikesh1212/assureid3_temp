import React,{Component} from 'react';
import {render} from 'react-dom'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
import {Order} from '/imports/AssureID/company/newRequest/api/Order.js';
import {TicketMaster} from '/imports/AssureID/company/newRequest/api/TicketMaster.js';
import EmployeeDetailsInformation from '/imports/AssureID/company/ledger/components/EmployeeDetailsInformation.jsx';
require('moment-weekday-calc');

class EmployeeStatus extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      candidateDetails : {},
      "subscription" : {
      } 
    }
  } 
  
  render() {
    if (!this.props.loading) {
      return (
       <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerServicesBlock table-responsive"> 
            <table className="table empVerifListTable table-striped table-bordered">
              <thead>
                <tr className="" >
                  <th className="text-center ">Sr. No.</th>
                  <th className="text-center ">AssureID</th>
                  <th className="text-center ">Employee Details</th>
                  {/* {
                  	this.props.service && this.props.service.length > 0 ?
                  		this.props.service.map((heading,index)=>{
                  			return(
                  				<th key={index}>{heading}</th>
                  			);
                  		})
                  	:
                  	<th>No Service  Added</th>
				  } */}
				  
				  

				{
                  	this.props.allServices && this.props.allServices.length > 0 ?
                  		this.props.allServices.map((heading,index)=>{
                  			return(
                  				<th className="col-lg-1 col-md-1 col-sm-4 col-xs-4"key={index}>{heading.name}</th>
                  			);
                  		})
                  	:
                  	<th>No Service  Added</th>
				}


                  <th className="text-center ">Order</th>
                  <th className="text-center ">Report</th>
                </tr>
              </thead>
              <tbody>
                {
                  	this.props.candidateDataList && this.props.candidateDataList.length > 0 ?
                  		this.props.candidateDataList.map((candidateData,index)=>{
                  			return(
                  				<tr key={index} className="">
                          			<td className="text-left">
                            			{index + 1}
                          			</td>
                          			<td className="text-left">
                            			{candidateData.candidateAssureID}
                          			</td>
                          			<td className="text-left">
                            			{candidateData.candidateBasicInfo.name}<br />
                            			{/* {candidateData.candidateBasicInfo.email}<br />
                            			{candidateData.candidateBasicInfo.mobile}<br />
                            			{candidateData.candidateBasicInfo.aadhar}<br /> */}
                          			</td>
                          			{
                          				candidateData.services && candidateData.services.length > 0 ?
                          					candidateData.services.map((service,j)=>{												
                          						return service.status !="-" ?																				
                          							// <td key={j} className={service.color}>
                          							<td key={j}>																					
														<button type="button" className={"btn "+service.color} data-toggle="modal" data-target={"#status-"+j+"-"+index} data-displaystatus = {service.displayStatus}>{service.displayStatus}</button>
														<EmployeeDetailsInformation modalid={"status-"+j+"-"+index} verifdata ={service.vData}/>																					
                          							</td>
																				
												//   );
												  :

												  <td key={j}>																					
														-
                          							</td>

												//   null
                          					})
                          				:
                          					<td>No Service  Added</td>
                          			}
			                        <td className={"text-left "}>
									  {/* {candidateData.order.status ? candidateData.order.status : "-"} */}
										<div className={"col-lg-9 col-lg-offset-2 col-md-9 col-md-offset-2 col-sm-12 col-xs-12 orderStatusBlock "+candidateData.order.color}>
										  {candidateData.order.displayStatus ? candidateData.order.displayStatus : "-"}
										</div>
			                        </td> 
			                        <td className="text-left">
			                          {
			                          	candidateData.report != '-' ? 
			                              	<div className="col-lg-10">
			                              		<a href={candidateData.report} target="_blank">
													<img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="ledgerReport"/>
												</a>
			                              	</div>
			                            :
			                                <div>
			                                  <p>-</p>
			                                </div>
			                           }
			                        </td> 
		                        </tr>
                  			);
                  		})
                  	:
					<tr>
						<td className="text-center" colSpan={this.props.colSpan}><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/loading.gif" alt="loading"></img></td>
					</tr>
                } 
              </tbody>
            </table>
          </div>        
        </div> 
      );
    }else{ 
      return(
          <span>Loading</span>
        );
    }
   
  }
}

CandidateOrderListContainer = withTracker(props => {
	const postHandle     = Meteor.subscribe('matchedCompOrdersContractId',props.companyAssureID,props.contractId);
	const loading        = !postHandle.ready();
	var services         = props.serivces;
	var allServices      = [];
	var serviceArray     = [];
	// var status   = ['Case Initiated','Verification Started','Verification Completed','Review In Progress','Report Generating','Completed']; 
	
	var ArrayOfStatus = [
		{
			status : '-',
			color  : 'Bg-transparent', 
			displayStatus : "",
			index  : -1, 
		},
		{
			status : 'Case Received', 
			displayStatus : 'CR',
			color  : 'Bg-info',
			index  : 0, 
		},
		{
			status : 'Pending from Applicant',
			displayStatus : 'PA',
			color  : 'Bg-warning',
			index  : 1, 
		},
		{
			status : 'Data Entry is in progress',
			displayStatus : 'DEP',
			color  : 'Bg-primary',
			index  : 2, 
		},
		{
			status : 'Verification Initiated',
			displayStatus : 'VI',
			color  : 'Bg-primary',
			index  : 3, 
		},
		{
			status : 'Verification Is In Progress',
			displayStatus : 'VP',
			color  : 'Bg-warning',
			index  : 4, 
		},
		{
			status : 'Verification Received',
			displayStatus : 'VR',
			color  : 'Bg-info',
			index  : 5, 
		},
		{
			status : 'Review In Progress',
			displayStatus : 'RP',
			color  : 'Bg-warning',
			index  : 6, 
		},
		{
			status : 'Completed',
			color  : 'Bg-success',
			displayStatus : "C",
			index  : 7, 
		},
		{
			status : 'Case Re-opened',
			displayStatus : "CO",			
			color  : 'Bg-danger',
			index  : 8, 
		},
		{
			status : 'Insufficiency',
			displayStatus : "IS",			
			color  : 'Bg-danger',
			index  : 9, 
		},
		{
			status : 'Report Generating',
			displayStatus : "C",
			color  : 'Bg-info',
			index  : 10, 
		},

	];
	var candidateDataList = [];
	 var orderList = Order.find({},{sort:{"createdAt": -1}}).fetch(); 
	 // 
	 orderList.map((orderData,i)=>{	 
		orderData.packageDetails.servicesIncluded.filter(function(serviceData){
			var i = allServices.findIndex(x => x.serviceId == serviceData.serviceId);
			if(i <= -1){
				allServices.push({serviceId: serviceData.serviceId, name: serviceData.serviceName,serviceRequired:serviceData.serviceRequired});
			}
		});
	});
	
	if(orderList){
		//serviceArray Array
		
		orderList.map((order,i)=>{
			var candidateList = order.candidateDetails;
			if(candidateList){
				candidateList.map((candidate,c)=>{					
					var candidateData = {
						"candidateAssureID"		: candidate.candidateAssureID,
						"candidateBasicInfo"	: {
													name   : candidate.candidateFirstName+' '+candidate.candidateLastName,
													email  : candidate.candidateEmail,
													mobile : candidate.candidateMobile,
													aadhar : candidate.candidateAadharCard,
												  },
						"services"				: [],
						"order"					: {
													orderId : order._id,
													orderNo : order.orderNo,
													// status : '-',
													// status : 'Case Received',
													status : 'CR',
													color  : 'Bg-info',
												  },
						"report"				: 'Not Available',
					};
					if(candidateData){
						if(candidateData.report == 'Not Available'){
							if(candidate.genratedReport){
								candidateData.report = candidate.genratedReport;
							}else{
								candidateData.report = '-';
							}
						}
						/**======================== New Nilam Code */
						// 
						if(allServices.length>0){
							allServices.map((service,j) =>{
								var verifData = candidate.verificationData;
								if(verifData && verifData.length>0){
									var findVData = verifData.filter(function (obj) { 
										return obj.serviceId == service.serviceId 
									});
									if(findVData.length>0){
										var vdata = [];
										findVData.map((data,d)=>{
											var statusI = ArrayOfStatus.find(function(obj){ if(obj.status == data.verificationDataStatus){return obj}});
											if(statusI){
												switch(service.serviceRequired){
													case 'AddressForm' :
														if(data.verificationType == "permanentAddress"){
															var data1 = {
																line1 		: data.line1+","+ data.line2+","+data.line3,
																line2 		: data.landmark+","+data.city+","+data.state+","+data.country+","+data.pincode,
																line3 		: data.residingFrom+","+data.residingTo,
																status 		: data.verificationDataStatus,
																color 		: statusI.color,
																document  	: data.documents,
																statusIndex : statusI.index,
																displayStatus : statusI.displayStatus,
																verificationType : "AddressForm"
															};
														}else if(data.verificationType == "currentAddress"){
															var data1 = {
																line1 		: data.tempLine1+","+ data.tempLine2+","+data.tempLine3,
																line2 		: data.tempLandmark+","+data.tempCity+","+data.tempState+","+data.tempCountry+","+data.tempPincode,
																line3 		: data.tempresidingFrom+","+data.tempresidingTo,
																status 		: data.verificationDataStatus,
																color 		: statusI.color,
																document  	: data.documents,
																statusIndex : statusI.index,
																displayStatus : statusI.displayStatus,
																verificationType : "AddressForm"
																
															};
														}
														
														break;
													case 'EducationForm' :
														var data1 = {
															line1 		: data.educationLevel+","+data.educationQualification+","+data.specialization+","+data.grades+","+data.educationMode+","+data.dateAttendedFrom+","+data.dateAttendedTo,
															line2 		: '',
															line3 		: '',
															status 		: data.verificationDataStatus,
															color 		: statusI.color,
															document  	: data.documents,														
															statusIndex : statusI.index,
															displayStatus : statusI.displayStatus,
															verificationType : "EducationForm"															
														};
														break;
													case 'WorkForm' :
														var data1 = {
															line1 		: data.nameOfEmployer+", "+data.employerAddress+", "+data.employerCity+","+data.employerState+","+data.designation,
															line2 		: data.department+", "+data.typeOfEmployement,
															line3 		: data.employmentFrom+", "+data.employmentTo,
															status 		: data.verificationDataStatus,
															color 		: statusI.color,
															document  	: data.documents,														
															statusIndex :  statusI.index,
															displayStatus : statusI.displayStatus,
															verificationType : "WorkForm"
															
														};
														break;
													case 'StatutoryForm':
														var documents = [];
														if(data.proofOfDocument != ''){
															documents.push({
																"proofType" 		: data.identityType, 
																"proofOfDocument" 	: data.proofOfDocument,
																"fileName" 			: data.fileName,
																"fileExt" 			: data.fileExt,
																
															});
														}
														if(data.proofOfDocument2 != ''){
															documents.push({
																"proofType" 		: data.identityType, 
																"proofOfDocument" 	: data.proofOfDocument2,
																"fileName" 			: data.fileName2,
																"fileExt" 			: data.fileExt2,
															});
														}
														if(documents){
															var data1 = {
																line1 		: data.identityType + ' : ' + data.cardNo,
																line2 		: ' ',
																line3 		: ' ',
																status 		: data.verificationDataStatus,
																color 		: statusI.color,
																document  	: documents,														
																statusIndex :  statusI.index,
																displayStatus : statusI.displayStatus,
																verificationType : "StatutoryForm"																
															};

														}
													break;
												
													case 'ReferenceForm':
														
													var data1 = {
														line1 		: data.referralFirstName+", "+data.referralLastName+", "+data.referralMobileNum+","+data.referralEmailID+","+data.referralOrganization,
														line2 		: data.referralDesignation,
														line3 		: data.referralRelationship+","+data.referralAssociatedSinceMonths,
														status 		: data.verificationDataStatus,
														color 		: statusI.color,
														document  	: [],														
														statusIndex :  statusI.index,
														displayStatus : statusI.displayStatus,
														verificationType : "ReferenceForm"														
													};
													
													break;
													case 'CriminalRecords':
														if(data.verificationType == "permanentAddress"){
															var data1 = {
																line1 		: data.line1+","+ data.line2+","+data.line3,
																line2 		: data.landmark+","+data.city+","+data.state+","+data.country+","+data.pincode+","+data.residingFrom+","+data.residingTo,
																line3 		: "Father Name : "+ data.fatherFirstName+" "+data.fatherLastName+" ,Date of Birth : "+data.dateOfBirth,
																status 		: data.verificationDataStatus,
																color 		: statusI.color,
																document  	: data.documents,
																statusIndex : statusI.index,
																displayStatus : statusI.displayStatus,
																verificationType : "CriminalRecords"
															};
														}else if(data.verificationType == "currentAddress"){
															var data1 = {
																line1 		: data.tempLine1+","+ data.tempLine2+","+data.tempLine3,
																line2 		: data.tempLandmark+","+data.tempCity+","+data.tempState+","+data.tempCountry+","+data.tempPincode+","+data.tempresidingFrom+","+data.tempresidingTo, 
																line3 		: "Father Name : "+ data.fatherFirstName+" "+data.fatherLastName+" ,Date of Birth : "+data.dateOfBirth,
																status 		: data.verificationDataStatus,
																color 		: statusI.color,
																document  	: data.documents,
																statusIndex : statusI.index,
																displayStatus : statusI.displayStatus,
																verificationType : "CriminalRecords"
																
															};
														}
													break;
													
												}
												if(data1){
													vdata.push(data1);
												}
											}
										});
										if(vdata.length > 0){
											var minIndex = vdata.reduce((a,b)=>{
												if( a.statusIndex <= b.statusIndex){
													return a;
												}else{
													return b;
												}
											})
											if(minIndex){
												candidateData.services.push({
														vData 		: vdata,
														status    : minIndex.status, 
														// serviceId : service._id,
														serviceId : service.serviceid,
														color     : minIndex.color,
														index     : minIndex.statusIndex,
														displayStatus: minIndex.displayStatus,
												});
											}
										}
											
									}else{
										candidateData.services.push({
												// status    :'Case Received',
												status    :'-',
												// serviceId : service._id,
												serviceId : service.serviceId,
												color     : 'Bg-transparent',
												// displayStatus: "Case Received",
												displayStatus: "CR",
												// color     : 'Bg-info',
												// index     : 0,
												index     : -1,
												
										});
									}
								}else{
									candidateData.services.push({
											status    :'-',
											// status    :'Case Received',
											// serviceId : service._id,
											serviceId : service.serviceId,
											// color     : 'Bg-info',
											color     : 'Bg-transparent',	
											// displayStatus: "Case Received",										
											displayStatus: "CR",										
											// index     : 0,
											index     : -1,
											
									});
								}
							});	
						}
						/**======================================== */
					}

					if(candidateData.services.length > 0 && candidateData.candidateAssureID){
						var serviceData = candidateData.services;
						if(serviceData){
							if(serviceData.length > 0){
								serviceData.map((serviceDetails,i)=>{
									if((serviceDetails.status!= "-") && (serviceDetails.index!=-1)){
										var minIndexOrder = serviceData.reduce((a,b)=>{											
											if(a.index <= b.index){
												return a
											}else{
												return b
											}
										});
										if(minIndexOrder){
											if((minIndexOrder.index != 0) && (minIndexOrder.index != -1)){
												candidateData.order.status = minIndexOrder.status;
												// candidateData.order.displayStatus = minIndexOrder.displayStatus;
												candidateData.order.color  = minIndexOrder.color;
											}

										}
									}else{
										// candidateData.order.status = "Case Received";
										candidateData.order.status = "CR";
										// candidateData.order.displayStatus = "Case Received";
										candidateData.order.displayStatus = "CR";
										candidateData.order.color  = "Bg-info";
									}
								})
							}else{


							}
							candidateDataList.push(candidateData);
						}
						
					}

				});//EOF candidateList
			}			
		});//EOF orderList
	}
	// console.log("candidateDataList :",candidateDataList);
	var serviceLength = allServices.length;
	var colSpan       = serviceLength+5; 
	
  return {
    loading,
	services,
	allServices,
	candidateDataList,
	colSpan
  };
  
})(EmployeeStatus);
export default CandidateOrderListContainer;