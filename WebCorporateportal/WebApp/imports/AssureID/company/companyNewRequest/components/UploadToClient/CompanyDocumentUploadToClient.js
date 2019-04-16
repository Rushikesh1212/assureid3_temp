import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const CompanyDocuments = new FilesCollection({
    collectionName: 'CompanyDocuments',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});

