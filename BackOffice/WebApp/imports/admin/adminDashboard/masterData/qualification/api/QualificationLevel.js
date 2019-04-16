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
	 	 	'createQualificationLevel':function(QualificationLevelTitle){
    		QualificationLevel.insert({
          'QualificationLevelTitle'  : QualificationLevelTitle,
          'createdAt'       : new Date(),
    		});  
      },
      'updateQualificationLevel':function(id,QualificationTitle){
        QualificationLevel.update({"_id":id},{$set:{'QualificationLevelTitle'  : QualificationTitle}});
      },
      'deleteQualificationLevel':function(id){
        QualificationLevel.remove({"_id":id});
      }
	 });

}
