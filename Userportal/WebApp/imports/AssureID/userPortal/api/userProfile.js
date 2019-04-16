import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { ProofDocuments } from "/imports/AssureID/userPortal/UploadToServer/ProofUploadServer.js";

export const UserProfile = new Mongo.Collection("userProfile");
export const TempProofDocs = new Mongo.Collection("tempProofDocs");
if(Meteor.isServer){
  Meteor.publish('userProfileData',(userProfileData)=>{
    var data = UserProfile.find({});
    return data;
  });
  Meteor.publish('allUserProfileData',()=>{
   return UserProfile.find({});
  });  
  Meteor.publish('TempProofDocs',(_id)=>{
    return TempProofDocs.find({"userId": _id});
  });
  Meteor.publish('LatestTempProofDocs',()=>{
    return TempProofDocs.find({}, {sort: {createdAt: -1, limit: 1}});
  });
  Meteor.publish('userprofile',(_id)=>{
    return UserProfile.find({"userId": _id});
  });
 
  Meteor.methods({
    "updateAssureId": function(assureId) {
      var userId = Meteor.userId();
      UserProfile.update(
        {'userId': userId },
        {
          $set:{
            "assureId" :  assureId,
          } //End of set
        }
      ); 
    },
    "updateUserProfile": function(userId,imageLink,userFileName,userFileExt) {
      UserProfile.update(
        {'userId': userId },
        {
          $set:{
            "userProfile" :  imageLink,
            "userFileName" : userFileName,
            "userFileExt"  : userFileExt,
          } //End of set
        }
      );
    },
    "addNewTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      UserProfile.update({"userId" : userId},
        {
          $set:{
            ['identity.'+proofSubtype] :  imageLink,
            ['identity.'+proofSubtype+"ext"] :data.ext,
            ['identity.'+proofSubtype+"name"] :data.name,
          } //End of set
        },(error, result)=>{
      });
    },
    "addCertTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      var certificateProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'certificates',"proofSubtype":'certificate'});
      var certProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'certificates',"proofSubtype":'editCertificate'});
      if(proofSubtype == "certificate"){
        if(certificateProof){
          TempProofDocs.update({"_id" : employementProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
      if(proofSubtype == "editCertificate"){
        if(certProof){
          TempProofDocs.update({"_id" : empProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
    }, 
    "addEmpTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      var employementProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'employement',"proofSubtype":'employementDetails'});
      var empProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'employement',"proofSubtype":'editEmployementDetails'});
      if(proofSubtype == "employementDetails"){
        if(employementProof){
          TempProofDocs.update({"_id" : employementProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
      if(proofSubtype == "editEmployementDetails"){
        if(empProof){
          TempProofDocs.update({"_id" : empProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
    },
    "addCurrentAddressTempDocs": function(imgLink,imgName,imgExt){
      var prooftype = 'address';
      var proofSubtype = 'currentAddress';
      var userId = Meteor.userId();
      var currentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'currentAddress'});
      if(currentAddrProof){
        TempProofDocs.update({"_id" : currentAddrProof._id},
          {
            $set:{
              "userId": userId,
              "imageLink":imgLink,
              "ext":imgExt,
              "name":imgName,
              "prooftype": prooftype,
              "proofSubtype":proofSubtype,
              "createdAt":new Date(),
            } //End of set
          },(error, result)=>{
        });  
      }else{
        TempProofDocs.insert({
          "userId": userId,
          "imageLink":imgLink,
          "ext":imgExt,
          "name":imgName,
          "prooftype": prooftype,
          "proofSubtype":proofSubtype,
          "createdAt":new Date(),
          },(error, result)=>{
        });
      }
    },
    "addAddrTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      var permanentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'permanentAddress'});
      var currentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'currentAddress'});
      var perAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editPermanentAddress'});
      var currAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editCurrentAddress'});
      if(proofSubtype == "permanentAddress"){
        if(permanentAddrProof){
          TempProofDocs.update({"_id" : permanentAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "currentAddress"){
        if(currentAddrProof){
          TempProofDocs.update({"_id" : currentAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editPermanentAddress"){
        if(perAddrProof){
          TempProofDocs.update({"_id" : perAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editCurrentAddress"){
        if(currAddrProof){
          TempProofDocs.update({"_id" : currAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
    },
    "addEduTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
      var basicEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'education',"proofSubtype": 'basicEducation'});
      var proEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'professionalEducation'});
      var basEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'education',"proofSubtype": 'editBasicEducation'});
      var profEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editProfessionalEducation'});
      if(proofSubtype == "basicEducation"){
        if(basicEduProof){
          TempProofDocs.update({"_id" : basicEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "professionalEducation"){
        if(proEduProof){
          TempProofDocs.update({"_id" : proEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editBasicEducation"){
        if(basEduProof){
          TempProofDocs.update({"_id" : basEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editProfessionalEducation"){
        if(profEduProof){
          TempProofDocs.update({"_id" : profEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
    }, 
    "insertBasicData": function (formValues) {
      // 
      if(formValues.firstName != '' && formValues.lastName != '' && formValues.fatherFirstName != '' &&
      formValues.fatherLastName != '' && formValues.motherFirstName != '' && formValues.motherLastName != '' &&
      formValues.gender != '' && formValues.dateOfBirth != '' && formValues.mobileNo != '' && 
      formValues.emailId != ''){
        var profileClass = '';
        var profilePercent = 15;
      }else if(formValues.firstName != '' && formValues.lastName != '' &&
       formValues.gender != '' && formValues.dateOfBirth != '' && 
       formValues.mobileNo != '' && formValues.emailId != ''){
        var profileClass = 'halfcompleteDetails';
        var profilePercent = 8;
      }else{
        var profileClass = 'halfcompleteDetails';
        var profilePercent = 8;
      }

      UserProfile.insert({
        "userId"          : formValues.userId,
        "firstName"       : formValues.firstName,
        "lastName"        : formValues.lastName,
        "fatherFirstName" : formValues.fatherFirstName,
        "fatherLastName"  : formValues.fatherLastName,
        "motherFirstName" : formValues.motherFirstName,
        "motherLastName"  : formValues.motherLastName,
        "spouseFirstName" : formValues.spouseFirstName,
        "spouseLastName"  : formValues.spouseLastName,
        "gender"          : formValues.gender,
        "dateOfBirth"     : formValues.dateOfBirth,
        "mobileNo"        : formValues.mobileNo,
        "altMobileNo"     : formValues.altMobileNo,
        "emailId"         : formValues.emailId,
        "altEmailId"      : formValues.altEmailId,
        'assureId'        : formValues.assureId,
        "proofType"       : formValues.proofType,
        "proofOfDocument" : formValues.proofOfDocument, 
        "fileExt"         : formValues.fileExt,
        "fileName"        : formValues.fileName,
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
        "companyReferences" : formValues.companyReferences,
        },(error, result)=>{
          if(error){
            
          }else{
            return result;
          }
      });
    }, 
    "updateBasicData" : function(getuserId,formValues) {
        if(formValues.firstName != '' && formValues.lastName != '' && formValues.fatherFirstName != '' &&
        formValues.fatherLastName != '' && formValues.motherFirstName != '' && formValues.motherLastName != '' &&
        formValues.gender != '' && formValues.dateOfBirth != '' && formValues.mobileNo != '' && 
        formValues.emailId != ''){
          var profileClass = '';
          var profilePercent = 15;
        }
        else if(formValues.firstName != '' && formValues.lastName != '' &&
         formValues.gender != '' && formValues.dateOfBirth != '' && 
         formValues.mobileNo != '' && formValues.emailId != ''){
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }else{
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }
      
        var profileBasicPercent = profilePercent;
        var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
        if(userData){
          if(userData.profileBasicPercent && userData.profilePercent){
            var newProfilePercent = userData.profilePercent - userData.profileBasicPercent;
            var updatedProfilePercent = newProfilePercent + profileBasicPercent;
          }else{
            var updatedProfilePercent = userData.profilePercent + profileBasicPercent;
          }
        }

        if(formValues.dateOfBirth != '' ){
          var profileBasicStatus = 'In Process';
        }else{
          var profileBasicStatus = 'Approved';
        }

        UserProfile.update({"userId":getuserId},{
        $set : {
          "firstName"       : formValues.firstName,
          "lastName"        : formValues.lastName,
          "fatherFirstName" : formValues.fatherFirstName,
          "fatherLastName"  : formValues.fatherLastName,
          "motherFirstName" : formValues.motherFirstName,
          "motherLastName"  : formValues.motherLastName,
          "spouseFirstName" : formValues.spouseFirstName,
          "spouseLastName"  : formValues.spouseLastName,
          "gender"          : formValues.gender,
          "dateOfBirth"     : formValues.dateOfBirth,
          "mobileNo"        : formValues.mobileNo,
          "altMobileNo"     : formValues.altMobileNo,
          "emailId"         : formValues.emailId,
          "altEmailId"      : formValues.altEmailId,
          "proofType"       : formValues.proofType,
          "profileBasicClass"  : profileClass,
          "profilePercent"  : updatedProfilePercent,
          "profileBasicPercent" : profileBasicPercent,
          "profileBasicStatus" :profileBasicStatus,
          "proofType"       : formValues.proofType,
        }
      });
    },
    'insertStatutory':function(id,adharCardNo,panCardNo,drivingCardNo,votingCardNo,rationCardNo,passportNo) {
      
      // if(adharCardNo != '' && panCardNo != '' && 
      //   adharCardProof1 != null && adharCardProof2 != null &&
      //   panCardProof1 != null && panCardProof2 != null){
      //   var profileClass = 'halfcompleteDetails';
      //   var profilePercent = 7;
      // }else 
      // if(adharCardNo != '' || panCardNo != '' || drivingCardNo != '' || 
      //   votingCardNo != '' || rationCardNo  != '' || passportNo != '' ||
      //   adharCardProof1 != null || adharCardProof2 != null || panCardProof1 != null || 
      //   panCardProof2 != null || drivingCardProof1 != null || drivingCardProof2 != null || 
      //   votingCardProof1 != null || votingCardProof2 != null || rationCardProof1 != null ||
      //   rationCardProof2 != null || passportProof1 != null || passportProof2 != null)
      if(adharCardNo != '' && panCardNo != ''){
        var profileClass = '';
        var profilePercent = 15;
        var profileIdentityStatus = 'In Process';
      }else if(adharCardNo != '' || panCardNo != '' || drivingCardNo != '' || 
        votingCardNo != '' || rationCardNo  != '' || passportNo != ''){
        var profileClass = 'halfcompleteDetails';
        var profilePercent = 8;
        var profileIdentityStatus = 'In Process';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileIdentityStatus = '';
      }

      var profileIdentityPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileIdentityPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileIdentityPercent;
          var updatedProfilePercent = newProfilePercent + profileIdentityPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileIdentityPercent;
        }
      }
      
      var keyName = "";
      var cardNo = "";
      
      if(adharCardNo){
        keyName="adharCardNo";
        cardNo = adharCardNo;
      }else if(panCardNo){
        keyName="panCardNo";        
        cardNo = panCardNo; 
      }else if(drivingCardNo){
        keyName="drivingCardNo";        
        cardNo = drivingCardNo;
      }else if(votingCardNo){
        keyName="votingCardNo";              
        cardNo  = votingCardNo;
      }else if(rationCardNo){
        keyName="rationCardNo";                      
        cardNo  = rationCardNo;
      }else if(passportNo){
        keyName="passportNo";                      
        cardNo = passportNo;      
      }
      UserProfile.update({"userId" : id},
        {$set : {
          "profileIdentityClass"    : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileIdentityPercent"  : profileIdentityPercent,
          "profileIdentityStatus"   : profileIdentityStatus,
          ["identity."+keyName]     : cardNo
        }
        }
      );
      
    },
    'insertPermanantAddress':function(id,permanentAddress) {
      // if(permanentAddress.line1 != '' && permanentAddress.landmark != '' && 
      //  permanentAddress.city != '' && permanentAddress.state != '' && permanentAddress.country != '' && 
      //  permanentAddress.pincode != '' && permanentAddress.residingFrom != '' && 
      //  permanentAddress.residingTo != ''){
    
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
    },
   'editPermanantAddress':function (id,permAddressId,selectedAddress) {
      if(selectedAddress.line1 != '' || selectedAddress.line2 != '' || selectedAddress.line3 != '' || 
       selectedAddress.landmark != '' || selectedAddress.city != '' || selectedAddress.state != '' || 
       selectedAddress.pincode != '' || selectedAddress.residingFrom != '' || 
       selectedAddress.residingTo != ''){
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
      UserProfile.update({"_id" : id, "permanentAddress.permanentAddressId" : parseInt(permAddressId)},
        {$set : 
            {
                "permanentAddress.$.line1"              : selectedAddress.line1,
                "permanentAddress.$.line2"              : selectedAddress.line2,
                "permanentAddress.$.line3"              : selectedAddress.line3,
                "permanentAddress.$.landmark"           : selectedAddress.landmark,
                "permanentAddress.$.city"               : selectedAddress.city,
                "permanentAddress.$.state"              : selectedAddress.state,
                "permanentAddress.$.country"            : selectedAddress.country,
                "permanentAddress.$.pincode"            : selectedAddress.pincode,
                "permanentAddress.$.residingFrom"       : selectedAddress.residingFrom,
                "permanentAddress.$.residingTo"         : selectedAddress.residingTo,
                "permanentAddress.$.proofType"          : selectedAddress.proofType,
                "permanentAddress.$.createdAt"          : new Date(),
                "permanentAddress.$.proofOfDocument"    : selectedAddress.proofOfDocument,
                "permanentAddress.$.fileName"           : selectedAddress.fileName,
                "permanentAddress.$.fileExt"            : selectedAddress.fileExt,
                "permanentAddress.$.verifiedStatus"     : selectedAddress.verifiedStatus,
                "permanentAddress.$.editStatus"         : selectedAddress.editStatus,
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
   },
   'editCurrentAddress':function (id,currentAddressId,selectedAddress) {
     
      if(selectedAddress.tempLine1 != '' || selectedAddress.tempLine2 != '' || selectedAddress.tempLine3 != '' || 
       selectedAddress.tempLandmark != '' || selectedAddress.tempCity != '' || selectedAddress.tempState != '' || 
       selectedAddress.tempPincode != '' || selectedAddress.tempresidingFrom != '' || 
       selectedAddress.tempresidingTo != ''){
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
      UserProfile.update({"_id" : id, "currentAddress.currentAddressId" : parseInt(currentAddressId)},
          {$set : 
              {
                  "currentAddress.$.tempLine1"           : selectedAddress.tempLine1,
                  "currentAddress.$.tempLine2"           : selectedAddress.tempLine2,
                  "currentAddress.$.tempLine3"           : selectedAddress.tempLine3,
                  "currentAddress.$.tempLandmark"        : selectedAddress.tempLandmark,
                  "currentAddress.$.tempCity"            : selectedAddress.tempCity,
                  "currentAddress.$.tempState"           : selectedAddress.tempState,
                  "currentAddress.$.tempCountry"         : selectedAddress.tempCountry,
                  "currentAddress.$.tempPincode"         : selectedAddress.tempPincode,
                  "currentAddress.$.tempresidingFrom"    : selectedAddress.tempresidingFrom,
                  "currentAddress.$.tempresidingTo"      : selectedAddress.tempresidingTo,
                  "currentAddress.$.proofType"           : selectedAddress.proofType,
                  "currentAddress.$.createdAt"           : new Date(),
                  "currentAddress.$.proofOfDocument"     : selectedAddress.proofOfDocument,
                  "currentAddress.$.fileName"            : selectedAddress.fileName,
                  "currentAddress.$.fileExt"             : selectedAddress.fileExt,
                  "currentAddress.$.verifiedStatus"      : selectedAddress.verifiedStatus,
                  "currentAddress.$.editStatus"          : selectedAddress.editStatus,
                }
         });
      UserProfile.update({"_id" : id},
      {$set : 
        {
          "profileAddressClass"     : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileCurrentPercent"   : profileCurrentPercent,
          'profileAddressStatus'    : profileAddressStatus,
        }
      }); 
   },
   'insertTemporaryAddress':function(id,currentAddress) {
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
    },
    'insertEducation':function(id,education) {

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
    },
    'updateEducation':function(id,education,index) {
      if(education.educationLevel != '' || education.educationQualification != '' || 
        education.educationMode != '' || education.dateAttendedFrom != '' || education.dateAttendedTo != '' || 
        education.collegeName != '' || education.university != '' || education.collegeAddress != '' || 
        education.rollNo != '' || education.specialization != '' || education.grades != ''|| education.city != '' || education.state != ''){
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

      UserProfile.update( {"userId" : id},
        {$set: 
            {
              ['education.'+index] : education , 
            }
        }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"   : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileAcademicsStatus"  : profileAcademicsStatus,
        }
      });
    },
    'insertProfessionalEducation':function(id,education) {
      if(education.professionalQualification != '' || education.registrationNo != '' || 
        education.dateOfQualification != '' || education.qualifyingBodyNm != '' || 
        education.professionalRollNo != ''){
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
        if(userData.profileEducationPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEducationPercent;
          var updatedProfilePercent = newProfilePercent + profileEducationPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEducationPercent;
        }
      }
      UserProfile.update({"userId" : id},
      {$push : {
          "professionalEducation" : education,
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
    },
    'updateProfessionalEducation':function(id,education,index) {
      if(education.professionalQualification != '' || education.registrationNo != '' || 
        education.dateOfQualification != '' || education.qualifyingBodyNm != '' || 
        education.professionalRollNo != ''){
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
        if(userData.profileEducationPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEducationPercent;
          var updatedProfilePercent = newProfilePercent + profileEducationPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEducationPercent;
        }
      }

      UserProfile.update ({"userId" : id},
      {$set: 
          {
            ['professionalEducation.'+index] : education , 
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
    },
    'insertEmployement':function(id,employement) {
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
    },
    'updateEmployement':function(id,employement,index) {
      if(employement.nameOfEmployer != '' || employement.employerAddress != '' || 
        employement.contactNo != '' || employement.employeeCode != '' || employement.designation != '' ||
        employement.department != '' || employement.employmentFrom != '' || employement.employmentTo != '' ||
        employement.lastSalaryDrawn != '' || employement.typeOfEmployement != '' || 
        employement.detailOfAgency != '' || employement.reasonOfLeaving != '' || employement.dutiesAndResponsibilites != '' || 
        employement.reportingManagerNm != '' || employement.prevDesignation != ''
        || employement.contactDetails != ''  || employement.employerState != '' || employement.employerCity != ''){
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

      UserProfile.update(
        {"userId" : id},
        {$set: 
            {
              ['employement.'+index] : employement , 
            }
        }
      ); 
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEmploymentPercent"  : profileEmploymentPercent,
          "profileEmploymentClass"    : profileClass,
          "profilePercent"            : updatedProfilePercent,
          "profileEmploymentStatus"   : profileEmploymentStatus,
        }
      });
    },
    'insertOtherInformation':function(id,otherInformation) {
      var profileClass = '';
      var profilePercent = 14;
      var profileOtherInfoPercent = profilePercent;
      
      if(otherInformation.otherBusinessInvolving != '' || otherInformation.dismissedFromService !='' || 
      otherInformation.criminalOffence != '' || otherInformation.civilJudgments !=''){
        var profileOtherInfoStatus = 'In Process';
      }else{
        var profileOtherInfoStatus = '';
      }

      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileOtherInfoPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileOtherInfoPercent;
          var updatedProfilePercent = newProfilePercent + profileOtherInfoPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileOtherInfoPercent;
        }
      }

      UserProfile.update({"userId" : id},
        {$set : {
          "otherBusinessInvolving" :  otherInformation.otherBusinessInvolving,
          "dismissedFromService"   :  otherInformation.dismissedFromService,
          "criminalOffence"        :  otherInformation.criminalOffence,
          "civilJudgments"         :  otherInformation.civilJudgments,
          "profileOtherInfoClass"  :  profileClass,
          "profilePercent"         :  updatedProfilePercent,
          "profileOtherInfoPercent":  profileOtherInfoPercent,
          "profileOtherInfoStatus" :  profileOtherInfoStatus,
        }
      });
    },
    'insertBasicProof':function(id){
      var data = ProofDocuments.findOne({"_id" : id});
      UserProfile.update({"userId" : Meteor.userId()},
        {$set : {
          proofOfDocument : "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path,
          fileExt : data.ext,
          fileName : data.name,
        }
      });
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
    'removeReference':function(index){
      // var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      // if(userData){
      //   if(userData.profileEducationPercent == 14){
      //     var profilePercent = 14;
      //   }else{
      //     var profilePercent = 0;
      //   }
      //   if(userData.education && userData.professionalEducation){
      //     if(userData.education.length == 1 && userData.professionalEducation.length == 0){
      //       var profileEducationPercent = 0;
      //       var updatedProfilePercent = userData.profilePercent - profilePercent;
      //       var profileClass = 'incompleteDetails';
      //     }else{
      //       var profileEducationPercent = userData.profileEducationPercent;
      //       var updatedProfilePercent = userData.profilePercent;
      //       var profileClass = userData.profileAcademicsClass;
      //     }
      //   }else if(userData.education.length == 1){
      //     var profileEducationPercent = 0;
      //     var updatedProfilePercent = userData.profilePercent - profilePercent;
      //     var profileClass = 'incompleteDetails';
      //   }else{
      //     var profileEducationPercent = userData.profileEducationPercent;
      //     var updatedProfilePercent = userData.profilePercent;
      //     var profileClass = userData.profileAcademicsClass;
      //   }

      //   if(userData.professionalEducation){
      //     if(userData.professionalEducation.length == 0 && userData.education.length == 1){
      //       var profileAcademicsStatus = '';
      //     }else{
      //       var profileAcademicsStatus = 'In Process';
      //     }
      //   }else if(userData.education.length == 1){
      //     var profileAcademicsStatus = '';
      //   }else{
      //     var profileAcademicsStatus = 'In Process';
      //   }
      // }   
      
      // UserProfile.update({"userId" : Meteor.userId()},
      // {$set : 
      //   {
      //     "profileEducationPercent" : profileEducationPercent,
      //     "profileAcademicsClass"   : profileClass,
      //     "profilePercent"          : updatedProfilePercent,
      //     "profileAcademicsStatus"  : profileAcademicsStatus,
      //   }
      // });       
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['reference.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['reference'] : null ,
            }
        }
      ); 
    },
    'updateReference':function(id,reference,referenceId){
      UserProfile.update({"userId" : id, "reference.referenceId" : parseInt(referenceId)},
          {$set : 
              {
                  "reference.$.referralFirstName"            : reference.referralFirstName,
                  "reference.$.referralLastName"             : reference.referralLastName,
                  "reference.$.referralMobileNum"            : reference.referralMobileNum,
                  "reference.$.referralEmailID"              : reference.referralEmailID,
                  "reference.$.referralOrganization"         : reference.referralOrganization,
                  "reference.$.referralDesignation"          : reference.referralDesignation,
                  "reference.$.tempCountry"                  : reference.tempCountry,
                  "reference.$.referralRelationship"         : reference.referralRelationship,
                  "reference.$.referralAssociatedSinceMonths": reference.referralAssociatedSinceMonths,
                  
                }
         });
    },
    'removeBasicProof':function(imageLink,filename,fileext,){
      UserProfile.update({"userId" : Meteor.userId()},
        {$set : {
          proofOfDocument : '',
          fileExt : '',
          fileName : '',
        }
      });
    },
    'removeTempProofDocs':function(imgLink){
      TempProofDocs.remove({'_id':imgLink});
    },
    'removeTempDocProofs':function(imgLinkName,imgName,extName,index,subtype){
      if(subtype == 'employementDetails'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['employement.'+index+'.proofOfDocument'] : '' , 
                ['employement.'+index+'.fileName'] : '' , 
                ['employement.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editEmployementDetails'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['employement.'+index+'.proofOfDocument'] : '' , 
                ['employement.'+index+'.fileName'] : '' , 
                ['employement.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'basicEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['education.'+index+'.proofOfDocument'] : '' , 
                ['education.'+index+'.fileName'] : '' , 
                ['education.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editBasicEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['education.'+index+'.proofOfDocument'] : '' , 
                ['education.'+index+'.fileName'] : '' , 
                ['education.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'professionalEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['professionalEducation.'+index+'.proofOfDocument'] : '' , 
                ['professionalEducation.'+index+'.fileName'] : '' , 
                ['professionalEducation.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editProfessionalEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['professionalEducation.'+index+'.proofOfDocument'] : '' , 
                ['professionalEducation.'+index+'.fileName'] : '' , 
                ['professionalEducation.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'permanentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['permanentAddress.'+index+'.proofOfDocument'] : '' , 
                ['permanentAddress.'+index+'.fileName'] : '' , 
                ['permanentAddress.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editPermanentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['permanentAddress.'+index+'.proofOfDocument'] : '' , 
                ['permanentAddress.'+index+'.fileName'] : '' , 
                ['permanentAddress.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'currentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['currentAddress.'+index+'.proofOfDocument'] : '' , 
                ['currentAddress.'+index+'.fileName'] : '' , 
                ['currentAddress.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editCurrentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['currentAddress.'+index+'.proofOfDocument'] : '' , 
                ['currentAddress.'+index+'.fileName'] : '' , 
                ['currentAddress.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'certificate'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['certificates.'+index+'.proofOfDocument'] : '' , 
                ['certificates.'+index+'.fileName'] : '' , 
                ['certificates.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }else if(subtype == 'editCertificate'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$set: 
              {
                ['certificates.'+index+'.proofOfDocument'] : '' , 
                ['certificates.'+index+'.fileName'] : '' , 
                ['certificates.'+index+'.fileExt'] : '' , 
              }
          }
        ); 
      }
    },
    'removeIdentityProofDocs':function(imgLink,subtype,imgname,imgext){
      UserProfile.update({"userId" : Meteor.userId()},
        {
          $set:{
            ["identity."+subtype] :  '',
            ["identity."+subtype+'name'] :  '',
            ["identity."+subtype+'ext'] :  '',
          } //End of set
        },(error, result)=>{
      });            
    },
    'removeBasicEducation':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEducationPercent == 14){
          var profilePercent = 14;
        }else{
          var profilePercent = 0;
        }
        if(userData.education && userData.professionalEducation){
          if(userData.education.length == 1 && userData.professionalEducation.length == 0){
            var profileEducationPercent = 0;
            var updatedProfilePercent = userData.profilePercent - profilePercent;
            var profileClass = 'incompleteDetails';
          }else{
            var profileEducationPercent = userData.profileEducationPercent;
            var updatedProfilePercent = userData.profilePercent;
            var profileClass = userData.profileAcademicsClass;
          }
        }else if(userData.education.length == 1){
          var profileEducationPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileEducationPercent = userData.profileEducationPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAcademicsClass;
        }

        if(userData.professionalEducation){
          if(userData.professionalEducation.length == 0 && userData.education.length == 1){
            var profileAcademicsStatus = '';
          }else{
            var profileAcademicsStatus = 'In Process';
          }
        }else if(userData.education.length == 1){
          var profileAcademicsStatus = '';
        }else{
          var profileAcademicsStatus = 'In Process';
        }
      }   
      
      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"   : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileAcademicsStatus"  : profileAcademicsStatus,
        }
      });       
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['education.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['education'] : null ,
            }
        }
      ); 
    },
    'removeProfessionalEducation':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEducationPercent == 14){
          var profilePercent = 14;
        }else{
          var profilePercent = 0;
        }

        if(userData.education && userData.professionalEducation){
          if(userData.professionalEducation.length == 1 && userData.education.length == 0){
            var profileEducationPercent = 0;
            var updatedProfilePercent = userData.profilePercent - profilePercent;
            var profileClass = 'incompleteDetails';
          }else{
            var profileEducationPercent = userData.profileEducationPercent;
            var updatedProfilePercent = userData.profilePercent;
            var profileClass = userData.profileAcademicsClass;
          }
        }else if(userData.professionalEducation.length == 1){
          var profileEducationPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileEducationPercent = userData.profileEducationPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAcademicsClass;
        }

        if(userData.education){
          if(userData.education.length == 0 && userData.professionalEducation.length == 1){
            var profileAcademicsStatus = '';
          }else{
            var profileAcademicsStatus = 'In Process';
          }
        }else if(userData.professionalEducation.length == 1){
          var profileAcademicsStatus = '';
        }else{
          var profileAcademicsStatus = 'In Process';
        }
      }   
      
      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"   : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileAcademicsStatus"  : profileAcademicsStatus,
        }
      });     
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['professionalEducation.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['professionalEducation'] : null ,
            }
        }
      ); 
    },
    'removeEmploymentData':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEmploymentPercent == 14){
          var profilePercent = 14;
        }else{
          var profilePercent = 0;
        }

        if(userData.employement){
          if(userData.employement.length == 1){
            var profileEmploymentPercent = 0;
            var updatedProfilePercent = userData.profilePercent - profilePercent;
            var profileClass = 'incompleteDetails';
            var profileEmploymentStatus = '';
          }else{
            var profileEmploymentPercent = userData.profileEmploymentPercent;
            var updatedProfilePercent = userData.profilePercent;
            var profileClass = userData.profileEmploymentClass;
            var profileEmploymentStatus = 'In Process';
          }
        }else{
          var profileEmploymentPercent = userData.profileEmploymentPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileEmploymentClass;
          var profileEmploymentStatus = 'In Process';
        }
      }  

      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profileEmploymentPercent"  : profileEmploymentPercent,
          "profileEmploymentClass"    : profileClass,
          "profilePercent"            : updatedProfilePercent,
          "profileEmploymentStatus"   : profileEmploymentStatus,
        }
      });
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['employement.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['employement'] : null ,
            }
        }
      ); 
    },
    'removeCertificateData':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent == 14){
          var profilePercent = 14;
        }else{
          var profilePercent = 0;
        }

        if(userData.certificates && userData.skills){
          if(userData.certificates.length == 1  && userData.skills.length == 0){
            var profileSkillsCertPercent = 0;
            var updatedProfilePercent = userData.profilePercent - profilePercent;
            var profileClass = 'incompleteDetails';
          }else{
            var profileSkillsCertPercent = userData.profileSkillsCertPercent;
            var updatedProfilePercent = userData.profilePercent;
            var profileClass = userData.profileAddressClass;
          }  
        }else if(userData.certificates.length == 1){
          var profileSkillsCertPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileSkillsCertPercent = userData.profileSkillsCertPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAddressClass;
        } 

        if(userData.skills){
          if(userData.skills.length == 0 && userData.certificates.length == 1){
            var profileSkillsCertStatus = '';
          }else{
            var profileSkillsCertStatus = 'In Process';
          }
        }else if(userData.certificates.length == 1){
          var profileSkillsCertStatus = '';
        }else{
          var profileSkillsCertStatus = 'In Process';
        }
      }  

      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profileSkillsCertClass"    : profileClass,
          "profileSkillsCertPercent"  : profileSkillsCertPercent,
          "profilePercent"            : updatedProfilePercent,
          "profileSkillsCertStatus"   : profileSkillsCertStatus,
        }
      }); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['certificates.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['certificates'] : null ,
            }
        }
      ); 
    },
    'removePermanentAddress':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profilePermanentPercent == 7){
          var profilePercent = 7;
        }else{
          var profilePercent = 0;
        }
        if(userData.permanentAddress.length == 1){
          var profilePermanentPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profilePermanentPercent = userData.profilePermanentPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAddressClass;
        }

        if(userData.profileCurrentPercent){
          if(userData.profileCurrentPercent == 7 && profilePermanentPercent == 0){
            var profileClass = 'halfcompleteDetails';
          }
          if(profilePermanentPercent + userData.profileCurrentPercent == 14){
            var profileClass = '';
          } 
        }

        if(userData.currentAddress){
          if(userData.currentAddress.length == 0 && userData.permanentAddress.length == 1){
            var profileAddressStatus = '';
          }else{
            var profileAddressStatus = 'In Process';
          }
        }else if(userData.permanentAddress.length == 1){
          var profileAddressStatus = '';
        }else{
          var profileAddressStatus = 'In Process';
        }
      }  

      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profilePermanentPercent"  : profilePermanentPercent,
          "profileAddressClass"      : profileClass,
          "profilePercent"           : updatedProfilePercent,
          "profileAddressStatus"     : profileAddressStatus,
        }
      });
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['permanentAddress.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['permanentAddress'] : null ,
            }
        }
      ); 
    },
    'removeCurrentAddress':function(index){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileCurrentPercent == 7){
          var profilePercent = 7;
        }else{
          var profilePercent = 0;
        }

        if(userData.currentAddress.length == 1){
          var profileCurrentPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileCurrentPercent = userData.profileCurrentPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAddressClass;
        }

        if(userData.profilePermanentPercent){
          if(userData.profilePermanentPercent == 7 && profileCurrentPercent == 0){
            var profileClass = 'halfcompleteDetails';
          }
          if(profileCurrentPercent + userData.profilePermanentPercent == 14){
            var profileClass = '';
          } 
        }

        if(userData.currentAddress.length == 1 && userData.profilePermanentPercent.length == 0){
          var profileAddressStatus = '';
        }else{
          var profileAddressStatus = 'In Process';
        }

        if(userData.permanentAddress){
          if(userData.permanentAddress.length == 0 && userData.currentAddress.length == 1){
            var profileAddressStatus = '';
          }else{
            var profileAddressStatus = 'In Process';
          }
        }else if(userData.currentAddress.length == 1){
          var profileAddressStatus = '';
        }else{
          var profileAddressStatus = 'In Process';
        }
      } 

      UserProfile.update({"userId" : Meteor.userId()},
      {$set : 
        {
          "profileCurrentPercent"    : profileCurrentPercent,
          "profileAddressClass"      : profileClass,
          "profilePercent"           : updatedProfilePercent,
          "profileAddressStatus"     : profileAddressStatus,
        }
      });
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['currentAddress.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['currentAddress'] : null ,
            }
        }
      ); 
    },
    "addSkills" : function (id,skills) {
      var skillObj = UserProfile.findOne({"userId" : id}, {sort: {'skills.skillsId': -1}});

      if(skills.skillName != ''){
        var profileClass = '';
        var profilePercent = 14;
        var profileSkillsCertStatus ='In Process';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileSkillsCertStatus = '';
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent == 14 && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.certificates){
          if(userData.certificates.certificateName != ''){
            var profileClass = '';
          }
        }
      } 
        if(skillObj){
          if (skillObj.skills) {
            if (skillObj.skills.length > 0) {
              var lastelem = _.last(skillObj.skills);
              var skillsId =  parseInt(lastelem.skillsId) + 1;
            }else{
              var skillsId =  1;
            }
          }          
          else{
            var skillsId =  1;
          }
        }else{
          var skillsId =  1;
        }
       UserProfile.update({"userId" : id},
        {$push : {
          "skills" : {
            "skillsId" : skillsId,
            "skillName" : skills.skillName,
          },
         }
       }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"   : profileClass,
          "profileSkillsCertPercent" : profileSkillsCertPercent,
          "profilePercent"           : updatedProfilePercent,
          "profileSkillsCertStatus"  : profileSkillsCertStatus,
        }
      }); 
    },
    "deleteSkills" :function (skillIndex,userId){
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent == 14){
          var profilePercent = 14;
        }else{
          var profilePercent = 0;
        }
        if(userData.skills  && userData.certificates){
          if(userData.skills.length == 1  && userData.certificates.length == 0){
            var profileSkillsCertPercent = 0;
            var updatedProfilePercent = userData.profilePercent - profilePercent;
            var profileClass = 'incompleteDetails';
          }else{
            var profileSkillsCertPercent = userData.profileSkillsCertPercent;
            var updatedProfilePercent = userData.profilePercent;
            var profileClass = userData.profileAddressClass;
          }
        }else if(userData.skills.length == 1){
          var profileSkillsCertPercent = 0;
          var updatedProfilePercent = userData.profilePercent - profilePercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileSkillsCertPercent = userData.profileSkillsCertPercent;
          var updatedProfilePercent = userData.profilePercent;
          var profileClass = userData.profileAddressClass;
        }

        if(userData.certificates){
          if(userData.certificates.length == 0 && userData.skills.length == 1){
            var profileSkillsCertStatus = '';
          }else{
            var profileSkillsCertStatus = 'In Process';
          }
        }else if(userData.skills.length == 1){
          var profileSkillsCertStatus = '';
        }else{
          var profileSkillsCertStatus = 'In Process';
        }
      }  

      UserProfile.update({"userId" : userId},
      {$set : 
        {
          "profileSkillsCertClass"    : profileClass,
          "profileSkillsCertPercent"  : profileSkillsCertPercent,
          "profilePercent"            : updatedProfilePercent,
          "profileSkillsCertStatus"   : profileSkillsCertStatus,
        }
      }); 
      UserProfile.update({"userId" : userId}, 
        {$unset : {
          ['skills.'+skillIndex] : 1
        }
      });
      UserProfile.update({'userId': userId}, {$pull : {'skills' : null}});  
    },
    "addCertificates":function (id,certificates) {
      if(certificates.certificateName != ''){
        var profileClass = '';
        var profilePercent = 14;
        var profileSkillsCertStatus = 'In Process';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileSkillsCertStatus = '';
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent == 14 && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.skills){
          if(userData.skills.skillName != ''){
            var profileClass = '';
          }
        }
      } 

      UserProfile.update({"userId" : id},
        {$push : {
          "certificates" : certificates,
         }
       }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"    : profileClass,
          "profileSkillsCertPercent"  : profileSkillsCertPercent,
          "profilePercent"            : updatedProfilePercent,
          "profileSkillsCertStatus"   : profileSkillsCertStatus,
        }
      }); 
    },
    "updateCertificate":function (id,certificates,index) {
      if(certificates.certificateName != ''){
        var profileClass = '';
        var profilePercent = 14;
        var profileSkillsCertStatus = 'In Process';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
        var profileSkillsCertStatus = '';
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.skills){
          if(userData.skills.length > 0){
            var profileClass = '';
          }
        }
      } 

      UserProfile.update(
        {"userId" : id},
        {$set: 
            {
              ['certificates.'+index] : certificates , 
            }
        }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"    : profileClass,
          "profileSkillsCertPercent"  : profileSkillsCertPercent,
          "profilePercent"            : updatedProfilePercent,
          "profileSkillsCertStatus"   : profileSkillsCertStatus,
        }
      });  
    },
    "insertViewedUser":function (formValues,id) {
      UserProfile.update({"userId" : id},
        {$push : {
          "viewedByPeople" : formValues,
        }
       }
      );
    },
    "insertViewedCompany":function (formValues,id) {
      UserProfile.update({"userId" : id},
        {$push : {
          "viewedByCompanies" : formValues,
        }
       }
      );
    },
    'updateReopenStatus':function(userId,verificationType,verificationId){
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

      UserProfile.update(
        {'userId':userId, [verificationType+'.'+verificationUniqueId] : parseInt(verificationId)},
        { $set:{
                [verificationType+'.$'+'.verifiedStatus']   : "In Process",
                [verificationType+'.$'+'.editStatus']       : "Block" ,
          } 
        }
      );
    },
    'addCompanyAdmin':function (formValues,id) {
      UserProfile.update({"userId" : id},
        {$push : {
          "company" : formValues,
        }
       }
      );
    },
    'addCompanyReferences':function (formValues,id) {
      
      UserProfile.update({"assureId" : id},
        {$push : {
          "companyReferences" : formValues,
        }
       },(error,result)=>{
        if(error){
          
        }else{
          
        }
       }
      );
    },
  });
}