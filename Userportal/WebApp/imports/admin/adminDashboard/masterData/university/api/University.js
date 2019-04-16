import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const University = new Mongo.Collection("university");

if(Meteor.isServer){
   Meteor.publish('university',()=>{
       return University.find({});
   });
   Meteor.publish('singleuniversity',(id)=>{
       return University.find({"_id":id});
   });   

	 Meteor.methods({
	 	
	 });

}
