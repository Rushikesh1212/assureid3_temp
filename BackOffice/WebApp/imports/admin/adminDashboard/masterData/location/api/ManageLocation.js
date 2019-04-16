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
	 	 	'addLocation':function(country,state,city,area,pinCode){
    		Location.insert({
          'country'   : country,
          'state'     : state,
          'city'      : city,
          'area'      : area,
          'pinCode'   : pinCode,
          'createdAt'      : new Date(),
    		}); 
      },
      'updateLocation':function(id,country,state,city,area,pinCode){
        Location.update({"_id":id},
          {$set:{
            'country'   : country,
            'state'     : state,
            'city'      : city,
            'area'      : area,
            'pinCode'   : pinCode,
          }});
      },
      'deleteLocation':function(id){
        Location.remove({"_id":id});
      }
	 });

}
