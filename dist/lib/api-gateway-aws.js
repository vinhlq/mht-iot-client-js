"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  configClient: true,
  _invokeAPIGateway: true,
  invokeAPIGateway: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _apiGateway.default;
  }
});
Object.defineProperty(exports, "invokeAPIGateway", {
  enumerable: true,
  get: function () {
    return _apiGateway._invokeAPIGateway;
  }
});
exports._invokeAPIGateway = exports.configClient = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var logger = _interopRequireWildcard(require("loglevel"));

var _awsCognito = require("./aws-cognito");

var _sigV4Client = _interopRequireDefault(require("./sigV4Client"));

var _apiGateway = _interopRequireWildcard(require("./api-gateway"));

Object.keys(_apiGateway).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _apiGateway[key];
    }
  });
});

/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/
var clientConfig = null;

var configClient = function ({
  url
}) {
  clientConfig = {
    url
  };
};

exports.configClient = configClient;

var _invokeAPIGateway = async function ({
  endpoint = {
    url: clientConfig.url
  },
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  if (!(await (0, _awsCognito.authUser)())) {
    throw new Error('User is not logged in');
  }

  var client = _sigV4Client.default.newClient({
    accessKey: _awsSdk.default.config.credentials.accessKeyId,
    secretKey: _awsSdk.default.config.credentials.secretAccessKey,
    sessionToken: _awsSdk.default.config.credentials.sessionToken,
    region: _awsSdk.default.config.region,
    endpoint: endpoint.url
  });

  var signedRequest = client.signRequest({
    method,
    path,
    headers,
    queryParams,
    body
  });
  var signedBody = body ? JSON.stringify(body) : body;
  var signedHeaders = signedRequest.headers;
  var results = await fetch(signedRequest.url, {
    method,
    headers: signedHeaders,
    body: signedBody
  });

  if (results.status !== 200) {
    throw new Error((await results.text()));
  }

  return results.json();
};

exports._invokeAPIGateway = _invokeAPIGateway;
(0, _extends2.default)(_apiGateway.Config, {
  invokeAPIGateway: _invokeAPIGateway,
  logger: logger
}); // Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayV4Client, logger: logger });
// export default ApiGatewayDefault;