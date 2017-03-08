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
    login: function (userEmail, userPassword, exponentPushToken) {
        return fetch(apiUrl + '/auth/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
                exponentPushToken: exponentPushToken,
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
    // Get a user by id
    getUser: function (token, userId) {
        return fetch(apiUrl + '/users/' + userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        })
    },
    // Update a user
    editUser: function (token, userId, newValues) {
        return fetch(apiUrl + '/users/' + userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                newValues,
            })
        })
    },
    // Get a list of contacts for a user
    getContacts: function (token, userId) {
        return fetch(apiUrl + '/users/' + userId + '/contacts', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
        })
    },            
    // Get a list of photos a user has uploaded.
    getUserPhotos: function (token, userId) {
        return fetch(apiUrl + '/users/' + userId + '/photos', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
    },
    // Start a new groups
    newGroup: function (token, groupName, groupDescription='', members, profile) {
        return fetch(apiUrl+'/groups', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                name: groupName,
                description: groupDescription,
                members,
                profile,
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
    // Get info for a single group
    getGroup: function (token, groupId) {
        return fetch(apiUrl + '/groups/' + groupId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
    },
    // Edit a groups info
    editGroup: function (token, groupId, newValues) {
        return fetch(apiUrl + '/groups/' + groupId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({newValues}),
        })
    },
    // Add a member to a group.
    addMember: function (token, groupId, memberId) {
        return fetch(apiUrl + '/groups/' + groupId + '/members/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({memberId}),
        })
    },
    // Send a message in a group chat.
    sendMessage: function (token, momentId, text, photoId) {
        return fetch(apiUrl + '/moments/' + momentId + '/messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                text,
                photoId,
            })
        })
    },
    // Get messages from a group.
    getMessages: function (token, momentId, page) {
        var query = '';
        if (page)
            query = '/?page=' + page;
        return fetch(apiUrl + '/moments/' + momentId + '/messages' + query, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
    },
    // Create a new moment with an image.
    newMoment: function (token, groupId, title, photoId, caption) {
        var body = {
            title,
            photos: [
                { 
                    photo: photoId,
                    caption: caption,
                    position: 0,
                }
            ],
            notes: [],
        }

        return fetch(apiUrl + '/groups/' + groupId + '/moments', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify(body),
        })
    },
    // Get moments from a group.
    getMoments: function (token, groupId) {
        return fetch(apiUrl + '/groups/' + groupId + '/moments', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
    },
    // Get a single moment
    getMoment: function (token, momentId) {
        return fetch(apiUrl + '/moments/' + momentId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
    },
    // Upload a photo to the api, and add it to a group.
    addPhoto: function (token, uri, groupId) {
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();

        formData.append('name', "hola");
        formData.append('caption', "hola");
        if (groupId) 
            formData.append('groupId', groupId);

        console.log(groupId);

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
        return fetch(apiUrl + '/photos', options);
    },
    // Find contacts based on a query.
    findContacts: function (token, query) {
        return fetch(apiUrl + '/contacts/?q=' + encodeURIComponent(query), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
    },
    // Send memory
    sendMemory: function (token, memoryId) {
        return fetch(apiUrl + '/memories/' + memoryId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        })
    },
};

export { ScrapbookApi as default };
