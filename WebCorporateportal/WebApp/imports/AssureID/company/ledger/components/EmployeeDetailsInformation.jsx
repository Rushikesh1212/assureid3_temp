import React,{Component} from 'react';
import {render} from 'react-dom'; 
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class EmployeeDetailsInformation extends TrackerReact(Component){
    constructor(props){
        super(props); 
    }

    render(){
        return(
            <div className="modal fade employeedetailsInfo" id={this.props.modalid} role="dialog">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Information Details</h4>
                    </div>
                    <div className="modal-body">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>Information</th>
                            <th>Document Submited</th>
                            <th>Status</th>
                            {/* <th>Email</th> */}
                        </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.verifdata && this.props.verifdata.length>0 ?
                                    this.props.verifdata.map((verificationData,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>{verificationData.line1}<br/>{verificationData.line2}<br/>{verificationData.line3}</td>
                                                <td>
                                                    {
                                                        verificationData.document && verificationData.document.length>0 ?
                                                            verificationData.document.map((documentData,ind)=>{
                                                                // <span key={ind}>{documentData.proofOfDocument}</span>
                                                                return(
                                                                    <a href={documentData.proofOfDocument} download key={ind}>
                                                                        <img src={documentData.proofOfDocument} className=" col-lg-offset-2 img-responsive addressImage img-thumbnail"/>
                                                                    </a>
                                                                )
                                                                
                                                            })
                                                        :
                                                        verificationData.verificationType == "ReferenceForm" ?
                                                            <span>-</span>

                                                        :

                                                        <span>Document Not Available</span>
                                                        
                                                    }
                                                </td>
                                                {/* <td className={verificationData.color}>{verificationData.status}</td> */}
                                                <td>
                                                    <div className={"col-lg-9 col-lg-offset-3 col-md-9 col-md-offset-3 col-sm-12 col-xs-12 orderStatusBlock "+verificationData.color}>
                                                        {verificationData.displayStatus ? verificationData.displayStatus : "-"}
                                                    </div>
                                                </td>
                                                
                                                
                                            </tr>
                                        )
                                    })
                                    
                                :
                                <tr>
                                    <td></td>
                                    <td>Document Required</td>
                                    <td></td>
                                </tr>
                            }
                       
                        {/* <tr>
                            <td>Mary</td>
                            <td>Moe</td>
                            <td>mary@example.com</td>
                        </tr>
                        <tr>
                            <td>July</td>
                            <td>Dooley</td>
                            <td>july@example.com</td>
                        </tr> */}
                        </tbody>
                    </table>

                   
                    </div>
                    <div className="modal-footer">
                    {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button> */}
                    </div>
                </div>
                
                </div>
            </div>
        )

    }
}