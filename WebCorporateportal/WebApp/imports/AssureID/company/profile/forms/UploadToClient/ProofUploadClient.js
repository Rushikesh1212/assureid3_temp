import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const CompanyLogoImage = new FilesCollection({
    collectionName: 'companyLogoImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});

