/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

export const Config = {
  invokeAPIGateway: null,
  logger: null
};

const _attachConnectPolicy = async (params, endpoint) => {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_connect',
      method: 'POST',
      body: params || {},
    });
  } catch (error) {
    Config.logger.error(error);
  }
};
export const attachConnectPolicy = _attachConnectPolicy;

const _attachPublicPublishPolicy = async (params, endpoint) => {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_publish',
      method: 'POST',
      body: params || {},
    });
  } catch (error) {
    Config.logger.error(error);
  }
};
export const attachPublicPublishPolicy = _attachPublicPublishPolicy;

const _attachPublicSubscribePolicy = async (params, endpoint) => {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_subscribe',
      method: 'POST',
      body: params || {},
    });
  } catch (error) {
    Config.logger.error(error);
  }
};
export const attachPublicSubscribePolicy = _attachPublicSubscribePolicy;

const _attachPublicReceivePolicy = async (params, endpoint) => {
  try {
    await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/policy/attach_public_receive',
      method: 'POST',
      body: params || {},
    });
  } catch (error) {
    Config.logger.error(error);
  }
};
export const attachPublicReceivePolicy = _attachPublicReceivePolicy;

const _listPolicies = async (params, endpoint) => {
    let result;
    try {
      result = await Config.invokeAPIGateway({
        endpoint: endpoint,
        path: '/policy/list',
        method: 'POST',
        body: params || {},
    });
  } catch (error) {
      Config.logger.error(error);
  }
  return result;
};
export const listPolicies = _listPolicies;

const _listCertificates = async (params, endpoint) => {
    let result={};
    try {
      result = await Config.invokeAPIGateway({
        endpoint: endpoint,
        path: '/cert/list',
        method: 'POST',
        body: params || {},
    });
  } catch (error) {
      Config.logger.error(error);
  }
  return result;
};
export const listCertificates = _listCertificates;

const _describeCertificate = async (params, endpoint) => {
    let result;
    try {
      result = await Config.invokeAPIGateway({
        endpoint: endpoint,
        path: '/cert/describe',
        method: 'POST',
        body: params,
    });
  } catch (error) {
      Config.logger.error(error);
  }
  return result;
};
export const describeCertificate = _describeCertificate;

const _createUser = async (username, endpoint) => {
  let result;
  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/users',
      method: 'POST',
      body: { username },
    });
  } catch (error) {
    Config.logger.error(error);
  }
  return result;
};
export const createUser = _createUser;

const _fetchUser = async (params, endpoint) => {
  let result;

  if(!params) {
    return result;
  }
  try {
    result = await Config.invokeAPIGateway({
      path: `/users/${encodeURIComponent(params.identityId)}`,
      method: 'GET',
    });
  } catch (error) {
    Config.logger.error(error);
  }

  return result;
};
export const fetchUser = _fetchUser;



const _adminGetUser = async (params, endpoint) => {
  let result;

  if(!params) {
    return result;
  }
  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/user/admin_get_user',
      method: 'POST',
      body: { userName: params.userName, userPoolId: params.userPoolId },
    });
  } catch (error) {
    Config.logger.error(error);
  }
  return result;
};
export const adminGetUser = _adminGetUser;



// device
const _attachDevice = async (params, endpoint) => {
  let result;

  if(!params) {
    return result;
  }
  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/device/attach',
      method: 'POST',
      body: { serialNumber: params.serialNumber },
    });
  } catch (error) {
    Config.logger.error(error);
  }
  return result;
};
export const attachDevice = _attachDevice;

const _listDevice = async (params, endpoint) => {
  let result;
  try {
    result = await Config.invokeAPIGateway({
      endpoint: endpoint,
      path: '/device/list',
      method: 'POST',
      body: params || {},
    });
  } catch (error) {
    Config.logger.error(error);
  }
  return result;
};
export const listDevice = _listDevice;

export default class {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  listPolicies = (params) => {
    return _listPolicies(params, this.endpoint);
  }

  listPolicies = (params) => {
    return _listPolicies(params, this.endpoint);
  }

  attachDevice = (params) => {
    return _attachDevice(params, this.endpoint);
  }

  listCertificates = (params) => {
    return _listCertificates(params, this.endpoint);
  }

  describeCertificate = (params) => {
    return _describeCertificate(params, this.endpoint);
  }

  createUser = (params) => {
    return _createUser(params, this.endpoint);
  }

  fetchUser = (params) => {
    return _fetchUser(params, this.endpoint);
  }

  adminGetUser = (params) => {
    return _adminGetUser(params, this.endpoint);
  }

  attachDevice = (params) => {
    return _attachDevice(params, this.endpoint);
  }

  listDevice = (params) => {
    return _listDevice(params, this.endpoint);
  }
}