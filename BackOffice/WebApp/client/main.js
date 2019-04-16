import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';
import {routes, onAuthChange}  from '/lib/route_dashboard.jsx';
import './main.html';
// Image upload objects from client 
import { ServiceImage } from '/imports/admin/adminDashboard/uploadToClient/UploadServiceImgsClient.js';
import { PackageImage } from '/imports/admin/adminDashboard/uploadToClient/UploadPackageImgsClient.js';
import { UserImage } from '/imports/admin/userManagement/UserPicUploadClient/UserPicUploadClient.js';
import { ContractDocuments } from '/imports/admin/adminDashboard/uploadToClient/UploadContractDocToClient.js';
import { TicketImages } from '/imports/admin/adminDashboard/uploadToClient/uploadImagesToClient.js';
import { TicketVideo } from '/imports/admin/adminDashboard/uploadToClient/uploadVideoToClient.js';
import { TicketReport } from '/imports/admin/adminDashboard/uploadToClient/uploadReportToClient.js';
 
// import { NewsVideo } from '/imports/dashboard/forms/uploadToClient/uploadNewsVideoClient.js';
// import { CompanyLogoImage } from '/imports/website/companyForms/UploadToClient/ProofUploadClient.js';
// import { CompanyLogoImage } from '/imports/admin/adminDashboard/uploadToClient/ProofUploadClient.js';
import { CompanyLogoImage } from '/imports/admin/adminDashboard/uploadToClient/ProofUploadClient.js';
import { ProofDocuments } from '/imports/admin/adminDashboard/uploadToClient/UserProofUploadClient.js';
import { CompanySettingLogoImage } from '/imports/admin/companySettings/uploadToClient/uploadLogoToClient.js';

// css imports
import '/imports/admin/adminDashboard/css/dashboard.css';
import '/imports/systemSecurity/css/login.css';
import '/imports/admin/adminDashboard/corporateManagement/css/corporatecss.css';
import '/imports/admin/caseManagement/css/ticke.css';
import '/imports/admin/reportgeneration/css/orderGeneration.css';
import '/imports/admin/caseDashboard/css/caseDashboardCss.css';
import '/imports/admin/corporateOrderManagement/css/corporateCss.css';
import '/imports/common/css/common.css';
import '/imports/admin/companySettings/css/companySetting.css';

import '/imports/admin/corporateOrderManagement/component/newRequest/css/newRequest.css';
import '/imports/admin/corporateOrderManagement/component/staticcasestatus/css/staticcasestatus.css';

import { CostExplorer } from 'aws-sdk/clients/all';
Meteor.startup(() => {
	ReactDOM.render(routes, document.getElementById('app-root'));
});

// add service image function
addServicesImgsToS3Function = function(file,self) {
    uploadInstance = ServiceImage.insert({
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
            Meteor.call("addNewTemporaryServiceImage",fileObj._id, (error, result)=>{
                swal({
                    position: 'top-right',
                    type: 'success',
                    title: 'Uploaded Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
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
        Session.set("uploadServiceProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}
// add package image function
addPackageImageS3Function = function(file,self) {
    uploadInstance = PackageImage.insert({
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
            Meteor.call("TempPackageImageToS3function",fileObj._id,(error, result)=>{
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
        Session.set("uploadPackageProgressbar",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}
// add user image function
addUserToS3Function = function(userId,file,self,userFileName,userFileExt) {
    uploadInstance = UserImage.insert({
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
            Meteor.call("addUserImage",fileObj._id,userId,userFileName,userFileExt,(error, result)=>{
                swal({
                    position: 'top-right',
                    type: 'success',
                    title: 'Uploaded Successfully',
                    showConfirmButton: false,
                    timer: 1500
                });
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
        Session.set("uploadServiceImgProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}

addContractToS3Function = function(file,self,typeOfDoc) {
    // console.log("self",self);
    uploadInstance = ContractDocuments.insert({
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
            Meteor.call("TempContractDocToS3function",fileObj._id,typeOfDoc,(error, result)=>{
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
        if (typeOfDoc == "scopeOfWork") {
          Session.set("uploadScopeOfWorkProgressPercent",progress);
        }else if (typeOfDoc == "pricing") {
          Session.set("uploadPricingProgressPercent",progress);
        }else{
          Session.set("uploadAuthLetterProgressPercent",progress);
        }
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}
// image upload function for identity
addIdentityProofToS3Function = function(userId,file,data,self) {
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
            if (data.prooftype == "Identity") {
               Meteor.call("addNewTempProofDocs",fileObj._id,userId,data,(error, result)=>{
               });
            }else{
                swal("File not uploaded","Something went wrong","error");
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
        Session.set("uploadProofIdentityDocProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded

}

// add Proof image function
addProofToS3Function = function(userId,file,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid,self) { 
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
                Meteor.call("addEmpTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }else if(prooftype == 'address'){
                Meteor.call("addAddrTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid,(error, result)=>{
                    // swal({
                    //     position: 'top-right',
                    //     type: 'success',
                    //     title: 'Uploaded Successfully',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                });
            }else if(prooftype == 'education'){
                Meteor.call("addEduTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid,(error, result)=>{
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
                swal("File not uploaded","Something went wrong","error");
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
        Session.set(userId+"-"+dataIndex,progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}

// add ticket image function
addImgsToS3Function = function(file,self) {
    // console.log("serverside addImgsToS3Function :");
    uploadInstance = TicketImages.insert({
                                        file: file,
                                        meta: {
                                        locator : self.props.fileLocator,
                                        userId  : Meteor.userId() // Optional, used to check on server for file tampering
                                        },
                                        streams         : 'dynamic',
                                        chunkSize       : 'dynamic',
                                        allowWebWorkers : true // If you see issues with uploads, change this to false
    }, false);

    console.log("uploadInstance :",uploadInstance);
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
        // console.log("error :",error);
        // console.log("fileObj :",fileObj);
        if(fileObj){
            // console.log("fileObj._id: ",fileObj._id);
            Meteor.call("addNewTemporaryTicketImages",fileObj._id,(error, result)=>{
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
        Session.set("uploadDocumentProgressbar",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}
// add video of ticket function
addTicketVideoS3Function = function(file,self) {
    // console.log("self",self);
    uploadInstance = TicketVideo.insert({
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
            Meteor.call("TempTicketVideoToS3function",fileObj._id,(error, result)=>{
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
        Session.set("uploadVideoProgressbar",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
},
addReportFunction = function(file,self,fileextension) {
    uploadInstance = TicketReport.insert({
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
            Meteor.call("TempReportToS3function",fileObj._id,fileextension,(error, result)=>{
            // swal({
            //     position: 'top-right',
            //     type: 'success',
            //     title: 'Uploaded Successfully',
            //     showConfirmButton: false,
            //     timer: 1500
            // });
        // Session.set("uploadReportProgressPercent","");
            
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
        Session.set("uploadReportProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}, 

// add company image function
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

// add logo to company setting function
addLogoToS3Function = function(userId,file,self) {
  
    uploadInstance = CompanySettingLogoImage.insert({
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
            Meteor.call("tempLogoImageUpload",fileObj,userId,(error, result)=>{
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
        Session.set("uploadLogoProgressPercent",progress);
        
        self.setState({
            progress : progress
        })
    });

    uploadInstance.start(); // Must manually start the uploaded
}
