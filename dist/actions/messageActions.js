"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newMessage = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _v = _interopRequireDefault(require("uuid/v4"));

var log = _interopRequireWildcard(require("loglevel"));

var ApiGateway = _interopRequireWildcard(require("../lib/api-gateway"));

var _types = require("./types");

var _topicHelper = require("../lib/topicHelper");

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var newMessageAdd = function (dispatch, message, username, time, id, room) {
  dispatch({
    type: _types.NEW_MESSAGE,
    message,
    username,
    time,
    id,
    room
  });
};

var newUserAdd = function (dispatch, identityId, user) {
  dispatch({
    type: _types.NEW_USER,
    identityId,
    user
  });
};
/**
 * Handle a new message arriving. Cognito identity id is parsed from topic. If user is cached,
 * build message immediately. Otherwise, query API for user information based on identity id.
 *
 * @param {string} message - the message
 * @param {string} topic - the topic of the form room/public/+/cognitoId
 */


var newMessage = function (message, topic) {
  return function (dispatch, getState) {
    var identityId = (0, _topicHelper.identityIdFromNewMessageTopic)(topic);
    var room = (0, _topicHelper.roomFromNewMessageTopic)(topic);
    var user = getState().users[identityId];
    var now = (0, _moment.default)();

    if (user) {
      newMessageAdd(dispatch, message, user.username, now, (0, _v.default)(), room);
      return Promise.resolve();
    }

    dispatch({
      type: _types.FETCHING_USER
    });
    return ApiGateway.fetchUser(identityId).then(function (fetchedUser) {
      newUserAdd(dispatch, identityId, fetchedUser);
      newMessageAdd(dispatch, message, fetchedUser.username, now, (0, _v.default)(), room);
    }).catch(function (error) {
      log.error(error);
    });
  };
};

exports.newMessage = newMessage;