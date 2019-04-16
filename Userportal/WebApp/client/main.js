import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';
import {routes, onAuthChange}  from '/lib/routes.jsx';
import './main.html';
//import objects of image collection
import { UserImage } from '/imports/admin/userManagement/UserPicUploadClient/UserPicUploadClient.js';
import { ProofDocuments } from '/imports/AssureID/userPortal/UploadToClient/ProofUploadClient.js';

import '/imports/AssureID/website2/css/style.css';
import '/imports/systemSecurity/signup/css/signup.css';
import '/imports/systemSecurity/css/systemSecurity.css';
import '/imports/common/header/userPortalHeader/css/userportalHeader.css';
import '/imports/common/footer/userPortalFooter/css/userPortalFooter.css';
import '/imports/AssureID/userPortal/profile/view/css/view.css';
import '/imports/systemSecurity/otp/css/permissionModals.css';
import '/imports/AssureID/userPortal/userHome/css/profile.css';
import '/imports/AssureID/userPortal/purchase/serviceProcess/css/serviceProcess.css';
import '/imports/AssureID/userPortal/purchase/packageProcess/css/packageProcess.css';
import '/imports/AssureID/userPortal/orders/css/orders.css';
import '/imports/AssureID/userPortal/cart/css/cart.css';
import '/imports/AssureID/company/css/company.css';
import '/imports/AssureID/userPortal/reports/css/reportandorder.css';
import { CostExplorer } from 'aws-sdk/clients/all';
Meteor.startup(() => {
	ReactDOM.render(routes, document.getElementById('app-root'));
});

// add Proof image function
addProofToS3Function = function(userId,file,prooftype,proofSubtype,self) {     
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
            if(prooftype == 'basic'){
                Meteor.call("insertBasicProof",fileObj._id,(error, result)=>{
                }); 
            }else if(prooftype == 'employement'){
                // 
                Meteor.call("addEmpTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                });
            }else if(prooftype == 'address'){
                Meteor.call("addAddrTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                });
            }else if(prooftype == 'education'){
                Meteor.call("addEduTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                });
            }else if(prooftype == 'certificates'){
                Meteor.call("addCertTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
                });
            }else{
                Meteor.call("addNewTempProofDocs",fileObj._id,userId,prooftype,proofSubtype,(error, result)=>{
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