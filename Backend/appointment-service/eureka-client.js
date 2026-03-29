import { Eureka } from 'eureka-js-client';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const port = process.env.PORT || 5002;

// Fetch the container’s private IP dynamically
const getPrivateIp = async () => {
  try {
    if (process.env.ECS_CONTAINER_METADATA_URI_V4) {
      const resp = await axios.get(`${process.env.ECS_CONTAINER_METADATA_URI_V4}/task`);
      // Pick the first IP from the first network
      return resp.data.Containers[0].Networks[0].IPv4Addresses[0];
    }
  } catch (err) {
    console.error('Failed to get container IP, fallback to localhost', err);
  }
  return '127.0.0.1';
};

const ipAddr = await getPrivateIp();
const hostName = ipAddr; // Use private IP as hostname

const eurekaHost = process.env.EUREKA_HOST || 'eureka-server';
const eurekaPort = process.env.EUREKA_PORT || 8761;

export const eurekaClient = new Eureka({
  instance: {
    app: 'appointment-service',
    hostName,
    ipAddr,
    statusPageUrl: `http://${hostName}:${port}/api/health`,
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'appointment-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

// Auto-start Eureka
eurekaClient.start((error) => {
  console.log('Eureka Registration Complete!', error || '');
});

// Helper for cross-service discovery
export const getServiceUrl = (serviceName) => {
  const instances = eurekaClient.getInstancesByAppId(serviceName);
  if (instances && instances.length > 0) {
    const instance = instances[0];
    return `http://${instance.hostName}:${instance.port.$}`;
  }
  return null;
};