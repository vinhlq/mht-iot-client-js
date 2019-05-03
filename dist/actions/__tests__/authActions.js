"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var actions = _interopRequireWildcard(require("../authActions"));

var types = _interopRequireWildcard(require("../types"));

var Cognito = _interopRequireWildcard(require("../../lib/aws-cognito"));

var ApiGateway = _interopRequireWildcard(require("../../lib/api-gateway"));

var IoT = _interopRequireWildcard(require("../../lib/aws-iot"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('Auth Actions', function () {
  var middlewares = [_reduxThunk.default];
  var mockStore = (0, _reduxMockStore.default)(middlewares);
  var username = 'username';
  var password = 'password';
  var email = 'test@test.com';
  var errMsg = 'error message';
  describe('loggedInStatusChanged', function () {
    it('should create an action to change log in status', function () {
      var expectedAction = {
        type: types.LOGGED_IN_STATUS_CHANGED,
        loggedIn: true
      };
      expect(actions.loggedInStatusChanged(true)).toEqual(expectedAction);
    });
  });
  describe('authFormUpdate', function () {
    it('should create an action to change an auth form prop value', function () {
      var expectedAction = {
        type: types.AUTH_FORM_UPDATE,
        prop: username,
        value: 'username1'
      };
      expect(actions.authFormUpdate(username, 'username1')).toEqual(expectedAction);
    });
  });
  describe('register', function () {
    describe('success', function () {
      beforeEach(function () {
        Cognito.register = function () {
          return Promise.resolve('username');
        };
      });
      it('should register user with Cognito and dispatch success action', function () {
        var expectedActions = [{
          type: types.REGISTER_USER
        }, {
          type: types.REGISTER_USER_SUCCESS,
          username
        }];
        var store = mockStore({});
        return store.dispatch(actions.register(username, password, email)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe('fail', function () {
      beforeEach(function () {
        Cognito.register = function () {
          return Promise.reject(new Error(errMsg));
        };
      });
      it('should dispatch fail action', function () {
        var expectedActions = [{
          type: types.REGISTER_USER
        }, {
          type: types.REGISTER_USER_FAILED,
          error: errMsg
        }];
        var store = mockStore({});
        return store.dispatch(actions.register(username, password, email)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  describe('loginUserProvider', function () {
    describe('success', function () {
      var accessKeyId = 'access-key-id';
      var secretAccessKey = 'secret-access-key';
      var sessionToken = 'session-token';
      var identityId = 'identity-id';
      var profile = {
        email
      };
      beforeEach(function () {
        Cognito.getAwsCredentials = function () {
          return Promise.resolve({
            accessKeyId,
            secretAccessKey,
            sessionToken
          });
        };

        Cognito.getIdentityId = function () {
          return identityId;
        };

        ApiGateway.createUser = function () {
          return Promise.resolve(profile);
        };
      });
      it('should log in user with Cognito and dispatch success action', function () {
        var provider = 'provider';
        var token = 'token';
        var expectedActions = [{
          type: types.LOGIN_USER
        }, {
          type: types.LOGIN_USER_SUCCESS,
          user: {
            email,
            username: email
          }
        }, {
          type: types.LOGGED_IN_STATUS_CHANGED,
          loggedIn: true
        }, {
          type: types.NEW_USER,
          identityId,
          user: profile
        }];
        var store = mockStore({});
        return store.dispatch(actions.loginUserProvider(provider, profile, token)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  describe('fail', function () {
    beforeEach(function () {
      Cognito.getAwsCredentials = function () {
        return Promise.reject(new Error(errMsg));
      };
    });
    it('should dipsatch fail action', function () {
      var provider = 'provider';
      var token = 'token';
      var profile = {
        email
      };
      var expectedActions = [{
        type: types.LOGIN_USER
      }, {
        type: types.LOGIN_USER_FAILED,
        error: errMsg
      }];
      var store = mockStore({});
      return store.dispatch(actions.loginUserProvider(provider, profile, token)).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
  describe('loginUser', function () {
    describe('success', function () {
      var identityId = 'identity-id';
      var profile = {
        email
      };
      beforeEach(function () {
        Cognito.loginUser = function () {
          return Promise.resolve({
            userObj: profile
          });
        }; // userData


        Cognito.getIdentityId = function () {
          return identityId;
        };

        ApiGateway.createUser = function () {
          return Promise.resolve(profile);
        };

        localStorage.clear();
        localStorage.setItem('aws.cognito.identity', true);
      });
      afterEach(function () {
        localStorage.clear();
      });
      it('should log in user with Cognito and dispatch success action', function () {
        var expectedActions = [{
          type: types.LOGIN_USER
        }, {
          type: types.LOGIN_USER_SUCCESS,
          user: profile
        }, {
          type: types.LOGGED_IN_STATUS_CHANGED,
          loggedIn: true
        }, {
          type: types.NEW_USER,
          identityId,
          user: profile
        }];
        var store = mockStore({});
        return store.dispatch(actions.loginUser(username, password)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
      it('should clear existing local storage key value pairs', function () {
        var store = mockStore({});
        return store.dispatch(actions.loginUser(username, password)).then(function () {
          expect(localStorage.getItem('aws.cognito.identity')).toBe(null);
        });
      });
    });
    describe('fail', function () {
      beforeEach(function () {
        Cognito.loginUser = function () {
          return Promise.reject(new Error(errMsg));
        };
      });
      it('should dispatch fail action', function () {
        var expectedActions = [{
          type: types.LOGIN_USER
        }, {
          type: types.LOGIN_USER_FAILED,
          error: errMsg
        }];
        var store = mockStore({});
        return store.dispatch(actions.loginUser(username, password)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  describe('handleSignOut', function () {
    var topics = ['topic1', 'topic2'];
    beforeEach(function () {
      IoT.unsubscribeFromTopics = jest.fn();

      Cognito.logoutUser = function () {
        return Promise.resolve();
      };

      Cognito.clearCachedId = function () {
        return jest.fn();
      };

      localStorage.setItem('key', 'value');
      sessionStorage.setItem('isLoggedIn', 'true');
    });
    afterEach(function () {
      localStorage.clear();
      sessionStorage.clear();
    });
    it('should clear storage except for isLoggedIn', function () {
      var store = mockStore({
        chat: {
          subscribedTopics: topics
        }
      });
      return store.dispatch(actions.handleSignOut()).then(function () {
        expect(localStorage.getItem('key')).toBe(null);
        expect(sessionStorage.getItem('isLoggedIn')).toBe('false');
      });
    });
    it('should dispatch success actions', function () {
      var expectedActions = [{
        type: types.CLEAR_SUBSCRIBED_TOPICS
      }, {
        type: types.MESSAGE_HANDLER_ATTACHED,
        attached: false
      }, {
        type: types.LOGGED_IN_STATUS_CHANGED,
        loggedIn: false
      }, {
        type: types.LOGOUT
      }];
      var store = mockStore({
        chat: {
          subscribedTopics: topics
        }
      });
      return store.dispatch(actions.handleSignOut()).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});