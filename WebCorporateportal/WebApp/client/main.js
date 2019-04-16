import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';
import {routes, onAuthChange}  from '/lib/routes.jsx';
import './main.html';
import './main.css';
import { CompanyLogoImage } from '/imports/AssureID/company/profile/forms/UploadToClient/ProofUploadClient.js';
import { ProofDocuments } from '/imports/AssureID/user/UploadToClient/ProofUploadClient.js';
import { CompanyDocuments } from '/imports/AssureID/company/companyNewRequest/components/UploadToClient/CompanyDocumentUploadToClient.js';

// Import css
import '/imports/admin/adminDashboard/css/dashboard.css';
import '/imports/systemSecurity/css/login.css';
import '/imports/systemSecurity/css/changePassword.css';
import '/imports/common/header/corporateHeader/css/CorporateHeader.css';
import '/imports/common/footer/corporateFooter/css/CorporateFooter.css';
import '/imports/AssureID/company/profile/css/companyForms.css';
import '/imports/AssureID/company/profile/view/css/views.css';
import '/imports/AssureID/company/contractAndSow/css/contract.css';
import '/imports/common/css/common.css';
// import '/imports/AssureID/company/newRequest/css/newRequest.css';
import '/imports/AssureID/staticcasestatus/css/staticcasestatus.css';
import '/imports/AssureID/company/console/css/summaryLedger.css';
import '/imports/AssureID/company/companyNewRequest/css/companyNewRequest.css';
import '/imports/AssureID/company/ledger/css/ledger.css';
import '/imports/AssureID/company/ledger/components/reportgeneration/css/orderGeneration.css';

Meteor.startup(() => {
	ReactDOM.render(routes, document.getElementById('app-root'));
});

// add user image function
addCompanyLogoToS3Function = function(userId,file,type,self) {
    //  
    //  
    uploadInstance = CompanyLogoImage.insert({
                                        file: file,
                                        meta: {
                                                        locator : self.props.fileLocator,
                                                        userId  : Meteor.userId() // Optional, used to check on server for file tampering
                                        },
                                        streams         : 'dynamic',
                                        chunkSize       : 'dynamic',
                                        allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    self.setState({
        uploading  : uploadInstance, // Keep track of this instance to use below
        inProgress : true // Show the progress bar now
    });

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () { 
    });
 
    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  (error, fileObj) => {
        if(fileObj){ 
            // 
            Meteor.call("addCompanyLogoImage",fileObj,userId,type,(error, result)=>{
                // swal({
                //     position: 'top-right',
                //     type: 'success',
                //     title: 'Uploaded Successfully',
                //     showConfirmButton: false,
                //     timer: 1500
                // });
            });
        }

        self.setState({
            uploading  : [],
            progress   : 0,
            inProgress : false
        });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        Session.set("uploadCompanyLogoProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}

// add Proof image function
addProofToS3Function = function(userId,file,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,self) {
    // 
    // 
    
    uploadInstance = ProofDocuments.insert({
                                        file: file,
                                        meta: {
                                                        locator : self.props.fileLocator,
                                                        userId  : Meteor.userId() // Optional, used to check on server for file tampering
                                        },
                                        streams         : 'dynamic',
                                        chunkSize       : 'dynamic',
                                        allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);
    if(self){
        self.setState({
            uploading  : uploadInstance, // Keep track of this instance to use below
            inProgress : true // Show the progress bar now
        });
        
    }

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () {
    });
 
    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  function (error, fileObj) {
        if(fileObj){ 
            // 
            
            if(prooftype == 'basic'){
                Meteor.call("insertBasicProof",fileObj._id,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                }); 
            }else if(prooftype == 'employement'){
                // 
                Meteor.call("addEmpTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }else if(prooftype == 'address'){
                Meteor.call("addAddrTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }else if(prooftype == 'education'){
                Meteor.call("addEduTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false, 
                    //     timer: 1500
                    // });
                });
            }else if(prooftype == 'certificates'){
                Meteor.call("addCertTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }else{
                Meteor.call("addNewTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }
        }

        self.setState({
            uploading  : [],
            progress   : 0,
            inProgress : false
        });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        Session.set("uploadProofDocProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}

// add ticket image function
addCompanyDocsToS3Function = function(file,self,uploadType,urlType) {
    // console.log("uploadType",uploadType);
    uploadInstance = CompanyDocuments.insert({
                                        file: file, 
                                        meta: {
                                        locator : self.props.fileLocator,
                                        userId  : Meteor.userId() // Optional, used to check on server for file tampering
                                        },
                                        streams         : 'dynamic',
                                        chunkSize       : 'dynamic',
                                        allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    self.setState({
        uploading  : uploadInstance, // Keep track of this instance to use below
        inProgress : true // Show the progress bar now
    }); 

    // These are the event functions, don't need most of them, it shows where we are in the process
    uploadInstance.on('start', function () {
    });
 
    uploadInstance.on('end', function (error, fileObj) {
    });

    uploadInstance.on('uploaded',  (error, fileObj) => {
        if(fileObj){
            // console.log("fileObj._id: ",fileObj._id);
            Meteor.call("addTemporaryDocument",fileObj._id,uploadType,urlType,(error, result)=>{
                // swal({
                //     position: 'top-right',
                //     type: 'success',
                //     title: 'Uploaded Successfully',
                //     showConfirmButton: false,
                //     timer: 1500
                // });
            });
        }

        self.setState({
            uploading  : [],
            progress   : 0,
            inProgress : false
        });
    });

    uploadInstance.on('error', function (error, fileObj) {
    });

    uploadInstance.on('progress', function (progress, fileObj) {
        if (uploadType == "document") {
        Session.set("uploadCompanyDocumentProgressbar",progress);
        }
        if (uploadType == "CSV" && urlType == "company") {
          Session.set("uploadCompanyCSVProgressbar",progress);
        }else{
          Session.set("uploadCandidateCSVProgressbar",progress);
        }
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded

}