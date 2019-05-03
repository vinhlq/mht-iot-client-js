"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.logoutUser = exports.loginUser = exports.clearCachedId = exports.getIdentityId = exports.authUser = exports.getAwsCredentials = exports.configUserPool = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _amazonCognitoIdentityJs = require("amazon-cognito-identity-js");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var log = _interopRequireWildcard(require("loglevel"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var config = {};
/**
 * Fetch AWS credentials using AWS SDK
 *
 * @param {string} token - Cognito User Pool token or Third Party acceess token
 * @param {string} provider - Name of the authenticated provider
 * @returns {Promise<object>} - Object containing properties: accessKeyId, secretAccessKey,
 * sessionToken
 */

var configUserPool = function ({
  poolId,
  clientId,
  identityPoolId
}) {
  config = {
    userPool: new _amazonCognitoIdentityJs.CognitoUserPool({
      UserPoolId: poolId,
      ClientId: clientId
    }),
    identityPoolId: identityPoolId
  };
};

exports.configUserPool = configUserPool;

var getCurrentUser = function () {
  return config.userPool.getCurrentUser();
};
/**
 * Fetch JWT token from current session
 *
 * @param {CognitoUser} currentUser - Cognito User from storage
 * @returns {Promise<string>} - Promise resolves with the JWT session ID token
 */


var getUserToken = function (currentUser) {
  return new Promise(function (resolve, reject) {
    currentUser.getSession(function (err, session) {
      if (err) {
        reject(err);
        return;
      }

      resolve(session.getIdToken().getJwtToken());
    });
  });
};
/**
 * Fetch AWS credentials using AWS SDK
 *
 * @param {string} token - Cognito User Pool token or Third Party acceess token
 * @param {string} provider - Name of the authenticated provider
 * @returns {Promise<object>} - Object containing properties: accessKeyId, secretAccessKey,
 * sessionToken
 */


var getAwsCredentials = function (token, provider) {
  return new Promise(function (resolve, reject) {
    var providerKey = '';

    switch (provider) {
      case 'facebook':
        providerKey = 'graph.facebook.com';
        break;

      case 'google':
        providerKey = 'accounts.google.com';
        break;

      case 'amazon':
        providerKey = 'www.amazon.com';
        break;

      default:
        providerKey = `cognito-idp.${_awsSdk.default.config.region}.amazonaws.com/${config.userPool.userPoolId}`;
        break;
    } // AWS.config.region = AWS.config.region;


    _awsSdk.default.config.credentials = new _awsSdk.default.CognitoIdentityCredentials({
      IdentityPoolId: config.identityPoolId,
      Logins: {
        [providerKey]: token
      }
    });

    _awsSdk.default.config.credentials.get(function (error) {
      if (error) {
        reject(error);
      }

      var {
        accessKeyId,
        secretAccessKey,
        sessionToken
      } = _awsSdk.default.config.credentials;
      var credentialSubset = {
        accessKeyId,
        secretAccessKey,
        sessionToken
      };
      resolve(credentialSubset);
    });
  });
};
/**
 * Fetches user details from Cognito User Pool
 *
 * @param {string} username - Username of user to query
 * @returns {Promise<object>} - Promise object represents mapping of attribute name to attribute
 * value
 */


exports.getAwsCredentials = getAwsCredentials;

var buildUserObject = function (username) {
  return new Promise(function (resolve, reject) {
    var cognitoUser = new _amazonCognitoIdentityJs.CognitoUser({
      Username: username,
      Pool: config.userPool
    });
    cognitoUser.getSession(function (sessionErr) {
      if (sessionErr) {
        reject(sessionErr);
      }

      cognitoUser.getUserAttributes(function (err, result) {
        if (err) {
          reject(err);
        }

        var user = {};

        for (var i = 0; i < result.length; i += 1) {
          user[result[i].getName()] = result[i].getValue();
        }

        user.username = username;
        resolve(user);
      });
    });
  });
};
/**
 * Authenticate user using username and password
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<CognitoUserSession>} - User session of authenticated user
 */


