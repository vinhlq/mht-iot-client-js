"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.authFormUpdate = exports.loggedInStatusChanged = exports.loginUserProvider = exports.loginUser = exports.handleSignOut = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var log = _interopRequireWildcard(require("loglevel"));

var Cognito = _interopRequireWildcard(require("../lib/aws-cognito"));

var ApiGateway = _interopRequireWildcard(require("../lib/api-gateway"));

var IoT = _interopRequireWildcard(require("../lib/aws-iot"));

var _history = _interopRequireDefault(require("../lib/history"));

var _types = require("./types");

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

/**
 * Handle succssful signout
 * 1. Mark is logged out in SessionStorage
 * 2. Unsubscribe from all MQTT topics
 * 3. Update logged in status in Redux
 */
var signOutUserSuccess = function (dispatch, getState) {
  sessionStorage.setItem('isLoggedIn', 'false');
  var topics = getState().chat.subscribedTopics;
  IoT.unsubscribeFromTopics(topics);
  dispatch({
    type: _types.CLEAR_SUBSCRIBED_TOPICS
  });
  dispatch({
    type: _types.MESSAGE_HANDLER_ATTACHED,
    attached: false
  });
  dispatch({
    type: _types.LOGGED_IN_STATUS_CHANGED,
    loggedIn: false
  });
  dispatch({
    type: _types.LOGOUT
  });
};
/**
 * 1. Sign out user from Cognito
 * 2. Clear any cached identity data
 */


var handleSignOut = function () {
  return function (dispatch, getState) {
    return Cognito.logoutUser().then(function () {
      Cognito.clearCachedId();
      sessionStorage.clear();
      localStorage.clear();
      signOutUserSuccess(dispatch, getState);
    });
  };
};
/**
 * After successful login:
 * 1. Store AWS credentials, provider and token in sessionStorage
 * 2. Stop the loading spinner & Redirect into App
 * 3. Create record of self in Dynamo
 * 4. Add user to local users list
 *
 * @param {Function} dispatch - The dispatch function available on your Redux store
 * @param {object} user - The user object returned from Cognito
 * @param {object} awsCredentials - Object containing aws identity credentials
 * @param {string} awsCredentials.accessKeyId
 * @param {string} awsCredentials.secretAccessKey
 * @param {string} awsCredentials.sessionToken
 * @param {string} provider - Type of identity provider. i.e. 'user_pool', 'google'
 * @param {string} token - Token from identity provider
 */


exports.handleSignOut = handleSignOut;

var loginUserSuccess = function (dispatch, user, awsCredentials, provider, token) {
  sessionStorage.setItem('awsCredentials', JSON.stringify(awsCredentials));
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('provider', provider);
  sessionStorage.setItem('providerToken', token);
  dispatch({
    type: _types.LOGIN_USER_SUCCESS,
    user
  });
  dispatch({
    type: _types.LOGGED_IN_STATUS_CHANGED,
    loggedIn: true
  });
  var identityId = Cognito.getIdentityId();
  ApiGateway.createUser(user.username).then(function (createdUser) {
    log.debug('created user', createdUser);
    dispatch({
      type: _types.NEW_USER,
      identityId,
      user: createdUser
    });
  });
};

var loginUserFail = function (dispatch, error) {
  dispatch({
    type: _types.LOGIN_USER_FAILED,
    error
  });
};
/**
 * This function is used for the case where a user logs in, closes browsers, creates a new account
 * and logs back in.
 * Clears any lingering cached data from previous logins managed by the AWS SDK
 */


var clearCognitoLocalStorage = function () {
  var len = localStorage.length;

  for (var i = 0; i < len; i += 1, len = localStorage.length) {
    var key = localStorage.key(i);

    if (key.includes('CognitoIdentityServiceProvider') || key.includes('aws.cognito.identity')) {
      log.debug('Cleared key from localStorage', key);
      localStorage.removeItem(key);
    }
  }
};

var loginUser = function (username, password) {
  return function (dispatch) {
    dispatch({
      type: _types.LOGIN_USER
    });
    clearCognitoLocalStorage();
    return Cognito.loginUser(username, password).then(function (userData) {
      return loginUserSuccess(dispatch, userData.userObj, userData.awsCredentials, 'user_pool', '');
    }).catch(function (error) {
      log.error(error);
      loginUserFail(dispatch, error.message);
    });
  };
};

exports.loginUser = loginUser;

var loginUserProvider = function (provider, profile, token) {
  return function (dispatch) {
    dispatch({
      type: _types.LOGIN_USER
    });
    return Cognito.getAwsCredentials(token, provider).then(function (awsCredentials) {
      // Add a username: key set as the identity's email
      var userObj = (0, _extends2.default)({
        username: profile.email
      }, profile);
      loginUserSuccess(dispatch, userObj, awsCredentials, provider, token);
    }).catch(function (error) {
      log.error(error);
      loginUserFail(dispatch, error.message);
    });
  };
};

exports.loginUserProvider = loginUserProvider;

var loggedInStatusChanged = function (loggedIn) {
  return {
    type: _types.LOGGED_IN_STATUS_CHANGED,
    loggedIn
  };
};

exports.loggedInStatusChanged = loggedInStatusChanged;

var authFormUpdate = function (prop, value) {
  return {
    type: _types.AUTH_FORM_UPDATE,
    prop,
    value
  };
};

exports.authFormUpdate = authFormUpdate;

var registerUserSuccess = function (dispatch, username) {
  dispatch({
    type: _types.REGISTER_USER_SUCCESS,
    username
  });

  _history.default.push('/login');
};

var registerUserFail = function (dispatch, error) {
  dispatch({
    type: _types.REGISTER_USER_FAILED,
    error
  });
};

var register = function (username, password, email) {
  return function (dispatch) {
    dispatch({
      type: _types.REGISTER_USER
    });
    return Cognito.register(username, password, email).then(function (registeredUsername) {
      return registerUserSuccess(dispatch, registeredUsername);
    }).catch(function (error) {
      return registerUserFail(dispatch, error.message);
    });
  };
};

exports.register = register;