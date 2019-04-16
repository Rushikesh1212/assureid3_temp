import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from '/imports/admin/adminDashboard/corporateManagement/api/companyProfile.js';


class ViewContract extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
      "subscription"  : {
      
      }  
    }; 
  } 
	componentDidMount() {
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }

	 }

	terminateStatus(event){
		var targetedIndex = $(event.target).attr('data-index');
		var splitTargetedIndex = targetedIndex.split("-");
		var index = splitTargetedIndex[0];
		var id    = splitTargetedIndex[1];
		console.log('index: ', index);
		swal({
			title: "Are you sure?",
			text: "You want to terminate the contract.",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, teminate it!",
			closeOnConfirm: false
			},function(){

				Meteor.call("terminateContract",index,id,(error,result)=>{
					if(result==1){
						swal("","Contrac Terminated","success");
					}
				});
			}
		)
	}
	activeInactive(event){
		event.preventDefault();
		var companyId = $(event.target).attr("data-companyid");	
		var contractIndex = $(event.target).attr("data-contractindex");
		var status = $(event.target).attr("data-status");	
		if(this.props.singleCompany){
			if(this.props.singleCompany.contract.length>0){
				var activeContractIndex  = this.props.singleCompany.contract.findIndex(x => x.contractStatus == "Active");					
				if(activeContractIndex>=0 && status=="Inactive"){
					Meteor.call("updateContractStatus",companyId,contractIndex,status,(err,res)=>{
						if(res){
							swal("Contract updated successfully!!!");
						}
					});
				}else if(activeContractIndex==-1 && status=="Active"){
					Meteor.call("updateContractStatus",companyId,contractIndex,status,(err,res)=>{
						if(res){
							swal("Contract updated successfully!!!");
						}
					});
				}else{
					swal("Only One contract can be active at a time");
				}
			}
		}
	}
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove(); 
  }
  
  render() {
  	if (!this.props.loading) {
	   return (
	    <div className="content-wrapper">
	      <section className="content-header">
	        <h1> Corporate Management </h1>
	        <ol className="breadcrumb">
	          <li>
	            <a href="#"><i className="fa fa-file-o"/> Corporate Management</a></li>
	          <li className="active">Contract</li>
	        </ol>
	      </section>
	       <section className="content">
	         <div className="row">
	           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	             <div className="box box-primary">
	                <div className="box-header with-border">
	                 <h2 className="box-title">{this.props.singleCompany.companyName+" - "+this.props.singleCompany.companyAssureID}</h2>  
	                </div>
	                <div className="box-body"> 
	                  <div className="col-lg-3 col-md-3 co-sm-3 col-xs-3">
	                    <img src={this.props.singleCompany.companyLogo ? this.props.singleCompany.companyLogo : "https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/dummy-logo.png"} className="img img-responsive singleCompanyLogo"/>
	                  </div> 
	                  <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
	                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
				            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner NOpadding">
				              <h5><b>Company Name</b></h5>
				              <p>{this.props.singleCompany.companyName ? this.props.singleCompany.companyName : "--"}</p>
				            </div> 

				        </div>
				        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
				            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner NOpadding">
				              <h5><b>Company Website</b></h5>
				              <p>{this.props.singleCompany.companyWebsite ? this.props.singleCompany.companyWebsite : "--"}</p>
				            </div>
				                    
				        </div>
				      </div>
					<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 spocDetails">
						<p className="text-center">SPOC</p>
						<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <table className="table table-bordered table-striped table-hover">
                          <thead>
                            <tr className="tableHeader">
                              <th> Name </th>
                              <th> Email </th>
                              <th> Contact Number </th>
                              <th> Designation </th>  
                              <th> Address </th>  
                            </tr>
                          </thead>
                          <tbody>
                            { this.props.accessArray ?
                              this.props.accessArray.length>0 ?
                              this.props.accessArray.map((accessData,index)=>{
                                return(
                                  <tr key={index}>
                                      <td>{accessData.accessPersonName} </td>			                                  
                                      <td>{accessData.address}</td>			
                                      <td>{accessData.accessPersonContact} </td>			
                                      <td>{accessData.accessPersonDesignation} </td>			
                                      <td>{accessData.accessPersonAddress ? accessData.accessPersonAddress : "-"} </td>			
                                  </tr>
                                )
                              })
                              
                              :
                              <tr>
                                <td></td>		
                                <td></td>			
                                <td>SPOC not yet added</td>			
                                <td></td>		
                                <td></td>		
                              </tr>
                             :
                             <tr>
                                <td></td>		
                                <td></td>			
                                <td>SPOC not yet added</td>			
                                <td></td>		
                                <td></td>		
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
					</div>

					<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 ">
	                  {
	                    this.props.singleCompany.contract ? 
   										  
							    		 <table className="table table-bordered table-stripped servicesTable">
							    		   <thead className="table-head">
							    		     <tr> 
							    		       <th>Contract Number</th>
							    		       <th>Service/Package Name</th>
							    		       <th>Scope of Work document</th>
							    		       <th>Pricing document</th>
							    		       <th>Authentication Letter</th>
							    		       <th>Valid From</th>
							    		       <th>Valid To</th>
							    		       <th>Actions</th>
							    		       <th>Active/InActive</th>
							    		     </tr>
							    		   </thead>
							    		   {this.props.singleCompany.contract.length >0 ?
								    		   <tbody>
										    		{this.props.singleCompany.contract.map((contract,index)=>{
		   										    	return(
		   										    		<tr key={index}>
		   										    		  <td> {index+1}</td>
		   										    		  <td> 
		   										    		    <ul className="noLRPad">
		   										    		     {contract.serviceLevelAgreement.map((serviceLevelAgreement,i)=>{
																					  return(
                                              serviceLevelAgreement.value == true ?
																					       <div key={i}>{serviceLevelAgreement.Name}</div>	
																					     :
																					     null
																					      
																					  );
		   										    		      })}
		   										    		    </ul>
		   										    		  </td>
		   										    		  <td> 
																			 {
																				 contract.scopeOfWorkDoc ?
																					<a href={contract.scopeOfWorkDoc} download>
																						<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
																					</a>
																					:
																					<div> No Document Availabel</div>
																			 }
			   										    		 
		   										    		  </td>
		   										    		  <td>
		   										    		    <a href={contract.pricingDoc} download>
								                      	<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
								                      </a>
		   										    		  </td>
		   										    		  <td>
		   										    		    <a href={contract.authenticationLetterDoc} download>
								                      	<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
								                      </a>
		   										    		  </td>
		   										    		  <td>
		   										    		     {moment(contract.validFrom).format("DD MMM YYYY")}
		   										    		  </td>
		   										    		  <td>{moment(contract.validTo).format("DD MMM YYYY")}</td>
		   										    		  <td> 
                                        <a >
                                          <i className="fa fa-eye viewBtn" title="View Contract" data-toggle="modal" data-target={"#showContract-"+index}></i>
                                        </a>
                                        <div id={"showContract-"+index} className="modal fade" role="dialog">
																				  <div className="modal-dialog">
																				    <div className="modal-content">
																				      <div className="modal-header">
																				        {/* <button type="button" className="close" data-dismiss="modal">&times;</button> */}
																				      </div>
																				      <div className="modal-body col-lg-12 col-sm-12 col-md-12 col-xs-12">
																				        <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" key={index}>
																								{
																									contract.contractStatus =="Active"?
																				 						<button className="btn btn-danger pull-right" data-index={index+"-"+this.props.singleCompany._id} onClick={this.terminateStatus.bind(this)}>Terminate</button>
																									:
																									 null
																									 
																								}
															                    <h4><b>Contract Number {index+1}</b></h4>
															                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center"> 
																                    <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap"> 																			 						
																											<h5><b>Scope Of Work document</b></h5>
																											<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod Scope Of Work document">
																												<a href={contract.scopeOfWorkDoc} download>
																													<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
																												</a>
																											</div>
																										</div>
															                    </div>
															                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center"> 
																										<div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap"> 																			 						
																											<h5><b>Pricing document</b></h5>
																											<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod pricing document">
																												<a href={contract.pricingDoc} download>
																													<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
																												</a>
																											</div>
																											</div>
															                    </div>
															                    <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center"> 
																										<div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap"> 																			 						
																											<h5><b>Authentication Letter document</b></h5>
																											<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod Authentication Letter">
																												<a href={contract.authenticationLetterDoc} download>
																													<i className="fa fa-file-text-o fa-3x" aria-hidden="true"></i>
																												</a>
																											</div>
																				 						</div>
															                    </div>
															                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerPadding ">
															                    	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 contractWrapPLZero">																				 						
															                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contractBorder">																				 						
																											<h5><b>Contract Description</b></h5>
																											<p>{contract.contractDescription}</p>
																										</div>
																										</div>
																										<div className = "col-lg-6 col-md-6 col-sm-6 col-xs-6 contractWrapPRZero">
															                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contractBorder ">																				 						
																										
																											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLRPad">
																											<h5><b>Valid From</b></h5>
																											<p>{moment(contract.validFrom).format("DD MMM YYYY")}</p>
																											</div>
																											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLRPad">
																												<h5><b>Valid To</b></h5>
																												<p>{moment(contract.validTo).format("DD MMM YYYY")}</p>
																											</div>
																										</div>
																										</div>
															                    </div>
															                    
															                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerPadding">
															                      <table className="table table-bordered table-stripped">
															                        <thead>
															                          <tr>
															                            <th className="text-center">Service/Package Name</th>
															                            <th className="text-center">TAT</th>
															                          </tr>
															                        </thead>
															                        {
												                                contract.serviceLevelAgreement ? 
												                                  contract.serviceLevelAgreement.length > 0 ?
												                                    <tbody>
											                                        {contract.serviceLevelAgreement.map((agreement,index)=>{
											                                          return(
																																	agreement.value == true ?

																																		<tr key={index}>
																																			<td>{agreement.Name}</td>
																																			<td>{agreement.TAT} Days</td>
																																		</tr>
																																	:
																																	null
											                                            );
											                                         })
											                                        }
												                                    </tbody>
												                                 :
												                                  <tbody>
												                                      <tr>
												                                        No Data Available
												                                      </tr>
												                                    </tbody>
												                                  :
												                                  <tbody>
												                                      <tr>
												                                        No Data Available
												                                      </tr>
												                                  </tbody>
												                                }
															                      </table>
															                    </div>

															                  </div>
   										    		
																				      </div>
																				      <div className="modal-footer">
																				        <button type="button" className="btn btnBgColor" data-dismiss="modal">Close</button>
																				      </div>
																				    </div>

																				  </div>
																				 </div>

                                        <a href={"/admin/AddNewContract/"+this.props.singleCompany._id+"/"+index}>
                                          <i className="fa fa-pencil viewBtn" title="Edit"></i>
                                        </a>
		   										    		  </td>
																		<td>
																			<button type="submit" data-contractindex={index} data-companyid ={this.props.singleCompany._id} className={contract.contractStatus =="Active" ? "btn btn-info" : "btn btn-muted"} data-status={contract.contractStatus =="Active"? "Inactive":"Active"} title={contract.contractStatus == "Active" ? "Click to Inactive contract" : "Click to active contract"} onClick={this.activeInactive.bind(this)}>{contract.contractStatus == "Active" ? "Active" : "In Active"}</button>           
																		</td>
		   										    		</tr>
                                );
		   										    })
										    		 }
								    		   </tbody>
	 										  :
	 										  <tbody>
	                        <tr>No Data Available</tr>
											    </tbody>
								    		 }
							    		 </table>
	                    :
	                    null
	                  }
	                  
	                </div>
	                </div>
	             </div>
	            </div>
	         </div>
	       </section>
	    </div>
	    );
	  }else{
	  	return(
	  		<span>Loading</span>
	  		);
	  }
  } 
}
ViewOfContractContainer = withTracker(({params}) => {
    var assureID        = FlowRouter.getParam('assureId');
    const postHandle    = Meteor.subscribe("companyProfileData",assureID);
    const singleCompany = CompanyProfile.findOne({"companyAssureID":assureID})||{};
    if(singleCompany){
	    const userHandle  = Meteor.subscribe('userData',singleCompany.userId);      
	    const userDetails = Meteor.users.findOne({'_id':singleCompany.userId});
	    if(userDetails){
	      var accessArray   =  userDetails.profile.authorizedPerson;  
	    }
	}
    const loading       = !postHandle.ready();
    return {
      loading,
      singleCompany,
      accessArray
    };
})(ViewContract);
export default ViewOfContractContainer;