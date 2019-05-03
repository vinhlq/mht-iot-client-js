"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readChat = exports.createChat = exports.fetchAllChats = exports.subscribeToTopic = exports.messageToSendChanged = void 0;

var log = _interopRequireWildcard(require("loglevel"));

var _types = require("./types");

var ApiGateway = _interopRequireWildcard(require("../lib/api-gateway"));

var IoT = _interopRequireWildcard(require("../lib/aws-iot"));

var _history = _interopRequireDefault(require("../lib/history"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var messageToSendChanged = function (messageToSend) {
  return {
    type: _types.MESSAGE_TO_SEND_CHANGED,
    messageToSend
  };
};
/**
 * Subscribe to topic if we have not yet subscribed
 *
 * @param {string} topic - The topic that we want to subscribe to
 */


exports.messageToSendChanged = messageToSendChanged;

var subscribeToTopic = function (topic) {
  return function (dispatch, getState) {
    var {
      subscribedTopics
    } = getState().chat;

    if (subscribedTopics.includes(topic)) {
      log.debug('Already subscribed to topic', topic);
    } else {
      IoT.subscribe(topic);
      dispatch({
        type: _types.ADD_SUBSCRIBED_TOPIC,
        topic
      });
    }

    return Promise.resolve();
  };
};
/**
 * Fetch list of chats that have been created
 */


exports.subscribeToTopic = subscribeToTopic;

var fetchAllChats = function () {
  return function (dispatch) {
    dispatch({
      type: _types.FETCHING_CHATS
    });
    return ApiGateway.fetchAllChats().then(function (chats) {
      dispatch({
        type: _types.RECEIVE_CHATS,
        chats
      });
    });
  };
};
/**
 * Create a chat room
 *
 * @param {string} room - The sanitized name of the room
 * @param {string} type - The room type: 'public', or 'private'
 */


exports.fetchAllChats = fetchAllChats;

var createChat = function (room, type) {
  return function (dispatch) {
    dispatch({
      type: _types.CREATING_CHAT
    });
    var roomName = `room/${type}/${room}`;
    return ApiGateway.createChat(roomName, type).then(function (chat) {
      dispatch({
        type: _types.ADD_CHAT,
        chat
      }); // Redirect user into that chat page

      _history.default.push(`/app/${chat.name}`);
    }).catch(function (response) {
      dispatch({
        type: _types.CHAT_ERROR,
        error: JSON.parse(response.message).error
      });
    });
  };
};
/**
 * Mark the messages in room as read
 * 
 * @param {string} topic - A topic of the form 'room/public/my-awesome-topic'
 */


exports.createChat = createChat;

var readChat = function (topic) {
  return function (dispatch, getState) {
    if (getState().unreads[topic] !== 0) {
      dispatch({
        type: _types.RESET_UNREADS,
        room: topic
      });
    }

    return Promise.resolve();
  };
};

exports.readChat = readChat;