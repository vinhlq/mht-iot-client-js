"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.initialState = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _messagesReducer = _interopRequireWildcard(require("./messagesReducer"));

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
  messages: _messagesReducer.initialState
};
exports.initialState = initialState;

var _default = function _default(state = initialState, action) {
  switch (action.type) {
    case _types.NEW_MESSAGE:
      {
        return (0, _objectSpread2.default)({}, state, {
          messages: (0, _messagesReducer.default)(state.messages, action)
        });
      }

    default:
      return state;
  }
};

exports.default = _default;