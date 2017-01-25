/*
 * ApiUtils.js
 *
 * Utilities for interacting with APIs/fetch requests
 * https://medium.com/@yoniweisbrod/interacting-with-apis-using-react-native-fetch-9733f28566bb#.htcbtwvl9
 *
 */

var ApiUtils = {
    /*
     * Handle HTTP responses.
     */
    checkStatus: function(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
};

export { ApiUtils as default };

