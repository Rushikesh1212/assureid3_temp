import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';


export const CardValidation = new Mongo.Collection("cardValidation");


if(Meteor.isServer){
    Meteor.publish("cardValidationPublish", ()=> {
        return CardValidation.find({});
    });
}
