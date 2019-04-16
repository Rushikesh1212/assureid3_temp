import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TempLogoImage = new Mongo.Collection('tempLogoImage');

if(Meteor.isServer){

  Meteor.publish('tempLogoImage',function tempLogoImage(){
      return TempLogoImage.find({});
  });
  
}

Meteor.methods({
 'tempLogoImageUpload':function(fileName, fileData){
    TempLogoImage.insert(
        {
          'createdAt'     : new Date(),
          'logoFilename'  : fileName,
          'tempLogoImg'   : fileData, 
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