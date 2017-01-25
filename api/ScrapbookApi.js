/*
 * ScrapbookApi.js
 *
 * Interfacing with the Scrapbook API
 *
 */

import ApiUtils from '../utilities/ApiUtils';

var ScrapbookApi = {
    login: (email, password) => {
        console.log('Logging in ' + email + ' with password ' + password);
    },
};

export { ScrapbookApi as default };
