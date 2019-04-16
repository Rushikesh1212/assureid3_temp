import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Location = new Mongo.Collection("location");

if(Meteor.isServer){
   Meteor.publish('location',()=>{
       return Location.find({});
   });
   Meteor.publish('singleLocation',(id)=>{
       return Location.find({"_id":id});
   });  
	 Meteor.methods({
	 });

}
