"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var DeviceSdk = _interopRequireWildcard(require("aws-iot-device-sdk"));

var log = _interopRequireWildcard(require("loglevel"));

var _iotClient = _interopRequireDefault(require("../iot-client"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
describe('IoTClient', function () {
  DeviceSdk.default = jest.fn();
  var oldLogLevel = log.getLevel();
  beforeAll(function () {
    log.setLevel('silent');
  });
  afterAll(function () {
    log.setLevel(oldLogLevel);
  });
  describe('constructor', function () {
    it('creates new instance if instance did not exist before', function () {
      var client = new _iotClient.default(false, {
        debug: false
      });
      expect(client).toHaveProperty('client');
    });
    it('does not create new instance if instance already exists', function () {
      var client = new _iotClient.default(false, {
        debug: false
      });
      var client2 = new _iotClient.default(false, {
        debug: false
      });
      expect(client).toBe(client2);
    });
    it('creates a new instance if createNewClient is set to true', function () {
      var client = new _iotClient.default(false, {
        debug: false
      });
      var client2 = new _iotClient.default(true, {
        debug: false
      });
      expect(client).not.toBe(client2);
    });
  });
});