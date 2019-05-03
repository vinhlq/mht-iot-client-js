"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.listDevice = exports.attachDevice = exports.adminGetUser = exports.fetchUser = exports.createUser = exports.describeCertificate = exports.listCertificates = exports.listPolicies = exports.attachPublicReceivePolicy = exports.attachPublicSubscribePolicy = exports.attachPublicPublishPolicy = exports.attachConnectPolicy = exports.Config = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var Config = {
  invokeAPIGateway: null,
  logger: null
};
exports.Config = Config;

var _attachConnectPolicy = async function (params, endpoint) {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_connect',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }
};

var attachConnectPolicy = _attachConnectPolicy;
exports.attachConnectPolicy = attachConnectPolicy;

var _attachPublicPublishPolicy = async function (params, endpoint) {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_publish',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }
};

var attachPublicPublishPolicy = _attachPublicPublishPolicy;
exports.attachPublicPublishPolicy = attachPublicPublishPolicy;

var _attachPublicSubscribePolicy = async function (params, endpoint) {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_subscribe',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }
};

var attachPublicSubscribePolicy = _attachPublicSubscribePolicy;
exports.attachPublicSubscribePolicy = attachPublicSubscribePolicy;

var _attachPublicReceivePolicy = async function (params, endpoint) {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_receive',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }
};

var attachPublicReceivePolicy = _attachPublicReceivePolicy;
exports.attachPublicReceivePolicy = attachPublicReceivePolicy;

var _listPolicies = async function (params, endpoint) {
  var result;

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/list',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var listPolicies = _listPolicies;
exports.listPolicies = listPolicies;

var _listCertificates = async function (params, endpoint) {
  var result = {};

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/cert/list',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var listCertificates = _listCertificates;
exports.listCertificates = listCertificates;

var _describeCertificate = async function (params, endpoint) {
  var result;

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/cert/describe',
      method: 'POST',
      body: params
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var describeCertificate = _describeCertificate;
exports.describeCertificate = describeCertificate;

var _createUser = async function (username, endpoint) {
  var result;

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/users',
      method: 'POST',
      body: {
        username
      }
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var createUser = _createUser;
exports.createUser = createUser;

var _fetchUser = async function (params, endpoint) {
  var result;

  if (!params) {
    return result;
  }

  try {
    result = await Config.invokeAPIGateway({
      path: `/users/${encodeURIComponent(params.identityId)}`,
      method: 'GET'
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var fetchUser = _fetchUser;
exports.fetchUser = fetchUser;

var _adminGetUser = async function (params, endpoint) {
  var result;

  if (!params) {
    return result;
  }

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/user/admin_get_user',
      method: 'POST',
      body: {
        userName: params.userName,
        userPoolId: params.userPoolId
      }
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var adminGetUser = _adminGetUser; // device

exports.adminGetUser = adminGetUser;

var _attachDevice = async function (params, endpoint) {
  var result;

  if (!params) {
    return result;
  }

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/device/attach',
      method: 'POST',
      body: {
        serialNumber: params.serialNumber
      }
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var attachDevice = _attachDevice;
exports.attachDevice = attachDevice;

var _listDevice = async function (params, endpoint) {
  var result;

  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/device/list',
      method: 'POST',
      body: params || {}
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};

var listDevice = _listDevice;
exports.listDevice = listDevice;

class _default {
  constructor(endpoint) {
    var _this = this;

    (0, _defineProperty2.default)(this, "listPolicies", function (params) {
      return _listPolicies(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "listPolicies", function (params) {
      return _listPolicies(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "attachDevice", function (params) {
      return _attachDevice(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "listCertificates", function (params) {
      return _listCertificates(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "describeCertificate", function (params) {
      return _describeCertificate(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "createUser", function (params) {
      return _createUser(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "fetchUser", function (params) {
      return _fetchUser(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "adminGetUser", function (params) {
      return _adminGetUser(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "attachDevice", function (params) {
      return _attachDevice(params, _this.endpoint);
    });
    (0, _defineProperty2.default)(this, "listDevice", function (params) {
      return _listDevice(params, _this.endpoint);
    });
    this.endpoint = endpoint;
  }

}

exports.default = _default;