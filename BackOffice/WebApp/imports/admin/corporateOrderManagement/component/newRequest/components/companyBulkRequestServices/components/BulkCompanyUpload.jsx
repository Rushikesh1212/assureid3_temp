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
      "failedList"     : [],
      "subscription" : {
      } 
    }
  }  
  inputFileChange(event){ 
    event.preventDefault();
    $(event.target).parent().siblings('.inputFiles').click();
  }
  componentWillMount(){
    this.setState({
      [`serviceid-${this.props.serviceid}`] : '',
      [`servicename-${this.props.serviceid}`] : 'Choose File',
    },()=>{
      // console.log("serviceid :",this.state[`serviceid-${this.props.serviceid}`]);
     // console.log("serviceid :",this.state[`servicename-${this.props.serviceid}`]);
    });

  }
  componentWillUnmount(){
    this.setState({
      [`serviceid-${this.props.serviceid}`] : '',
      [`servicename-${this.props.serviceid}`] : 'Choose File',
    });
  }
  uploadCSV(event){
    event.preventDefault();    
    this.setState({
      [`serviceid-${this.props.serviceid}`] : event.target.value,
    },()=>{
      console.log("serviceid :",this.state[`serviceid-${this.props.serviceid}`]);
    })
    if(event.currentTarget.files[0]){ 
      var file     = event.currentTarget.files[0];
      var fileName = file.name;
      var ext      = fileName.split('.').pop();
      
      var serviceRequired = this.props.serviceRequired;
      var corporatDetails = this.props.corporatDetails;
      var serviceid       = this.props.serviceid;
      if (corporatDetails) { 
        var corporateOrderId = corporatDetails._id;
      }
      
      if(ext == 'csv'){  
       let ref = this; 
       ref.setState({
        [`servicename-${serviceid}`] : fileName,
       });
        Papa.parse(event.target.files[0], {
          header: false,
          complete( results, file ) {
            Meteor.call('companyRequestCheckCSV',results.data,corporateOrderId,serviceRequired,serviceid,( error, result ) => {
              if(error){
                console.log('companyRequestCheckCSV error ',error);
                // swal("whie upload company in bulk,Error occur CSV Upload.Please Contact concern person :",error);               
              }else{
                console.log('companyRequestCheckCSV result ',result); 
                if (result) {
                  ref.setState({
                    [`serviceid-${serviceid}`] : '',
                  })
                  if(result == 'Data is not in appropriate Format.1'){
                    swal("Please use the given csv format. Coloum's Heading are missmatched.");
                  }else if (result.failed > 0) { 
                    ref.props.updatefunctionfailedList(result.faildList);
                    ref.setState({"failedList" : result.faildList});
                    // swal("Please check Records in rows number:"+ result.faildList +"","Data is not in the proper format","error");
                  }else if(result == 'Please check with the Admin. It seams there is some issue with the service'){
                    swal("Please check with the Admin. It seams there is some issue with the service.");
                  }else if(result == 'No data is available'){
                    swal("It seams there is no data to process.");
                  }else if(result.candidateNotListed.count > 0){
                    swal("Candidate in the Row "+result.candidateNotListed.notListed+" is not listed in the order. Please check the details of the candidate and upload next time");
                  }else{
                    ref.props.updatefunctionfailedList([]);
                    ref.setState({"failedList" : []});
                  }
                  // this.setState({
                  //    "failedList"     : [],
                  // });
                 
                }
              }
            });
            // event.target.files[0].reset();
            // setTimeout(()=>{                       
            //   UserSession.delete("progressbarSession", 0);
            // }, 8000);
          }
        }); 
      }
    }
  }
  
  // getUploadCSVPercentage(corporateOrderId,serviceid){
  //   var getPercernt = UserSession.get(corporateOrderId+"-"serviceid,Meteor.userId());
  //   // console.log("getPercernt",getPercernt);
  //   var allPercernt = UserSession.get("all"+corporateOrderId+"-"serviceid,Meteor.userId());
  //   // console.log("allPercernt",allPercernt);
  //   var uploadProgressPercent = (parseInt(getPercernt)/parseInt(allPercernt))*100;
  //   // console.log("uploadProgressPercent",uploadProgressPercent);
  //   if(uploadProgressPercent){
  //     var percentVal = parseInt(uploadProgressPercent);
  //     if(percentVal){   
  //       var styleC = {
  //         width:percentVal + "%",
  //         display:"block",
  //       }
  //       var styleCBar = {
  //         display:"block",
  //         marginTop:5,
  //       }
  //     }
  //     if(!percentVal){
  //       var percentVal = 0;
  //       var styleC = {
  //         width:0 + "%",
  //         display:"none",
  //       }
  //       var styleCBar = {
  //         display:"none",
  //         marginTop:5,
  //       }
  //     }

  //    if(parseInt(percentVal)==100){
  //       setTimeout(()=>{ 
  //           UserSession.delete(corporateOrderId+"-"serviceid,Meteor.userId()),
  //           UserSession.delete("all"+corporateOrderId+"-"serviceid,Meteor.userId())
  //       }, 3000);
  //    }
  //     return (
  //       <div className="progress"  style= {styleCBar}>
  //         <div className="progress-bar progress-bar-striped active" role="progressbar"
  //         aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
  //           {percentVal} %
  //         </div>
  //       </div>
  //     );
  //   } 
  // }

  showErrorList(faildList){
    return <div>
     <p className="text-danger text-left col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">Error In following fields.</p>
     <table className="table empVerifListTable table-striped table-bordered">
       <thead>
         <tr>
          <th className="text-center">Row No.</th>
          <th className="text-center">Column Name</th>
          <th className="text-center">Value</th>
          <th className="text-center">Message</th> 
         </tr>
       </thead>
       <tbody>
         {faildList.map((faildList,index) =>{
            return <tr key={index}>
                     <td className="text-left">{faildList.rowIndex}</td>
                     <td className="text-left">{faildList.columnName}</td>
                     <td className="text-left">{faildList.columnValue}</td>
                     <td>
                     {
                        faildList.columnName == "FirstName" || faildList.columnName == "LastName" ?
                          faildList.columnName + "only contains string."                     
                        :
                        faildList.message ?
                          faildList.message
                        :
                        "Invalid Data"
                     }
                     </td>
                  </tr>;
            })
         }
       </tbody>
     </table>
    </div>
  }

  render() {
    console.log("failedList",this.state.failedList);
    if(Meteor.userId()) 
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeePadding">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeContent">
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 bulkEmployeeImg">
            <a href={this.props.serviceRequired == "AddressForm" ? "https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/AddressVerification.csv" 
            : this.props.serviceRequired == "EducationForm"?"https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/EducationVerification.csv" 
            : this.props.serviceRequired == "WorkForm" ?"https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/EmployeementVerification.csv" 
            : this.props.serviceRequired == "StatutoryForm"? "https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/IdentityVerification.csv"
            : this.props.serviceRequired == "ReferenceForm"? "https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/ReferenceVerification.csv"
            : this.props.serviceRequired == "CriminalRecords"? "https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/CriminalCourtVerification.csv"
            :""} download>
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
            <span>Download Template</span>
            </a>
          </div>
          <div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 bulkEmployeeVerif">
            <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <li>Please use attached file format to bulkupload your employee details into this system.</li>
              <li>Please do not change the Heading of following file.</li>
              <li>File format must be *.csv</li>
              <li>Following is the format of .csv file</li>
              <li>Aadhar Number must be in format xxxx xxxx xxxx (e.g. - 1234 5678 9021)</li>
              <li>Documents as per the SOW and corresponding candidate any order.</li>
              <li>Please refer following file for the reference <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/Mandatory+Fields+-+AssureID.xlsx" download>Guidelines</a>.</li>
            </ul>
          </div>  
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">
          <input type="file" className="btn btn-info inputFiles uploadFileInput" value={this.state[`serviceid-${this.props.serviceid}`]} accept=".csv" onChange={this.uploadCSV.bind(this)} />
          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 text-right">Upload File :</div>
          <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7"> <button type="button" className="btn btn-info uploadBtn col-lg-5 col-md-5 col-sm-5 col-xs-5" onClick={this.inputFileChange.bind(this)}>{this.state[`servicename-${this.props.serviceid}`]}</button></div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress basicProgressDiv">
          {/*this.getUploadCSVPercentage(this.props.corporatDetails._id,this.props.serviceid)*/}
        </div> 
          {
            this.state.failedList ?
              this.state.failedList.length > 0 ?
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile"> 
                  {this.showErrorList(this.state.failedList)}
                </div>
              :
                null
            :
            null
          }
{/*        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile NOpadding">
           <CompanyUploadedData  urlValue={this.props.urlValue ? this.props.urlValue : ""} typeId={this.props.typeid ? this.props.typeid : ""} assureId={this.props.assureId ? this.props.assureId : ""} serviceRequired={this.props.serviceRequired}/>        
        </div>*/}
      </div> 
    );
  }
}