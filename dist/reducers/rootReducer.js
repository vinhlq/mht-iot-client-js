"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _roomsReducer = _interopRequireDefault(require("./roomsReducer"));

var _authReducer = _interopRequireDefault(require("./authReducer"));

var _chatReducer = _interopRequireDefault(require("./chatReducer"));

var _usersReducer = _interopRequireDefault(require("./usersReducer"));

var _iotReducer = _interopRequireDefault(require("./iotReducer"));

var _unreadsReducer = _interopRequireDefault(require("./unreadsReducer"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var rootReducer = (0, _redux.combineReducers)({
  rooms: _roomsReducer.default,
  auth: _authReducer.default,
  chat: _chatReducer.default,
  users: _usersReducer.default,
  iot: _iotReducer.default,
  unreads: _unreadsReducer.default
});
var _default = rootReducer;
exports.default = _default;