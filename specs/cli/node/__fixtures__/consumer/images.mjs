import { projectImageObject } from '@jterrazz/manifest';

import { site } from './site.mjs';

const { images, ...unlicensed } = site;
const photo = {
    acquireLicensePage: 'https://stock.test/@ada',
    contentUrl: 'https://site.test/photos/1.jpg',
    description: 'A harbour at dusk',
};

let refusal;
try {
    projectImageObject(unlicensed, photo);
} catch (error) {
    refusal = error.message;
}

const report = {
    image: projectImageObject(site, photo),
    'site without an image license': refusal,
};
process.stdout.write(`${JSON.stringify(report, null, 4)}\n`);
