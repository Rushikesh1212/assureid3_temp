import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const QualificationLevel = new Mongo.Collection("qualificationLevel");

if(Meteor.isServer){
   Meteor.publish('qualificationLevel',()=>{
       return QualificationLevel.find({});
   });
   Meteor.publish('singlequalificationLevel',(id)=>{
       return QualificationLevel.find({"_id":id});
   });   

	 Meteor.methods({
	 	 
	 });

}
