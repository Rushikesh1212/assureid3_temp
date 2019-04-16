import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const CodeAndReason = new Mongo.Collection("codeAndReason");

if(Meteor.isServer){
   Meteor.publish('codeAndReason',()=>{
       return CodeAndReason.find({});
   });
   Meteor.publish('singleCodeAndReason',(id)=>{ 
       return CodeAndReason.find({"_id":id});
   });   

	 Meteor.methods({
	 	 	
	 });

}
