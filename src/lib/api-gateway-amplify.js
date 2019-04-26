/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import { ConsoleLogger as Logger, Signer, Credentials, Constants } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'
const logger = new Logger('api-gateway-amplify');
import sigV4Client from './sigV4Client';
import { Config } from './api-gateway'

var clientConfig = null
export const configClient = ({
  name
}) => {
  clientConfig = {
    name,
  };
}

const _invokeAPIGatewayAmplifySigner = async ({
  endpoint = {name: clientConfig.name, url: clientConfig.url},
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body,
}) => {
  const session = await Auth.currentSession();
  // We are signing the requests to Sumerian ourselves instead of using the AWS SDK
  // We want to set the user agent header
  const fetchOptions = {
    headers: {
      // This sets the AWS user agent string
      // So the Sumerian service knows this request is 
      // from Amplify
      "X-Amz-User-Agent": Constants.userAgent,
      Authorization: session.idToken.jwtToken
    }
  };
  let url = endpoint.url + '/' + path;
  try {
    // Get credentials from Auth and sign the request
    // const credentials = await Credentials.get();
    const credentials = await Auth.currentCredentials();
    const user = await Auth.currentAuthenticatedUser()
    const accessInfo = {
      // secret_key: credentials.secretAccessKey,
      access_key: session.idToken.jwtToken,
      // session_token: credentials.sessionToken,
    };
    
    const serviceInfo = {
      region: clientConfig.region,
      service: "execute-api"
    };
    const request = {
      method: method,
      url: url,
      data: body ? JSON.stringify(body):body,
      queryParams: queryParams
    }
    const signedRequest = Signer.sign(request, accessInfo, serviceInfo);
    fetchOptions.headers = {...headers, ...signedRequest};
    url = request.url;
  } catch (e) {
    logger.debug('No credentials available, the request will be unsigned');
  }

  const apiResponse = await fetch(url, fetchOptions);
  const apiResponseJson = await apiResponse.json();
  if (apiResponse.status === 403) {
      if (apiResponseJson.message) {
        logger.error(`Failure to authenticate user: ${apiResponseJson.message}`);
        throw(new Error(`Failure to authenticate user: ${apiResponseJson.message}`));
      } else {
        logger.error(`Failure to authenticate user`);
        throw(new Error(`Failure to authenticate user`));
      }
  }

  return apiResponse.json();
};

const _invokeAPIGatewayAmplify = async ({
  endpoint = {name: clientConfig.name, url: clientConfig.url},
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body,
}) => {
  // await Auth.signIn("minhha", "Minhha@2019");
  const session = await Auth.currentSession();
  const options = {
    // headers: {
      // ...headers,
      // Authorization: session.idToken.jwtToken,
      // Authorization: session.accessToken.jwtToken,
      // queryParams: queryParams
    // },
    body: body,
    response: true,
  };
  let response = null;
  switch(method){
    case 'GET':
      response = await API.get(endpoint.name, path, options);
      break;

    case 'POST':
    response = await API.post(endpoint.name, path, options);
    break;

    case 'PUT':
      response = await API.put(endpoint.name, path, options);
      break;

    case 'DEL':
      response = await API.del(endpoint.name, path, options);
      break;

    default:
      throw(new Error(`Unknown method: ${method}`));
      break;
  }
  return response;
}

const _invokeAPIGatewayV4Client = async ({
  endpoint = {name: clientConfig.name, url: clientConfig.url},
  path,
  method = 'GET',
  headers = {},
  queryParams = {},
  body,
}) => {
  const credentials = await Auth.currentCredentials();
  const user = await Auth.currentAuthenticatedUser();
  const session = await Auth.currentSession();
  const config = {
    accessKey: credentials.accessKeyId,
    secretKey: credentials.secretAccessKey,
    sessionToken: session.idToken.jwtToken,
    region: AWS.config.region,
    endpoint: clientConfig.endpoint,
  };

  client = sigV4Client.newClient(config);

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




// Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayAmplifySigner, logger: logger });
Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayAmplify, logger: logger });
// Object.assign(Config, { invokeAPIGateway: _invokeAPIGatewayV4Client, logger: logger });

// export default ApiGatewayDefault;
export {
  default as default,
  _invokeAPIGatewayAmplify as invokeAPIGateway
} from './api-gateway';
export * from './api-gateway';