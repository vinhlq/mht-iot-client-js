"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _usersReducer = _interopRequireWildcard(require("../usersReducer"));

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
describe('users reducer', function () {
  it('should return the initial state', function () {
    expect((0, _usersReducer.default)(undefined, {})).toEqual(_usersReducer.initialState);
  });
  it('should handle NEW_USER', function () {
    var testIdentityId = 'us-west-identity-id';
    expect((0, _usersReducer.default)({}, {
      type: types.NEW_USER,
      identityId: testIdentityId,
      user: {
        email: 'test@test.com',
        createdAt: '1508877096991',
        identityId: testIdentityId
      }
    })).toEqual({
      [testIdentityId]: {
        email: 'test@test.com',
        createdAt: '1508877096991',
        identityId: testIdentityId
      }
    });
  });
});