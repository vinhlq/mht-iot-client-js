"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _mockdate = _interopRequireDefault(require("mockdate"));

var _moment = _interopRequireDefault(require("moment"));

var actions = _interopRequireWildcard(require("../messageActions"));

var types = _interopRequireWildcard(require("../types"));

var ApiGateway = _interopRequireWildcard(require("../../lib/api-gateway"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('Message Actions', function () {
  var middlewares = [_reduxThunk.default];
  var mockStore = (0, _reduxMockStore.default)(middlewares);
  beforeAll(function () {
    _mockdate.default.set(1511225621);
  });
  afterAll(function () {
    _mockdate.default.reset();
  });
  describe('newMessage', function () {
    var message = 'message body';
    var username = 'username';
    var id = expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    var room = 'room/public/room1';
    var identityId = 'us-west-:12345';
    var topic = 'room/public/room1/us-west-:12345';
    var user = {
      username
    };
    beforeEach(function () {});
    describe('when the user is already in cache', function () {
      it('the new message action is dispatched immediately', function () {
        var time = (0, _moment.default)();
        var expectedActions = [{
          type: types.NEW_MESSAGE,
          message,
          username,
          time,
          id,
          room
        }];
        var store = mockStore({
          users: {
            [identityId]: user
          }
        });
        return store.dispatch(actions.newMessage(message, topic)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe('when the user is not in the cache', function () {
      beforeEach(function () {
        ApiGateway.fetchUser = function () {
          return Promise.resolve(user);
        };
      });
      it('should fetch the user from API', function () {
        var time = (0, _moment.default)();
        var expectedActions = [{
          type: types.FETCHING_USER
        }, {
          type: types.NEW_USER,
          identityId,
          user
        }, {
          type: types.NEW_MESSAGE,
          message,
          username,
          time,
          id,
          room
        }];
        var store = mockStore({
          users: {}
        });
        return store.dispatch(actions.newMessage(message, topic)).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
});