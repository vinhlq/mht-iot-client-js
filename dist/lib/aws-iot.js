"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = exports.publish = exports.attachCloseHandler = exports.attachConnectHandler = exports.attachMessageHandler = exports.unsubscribeFromTopics = exports.updateClientCredentials = exports.initNewClient = void 0;

var log = _interopRequireWildcard(require("loglevel"));

var _iotClient = _interopRequireDefault(require("./iot-client"));

var _config = _interopRequireDefault(require("../../config"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var initNewClient = function (awsCredentials) {
  var options = {
    debug: _config.default.mqttDebugLevel,
    accessKeyId: awsCredentials.accessKeyId,
    secretKey: awsCredentials.secretAccessKey,
    sessionToken: awsCredentials.sessionToken
  };
  var client = new _iotClient.default(true, options);
  log.debug(client);
};
/**
 * Update device client with AWS identity credentials after logging in.
 *
 * @param {object} awsCredentials - AWS SDK credentials
 * @param {string} awsCredentials.accessKeyId - Access Key Id
 * @param {string} awsCredentials.secretAccessKey - Secret Access Key
 * @param {string} awsCredentials.sessionToken - Session Token
 */


exports.initNewClient = initNewClient;

var updateClientCredentials = function (awsCredentials) {
  var {
    accessKeyId,
    secretAccessKey,
    sessionToken
  } = awsCredentials;
  var client = new _iotClient.default();
  client.updateWebSocketCredentials(accessKeyId, secretAccessKey, sessionToken);
};
/**
 * Unsubscribe from topics
 *
 * @param {string[]} topics - List of topics to unsubscribe from
 */


exports.updateClientCredentials = updateClientCredentials;

var unsubscribeFromTopics = function (topics) {
  var client = new _iotClient.default();
  topics.forEach(function (topic) {
    client.unsubscribe(topic);
  });
};
/**
 * Attach a message handler
 */


exports.unsubscribeFromTopics = unsubscribeFromTopics;

var attachMessageHandler = function (handler) {
  var client = new _iotClient.default();
  client.attachMessageHandler(handler);
};
/**
 * Attach a connect handler
 *
 * @param {AWSIoT~onConnectHandler} onConnectHandler - Callback that handles a new connection
 *
 * @callback AWSIoT~onConnectHandler
 * @param {Object} connack - Connack object
 */


exports.attachMessageHandler = attachMessageHandler;

var attachConnectHandler = function (onConnectHandler) {
  var client = new _iotClient.default();
  client.attachConnectHandler(onConnectHandler);
};
/**
 * Attach a close handler
 *
 * @param {AWSIoT~onCloseHandler} onCloseHandler - Callback that handles closing connection
 *
 * @callback AWSIoTI~onCloseHandler
 * @param {Object} err - Connection close error
 */


exports.attachConnectHandler = attachConnectHandler;

var attachCloseHandler = function (handler) {
  var client = new _iotClient.default();
  client.attachCloseHandler(handler);
};
/**
 * Publish to an MQTT topic
 *
 * @param {string} topic - Topic to publish to
 * @param {string} message - JSON encoded payload to send
 */


exports.attachCloseHandler = attachCloseHandler;

var publish = function (topic, message) {
  var client = new _iotClient.default();
  client.publish(topic, message);
  log.debug('published message', topic, message);
};
/**
 * Subscribe to an MQTT topic
 *
 * @param {string} topic - Topic to subscribe to
 */


exports.publish = publish;

var subscribe = function (topic) {
  var client = new _iotClient.default();
  client.subscribe(topic);
  log.debug('subscribed to', topic);
};

exports.subscribe = subscribe;