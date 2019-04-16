import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Services = new Mongo.Collection("services");
export const TempServiceImages = new Mongo.Collection("tempServiceImages");
export const ChecklistFieldExpert = new Mongo.Collection("checklistFieldExpert");
// import { ServiceImage } from "/imports/admin/adminDashboard/uploadToServer/UploadServiceImgsServer.js";

if(Meteor.isServer){
    Meteor.publish('services',()=>{
        return Services.find({});
    }); 
    Meteor.publish('userandbothservice',()=>{
        return Services.find({$or: [{"serviceFor" :'user'},{"serviceFor" :'both'},]});
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
    Meteor.methods({
     
    });
}