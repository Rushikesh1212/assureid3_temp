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
	 	 	'createHoliday':function(holidayDate,holidayReason){
    		HolidaysList.insert({
          'holidayDate'    : holidayDate,
          'holidayReason'  : holidayReason,
          'createdAt'      : new Date(),
    		}); 
      },
      'updateHoliday':function(id,holidayDate,holidayReason){
        HolidaysList.update({"_id":id},
          {$set:{
            'holidayDate'     : holidayDate,
            'holidayReason'   : holidayReason,
          }});
      },
      'deleteHoliday':function(id){
        HolidaysList.remove({"_id":id});
      },
	 });

}