var authenticateUser = function (username, password) {
  return new Promise(function (resolve, reject) {
    var authenticationDetails = new _amazonCognitoIdentityJs.AuthenticationDetails({
      Username: username,
      Password: password
    });
    var cognitoUser = new _amazonCognitoIdentityJs.CognitoUser({
      Username: username,
      Pool: config.userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        resolve(result);
      },
      onFailure: function (error) {
        reject(error);
      }
    });
  });
};
/**
 * Helper to check if a user is authenticated
 *
 * @returns {bool} - Whether the cached credentials are valid or not
 */


var authUser = async function () {
  if (_awsSdk.default.config.credentials && Date.now() < _awsSdk.default.config.credentials.expireTime - 60000) {
    return true;
  }

  var provider = sessionStorage.getItem('provider');
  var token = sessionStorage.getItem('providerToken');

  switch (provider) {
    case 'facebook':
      break;

    case 'google':
      break;

    case 'user_pool':
      {
        var currentUser = getCurrentUser();
        token = await getUserToken(currentUser);
        break;
      }

    default:
      return false;
  }

  await getAwsCredentials(token, provider);
  return true;
};
/**
 * Retrieve last Cognito Identity ID that was cached by the AWS SDK
 *
 * @return {string} - Cognito Identity Id
 */


exports.authUser = authUser;

var getIdentityId = function () {
  var identityId = _awsSdk.default.config.credentials.identityId;
  log.debug('principal', identityId);
  return identityId;
};
/**
 * Clears the cached Cognito ID associated with the currently configured identity pool ID
 */


exports.getIdentityId = getIdentityId;

var clearCachedId = function () {
  _awsSdk.default.config.credentials.clearCachedId();
};
/**
 * Login to Amazon Cognito using username and password
 * 1. Authenticates with username and password
 * 2. Fetches AWS credentials
 * 3. Fetches user attributes
 *
 * @param {string} username - username of user
 * @param {string} password - password of user
 * @returns {Promise} Promise object represents user object from Cognito and AWS Credentials
 */


exports.clearCachedId = clearCachedId;

var loginUser = function (username, password) {
  return new Promise(function (resolve, reject) {
    authenticateUser(username, password).then(function (cognitoUserSession) {
      var token = cognitoUserSession.getIdToken().getJwtToken();
      var promise1 = getAwsCredentials(token, 'user_pool');
      var promise2 = buildUserObject(username);
      return Promise.all([promise1, promise2]);
    }).then(function (values) {
      var awsCredentials = values[0];
      var user = values[1];
      var userData = (0, _extends2.default)({
        awsCredentials
      }, {
        userObj: user
      });
      resolve(userData);
    }).catch(function (err) {
      log.error(err);
      reject(err);
    });
  });
};
/**
 * Log out of Amazon Cognito
 *
 * @returns {Promise}
 */


exports.loginUser = loginUser;

var logoutUser = function () {
  return new Promise(function (resolve) {
    var cognitoUser = config.userPool.getCurrentUser();

    if (cognitoUser) {
      log.debug('cognito user pool user signing out');
      cognitoUser.signOut();
    } else {
      log.debug('cognito federated user signing out');
    }

    resolve();
  });
};
/**
 * Register a user with Amazon Cognito
 *
 * @param {string} username - username of the user
 * @param {string} password - password of the user
 * @param {string} email - email of the user
 * @returns {Promise<string>} Promise object represents the username of the registered user
 */


exports.logoutUser = logoutUser;

var register = function (username, password, email) {
  return new Promise(function (resolve, reject) {
    var attributeList = [];
    var attributeEmail = new _amazonCognitoIdentityJs.CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    attributeList.push(attributeEmail);
    config.userPool.signUp(username, password, attributeList, null, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.user.getUsername());
      }
    });
  });
};

exports.register = register;