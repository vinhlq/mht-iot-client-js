"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _iotReducer = _interopRequireWildcard(require("../iotReducer"));

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
describe('iot reducer', function () {
  it('should return the initial state', function () {
    expect((0, _iotReducer.default)(undefined, {})).toEqual(_iotReducer.initialState);
  });
  it('should handle CONNECT_POLICY_ATTACHED', function () {
    expect((0, _iotReducer.default)({
      connectPolicy: false
    }, {
      type: types.CONNECT_POLICY_ATTACHED
    })).toEqual({
      connectPolicy: true
    });
  });
  it('should handle PUBLIC_PUBLISH_POLICY_ATTACHED', function () {
    expect((0, _iotReducer.default)({
      publicPublishPolicy: false
    }, {
      type: types.PUBLIC_PUBLISH_POLICY_ATTACHED
    })).toEqual({
      publicPublishPolicy: true
    });
  });
  it('should handle PUBLIC_SUBSCRIBE_POLICY_ATTACHED', function () {
    expect((0, _iotReducer.default)({
      publicSubscribePolicy: false
    }, {
      type: types.PUBLIC_SUBSCRIBE_POLICY_ATTACHED
    })).toEqual({
      publicSubscribePolicy: true
    });
  });
  it('should handle PUBLIC_RECEIVE_POLICY_ATTACHED', function () {
    expect((0, _iotReducer.default)({
      publicReceivePolicy: false
    }, {
      type: types.PUBLIC_RECEIVE_POLICY_ATTACHED
    })).toEqual({
      publicReceivePolicy: true
    });
  });
  it('should handle DEVICE_CONNECTED_STATUS_CHANGED', function () {
    expect((0, _iotReducer.default)({
      deviceConnected: false
    }, {
      type: types.DEVICE_CONNECTED_STATUS_CHANGED,
      deviceConnected: true
    })).toEqual({
      deviceConnected: true
    });
  });
  it('should handle MESSAGE_HANDLER_ATTACHED', function () {
    expect((0, _iotReducer.default)({
      messageHandlerAttached: false
    }, {
      type: types.MESSAGE_HANDLER_ATTACHED,
      attached: true
    })).toEqual({
      messageHandlerAttached: true
    });
  });
  describe('when device is connected', function () {
    it('should handle LOGOUT and without modifying deviceConnected state', function () {
      expect((0, _iotReducer.default)({
        deviceConnected: true,
        connectPolicy: true,
        messageHandlerAttached: false
      }, {
        type: types.LOGOUT
      })).toEqual((0, _objectSpread2.default)({}, _iotReducer.initialState, {
        deviceConnected: true,
        messageHandlerAttached: false
      }));
    });
  });
  describe('when message handler has been attached', function () {
    it('should handle LOGOUT and without modifying messageHandlerAttached state', function () {
      expect((0, _iotReducer.default)({
        messageHandlerAttached: true,
        connectPolicy: true,
        deviceConnected: false
      }, {
        type: types.LOGOUT
      })).toEqual((0, _objectSpread2.default)({}, _iotReducer.initialState, {
        messageHandlerAttached: true,
        deviceConnected: false
      }));
    });
  });
});