import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const CompanySettingLogoImage = new FilesCollection({
    collectionName: 'CompanySettingLogoImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});