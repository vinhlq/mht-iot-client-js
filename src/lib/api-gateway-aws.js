/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import AWS from 'aws-sdk';
import * as logger from 'loglevel';

import { authUser } from './aws-cognito';
import sigV4Client from './sigV4Client';
import { Config } from './api-gateway'

var clientConfig = null

export const configClient = ({
  url,
}) => {
  clientConfig = {
    url
  };
}

export const _invokeAPIGateway = async ({
  endpoint = { url: clientConfig.url },
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body,
}) => {
  if (!await authUser()) {
    throw new Error('User is not logged in');
  }

  const client = sigV4Client.newClient({
    accessKey: AWS.config.credentials.accessKeyId,
    secretKey: AWS.config.credentials.secretAccessKey,
    sessionToken: AWS.config.credentials.sessionToken,
    region: AWS.config.region,
    endpoint: endpoint.url,
  });

  const signedRequest = client.signRequest({
    method,
    path,
    headers,
    queryParams,
    body,
  });

  const signedBody = body ? JSON.stringify(body) : body;
  const signedHeaders = signedRequest.headers;

  const results = await fetch(signedRequest.url, {
    method,
    headers: signedHeaders,
    body: signedBody,
  });

  if (results.status !== 200) {
    throw new Error(await results.text());
  }

  return results.json();
};

Object.assign(Config, { invokeAPIGateway: _invokeAPIGateway, logger: logger });
// Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayV4Client, logger: logger });

// export default ApiGatewayDefault;
export {
  default as default,
  _invokeAPIGateway as invokeAPIGateway
} from './api-gateway';
export * from './api-gateway';
