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
  connectPolicy: false,
  publicPublishPolicy: false,
  publicSubscribePolicy: false,
  publicReceivePolicy: false,
  deviceConnected: false,
  messageHandlerAttached: false
};
exports.initialState = initialState;

var _default = function _default(state = initialState, action) {
  switch (action.type) {
    case _types.CONNECT_POLICY_ATTACHED:
      return (0, _objectSpread2.default)({}, state, {
        connectPolicy: true
      });

    case _types.PUBLIC_PUBLISH_POLICY_ATTACHED:
      return (0, _objectSpread2.default)({}, state, {
        publicPublishPolicy: true
      });

    case _types.PUBLIC_SUBSCRIBE_POLICY_ATTACHED:
      return (0, _objectSpread2.default)({}, state, {
        publicSubscribePolicy: true
      });

    case _types.PUBLIC_RECEIVE_POLICY_ATTACHED:
      return (0, _objectSpread2.default)({}, state, {
        publicReceivePolicy: true
      });

    case _types.DEVICE_CONNECTED_STATUS_CHANGED:
      return (0, _objectSpread2.default)({}, state, {
        deviceConnected: action.deviceConnected
      });

    case _types.MESSAGE_HANDLER_ATTACHED:
      return (0, _objectSpread2.default)({}, state, {
        messageHandlerAttached: action.attached
      });

    case _types.LOGOUT:
      return (0, _objectSpread2.default)({}, initialState, {
        messageHandlerAttached: state.messageHandlerAttached,
        deviceConnected: state.deviceConnected // Leave this as connected to use same mqtt client

      });

    default:
      return state;
  }
};

exports.default = _default;