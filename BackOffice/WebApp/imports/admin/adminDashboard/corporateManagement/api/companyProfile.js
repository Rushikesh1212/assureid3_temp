import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';


export const CompanyProfile = new Mongo.Collection("companyProfile");
export const TempCompanyImages = new Mongo.Collection("tempCompanyImages");
export const TempContractDocuments = new Mongo.Collection("tempContractDocuments");

import {CompanyLogoImage} from '/imports/admin/adminDashboard/uploadToServer/ProofUploadServer.js';
import { ContractDocuments } from "/imports/admin/adminDashboard/uploadToServer/UploadContractDocToServer.js";



if(Meteor.isServer){

  Meteor.publish('companyProfileData',(assureId)=>{
   return CompanyProfile.find({"companyAssureID": assureId});
  }); 
  Meteor.publish('companyProfileDetails',()=>{
   return CompanyProfile.find({});
  });  
  Meteor.publish('singleCompanyProfile',(id)=>{
    return CompanyProfile.find({"_id":id});
   });
  
  Meteor.publish('tempCompanyImages',(userId)=>{
    return TempCompanyImages.find({"userId": userId});
  });
  Meteor.publish('companyTempImg',(userId,type)=>{
    return TempCompanyImages.find({"userId": userId,"type" : type},{sort:{createdAt:-1}});
  });
  Meteor.publish('alltempCompanyImages',(userId)=>{
    return TempCompanyImages.find({});
  });
  Meteor.publish('spocListCorp',()=>{
    return CompanyProfile.find({},{userId: 1,companyName: 1, companyAssureID: 1})
  });
 
  Meteor.methods({
    "addCompanyLogoImage": function(fileObj,userId,type){
      var imageData = CompanyLogoImage.findOne({'_id':fileObj._id});
      if(imageData){
        var companyProfileData = TempCompanyImages.findOne({'userId':userId,'type':type});
        if(companyProfileData){
          TempCompanyImages.update(
            {'userId': userId },
            {
              $set:{
                "companyImage"      : imageData.link(),
                "companyFileName"   : imageData.name,
                "companyFileExt"    : imageData.ext,
                'type'              : type,
              } //End of set
            }
          );
        }else{
          TempCompanyImages.insert({
            "userId"            : userId,
            "companyImage"      : imageData.link(),
            "companyFileName"   : imageData.name,
            "companyFileExt"    : imageData.ext,
            'type'              : type,
            'createAt'          : new Date()
            },(error, result)=>{
          });
        }
      }
    },

    'removeTempCompanyImages':function(imgId){
      TempCompanyImages.remove({'_id':imgId});
    },
    "companyImg":function (userId,type) {
      var result = TempCompanyImages.findOne({"userId": userId,"type" : type},{sort:{createdAt:-1}});
      if (result) {
        var Id = result._id;
        return Id;
        
      }
    },
    /**============================Nilam Added function ========================================*/

    'createCompanyUserByAdmin':function(createUserFormValues){ 
      var signupmail = createUserFormValues.emails[0].address;      
      var users = Meteor.users.findOne({'emails.address' : signupmail});
      if(users){ 
        return 'emailIdExist';
      }else{
        var newUser = Accounts.createUser({
          email           : signupmail,
          password        : createUserFormValues.signupPassword,
          profile         : {
            name          : createUserFormValues.name,
            mobNumber     : createUserFormValues.mobNumber,
            assureId      : "",
            changedPassword:false,
            status        : 'Active',
            profileInsert : true,
            createdOn     : new Date(),
            authorizedPerson : createUserFormValues.authorizedPerson,
            userCode      : createUserFormValues.signupPassword.split("").reverse().join(""),
          },
        });
        // Meteor.users.update({'_id':newUser},{$set:{'email.accessPersonContact':createUserFormValues.emails[0].accessPersonContact}})
        if(newUser && createUserFormValues.emails.length > 1){
          for(i=1;i<createUserFormValues.emails.length;i++){
            Accounts.addEmail(newUser,createUserFormValues.emails[i].address,true);
          }
        }
        Meteor.users.update(
          {"_id":newUser},
          {
            $set:{
              'emails.0.verified':true,
            }
          }
      )
      TempCompanyImages.remove({"userId" : Meteor.userId(),"type" : "companyProfile"});
        return newUser;
      }
    },

    'insertComapnyBasicInfo': function(formValues){
      var latestUsersDetails  = CompanyProfile.findOne({},{sort: {"createdAt":-1}});
      if(latestUsersDetails){
        if(latestUsersDetails.companyAssureID){
          var str = latestUsersDetails.companyAssureID;
        }else{
          var str = "IN-CAA-000000";
        }
      }else{
        var str = "IN-CAA-000000";
      }
      var type = 'company';
      var splitStr = str.split('-');
      //splitStr[0] - Country Code
      //splitStr[1] - Character Code
      //splitStr[2] - Number
      //Number Logic
      // document.getElementById("demo").innerHTML = str;
      var firstChar = splitStr[1].substr(2,1);
      var middleChar = splitStr[1].substr(1,1);
      var lastChar = splitStr[1].substr(0,1);
      //Charcter Code Calculation
      //if DEG - then G - last E - middle D - first
      //var first2Char = splitStr[1].substr(1,1); /*second digit*/
       
      var number = parseInt(splitStr[2]);
      var last = number + 1;
      var last0 = '0';
      if(last > 0 && last < 11){
        last0 = '00000' + last;
        if(last == 10){last0 = '0000' + last;}
      }else if(last > 10 && last < 101){
        last0 = '0000' + last;
        if(last == 100){last0 = '000' + last;}
      }else if(last > 100 && last < 1001){
        last0 = '000' + last;
        if(last == 1000){last0 = '00' + last;}
      }else if(last > 1000 && last < 10001){
        last0 = '00' + last;
        if(last == 10000){last0 = '0' + last;}
      }else if(last > 10000 && last < 100001){
        last0 = last;
      }else if(last > 999999){
        last0 = '000000';         
        if(firstChar != 'Z'){
          var firstAscii = firstChar.charCodeAt();
          firstAscii = firstAscii + 1;
          firstChar = String.fromCharCode(firstAscii);
        }else{
          firstChar = 'A'; 
          if(middleChar != 'Z'){
            var middleAscii  = middleChar.charCodeAt();
            middleAscii  = middleAscii  + 1;
            middleChar = String.fromCharCode(middleAscii );
          }else{
            middleChar = 'A'; 
            if(type == 'user'){
              var lastAscii = lastChar.charCodeAt();
              if(lastChar == 'B'){
                lastAscii = lastAscii + 2;
              }else{
                lastAscii = lastAscii + 1;
              }
              lastChar = String.fromCharCode(lastAscii );
            }
          } 
        }
      }
      var newAssureID = splitStr[0] + '-' + lastChar+middleChar+firstChar + '-' + last0;
      if(newAssureID){
        
        if(formValues.companyName != '' && formValues.companyWebsite != '' && formValues.companyPanNo != '' &&
        formValues.companycinNo != '' && formValues.companyCity != '' && formValues.companyState != '' &&
        formValues.companyCountry != '' && formValues.companyPincode != ''){
          var profileClass = '';
          var companyProfilePercent = 34;
        }
        else if(formValues.companyName != '' && formValues.companycinNo != '' ){
          var profileClass = 'halfcompleteDetails';
          var companyProfilePercent = 17;
        }else{
          var profileClass = 'incompleteDetails';
          var companyProfilePercent = 0;
        }
        
        var profileBasicPercent = companyProfilePercent; 
        var profileSettingPercent = 33;
        var userData  = CompanyProfile.findOne({"userId" : Meteor.userId()});
        var updatedcompanyProfilePercent = profileBasicPercent + profileSettingPercent; 

        var userCompanyCreate = CompanyProfile.insert({
          "userId"            : formValues.userId,
          "companyLogo"       : formValues.companyLogo, 
          "companyName"       : formValues.companyName,
          "companyWebsite"    : formValues.companyWebsite,
          "companyPanNo"      : formValues.companyPanNo,
          "companycinNo"      : formValues.companycinNo,
          "companyAddress"      : formValues.companyAddress,
          "companyCity"         : formValues.companyCity,
          "companyState"        : formValues.companyState,
          "companyCountry"      : formValues.companyCountry,
          "companyPincode"      : formValues.companyPincode,
          "companyDescription"  : formValues.companyDescription,
          "companyAssureID"       : newAssureID,
          "employee"              : [],
          "authorizedPerson"      : formValues.authorizedPerson,
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileBasicPercent"   : profileBasicPercent,
          "profileBasicClass"     : profileClass,
          "profileBasicStatus"    : "",
          "profileLocationClass"  : "incompleteDetails",
          "profileLocationStatus" : "",
          "profileSettingPercent" : profileSettingPercent,
          "profileSettingClass"   : "",
          "createdAt"             : new Date(),
          "paymentBy"             : "Company",
          "accountStatus"         : "Active"
          });

        var companyData = CompanyProfile.findOne({"companyAssureID":newAssureID},{sort: {"createdAt":-1}});
        if(companyData){
          var companyValues = {
            "companyId"       : companyData._id,
            "companyName"     : companyData.companyName,
            "companyAssureid" : companyData.companyAssureID,
            "role"            : 'companyAdmin',
          }
        }

        TempCompanyImages.remove({});
        var companyProfileDetails = CompanyProfile.findOne({"_id":userCompanyCreate});
        if(companyProfileDetails){
          var comapnyInfo = {
            "comapnyId"       : companyProfileDetails._id,
            "companyAssureID" : companyProfileDetails.companyAssureID,
          } 
          return comapnyInfo;
        }
      }
    },

    'UpdateCompanyUserByAdmin' :function(formValues,companyId){
      var userCompanyCreate = CompanyProfile.update({"_id":companyId},
      {$set:{
        "userId"              : formValues.userId,
        "companyLogo"         : formValues.companyLogo, 
        "companyName"         : formValues.companyName,
        "companyWebsite"      : formValues.companyWebsite,
        "companyPanNo"        : formValues.companyPanNo,
        "companycinNo"        : formValues.companycinNo,
        "companyAddress"      : formValues.companyAddress,
        "companyCity"         : formValues.companyCity,
        "companyState"        : formValues.companyState,
        "companyCountry"      : formValues.companyCountry,
        "companyPincode"      : formValues.companyPincode,
        "companyDescription"  : formValues.companyDescription
        }}
      );
      if(userCompanyCreate && formValues.emails.length >= 1){
        for(i=0;i<formValues.emails.length;i++){
          Accounts.addEmail(formValues.userId,formValues.emails[i].address,true);
        }
        Meteor.users.update(
          {'_id':formValues.userId},
          {
            $set:{
              'profile.authorizedPerson':formValues.emails,

            }
          }
        )
      }//EOF if

      TempCompanyImages.remove({"userId" : Meteor.userId(),"type" : "companyProfile"});

      return userCompanyCreate;
    },
    // set assureid in user table
    'setAssureId':function(userId,assureId){
      var success = Meteor.users.update(
        {'_id':userId},
        {
          $set:{
            'profile.assureId':assureId
          }
        }
      );
      if(success){
        return success;
      }

    },

    'activeblockCorporateAccount':function(userId,targetedStatus){
      
      CompanyProfile.update(
        {'userId':userId},
        {
          $set :{
            'accountStatus':targetedStatus
          }
        }
      );

      var userId = Meteor.users.update(
        {'_id':userId},
        {
          $set:{
            'profile.status':targetedStatus
          }
        }
      )
      return userId;
    },

    'removeEmailFromUser':function(userId,index){
      // console.log("index :",index);
      var updateUser = Meteor.users.update(
        {'_id':userId },
        {
          $unset:{
            ['emails.'+index] :1,
            ['profile.authorizedPerson.'+index]:1,
          }
        },{'multi': true}
      )
      // console.log("updateUser :",updateUser);

      Meteor.users.update({'_id':userId},{$pull:{"emails":null,"profile.authorizedPerson":null}},{'multi':true});

    },

    /**=========================================================== */

    'editComapnyBasicInfo':function(_id,assureId,formValues){
      if(formValues.companyName != '' && formValues.companyWebsite != '' && formValues.companyPanNo != '' &&
      formValues.companycinNo != '' && formValues.companyCity != '' && formValues.companyState != '' &&
      formValues.companyCountry != '' && formValues.companyPincode != ''){
        var profileClass = '';
        var companyProfilePercent = 34;
      }
      else if(formValues.companyName != '' && formValues.companycinNo != '' &&
       formValues.proofOfDocument != ''){
        var profileClass = 'halfcompleteDetails';
        var companyProfilePercent = 17;
      }else{
        var profileClass = 'incompleteDetails';
        var companyProfilePercent = 0;
      }
      
      var profileBasicPercent = companyProfilePercent;
      var userData  = CompanyProfile.findOne({"companyAssureID" : assureId});
      if(userData){
        if(userData.profileBasicPercent && userData.companyProfilePercent){
          var newcompanyProfilePercent = userData.companyProfilePercent - userData.profileBasicPercent;
          var updatedcompanyProfilePercent = newcompanyProfilePercent + profileBasicPercent;
        }else{
          var updatedcompanyProfilePercent = userData.companyProfilePercent + profileBasicPercent;
        }
      }
      
      CompanyProfile.update({"_id": _id, "companyAssureID" : assureId},{
        $set:{
          "userId"                : formValues.userId,
          "companyLogo"           : formValues.companyLogo, 
          "companyName"           : formValues.companyName,
          "companyWebsite"        : formValues.companyWebsite,
          "companyPanNo"          : formValues.companyPanNo,
          "companycinNo"          : formValues.companycinNo,
          "companyAddress"        : formValues.companyAddress,
          "companyCity"           : formValues.companyCity,
          "companyState"          : formValues.companyState,
          "companyCountry"        : formValues.companyCountry,
          "companyPincode"        : formValues.companyPincode,
          "companyDescription"    : formValues.companyDescription,
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileBasicPercent"   : profileBasicPercent,
          "profileBasicClass"     : profileClass,
          "profileBasicStatus"    : "",
        }
      });
      TempCompanyImages.remove({});
    },
    'addCompanyLocation':function(assureid,companyLocations){
      if(companyLocations.locationType != '' && companyLocations.companyLine1 != '' && companyLocations.companyLine2 != '' &&
      companyLocations.companyCountry != '' && companyLocations.companyState != '' && companyLocations.companyCity != '' &&
      companyLocations.companyPincode != '' && companyLocations.companyArea != '' && companyLocations.companyIncharge != ''){
        var profileClass = '';
        var companyProfilePercent = 33;
      }
      else if(companyLocations.companyLine1 != '' && companyLocations.companyPincode != '' &&
       companyLocations.companyIncharge != ''){
        var profileClass = 'halfcompleteDetails';
        var companyProfilePercent = 17;
      }else{
        var profileClass = 'incompleteDetails';
        var companyProfilePercent = 0;
      }
      
      var profileLocationPercent = companyProfilePercent;
      var userData  = CompanyProfile.findOne({"companyAssureID" : assureid});
      if(userData){
        if(userData.profileLocationPercent && userData.companyProfilePercent){
          var newcompanyProfilePercent = userData.companyProfilePercent - userData.profileLocationPercent;
          var updatedcompanyProfilePercent = newcompanyProfilePercent + profileLocationPercent;
        }else{
          var updatedcompanyProfilePercent = userData.companyProfilePercent + profileLocationPercent;
        }
      }
      CompanyProfile.update({"companyAssureID" : assureid},{
        $set:{
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileLocationPercent": profileLocationPercent,
          "profileLocationClass"  : profileClass,
        }
      });
      CompanyProfile.update({"companyAssureID" : assureid},{
        $push :{companyLocations : companyLocations  }
      });
    },

    
    'addauthorizedPerson':function(companyId,authorizedPerson){
      CompanyProfile.update({"_id":companyId},{
        $push:{
          "authorizedPerson" : authorizedPerson,
        }
      });
    },
    'changeauthorizedPerson':function(companyId,index,authorizedPerson){
      CompanyProfile.update({"_id":companyId},{
        $set:{
          ["authorizedPerson."+index+".empId"]   : authorizedPerson.empId,
          ["authorizedPerson."+index+".userId"]  : authorizedPerson.userId,
          ["authorizedPerson."+index+".assureId"]: authorizedPerson.assureId,
          ["authorizedPerson."+index+".Name"]    : authorizedPerson.Name,
          ["authorizedPerson."+index+".emailId"] : authorizedPerson.emailId,
          ["authorizedPerson."+index+".mobileNo"]: authorizedPerson.mobileNo,
          ["authorizedPerson."+index+".role"]    : authorizedPerson.role,
        }
      });
    },

    'deleteAutherisedPerson':function(companyId,index){
      CompanyProfile.update(
        {"_id" : companyId},
        {$unset: 
          {
            ['authorizedPerson.'+index] : 1 ,  
          }
        }
      ); 
      CompanyProfile.update(
        {"_id" : companyId},
        {$pull: 
          {
            ['authorizedPerson'] : null ,
          }
        }
      ); 
    },

    'updatepaymentBy':function(companyId,paymentBy){
      CompanyProfile.update(
        {"_id" : companyId},
        {$set: 
          {
            "paymentBy" : paymentBy ,  
          }
        }
      ); 
    },

    // 'removeBasicCompanyImages':function(imgValue,companyId){
    //   CompanyProfile.update(
    //     {"_id" : companyId},
    //     {$set: 
    //       {
    //         "proofOfDocument" : '',  
    //         "fileName"        : '',  
    //         "fileExt"         : '',   
    //       }
    //     }
    //   );  
    // },

   //add Document to TempContractImages
    "TempContractDocToS3function": function (id,documentName) {
      var data = ContractDocuments.findOne({"_id" : id});
      var imageLink = data.link();
        TempContractDocuments.insert({
        "userId": Meteor.userId(),
        "imageLink":imageLink,
        "fileName": data.name,
        "fileExt": data.ext,
        "document" : documentName,
        "createdAt":new Date(),
        },(error, result)=>{

      });
    },
    //add contract method
    'updateContractToCompanyProfile': function(companyName,companyId,serviceLevelAgreement,contractDescription,validFrom,validTo,contractStatus){
       var getscopeOfWork         = TempContractDocuments.findOne({"document": "scopeOfWork"}, {sort: {createdAt: -1, limit: 1}});
        if(getscopeOfWork){
          var scopeOfWorkDoc      = getscopeOfWork.imageLink;
          var scopeOfWorkFileName = getscopeOfWork.fileName;
          var scopeOfWorkFileExt  = getscopeOfWork.fileExt;
        }else{
          var scopeOfWorkDoc      = "";
          var scopeOfWorkFileName = "";
          var scopeOfWorkFileExt  = "";
        }

        var getPricingDoc     = TempContractDocuments.findOne({"document": "pricing"}, {sort: {createdAt: -1, limit: 1}});
        if(getPricingDoc){
          var pricingDoc      = getPricingDoc.imageLink;
          var pricingFileName = getPricingDoc.fileName;
          var pricingFileExt  = getPricingDoc.fileExt;
        }else{
          var pricingDoc      = "";
          var pricingFileName = "";
          var pricingFileExt  = "";
        }

        var getAuthLetter     = TempContractDocuments.findOne({"document": "authenticationLetter"}, {sort: {createdAt: -1, limit: 1}});
        if(getAuthLetter){
          var authenticationLetterDoc      = getAuthLetter.imageLink;
          var authenticationLetterFileName = getAuthLetter.fileName;
          var authenticationLetterFileExt  = getAuthLetter.fileExt;
        }else{
          var authenticationLetterDoc      = "";
          var authenticationLetterFileName = "";
          var authenticationLetterFileExt  = "";
        }

        var contractId = "";
        var companyDetails = CompanyProfile.findOne({"_id":companyId});
        if(companyDetails){
          if( companyDetails.contract){
            if(companyDetails.contract.length>0){
              var contractLength= companyDetails.contract[companyDetails.contract.length-1].contractId;
              contractId = contractLength+1;
            }
          }else{
              var contractId = 0;
          }
        }
        
        var contract = {
          //  "companyName"           : companyName,
          //  "companyId"             : companyId,
           "contractId"              : contractId,
           "corporateTotalOrder"     : 0,                                             
           "corporateCompleteOrder"  : 0,                                             
           "totalCandidateRequested" : 0,                                           
           "actualCandidateVerified" : 0,                                            
           "serviceLevelAgreement" : serviceLevelAgreement,
           "contractDescription"   : contractDescription,
           "validFrom"             : validFrom,
           "validTo"               : validTo,
           "scopeOfWorkDoc"      : scopeOfWorkDoc,
           "scopeOfWorkFileName" : scopeOfWorkFileName,
           "scopeOfWorkFileExt"  : scopeOfWorkFileExt,
           "pricingDoc"          : pricingDoc,
           "pricingFileName"     : pricingFileName,
           "pricingFileExt"      : pricingFileExt,
           "authenticationLetterDoc" : authenticationLetterDoc,
           "authenticationLetterFileName" : authenticationLetterFileName,
           "authenticationLetterFileExt"  : authenticationLetterFileExt,
           "contractStatus"               : contractStatus
        }
        
        CompanyProfile.update({"_id":companyId},{
          $push : {
            "contract" : contract,
          }
        });
        TempContractDocuments.remove({});
     },
     terminateContract(index,id){
       var updateContract = CompanyProfile.update(
         {'_id':id},
         {
           $set:{
             ['contract.'+index+".contractStatus"]:"Terminate"
           }
         }
        )
        return updateContract;

     },
    /**Delete document */
    "removeCompanyProfileDoc":function(id,link,scopeDoc){
      if(scopeDoc == "scopeOfWorkDoc"){
        var deleteData = CompanyProfile.update({"_id":id,"contract.scopeOfWorkDoc":link},
                          {$set:{
                            "contract.$.scopeOfWorkDoc":""
                          }
                            }
                        )
      }else if(scopeDoc == "pricingDoc"){
        var deleteData = CompanyProfile.update({"_id":id,"contract.pricingDoc":link},
                          {$set:{
                            "contract.$.pricingDoc":""
                          }
                            }
                        )
      }else{
        var deleteData = CompanyProfile.update({"_id":id,"contract.authenticationLetterDoc":link},
                            {
                              $set:{
                              "contract.$.authenticationLetterDoc":""
                              }
                          }
                        )
      }
      
      
    },

    //update contract method
    "updateContract":function(companyName,companyId,contractIndex,serviceLevelAgreement,contractDescription,validFrom,validTo,contractStatus,corporateTotalOrder,corporateCompleteOrder,totalCandidateRequested,actualCandidateVerified){
        var getscopeOfWork  = TempContractDocuments.findOne({"document": "scopeOfWork"}, {sort: {createdAt: -1, limit: 1}});
        if(getscopeOfWork){
          var scopeOfWorkDoc      = getscopeOfWork.imageLink;
          var scopeOfWorkFileName = getscopeOfWork.fileName;
          var scopeOfWorkFileExt  = getscopeOfWork.fileExt;
        }else{
           var oldCompanyProfileData   = CompanyProfile.findOne({"_id":companyId},{sort:{"createdAt":-1}});
              if(oldCompanyProfileData){
                var scopeOfWorkDoc      =  oldCompanyProfileData.contract[contractIndex].scopeOfWorkDoc;
                var scopeOfWorkFileName =  oldCompanyProfileData.contract[contractIndex].scopeOfWorkFileName;
                var scopeOfWorkFileExt  =  oldCompanyProfileData.contract[contractIndex].scopeOfWorkFileExt;
              }
        }

        var getPricingDoc     = TempContractDocuments.findOne({"document": "pricing"}, {sort: {createdAt: -1, limit: 1}});
        if(getPricingDoc){
          var pricingDoc      = getPricingDoc.imageLink;
          var pricingFileName = getPricingDoc.fileName;
          var pricingFileExt  = getPricingDoc.fileExt;
        }else{
          var oldCompanyProfileData   = CompanyProfile.findOne({"_id":companyId},{sort:{"createdAt":-1}});
              if(oldCompanyProfileData){
                var pricingDoc      = oldCompanyProfileData.contract[contractIndex].pricingDoc;
                var pricingFileName =  oldCompanyProfileData.contract[contractIndex].pricingFileName;
                var pricingFileExt  =  oldCompanyProfileData.contract[contractIndex].pricingFileExt;
              }
        }

        var getAuthLetter     = TempContractDocuments.findOne({"document": "authenticationLetter"}, {sort: {createdAt: -1, limit: 1}});
        if(getAuthLetter){
          var authenticationLetterDoc      = getAuthLetter.imageLink;
          var authenticationLetterFileName = getAuthLetter.fileName;
          var authenticationLetterFileExt  = getAuthLetter.fileExt;
        }else{
          var oldCompanyProfileData   = CompanyProfile.findOne({"_id":companyId},{sort:{"createdAt":-1}});
              if(oldCompanyProfileData){
                var authenticationLetterDoc      = oldCompanyProfileData.contract[contractIndex].authenticationLetterDoc;
                var authenticationLetterFileName =  oldCompanyProfileData.contract[contractIndex].authenticationLetterFileName;
                var authenticationLetterFileExt  =  oldCompanyProfileData.contract[contractIndex].authenticationLetterFileExt;
              }
        }
        var contractId = "";
        var companyDetails = CompanyProfile.findOne({"_id":companyId});
        if(companyDetails){
          if( companyDetails.contract){
            if(companyDetails.contract.length>0){
              var contractLength= companyDetails.contract[contractIndex].contractId;
              contractId = contractLength;
            }
          }else{
              var contractId = 0;
          }
        }
        
        
        
        var contract = {
          //  "companyName"           : companyName,
          //  "companyId"             : companyId,
           "contractId"                   : contractId,  
           "corporateTotalOrder"          : corporateTotalOrder,
           "corporateCompleteOrder"       : corporateCompleteOrder,
           "totalCandidateRequested"      : totalCandidateRequested,
           "actualCandidateVerified"      : actualCandidateVerified,   
           "serviceLevelAgreement"        : serviceLevelAgreement,
           "contractDescription"          : contractDescription,
           "validFrom"                    : validFrom,
           "validTo"                      : validTo,
           "scopeOfWorkDoc"               : scopeOfWorkDoc,
           "scopeOfWorkFileName"          : scopeOfWorkFileName,
           "scopeOfWorkFileExt"           : scopeOfWorkFileExt,
           "pricingDoc"                   : pricingDoc,
           "pricingFileName"              : pricingFileName,
           "pricingFileExt"               : pricingFileExt,
           "authenticationLetterDoc"      : authenticationLetterDoc,
           "authenticationLetterFileName" : authenticationLetterFileName,
           "authenticationLetterFileExt"  : authenticationLetterFileExt,
           "contractStatus"               : contractStatus
        }
        var updateContract = CompanyProfile.update({"_id" : companyId},{
          $set:{
            ["contract."+contractIndex] : contract,
          }
        });
        TempContractDocuments.remove({});
    },
    'updateUserNotificationStatus':function(userId){

      var notifStatus = Meteor.users.update(
        {'_id':userId},
        {$set:{'notificationStatus':true}}
      )
      return notifStatus;
    },
    'updateCountInContract':function(companyAssureId,contractId,serviceId,count){
      // rray.findIndex(function(currentValue, index, arr), thisValue)
      var companyRec = CompanyProfile.findOne({"companyAssureID" : companyAssureId});
      if(companyRec){
        var contract = companyRec.contract;
        // if(contract){
          var contractIndex = contract.findIndex(x => x.contractId == contractId) || 0;
          var serviceLevelAgreementIndex = contract[contractIndex].serviceLevelAgreement.findIndex(x => x._id == serviceId);
            CompanyProfile.update(
              {"companyAssureID" : companyAssureId},
              {$inc:
                {
                  ["contract."+contractIndex+".serviceLevelAgreement."+serviceLevelAgreementIndex+".totalOrders"] : count
                }
              }
            );

        // }
      }
    },
    'removeLogo':function(compayId){
      var removeLogo = CompanyProfile.update({"_id":compayId},{$set:{'companyLogo':""}});
      
    },
    'removeLogoFromTemp':function (tempId) {
      TempCompanyImages.remove({"_id":tempId });
    },
    'updateContractStatus':function(companyId,contractIndex,status){

      var updateContractStatus = CompanyProfile.update(
        {"_id":companyId},
        {
          $set:{
           ['contract.'+contractIndex+".contractStatus"]: status
          }
        }
      );  
      return updateContractStatus;

    },
    'updateContractAfterCorporateComplete':function(companyId,contractId,corporateCompleteOrderCount,orderDetailsCount){
       CompanyProfile.update({"_id": companyId , "contract.contractId" : parseInt(contractId)},{
        $inc: {
          ['contract.$.corporateCompleteOrder']  : corporateCompleteOrderCount,
          ['contract.$.actualCandidateVerified'] : orderDetailsCount,
        }
       });
    },
    
  });
}