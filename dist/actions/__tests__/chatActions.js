"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _reduxMockStore = _interopRequireDefault(require("redux-mock-store"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var actions = _interopRequireWildcard(require("../chatActions"));

var types = _interopRequireWildcard(require("../types"));

var IoT = _interopRequireWildcard(require("../../lib/aws-iot"));

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
describe('Chat Actions', function () {
  var middlewares = [_reduxThunk.default];
  var mockStore = (0, _reduxMockStore.default)(middlewares);
  describe('messagetoSendChanged', function () {
    it('should create an action to change the reply form value', function () {
      var message = 'message';
      var expectedAction = {
        type: types.MESSAGE_TO_SEND_CHANGED,
        messageToSend: message
      };
      expect(actions.messageToSendChanged(message)).toEqual(expectedAction);
    });
  });
  describe('subscribeToTopic', function () {
    beforeEach(function () {
      IoT.subscribe = jest.fn();
    });
    it('should not subscribe if topic is already subscribed to', function () {
      var expectedActions = [];
      var store = mockStore({
        chat: {
          subscribedTopics: ['topic']
        }
      });
      return store.dispatch(actions.subscribeToTopic('topic')).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
    it('should dispatch subscribed topic action if topic is not yet subscribed to', function () {
      var expectedActions = [{
        type: types.ADD_SUBSCRIBED_TOPIC,
        topic: 'topic'
      }];
      var store = mockStore({
        chat: {
          subscribedTopics: []
        }
      });
      return store.dispatch(actions.subscribeToTopic('topic')).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
  describe('fetchAllChats', function () {
    var chats = [{
      name: 'room/public/room1'
    }, {
      name: 'room/public/room2'
    }];
    beforeEach(function () {
      ApiGateway.fetchAllChats = function () {
        return Promise.resolve(chats);
      };
    });
    it('should dispatch fetching and receiving chats actions', function () {
      var expectedActions = [{
        type: types.FETCHING_CHATS
      }, {
        type: types.RECEIVE_CHATS,
        chats
      }];
      var store = mockStore({});
      return store.dispatch(actions.fetchAllChats()).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
  describe('createChat', function () {
    var chat = {
      name: 'room/public/room1'
    };
    describe('success', function () {
      beforeEach(function () {
        ApiGateway.createChat = function () {
          return Promise.resolve(chat);
        };
      });
      it('should create a chat', function () {
        var expectedActions = [{
          type: types.CREATING_CHAT
        }, {
          type: types.ADD_CHAT,
          chat
        }];
        var store = mockStore({});
        return store.dispatch(actions.createChat()).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
    describe('fail', function () {
      var errMsg = 'could not create chat';
      beforeEach(function () {
        var response = {
          message: JSON.stringify({
            error: errMsg
          })
        };

        ApiGateway.createChat = function () {
          return Promise.reject(response);
        };
      });
      it('should dispatch a fail message', function () {
        var expectedActions = [{
          type: types.CREATING_CHAT
        }, {
          type: types.CHAT_ERROR,
          error: errMsg
        }];
        var store = mockStore({});
        return store.dispatch(actions.createChat()).then(function () {
          expect(store.getActions()).toEqual(expectedActions);
        });
      });
    });
  });
  describe('readChat', function () {
    it('should mark the topic as read', function () {
      var topic = 'topic1';
      var expectedActions = [{
        type: types.RESET_UNREADS,
        room: topic
      }];
      var store = mockStore({
        unreads: {
          [topic]: 4
        }
      });
      return store.dispatch(actions.readChat(topic)).then(function () {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});