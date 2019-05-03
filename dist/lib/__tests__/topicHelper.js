"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var TopicHelper = _interopRequireWildcard(require("../topicHelper"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('TopicHelper', function () {
  describe('topicFromParams', function () {
    it('formats topic based on room type and name', function () {
      expect(TopicHelper.topicFromParams({
        roomType: 'public',
        roomName: 'room1'
      })).toBe('room/public/room1');
    });
  });
  describe('capitalize', function () {
    it('capitalizes a string', function () {
      expect(TopicHelper.capitalize('string')).toBe('String');
    });
  });
  describe('formatRoomCardHeader', function () {
    it('formats topic correctly', function () {
      expect(TopicHelper.formatRoomCardHeader('room/public/my-awesome-room')).toBe('My Awesome Room');
    });
  });
  describe('identityIdFromNewMessageTopic', function () {
    it('returns the identityId', function () {
      expect(TopicHelper.identityIdFromNewMessageTopic('room/public/my-awesome-room/us-west:123456789abcdef')).toBe('us-west:123456789abcdef');
    });
  });
  describe('roomFromNewMessageTopic', function () {
    it('returns the topic without the identityId', function () {
      expect(TopicHelper.roomFromNewMessageTopic('room/public/my-awesome-room/us-west:123456789abcdef')).toBe('room/public/my-awesome-room');
    });
  });
  describe('topicFromSubscriptionTopic', function () {
    it('returns the topic without the tailing /+', function () {
      expect(TopicHelper.topicFromSubscriptionTopic('room/public/my-awesome-room/+')).toBe('room/public/my-awesome-room');
    });
  });
});