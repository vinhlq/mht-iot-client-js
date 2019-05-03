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
// Maintains a map of cognitoId to user objects
var initialState = {};
exports.initialState = initialState;

var _default = function _default(state = initialState, action) {
  switch (action.type) {
    case _types.NEW_USER:
      return (0, _objectSpread2.default)({}, state, {
        [action.identityId]: action.user
      });

    default:
      return state;
  }
};

exports.default = _default;