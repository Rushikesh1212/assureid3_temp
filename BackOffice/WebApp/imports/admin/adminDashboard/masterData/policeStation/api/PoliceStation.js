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
	 	 	'createPoliceStation':function(policeStationName,policeStationAddressLine1,policeStationAddressLine2,policeStationAddressLine3,country,state,city,area,pinCode){
    		PoliceStation.insert({
          'policeStationName'         : policeStationName,
          'policeStationAddressLine1' : policeStationAddressLine1,
          'policeStationAddressLine2' : policeStationAddressLine2,
          'policeStationAddressLine3' : policeStationAddressLine3,
          'country'                   : country,
          'state'                     : state,
          'city'                      : city,
          'area'                      : area,
          'pinCode'                   : pinCode,
          'createdAt'                 : new Date(),
    		}); 
      },
      'updatePoliceStation':function(id,policeStationName,policeStationAddressLine1,policeStationAddressLine2,policeStationAddressLine3,country,state,city,area,pinCode){
        PoliceStation.update({"_id":id},
          {$set:{
            'policeStationName'         : policeStationName,
            'policeStationAddressLine1 ': policeStationAddressLine1,
            'policeStationAddressLine2' : policeStationAddressLine2,
            'policeStationAddressLine3' : policeStationAddressLine3,
            'country'                   : country,
            'state'                     : state,
            'city'                      : city,
            'area'                      : area,
            'pinCode'                   : pinCode, 
          }});
      },
      'deletePoliceStation':function(id){
        PoliceStation.remove({"_id":id});
      }
	 });

}
