import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Packages = new Mongo.Collection("packages");
export const TempPackageImages = new Mongo.Collection("tempPackageImages");
// export const ChecklistFieldExpert = new Mongo.Collection("checklistFieldExpert");

if(Meteor.isServer){
    Meteor.publish('packages',()=>{
        return Packages.find({});
    }); 
    Meteor.publish('adminpackages',(manual)=>{
        return Packages.find({"createdBy" : manual, "packageStatus": "Active"});
    });
    Meteor.publish('tempPackageImages',()=>{
        return TempPackageImages.find({});
    });
    Meteor.publish('singlePackages',(_id)=>{
        return Packages.find({"_id":_id});   
    });
   
    Meteor.methods({
      
    });
}
