import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const PoliceStation = new Mongo.Collection("policeStation");

if(Meteor.isServer){
   Meteor.publish('policeStation',()=>{
       return PoliceStation.find({});
   });
   Meteor.publish('singlePoliceStation',(id)=>{
       return PoliceStation.find({"_id":id});
   });   

	 Meteor.methods({
	 	 
	 });

}
