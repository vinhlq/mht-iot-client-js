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
  messageToSend: '',
  subscribedTopics: [],
  allChats: [],
  loadingChats: false,
  creatingChat: false,
  error: '',
  fetchingUser: false
};
exports.initialState = initialState;

var _default = function _default(state = initialState, action) {
  switch (action.type) {
    case _types.MESSAGE_TO_SEND_CHANGED:
      return (0, _objectSpread2.default)({}, state, {
        messageToSend: action.messageToSend
      });

    case _types.ADD_SUBSCRIBED_TOPIC:
      return (0, _objectSpread2.default)({}, state, {
        subscribedTopics: [...state.subscribedTopics, action.topic]
      });

    case _types.CLEAR_SUBSCRIBED_TOPICS:
      return (0, _objectSpread2.default)({}, state, {
        subscribedTopics: initialState.subscribedTopics
      });

    case _types.FETCHING_CHATS:
      return (0, _objectSpread2.default)({}, state, {
        loadingChats: true
      });

    case _types.RECEIVE_CHATS:
      return (0, _objectSpread2.default)({}, state, {
        allChats: action.chats,
        loadingChats: false
      });

    case _types.CREATING_CHAT:
      return (0, _objectSpread2.default)({}, state, {
        creatingChat: true,
        error: ''
      });

    case _types.ADD_CHAT:
      return (0, _objectSpread2.default)({}, state, {
        allChats: [...state.allChats, action.chat],
        creatingChat: false
      });

    case _types.CHAT_ERROR:
      return (0, _objectSpread2.default)({}, state, {
        error: action.error
      });

    case _types.LOGOUT:
      return (0, _objectSpread2.default)({}, initialState);

    case _types.FETCHING_USER:
      return (0, _objectSpread2.default)({}, state, {
        fetchingUser: true
      });

    case _types.NEW_USER:
      return (0, _objectSpread2.default)({}, state, {
        fetchingUser: false
      });

    default:
      return state;
  }
};

exports.default = _default;