import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Services } from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { CompanyProfile } from '/imports/AssureID/company/profile/api/companyProfile.js';
import { TempCompanyDocuments } from '/imports/AssureID/company/companyNewRequest/api/CorporateOrder.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {TempCorporateOrder} from '/imports/AssureID/company/companyNewRequest/api/TempCorporateOrder.js';
import CandidateBulkUploadTable from './CandidateBulkUploadTable.jsx';
import UserUploadRequest from '/imports/AssureID/company/companyNewRequest/components/UserUploadRequest.jsx';
import UserManualRequest from '/imports/AssureID/company/companyNewRequest/components/UserManualRequest.jsx';
class CompanyUploadRequest extends TrackerReact(Component){
	constructor(){ 
    super(); 
    this.state ={ 
      "fileName"          : "Choose File",
      "csvFileName"       : "Choose File",
      "uploadingFileName" : "",
      "csvuploadingFileName" : "",
      "inputcompanyCSV"      : "", 
      "inputDocument"       : "",
      "numOfCandidate"    : 0, 
      "candidateList"     : [],
      "faildList"         : [],
      "subscription" : {
      } 
    } 
   // this.showErrorList = this.showErrorList.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fileName     : (nextProps.uploadCompanyDocumentProgressbar == 100 || nextProps.uploadCompanyDocumentProgressbar == null ) ? 'Choose File' : 'Please wait..' ,
      csvFileName  : (nextProps.uploadCompanyCSVProgressbar == 100 || nextProps.uploadCompanyCSVProgressbar == null ) ? 'Choose File' : 'Please wait..' ,
    });    
  }
  componentDidMount() {
  } 
  inputFileChange(event){
    event.preventDefault();
    $(event.currentTarget).siblings().click();
  }
  uploadProofDocs(event){
    event.preventDefault(); 
    // console.log("Inside uploadProofDocs");
    this.setState({
      "inputDocument" : event.target.value,
    })
    var url = this.props.url;
    let self = this;    
      if (event.currentTarget.files && event.currentTarget.files[0]) {
         var file       = event.currentTarget.files[0]; 
         var fileName   = file.name;
         var fileSize   = file.size;
         var size       = 10737418240; 
         var uploadType = $(event.currentTarget).attr('data-uploadtype');
         var ext        = fileName.split('.').pop(); 
         if(ext == 'pdf' || ext == 'zip'){
          if (file) {       
            if (fileSize < size) {
              Session.set("uploadCompanyDocumentProgressbar",0);
              this.setState({
                "fileName" : "Please wait..",
                "uploadingFileName" : fileName,
              })
              addCompanyDocsToS3Function(file,self,uploadType,url);
              this.setState({
                "inputDocument" : '',
              })
             }else{ 
              swal({
                title:'abc',
                text: "Document size limit is upto 10gb",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#666',
                // cancelButtonColor:'#d33',
                confirmButtonText: 'Ok'
              });
              this.setState({
                "inputDocument" : '',
              })
           } 
          }  
         }else{
          swal({
            title:'abc',
            text: "Please Submit the documents either in zip or pdf format",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'
          });
            this.setState({
              "inputDocument" : '',
            })
         }
      }  

  }
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
  uploadCSV(event){
    event.preventDefault();
     this.setState({
      inputcompanyCSV : event.target.value,
    });   
    var formValue  = {
      companyAssureID : this.props.assureId,
      services        : this.props.validServiceArray,
      contractId      : this.props.contractId,
      numOfCandidate  : 0, 
      listOfCandidates : [],
      url              : this.props.url,
    }
    let self = this;  
    var file = '';

    if(event.currentTarget.files[0]){ 
      var dataImg = event.currentTarget.files[0]; 
      var reader  = new FileReader();       
       reader.onload = function (e) {         
      };      
      reader.readAsDataURL(event.currentTarget.files[0]); 
      file         = event.currentTarget.files[0];
      var fileName = file.name; 
      var fileSize = file.size;
      var size     = 10737418240;
      var ext      = fileName.split('.').pop();
      var assureId = this.props.assureId;
      // if (file){
      //   addCompanyDocsToS3Function(file,self,"CSV");      
      // }
      if(ext == 'csv'){  
        if (fileSize < size) {
          let ref = this;
          var file1 = file;
          Papa.parse(event.target.files[0], {
            header: false,
            complete( results, file ) {
              ref.setState({"numOfCandidate": results.data.length, "csvuploadingFileName":fileName});
              formValue.numOfCandidate = ref.state.numOfCandidate;
              Meteor.call('companyRequestCheckUsrBasicCSV',results.data,assureId,( error, result ) => {
                if(error){
                  console.log('companyRequestCheckUsrBasicCSV error ',error);
                  swal({
                      title:'abc',
                      text: "Something went wrong! "+error.reason,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonColor: '#666',
                      // cancelButtonColor:'#d33',
                      confirmButtonText: 'Ok'
                    })
                    ref.setState({"inputcompanyCSV" : ""});
                }else{
                  console.log('companyRequestCheckUsrBasicCSV result ',result);
                  if (result) {
                    if(result == 'Data is not in appropriate Format.1'){
                      // swal("Please use the given csv format. Coloum's Heading are missmatched.");
                      swal({
                        title:'abc',
                        text: "Please use the given csv format. Coloum's Heading are missmatched",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#666',
                        // cancelButtonColor:'#d33',
                        confirmButtonText: 'Ok'
                      })
                      ref.setState({"inputcompanyCSV" : ""});
                    }else if (result.failed > 0 ) {
                      ref.setState({"faildList": result.faildList,"inputcompanyCSV" : ""});
                      // swal("Please check Records in rows number:"+ result.faildList +"","Data is not in the proper format","error");
                    }else if(result == 'Please check with the Admin. It seams there is some issue with the service'){
                      swal({
                        title:'abc',
                        text: "Please check with the Admin. It seams there is some issue with the service",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#666',
                        // cancelButtonColor:'#d33',
                        confirmButtonText: 'Ok'
                      })
                      ref.setState({"inputcompanyCSV" : ""});
                    }else if(result.candidateList.length > 0){
                      if (result.failed == 0) {
                        ref.setState({
                          "faildList": [],
                        });
                      }
                      Session.set("uploadCompanyCSVProgressbar",0);
                      ref.setState({
                          "csvFileName": "Please wait..",
                        });
                      ref.setState({"candidateList": result.candidateList, "inputcompanyCSV" : ""},()=>{
                         formValue.listOfCandidates = ref.state.candidateList;
                         var tempCorporateOrder     = TempCorporateOrder.findOne({"companyDetails.companyAssureID" : formValue.companyAssureID,"informationFilledBy" : "company",});
                         // console.log("tempCorporateOrder :",tempCorporateOrder);
                         if (tempCorporateOrder) {
                          addCompanyDocsToS3Function(file1,self,"CSV",formValue.url);
                          Meteor.call('updateTempCorporateOrder',tempCorporateOrder._id,formValue);
                         }else{ 
                           addCompanyDocsToS3Function(file1,self,"CSV",formValue.url); 
                           Meteor.call('insertTempCorporateOrder',formValue);
                         }
                      });
                    }
                  }
                }
              });
            }
          });
          event.target.value == null;
        }else{

          swal({
            title:'abc',
            text: "Document size limit is upto 10gb",
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'
          })
          
        }
      }
    }
  }
 
  //Company document progress bar
  getCompanyDocsPercentage(){
    var uploadProgressPercent = Session.get("uploadCompanyDocumentProgressbar");    
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

        if(parseInt(percentVal)==100){
            setTimeout(()=>{ 
                Session.set("uploadCompanyDocumentProgressbar",null);
            }, 3000);
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
  //Company CSV progress bar
  getCompanyCSVPercentage(){
    var uploadProgressPercent = Session.get("uploadCompanyCSVProgressbar");
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

        if(parseInt(percentVal)==100){
            setTimeout(()=>{ 
                Session.set("uploadCompanyCSVProgressbar",null); 
            }, 3000);
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

  deleteDocs(cvent){
    event.preventDefault();
    var id = $(event.currentTarget).attr('data-id');
    var uploadType = $(event.currentTarget).attr('data-uploadtype');
    if (this.props.tempcorporateOrder) {             
      var tempcorporateOrderId = this.props.tempcorporateOrder._id;
    }else{
      var tempCorporateOrderId = '';
    }
    Meteor.call('deleteCompanyDocs',id,function (error,result) {
      if (error) {
        console.log(error.reason);
      }else{
        // console.log("deleted");

        if (uploadType == "CSV") {
          $("#deleteCSVDocuments").modal("hide");
          $('.modal-backdrop').hide();
          if (tempcorporateOrderId) {
            Meteor.call('removeTempCorporateOrder',tempcorporateOrderId);
          }
        }else{
          $("#deleteuploadedDocuments").modal("hide");
          $('.modal-backdrop').hide();
        }
      }
    });
  }
  submitUpload(event){
    event.preventDefault();
    
    var formValue  = {
      companyAssureID : this.props.assureId,
      tempcorporateOrderId : this.props.tempcorporateOrder._id,
      csvDocument     : this.props.csvDoc,
      documents       : this.props.documents,
    }
 
    if (formValue.documents && formValue.csvDocument) {
      Meteor.call('updateDocsToTempCorporateOrder',formValue,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{ 
          
          // swal("Order Placed Successfully");
          swal({
            title:'abc',
            text: "Order Placed Successfully",
            type: 'success',
            showCancelButton: false,
            confirmButtonColor: '#666',
            // cancelButtonColor:'#d33',
            confirmButtonText: 'Ok'
          })
          FlowRouter.go('/ledger/'+formValue.companyAssureID);
        }
      });
    }else{
      swal({
        title:'abc',
        text: "Please upload Documents or There is no information in the File.Documents accepted as zip or pdf format.",
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#666',
        // cancelButtonColor:'#d33',
        confirmButtonText: 'Ok'
      })
      // swal("No Documents Upload","Please upload Documents or There is no information in the File.Documents accepted as zip or pdf format.","error");
    }
  }
  render() {
    var disable_button = true;
    if (this.props.tempcorporateOrder && this.props.documents ) {
      if (this.props.tempcorporateOrder.orderDetails.length > 0) {
        disable_button = false;
      }
    }

    if(Meteor.userId())
    return (
      <div> 
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">         
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 noProfilePadding visitedHeight companyVerifColor outerpaddingForMobile">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderPage">
            <h3 className="text-center">Upload Request</h3>
           </div>
            <br/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadbtnWrap">
              <ul className="nav nav-pills nav-tabs empVerification col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <li className="col-lg-3 col-md-3 col-sm-4 col-xs-6 NOpadding text-center" ><a href={"/companynewRequest/company/"+this.props.assureId} className={this.props.url == "company" ? "active": ""}>Bulk zip upload</a></li>
                <li className="col-lg-3 col-md-3 col-sm-4 col-xs-6 NOpadding text-center" ><a href={"/companynewRequest/candidate/"+this.props.assureId} className={this.props.url == "candidate" ? "active": ""} >Bulk candidate upload</a></li>
                <li className="col-lg-3 col-md-3 col-sm-4 col-xs-6 NOpadding text-center" ><a href={"/companynewRequest/manual/"+this.props.assureId} className={this.props.url == "manual" ? "active": ""} >Add candidate form</a></li>
              </ul>
              <div className="tab-content tabsContent col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"> 
                <div id={"/companynewRequest/candidate/"+this.props.assureId} className={this.props.url == "candidate" ? "tab-pane fade in active " :  "tab-pane fade"}>
                  <UserUploadRequest/>                  
                </div>
                <div id={"/companynewRequest/company/"+this.props.assureId} className={this.props.url == "company" ? "tab-pane fade in active" :  "tab-pane fade "}>
                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 noProfilePadding">
                    <h4><b>Create New Cases (Bulk)</b></h4>
                  </div>
                 <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 bulkEmployeeContent">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 bulkEmployeeImg noProfilePadding">
                      <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/csvFiles/BasicVerification.csv" download>
                        <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" />
                       <span>Download Template</span>
                      </a>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 bulkEmployeeVerif">
                      <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <li>Please use attached file format to bulkupload your employee details into this system.</li>
                        <li>Please do not change the Heading of following file.</li>
                        <li>File format must be *.csv</li> 
                        <li>Make sure Gender must either 'Male' or 'Female' or 'Other'. </li>
                        <li>Aadhar Number must be in format xxxx xxxx xxxx (e.g. - 1234 5678 9021)</li>
                        <li>Documents as per the SOW and corresponding candidate any order.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter landingBlocks noProfilePadding">
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerUploadBlock">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label className="pull-left">Upload candidate information file : </label>
                      </div>
                      <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12">
                        <input type="file" className="btn btn-info inputCSV" accept=".csv" id="inputcompanyCSV" ref="inputcompanyCSV" value={this.state.inputcompanyCSV} name="inputcompanyCSV" data-uploadtype="CSV"  onChange={this.uploadCSV.bind(this)}/>
                        {this.state.csvFileName == "Choose File" ?
                             <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="CSV" disabled={this.props.csvDoc} onClick={this.inputFileChange.bind(this)}>
                            {this.state.csvFileName}
                             </button>
                          :
                          this.state.csvFileName == "Please wait.." ?
                            <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="CSV" disabled={true} >
                            {this.state.csvFileName} <i className="fa fa-spinner fa-spin"></i>
                             </button>
                          :
                            <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="CSV" disabled={this.props.csvDoc} onClick={this.inputFileChange.bind(this)}>
                            {this.state.csvFileName}
                          </button>
                        
                          }
                      </div>
                      {
                        this.props.csvDoc ?
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            {
                              this.props.csvDoc ?
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerDocumentUploaded">
                                  {this.props.csvDoc.docsFileExt == "csv" ?
                                    <div className='text-left'> 
                                      <i className="fa fa-times pull-right deleteDocs col-lg-1 col-md-1 col-sm-1 col-xs-1" data-uploadtype="CSV" data-toggle="modal" data-target="#deleteCSVDocuments" ></i>
                                      <a href={this.props.csvDoc.docsLink} download><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/filecsv.png" className="img img-responsive companyZipDocs"/></a>
                                      <span className="col-lg-8 col-md-8 col-sm-8 col-xs-8 docsFileName">{this.props.csvDoc.docsFileName}</span>
                                      <div className="modal fade" id="deleteCSVDocuments" role="dialog">
                                        <div className="modal-dialog">
                                          <div className="modal-content">
                                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <button type="button" className="close text-right" data-dismiss="modal">&times;</button>
                                              </div>
                                              <p className="text-left">Do you want to delete this data?</p>
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" data-uploadtype="CSV" data-id={this.props.csvDoc._id} onClick={this.deleteDocs.bind(this)}>Yes</button>
                                                &nbsp;&nbsp;
                                                <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                              </div>
                                            </div>
                                            <div className="modal-footer">
                                            </div>
                                          </div>  
                                        </div>
                                      </div>
                                    </div>
                                  :
                                  null  
                                  }
                                </div>
                              :
                              null     
                            }
                          </div>
                        
                       :
                        this.state.csvFileName == "Choose File" ?
                          null
                        :
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 fileNamelabelDiv">
                          <label>{this.state.csvuploadingFileName}</label>
                        </div>

                      } 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-left insructionlabels">
                        <span>Upload CSV file of all candidate information in the format as instructed above. Maximum file size limit is upto 10 Gb.</span>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        {this.getCompanyCSVPercentage()}
                      </div>

                    </div>
                    <div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerUploadBlock">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <label className="pull-left">Upload Zip file candidate documents:</label><span className="pull-left insructionlabels">&nbsp;(Note : Upload image/pdf zip file only.)</span>
                      </div>

                      <div className="col-lg-5 col-md-5 col-sm-5 col-xs-12">
                        <input type="file" className="btn btn-info inputDocument" name="inputDocument" ref="inputDocument" name="inputDocument" value={this.state.inputDocument} data-uploadtype="document" onChange={this.uploadProofDocs.bind(this)}/>
                         {this.state.fileName == "Choose File" ?
                            <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="document" disabled={this.props.documents} onClick={this.inputFileChange.bind(this)}>
                            {this.state.fileName}
                             </button>
                          :
                          this.state.fileName == "Please wait.." ?
                            <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="document" disabled={true}>
                            {this.state.fileName} <i className="fa fa-spinner fa-spin"></i>
                             </button>
                          :
                          <button type="button" className="btn btn-info uploadBtn col-lg-12 col-md-12 col-xs-12 col-sm-12" data-uploadtype="document" disabled={this.props.documents} onClick={this.inputFileChange.bind(this)}>
                            {this.state.fileName}
                          </button>
                        
                          }
                        
                      </div>
                      {this.props.documents ?
                          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            {
                              this.props.documents ?
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerDocumentUploaded">
                                  {this.props.documents.docsFileExt == "png" || this.props.documents.docsFileExt == "jpg" || this.props.documents.docsFileExt == "jpeg" ?
                                    <div> 
                                      <i className="fa fa-times pull-right deleteDocs col-lg-1 col-md-1 col-sm-1 col-xs-1" data-uploadtype="document" data-toggle="modal" data-target="#deleteuploadedDocuments" ></i>
                                      <a href={this.props.documents.docsLink} download><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="img img-responsive companyZipDocs"/></a>
                                      <span className="col-lg-8 col-md-8 col-sm-8 col-xs-8 docsFileName">{this.props.documents.docsFileName}</span>

                                    </div>
                                  :
                                  this.props.documents.docsFileExt == "zip" ?
                                    <div> 
                                      <i className="fa fa-times pull-right deleteDocs col-lg-1 col-md-1 col-sm-1 col-xs-1" data-uploadtype="document" data-toggle="modal" data-target="#deleteuploadedDocuments" ></i>
                                      <a href={this.props.documents.docsLink} download><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/zip-file-format-489644.png" className="img img-responsive companyZipDocs"/></a>
                                      <span className="col-lg-8 col-md-8 col-sm-8 col-xs-8 docsFileName">{this.props.documents.docsFileName}</span>
                                    </div>
                                  :
                                  this.props.documents.docsFileExt == "pdf" ?
                                    <div> 
                                      <i className="fa fa-times pull-right deleteDocs col-lg-1 col-md-1 col-sm-1 col-xs-1" data-uploadtype="document" data-toggle="modal" data-target="#deleteuploadedDocuments" ></i>
                                      <a href={this.props.documents.docsLink} download><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="img img-responsive companyZipDocs"/></a>
                                      <span className="col-lg-8 col-md-8 col-sm-8 col-xs-8 docsFileName">{this.props.documents.docsFileName}</span>
                                    </div>                         
                                    :
                                  null  
                                  }
                                  <div className="modal fade" id="deleteuploadedDocuments" role="dialog">
                                    <div className="modal-dialog">
                                      <div className="modal-content">
                                        <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <button type="button" className="close text-right" data-dismiss="modal">&times;</button>
                                          </div>
                                          <p className="text-left">Do you want to delete this data?</p>
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" data-uploadtype="document" data-id={this.props.documents._id} onClick={this.deleteDocs.bind(this)}>Yes</button>
                                            &nbsp;&nbsp;
                                            <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                          </div>
                                        </div>
                                        <div className="modal-footer">
                                        </div>
                                      </div>  
                                    </div>
                                  </div>
                                </div>
                              :
                              null     
                            }
                          </div>
                        :
                        this.state.fileName == "Choose File" ?
                          null
                        :
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 fileNamelabelDiv">
                          <label>{this.state.uploadingFileName}</label>
                        </div>

                      }                      
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-left insructionlabels" id="insructionDocs">
                        <span>This Zip file contains all possible relevant documents of all candidates. Maximum file size limit is 10 Gb. </span>
                      </div>
                    
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">                 
                      
                        {this.getCompanyDocsPercentage()}
                      </div>
                    </div>
                    {this.state.faildList.length > 0 ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile"> 
                          {this.showErrorList(this.state.faildList)}
                        </div>
                      :
                    null
                    }
                    {this.props.tempcorporateOrder ? 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <CandidateBulkUploadTable orderDetails={this.props.tempcorporateOrder.orderDetails} tempCorporateOrderId={this.props.tempcorporateOrder._id} csvFileId={this.props.csvDoc ? this.props.csvDoc._id : ""}/>
                      </div>
                      :
                      null
                    }
                    

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkEmployeeFile">  
                      <button type="button" className="btn btn-info pull-right bulkEmpButton" disabled={disable_button} onClick={this.submitUpload.bind(this)}>Submit</button>                 
                    </div> 
                    
                  </div> 
                 
                </div>
                <div id={"/companynewRequest/manual/"+this.props.assureId} className={this.props.url == "manual" ? "tab-pane fade in active " :  "tab-pane fade "}>
                  <UserManualRequest />
                </div>
                
              </div>

            </div>
           
               
          </div>
        </div>
      </div> 
    ); 
  }
}
CompanyUploadRequestContainer = withTracker(({props,params}) => {
  var assureId           = FlowRouter.getParam('assureid');
  var url                = FlowRouter.getParam('url');
  const docsHandle       = Meteor.subscribe("companyDocsData",Meteor.userId(),"document","company");
  const csvHandle        = Meteor.subscribe("companyDocsData",Meteor.userId(),"CSV","company");
  const postHandle       = Meteor.subscribe('companyProfileData',assureId);
  const temporderHandle  = Meteor.subscribe('tempCorporateOrder',assureId,Meteor.userId(),"company");
   
  const loading          = !docsHandle.ready() && !postHandle.ready() && !temporderHandle.ready();

  const companyDetails   = CompanyProfile.findOne({'companyAssureID': assureId});
  if (companyDetails) {
    if (companyDetails.contract) {
      var validContract = companyDetails.contract.filter((contract) => {if( new Date() >= new Date(contract.validFrom) && new Date() <= new Date(contract.validTo) && contract.contractStatus == "Active"){return contract;} });
      if (validContract) {
          var contractId = validContract[0].contractId;
          var validServiceArray = [];
           validContract.map((validContract) =>{
              var validService = validContract.serviceLevelAgreement.filter((serviceLevelAgreement) => {
              return serviceLevelAgreement.value == true;
            });
              if(validService){
                validServiceArray.push(...validService);
              } 
          });
      } 
    } 

  }
  var tempcorporateOrder = TempCorporateOrder.findOne({"companyDetails.orderPlacedById" : Meteor.userId(), "companyDetails.companyAssureID" : assureId,"informationFilledBy":"company"});
  const documents        = TempCompanyDocuments.findOne({"uploadType" : "document",'userId':Meteor.userId(), "urlType" :"company"});
  const csvDoc           = TempCompanyDocuments.findOne({"uploadType" : "CSV",'userId':Meteor.userId(),"urlType" :"company"});
  var uploadCompanyDocumentProgressbar = Session.get("uploadCompanyDocumentProgressbar");
  var uploadCompanyCSVProgressbar      = Session.get("uploadCompanyCSVProgressbar");
  return {
    loading,
    documents,
    assureId,
    contractId,
    validServiceArray,
    tempcorporateOrder,
    csvDoc,
    url,
    uploadCompanyDocumentProgressbar,
    uploadCompanyCSVProgressbar
  };
})(CompanyUploadRequest);
export default CompanyUploadRequestContainer;