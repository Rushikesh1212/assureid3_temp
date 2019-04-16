import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra'; 
import CompanyUploadedData from './CompanyUploadedData.jsx';

export default class BulkCompanyUpload extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "fileName" : "Choose File",
      "subscription" : {
      } 
    }
  } 
  inputFileChange(event){
    event.preventDefault();
    $(event.target).parent().siblings('.inputFiles').click();
  }
  uploadCSV(event){
    event.preventDefault();    
    UserSession.delete("progressbarSession",1);
    if(event.currentTarget.files[0]){ 
      var file     = event.currentTarget.files[0];
      var fileName = file.name;
      var ext      = fileName.split('.').pop();
      this.setState({"fileName": fileName}); 
      var typeid   = this.props.typeid;
      var assureId = this.props.assureId;
      var serviceRequired = this.props.serviceRequired;
      var contractId      = this.props.contractId;
      if(ext == 'csv'){  
        Papa.parse(event.target.files[0], {
          header: false,
          complete( results, file ) {
            Meteor.call('companyRequestCheckCSV',results.data,assureId,typeid,serviceRequired,contractId,( error, result ) => {
              if(error){
                console.log('companyRequestCheckCSV error ',error);
              }else{
                console.log('companyRequestCheckCSV result ',result);
                if (result) {
                  if (result.failed > 0) {
                    
                    swal("Please check Records in rows number:"+ result.faildList +"","Data is not in the proper format","error");
                  }
                }
              }
            });
            setTimeout(()=>{                       
              UserSession.delete("progressbarSession", 0);
            }, 8000);
          }
        });
      }
      // this.setState({"fileName": "Choose File"});
    }
  }
 
  getUploadCSVPercentage(){
    var getPercernt = UserSession.get("progressbarSession",1);
    var allPercernt = UserSession.get("allProgressbarSession",1);
    var uploadProgressPercent = (getPercernt/allPercernt)*100;
    if(uploadProgressPercent){
      var percentVal = parseInt(uploadProgressPercent);
      if(percentVal){  
        var styleC = {
          width:percentVal + "%",
          display:"block",
        }
        var styleCBar = {
          display:"block",
          marginTop:5,
        }
      }
      if(!percentVal){
        var percentVal = 0;
        var styleC = {
          width:0 + "%",
          display:"none",
        }
        var styleCBar = {
          display:"none",
          marginTop:5,
        }
      }

      return (
        <div className="progress"  style= {styleCBar}>
          <div className="progress-bar progress-bar-striped active" role="progressbar"
          aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
            {percentVal} %
          </div>
        </div>
      );
    } 
  }

  render() {
    if(Meteor.userId())
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeePadding">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
            <a href={this.props.serviceRequired == "AddressForm" ? "https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/AddressVerification.csv" : this.props.serviceRequired == "EducationForm"?"https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/EducationVerification.csv":this.props.serviceRequired == "WorkForm" ?"https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/EmployeementVerification.csv" :""} download>Download Template</a>
          </div>
          <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <li>Please use attached file format to bulkupload your employee details into this system.</li>
              <li>Please do not change the Heading of following file.</li>
              <li>File format must be *.csv</li>
              <li>Following is the format of .csv file</li>
              <li>Aadhar Number must be in format xxxx xxxx xxxx (e.g. - 1234 5678 9021)</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">
          <input type="file" className="btn btn-info inputFiles uploadFileInput" accept=".csv" onChange={this.uploadCSV.bind(this)} />
          <p>Upload File : <span className="btn" onClick={this.inputFileChange.bind(this)}>{this.state.fileName}</span></p>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress basicProgressDiv">
          this.getUploadCSVPercentage()
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile noProfilePadding">
           <CompanyUploadedData  urlValue={this.props.urlValue ? this.props.urlValue : ""} typeId={this.props.typeid ? this.props.typeid : ""} assureId={this.props.assureId ? this.props.assureId : ""} serviceRequired={this.props.serviceRequired}/>        
        </div>
      </div> 
    );
  }
}