import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const CompanyProfile = new Mongo.Collection("companyProfile");
export const TempCompanyImages = new Mongo.Collection("tempCompanyImages");
export const RequestPool       = new Mongo.Collection("requestPool");
import { CompanyLogoImage } from "/imports/AssureID/company/profile/forms/UploadToServer/ProofUploadServer.js";
import { UserProfile } from "/imports/AssureID/user/api/userProfile.js";


if(Meteor.isServer){
  Meteor.publish('companyProfileData',(assureId)=>{
   return CompanyProfile.find({"companyAssureID": assureId});
  }); 
  Meteor.publish('companyProfileDetails',()=>{ 
   return CompanyProfile.find({});
  });  
  Meteor.publish('tempCompanyImages',(userId)=>{
    return TempCompanyImages.find({"userId": userId});
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
            },(error, result)=>{
          });
        }
      }
    },
    'removeTempCompanyImages':function(imgId){
      TempCompanyImages.remove({'_id':imgId});
    },
    'insertComapnyBasicInfo': function(formValues){
      var latestUsersDetails  = CompanyProfile.findOne({},{sort: {"createdAt":-1}});
      if(latestUsersDetails){
        if(latestUsersDetails.companyAssureID){
          var str = latestUsersDetails.companyAssureID;
        }else{changeauthorizedPerson
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
      
      var userProfileData = UserProfile.findOne({'userId':formValues.userId});
      if(userProfileData.employement){
        if(userProfileData.employement.length > 0){
          var designation = userProfileData.employement.designation;
        }else{
          var designation = '';
        }
      }else{
        var designation = ''; 
      }

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

      CompanyProfile.insert({
        "userId"            : formValues.userId,
        "companyLogo"       : formValues.companyLogo, 
        "companyName"       : formValues.companyName,
        "companyWebsite"    : formValues.companyWebsite,
        // "companyCode"       : formValues.companyCode,
        // "contactPersonDesignation" : formValues.contactPersonDesignation,
        // "companyEmail"        : formValues.companyEmail,
        // "contactNo1"           : formValues.contactNo1,
        // "contactNo2"          : formValues.contactNo2,
        "companyAddress"      : formValues.companyAddress,
        "companyCity"         : formValues.companyCity,
        "companyState"        : formValues.companyState,
        "companyCountry"      : formValues.companyCountry,
        "companyPincode"      : formValues.companyPincode,
        "HREmail"             : formValues.HREmail,
        "companyDescription"  : formValues.companyDescription,
        "companyAssureID"   : newAssureID,
        "employee"          : [{
          'empId'       : formValues.userId,
          'userId'      : userProfileData._id,
          'assureId'    : userProfileData.assureId,
          'Name'        : userProfileData.firstName+' '+userProfileData.lastName,
          'emailId'     : userProfileData.emailId,
          'mobileNo'    : userProfileData.mobileNo,
          'designation' : designation,
          'role'        : 'companyAdmin',
        }],
        "authorizedPerson" : [{
          'empId'       : formValues.userId,
          'userId'      : userProfileData._id,
          'assureId'    : userProfileData.assureId,
          'Name'        : userProfileData.firstName+' '+userProfileData.lastName,
          'emailId'     : userProfileData.emailId,
          'mobileNo'    : userProfileData.mobileNo,
          'role'        : 'companyAdmin',
        }],
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
        },(error, result)=>{
      });

      var companyData = CompanyProfile.findOne({},{sort: {"createdAt":-1}});
      if(companyData){
        var companyValues = {
          "companyId"       : companyData._id,
          "companyName"     : companyData.companyName,
          "companyAssureid" : companyData.companyAssureID,
          "role"            : 'companyAdmin',
        }
        
        Meteor.call("addCompanyAdmin",companyValues,formValues.userId, function(error,result){
          if(error){
            
          }else{
          }
        });
      }

      TempCompanyImages.remove({});
    }, 
    'editComapnyBasicInfo':function(_id,assureId,formValues){
      if(formValues.companyName != '' && formValues.companyWebsite != '' && formValues.companyPanNo != '' &&
      formValues.companycinNo != '' && formValues.companyCity != '' && formValues.companyState != '' &&
      formValues.companyCountry != '' && formValues.companyPincode != ''){
        var profileClass = '';
        var companyProfilePercent = 34;
      }
      else if(formValues.companyName != '' && formValues.companycinNo != ''){
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
      
      var userCompanyCreate = CompanyProfile.update({"_id": _id, "companyAssureID" : assureId},
        {$set:{
          "userId"            : formValues.userId,
          "companyLogo"       : formValues.companyLogo, 
          "companyName"       : formValues.companyName,
          "companyWebsite"    : formValues.companyWebsite,
          "companyPanNo"      : formValues.companyPanNo,
          "companycinNo"      : formValues.companycinNo,
          "companyCity"         : formValues.companyCity,
          "companyState"        : formValues.companyState,
          "companyCountry"      : formValues.companyCountry,
          "companyPincode"      : formValues.companyPincode,
          "companyDescription"  : formValues.companyDescription,
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileBasicPercent"   : profileBasicPercent,
          "profileBasicClass"     : profileClass,
          "profileBasicStatus"    : "",
          }
        }
      );
      if (formValues.emails) {
        if(userCompanyCreate && formValues.emails.length > 1){
          for(i=1;i<formValues.emails.length;i++){
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
        }
      }
      TempCompanyImages.remove({});
      return userCompanyCreate;
    },

    'removeEmailFromUser':function(userId,index){
      
      Meteor.users.update(
        {'_id':userId },
        {
          $unset:{
            ['emails.'+index] :1,
            ['profile.authorizedPerson.'+index]:1,
          }
        },{'multi': true}
      )

      Meteor.users.update({'_id':userId},{$pull:{"emails":null,"profile.authorizedPerson":null}},{'multi':true});

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
    'editCompanyLocation':function(companyId,companyLocationId,companyLocations){
      if(companyLocations.locationType != '' && companyLocations.companyLine1 != '' && companyLocations.companyLine2 != '' &&
      companyLocations.companyCountry != '' && companyLocations.companyState != '' && companyLocations.companyCity != '' &&
      companyLocations.companyPincode != '' && companyLocations.companyIncharge != ''){
        var companyProfilePercent = 33;
        var profileClass = '';
      }
      else if(companyLocations.companyLine1 != '' && companyLocations.companyPincode != ''){
        var companyProfilePercent = 17;
        var profileClass = 'halfcompleteDetails';
      }else{
        var companyProfilePercent = 0;
        var profileClass = 'incompleteDetails';
      }
      
      var profileLocationPercent = companyProfilePercent;
      var userData  = CompanyProfile.findOne({"_id" : companyId});
      if(userData){
        if(userData.profileLocationPercent && userData.companyProfilePercent){
          var newcompanyProfilePercent = userData.companyProfilePercent - userData.profileLocationPercent;
          var updatedcompanyProfilePercent = newcompanyProfilePercent + profileLocationPercent;
        }
      }
      CompanyProfile.update({"_id" : companyId},{
        $set:{
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileLocationPercent": profileLocationPercent,
          "profileLocationClass"  : profileClass,
        }
      });

      var userProfileObj = UserProfile.findOne({'assureId':companyLocations.companyIncharge});
      if(userProfileObj){
        var companyIncharge = userProfileObj.firstName+' '+userProfileObj.lastName;
      }else{
        var companyIncharge = '';
      }
      CompanyProfile.update({"_id" : companyId, "companyLocations.companyLocationId" : companyLocationId},{
        $set :{
          "companyLocations.$.locationType"        : companyLocations.locationType,
          "companyLocations.$.companyLine1"        : companyLocations.companyLine1,
          "companyLocations.$.companyLine2"        : companyLocations.companyLine2,
          "companyLocations.$.companyCountry"      : companyLocations.companyCountry,
          "companyLocations.$.companyState"        : companyLocations.companyState,
          "companyLocations.$.companyCity"         : companyLocations.companyCity,
          // "companyLocations.$.companyArea"         : companyLocations.companyArea,
          "companyLocations.$.companyPincode"      : companyLocations.companyPincode,
          "companyLocations.$.companyIncharge"     : companyLocations.companyIncharge,
        }
      });
    },
    'removecompanyLocations':function(id,index){
      var userData  = CompanyProfile.findOne({"_id" : id});
      if(userData){
        if(userData.companyLocations.length == 1){
          var profileLocationPercent = 0;
          var updatedcompanyProfilePercent = userData.companyProfilePercent - userData.profileLocationPercent;
          var profileClass = 'incompleteDetails';
        }else{
          var profileLocationPercent = userData.profileLocationPercent;
          var updatedcompanyProfilePercent = userData.companyProfilePercent;
          var profileClass = userData.profileLocationClass;
        }
      } 

      CompanyProfile.update({"_id" : id},
      {$set : 
        {
          "companyProfilePercent" : updatedcompanyProfilePercent,
          "profileLocationPercent": profileLocationPercent,
          "profileLocationClass"  : profileClass,
        }
      });
      var x = CompanyProfile.update(
        {"_id" : id},
        {$unset: 
          {
            ['companyLocations.'+index] : 1 ,  
          }
        },{'multi':true}
      ); 
      if(x){
          CompanyProfile.update(
          {"_id" : id},
          {$pull: 
            {
              'companyLocations' : null ,
            }
          },{'multi':true}
        ); 
      }
      
    },

    'addauthorizedPerson':function(userId,authorizedPerson){
      var updateUser = Meteor.users.update({"_id":userId},{
        $set:{
          "profile.authorizedPerson" : authorizedPerson,
        }
      });
      if(updateUser && authorizedPerson.length > 1){
        for(i=1;i<authorizedPerson.length ;i++){
          Accounts.addEmail(userId,authorizedPerson[i].address,true);
        }

        // Meteor.users.update(
        //   {'_id':formValues.userId},
        //   {
        //     $set:{
        //       'profile.authorizedPerson':formValues.emails,
        //     }
        //   }
        // )
      }

      return updateUser;
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
    'removeBasicCompanyImages':function(imgValue,companyId){
      CompanyProfile.update(
        {"_id" : companyId},
        {$set: 
          {
            "proofOfDocument" : '',  
            "fileName"        : '',  
            "fileExt"         : '',   
          }
        }
      );  
    },
    'updateCountInContract':function(companyAssureId,contractId,serviceId,count){
      // rray.findIndex(function(currentValue, index, arr), thisValue)
      var companyRec = CompanyProfile.findOne({"companyAssureID" : companyAssureId});
      if(companyRec){
        var contract = companyRec.contract;
        if(contract){
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
        }
      }
    },
    'updateOrderCountInContract':function(companyAssureId,contractId,count){
      CompanyProfile.update(
        {"companyAssureID" : companyAssureId},
        {$inc: {"contract.$[index].corpOrder":count}},
        {arrayFilters: [ { "index.contractId": contractId }]}
      );
    },
    'updatecountInCompanyProfile':function(companyId,contractId,totalCandidateRequestedCount){
      var corporateTotalOrderCount = 1;
      CompanyProfile.update(
        {"_id" : companyId, "contract.contractId" : parseInt(contractId)},
        {$inc:
          {
            ["contract.$.corporateTotalOrder"] : corporateTotalOrderCount,
            ["contract.$.totalCandidateRequested"] : parseInt(totalCandidateRequestedCount),
          }
        }
      );
    },
    'insertOrderInRequestPool':function(requestpool){
       var requestpoolId = RequestPool.insert(requestpool);
       console.log("requestpoolId :",requestpoolId);
       return requestpoolId;
    }
  });
}
