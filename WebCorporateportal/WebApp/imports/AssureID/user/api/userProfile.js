import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const UserProfile = new Mongo.Collection("userProfile");
export const TempProofDocs = new Mongo.Collection("tempProofDocs");
import { ProofDocuments } from "/imports/AssureID/user/UploadToServer/ProofUploadServer.js";

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
  	// Insert basic info in Userprofile
  	"insertBasicData": function (formValues) { 
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
        },(error, result)=>{
          if(error){
            
          }else{
            return result;
          }
      });
    }, 
    // send verification data from order to user
    'sendVerifivacationData':function (id,verificationData,candidateIndex,orderId) {
    	var userprofile = UserProfile.findOne({"userId": id});
    	if (userprofile) {
         verificationData.map((verificationData,i)=>{
         	if (verificationData.verificationType == "permanentAddress") {
            Meteor.call("insertPermanantAddress",id,verificationData,function(error,result) {
            	if (error) {
                 console.log(error.reason);
            	}else{
            		var verificationId = result;
            		var id             = "permanentAddressId";
            		var verificationIndex = i ;
            		Meteor.call("updateIdInOrders",orderId,candidateIndex,verificationId,id,verificationIndex);
            	}
            });
         	}else if (verificationData.verificationType == "currentAddress") {
            Meteor.call("insertCurrentAddress",id,verificationData,function (error,result) {
            	if (error) {
            		 console.log(error.reason);
            	}else{
            		var verificationId = result;
            		var id             = "currentAddressId";
            		var verificationIndex = i ;
            		Meteor.call("updateIdInOrders",orderId,candidateIndex,verificationId,id,verificationIndex);
            	}
            });
         	}
         });
    	} 
    },
    // insert permanent address method
    'insertPermanantAddress':function(id,permanentAddress) {
    	var educationId = 1;
       var addressObj = UserProfile.findOne({"userId": id}, {sort: {'education.educationId': -1}});
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
    "addAddrTempProofDocs": function (id,userId,prooftype,proofSubtype,dataIndex,orderId,proofTypeName) {
      var data      = ProofDocuments.findOne({"_id" : id});
      var imageLink = data.link();
      var permanentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'permanentAddress'});
      var currentAddrProof  = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'currentAddress'});
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
                "dataIndex"   : dataIndex,
                "orderId"     : orderId,
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
            "dataIndex"   : dataIndex,
            "orderId"     : orderId,
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
                "dataIndex"   : dataIndex,
                "orderId"     : orderId,
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
            "dataIndex"   : dataIndex,
            "orderId"     : orderId,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      var documentInUserprofile =  {
        "proofType"       : proofTypeName,
        "proofOfDocument" : imageLink,
        "fileName"        : data.name,
        "fileExt"         : data.ext
      }
      Meteor.call("InsertImageInOrder",orderId,userId,dataIndex,prooftype,documentInUserprofile,function (error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          TempProofDocs.remove({});
        }
      });
    },
    //User creation by company
  'createUserAccountByCompany' : function(formValues){
    var newUserId = Accounts.createUser({
      username        : formValues.emailId,
      email           : formValues.emailId,
      password        : formValues.signupPassword,
      profile     : {   
        firstname     : formValues.firstName, 
        lastname      : formValues.lastName,
        mobNumber     : formValues.mobileNo,
        userProfile   : '',
        assureId      : formValues.assureId,
        loginAs       : 'user',
        status        : 'Active',
        profileInsert : true,
        createdOn     : new Date(),
        userCode      : formValues.signupPassword.split("").reverse().join(""),
      },
    });
    if(newUserId){
      Meteor.users.update(
        {'_id': newUserId },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }); //end of update

      formValues.userId = newUserId;
       Meteor.call('insertBasicDataFromCompany',formValues,function(error,result){
        if(error){
          console.log('insertBasicDataFromCompany error ',error);
        }else{
          if(result){
            console.log('insertBasicDataFromCompany result ',result);
            Meteor.call('addRoles',formValues.userId, "user", function(error,result){
              if(error){
                console.log('addRoles error',error);
              }else{    
                if(result){
                                                                                                         
                }
              }//end of else
            });//add roles method ends
          }else{
            console.log('insertBasicDataFromCompany something wrong');
          }
        }
      });  
    }
    return newUserId;
  },
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
        "gender"          : formValues.gender,
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

  });
}
