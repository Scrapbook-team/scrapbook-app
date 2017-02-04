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
    login: function (userEmail, userPassword) {
        return fetch(apiUrl + '/auth/token', {
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
    },
    // Register a user
    register: function (userEmail, userPassword, userFirstName, userLastName) {
        return fetch(apiUrl + '/users', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
                firstName: userFirstName,
                lastName: userLastName
            })
        })
    },
    // Get all the groups a user is part of.
    getGroups: function (token, userId) {
        return fetch(apiUrl + '/users/' + userId + '/groups', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
    },
};

export { ScrapbookApi as default };
