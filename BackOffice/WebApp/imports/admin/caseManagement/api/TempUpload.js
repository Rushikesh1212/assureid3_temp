import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const TempTicketImages = new Mongo.Collection("tempTicketImages");
export const TempTicketVideo = new Mongo.Collection("tempTicketVideo");
export const TempTicketReport = new Mongo.Collection("tempTicketReport");

import { TicketImages } from "/imports/admin/adminDashboard/uploadToServer/uploadImagesToServer.js";
import { TicketVideo } from "/imports/admin/adminDashboard/uploadToServer/uploadVideoToServer.js";
import { TicketReport } from "/imports/admin/adminDashboard/uploadToServer/uploadReportToServer.js";

 
if(Meteor.isServer){
 Meteor.publish('allTicketImages',()=>{
     return TempTicketImages.find({});
  });
  Meteor.publish('allTicketVideo',()=>{
     return TempTicketVideo.find({});
  });
  Meteor.publish('allTicketReport',()=>{
    return TempTicketReport.find({});
 });
	 Meteor.methods({
		 "addNewTemporaryTicketImages": function (id) {
        var data = TicketImages.findOne({"_id" : id});
        var imageLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
          TempTicketImages.insert({
          "userId": Meteor.userId(),
          "imageLink":imageLink,
          "createdAt":new Date(), 
          },(error, result)=>{

        });
      },
      "TempTicketVideoToS3function": function (id) {
        var data = TicketVideo.findOne({"_id" : id});
        var videoLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
          TempTicketVideo.insert({
          "userId": Meteor.userId(),
          "videoLink":videoLink,
          "createdAt":new Date(),
          },(error, result)=>{

        });
      }, 

      "TempReportToS3function": function (id,fileextension) {
        var data = TicketReport.findOne({"_id" : id});
        var ReportLink = "https://s3.ap-south-1.amazonaws.com/assureidportal/"+data.path;
          TempTicketReport.insert({
          "userId": Meteor.userId(),
          "ReportLink":ReportLink,
          "createdAt":new Date(),
          "fileExtension":fileextension
          },(error, result)=>{

        });
      },
      'deleteTempImage':function (id) {
        TempTicketImages.remove({"_id": id});
      },
      'deleteTempVideo':function (id) {
        TempTicketVideo.remove({"_id": id});
      },
   });
}