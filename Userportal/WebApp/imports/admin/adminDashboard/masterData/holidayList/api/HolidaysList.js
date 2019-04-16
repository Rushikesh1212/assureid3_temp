import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const HolidaysList = new Mongo.Collection("holidaysList");
 
if(Meteor.isServer){
   Meteor.publish('holidaysList',()=>{
       return HolidaysList.find({});
   });
   Meteor.publish('singleholidayList',(id)=>{
       return HolidaysList.find({"_id":id});
   });   

	 Meteor.methods({
	 	 	
	 });

}
