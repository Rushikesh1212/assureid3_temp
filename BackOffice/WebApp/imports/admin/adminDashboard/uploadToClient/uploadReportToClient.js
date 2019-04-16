import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const TicketReport = new FilesCollection({
    collectionName: 'TicketReport',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});
