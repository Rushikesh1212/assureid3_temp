import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

export default class AddressService extends TrackerReact(React.Component) {
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
    UserSession.delete("progressbarSession", 1);
    if(event.currentTarget.files[0]){
      var file = event.currentTarget.files[0];
      var fileName = file.name;
      var ext = fileName.split('.').pop();
      this.setState({"fileName": fileName}); 
      // var typeid = this.props.typeid;
      // var type = this.props.type;
      var companyAssureId = this.props.assureId;

      if(ext == 'csv'){ 
        Papa.parse( event.target.files[0], {  
          header: false,
          complete( results, file ) {
            Meteor.call( 'companyRequestCheckCSV',results.data,'AddressVerification',companyAssureId, ( error, result ) => {
              if(error){
                console.log('companyRequestCheckCSV error ',error);
                swal("Error occur CSV Upload.Please Contact concern person :",error);
              }else{
                console.log('companyRequestCheckCSV result ',result);
              }
            });
          }
        });
        
      }
    }
  }
  render(){
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeePadding">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
            <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/bulkUploadFiles/AddressVerification.csv" download>Download Template</a>
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
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">
            <input type="file" className="btn btn-info inputFiles uploadFileInput" accept=".csv" onChange={this.uploadCSV.bind(this)} />
            <p>Upload File : <span className="btn" onClick={this.inputFileChange.bind(this)}>{this.state.fileName}</span></p>
          </div>
          
        </div>
      </div>
    );
  }
}