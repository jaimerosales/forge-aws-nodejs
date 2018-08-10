/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////
'use strict';

// Forge NPM
var forgeSDK = require('forge-apis');

// Forge config AWS information, such as client ID and secret from AWS SSM service
var configAWS = require('./configAWS');

// Cache of the access tokens
var _cached = [];

module.exports = {
    getTokenPublic: function () {
        return this.OAuthRequest(configAWS.scopePublic, 'public');
    },

    getTokenInternal: function () {
        return this.OAuthRequest(configAWS.scopeInternal, 'internal');
    },

    OAuthRequest: function (scopes, cache) {
        
        var forgeOAuth = this.OAuthClient(scopes);
        
        return new Promise(function (resolve, reject) {
            if (_cached[cache] != null && _cached[cache].expires_at > (new Date()).getTime()) {
                resolve(_cached[cache]);
                return;
            }

            forgeOAuth.authenticate()
                .then(function (credentials) {
                    _cached[cache] = credentials;
                    var now = new Date();
                    _cached[cache].expires_at = (now.setSeconds(now.getSeconds() + credentials.expires_in));
                    resolve(_cached[cache]);
                })
                .catch(function (error) {
                    console.log('Error at OAuth Authenticate:');
                    console.log(error);
                    reject(error)
                });
        })
    },

    OAuthClient: function (scopes) {

        var client_id = configAWS.forgeAWSClientId()
        var client_secret = configAWS.forgeAWSClientSecret()
       
        if (scopes == undefined) scopes = configAWS.scopeInternal;
        return new forgeSDK.AuthClientTwoLegged(client_id, client_secret, scopes);
    }
}