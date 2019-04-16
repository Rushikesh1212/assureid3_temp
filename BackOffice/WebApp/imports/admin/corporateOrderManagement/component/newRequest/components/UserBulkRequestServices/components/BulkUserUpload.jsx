import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import EmployeeVerificationTable from './EmployeeVerificationTable.jsx';

export default class BulkUserUpload extends TrackerReact(Component) {
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
    UserSession.delete("progressbarSession", Meteor.userId());
    if(event.currentTarget.files[0]){
      var file = event.currentTarget.files[0];
      var fileName = file.name;
      var ext = fileName.split('.').pop();
      this.setState({"fileName": fileName}); 
      var typeid = this.props.typeid;
      var type = this.props.type;
      var assureId = this.props.assureId;
    
      if(ext == 'csv'){ 
        if (typeid) {
          Papa.parse(event.target.files[0], {
            header: true,
            complete( results, file ) {
               // console.log('results',results);
              Meteor.call( 'insertBulkOrderCompany',results.data,typeid,type,assureId, ( error, result ) => {
                if (error){
                  console.log("error inside insertBulkOrderCompany = ",error.reason);
                  swal(" Something went wrong,Please Contact Concern Person !! ",error.reason);
                }else {
                  // console.log("result = ",result);

                  //  if(result == true){
                  //   swal({
                  //       position : 'top-right',
                  //       type     : 'success',
                  //       title    : 'Data Added Successfully',
                  //       showConfirmButton : false,
                  //       timer    : 1500
                  //   });  
                  //   // console.log("result",result);
                   
                  // }else{
                  //   swal("Oops..!","Something went wrong","error");
                  // }
                 
                }
              });
              setTimeout(()=>{                       
                UserSession.delete("progressbarSession", Meteor.userId());
              }, 8000);
            }
          });
        }else{
          swal("Service not selected","Please select from above Services","error");
        }
        
      }else{
          swal("Invalid file type","Only .csv file will be uploaded","error");
      }
      // this.setState({"fileName": "Choose File"});
    }
  }
  getUploadCSVPercentage(){
    var getPercernt = UserSession.get("progressbarSession",Meteor.userId());
    var allPercernt = UserSession.get("allProgressbarSession",Meteor.userId());
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
            <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/bulkUploadFiles/company.csv" download>Download Template</a>
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
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
          <table className="table empVerifListTable">
            <thead>
              <tr>
                <th className="text-center">First Name</th>
                <th className="text-center">Last Name</th>
                <th className="text-center">Email ID</th>
                <th className="text-center">Mobile No</th>
                <th className="text-center">Aadhar Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
              </tr>
              <tr>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
              </tr>
              <tr>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
                <td style={{backgroundColor : '#'+'f6f6f7'}}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">
          <input type="file" className="btn btn-info inputFiles uploadFileInput" accept=".csv" onChange={this.uploadCSV.bind(this)} />
          <p>Upload File : <span className="btn" onClick={this.inputFileChange.bind(this)}>{this.state.fileName}</span></p>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress basicProgressDiv">
          {this.getUploadCSVPercentage()}
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
          <EmployeeVerificationTable key="manualEmployeeVerif" urlValue={this.props.urlValue ? this.props.urlValue : ""} type={this.props.type ? this.props.type : ""} typeId={this.props.typeid ? this.props.typeid : this.state.typeid} assureId={this.props.assureId ? this.props.assureId : ""} />
       </div>
      </div> 
    );
  }
} 