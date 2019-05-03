"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  configClient: true,
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
    return _apiGateway._invokeAPIGatewayAmplify;
  }
});
exports.configClient = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _core = require("@aws-amplify/core");

var _auth = _interopRequireDefault(require("@aws-amplify/auth"));

var _api = _interopRequireDefault(require("@aws-amplify/api"));

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
var logger = new _core.ConsoleLogger('api-gateway-amplify');
var clientConfig = null;

var configClient = function ({
  name
}) {
  clientConfig = {
    name
  };
};

exports.configClient = configClient;

var _invokeAPIGatewayAmplifySigner = async function ({
  endpoint = {
    name: clientConfig.name,
    url: clientConfig.url
  },
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  var session = await _auth.default.currentSession(); // We are signing the requests to Sumerian ourselves instead of using the AWS SDK
  // We want to set the user agent header

  var fetchOptions = {
    headers: {
      // This sets the AWS user agent string
      // So the Sumerian service knows this request is 
      // from Amplify
      "X-Amz-User-Agent": _core.Constants.userAgent,
      Authorization: session.idToken.jwtToken
    }
  };
  var url = endpoint.url + '/' + path;

  try {
    // Get credentials from Auth and sign the request
    // const credentials = await Credentials.get();
    var credentials = await _auth.default.currentCredentials();
    var user = await _auth.default.currentAuthenticatedUser();
    var accessInfo = {
      // secret_key: credentials.secretAccessKey,
      access_key: session.idToken.jwtToken // session_token: credentials.sessionToken,

    };
    var serviceInfo = {
      region: clientConfig.region,
      service: "execute-api"
    };
    var request = {
      method: method,
      url: url,
      data: body ? JSON.stringify(body) : body,
      queryParams: queryParams
    };

    var signedRequest = _core.Signer.sign(request, accessInfo, serviceInfo);

    fetchOptions.headers = (0, _objectSpread2.default)({}, headers, signedRequest);
    url = request.url;
  } catch (e) {
    logger.debug('No credentials available, the request will be unsigned');
  }

  var apiResponse = await fetch(url, fetchOptions);
  var apiResponseJson = await apiResponse.json();

  if (apiResponse.status === 403) {
    if (apiResponseJson.message) {
      logger.error(`Failure to authenticate user: ${apiResponseJson.message}`);
      throw new Error(`Failure to authenticate user: ${apiResponseJson.message}`);
    } else {
      logger.error(`Failure to authenticate user`);
      throw new Error(`Failure to authenticate user`);
    }
  }

  return apiResponse.json();
};

var _invokeAPIGatewayAmplify = async function ({
  endpoint = {
    name: clientConfig.name,
    url: clientConfig.url
  },
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  // await Auth.signIn("minhha", "Minhha@2019");
  var session = await _auth.default.currentSession();
  var options = {
    // headers: {
    // ...headers,
    // Authorization: session.idToken.jwtToken,
    // Authorization: session.accessToken.jwtToken,
    // queryParams: queryParams
    // },
    body: body,
    response: true
  };
  var response = null;

  switch (method) {
    case 'GET':
      response = await _api.default.get(endpoint.name, path, options);
      break;

    case 'POST':
      response = await _api.default.post(endpoint.name, path, options);
      break;

    case 'PUT':
      response = await _api.default.put(endpoint.name, path, options);
      break;

    case 'DEL':
      response = await _api.default.del(endpoint.name, path, options);
      break;

    default:
      throw new Error(`Unknown method: ${method}`);
      break;
  }

  return response;
};

var _invokeAPIGatewayV4Client = async function ({
  endpoint = {
    name: clientConfig.name,
    url: clientConfig.url
  },
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body
}) {
  var credentials = await _auth.default.currentCredentials();
  var user = await _auth.default.currentAuthenticatedUser();
  var session = await _auth.default.currentSession();
  var config = {
    accessKey: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: session.idToken.jwtToken,
    region: AWS.config.region,
    endpoint: clientConfig.endpoint
  };
  client = _sigV4Client.default.newClient(config);
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
}; // Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayAmplifySigner, logger: logger });


(0, _extends2.default)(_apiGateway.Config, {
  invokeAPIGateway: _invokeAPIGatewayAmplify,
  logger: logger
}); // Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayV4Client, logger: logger });
// export default ApiGatewayDefault;