import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const UserProfile = new Mongo.Collection("userProfile");
export const TempProofDocs = new Mongo.Collection("tempProofDocs");

import { ProofDocuments } from '/imports/admin/adminDashboard/uploadToServer/UserProofUploadServer.js';

if(Meteor.isServer){ 
    Meteor.publish('userProfileData',()=>{
        return UserProfile.find({});
    });
    Meteor.publish('TempProofDocs',()=>{
        return TempProofDocs.find({});
    });
    Meteor.publish('LatestTempProofDocs',()=>{
        return TempProofDocs.find({}, {sort: {createdAt: -1, limit: 1}});
    });
    Meteor.publish('userprofile',(_id)=>{ 
        return UserProfile.find({"userId" : _id});
    });
    Meteor.methods({
    // Insert basic info in Userprofile
    "insertBasicDataFromCompany": function (formValues) { 
      if(formValues.firstName != '' && formValues.lastName != '' &&
       formValues.mobileNo != '' && formValues.emailId != ''){
        var profileClass = 'halfcompleteDetails';
        var profilePercent = 8;
      }else{
        var profileClass = 'halfcompleteDetails';
        var profilePercent = 8;
      }

      var userId = UserProfile.insert({
        "userId"          : formValues.userId,
        "firstName"       : formValues.firstName,
        "lastName"        : formValues.lastName,
        "fatherFirstName" : '',
        "fatherLastName"  : '',
        "motherFirstName" : '',
        "motherLastName"  : '',
        "spouseFirstName" : '',
        "spouseLastName"  : '',
        "gender"          : 'Female',
        "dateOfBirth"     : '',
        "mobileNo"        : formValues.mobileNo,
        "altMobileNo"     : '',
        "emailId"         : formValues.emailId,
        "altEmailId"      : '',
        'assureId'        : formValues.assureId,
        "proofType"       : '',
        "proofOfDocument" : '', 
        "fileExt"         : '',
        "fileName"        : '',
        "profilePercent"          : profilePercent,
        "profileBasicPercent"     : profilePercent,
        "profileBasicClass"       : profileClass,
        "profileIdentityClass"    : "incompleteDetails",
        "profileAddressClass"     : "incompleteDetails",
        "profileAcademicsClass"   : "incompleteDetails",
        "profileEmploymentClass"  : "incompleteDetails",
        "profileOtherInfoClass"   : "incompleteDetails",
        "profileSkillsCertClass"  : "incompleteDetails",
        "profileBasicStatus"      : 'Approved',
        "profileIdentityStatus"   : '',
        "profileAddressStatus"    : '',
        "profileAcademicsStatus"  : '',
        "profileEmploymentStatus" : '',
        "profileOtherInfoStatus"  : '',
        "profileSkillsCertStatus" : '',
        "createdAt"               : new Date(),
        "identity"                : {
          "adharCardNo"    : formValues.aadharCard,
        },
        });
      return userId;
    }, 
   // send verification data from order to user
    'updateVeriDataInUsrProfile':function (candidateId,verificationData,orderId,verificationDataIndex) {
      var userprofile = UserProfile.findOne({"userId": candidateId});
      if (userprofile) {
          if (verificationData.verificationType == "permanentAddress" ) {
             Meteor.call("insertPermanantAddress",candidateId,verificationData,function(error,result) {
              if (error) {
                 console.log(error.reason);
              }else{
                var verificationId    = result;
                var id                = "permanentAddressId"; 
                var verificationIndex = parseInt(verificationDataIndex) ;
                var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
                if (data) {
                  return data;
                }
              }
            });
          }else if (verificationData.verificationType == "currentAddress") {
            Meteor.call("insertCurrentAddress",candidateId,verificationData,function (error,result) {
              if (error) {
                 console.log(error.reason);
              }else{ 
                var verificationId    = result;
                var id                = "currentAddressId";
                var verificationIndex = parseInt(verificationDataIndex) ;
                var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
                if (data) {
                  return data;
                }
              }
            });
          }else if (verificationData.verificationType == "education") {
            Meteor.call("insertEducation",candidateId,verificationData,function (error,result) {
              if (error) {
                 console.log(error.reason);
              }else{
                var verificationId    = result;
                var id                = "educationId";
                var verificationIndex = parseInt(verificationDataIndex);
                var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
                if (data) {
                  return data;
                }
              }
            });
          }else if (verificationData.verificationType == "employement") {
            Meteor.call("insertEmployement",candidateId,verificationData,function (error,result) {
              if (error) {
                 console.log(error.reason);
              }else{
                var verificationId    = result;
                var id                = "employementId";
                var verificationIndex = parseInt(verificationDataIndex) ;
                var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
                if (data) {
                  return data;
                }
              }
            });
          }else if (verificationData.verificationType == "Identity") {
              var verificationId    = parseInt(verificationDataIndex);
              var id                = "identityId";
              var verificationIndex = parseInt(verificationDataIndex) ;
              var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
              if (data) {
                return data;
              } 
          }else if (verificationData.verificationType == "reference") {
            Meteor.call("insertReference",candidateId,verificationData,function (error,result) {
              if (error) {
                 console.log(error.reason);
              }else{
                var verificationId    = result;
                var id                = "referenceId";
                var verificationIndex = parseInt(verificationDataIndex) ;
                var data = Meteor.call("updateIdInOrders",orderId,candidateId,verificationId,id,verificationIndex);
                if (data) {
                  return data;
                }
              }
            });
          }
      } 
    },
    // insert permanent address method
    'insertPermanantAddress':function(id,permanentAddress) {
      var permanentAddressId = 1;
       var addressObj = UserProfile.findOne({"userId": id}, {sort: {'permanentAddress.permanentAddressId': -1}});
      if(addressObj){
        if (addressObj.permanentAddress) {
          if (addressObj.permanentAddress.length > 0) {
             var lastelem           = _.last(addressObj.permanentAddress);
             permanentAddress.permanentAddressId =  parseInt(lastelem.permanentAddressId) + 1;
          }else{
            permanentAddress.permanentAddressId =  1;
          }
        }
        else{
          permanentAddress.permanentAddressId =  1;
        }
      }

      if(permanentAddress.line1 != '' || permanentAddress.line2 != '' || permanentAddress.line3 != '' || 
       permanentAddress.landmark != '' || permanentAddress.city != '' || permanentAddress.state != '' || 
       permanentAddress.pincode != '' || permanentAddress.residingFrom != '' || 
       permanentAddress.residingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
        var profileAddressStatus = 'In Process';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
        var profileAddressStatus = '';
      } 

      var profilePermanentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profilePermanentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profilePermanentPercent;
          var updatedProfilePercent = newProfilePercent + profilePermanentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profilePermanentPercent;
        }

        if(userData.profileCurrentPercent){
          if(profilePermanentPercent + userData.profileCurrentPercent == 14){
            var profileClass = '';
          } 
        }
      }          
      if (permanentAddress.fatherFirstName) {
        UserProfile.update({"userId" : id},
          {$set : 
            {
              "fatherFirstName"     : permanentAddress.fatherFirstName,
              "fatherLastName"      : permanentAddress.fatherLastName,
              "dateOfBirth"         : permanentAddress.dateOfBirth,
            }
          });
      }
      UserProfile.update({"userId" : id},
       {$push : 
          {
            "permanentAddress" : permanentAddress,
         }
      });

      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profilePermanentPercent"  : profilePermanentPercent,
          "profileAddressClass"      : profileClass,
          "profilePercent"           : updatedProfilePercent,
          "profileAddressStatus"     : profileAddressStatus,
        }
      });

      return permanentAddress.permanentAddressId;
    },

    // insert current address method
    'insertCurrentAddress':function(id,currentAddress) {
      var currentAddressId = 1;
      var addressObj = UserProfile.findOne({"userId": id}, {sort: {'currentAddress.currentAddressId': -1}});
      if(addressObj){
        if (addressObj.currentAddress) {
          if (addressObj.currentAddress.length > 0) {
            var lastelem           = _.last(addressObj.currentAddress);
            currentAddress.currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
          }else{
            currentAddress.currentAddressId =  1;
          }
        }
        else{
          currentAddress.currentAddressId =  1;
        }
      }
      if(currentAddress.tempLine1 != '' || currentAddress.tempLine2 != '' || currentAddress.tempLine3 != '' || 
       currentAddress.tempLandmark != '' || currentAddress.tempCity != '' || currentAddress.tempState != '' || 
       currentAddress.tempPincode != '' || currentAddress.tempresidingFrom != '' || 
       currentAddress.tempresidingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
        var profileAddressStatus = 'In Process';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileAddressStatus = '';
      }

      var profileCurrentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileCurrentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileCurrentPercent;
          var updatedProfilePercent = newProfilePercent + profileCurrentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileCurrentPercent;
        }

        if(userData.profilePermanentPercent){
          if(userData.profilePermanentPercent + profileCurrentPercent == 14){
            var profileClass = '';
          }
        }
      }

      if (currentAddress.fatherFirstName) {
        UserProfile.update({"userId" : id},
          {$set : 
            {
              "fatherFirstName"     : currentAddress.fatherFirstName,
              "fatherLastName"      : currentAddress.fatherLastName,
              "dateOfBirth"         : currentAddress.dateOfBirth,
            }
          });
      }
      UserProfile.update({"userId" : id},
      {$push : {
          "currentAddress" : currentAddress,
        }
      });

      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileAddressClass"     : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileCurrentPercent"   : profileCurrentPercent,
          'profileAddressStatus'    : profileAddressStatus,
        }
      });
      return currentAddress.currentAddressId;
    },
    // insert education methods
    'insertEducation':function(id,education) {
      var educationId = 1;
      var userprofileObj = UserProfile.findOne({"userId": id}, {sort: {'education.educationId': -1}});
      if(userprofileObj){
        if (userprofileObj.education) {
          if (userprofileObj.education.length > 0) {
             var lastelem           = _.last(userprofileObj.education);
             education.educationId =  parseInt(lastelem.educationId) + 1;
          }else{
            education.educationId =  1;
          }
        }
        else{
          education.educationId =  1;
        }
      }

      if(education.educationLevel != '-- Select --' || education.educationQualification != '' || 
        education.educationMode != '-- Select --' || education.dateAttendedFrom != '' || education.dateAttendedTo != '' || 
        education.collegeName != '' || education.university != '' || education.collegeAddress != '' || 
        education.rollNo != '' || education.specialization != '' || education.grades != '' || education.city != '' || education.state != ''){
        var profilePercent = 14;
        var profileClass = '';
        var profileAcademicsStatus = 'In Process';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
        var profileAcademicsStatus = '';
      }

      var profileEducationPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEducationPercent == 14 && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEducationPercent;
          var updatedProfilePercent = newProfilePercent + profileEducationPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEducationPercent;
        }
      }    

      UserProfile.update({"userId" : id},
      {$push : {
          "education" : education,
        }
      });
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"   : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileAcademicsStatus"  : profileAcademicsStatus,
        }
      });
       return education.educationId;
    }, 
    //insert employement methods
    'insertEmployement':function(id,employement) {
      var employementId = 1;
      var employementObj = UserProfile.findOne({"userId": id}, {sort: {'employement.employementId': -1}});
      if(employementObj){
        if (employementObj.employement) {
           if (employementObj.employement.length > 0 ) {
            var lastelem    = _.last(employementObj.employement);
             employement.employementId =  parseInt(lastelem.employementId) + 1;
          }else{
            employement.employementId=  1;
          }
        }
        else{
           employement.employementId=  1;
        }
      }
      if(employement.nameOfEmployer != '' || employement.employerAddress != '' || 
        employement.contactNo != '' || employement.employeeCode != '' || employement.designation != '' ||
        employement.department != '' || employement.employmentFrom != '' || employement.employmentTo != '' ||
        employement.lastSalaryDrawn != '' || employement.typeOfEmployement != '' || 
        employement.detailOfAgency != '' || employement.reasonOfLeaving != '' || employement.dutiesAndResponsibilites != '' || 
        employement.reportingManagerNm != '' || employement.prevDesignation != ''
        || employement.contactDetails != '' || employement.employerState != '' || employement.employerCity != ''){
        var profileClass = '';
        var profilePercent = 14;
        var profileEmploymentStatus = 'In Process'; 
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileEmploymentStatus = '';
      }

      var profileEmploymentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEmploymentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEmploymentPercent;
          var updatedProfilePercent = newProfilePercent + profileEmploymentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEmploymentPercent;
        }
      } 

      UserProfile.update({"userId" : id},
      {$push : {
          "employement" : employement,
        }
      });
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEmploymentPercent"  : profileEmploymentPercent,
          "profileEmploymentClass"    : profileClass,
          "profilePercent"            : updatedProfilePercent,
          "profileEmploymentStatus"   : profileEmploymentStatus,
        }
      });
      return employement.employementId;
    },
    // insert reference methods
    'insertReference':function(id,reference){
      var referenceId = 1;
      var addressObj = UserProfile.findOne({"userId": id}, {sort: {'reference.referenceId': -1}});
      if(addressObj){
        if (addressObj.reference) {
          if (addressObj.reference.length > 0) {
             var lastelem           = _.last(addressObj.reference);
             reference.referenceId  =  parseInt(lastelem.referenceId) + 1;
          }else{
            reference.referenceId =  1;
          }
        }
        else{
          reference.referenceId =  1;
        }
      }

      UserProfile.update({"userId" : id},
      {$push : 
          {
            "reference" : reference,
         }
      });
      return reference.referenceId; 
    },
    "addAddrTempProofDocs": function (id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid) {
      var data      = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      var documentInUserprofile =  {
        "proofType"       : proofTypeName,
        "proofOfDocument" : imageLink,
        "fileName"        : data.name,
        "fileExt"         : data.ext
      }

      Meteor.call("updateImageInUserProfile",userId,proofSubtype,verificationid,documentInUserprofile);

      Meteor.call("InsertImageInOrder",orderId,userId,dataIndex,prooftype,documentInUserprofile,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{
        }
      });
    },
    "addEduTempProofDocs": function (id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid) {
      var data      = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;

      var documentInUserprofile =  {
        "proofType"       : proofTypeName,
        "proofOfDocument" : imageLink,
        "fileName"        : data.name,
        "fileExt"         : data.ext
      }
      Meteor.call("updateImageInUserProfile",userId,proofSubtype,verificationid,documentInUserprofile);
     
      Meteor.call("InsertImageInOrder",orderId,userId,dataIndex,prooftype,documentInUserprofile,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          TempProofDocs.remove({});
        }
      });
       
    },
    "addEmpTempProofDocs": function (id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName,verificationid) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      
      var documentInUserprofile =  {
        "proofType"       : proofTypeName,
        "proofOfDocument" : imageLink,
        "fileName"        : data.name,
        "fileExt"         : data.ext
      }
      Meteor.call("updateImageInUserProfile",userId,proofSubtype,verificationid,documentInUserprofile);
      
      Meteor.call("InsertImageInOrder",orderId,userId,dataIndex,prooftype,documentInUserprofile,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          TempProofDocs.remove({});
        }
      });
   },
   "addNewTempProofDocs": function (id,userId,data) {
    // console.log("hi ");
      var proofdata = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+proofdata.path;
      if (data.cardType == "Aadhar Card") {
        var cardType = "adharCardNo";
      }else if (data.cardType == "Pan Card") {
        var cardType = "panCardNo";
      }else if (data.cardType == "Driving License") {
        var cardType = "drivingCardNo";
      }else if (data.cardType == "Voting Card") {
        var cardType = "votingCardNo";
      }else if (data.cardType == "Ration Card") {
        var cardType = "rationCardNo";
      }else if (data.cardType == "Passport") {
        var cardType = "passportNo";
      }else{
        var cardType = "";
      }     
      UserProfile.update({"userId" : userId},
        {
          $set:{
            [cardType]  : data.cardNo,
            ['identity.'+data.proofSubtype] :  imageLink,
            ['identity.'+data.proofSubtype+"ext"] :proofdata.ext,
            ['identity.'+data.proofSubtype+"name"] :proofdata.name,
          } //End of set
        },(error, result)=>{
      });
       var documentInUserprofile =  {
        "proofType"       : data.cardType,
        "proofOfDocument" : imageLink,
        "fileName"        : proofdata.name,
        "fileExt"         : proofdata.ext
      }

      Meteor.call("InsertImageInIdentityOrder",data.orderId,userId,data.dataIndex,data.proofSubtype,documentInUserprofile,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{
        } 
      });
    },
    'updateImageInUserProfile':function(userId,verificationType,verificationid,documentInUserprofile){
      if (verificationType == "permanentAddress") {
        var verificationUniqueId = "permanentAddressId";
      }else if (verificationType == "currentAddress") {
        var verificationUniqueId = "currentAddressId";
      }else if (verificationType == "education") {
        var verificationUniqueId = "educationId";
      }else if (verificationType == "employement") {
        var verificationUniqueId = "employementId";
      }else if (verificationType == "certificates") {
        var verificationUniqueId = "certificateId";
      }else if (verificationType == "professionalEducation") {
        var verificationUniqueId = "professionalEducationId";
      }
      return UserProfile.update(
        {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationid)},
        { $set:{
              [verificationType+'.$'+'.proofType']         : documentInUserprofile.proofType,
              [verificationType+'.$'+'.proofOfDocument']   : documentInUserprofile.proofOfDocument,
              [verificationType+'.$'+'.fileName']          :  documentInUserprofile.fileName,
              [verificationType+'.$'+'.fileExt']           :  documentInUserprofile.fileExt,
          } 

        }
      );
    },
    'updateEditStatus':function(userId,verificationType,verificationId,orderNo,orderDate){
      if (verificationType == "permanentAddress") {
        var verificationUniqueId = "permanentAddressId";
      }else if (verificationType == "currentAddress") {
        var verificationUniqueId = "currentAddressId";
      }else if (verificationType == "education") {
        var verificationUniqueId = "educationId";
      }else if (verificationType == "employement") {
        var verificationUniqueId = "employementId";
      }else if (verificationType == "certificates") {
        var verificationUniqueId = "certificateId";
      }else if (verificationType == "professionalEducation") {
        var verificationUniqueId = "professionalEducationId";
      }else if (verificationType == "reference") {
        var verificationUniqueId = "referenceId";
      }
      return UserProfile.update(
        {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
        { $set:{
              [verificationType+'.$'+'.verifiedStatus']   : "In Process",
              [verificationType+'.$'+'.editStatus']       : "Block" ,
              [verificationType+'.$'+'.orderNo']          :  orderNo,
              [verificationType+'.$'+'.orderDate']        :  orderDate,
          } 

        }
      );
    },
   'changeStatusMethod':function(id,userId,remark,verificationType,verificationId){
        // console.log('changeStatus',id,userId,remark,verificationType,verificationId);
        if (verificationType == "permanentAddress") {
            var verificationUniqueId = "permanentAddressId";
          }else if (verificationType == "currentAddress") {
            var verificationUniqueId = "currentAddressId";
          }else if (verificationType == "education") {
            var verificationUniqueId = "educationId";
          }else if (verificationType == "employement") {
            var verificationUniqueId = "employementId";
          }else if (verificationType == "certificates") {
            var verificationUniqueId = "certificateId";
          }else if (verificationType == "professionalEducation") {
            var verificationUniqueId = "professionalEducationId";
          }else if (verificationType == "reference") {
            var verificationUniqueId =  "referenceId";
          }
       var status =  UserProfile.update(
            {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
            { $set:{
                    [verificationType+'.$'+'.editStatus']       : "Reopen" ,
                    [verificationType+'.$'+'.remark']           :  remark,
              } 

            }
          );
        return status;
      },

    });
}