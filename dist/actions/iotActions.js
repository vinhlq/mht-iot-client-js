"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachMessageHandler = exports.deviceConnectedStatusChanged = exports.acquirePublicPolicies = void 0;

var ApiGateway = _interopRequireWildcard(require("../lib/api-gateway"));

var Cognito = _interopRequireWildcard(require("../lib/aws-cognito"));

var IoT = _interopRequireWildcard(require("../lib/aws-iot"));

var _types = require("./types");

var _authActions = require("./authActions");

var _messageActions = require("./messageActions");

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
 * Ask API Gateway for Iot policy whitelisting for public rooms
 * 1. Ensure we are logged in
 * 2. Fetch AWS credentials from sessionStorage, identityId and attach to a new MQTT client
 * 3. Ask for Connect, Publish, Subscribe, Receive policies
 */
var acquirePublicPolicies = function (connectCallback, closeCallback) {
  return async function (dispatch, getState) {
    var {
      connectPolicy,
      publicPublishPolicy,
      publicSubscribePolicy,
      publicReceivePolicy
    } = getState().iot;
    var loggedIn = await Cognito.authUser();

    if (!loggedIn) {
      (0, _authActions.handleSignOut)()(dispatch);
      return Promise.resolve();
    }

    var identityId = Cognito.getIdentityId();
    dispatch({
      type: _types.IDENTITY_UPDATED,
      identityId
    });
    var awsCredentials = JSON.parse(sessionStorage.getItem('awsCredentials'));
    IoT.initNewClient(awsCredentials);
    IoT.attachConnectHandler(connectCallback);
    IoT.attachCloseHandler(closeCallback);

    if (!connectPolicy) {
      ApiGateway.attachConnectPolicy().then(function () {
        return dispatch({
          type: _types.CONNECT_POLICY_ATTACHED
        });
      });
    }

    if (!publicPublishPolicy) {
      ApiGateway.attachPublicPublishPolicy().then(function () {
        return dispatch({
          type: _types.PUBLIC_PUBLISH_POLICY_ATTACHED
        });
      });
    }

    if (!publicSubscribePolicy) {
      ApiGateway.attachPublicSubscribePolicy().then(function () {
        return dispatch({
          type: _types.PUBLIC_SUBSCRIBE_POLICY_ATTACHED
        });
      });
    }

    if (!publicReceivePolicy) {
      ApiGateway.attachPublicReceivePolicy().then(function () {
        return dispatch({
          type: _types.PUBLIC_RECEIVE_POLICY_ATTACHED
        });
      });
    }

    return Promise.resolve();
  };
};
/**
 * Change device connected status
 *
 * @param {bool} status - whether the device is connected or not
 */


exports.acquirePublicPolicies = acquirePublicPolicies;

var deviceConnectedStatusChanged = function (status) {
  return {
    type: _types.DEVICE_CONNECTED_STATUS_CHANGED,
    deviceConnected: status
  };
};
/**
 * Handler for incoming MQTT messages
 * Uses currying to bind Redux dispatch and getState and returns handler
 *
 * @params {function} dispatch - Redux dispatch
 * @params {function} getState - Redux getState
 * @returns {function}  The wrapped onNewMessage handler
 *
 * onNewMessage handler parses message and forwards to newMessage action
 * @params {string} topic - The topic that the message was published to
 * @params {string} jsonPayload - JSON payload of the message
 */


exports.deviceConnectedStatusChanged = deviceConnectedStatusChanged;

var onNewMessageWithRedux = function (dispatch, getState) {
  return function (topic, jsonPayload) {
    var payload = JSON.parse(jsonPayload.toString());
    var {
      message
    } = payload;
    (0, _messageActions.newMessage)(message, topic)(dispatch, getState);
  };
};

var attachMessageHandler = function () {
  return function (dispatch, getState) {
    var attached = getState().iot.messageHandlerAttached;

    if (!attached) {
      IoT.attachMessageHandler(onNewMessageWithRedux(dispatch, getState));
    }

    dispatch({
      type: _types.MESSAGE_HANDLER_ATTACHED,
      attached: true
    });
    return Promise.resolve();
  };
};

exports.attachMessageHandler = attachMessageHandler;