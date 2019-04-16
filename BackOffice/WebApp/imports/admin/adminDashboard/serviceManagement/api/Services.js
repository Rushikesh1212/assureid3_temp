import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Services = new Mongo.Collection("services");
export const TempServiceImages = new Mongo.Collection("tempServiceImages");
export const ChecklistFieldExpert = new Mongo.Collection("checklistFieldExpert");
import { ServiceImage } from "/imports/admin/adminDashboard/uploadToServer/UploadServiceImgsServer.js";

if(Meteor.isServer){
    Meteor.publish('services',()=>{
        return Services.find({});
    }); 
    Meteor.publish('tempServiceImages',()=>{
        return TempServiceImages.find({});
    });
    Meteor.publish('singleServices',(_id)=>{
        return Services.find({"_id":_id});   
    });
    Meteor.publish('checklistFieldExpert',()=>{
        return ChecklistFieldExpert.find({});
    });
    Meteor.publish('singleChecklistFieldExpert',(_id)=>{
        return ChecklistFieldExpert.find({"_id" : _id});
    });
     Meteor.publish('userandbothservice',()=>{
        return Services.find({$or: [{"serviceFor" :'user'},{"serviceFor" :'both'},]});
    });
    Meteor.methods({
      //add Checklist to ChecklistFieldExpert collection
      "createChecklist" : function (formValue) {
         ChecklistFieldExpert.insert({ 
            "task"            : formValue.task,
            "checkListFrom"   : formValue.checkListFrom,
            "checkListFor"    : formValue.checkListFor,
            "relatedFields"   : formValue.relatedFields,
            "createdAt"       : new Date(),

        });
      },
      //delete task from ChecklistFieldExpert
      'deleteCheckList':function (id) {
        ChecklistFieldExpert.remove({"_id":id});
      },
      //update task from ChecklistFieldExpert
      'updateChecklist': function (id,formValue) {
        ChecklistFieldExpert.update({"_id":id},
          {$set:{
            "task"            : formValue.task,
            "checkListFrom"   : formValue.checkListFrom,
            "checkListFor"    : formValue.checkListFor,
            "relatedFields"   : formValue.relatedFields,
          }
        });
      },
      //add image to TempServiceImages
      "addNewTemporaryServiceImage": function (id) {
        var data = ServiceImage.findOne({"_id" : id});
        var imageLink = data.link();
          TempServiceImages.insert({
          "userId"    : Meteor.userId(),
          "imageLink" : imageLink,
          "fileName"  : data.name,
          "fileExt"   : data.ext,
          "createdAt" : new Date(),
          },(error, result)=>{});
      }, 
      //add service method
      'createService':function(serviceName,serviceRate,serviceDayNumbers,servicesDescription,serviceRequired,userId,lastModified,serviceFor,selectedCard){
        var getImage              = TempServiceImages.findOne({"userId":Meteor.userId()}, {sort: {createdAt: -1, limit: 1}});
        if(getImage){
          var image               = getImage.imageLink;
          var fileName            = getImage.fileName;
          var fileExt             = getImage.fileExt;
        }else{
          var image               = "https://s3.ap-south-1.amazonaws.com/assureidportal/backofficeImages/noImage.png";
          var fileName            = 'noImage';
          var fileExt             = 'png';
        }
        if(selectedCard.length > 0){
          Services.insert({
            'serviceName'           : serviceName,
            'serviceRate'           : serviceRate,
            'serviceDayNumbers'     : serviceDayNumbers,
            'servicesDescription'   : servicesDescription,
            'serviceRequired'       : serviceRequired,
            'image'                 : image,
            'fileName'              : fileName,
            'fileExt'               : fileExt,
            'selectedCard'          : selectedCard,
            'createdAt'     : new Date(),
            'authorUserId'  : userId,
            'lastModified'  : lastModified,
            'serviceFor'    : serviceFor,
          }); 
        }else{
          Services.insert({
            'serviceName'           : serviceName,
            'serviceRate'           : serviceRate,
            'serviceDayNumbers'     : serviceDayNumbers,
            'servicesDescription'   : servicesDescription,
            'serviceRequired'       : serviceRequired,
            'image'                 : image,
            'fileName'              : fileName,
            'fileExt'               : fileExt,
            'createdAt'     : new Date(),
            'authorUserId'  : userId,
            'lastModified'  : lastModified,
            'serviceFor'    : serviceFor,
          }); 
        }
       
        // TempServiceImages.remove({});
        Meteor.call('removeTempserviceImage',getImage._id);
      },
      //update service method
      'updateService':function(id,serviceName,serviceRate,serviceDayNumbers,servicesDescription,serviceRequired,userId,lastModified,serviceFor,selectedCard){
           var data = TempServiceImages.findOne({"userId":Meteor.userId()});
            if(data){
                var imageLink     = data.imageLink+'.'+data.fileExt;
            }else{
                var oldImgData    = Services.findOne({"_id":id},{sort:{"createdAt":-1}});
                if(oldImgData){
                    var imageLink = oldImgData.image;
                }
            }
        if(selectedCard.length > 0){
            Services.update(
              { '_id': id },
                  {
                    $set:{
                      'serviceName'           : serviceName,
                      'serviceRate'           : serviceRate,
                      'serviceDayNumbers'     : serviceDayNumbers,
                      'servicesDescription'   : servicesDescription,
                      'serviceRequired'       : serviceRequired,
                      'image'                 : imageLink,
                      'authorUserId'          : userId,
                      'lastModified'          : lastModified,
                      'serviceFor'            : serviceFor,
                      'selectedCard'          : selectedCard,
                  } //End of set
                }
            );
          }else{
            Services.update(
              { '_id': id },
                  {
                    $set:{
                      'serviceName'           : serviceName,
                      'serviceRate'           : serviceRate,
                      'serviceDayNumbers'     : serviceDayNumbers,
                      'servicesDescription'   : servicesDescription,
                      'serviceRequired'       : serviceRequired,
                      'image'                 : imageLink,
                      'authorUserId'          : userId,
                      'lastModified'          : lastModified,
                      'serviceFor'            : serviceFor,
                  } //End of set
                }
            );
          }
          if (data) {
            Meteor.call('removeTempserviceImage',data._id);
          }
      },
      //delete service method
      'deleteService':function(id){
         Services.remove({'_id': id});
      },
      // remove temp service image
      "removeTempserviceImage": function(id){
        TempServiceImages.remove({"_id" : id});
      }
    });
}