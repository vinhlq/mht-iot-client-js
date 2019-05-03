"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var actions = _interopRequireWildcard(require("../iotActions"));

var types = _interopRequireWildcard(require("../types"));

var IoT = _interopRequireWildcard(require("../../lib/aws-iot"));

var ApiGateway = _interopRequireWildcard(require("../../lib/api-gateway"));

var Cognito = _interopRequireWildcard(require("../../lib/aws-cognito"));

var authActions = _interopRequireWildcard(require("../authActions"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('IoT Actions', function () {
  var middlewares = [_reduxThunk.default];
  var mockStore = (0, _reduxMockStore.default)(middlewares);
  describe('acquirePublicPolicies', function () {
    var connectCallback = jest.fn();
    var closeCallback = jest.fn();
    describe('when logged in', function () {
      var identityId = 'idenitity-id';
      beforeEach(function () {
        Cognito.authUser = function () {
          return Promise.resolve(true);
        };

        Cognito.getIdentityId = function () {
          return identityId;
        };

        IoT.initNewClient = jest.fn();
        IoT.attachConnectHandler = jest.fn();
        IoT.attachCloseHandler = jest.fn();

        ApiGateway.attachConnectPolicy = function () {
          return Promise.resolve();
        };

        ApiGateway.attachPublicPublishPolicy = function () {
          return Promise.resolve();
        };

        ApiGateway.attachPublicSubscribePolicy = function () {
          return Promise.resolve();
        };

        ApiGateway.attachPublicReceivePolicy = function () {
          return Promise.resolve();
        };
      });
      it('should dispatch appropriate policy actions', function () {
        var expectedActions = [{
          type: types.IDENTITY_UPDATED,
          identityId
        }, {
          type: types.CONNECT_POLICY_ATTACHED
        }, {
          type: types.PUBLIC_PUBLISH_POLICY_ATTACHED
        }, {
          type: types.PUBLIC_SUBSCRIBE_POLICY_ATTACHED
        }, {
          type: types.PUBLIC_RECEIVE_POLICY_ATTACHED
        }];
        var store = mockStore({
          iot: {
            connectPolicy: false,
            publicPublishPolicy: false,
            publicSubscribePolicy: false,
            publicReceivePolicy: false
          }
        });
        return store.dispatch(actions.acquirePublicPolicies(connectCallback, closeCallback)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe('when not logged in', function () {
      beforeEach(function () {
        Cognito.authUser = function () {
          return Promise.resolve(false);
        };

        authActions.handleSignOut = function () {
          return jest.fn();
        };
      });
      it('should log out the user', function () {
        var expectedActions = [];
        var store = mockStore({
          iot: {
            connectPolicy: false,
            publicPublishPolicy: false,
            publicSubscribePolicy: false,
            publicReceivePolicy: false
          }
        });
        return store.dispatch(actions.acquirePublicPolicies(connectCallback, closeCallback)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  describe('attachMessageHandler', function () {
    beforeEach(function () {
      IoT.attachMessageHandler = jest.fn();
    });
    it('should dispatch attached handler action', function () {
      var expectedActions = [{
        type: types.MESSAGE_HANDLER_ATTACHED,
        attached: true
      }];
      var store = mockStore({
        iot: {
          messageHandlerAttached: false
        }
      });
      return store.dispatch(actions.attachMessageHandler()).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});