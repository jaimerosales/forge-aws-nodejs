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

var awsParamStore = require( 'aws-param-store' );

var awsFlag = process.env.FORGE_AWS_FLAG;
var paramStore = {"region": process.env.AWS_REGION}

// Autodesk Forge AWS configuration
module.exports = {
    
    getParamStore: function() {
        // IF not running on AWS, paramStore requires access and secret AWS Keys
        if (awsFlag!==1){
            paramStore.credentials = 
            {
                "accessKeyId" : process.env.accessKeyId,
                "secretAccessKey" : process.env.secretAccessKey
            };
            return paramStore;
        }
    },
    
    forgeAWSClientId: function() {
        let parameter = awsParamStore.getParameterSync( 'ForgeClientIdX' , this.getParamStore());
        return parameter.Value;
    },

    forgeAWSClientSecret: function() {
        let parameter = awsParamStore.getParameterSync( 'ForgeClientSecretX' ,this.getParamStore());
        return parameter.Value;
    }
}