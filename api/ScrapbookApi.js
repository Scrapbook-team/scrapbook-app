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
    // Send a message in a group chat.
    sendMessage: function (token, groupId, text, userId, photoId) {
        return fetch(apiUrl + '/groups/' + groupId + '/messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                text,
                userId,
                photoId,
            })
        })
    },
    // Get messages from a group.
    getMessages: function (token, groupId, page) {
        var query = '';
        if (page)
            query = '/?page=' + page;
        return fetch(apiUrl + '/groups/' + groupId + '/messages' + query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
    },
    // Upload a photo to the api, and add it to a group.
    addPhoto: function (token, uri, groupId, ownerId, name, caption) {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();

        formData.append('name', name);
        formData.append('caption', caption);
        formData.append('ownerId', ownerId);

        formData.append('photo', {
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });


        let options = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'x-access-token': token,
            },
        };
        return fetch(apiUrl + '/groups/' + groupId + '/photos', options);
    },
};

export { ScrapbookApi as default };
