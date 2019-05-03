"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _authReducer = _interopRequireWildcard(require("../authReducer"));

var types = _interopRequireWildcard(require("../../actions/types"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('auth reducer', function () {
  it('should return the initial state', function () {
    expect((0, _authReducer.default)(undefined, {})).toEqual(_authReducer.initialState);
  });
  it('should handle LOGIN_USER', function () {
    expect((0, _authReducer.default)({
      loading: false,
      error: 'incorrect password',
      notice: 'success'
    }, {
      type: types.LOGIN_USER
    })).toEqual({
      loading: true,
      error: '',
      notice: ''
    });
  });
  it('should handle LOGIN_USER_SUCCESS', function () {
    expect((0, _authReducer.default)({
      loading: false,
      error: 'incorrect password',
      notice: 'success'
    }, {
      type: types.LOGIN_USER_SUCCESS,
      user: {
        email: 'test@test.com'
      }
    })).toEqual((0, _objectSpread2.default)({}, _authReducer.initialState, {
      user: {
        email: 'test@test.com'
      }
    }));
  });
  describe('when error passed in', function () {
    it('should handle LOGIN_USER_FAILED', function () {
      expect((0, _authReducer.default)({
        loading: true,
        error: 'incorrect password',
        password: 'password'
      }, {
        type: types.LOGIN_USER_FAILED,
        error: 'error occurred'
      })).toEqual({
        loading: false,
        error: 'error occurred',
        password: ''
      });
    });
  });
  describe('when no error passed in', function () {
    it('should handle LOGIN_USER_FAILED', function () {
      expect((0, _authReducer.default)({
        loading: true,
        error: 'incorrect password',
        password: 'password'
      }, {
        type: types.LOGIN_USER_FAILED
      })).toEqual({
        loading: false,
        error: 'Authentication Failed',
        password: ''
      });
    });
  });
  it('should handle LOGGED_IN_STATUS_CHANGED', function () {
    expect((0, _authReducer.default)({
      loggedIn: false
    }, {
      type: types.LOGGED_IN_STATUS_CHANGED,
      loggedIn: true
    })).toEqual({
      loggedIn: true
    });
  });
  it('should handle AUTH_FORM_UPDATE', function () {
    expect((0, _authReducer.default)({
      username: 'iron man'
    }, {
      type: types.AUTH_FORM_UPDATE,
      prop: 'username',
      value: 'captain america'
    })).toEqual({
      username: 'captain america'
    });
  });
  it('should handle REGISTER_USER', function () {
    expect((0, _authReducer.default)({
      loading: false,
      error: 'incorrect password',
      notice: 'success'
    }, {
      type: types.REGISTER_USER
    })).toEqual({
      loading: true,
      error: '',
      notice: ''
    });
  });
  it('should handle REGISTER_USER_SUCCESS', function () {
    expect((0, _authReducer.default)({
      loading: false,
      error: 'incorrect password',
      notice: 'success'
    }, {
      type: types.REGISTER_USER_SUCCESS,
      username: 'thor'
    })).toEqual((0, _objectSpread2.default)({}, _authReducer.initialState, {
      username: 'thor',
      notice: 'Registration successful. Please sign in'
    }));
  });
  describe('when error passed in', function () {
    it('should handle REGISTER_USER_FAILED', function () {
      expect((0, _authReducer.default)({
        loading: true,
        error: 'incorrect password',
        password: 'password'
      }, {
        type: types.REGISTER_USER_FAILED,
        error: 'error occurred'
      })).toEqual((0, _objectSpread2.default)({}, _authReducer.initialState, {
        error: 'error occurred'
      }));
    });
  });
  describe('when no error passed in', function () {
    it('should handle REGISTER_USER_FAILED', function () {
      expect((0, _authReducer.default)({
        loading: true,
        error: 'incorrect password',
        password: 'password'
      }, {
        type: types.REGISTER_USER_FAILED
      })).toEqual((0, _objectSpread2.default)({}, _authReducer.initialState, {
        error: 'Registration Failed'
      }));
    });
  });
  it('should handle IDENTITY_UPDATED', function () {
    expect((0, _authReducer.default)({}, {
      type: types.IDENTITY_UPDATED,
      identityId: 'identity-id'
    })).toEqual({
      identityId: 'identity-id'
    });
  });
  it('should handle LOGOUT', function () {
    expect((0, _authReducer.default)({
      loading: true,
      error: 'incorrect password',
      password: 'password'
    }, {
      type: types.LOGOUT
    })).toEqual(_authReducer.initialState);
  });
});