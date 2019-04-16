import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class CorporateDocuments extends TrackerReact(Component) {

        constructor(){
            super();
        }

        render(){
            console.log("this.props.corporatedetails :",this.props.corporatedetails);
            return(
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 corporateDetailsBlock">
                    <h3 className="docTitle col-lg-5 col-md-5 col-sm-12 col-xs-12"><strong>Corporate Submitted Documents</strong></h3>
                    
                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 pull-right">
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <a href={this.props.corporatedetails? this.props.corporatedetails.candidateListCSV.link : null} download={this.props.corporatedetails.candidateListCSV.fileName} title="Download candidate list">
                                <img className= "bulkEmployeeDisplayImg" src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />                            
                            </a>
                        </div>    
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                            <a href={this.props.corporatedetails && this.props.corporatedetails.documentUploads ? this.props.corporatedetails.documentUploads.docsLink : null} download title="Download proof documents">                        
                             <img className= "bulkEmployeeDisplayImg" src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/zip-file-format-489644.png" />
                            </a>
                        </div>
                        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 pull-right">
                            <i className="fa fa-caret-right expandCursor pull-right" title="Click to view candidate list" aria-hidden="true" data-toggle="collapse" data-target="#documentId"></i>                            
                        </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 collapse" id="documentId">
                        {/*<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                            <h5><b>Candidate List</b></h5>
                            <div className="col-lg-2 col-lg-offset-0 col-md-2 col-md-offset-0 col-sm-12 col-xs-12 bulkEmployeeImg">
                            <a href={this.props.corporatedetails? this.props.corporatedetails.candidateListCSV.link : null} download title="download csv">
                                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
                            </a> 
                            </div>
                        </div>
                        <div className="col-lg-2">
                            <h5><b>Proof Documents</b></h5>
                            <div className="col-lg-2 col-lg-offset-0 col-md-2 col-md-offset-0 col-sm-12 col-xs-12 bulkEmployeeImg">
                            <a href={this.props.corporatedetails && this.props.corporatedetails.documentUploads ? this.props.corporatedetails.documentUploads.docsLink : null} download title="download documents">
                                
                                <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/zip-file-format-489644.png" />
                            </a> 
                            </div>
                        </div>*/}
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h5><b>Candidate List</b></h5>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive">
                               <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email ID</th>
                                        <th>Mobile</th>  
                                        <th>Aadhar Number</th> 
                                        <th>Gender</th>                     
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.corporatedetails.orderDetails && this.props.corporatedetails.orderDetails.length > 0 ?
                                            this.props.corporatedetails.orderDetails.map((orderDetails,index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td>{orderDetails.candidateDetails.candidateFirstName} {orderDetails.candidateDetails.candidateLastName}</td>
                                                        <td>{orderDetails.candidateDetails.candidateEmailId}</td>
                                                        <td>{orderDetails.candidateDetails.candidateMobile}</td>
                                                        <td>{orderDetails.candidateDetails.candidateAadharNo ? orderDetails.candidateDetails.candidateAadharNo : "-"}</td> 
                                                        <td>{orderDetails.candidateDetails.candidateGender}</td>
                                                    </tr>     
                                                )
                                            })
                                        :
                                        <tr>
                                        <td></td>
                                        <td>No Data Availabel</td>
                                        <td></td> 
                                    </tr>     
                                    }
                                   
                                </tbody>
                            </table>

                            </div>
                        </div>

                    </div>
                </div>
            )

        }       
}


