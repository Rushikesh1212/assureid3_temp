import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const College = new Mongo.Collection("college");

if(Meteor.isServer){
   Meteor.publish('college',()=>{
       return College.find({});
   });
   Meteor.publish('singlecollege',(id)=>{
       return College.find({"_id":id});
   });   

	 Meteor.methods({
	 	 
	 });

}
