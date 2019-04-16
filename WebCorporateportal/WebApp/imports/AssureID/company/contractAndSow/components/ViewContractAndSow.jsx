import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import { CompanyProfile } from "/imports/AssureID/company/profile/api/companyProfile.js";

class ViewContractAndSOW extends TrackerReact(Component){
   constructor(props){
    super(props); 
    this.state ={  
      "subscription" : { 
      } 
    };
  }
  componentDidMount(){      
    $('html, body').scrollTop(0);
  }
  render(){
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 visitedHeight companyVerifColor noProfilePadding">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderPage">
              <h3 className="companyVieworderNo">Agreement</h3>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderfont">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive outerpaddingForMobile ">
                <table className="table companyViewTable contractTable table-bordered table-striped">
                  <thead>
                    <tr>
                       <th>Contract Number</th>
                       <th>Service/Package Name</th>
                       <th>Valid From</th>
                       <th>Valid To</th>
                       <th>Actions</th>
                    </tr>
                  </thead>
                     {this.props.singleCompany.contract ?
                        this.props.singleCompany.contract.length >0 ?
                         <tbody className="text-left">
                          {this.props.singleCompany.contract.map((contract,index)=>{
                              return(
                                <tr key={index}>
                                  <td> {index+1}</td>
                                  <td> 
                                    <ul style={{"listStyle": "none"}}>
                                     {contract.serviceLevelAgreement.map((serviceLevelAgreement,i)=>{
                                          return(
                                            serviceLevelAgreement.value == true ?
                                               <li key={i}>{serviceLevelAgreement.Name}</li>  
                                             :
                                             null
                                              
                                          );
                                      })}
                                    </ul>
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
                                              <h4><b>Contract Number {index+1}</b></h4>
                                            </div>
                                            <div className="modal-body col-lg-12 col-sm-12 col-md-12 col-xs-12">
                                              <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" key={index}>
                                                
                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center">                                                   <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap">                                                  
                                                    <h5><b>Scope Of Work document</b></h5>
                                                    <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod Scope Of Work document">
                                                      <a href={contract.scopeOfWorkDoc} download>
                                                        <i className="fa fa-file-text-o fa-3x fileIcon" aria-hidden="true"></i>
                                                      </a>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center"> 
                                                  <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap">                                                  
                                                    <h5><b>Pricing document</b></h5>
                                                    <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod pricing document">
                                                      <a href={contract.pricingDoc} download>
                                                        <i className="fa fa-file-text-o fa-3x fileIcon" aria-hidden="true"></i>
                                                      </a>
                                                    </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-center"> 
                                                  <div className="col-lg-12 col-md-12 col-sm-6 col-xs-6 contractWrap">                                                  
                                                    <h5><b>Authentication Letter document</b></h5>
                                                    <div className="col-lg-12 col-sm-12 col-md-12 col-xs-12" title="Downlaod Authentication Letter">
                                                      <a href={contract.authenticationLetterDoc} download>
                                                        <i className="fa fa-file-text-o fa-3x fileIcon" aria-hidden="true"></i>
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
                                  </td>
                                </tr>
                              );
                            })
                           }
                         </tbody>
                        :
                         <tbody>
                          <tr>No Contract Available</tr>
                          </tbody>
                      :
                       <tbody>
                          <tr>No Contract Available</tr>
                        </tbody>
                     }
                </table>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyViewDiv companyOrderPage noProfilePadding" style={{height : '36'+'px'}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ViewContractAndSOWContainer = withTracker(({params}) => {
    var assureID        = FlowRouter.getParam('assureId');
    const postHandle    = Meteor.subscribe("companyProfileData",assureID);
    const singleCompany = CompanyProfile.findOne({"companyAssureID":assureID})||{};
    // 
    const loading       = !postHandle.ready();
    return {
      loading,
      singleCompany,
    };
})(ViewContractAndSOW);
export default ViewContractAndSOWContainer