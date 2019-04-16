import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';


export const ProjectSettings = new Mongo.Collection("projectSettings");


if(Meteor.isServer){
    Meteor.publish("projectSettingsPublish", (_id)=> {
        return ProjectSettings.find({});
    });
}
