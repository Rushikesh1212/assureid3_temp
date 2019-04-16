import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const NewsFeeds = new Mongo.Collection("newsFeeds");
export const TempNewsVideo = new Mongo.Collection("tempNewsVideo");

// import { NewsVideo } from "../uploadToServer/uploadNewsVideoServer.js";

if(Meteor.isServer){
   Meteor.publish('newsFeeds',()=>{
    var data = NewsFeeds.find({});
    // console.log("data: ",data);
    return data;
    // console.log(NewsFeeds.find({}));
    //    return NewsFeeds.find({});
   });
  Meteor.publish('singleNews',(_id)=>{
      return NewsFeeds.find({"_id":_id});  
  });
   Meteor.publish('tempNewsVideo',()=>{
      return TempNewsVideo.find({});
  });
  Meteor.publish('newsFeedData',()=>{
      return NewsFeeds.find({},{sort : {createdAt: -1} , limit : 3});
  });

	 Meteor.methods({
	 	 	

	 });

}
