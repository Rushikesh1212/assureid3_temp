import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TempLogoImage = new Mongo.Collection('tempLogoImage');

import {CompanySettingLogoImage} from '/imports/admin/companySettings/uploadToServer/uploadLogoToServer.js';

if(Meteor.isServer){

  Meteor.publish('tempLogoImage',function tempLogoImage(){
      return TempLogoImage.find({});
  });
  

  Meteor.methods({
   'tempLogoImageUpload':function(fileObj,userId){
      // TempLogoImage.insert(
      //     { 
      //       'createdAt'     : new Date(),
      //       'logoFilename'  : fileName,
      //       'tempLogoImg'   : fileData, 
      //     }, function(error,result){
      //               // console.log(error,result);
      //               if(error) {
      //                   return error;
      //               } else {
      //                   return result;
      //               }
      //           }
      //     );
        var imageData     = CompanySettingLogoImage.findOne({'_id':fileObj._id});
        if(imageData){
          var companyData = TempLogoImage.findOne({'userId':userId});
          if(companyData){
            TempLogoImage.update(
              {'userId': userId },
              {
                $set:{
                  "tempLogoImg"      : imageData.link(),
                  "logoFilename"     : imageData.name,
                  "logoFileExt"      : imageData.ext,
                  'createdAt'        : new Date(),
                } //End of set
              }
            );
          }else{
            TempLogoImage.insert({
              "userId"            : userId,
              "tempLogoImg"      : imageData.link(),
              "logoFilename"     : imageData.name,
              "logoFileExt"      : imageData.ext,
              'createdAt'        : new Date(),
              },(error, result)=>{
            });
          }
        }
    },

    'tempLogoImageDelete':function(fileName){
      TempLogoImage.remove(
          {
              'logoFilename'  : fileName,
          }, function(error,result){
                    // console.log(error,result);
                    if(error) {
                        return error;
                    } else {
                        return result;
                    }
                }
          );
    },
    
  });
}
