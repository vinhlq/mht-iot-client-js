"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.initialState = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _types = require("../actions/types");

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var initialState = {
  username: '',
  password: '',
  email: '',
  error: '',
  notice: '',
  loading: false,
  loggedIn: false,
  user: null,
  identityId: ''
};
exports.initialState = initialState;

var _default = function _default(state = initialState, action) {
  switch (action.type) {
    case _types.LOGIN_USER:
      return (0, _objectSpread2.default)({}, state, {
        loading: true,
        error: '',
        notice: ''
      });

    case _types.LOGIN_USER_SUCCESS:
      return (0, _objectSpread2.default)({}, initialState, {
        user: action.user
      });

    case _types.LOGIN_USER_FAILED:
      return (0, _objectSpread2.default)({}, state, {
        error: action.error || 'Authentication Failed',
        password: '',
        loading: false
      });

    case _types.LOGGED_IN_STATUS_CHANGED:
      return (0, _objectSpread2.default)({}, state, {
        loggedIn: action.loggedIn
      });

    case _types.LOGOUT:
      return initialState;

    case _types.AUTH_FORM_UPDATE:
      return (0, _objectSpread2.default)({}, state, {
        [action.prop]: action.value
      });

    case _types.REGISTER_USER:
      return (0, _objectSpread2.default)({}, state, {
        loading: true,
        error: '',
        notice: ''
      });

    case _types.REGISTER_USER_SUCCESS:
      return (0, _objectSpread2.default)({}, initialState, {
        username: action.username,
        notice: 'Registration successful. Please sign in'
      });

    case _types.REGISTER_USER_FAILED:
      return (0, _objectSpread2.default)({}, initialState, {
        error: action.error || 'Registration Failed'
      });

    case _types.IDENTITY_UPDATED:
      return (0, _objectSpread2.default)({}, state, {
        identityId: action.identityId
      });

    default:
      return state;
  }
};

exports.default = _default;