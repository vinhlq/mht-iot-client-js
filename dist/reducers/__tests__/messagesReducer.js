"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _moment = _interopRequireDefault(require("moment"));

var _messagesReducer = _interopRequireWildcard(require("../messagesReducer"));

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
describe('messages reducer', function () {
  it('should return the initial state', function () {
    expect((0, _messagesReducer.default)(undefined, {})).toEqual(_messagesReducer.initialState);
  });
  it('should handle NEW_MESSAGE', function () {
    var messageTime = (0, _moment.default)('20171024');
    expect((0, _messagesReducer.default)([], {
      type: types.NEW_MESSAGE,
      username: 'bob',
      time: messageTime,
      message: 'sample text',
      id: '0'
    })).toEqual([{
      author: 'bob',
      time: messageTime,
      text: 'sample text',
      id: '0'
    }]);
  });
});