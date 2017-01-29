/*
 * ScrapbookApi.js
 *
 * Interfacing with the Scrapbook API
 *
 */

import ApiUtils from '../utilities/ApiUtils';

var apiUrl = 'http://54.174.232.52';

var ScrapbookApi = {
    // Essentially just get a token for the app to use.
    login: (userEmail, userPassword) => {
        fetch(apiUrl + '/auth/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword
            })
        })
        .then(ApiUtils.checkStatus)
        .then(response => response.json())
        .catch(err => err)
    },
};

export { ScrapbookApi as default };
